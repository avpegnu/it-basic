/* Optional same-origin URL resolver. No network request until the user clicks. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  let source = null;
  let job = null;

  function httpUrl(value) {
    try {
      const url = new URL(value);
      if (!["https:", "http:"].includes(url.protocol) || url.username || url.password)
        throw new Error();
      return url.href;
    } catch { throw new Error("URL không hợp lệ. Chỉ hỗ trợ HTTP/HTTPS không chứa thông tin đăng nhập."); }
  }
  function status(message = "", error = false) {
    $("expand-status").textContent = message;
    $("expand-status").classList.toggle("error", error);
  }
  function clearResult() {
    $("expand-result").hidden = true;
    $("expanded-url").value = "";
    $("open-expanded").removeAttribute("href");
    $("redirect-hops").replaceChildren();
  }
  function idle() {
    $("expand-url").disabled = false;
    $("cancel-expand").hidden = true;
    $("expand-section").setAttribute("aria-busy", "false");
  }
  function cancel() {
    if (job) {
      clearTimeout(job.timer);
      job.controller.abort();
      job = null;
    }
    idle();
  }
  document.addEventListener("qr-content-changed", (event) => {
    cancel();
    clearResult();
    status();
    source = null;
    try { source = httpUrl(event.detail); } catch { /* Plain-text QR. */ }
    $("expand-section").hidden = !source;
  });
  $("cancel-expand").addEventListener("click", () => {
    cancel();
    status("Đã hủy tra cứu.");
  });
  $("expand-url").addEventListener("click", async () => {
    if (!source || job) return;
    clearResult();
    if (location.protocol === "file:")
      return status("Tra link cần mở trang qua website có API tra cứu. Đọc và tạo QR vẫn dùng được tại máy.", true);
    const current = { controller: new AbortController(), timer: null };
    job = current;
    current.timer = setTimeout(() => current.controller.abort(), 15000);
    $("expand-url").disabled = true;
    $("cancel-expand").hidden = false;
    $("expand-section").setAttribute("aria-busy", "true");
    status("Đang kiểm tra chuyển hướng…");
    try {
      const response = await fetch("/api/expand-url", {
        method: "POST",
        credentials: "omit",
        cache: "no-store",
        redirect: "error",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: source }),
        signal: current.controller.signal,
      });
      if (job !== current) return;
      if (response.status === 404 || !response.headers.get("content-type")?.includes("application/json"))
        throw new Error("API tra link chưa được bật trên website này. Đọc và tạo QR vẫn hoạt động bình thường.");
      let result;
      try { result = await response.json(); }
      catch { throw new Error("API trả kết quả không hợp lệ."); }
      if (job !== current) return;
      if (!response.ok) throw new Error(result.error || "Không tra được link đích.");
      const finalUrl = httpUrl(result.finalUrl);
      if (!Array.isArray(result.hops) || !result.hops.length || result.hops.length > 9)
        throw new Error("API trả kết quả không hợp lệ.");
      const hops = result.hops.map((hop) => ({ url: httpUrl(hop.url), status: Number(hop.status) }));
      if (hops.some((hop) => !Number.isInteger(hop.status) || hop.status < 100 || hop.status > 599) ||
          finalUrl !== hops[hops.length - 1].url)
        throw new Error("API trả kết quả không hợp lệ.");
      $("expanded-url").value = finalUrl;
      $("open-expanded").href = finalUrl;
      for (const hop of hops) {
        const item = document.createElement("li");
        item.textContent = `HTTP ${hop.status} · ${hop.url}`;
        $("redirect-hops").append(item);
      }
      $("expand-result").hidden = false;
      status(hops.length > 1 ? `Đã theo ${hops.length - 1} bước chuyển hướng HTTP.` : "URL không trả chuyển hướng HTTP.");
    } catch (error) {
      if (job === current)
        status(current.controller.signal.aborted ? "Tra cứu quá thời gian chờ. Hãy thử lại." : error.message, true);
    } finally {
      clearTimeout(current.timer);
      if (job === current) { job = null; idle(); }
    }
  });
  $("copy-expanded").addEventListener("click", async () => {
    const value = $("expanded-url").value;
    const previousSource = source;
    try {
      await navigator.clipboard.writeText(value);
      if (previousSource === source && value === $("expanded-url").value) status("Đã sao chép link đích.");
    } catch {
      if (value !== $("expanded-url").value) return;
      $("expanded-url").focus();
      $("expanded-url").select();
      status("Nhấn Ctrl/Cmd + C để sao chép link đích đã chọn.");
    }
  });
})();
