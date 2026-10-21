(() => {
  "use strict";
  const { $, status, copy, download, textFile, shortcut } = window.Toolbox;
  const data = window.ToolData;
  const pairs = [
    ["base64-encode", "base64-decode"],
    ["base64url-encode", "base64url-decode"],
    ["url-encode", "url-decode"],
    ["uri-encode", "uri-decode"],
    ["form-encode", "form-decode"],
    ["html-encode", "html-decode"],
    ["json-escape", "json-unescape"],
    ["json-yaml", "yaml-json"],
    ["json-csv", "csv-json"],
    ["hex-encode", "hex-decode"],
  ];
  const inverse = Object.fromEntries(
    pairs.flatMap(([a, b]) => [
      [a, b],
      [b, a],
    ]),
  );
  const operations = {
    "base64-encode": (text) => data.toBase64(text),
    "base64-decode": (text) => data.fromBase64(text),
    "base64url-encode": (text) => data.toBase64(text, true),
    "base64url-decode": (text) => data.fromBase64(text, true),
    "url-encode": encodeURIComponent,
    "url-decode": decodeURIComponent,
    "uri-encode": encodeURI,
    "uri-decode": decodeURI,
    "form-encode": (text) =>
      new URLSearchParams({ q: text }).toString().slice(2),
    "form-decode": (text) => decodeURIComponent(text.replaceAll("+", " ")),
    "html-encode": data.htmlEncode,
    "html-decode": data.htmlDecode,
    "json-escape": JSON.stringify,
    "json-unescape": (text) => {
      const value = data.parseJSON(text);
      if (typeof value !== "string")
        throw new Error("Cần một JSON string có dấu ngoặc kép ở hai đầu.");
      return value;
    },
    "json-yaml": (text) => data.dumpYAML(data.parseJSON(text)),
    "yaml-json": (text) => data.stringifyJSON(data.parseYAML(text)),
    "json-csv": data.jsonToCSV,
    "csv-json": (text) => data.csvToJSON(text, $("csv-types").value),
    "hex-encode": data.utf8ToHex,
    "hex-decode": data.hexToUTF8,
  };
  let valid = false;
  function invalidate() {
    valid = false;
    $("convert-output").value = "";
    $("output-count").textContent = "0 ký tự";
    ["copy-output", "download-output", "use-output"].forEach(
      (id) => ($(id).disabled = true),
    );
    status("convert-status");
  }
  function updateMode() {
    $("csv-options").hidden = $("conversion-type").value !== "csv-json";
    invalidate();
  }
  function convert() {
    invalidate();
    const text = $("convert-input").value;
    if (!text.length)
      return status("convert-status", "Chưa có dữ liệu đầu vào.", true);
    if (new TextEncoder().encode(text).length > 2 * 1024 * 1024)
      return status("convert-status", "Dữ liệu vượt quá 2 MB.", true);
    try {
      const result = operations[$("conversion-type").value](text);
      $("convert-output").value = result;
      $("output-count").textContent =
        `${result.length.toLocaleString("vi-VN")} ký tự`;
      valid = true;
      ["copy-output", "download-output", "use-output"].forEach(
        (id) => ($(id).disabled = false),
      );
      status("convert-status", "Đã chuyển đổi.");
    } catch (error) {
      status(
        "convert-status",
        error instanceof URIError
          ? "Chuỗi URL encode/decode không hợp lệ."
          : error.message,
        true,
      );
    }
  }
  function sample() {
    const mode = $("conversion-type").value;
    const text = "Xin chào Việt Nam! 🌿";
    const rows = '[{"name":"An","age":25},{"name":"Bình","age":30}]';
    const samples = {
      "base64-encode": text,
      "base64-decode": data.toBase64(text),
      "base64url-encode": text,
      "base64url-decode": data.toBase64(text, true),
      "url-encode": "từ khóa=Việt Nam & emoji=🌿",
      "url-decode": encodeURIComponent(text),
      "uri-encode": "https://example.com/tìm kiếm?q=Việt Nam",
      "uri-decode": encodeURI("https://example.com/tìm kiếm?q=Việt Nam"),
      "form-encode": text,
      "form-decode": "Xin+ch%C3%A0o+Vi%E1%BB%87t+Nam%21",
      "html-encode": '<h1 title="Hello">Xin chào & bạn</h1>',
      "html-decode": "&lt;h1&gt;Xin chào &amp; bạn&lt;/h1&gt;",
      "json-escape": 'Xin chào!\nDòng có "ngoặc kép".',
      "json-unescape": '"Xin chào!\\nDòng có \\"ngoặc kép\\"."',
      "json-yaml": rows,
      "yaml-json": "name: An\nage: 25\nskills:\n  - JavaScript\n  - Python\n",
      "json-csv": rows,
      "csv-json": "name,age\nAn,25\nBình,30",
      "hex-encode": text,
      "hex-decode": data.utf8ToHex(text),
    };
    $("convert-input").value = samples[mode];
    convert();
  }
  $("conversion-type").addEventListener("change", updateMode);
  $("csv-types").addEventListener("change", invalidate);
  $("convert-input").addEventListener("input", invalidate);
  $("convert-data").addEventListener("click", convert);
  $("load-sample").addEventListener("click", sample);
  $("clear-data").addEventListener("click", () => {
    $("convert-input").value = "";
    invalidate();
    $("convert-input").focus();
  });
  $("swap-direction").addEventListener("click", () => {
    if (valid) $("convert-input").value = $("convert-output").value;
    $("conversion-type").value = inverse[$("conversion-type").value];
    updateMode();
  });
  $("use-output").addEventListener("click", () => {
    if (!valid) return;
    $("convert-input").value = $("convert-output").value;
    invalidate();
    $("convert-input").focus();
  });
  $("copy-output").addEventListener(
    "click",
    () => valid && copy($("convert-output"), "convert-status"),
  );
  $("download-output").addEventListener("click", () => {
    if (!valid) return;
    const mode = $("conversion-type").value;
    const ext = mode.endsWith("-json")
      ? "json"
      : mode === "json-yaml"
        ? "yaml"
        : mode === "json-csv"
          ? "csv"
          : "txt";
    download($("convert-output").value, `converted.${ext}`);
  });
  $("load-file").addEventListener("click", () => $("text-file").click());
  textFile(
    $("text-file"),
    (text) => {
      $("convert-input").value = text;
      invalidate();
    },
    "convert-status",
  );
  shortcut($("convert-input"), convert);
})();
