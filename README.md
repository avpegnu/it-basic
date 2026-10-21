# IT Basic

Tài liệu học nền tảng IT bằng tiếng Việt, giữ các thuật ngữ chuyên ngành bằng English. Website dùng HTML, CSS và JavaScript, gồm các chương học, ví dụ, bài tập, Notes và câu hỏi Interview.

## Nội dung

- Lập trình, OOP, DSA và các ngôn ngữ JavaScript, Python, Java, Dart.
- OS, CLI, Networking, Database và System Design.
- Flutter, Fullstack, DevOps và AI.
- Notes & Interview được tổ chức theo topic trong `NotesInterview/`.

## Chạy local

Từ thư mục repo:

```sh
python3 -m http.server 8000
```

Mở <http://localhost:8000/>. Nội dung và tài nguyên nằm trong các thư mục kiến thức tương ứng; trang chính là `index.html`.

## Notes & Interview

Dữ liệu nằm trong `NotesInterview/content/`. Sau khi chỉnh nội dung, sinh lại các trang và kiểm tra:

```sh
node tools/build-notes-interview.js
node tools/check-notes-interview.js
```

Đối chiếu tài liệu kỹ thuật chính thức khi cập nhật kiến thức; giữ ID câu hỏi và note ổn định để dữ liệu học tập tiếp tục hoạt động.

## AV Lore

Website học tập Astro được phát triển độc lập tại [avpegnu/av-lore](https://github.com/avpegnu/av-lore), xem tại **[avpegnu.github.io/av-lore](https://avpegnu.github.io/av-lore/)**. Folder local tương ứng là `../av-lore/`.

Đọc [AGENTS.md](AGENTS.md) để cập nhật nội dung tương ứng giữa hai repo. IT Basic giữ cấu trúc HTML hiện tại; cấu hình, giao diện và deploy của mỗi website được quản lý riêng.

## Deploy

Workflow `.github/workflows/deploy.yml` đồng bộ website lên VPS khi push `main`. Hướng dẫn cấu hình nằm trong [deploy/SETUP.md](deploy/SETUP.md). GitHub Pages của AV Lore được quản lý trong repo riêng.
