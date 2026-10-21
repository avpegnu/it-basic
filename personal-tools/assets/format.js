(() => {
  "use strict";
  const { $, status, copy, download, textFile, shortcut } = window.Toolbox;
  const data = window.ToolData;
  const tabs = [$("preview-tab"), $("source-tab")];
  let revision = 0;
  let valid = false;
  let selectedView = "preview";

  function view(name, focus = false) {
    selectedView = name;
    tabs.forEach((tab) => {
      const active = tab.id === `${name}-tab`;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
      $(tab.getAttribute("aria-controls")).hidden = !active;
      if (focus && active) tab.focus();
    });
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => view(index ? "source" : "preview"));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      view(
        event.key === "Home"
          ? "preview"
          : event.key === "End"
            ? "source"
            : index
              ? "preview"
              : "source",
        true,
      );
    });
  });
  function invalidate() {
    revision++;
    valid = false;
    $("format-output").value = "";
    $("preview-view").replaceChildren();
    const empty = document.createElement("p");
    empty.className = "preview-placeholder";
    empty.textContent = "Chưa có dữ liệu";
    $("preview-view").append(empty);
    $("copy-output").disabled = $("download-output").disabled = true;
    $("format-result-panel").setAttribute("aria-busy", "false");
    status("format-status");
  }
  function tree(value) {
    let count = 0;
    function node(value, key, depth) {
      count++;
      const primitive =
        value === null ||
        typeof value !== "object" ||
        window.LosslessJSON.isLosslessNumber(value);
      const label = document.createElement("span");
      if (key !== null) {
        const keyElement = document.createElement("span");
        keyElement.className = "tree-key";
        keyElement.textContent = `${key}: `;
        label.append(keyElement);
      }
      if (primitive) {
        const span = document.createElement("span");
        span.className = `tree-${value === null ? "null" : window.LosslessJSON.isLosslessNumber(value) ? "number" : typeof value}`;
        span.textContent = data.stringifyJSON(value, 0);
        label.append(span);
        const line = document.createElement("div");
        line.className = "tree-leaf";
        line.append(label);
        return line;
      }
      const entries = Object.entries(value);
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      const type = document.createElement("span");
      type.className = "tree-type";
      type.textContent = Array.isArray(value)
        ? `Array (${entries.length})`
        : `Object (${entries.length})`;
      label.append(type);
      summary.append(label);
      details.append(summary);
      let loaded = false;
      function expand() {
        if (loaded || !details.open) return;
        loaded = true;
        const children = document.createElement("div");
        children.className = "tree-children";
        let visible = 0;
        for (const [key, item] of entries) {
          if (visible >= 200 || count >= 2500 || depth >= 40) break;
          children.append(node(item, key, depth + 1));
          visible++;
        }
        if (visible < entries.length) {
          const more = document.createElement("p");
          more.className = "field-help";
          more.textContent = "Đã giới hạn cây xem trước. Xem đầy đủ ở tab Mã.";
          children.append(more);
        }
        details.append(children);
      }
      details.addEventListener("toggle", expand);
      if (depth < 2) {
        details.open = true;
        expand();
      }
      return details;
    }
    const container = document.createElement("div");
    container.className = "json-tree";
    container.append(node(value, null, 0));
    return container;
  }

  function documentPreview(html) {
    const fragment = window.DOMPurify.sanitize(html, {
      RETURN_DOM_FRAGMENT: true,
      USE_PROFILES: { html: true },
      FORBID_TAGS: [
        "style",
        "form",
        "input",
        "button",
        "textarea",
        "select",
        "iframe",
        "object",
        "embed",
        "link",
        "meta",
        "base",
      ],
      FORBID_ATTR: [
        "srcset",
        "autofocus",
        "id",
        "name",
        "target",
        "formaction",
      ],
    });
    fragment
      .querySelectorAll("a")
      .forEach((link) => link.removeAttribute("href"));
    fragment.querySelectorAll("img").forEach((image) => {
      if (
        !/^data:image\/(png|jpeg|webp|gif|avif);base64,/i.test(
          image.getAttribute("src") || "",
        )
      )
        image.removeAttribute("src");
    });
    const wrapper = document.createElement("div");
    wrapper.append(fragment);
    const frame = document.createElement("iframe");
    frame.title = "Xem trước nội dung";
    frame.setAttribute("sandbox", "");
    frame.referrerPolicy = "no-referrer";
    frame.className = "document-preview";
    frame.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><style>body{font:14px/1.8 system-ui,sans-serif;color:#222d28;margin:20px;overflow-wrap:anywhere}h1,h2,h3{line-height:1.4}h1{font-size:26px}h2{font-size:21px}pre{background:#f3f5f0;padding:14px;border-radius:6px;white-space:pre-wrap}code{font:12px/1.7 ui-monospace,monospace}blockquote{border-left:3px solid #245b45;margin-left:0;padding-left:16px;color:#69736d}table{border-collapse:collapse;display:block;overflow:auto}td,th{border:1px solid #dfe5db;padding:7px 12px}img{max-width:100%}a{color:#245b45}</style></head><body>${wrapper.innerHTML}</body></html>`;
    return frame;
  }

  async function format(minify = false) {
    invalidate();
    const id = revision;
    const source = $("format-input").value;
    if (!source.trim())
      return status("format-status", "Chưa có dữ liệu đầu vào.", true);
    if (new TextEncoder().encode(source).length > 1024 * 1024)
      return status("format-status", "Dữ liệu vượt quá 1 MB.", true);
    $("format-result-panel").setAttribute("aria-busy", "true");
    const type = $("format-type").value;
    try {
      const indent = $("indent-size").value;
      let output, preview;
      if (type === "json") {
        const parsed = data.parseJSON(source);
        output = data.stringifyJSON(
          parsed,
          minify ? 0 : indent === "tab" ? "\t" : Number(indent),
        );
        preview = tree(parsed);
      } else {
        const parsed = type === "yaml" ? data.parseYAML(source) : null;
        output = await window.prettier.format(source, {
          parser: type,
          plugins: Object.values(window.prettierPlugins),
          tabWidth: indent === "tab" ? 2 : Number(indent),
          useTabs: indent === "tab",
          embeddedLanguageFormatting: "off",
          proseWrap: "preserve",
        });
        if (id !== revision) return;
        if (type === "markdown")
          preview = documentPreview(window.marked.parse(output));
        else if (type === "html") preview = documentPreview(output);
        else if (type === "yaml") preview = tree(parsed);
        else {
          preview = document.createElement("pre");
          preview.className = "code-preview";
          preview.textContent = output;
        }
      }
      if (id !== revision) return;
      $("format-output").value = output;
      $("preview-view").replaceChildren(preview);
      $("copy-output").disabled = $("download-output").disabled = false;
      valid = true;
      if (minify) view("source");
      else view(selectedView);
      status("format-status", minify ? "Đã minify JSON." : "Đã định dạng.");
    } catch (error) {
      if (id === revision) status("format-status", error.message, true);
    } finally {
      if (id === revision)
        $("format-result-panel").setAttribute("aria-busy", "false");
    }
  }
  function modeChanged() {
    $("minify-data").hidden = $("format-type").value !== "json";
    invalidate();
  }
  $("format-type").addEventListener("change", modeChanged);
  $("indent-size").addEventListener("change", invalidate);
  $("format-input").addEventListener("input", invalidate);
  $("format-data").addEventListener("click", () => format());
  $("minify-data").addEventListener("click", () => format(true));
  $("clear-data").addEventListener("click", () => {
    $("format-input").value = "";
    invalidate();
    $("format-input").focus();
  });
  $("load-sample").addEventListener("click", () => {
    const samples = {
      json: '{"name":"Personal Tools","version":1,"active":true,"tools":["QR","OCR","Format"],"settings":{"language":"vi","theme":"light"}}',
      markdown:
        '# Personal Tools\n\n## Công cụ\n\n- **QR**: đọc và tạo mã\n- **OCR**: ảnh → văn bản\n\n| Định dạng | Preview |\n| --- | --- |\n| JSON | Cây dữ liệu |\n| Markdown | Văn bản |\n\n```json\n{"hello":"Xin chào"}\n```\n',
      yaml: "name: Personal Tools\nversion: 1\nactive: true\ntools:\n - QR\n - OCR\n - Format\n",
      html: "<article><h1>Xin chào!</h1><p>Đây là <strong>HTML preview</strong>.</p><ul><li>QR</li><li>OCR</li></ul></article>",
      css: ".card{display:flex;gap:16px;padding:24px;background:#fff;border-radius:12px}.card h2{font-size:24px;color:#245b45}",
    };
    $("format-input").value = samples[$("format-type").value];
    format();
  });
  $("copy-output").addEventListener(
    "click",
    () => valid && copy($("format-output"), "format-status"),
  );
  $("download-output").addEventListener("click", () => {
    if (!valid) return;
    const type = $("format-type").value;
    download(
      $("format-output").value,
      `formatted.${type === "markdown" ? "md" : type}`,
    );
  });
  $("load-file").addEventListener("click", () => $("text-file").click());
  textFile(
    $("text-file"),
    (text, name) => {
      const ext = name.split(".").pop().toLowerCase();
      const type = {
        json: "json",
        md: "markdown",
        markdown: "markdown",
        yml: "yaml",
        yaml: "yaml",
        html: "html",
        htm: "html",
        css: "css",
      }[ext];
      if (type) $("format-type").value = type;
      $("format-input").value = text;
      modeChanged();
      format();
    },
    "format-status",
  );
  shortcut($("format-input"), () => format());
})();
