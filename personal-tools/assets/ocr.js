(() => {
  "use strict";
  const { $, status, imageUpload, copy, download } = window.Toolbox;
  let imageRevision = 0;
  let hasImage = false;
  let job = null;

  function syncOutput() {
    const length = $("ocr-output").value.length;
    $("text-count").textContent = `${length.toLocaleString("vi-VN")} ký tự`;
    $("copy-output").disabled = $("download-output").disabled = !length;
  }
  function clearOutput() {
    $("ocr-output").value = "";
    syncOutput();
  }
  function idle() {
    $("recognize").disabled = !hasImage;
    $("cancel-ocr").hidden = true;
    $("ocr-progress").hidden = true;
    $("ocr-result-panel").setAttribute("aria-busy", "false");
  }
  function cancel(message = "") {
    if (job) {
      job.cancelled = true;
      job.worker?.terminate().catch(() => {});
      job = null;
    }
    idle();
    status("ocr-status", message);
  }
  function clearImage() {
    imageRevision++;
    cancel();
    hasImage = false;
    $("image-preview").hidden = true;
    $("file-name").textContent = "";
    $("image-canvas").width = $("image-canvas").height = 0;
    clearOutput();
    idle();
  }
  async function loadImage(file) {
    clearImage();
    const revision = imageRevision;
    if (
      !/^image\/(png|jpeg|webp|bmp|x-ms-bmp)$/i.test(file.type) &&
      !(!file.type && /\.(png|jpe?g|webp|bmp)$/i.test(file.name))
    )
      return status(
        "ocr-status",
        "Hãy chọn ảnh PNG, JPG, WebP hoặc BMP.",
        true,
      );
    if (file.size > 20 * 1024 * 1024)
      return status("ocr-status", "Ảnh vượt quá 20 MB.", true);
    let url;
    try {
      url = URL.createObjectURL(file);
      const image = new Image();
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = url;
      });
      if (revision !== imageRevision) return;
      if (
        !image.naturalWidth ||
        image.naturalWidth * image.naturalHeight > 40_000_000
      )
        return status(
          "ocr-status",
          "Ảnh quá lớn. Hãy cắt ảnh hoặc giảm kích thước.",
          true,
        );
      const scale = Math.min(
        1,
        3200 / Math.max(image.naturalWidth, image.naturalHeight),
      );
      const canvas = $("image-canvas");
      canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
      canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
      const context = canvas.getContext("2d");
      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      $("file-name").textContent = file.name || "Ảnh từ clipboard";
      $("image-preview").hidden = false;
      hasImage = true;
      idle();
    } catch {
      if (revision === imageRevision)
        status("ocr-status", "Không đọc được ảnh này.", true);
    } finally {
      if (url) URL.revokeObjectURL(url);
    }
  }
  async function recognize() {
    if (!hasImage || job) return;
    if (location.protocol === "file:")
      return status(
        "ocr-status",
        "OCR cần mở qua localhost hoặc website (HTTP/HTTPS).",
        true,
      );
    if (!window.Tesseract || typeof WebAssembly === "undefined")
      return status(
        "ocr-status",
        "Không tải được OCR hoặc trình duyệt chưa hỗ trợ WebAssembly.",
        true,
      );
    clearOutput();
    const current = { cancelled: false, worker: null };
    job = current;
    $("recognize").disabled = true;
    $("cancel-ocr").hidden = false;
    $("ocr-progress").value = 0;
    $("ocr-progress").hidden = false;
    $("ocr-result-panel").setAttribute("aria-busy", "true");
    status("ocr-status", "Đang khởi tạo OCR…");
    const local = (path) =>
      new URL(`../assets/vendor/${path}`, location.href).href;
    try {
      const worker = await window.Tesseract.createWorker(
        $("ocr-language").value,
        1,
        {
          workerPath: local("tesseract/worker.min.js"),
          corePath: local("tesseract"),
          langPath: local("tessdata"),
          workerBlobURL: false,
          cacheMethod: "none",
          logger: (event) => {
            if (current.cancelled || job !== current) return;
            if (event.status === "recognizing text") {
              const progress = Math.round(event.progress * 100);
              $("ocr-progress").value = progress;
              status("ocr-status", `Đang nhận dạng… ${progress}%`);
            }
          },
          errorHandler: () => {
            if (current.cancelled || job !== current) return;
            current.cancelled = true;
            current.worker?.terminate().catch(() => {});
            job = null;
            idle();
            status(
              "ocr-status",
              "Không khởi tạo được OCR. Hãy tải lại trang và thử lại.",
              true,
            );
          },
        },
      );
      current.worker = worker;
      if (current.cancelled || job !== current) {
        await worker.terminate();
        return;
      }
      await worker.setParameters({
        preserve_interword_spaces: "1",
        user_defined_dpi: "300",
      });
      const result = await worker.recognize($("image-canvas"));
      if (current.cancelled || job !== current) return;
      $("ocr-output").value = result.data.text.trim();
      syncOutput();
      status(
        "ocr-status",
        result.data.text.trim()
          ? "Đã trích xuất."
          : "Không tìm thấy văn bản. Thử ảnh rõ nét hơn.",
      );
    } catch {
      if (!current.cancelled && job === current)
        status("ocr-status", "Không nhận dạng được ảnh. Hãy thử lại.", true);
    } finally {
      if (current.worker) await current.worker.terminate().catch(() => {});
      if (job === current) {
        job = null;
        idle();
      }
    }
  }
  imageUpload($("image-input"), $("drop-zone"), loadImage);
  $("clear-image").addEventListener("click", clearImage);
  $("recognize").addEventListener("click", recognize);
  $("cancel-ocr").addEventListener("click", () => cancel("Đã hủy."));
  $("ocr-language").addEventListener("change", () => {
    cancel();
    clearOutput();
  });
  $("ocr-output").addEventListener("input", syncOutput);
  $("copy-output").addEventListener("click", () =>
    copy($("ocr-output"), "ocr-status"),
  );
  $("download-output").addEventListener("click", () =>
    download($("ocr-output").value, "recognized.txt"),
  );
  window.addEventListener("pagehide", () => cancel());
})();
