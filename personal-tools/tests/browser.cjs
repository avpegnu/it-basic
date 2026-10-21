/* Run with Playwright installed externally; see README.md. */
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const http = require("node:http");
const os = require("node:os");
const { chromium } = require("playwright");
const root = path.resolve(__dirname, "../..");
const types = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".wasm": "application/wasm",
  ".gz": "application/gzip",
};
const server = http.createServer(async (request, response) => {
  try {
    let file = path.join(
      root,
      decodeURIComponent(new URL(request.url, "http://localhost").pathname),
    );
    if ((await fs.stat(file)).isDirectory())
      file = path.join(file, "index.html");
    response.setHeader(
      "Content-Type",
      types[path.extname(file)] || "application/octet-stream",
    );
    response.end(await fs.readFile(file));
  } catch {
    response.writeHead(404).end();
  }
});
async function run() {
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  const executablePath =
    process.env.PERSONAL_TOOLS_CHROME ||
    (process.platform === "darwin"
      ? "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
      : undefined);
  const browser = await chromium.launch({ executablePath, headless: true });
  const outputDir = await fs.mkdtemp(
    path.join(os.tmpdir(), "personal-tools-qa-"),
  );
  console.log(`Screenshots and downloads: ${outputDir}`);
  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      permissions: ["clipboard-read", "clipboard-write"],
    });
    const errors = [],
      remote = [],
      failures = [];
    context.on("page", (page) =>
      page.on("pageerror", (error) => errors.push(error.message)),
    );
    context.on("request", (request) => {
      if (/^https?:/.test(request.url()) && !request.url().startsWith(origin))
        remote.push(request.url());
    });
    context.on("response", (response) => {
      if (response.status() >= 400) failures.push(response.url());
    });
    const page = await context.newPage();
    page.setDefaultTimeout(20000);
    await page.goto(`${origin}/personal-tools/`);
    assert.equal(await page.locator(".tool-card").count(), 4);
    await page.screenshot({
      path: path.join(outputDir, "home.png"),
      fullPage: true,
    });

    await page.goto(`${origin}/personal-tools/convert/`);
    const modes = await page
      .locator("#conversion-type option")
      .evaluateAll((items) => items.map((item) => item.value));
    for (const mode of modes) {
      await page.locator("#conversion-type").selectOption(mode);
      await page.locator("#load-sample").click();
      assert.ok(
        !(await page.locator("#convert-status").getAttribute("class")).includes(
          "error",
        ),
        `${mode}: ${await page.locator("#convert-status").innerText()}`,
      );
      assert.ok(
        (await page.locator("#convert-output").inputValue()).length > 0,
        mode,
      );
    }
    await page.locator("#conversion-type").selectOption("base64-encode");
    const unicode = '  Xin chào Việt Nam! 🌿\n"Giữ nguyên khoảng trắng"  ';
    await page.locator("#convert-input").fill(unicode);
    await page.locator("#convert-data").click();
    await page.locator("#swap-direction").click();
    await page.locator("#convert-data").click();
    assert.equal(await page.locator("#convert-output").inputValue(), unicode);
    await page.locator("#copy-output").click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      unicode,
    );
    await page.locator("#convert-input").fill("bad%");
    assert.ok(await page.locator("#copy-output").isDisabled());
    await page.locator("#conversion-type").selectOption("url-decode");
    await page.locator("#convert-data").click();
    assert.match(
      await page.locator("#convert-status").innerText(),
      /không hợp lệ/,
    );
    assert.equal(await page.locator("#convert-output").inputValue(), "");
    await page.locator("#conversion-type").selectOption("html-decode");
    await page
      .locator("#convert-input")
      .fill(
        '&lt;img src="https://invalid.example/leak" onerror="alert(1)"&gt;',
      );
    await page.locator("#convert-data").click();
    assert.match(await page.locator("#convert-output").inputValue(), /^<img/);
    const downloadEvent = page.waitForEvent("download");
    await page.locator("#download-output").click();
    const download = await downloadEvent;
    await download.saveAs(path.join(outputDir, "converted.txt"));
    assert.equal(
      await fs.readFile(path.join(outputDir, "converted.txt"), "utf8"),
      await page.locator("#convert-output").inputValue(),
    );
    console.log(
      "PASS: all 20 conversion samples, Unicode roundtrip, swap, clipboard, invalidation, invalid URL, inert HTML, download",
    );

    await page.goto(`${origin}/personal-tools/format/`);
    for (const type of ["json", "markdown", "yaml", "html", "css"]) {
      await page.locator("#format-type").selectOption(type);
      await page.locator("#load-sample").click();
      await page.waitForFunction(
        () =>
          !document.getElementById("copy-output").disabled ||
          document.getElementById("format-status").classList.contains("error"),
      );
      assert.ok(
        !(await page.locator("#format-status").getAttribute("class")).includes(
          "error",
        ),
        `${type}: ${await page.locator("#format-status").innerText()}`,
      );
      assert.ok((await page.locator("#format-output").inputValue()).length > 0);
      if (["markdown", "html"].includes(type))
        await page.frameLocator("iframe").locator("h1").waitFor();
    }
    await page.locator("#format-type").selectOption("json");
    const json =
      '{"id":9223372036854775807,"decimal":2.370,"nested":{"items":[true,null,"Việt Nam"]}}';
    await page.locator("#format-input").fill(json);
    await page.locator("#format-data").click();
    assert.match(
      await page.locator("#format-output").inputValue(),
      /9223372036854775807/,
    );
    await page.locator(".json-tree").waitFor();
    await page.locator("#minify-data").click();
    assert.equal(await page.locator("#format-output").inputValue(), json);
    await page.locator("#format-input").fill('{"broken":}');
    await page.locator("#format-data").click();
    assert.ok(await page.locator("#copy-output").isDisabled());
    assert.match(
      await page.locator("#format-status").getAttribute("class"),
      /error/,
    );
    await page.locator("#text-file").setInputFiles({
      name: "readme.md",
      mimeType: "text/markdown",
      buffer: Buffer.from("# Imported\n\n**Hello**"),
    });
    await page.waitForFunction(
      () =>
        document.getElementById("format-type").value === "markdown" &&
        !document.getElementById("copy-output").disabled,
    );
    await page.locator("#preview-tab").click();
    await page.frameLocator("iframe").locator("h1").waitFor();
    await page
      .locator("#format-input")
      .fill(
        '# Safe\n<script>parent.__pwned=1</script>\n<img src="https://invalid.example/leak" onerror="parent.__pwned=1">\n<a href="javascript:alert(1)">bad</a>\n<iframe src="https://invalid.example/"></iframe>',
      );
    await page.locator("#format-data").click();
    await page
      .frameLocator("iframe")
      .getByRole("heading", { name: "Safe" })
      .waitFor();
    assert.equal(await page.evaluate(() => window.__pwned), undefined);
    assert.equal(
      await page
        .frameLocator("iframe")
        .locator('script,iframe,a[href],img[src^="http"]')
        .count(),
      0,
    );
    assert.equal(await page.locator("iframe").getAttribute("sandbox"), "");
    await page.locator("#load-sample").click();
    await page.waitForFunction(
      () => !document.getElementById("copy-output").disabled,
    );
    await page.screenshot({
      path: path.join(outputDir, "format.png"),
      fullPage: true,
    });
    console.log(
      "PASS: all 5 format types, JSON precision/minify, trees, file import, rendered Markdown/HTML, isolated preview",
    );

    await page.goto(`${origin}/personal-tools/ocr/`);
    assert.ok(await page.locator("#recognize").isDisabled());
    const image = await page.evaluate(() => {
      const canvas = document.createElement("canvas");
      canvas.width = 1400;
      canvas.height = 450;
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "#111";
      context.font = "52px Arial";
      ["PERSONAL TOOLS", "Hello World 2026", "Xin chào Việt Nam"].forEach(
        (text, i) => context.fillText(text, 70, 100 + i * 110),
      );
      return canvas.toDataURL().split(",")[1];
    });
    const imageFile = {
      name: "ocr-test.png",
      mimeType: "image/png",
      buffer: Buffer.from(image, "base64"),
    };
    await page.locator("#image-input").setInputFiles(imageFile);
    await page.locator("#recognize").waitFor({ state: "visible" });
    await page.waitForFunction(
      () => !document.getElementById("recognize").disabled,
    );
    await page.locator("#recognize").click();
    await page.waitForFunction(
      () =>
        !document.getElementById("copy-output").disabled ||
        document.getElementById("ocr-status").classList.contains("error"),
      null,
      { timeout: 120000 },
    );
    assert.ok(
      !(await page.locator("#ocr-status").getAttribute("class")).includes(
        "error",
      ),
      await page.locator("#ocr-status").innerText(),
    );
    const recognized = await page.locator("#ocr-output").inputValue();
    console.log("OCR result:", JSON.stringify(recognized));
    assert.match(recognized, /PERSONAL TOOLS/);
    assert.match(recognized, /Hello World 2026/);
    assert.match(recognized, /Việt Nam/);
    await page.screenshot({
      path: path.join(outputDir, "ocr.png"),
      fullPage: true,
    });
    await page.locator("#ocr-output").fill("Edited OCR output");
    await page.locator("#copy-output").click();
    assert.equal(
      await page.evaluate(() => navigator.clipboard.readText()),
      "Edited OCR output",
    );
    await page.locator("#recognize").click();
    await page.locator("#cancel-ocr").click();
    assert.equal(await page.locator("#ocr-output").inputValue(), "");
    assert.match(await page.locator("#ocr-status").innerText(), /Đã hủy/);
    await page.locator("#image-input").setInputFiles({
      name: "invalid.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("bad"),
    });
    assert.ok(await page.locator("#recognize").isDisabled());
    assert.match(
      await page.locator("#ocr-status").getAttribute("class"),
      /error/,
    );
    console.log(
      "PASS: real Vietnamese/English OCR using local WASM/language files, editing, copy, cancellation, invalid file",
    );

    for (const route of ["", "qr/", "ocr/", "format/", "convert/"]) {
      await page.goto(`${origin}/personal-tools/${route}`);
      for (const width of [360, 768, 1440]) {
        await page.setViewportSize({ width, height: 900 });
        assert.ok(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          `overflow at ${route} ${width}`,
        );
      }
    }
    await page.goto(`${origin}/personal-tools/convert/`);
    await page.locator("#load-sample").click();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await page.screenshot({
      path: path.join(outputDir, "convert-mobile.png"),
      fullPage: true,
    });
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    assert.deepEqual(failures, []);
    console.log(
      "PASS: all pages desktop/tablet/mobile; no JavaScript errors, missing assets, or external HTTP requests",
    );
  } finally {
    await browser.close();
  }
}
run()
  .then(() => server.close())
  .catch((error) => {
    console.error(error);
    server.close();
    process.exitCode = 1;
  });
