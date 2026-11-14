const assert = require("node:assert/strict");
const path = require("node:path");

module.exports = async function testQrExpand(browser, origin, outputDir) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    permissions: ["clipboard-read", "clipboard-write"],
  });
  const errors = [], remote = [], failures = [], requests = [];
  const endpoint = `${origin}/api/expand-url`;
  context.on("page", page => page.on("pageerror", error => errors.push(error.message)));
  context.on("request", request => {
    if (/^https?:/.test(request.url()) && !request.url().startsWith(origin)) remote.push(request.url());
  });
  context.on("response", response => {
    if (response.status() >= 400 && response.url() !== endpoint) failures.push(response.url());
  });
  let scenario = "success";
  let release;
  const finalUrl = "https://destination.example/" + "long-path/".repeat(20) + "?q=%E1%BA%A3nh#section";
  function success(url) {
    return { originalUrl: url, finalUrl, hops: [{ url, status: 302 }, { url: "https://middle.example/go", status: 307 }, { url: finalUrl, status: 200 }] };
  }
  await context.route(endpoint, async route => {
    const request = route.request();
    requests.push(request);
    const url = request.postDataJSON().url;
    if (scenario === "missing") return route.fulfill({ status: 404, contentType: "text/html", body: "Not Found" });
    if (scenario === "error") return route.fulfill({ status: 400, json: { error: "Không tra URL trỏ tới địa chỉ nội bộ hoặc địa chỉ dành riêng." } });
    if (scenario === "invalid") return route.fulfill({ json: { finalUrl: "javascript:alert(1)", hops: [] } });
    if (scenario === "malformed") return route.fulfill({ contentType: "application/json", body: "bad json" });
    if (scenario === "slow") await new Promise(resolve => { release = resolve; });
    await route.fulfill({ json: success(url) }).catch(() => {});
  });
  try {
    const page = await context.newPage();
    await page.goto(`${origin}/personal-tools/qr/`);
    async function scan(text) {
      await page.locator("#create-tab").click();
      await page.locator("#qr-content").fill(text);
      await page.locator('#create-form button[type="submit"]').click();
      const data = await page.locator("#generated-canvas").evaluate(canvas => canvas.toDataURL().split(",")[1]);
      await page.locator("#read-tab").click();
      await page.locator("#image-input").setInputFiles({ name: "qr.png", mimeType: "image/png", buffer: Buffer.from(data, "base64") });
      await page.waitForFunction(expected => document.getElementById("decoded-text").value === expected, text);
    }
    await scan("https://short.example/abc");
    assert.ok(await page.locator("#expand-url").isVisible());
    assert.equal(requests.length, 0, "decoding does not resolve URLs automatically");
    assert.equal(await page.locator("#open-link").getAttribute("href"), "https://short.example/abc");
    await page.locator("#expand-url").click();
    await page.locator("#expand-result").waitFor();
    assert.equal(requests.length, 1);
    assert.equal(requests[0].method(), "POST");
    assert.deepEqual(requests[0].postDataJSON(), { url: "https://short.example/abc" });
    assert.equal(await page.locator("#expanded-url").inputValue(), finalUrl);
    assert.equal(await page.locator("#decoded-text").inputValue(), "https://short.example/abc");
    assert.equal(await page.locator("#open-expanded").getAttribute("href"), finalUrl);
    assert.equal(await page.locator("#redirect-hops li").count(), 3);
    assert.match(await page.locator("#expand-status").innerText(), /2 bước/);
    await page.locator("#copy-expanded").click();
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), finalUrl);
    await page.locator(".qr-redirect-details summary").click();
    for (const width of [360, 768, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => {
        window.scrollTo(0, 0);
        return new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `QR redirect overflow ${width}`);
      await page.screenshot({ path: path.join(outputDir, `qr-expand-${width}.png`), fullPage: true });
    }
    for (const [mode, pattern] of [["missing", /chưa được bật/], ["error", /nội bộ/], ["invalid", /URL không hợp lệ/], ["malformed", /không hợp lệ/]]) {
      scenario = mode;
      await page.locator("#expand-url").click();
      await page.waitForFunction(() => !document.getElementById("expand-url").disabled);
      assert.match(await page.locator("#expand-status").innerText(), pattern);
      assert.ok(await page.locator("#expand-result").isHidden());
      assert.equal(await page.locator("#open-expanded").getAttribute("href"), null);
    }
    scenario = "slow";
    await page.locator("#expand-url").click();
    await page.waitForFunction(() => document.getElementById("expand-url").disabled);
    while (!release) await new Promise(resolve => setTimeout(resolve, 10));
    await page.locator("#cancel-expand").click();
    release();
    release = null;
    assert.match(await page.locator("#expand-status").innerText(), /Đã hủy/);
    assert.ok(await page.locator("#expand-result").isHidden());
    scenario = "success";
    await page.locator("#expand-url").click();
    await page.locator("#expand-result").waitFor();
    // Switching QR while a response is pending must not restore a stale link.
    scenario = "slow";
    await page.locator("#expand-url").click();
    while (!release) await new Promise(resolve => setTimeout(resolve, 10));
    await page.locator("#clear-image").click();
    release();
    release = null;
    await scan("Xin chào Việt Nam");
    assert.ok(await page.locator("#expand-section").isHidden());
    assert.equal(await page.locator("#open-expanded").getAttribute("href"), null);
    const count = requests.length;
    await scan("javascript:alert(1)");
    assert.ok(await page.locator("#expand-section").isHidden());
    assert.ok(await page.locator("#open-link").isHidden());
    assert.equal(requests.length, count);
    assert.deepEqual(errors, []);
    assert.deepEqual(remote, []);
    assert.deepEqual(failures, []);
    console.log("PASS: real QR decode, opt-in URL lookup, redirect chain/copy, API unavailable/errors, cancellation/retry/stale results, text/non-HTTP QR, responsive layout; no external requests");
  } finally {
    if (release) release();
    await context.close();
  }
};
