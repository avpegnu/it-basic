(() => {
  "use strict";
  const lossless = window.LosslessJSON;
  const yaml = window.jsyaml;
  // Keep large integers and precise decimals intact across JSON/YAML/CSV.
  const numericTypes = yaml.CORE_SCHEMA.implicit.filter((type) =>
    /:(int|float)$/.test(type.tag),
  );
  const schema = yaml.CORE_SCHEMA.extend(
    numericTypes.map(
      (type) =>
        new yaml.Type(type.tag, {
          kind: "scalar",
          resolve: type.resolve,
          construct: (source) => {
            let value = source.replaceAll("_", "");
            if (type.tag.endsWith(":int")) {
              const sign = value[0] === "-" ? -1n : 1n;
              value = value.replace(/^[+-]/, "");
              const integer = sign * BigInt(value);
              return new lossless.LosslessNumber(
                integer === 0n && sign < 0n ? "-0" : String(integer),
              );
            }
            if (/\.(inf|nan)/i.test(value))
              throw new Error("JSON không hỗ trợ Infinity hoặc NaN.");
            value = value
              .replace(/^\+/, "")
              .replace(/^(-?)\./, "$10.")
              .replace(/\.(?=e|$)/i, ".0");
            return new lossless.LosslessNumber(value);
          },
          predicate: (value) =>
            lossless.isLosslessNumber(value) &&
            type.tag.endsWith(":int") === /^-?\d+$/.test(value.value),
          represent: (value) => value.value,
        }),
    ),
  );

  function parseJSON(text) {
    return lossless.parse(text);
  }
  function stringifyJSON(value, space = 2) {
    return lossless.stringify(value, null, space);
  }
  function checkJSONValue(value, ancestors = new Set(), budget = { nodes: 0 }) {
    if (++budget.nodes > 50000 || ancestors.size > 100) {
      throw new Error("Cấu trúc YAML quá lớn hoặc quá sâu để chuyển đổi.");
    }
    if (
      value === null ||
      typeof value === "string" ||
      typeof value === "boolean" ||
      lossless.isLosslessNumber(value)
    )
      return;
    if (typeof value === "number") {
      if (!Number.isFinite(value))
        throw new Error("JSON không hỗ trợ Infinity hoặc NaN.");
      return;
    }
    if (
      typeof value !== "object" ||
      (!Array.isArray(value) &&
        Object.prototype.toString.call(value) !== "[object Object]")
    )
      throw new Error("Kiểu dữ liệu YAML này không chuyển được sang JSON.");
    if (ancestors.has(value))
      throw new Error("Không thể chuyển YAML có tham chiếu vòng sang JSON.");
    ancestors.add(value);
    Object.values(value).forEach((item) =>
      checkJSONValue(item, ancestors, budget),
    );
    ancestors.delete(value);
  }
  function parseYAML(text) {
    const value = yaml.load(text, { schema });
    checkJSONValue(value);
    return value;
  }
  function dumpYAML(value) {
    return yaml.dump(value, {
      schema,
      noRefs: true,
      lineWidth: 100,
      sortKeys: false,
    });
  }
  function scalarCSV(value) {
    if (value === null || value === undefined) return "";
    if (lossless.isLosslessNumber(value)) return value.value;
    if (typeof value === "object") return stringifyJSON(value, 0);
    return String(value);
  }
  function jsonToCSV(text) {
    const rows = parseJSON(text);
    if (
      !Array.isArray(rows) ||
      !rows.length ||
      !rows.every(
        (row) =>
          row &&
          typeof row === "object" &&
          !Array.isArray(row) &&
          !lossless.isLosslessNumber(row),
      )
    ) {
      throw new Error(
        'Cần một mảng JSON gồm các object, ví dụ [{"name":"An","age":25}].',
      );
    }
    const fields = [...new Set(rows.flatMap((row) => Object.keys(row)))];
    if (!fields.length)
      throw new Error("Các object cần có ít nhất một thuộc tính.");
    return window.Papa.unparse(
      {
        fields,
        data: rows.map((row) =>
          fields.map((key) =>
            scalarCSV(Object.hasOwn(row, key) ? row[key] : null),
          ),
        ),
      },
      { newline: "\n" },
    );
  }
  function csvToJSON(text, typing = "strings") {
    const result = window.Papa.parse(text, { skipEmptyLines: "greedy" });
    const errors = result.errors.filter(
      (error) => error.code !== "UndetectableDelimiter",
    );
    if (errors.length)
      throw new Error(`CSV không hợp lệ: ${errors[0].message}`);
    if (result.data.length < 2)
      throw new Error("CSV cần có hàng tiêu đề và ít nhất một hàng dữ liệu.");
    const [fields, ...rows] = result.data;
    if (
      fields.some((field) => !field.trim()) ||
      new Set(fields).size !== fields.length
    )
      throw new Error("Tiêu đề CSV bị trống hoặc trùng nhau.");
    const parsed = rows.map((row, index) => {
      if (row.length !== fields.length)
        throw new Error(`Hàng ${index + 2} có số cột không khớp tiêu đề.`);
      return Object.fromEntries(
        fields.map((field, i) => {
          let value = row[i];
          if (typing === "auto") {
            if (value === "true" || value === "false" || value === "null")
              value = parseJSON(value);
            else if (/^-?(0|[1-9]\d*)(\.\d+)?([eE][+-]?\d+)?$/.test(value))
              value = new lossless.LosslessNumber(value);
          }
          return [field, value];
        }),
      );
    });
    return stringifyJSON(parsed);
  }
  function toBase64(text, urlSafe = false) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i += 8192)
      binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
    const result = btoa(binary);
    return urlSafe
      ? result.replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "")
      : result;
  }
  function fromBase64(text, urlSafe = false) {
    let value = text.replace(/\s/g, "");
    const pattern = urlSafe ? /^[\w-]*={0,2}$/ : /^[A-Za-z0-9+/]*={0,2}$/;
    if (!pattern.test(value) || value.replace(/=+$/, "").length % 4 === 1)
      throw new Error("Chuỗi Base64 không hợp lệ.");
    if (value.includes("=") && value.length % 4 !== 0)
      throw new Error("Phần padding Base64 không hợp lệ.");
    if (urlSafe) value = value.replaceAll("-", "+").replaceAll("_", "/");
    try {
      const binary = atob(value);
      const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
      return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    } catch {
      throw new Error("Base64 không hợp lệ hoặc không chứa văn bản UTF-8.");
    }
  }
  function htmlEncode(text) {
    return text.replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  }
  function htmlDecode(text) {
    // Encode raw angle brackets before parsing: entities become plain text,
    // and markup cannot create active elements or fetch remote resources.
    const field = document.createElement("textarea");
    field.innerHTML = text.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
    return field.value;
  }
  function utf8ToHex(text) {
    return Array.from(new TextEncoder().encode(text), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join("");
  }
  function hexToUTF8(text) {
    const value = text.replace(/\s/g, "");
    if (!/^(?:[\da-f]{2})*$/i.test(value))
      throw new Error("Hex cần từng cặp ký tự 0–9, A–F.");
    try {
      return new TextDecoder("utf-8", { fatal: true }).decode(
        Uint8Array.from(value.match(/../g) || [], (pair) => parseInt(pair, 16)),
      );
    } catch {
      throw new Error("Chuỗi hex không chứa văn bản UTF-8 hợp lệ.");
    }
  }
  window.ToolData = Object.freeze({
    parseJSON,
    stringifyJSON,
    parseYAML,
    dumpYAML,
    jsonToCSV,
    csvToJSON,
    toBase64,
    fromBase64,
    htmlEncode,
    htmlDecode,
    utf8ToHex,
    hexToUTF8,
  });
})();
