# IT Basic

Website học nền tảng IT bằng tiếng Việt, giữ thuật ngữ chuyên ngành bằng English. Nội dung gồm lộ trình học, Notes & Interview, sơ đồ và các bài thử tương tác.

**Website:** https://avpegnu.github.io/it-basic/

## Bản website mới

Mã nguồn mới nằm trong [`website/`](website/), dùng **Astro + React + TypeScript**, xuất thành HTML tĩnh và deploy bằng GitHub Actions.

- 198 chương trong 15 lộ trình.
- 31 topic Notes & Interview, 147 notes, 387 câu hỏi chính cùng follow-up.
- 31 bài thử tương tác, sơ đồ ghi nhớ, 26 System Design case study.
- Tìm kiếm toàn văn, giao diện sáng/tối, bookmark, tiến độ và nhập/xuất dữ liệu học tập.
- Terminal CLI, câu hỏi CLI và các demo AI Foundations từ bản cũ được giữ trong bản migration.

```sh
cd website
npm ci
npm run dev
```

Mở `/it-basic/` trên địa chỉ local Astro in ra. Xem [hướng dẫn phát triển, kiểm tra, migration và deploy](website/README.md).

## Đóng góp

Bạn có thể fork repo rồi mở Pull Request; không cần được thêm collaborator. Đặt tên branch rõ ràng, giải thích vấn đề và cách kiểm chứng. Với nội dung kỹ thuật, thêm nguồn chính thức và nêu phiên bản/giả định khi cần.

```sh
cd website
npm run check
npm test
npm run build
npm run verify
```

Workflow PR kiểm tra bản build. Workflow Pages publish artifact `website/dist` từ `main`. Các thư mục kiến thức cũ vẫn được giữ làm nguồn migration; các ảnh tham khảo local được gitignore và không đưa vào Pages.

## Tham khảo

[Blueprint — The System Design Handbook](https://github.com/tranhuuhuy297/interactive-system-design) của tranhuuhuy297 được tham khảo về cách tổ chức và danh mục case study. IT Basic biên soạn nội dung và code mới riêng, không dịch nguyên bộ repo Blueprint. Xem ghi nhận chi tiết, nguồn và phạm vi giấy phép tại [website/README.md](website/README.md#ghi-nhận) và mục “Nguồn & đóng góp” trên website.
