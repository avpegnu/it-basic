(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  function status(id, message = "", error = false) {
    $(id).textContent = message;
    $(id).classList.toggle("error", error);
  }
  function download(text, name, type = "text/plain;charset=utf-8") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  async function copy(field, statusId) {
    const value = field.value;
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("clipboard unavailable");
      await navigator.clipboard.writeText(value);
      status(statusId, "Đã sao chép.");
    } catch {
      field.focus();
      field.select();
      try {
        if (!document.execCommand("copy")) throw new Error("copy failed");
        status(statusId, "Đã sao chép.");
      } catch {
        status(
          statusId,
          "Nhấn Ctrl/Cmd + C để sao chép nội dung đã chọn.",
          true,
        );
      }
    }
  }
  function imageUpload(input, zone, onFile) {
    zone.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      const file = input.files[0];
      input.value = "";
      if (file) onFile(file);
    });
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("drag-over");
    });
    zone.addEventListener("dragleave", () =>
      zone.classList.remove("drag-over"),
    );
    zone.addEventListener("drop", (event) => {
      event.preventDefault();
      zone.classList.remove("drag-over");
      if (event.dataTransfer.files[0]) onFile(event.dataTransfer.files[0]);
    });
    ["dragover", "drop"].forEach((type) =>
      document.addEventListener(type, (event) => {
        if (Array.from(event.dataTransfer?.types || []).includes("Files"))
          event.preventDefault();
      }),
    );
    document.addEventListener("paste", (event) => {
      const item = Array.from(event.clipboardData?.items || []).find((entry) =>
        entry.type.startsWith("image/"),
      );
      if (!item) return;
      event.preventDefault();
      const file = item.getAsFile();
      if (file) onFile(file);
    });
    if (/Mac|iPhone|iPad/.test(navigator.platform) && $("paste-shortcut"))
      $("paste-shortcut").textContent = "⌘ + V";
  }
  function textFile(input, onText, statusId) {
    let readId = 0;
    input.addEventListener("change", async () => {
      const id = ++readId;
      const file = input.files[0];
      input.value = "";
      if (!file) return;
      if (file.size > 2 * 1024 * 1024)
        return status(statusId, "Tệp vượt quá 2 MB.", true);
      try {
        const buffer = await file.arrayBuffer();
        const text = new TextDecoder("utf-8", { fatal: true }).decode(buffer);
        if (id === readId) onText(text, file.name);
      } catch {
        if (id === readId)
          status(statusId, "Không đọc được tệp UTF-8 này.", true);
      }
    });
  }
  function shortcut(field, action) {
    field.addEventListener("keydown", (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "Enter") {
        event.preventDefault();
        action();
      }
    });
  }
  window.Toolbox = Object.freeze({
    $,
    status,
    download,
    copy,
    imageUpload,
    textFile,
    shortcut,
  });
})();
