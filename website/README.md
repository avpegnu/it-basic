# IT Basic — Learning Platform

Bản website mới dùng Astro + React + TypeScript, xuất HTML tĩnh để chạy tại `https://avpegnu.github.io/it-basic/`. Phạm vi hiện tại là học IT; không có portfolio.

- 198 chương cũ, tổ chức thành 15 lộ trình.
- 31 topic Notes & Interview: 147 notes, 387 câu hỏi chính và follow-up, 44 sơ đồ từ notes.
- Tóm tắt, sơ đồ ghi nhớ và bài thử tương tác cho cả 31 topic.
- 26 System Design case study viết bằng tiếng Việt: requirements, capacity worksheet, API/data, flow, quyết định, lỗi, trade-off và interview drill. Đây là study outlines do IT Basic biên soạn, không phải bản dịch toàn bộ Blueprint.
- Pagefind search, theme, bookmark, đánh giá câu hỏi, tiến độ chương, nhập/xuất dữ liệu tương thích Notes & Interview cũ.

## Chạy local

Cần Node >= 22.22 (CI dùng Node 24), npm >= 9.6.5.

```sh
cd website
npm ci
npm run dev
```

Mở `/it-basic/` trên địa chỉ Astro in ra. Development server không sinh search index; để kiểm tra tìm kiếm hãy dùng bản build:

```sh
npm run check
npm test
npm run build
npm run verify
npm run preview
```

Astro 7 có thể chạy preview thành background process. Dừng bằng `npx astro preview stop` sau khi kiểm tra.

## Cấu trúc

```text
src/content/courses/   Chương HTML đã import, metadata và source hash
src/content/topics/    Notes và câu hỏi; dùng chung cho Handbook và Practice
src/lib/learning.ts    Tóm tắt, phép ví von, luồng ghi nhớ và loại lab cho 31 topic
src/lib/cases.ts       26 case study System Design, nội dung độc lập theo case
src/lib/models.ts      Logic tính toán các mô phỏng
src/lib/scenarios.ts   Kịch bản chạy đúng và lỗi cho các bài mô phỏng luồng
src/lib/study.ts       LocalStorage, validation và tương thích dữ liệu cũ
src/layouts/           Shell chung: sidebar, header, TOC, theme, mobile navigation
src/components/        UI và React islands; không hydrate cả website
src/pages/             Routes tĩnh do Astro tạo lúc build
scripts/               Migration, link/content verification và browser QA
public/examples/       SQL lab tải về
```

Schema Zod trong `src/lib/content.ts` kiểm tra topic/course tại build. Nội dung đọc được render sẵn vào HTML. Chỉ các công cụ cần tương tác mới hydrate React. `src/lib/url.ts` quản lý base path; dùng helper này cho mọi local link mới, kể cả asset.

## Migration và nguồn dữ liệu

`scripts/migrate.mjs` đã import 198 chương từ thư mục cũ và 31 topic từ `NotesInterview/content/`. `migration-report.json` ghi source path/hash, dung lượng và 3 tham chiếu tới mục AI chưa có nội dung. Những tham chiếu này được giữ dưới dạng text, không tạo dead link. Các track AI chưa có chương không được đưa vào catalog.

**Không tự chạy lại `npm run migrate` sau khi đã chỉnh nội dung trong `website/src/content/`**: script là one-way import và sẽ ghi đè dữ liệu mới. Muốn đồng bộ chương cũ, thực hiện có chủ đích, review diff và giữ các cải tiến mới. `verify` đối chiếu source hash để phát hiện dữ liệu nguồn đã đổi.

File nguồn cũ được giữ nguyên. Nội dung đã import loại bỏ scripts/handlers và bố cục cũ, rewrite local links, giữ text/code/tables/details và chuyển quiz cũ sang handler chung. Câu hỏi CLI vốn nằm trong data script được render sẵn vào HTML; terminal dùng virtual filesystem local. Các demo AI riêng từng chương được tách thành script và CSS có scope trong `public/course-labs/`, không tải lại shell cũ. Không tuyên bố đã biên tập lại từng khẳng định kỹ thuật của 198 chương cũ. Khi đóng góp, cần kiểm tra API và phiên bản liên quan bằng tài liệu chính thức.

Ảnh FDown là tài liệu tham khảo local, được gitignore và không có trong `public/` hoặc Pages artifact.

## Thêm hoặc sửa nội dung

1. Sửa JSON trong `src/content/topics/` cho Notes/Interview. Mỗi `question.note` phải trỏ tới một note cùng topic. ID ổn định để bookmark không bị mất.
2. Topic mới cần entry trong thứ tự tại `src/lib/content.ts`, nội dung tại `learning.ts` và một lab thật sự dùng được. Không thêm card giả hoặc link tới chương chưa viết.
3. Case mới thêm vào `cases.ts`, cần API, data model, failure mode và trade-off riêng; không sao chép cùng một bài mẫu rồi đổi tên.
4. Đối chiếu nguồn chính thức, giữ thuật ngữ English, giải thích bằng tiếng Việt. Nêu giả định và đơn vị cho số liệu. Không trình bày số giả định thành benchmark.
5. Chạy các lệnh kiểm tra trước khi mở PR.

Các câu hỏi luyện tổng hợp được lấy từ cùng dữ liệu topic; không tạo một ngân hàng câu hỏi trùng lặp riêng.

## Kiểm tra trình duyệt

Sau build, chạy preview trên port 4321 và:

```sh
npm run test:browser
```

Script mặc định dùng Chrome macOS. Trên môi trường khác, đặt `CHROME_PATH` trỏ tới Chromium/Chrome và `PREVIEW_URL` nếu đổi địa chỉ. Báo cáo và screenshot ghi trong `artifacts/` (gitignored). Script kiểm tra hydration, từng lab trace, model behavior, search dưới base path, bookmark/import/export, quiz cũ, mobile overflow, theme, accessibility và đọc khi tắt JavaScript. Tests không dùng dữ liệu thật của người dùng.

## Deploy GitHub Pages

`.github/workflows/pages.yml` chạy check → unit tests → build → kiểm tra local links/anchors/source hashes. PR chỉ validate, không publish. Push `main` hoặc chạy workflow thủ công sẽ upload **chỉ `website/dist`** rồi deploy.

Trong GitHub repository, chọn **Settings → Pages → Build and deployment → Source: GitHub Actions**. Workflow không thay đổi deploy VPS hiện có. Repository/project path được cấu hình rõ bằng `PUBLIC_SITE_URL=https://avpegnu.github.io` và `PUBLIC_BASE_PATH=/it-basic`.

Muốn deploy ở domain/root khác, đặt hai biến tương ứng cho build **và verify**, ví dụ `PUBLIC_BASE_PATH=/`. Không dùng `file://` để test các React module hoặc search index.

## Dữ liệu học tập

Giữ key `it-basic-notes-interview-v1` và ID `n/topic/note`, `q/topic/question` để tương thích dữ liệu cũ. Progress chương dùng `it-basic-chapters-v1`; STAR draft có key riêng. Export JSON chứa bookmark/đánh giá/progress; STAR draft lưu riêng, người dùng có thể copy thủ công. Nhập JSON gộp danh sách, ưu tiên “Cần ôn” nếu có hai đánh giá, không xóa trạng thái đang có.

LocalStorage tách theo origin. Chuyển VPS sang GitHub Pages cần xuất từ trang cũ rồi nhập vào Góc học tập. Website không có tài khoản hoặc backend đồng bộ.

## Ghi nhận

[Blueprint — The System Design Handbook](https://github.com/tranhuuhuy297/interactive-system-design) của tranhuuhuy297 là nguồn tham khảo cho cách tổ chức và danh mục case study. Bản mới không sao chép code hoặc dịch nguyên bộ nội dung của repo đó. Blueprint cấp phép code theo MIT, written content theo CC BY-NC 4.0; xem các file LICENSE riêng trong repo nguồn. Từng topic/case có nguồn kỹ thuật để đọc và đối chiếu. Nguồn cũ và quyền của tài liệu bên thứ ba không tự thay đổi khi migration.
