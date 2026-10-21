const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const vendor = path.join(__dirname, "../assets/vendor");
const context = {
  window: {
    LosslessJSON: require(path.join(vendor, "lossless-json.js")),
    jsyaml: require(path.join(vendor, "js-yaml.min.js")),
    Papa: require(path.join(vendor, "papaparse.min.js")),
  },
  TextEncoder,
  TextDecoder,
  btoa,
  atob,
  Uint8Array,
};
vm.runInNewContext(
  fs.readFileSync(path.join(__dirname, "../assets/data.js"), "utf8"),
  context,
);
const data = context.window.ToolData;

test("JSON preserves large integers and exact decimals", () => {
  const text = '{"id":9223372036854775807,"value":2.370,"huge":2.3e+500}';
  assert.equal(data.stringifyJSON(data.parseJSON(text), 0), text);
  assert.throws(() => data.parseJSON('{"a":1,"a":2}'), /duplicate/i);
});
test("JSON and YAML preserve numbers, scalars, and strings", () => {
  const text =
    '{"id":9223372036854775807,"value":2.370,"huge":2.3e+500,"name":"0012","ok":true,"empty":null}';
  assert.equal(
    data.stringifyJSON(data.parseYAML(data.dumpYAML(data.parseJSON(text))), 0),
    text,
  );
  const result = data.parseYAML(
    "hex: 0xFF\nnegative: -0xFF\nfrac: .5\nnegativeFrac: -0.5\n",
  );
  assert.equal(
    data.stringifyJSON(result, 0),
    '{"hex":255,"negative":-255,"frac":0.5,"negativeFrac":-0.5}',
  );
  assert.equal(
    data.stringifyJSON(
      data.parseYAML(data.dumpYAML(data.parseJSON('{"zero":-0}'))),
      0,
    ),
    '{"zero":-0}',
  );
});
test("YAML rejects cycles and values outside JSON", () => {
  assert.throws(() => data.parseYAML("value: .inf"), /Infinity/);
  assert.throws(() => data.parseYAML("value: .nan"), /NaN/);
  assert.throws(() => data.parseYAML("a: &a\n  self: *a"), /vòng/);
  assert.equal(data.parseYAML("date: 2026-10-21").date, "2026-10-21");
});
test("CSV handles quotes, newlines, missing keys, nested JSON, and large numbers", () => {
  const csv = data.jsonToCSV(
    '[{"id":9223372036854775807,"text":"a,b\\n\\"quoted\\"","nested":{"x":1}},{"id":2,"extra":true}]',
  );
  const rows = data.parseJSON(data.csvToJSON(csv));
  assert.equal(rows[0].id, "9223372036854775807");
  assert.equal(rows[0].text, 'a,b\n"quoted"');
  assert.equal(rows[0].nested, '{"x":1}');
  assert.equal(rows[1].text, "");
  assert.equal(rows[1].extra, "true");
});
test("CSV auto typing keeps leading zeros and exact large numbers", () => {
  const result = data.csvToJSON(
    "id,value,active,empty\n0012,9223372036854775807,true,null",
    "auto",
  );
  assert.equal(
    data.stringifyJSON(data.parseJSON(result), 0),
    '[{"id":"0012","value":9223372036854775807,"active":true,"empty":null}]',
  );
});
test("CSV rejects duplicate headers and inconsistent rows", () => {
  assert.throws(() => data.csvToJSON("a,a\n1,2"), /trùng/);
  assert.throws(() => data.csvToJSON("a,b\n1"), /số cột/);
  assert.throws(() => data.jsonToCSV('{"a":1}'), /mảng JSON/);
  assert.throws(() => data.csvToJSON('a,b\n"unclosed,2'), /CSV không hợp lệ/);
});
test("UTF-8 Base64 and URL-safe Base64 roundtrip", () => {
  const text = "  Xin chào Việt Nam! 🛠️🌿\n".repeat(2000);
  assert.equal(data.fromBase64(data.toBase64(text)), text);
  assert.equal(data.fromBase64(data.toBase64(text, true), true), text);
  assert.throws(() => data.fromBase64("%%%%"), /Base64/);
  assert.throws(() => data.fromBase64("a"), /Base64/);
  assert.throws(() => data.fromBase64("/w=="), /UTF-8/);
});
test("UTF-8 hex roundtrip and validation", () => {
  const text = "Xin chào 🌿\n";
  assert.equal(data.hexToUTF8(data.utf8ToHex(text)), text);
  assert.throws(() => data.hexToUTF8("fff"), /Hex/);
  assert.throws(() => data.hexToUTF8("ff"), /UTF-8/);
});
