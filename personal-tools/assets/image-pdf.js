(() => {
  "use strict";
  const { $, status, download } = window.Toolbox;
  const images = [];
  const MB = 1024 * 1024;
  let loading = false;
  let job = null;

  function sync() {
    const busy = loading || Boolean(job);
    $("image-count").textContent = `${images.length} ảnh`;
    $("clear-images").disabled = busy || !images.length;
    $("create-pdf").disabled = busy || !images.length;
    $("drop-zone").disabled = $("image-input").disabled = busy;
    $("pdf-options").disabled = busy;
    $("page-orientation").disabled = $("page-size").value === "image";
    $("images-panel").setAttribute("aria-busy", String(busy));
    $("cancel-pdf").hidden = !job;
    $("pdf-progress").hidden = !job;
    $("image-list").querySelectorAll("button").forEach((button) => {
      const index = Number(button.dataset.index);
      button.disabled = busy ||
        (button.dataset.action === "up" && index === 0) ||
        (button.dataset.action === "down" && index === images.length - 1);
    });
  }

  function render() {
    $("image-list").replaceChildren();
    images.forEach((entry, index) => {
      const row = document.createElement("li");
      row.className = "pdf-image-row";
      const preview = document.createElement("img");
      preview.src = entry.thumbnail;
      preview.alt = "";
      const info = document.createElement("div");
      info.className = "pdf-image-info";
      const title = document.createElement("strong");
      title.textContent = entry.file.name;
      title.title = entry.file.name;
      const detail = document.createElement("span");
      detail.textContent = `Trang ${index + 1} · ${entry.width} × ${entry.height} · ${(entry.file.size / MB).toFixed(1)} MB`;
      info.append(title, detail);
      const actions = document.createElement("div");
      actions.className = "pdf-image-actions";
      [["up", "↑", "Đưa lên"], ["down", "↓", "Đưa xuống"], ["remove", "×", "Xóa"]].forEach(([action, text, label]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = text;
        button.dataset.action = action;
        button.dataset.index = index;
        button.setAttribute("aria-label", `${label} ảnh ${index + 1}: ${entry.file.name}`);
        actions.append(button);
      });
      row.append(preview, info, actions);
      $("image-list").append(row);
    });
    sync();
  }

  async function withImage(file, action) {
    const url = URL.createObjectURL(file);
    const image = new Image();
    try {
      image.src = url;
      await image.decode();
      if (!image.naturalWidth || !image.naturalHeight ||
          image.naturalWidth * image.naturalHeight > 40_000_000)
        throw new Error("Ảnh vượt quá 40 triệu pixel hoặc kích thước không hợp lệ.");
      return await action(image);
    } finally {
      image.src = "";
      URL.revokeObjectURL(url);
    }
  }

  function canvasFor(image, maxEdge) {
    const scale = Math.min(1, maxEdge / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Trình duyệt không hỗ trợ xử lý ảnh.");
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  async function addFiles(files) {
    if (loading || job || !files.length) return;
    if (files.length + images.length > 50)
      return status("upload-status", "Tối đa 50 ảnh. Hãy chọn ít ảnh hơn hoặc xóa bớt ảnh trong danh sách.", true);
    loading = true;
    sync();
    status("pdf-status");
    const errors = [];
    let added = 0;
    let total = images.reduce((sum, entry) => sum + entry.file.size, 0);
    try {
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        status("upload-status", `Đang đọc ảnh ${index + 1}/${files.length}…`);
        try {
          if (!/^image\/(png|jpeg|webp|bmp|x-ms-bmp)$/i.test(file.type) &&
              !(!file.type && /\.(png|jpe?g|webp|bmp)$/i.test(file.name)))
            throw new Error("Chỉ nhận PNG, JPG, WebP hoặc BMP.");
          if (file.size > 20 * MB) throw new Error("Ảnh vượt quá 20 MB.");
          if (total + file.size > 100 * MB) throw new Error("Tổng ảnh vượt quá 100 MB.");
          const entry = await withImage(file, (image) => {
            const canvas = canvasFor(image, 120);
            try {
              return { file, width: image.naturalWidth, height: image.naturalHeight, thumbnail: canvas.toDataURL("image/jpeg", 0.75) };
            } finally { canvas.width = canvas.height = 0; }
          });
          images.push(entry);
          total += file.size;
          added++;
        } catch (error) {
          const reason = error instanceof DOMException ? "Không đọc được ảnh. Tệp có thể bị hỏng." : error.message;
          errors.push(`${file.name}: ${reason}`);
        }
      }
      status("upload-status", [`Đã thêm ${added} ảnh.`, ...errors].join(" "), Boolean(errors.length));
    } finally {
      loading = false;
      render();
    }
  }

  async function jpegBytes(file, quality) {
    return withImage(file, async (image) => {
      const canvas = canvasFor(image, 3200);
      try {
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
        if (!blob) throw new Error("Không chuyển được ảnh sang PDF.");
        return { bytes: new Uint8Array(await blob.arrayBuffer()), width: canvas.width, height: canvas.height };
      } finally { canvas.width = canvas.height = 0; }
    });
  }

  async function createPdf() {
    if (loading || job || !images.length) return;
    if (!window.PDFLib)
      return status("pdf-status", "Không tải được thư viện PDF. Hãy tải lại trang và thử lại.", true);
    const current = { cancelled: false };
    job = current;
    $("cancel-pdf").disabled = false;
    sync();
    $("pdf-progress").value = 0;
    const size = $("page-size").value;
    const orientation = $("page-orientation").value;
    const margin = Number($("page-margin").value) * 72 / 25.4;
    const quality = Number($("image-quality").value);
    const name = ($("pdf-name").value.trim().replace(/[<>:"/\\|?*\x00-\x1f]/g, "-").replace(/\.pdf$/i, "").replace(/[. ]+$/g, "") || "anh-da-gom") + ".pdf";
    try {
      const pdf = await PDFLib.PDFDocument.create();
      pdf.setCreator("Personal Tools");
      for (let index = 0; index < images.length; index++) {
        if (current.cancelled) return;
        status("pdf-status", `Đang tạo trang ${index + 1}/${images.length}…`);
        await new Promise((resolve) => setTimeout(resolve, 0));
        if (current.cancelled) return;
        const jpeg = await jpegBytes(images[index].file, quality);
        if (current.cancelled) return;
        let width, height;
        if (size === "image") {
          width = jpeg.width * 0.75 + margin * 2;
          height = jpeg.height * 0.75 + margin * 2;
        } else {
          [width, height] = size === "letter" ? [612, 792] : [595.28, 841.89];
          if (orientation === "landscape" || (orientation === "auto" && jpeg.width > jpeg.height))
            [width, height] = [height, width];
        }
        const scale = Math.min((width - 2 * margin) / jpeg.width, (height - 2 * margin) / jpeg.height);
        const imageWidth = jpeg.width * scale;
        const imageHeight = jpeg.height * scale;
        const embedded = await pdf.embedJpg(jpeg.bytes);
        const page = pdf.addPage([width, height]);
        page.drawImage(embedded, { x: (width - imageWidth) / 2, y: (height - imageHeight) / 2, width: imageWidth, height: imageHeight });
        $("pdf-progress").value = Math.round((index + 1) / images.length * 90);
      }
      if (current.cancelled) return;
      status("pdf-status", "Đang hoàn tất file PDF…");
      const bytes = await pdf.save();
      if (current.cancelled) return;
      download(bytes, name, "application/pdf");
      $("pdf-progress").value = 100;
      status("pdf-status", `Đã tạo PDF ${images.length} trang · ${(bytes.length / MB).toFixed(2)} MB. File đã sẵn sàng tải xuống.`);
    } catch {
      if (!current.cancelled)
        status("pdf-status", "Không tạo được PDF. Thử giảm số ảnh hoặc chọn chất lượng Cân bằng.", true);
    } finally {
      job = null;
      sync();
    }
  }

  $("drop-zone").addEventListener("click", () => $("image-input").click());
  $("image-input").addEventListener("change", () => {
    const files = Array.from($("image-input").files);
    $("image-input").value = "";
    addFiles(files);
  });
  $("drop-zone").addEventListener("dragover", (event) => {
    event.preventDefault();
    if (!loading && !job) $("drop-zone").classList.add("drag-over");
  });
  $("drop-zone").addEventListener("dragleave", () => $("drop-zone").classList.remove("drag-over"));
  $("drop-zone").addEventListener("drop", (event) => {
    event.preventDefault();
    $("drop-zone").classList.remove("drag-over");
    addFiles(Array.from(event.dataTransfer.files));
  });
  ["dragover", "drop"].forEach((type) => document.addEventListener(type, (event) => {
    if (Array.from(event.dataTransfer?.types || []).includes("Files")) event.preventDefault();
  }));
  $("image-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");
    if (!button || loading || job || button.disabled) return;
    const index = Number(button.dataset.index);
    const action = button.dataset.action;
    const next = action === "up" ? index - 1 : index + 1;
    if (action === "remove") images.splice(index, 1);
    else [images[index], images[next]] = [images[next], images[index]];
    status("pdf-status");
    status("upload-status", action === "remove" ? "Đã xóa ảnh khỏi danh sách." : "Đã cập nhật thứ tự trang.");
    render();
    const focusIndex = action === "remove" ? Math.min(index, images.length - 1) : next;
    const row = $("image-list").children[focusIndex];
    const target = row?.querySelector(`button[data-action="${action}"]:not(:disabled)`) || row?.querySelector("button:not(:disabled)");
    (target || $("drop-zone")).focus();
  });
  $("clear-images").addEventListener("click", () => {
    if (loading || job) return;
    images.length = 0;
    status("upload-status");
    status("pdf-status");
    render();
    $("drop-zone").focus();
  });
  $("page-size").addEventListener("change", sync);
  $("pdf-options").addEventListener("input", () => status("pdf-status"));
  $("create-pdf").addEventListener("click", createPdf);
  $("cancel-pdf").addEventListener("click", () => {
    if (!job) return;
    job.cancelled = true;
    status("pdf-status", "Đã hủy tạo PDF. Danh sách ảnh được giữ lại.");
    $("cancel-pdf").disabled = true;
  });
  sync();
})();
