/* QR tools: no network requests, storage, or automatic navigation. */
(() => {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const tabs = [$("read-tab"), $("create-tab")];
  const input = $("image-input");
  const dropZone = $("drop-zone");
  let scanId = 0;
  let cancelDecode = () => {};
  let generated = false;

  function status(id, message = "", error = false) {
    $(id).textContent = message;
    $(id).classList.toggle("error", error);
  }

  function activateTab(tab) {
    for (const item of tabs) {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
      $(item.getAttribute("aria-controls")).hidden = !selected;
    }
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateTab(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight" || event.key === "ArrowLeft")
        next = tabs[1 - index];
      if (event.key === "Home") next = tabs[0];
      if (event.key === "End") next = tabs[1];
      if (!next) return;
      event.preventDefault();
      activateTab(next);
      next.focus();
    });
  });

  if (/Mac|iPhone|iPad/.test(navigator.platform))
    $("paste-shortcut").textContent = "⌘ + V";

  function clearReadResult() {
    $("read-result").hidden = true;
    $("read-empty").hidden = false;
    $("decoded-text").value = "";
    $("open-link").hidden = true;
    $("open-link").removeAttribute("href");
  }

  function resetRead() {
    scanId++;
    cancelDecode();
    clearReadResult();
    input.value = "";
    $("image-preview").hidden = true;
    $("preview-canvas").width = 0;
    $("preview-canvas").height = 0;
    $("file-name").textContent = "";
    $("read-result-panel").setAttribute("aria-busy", "false");
    status("read-status");
  }

  // Workers keep QR detection from blocking the interface. The local fallback
  // also allows opening index.html directly in browsers that restrict file workers.
  async function decodePixels(pixels, id) {
    if (typeof Worker !== "undefined") {
      try {
        return await new Promise((resolve, reject) => {
          const worker = new Worker("../assets/qr-worker.js");
          const cleanup = () => {
            worker.terminate();
            cancelDecode = () => {};
          };
          cancelDecode = () => {
            cleanup();
            reject(new Error("cancelled"));
          };
          worker.onmessage = ({ data }) => {
            cleanup();
            if (data.error) reject(new Error(data.error));
            else resolve(data.result);
          };
          worker.onerror = (event) => {
            event.preventDefault();
            cleanup();
            reject(new Error("worker unavailable"));
          };
          // Copy the buffer so the fallback still has pixels after transfer.
          const buffer = pixels.data.slice().buffer;
          worker.postMessage(
            { buffer, width: pixels.width, height: pixels.height },
            [buffer],
          );
        });
      } catch {
        if (id !== scanId) return null;
      }
    }
    await new Promise((resolve) => requestAnimationFrame(resolve));
    if (id !== scanId) return null;
    const result = window.jsQR(pixels.data, pixels.width, pixels.height, {
      inversionAttempts: "attemptBoth",
    });
    return result ? { data: result.data } : null;
  }

  function showReadResult(text) {
    $("decoded-text").value = text;
    $("result-type").textContent = "VĂN BẢN";
    try {
      const url = new URL(text);
      if (url.protocol === "https:" || url.protocol === "http:") {
        $("open-link").href = url.href;
        $("open-link").hidden = false;
        $("result-type").textContent = "ĐƯỜNG DẪN";
      }
    } catch {
      /* Other QR payloads remain plain text. */
    }
    $("read-empty").hidden = true;
    $("read-result").hidden = false;
    status("read-status", "Đã đọc được mã QR.");
  }

  async function readFile(file) {
    resetRead();
    const id = scanId;
    if (!file) return;
    const allowed =
      /^image\/(png|jpeg|webp|gif|bmp|x-ms-bmp)$/i.test(file.type) ||
      (!file.type && /\.(png|jpe?g|webp|gif|bmp)$/i.test(file.name));
    if (!allowed)
      return status(
        "read-status",
        "Hãy chọn ảnh PNG, JPG, WebP, GIF hoặc BMP.",
        true,
      );
    if (file.size > 20 * 1024 * 1024)
      return status(
        "read-status",
        "Ảnh vượt quá 20 MB. Hãy chọn ảnh nhỏ hơn.",
        true,
      );
    if (typeof window.jsQR !== "function")
      return status(
        "read-status",
        "Không tải được thư viện đọc QR. Hãy tải lại trang.",
        true,
      );

    $("read-result-panel").setAttribute("aria-busy", "true");
    status("read-status", "Đang tìm mã QR trong ảnh…");
    let imageUrl;
    try {
      imageUrl = URL.createObjectURL(file);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = imageUrl;
      });
      if (id !== scanId) return;
      if (
        !image.naturalWidth ||
        image.naturalWidth * image.naturalHeight > 40_000_000
      ) {
        status(
          "read-status",
          "Ảnh có kích thước quá lớn. Hãy cắt ảnh gần mã QR rồi thử lại.",
          true,
        );
        return;
      }
      const preview = $("preview-canvas");
      const previewScale = Math.min(
        1,
        800 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      preview.width = Math.max(
        1,
        Math.round(image.naturalWidth * previewScale),
      );
      preview.height = Math.max(
        1,
        Math.round(image.naturalHeight * previewScale),
      );
      preview
        .getContext("2d")
        .drawImage(image, 0, 0, preview.width, preview.height);
      $("file-name").textContent = file.name || "Ảnh từ clipboard";
      $("image-preview").hidden = false;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d", { willReadFrequently: true });
      const longest = Math.max(image.naturalWidth, image.naturalHeight);
      const limits =
        longest > 1600 ? [1600, Math.min(longest, 2600)] : [longest];
      for (const limit of limits) {
        const scale = Math.min(1, limit / longest);
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        const result = await decodePixels(
          context.getImageData(0, 0, canvas.width, canvas.height),
          id,
        );
        if (id !== scanId) return;
        if (result) {
          showReadResult(result.data);
          return;
        }
      }
      status(
        "read-status",
        "Không tìm thấy mã QR. Thử ảnh rõ hơn hoặc cắt ảnh gần mã QR.",
        true,
      );
    } catch {
      if (id === scanId)
        status(
          "read-status",
          "Không đọc được ảnh này. Hãy chọn một ảnh khác.",
          true,
        );
    } finally {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (id === scanId)
        $("read-result-panel").setAttribute("aria-busy", "false");
    }
  }

  dropZone.addEventListener("click", () => input.click());
  input.addEventListener("change", () => readFile(input.files[0]));
  $("clear-image").addEventListener("click", () => {
    resetRead();
    dropZone.focus();
  });
  dropZone.addEventListener("dragover", (event) => {
    event.preventDefault();
    dropZone.classList.add("drag-over");
  });
  dropZone.addEventListener("dragleave", () =>
    dropZone.classList.remove("drag-over"),
  );
  dropZone.addEventListener("drop", (event) => {
    event.preventDefault();
    dropZone.classList.remove("drag-over");
    readFile(event.dataTransfer.files[0]);
  });
  // Prevent a dropped file outside the upload area from navigating away.
  ["dragover", "drop"].forEach((name) =>
    document.addEventListener(name, (event) => {
      if (Array.from(event.dataTransfer?.types || []).includes("Files"))
        event.preventDefault();
    }),
  );
  document.addEventListener("paste", (event) => {
    if ($("read-panel").hidden) return;
    const item = Array.from(event.clipboardData?.items || []).find((entry) =>
      entry.type.startsWith("image/"),
    );
    if (!item) return;
    event.preventDefault();
    readFile(item.getAsFile());
  });

  $("copy-result").addEventListener("click", async () => {
    const text = $("decoded-text").value;
    const id = scanId;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(text);
      if (id === scanId) status("read-status", "Đã sao chép nội dung.");
    } catch {
      if (id !== scanId) return;
      $("decoded-text").focus();
      $("decoded-text").select();
      try {
        if (!document.execCommand("copy")) throw new Error("copy unavailable");
        status("read-status", "Đã sao chép nội dung.");
      } catch {
        status(
          "read-status",
          "Nội dung đã được chọn. Nhấn Ctrl/Cmd + C để sao chép.",
          true,
        );
      }
    }
  });

  function clearGenerated() {
    generated = false;
    $("create-result").hidden = true;
    $("create-empty").hidden = false;
    $("generated-canvas").width = 0;
    $("generated-canvas").height = 0;
    status("create-status");
  }

  // Invalidate the preview when inputs change, so a download always matches it.
  $("qr-content").addEventListener("input", clearGenerated);
  $("qr-size").addEventListener("change", clearGenerated);
  $("qr-level").addEventListener("change", clearGenerated);

  $("create-form").addEventListener("submit", (event) => {
    event.preventDefault();
    clearGenerated();
    const text = $("qr-content").value;
    if (!text.trim())
      return status(
        "create-status",
        "Hãy nhập đường dẫn hoặc văn bản cần tạo mã.",
        true,
      );
    if (typeof window.qrcode !== "function")
      return status(
        "create-status",
        "Không tải được thư viện tạo QR. Hãy tải lại trang.",
        true,
      );
    const bytes = new TextEncoder().encode(text);
    if (bytes.length > 2331)
      return status(
        "create-status",
        "Nội dung quá dài. Hãy rút ngắn văn bản hoặc đường dẫn.",
        true,
      );
    try {
      // The generator defaults to single-byte encoding. Explicit UTF-8 preserves
      // Vietnamese, emoji, and supplementary Unicode characters.
      window.qrcode.stringToBytes = (value) =>
        Array.from(new TextEncoder().encode(value));
      const qr = window.qrcode(0, $("qr-level").value);
      qr.addData(text, "Byte");
      qr.make();
      const size = Number($("qr-size").value);
      const count = qr.getModuleCount();
      const cell = Math.floor(size / (count + 8));
      const offset = Math.floor((size - count * cell) / 2);
      const canvas = $("generated-canvas");
      canvas.width = size;
      canvas.height = size;
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, size, size);
      context.fillStyle = "#172c21";
      for (let row = 0; row < count; row++) {
        for (let col = 0; col < count; col++) {
          if (qr.isDark(row, col))
            context.fillRect(
              offset + col * cell,
              offset + row * cell,
              cell,
              cell,
            );
        }
      }
      generated = true;
      $("generated-info").textContent =
        `${size} × ${size} px · PNG · Sửa lỗi ${$("qr-level").value}`;
      $("create-empty").hidden = true;
      $("create-result").hidden = false;
      status("create-status", "Đã tạo mã QR.");
    } catch {
      status(
        "create-status",
        "Nội dung quá dài với mức sửa lỗi này. Hãy rút ngắn hoặc chọn mức thấp hơn.",
        true,
      );
    }
  });

  $("download-qr").addEventListener("click", () => {
    if (!generated) return;
    const link = document.createElement("a");
    link.download = "personal-tools-qr.png";
    link.href = $("generated-canvas").toDataURL("image/png");
    document.body.append(link);
    link.click();
    link.remove();
  });

  window.addEventListener("pagehide", () => cancelDecode());
})();
