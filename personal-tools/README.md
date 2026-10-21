# Personal Tools

Trang tiện ích độc lập với phần kiến thức của repo. HTML/CSS/JavaScript thuần, không cần cài package hoặc build.

- Trang chủ: `/personal-tools/` (`personal-tools/index.html`).
- Công cụ QR: `/personal-tools/qr/` (`personal-tools/qr/index.html`).
- Ảnh → Văn bản: `/personal-tools/ocr/`.
- Format & Preview: `/personal-tools/format/`.
- Chuyển đổi dữ liệu: `/personal-tools/convert/`.
- Xem tại máy: chạy `python3 -m http.server 8000` từ thư mục gốc repo, rồi mở `http://localhost:8000/personal-tools/`.
- Có thể mở trực tiếp `personal-tools/index.html`. Trên trình duyệt không hỗ trợ worker qua `file://`, công cụ đọc QR dùng luồng chính.
- Riêng OCR cần HTTP/HTTPS hoặc localhost vì sử dụng Web Worker và WebAssembly.

## Công cụ QR

- Đọc một QR từ ảnh chọn, kéo thả hoặc dán từ clipboard; sao chép kết quả.
- Chỉ hiện nút mở đường dẫn cho giao thức HTTP/HTTPS; không tự truy cập nội dung QR.
- Tạo QR từ đường dẫn hoặc văn bản, hỗ trợ tiếng Việt/emoji, chọn kích thước và mức sửa lỗi, tải PNG.
- Ảnh đầu vào: PNG/JPEG/WebP/GIF/BMP, tối đa 20 MB và 40 triệu pixel. Ảnh GIF dùng khung hình đầu tiên.
- Xử lý tại trình duyệt, không tải ảnh lên máy chủ, không lưu lịch sử hoặc dùng dịch vụ QR bên ngoài.

## Ảnh → Văn bản

- Chọn, kéo thả hoặc dán ảnh PNG/JPEG/WebP/BMP; tối đa 20 MB và 40 triệu pixel.
- Chọn tiếng Việt, tiếng Anh hoặc cả hai. Mặc định ưu tiên tiếng Việt.
- Xem tiến trình, hủy tác vụ, chỉnh lại kết quả, sao chép và tải TXT.
- Engine OCR và dữ liệu Việt/Anh phục vụ từ `assets/vendor/`; không dùng CDN hay API OCR bên ngoài.
- Có cả bản SIMD và không SIMD cho engine LSTM. Các file `.wasm.js` đã chứa binary WASM.
- Độ chính xác phụ thuộc độ rõ, font, góc chụp và ngôn ngữ của ảnh; có thể sửa văn bản sau nhận dạng.

## Format & Preview

- JSON: format, minify, cây dữ liệu có thể đóng/mở; giữ chính xác số lớn và số thập phân.
- Markdown: format và preview tiêu đề, bảng, danh sách, code block.
- YAML: format và cây dữ liệu; dùng YAML Core Schema, ngày tháng dạng thường được giữ thành chuỗi.
- HTML: format và preview đã loại script, form, tài nguyên từ xa; CSS: format và xem mã.
- Chọn thụt lề, mở tệp UTF-8, dữ liệu mẫu, sao chép và tải kết quả.
- Preview Markdown/HTML dùng DOMPurify và iframe sandbox với CSP hạn chế, không chạy JavaScript hoặc tải ảnh ngoài.
- Tối đa 1 MB đầu vào; cây preview giới hạn số node, tab Mã vẫn có dữ liệu đầy đủ.

## Chuyển đổi dữ liệu

- Văn bản UTF-8 ↔ Base64, Base64 URL-safe, hex.
- URL component, URL đầy đủ, form URL encode/decode; chế độ form giải mã dấu `+` thành khoảng trắng.
- HTML entities encode/decode; văn bản ↔ JSON string.
- JSON ↔ YAML; JSON ↔ CSV. JSON → CSV nhận mảng object, hợp nhất tên cột; giá trị object/array lồng được ghi thành chuỗi JSON.
- CSV → JSON giữ giá trị dạng chuỗi theo mặc định; có tùy chọn nhận dạng số, boolean, null. Chuỗi có số 0 đầu vẫn được giữ nguyên.
- Đảo chiều, dùng kết quả làm đầu vào, mở tệp, dữ liệu mẫu, sao chép và tải xuống.
- Không âm thầm làm tròn số lớn. Dữ liệu lỗi sẽ xóa kết quả cũ và hiện lỗi.
- Tối đa 2 MB đầu vào, tệp văn bản phải là UTF-8.

## Cấu trúc

- `assets/styles.css`: giao diện chung cho các trang tiện ích.
- `assets/qr.js`, `assets/qr-worker.js`: giao diện và xử lý QR.
- `assets/common.js`: thao tác tệp, clipboard, tải kết quả, phím tắt.
- `assets/data.js`: logic parse/serialize và chuyển đổi dùng chung.
- `assets/ocr.js`, `assets/format.js`, `assets/convert.js`: xử lý ba công cụ mới.
- `assets/vendor/`: thư viện ghim phiên bản và giấy phép, phục vụ cùng trang để không phụ thuộc CDN.
- `qr/index.html`: trang QR riêng.
- Thư mục `tools/` có sẵn ở gốc repo chứa các script build/kiểm tra phần kiến thức và được giữ riêng.

## Thư viện

- [jsQR 1.4.0](https://github.com/cozmo/jsQR), Apache-2.0: đọc QR.
- [qrcode-generator 1.4.4](https://github.com/kazuhikoarase/qrcode-generator), MIT: tạo QR.
- [Tesseract.js 6.0.1](https://github.com/naptha/tesseract.js), [Tesseract.js Core 6.0.0](https://github.com/naptha/tesseract.js-core), Apache-2.0: OCR; dữ liệu `@tesseract.js-data/eng` và `vie` 1.0.0 (`4.0.0_best_int`).
- [Prettier 3.6.2](https://github.com/prettier/prettier), MIT: format Markdown/YAML/HTML/CSS.
- [Marked 15.0.12](https://github.com/markedjs/marked), MIT: render Markdown.
- [DOMPurify 3.4.17](https://github.com/cure53/DOMPurify), Apache-2.0/MPL-2.0: làm sạch preview HTML.
- [js-yaml 4.1.1](https://github.com/nodeca/js-yaml), MIT: YAML.
- [Papa Parse 5.5.3](https://github.com/mholt/PapaParse), MIT: CSV.
- [lossless-json 4.3.0](https://github.com/josdejong/lossless-json), MIT: giữ chính xác giá trị số JSON.

Giấy phép nằm cạnh mỗi thư viện trong `assets/vendor/`.

## Kiểm thử

Logic chuyển đổi, không cần cài dependency:

```sh
node --test personal-tools/tests/data.test.cjs
```

Kiểm thử trình duyệt cần Playwright và Chrome/Chromium. Có thể cài Playwright ở thư mục tạm để không tạo package/node_modules trong repo:

```sh
npm install --prefix /tmp/personal-tools-qa --no-audit --no-fund playwright@1.56.1
NODE_PATH=/tmp/personal-tools-qa/node_modules node personal-tools/tests/browser.cjs
```

Trên macOS test dùng Chrome có sẵn. Hệ điều hành khác dùng Chromium của Playwright hoặc biến `PERSONAL_TOOLS_CHROME` để chỉ định executable. Test tự chạy/dừng HTTP server localhost, kiểm tra OCR thật Việt/Anh, 20 phép chuyển đổi, 5 định dạng, preview cách ly, clipboard/download và bố cục 360/768/1440 px. Ảnh chụp và tệp tải được lưu ở thư mục tạm có đường dẫn in trong output.

Workflow deploy hiện tại tự đồng bộ `personal-tools/`. Thư mục `tools/` vẫn được loại trừ như trước. Không cần thay cấu hình deploy hoặc Nginx.
