const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const path = require("node:path");
const { PDFDocument } = require("../assets/vendor/pdf-lib.min.js");

module.exports = async function testImagePdf(page, origin, outputDir) {
  await page.goto(`${origin}/personal-tools/image-pdf/`);
  assert.ok(await page.locator("#create-pdf").isDisabled());
  const fixtures = await page.evaluate(() => {
    function image(width, height, color, type) {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      if (color) {
        const context = canvas.getContext("2d");
        context.fillStyle = color;
        context.fillRect(0, 0, width, height);
      }
      return Array.from(Uint8Array.from(atob(canvas.toDataURL(type).split(",")[1]), c => c.charCodeAt(0)));
    }
    return [image(120, 240, "#ff0000", "image/png"), image(300, 100, "#0000ff", "image/jpeg"), image(200, 200, null, "image/webp")];
  });
  const files = ["đỏ.png", "xanh.jpg", "trong-suot.webp"].map((name, index) => ({
    name, mimeType: ["image/png", "image/jpeg", "image/webp"][index], buffer: Buffer.from(fixtures[index]),
  }));
  async function upload(selected) {
    await page.locator("#image-input").setInputFiles(selected);
    await page.waitForFunction(() => !document.getElementById("drop-zone").disabled);
  }
  async function savePdf(filename) {
    const pending = page.waitForEvent("download");
    await page.locator("#create-pdf").click();
    const download = await pending;
    assert.equal(download.suggestedFilename(), filename);
    const target = path.join(outputDir, filename);
    await download.saveAs(target);
    await page.waitForFunction(() => !document.getElementById("create-pdf").disabled);
    return PDFDocument.load(await fs.readFile(target));
  }
  await upload(files.slice(0, 2));
  await upload([files[2], { name: "bad.png", mimeType: "image/png", buffer: Buffer.from("bad image") }, { name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("bad") }]);
  assert.equal(await page.locator(".pdf-image-row").count(), 3);
  assert.match(await page.locator("#upload-status").innerText(), /bad.png/);
  assert.match(await page.locator("#upload-status").innerText(), /bad.txt/);
  // Reorder with keyboard, preserving focus for repeated moves.
  await page.locator('[data-index="1"][data-action="up"]').focus();
  await page.keyboard.press("Enter");
  assert.match(await page.locator(".pdf-image-info strong").first().innerText(), /xanh/);
  assert.ok(await page.evaluate(() => document.activeElement.closest(".pdf-image-row") === document.querySelector(".pdf-image-row")));
  await page.locator("#pdf-name").fill("tài-liệu");
  const a4 = await savePdf("tài-liệu.pdf");
  assert.equal(a4.getPageCount(), 3);
  const sizes = a4.getPages().map(p => p.getSize());
  assert.ok(sizes[0].width > sizes[0].height, "landscape first after reordering");
  assert.ok(sizes[1].width < sizes[1].height, "portrait second");
  assert.ok(Math.abs(sizes[1].width - 595.28) < 0.01);

  await page.locator("#page-size").selectOption("image");
  await page.locator("#page-margin").selectOption("0");
  assert.ok(await page.locator("#page-orientation").isDisabled());
  await page.locator("#pdf-name").fill("theo-anh.pdf");
  const natural = await savePdf("theo-anh.pdf");
  assert.deepEqual(natural.getPages().map(p => p.getSize()), [
    { width: 225, height: 75 }, { width: 90, height: 180 }, { width: 150, height: 150 },
  ]);
  await page.locator("#page-size").selectOption("letter");
  await page.locator("#page-orientation").selectOption("portrait");
  await page.locator("#page-margin").selectOption("20");
  await page.locator("#pdf-name").fill("letter.pdf");
  const letter = await savePdf("letter.pdf");
  assert.ok(letter.getPages().every(p => p.getWidth() === 612 && p.getHeight() === 792));

  // Pause image conversion so cancellation is deterministic, including on fast machines.
  await page.evaluate(() => {
    window.originalPdfToBlob = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (...args) {
      setTimeout(() => window.originalPdfToBlob.apply(this, args), 250);
    };
    window.pdfDownloads = 0;
    window.originalPdfLinkClick = HTMLAnchorElement.prototype.click;
    HTMLAnchorElement.prototype.click = function () {
      if (this.download) window.pdfDownloads++;
      return window.originalPdfLinkClick.call(this);
    };
  });
  await page.locator("#create-pdf").click();
  await page.locator("#cancel-pdf").click();
  await page.waitForFunction(() => !document.getElementById("create-pdf").disabled);
  assert.match(await page.locator("#pdf-status").innerText(), /Đã hủy/);
  assert.equal(await page.evaluate(() => window.pdfDownloads), 0);
  assert.equal(await page.locator(".pdf-image-row").count(), 3);
  await page.evaluate(() => {
    HTMLCanvasElement.prototype.toBlob = window.originalPdfToBlob;
    HTMLAnchorElement.prototype.click = window.originalPdfLinkClick;
  });

  const longName = { ...files[0], name: "ảnh-".repeat(40) + ".png" };
  await upload([longName]);
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `PDF overflow at ${width}`);
    await page.screenshot({ path: path.join(outputDir, `image-pdf-${width}.png`), fullPage: true });
  }
  await page.locator('[data-index="3"][data-action="remove"]').click();
  assert.equal(await page.locator(".pdf-image-row").count(), 3);
  await page.locator("#clear-images").click();
  assert.equal(await page.locator(".pdf-image-row").count(), 0);
  assert.ok(await page.locator("#create-pdf").isDisabled());
  await upload(Array(51).fill(files[0]));
  assert.match(await page.locator("#upload-status").innerText(), /Tối đa 50/);
  await upload([{ ...files[0], buffer: Buffer.alloc(20 * 1024 * 1024 + 1) }]);
  assert.match(await page.locator("#upload-status").innerText(), /20 MB/);

  // Drag/drop adds files; switching settings leaves the original source files usable.
  await page.evaluate((bytes) => {
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(new File([new Uint8Array(bytes)], "dropped.png", { type: "image/png" }));
    document.getElementById("drop-zone").dispatchEvent(new DragEvent("drop", { dataTransfer, bubbles: true }));
  }, fixtures[0]);
  await page.waitForFunction(() => !document.getElementById("drop-zone").disabled);
  assert.equal(await page.locator(".pdf-image-row").count(), 1);
  await page.locator("#pdf-name").fill("sau-huy.pdf");
  assert.equal((await savePdf("sau-huy.pdf")).getPageCount(), 1);
  console.log("PASS: image PDF uploads/drop, invalid files/limits, order/keyboard, downloads, A4/Letter/image sizes, cancellation/retry, remove/clear, responsive layout");
};
