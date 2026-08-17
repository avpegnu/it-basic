# Sub-pillar 10.4 — AI Agent · Outline 10 chương

**Folder:** `AI/Agent/`
**Theme:** Neural Paper — lệch tông **cam đất đậm** `#a35a2a`
**Ước lượng:** ~12.900 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

Agent là chủ đề bị thổi phồng nhất và bị hiểu sai nhiều nhất trong hệ sinh thái AI. Sub-pillar
này dạy agent **một cách hoài nghi có kỷ luật**.

Hai thông điệp xuyên suốt:

> **1. Phần lớn thứ được gọi là "agent" nên là workflow.** Workflow tĩnh rẻ hơn, nhanh hơn,
> dễ debug hơn, dễ đánh giá hơn. Chỉ dùng agent khi các bước **thật sự** không thể biết trước.

> **2. Agent là bề mặt tấn công.** Khi mô hình có tool, có bộ nhớ, và hành động của nó gây hậu
> quả thật, "excessive agency" trở thành rủi ro bảo mật hạng nặng — nó đã leo lên hạng 3 trong
> OWASP LLM Top 10 bản 2026.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ liên kết tới |
|---|---|---|
| Agent vs workflow | ch.1 | 10.6 ch.1 |
| Vòng lặp ReAct | ch.2 | 10.2 ch.5 |
| Thiết kế tool surface | ch.3 | 10.2 ch.6 (cơ chế) |
| MCP | ch.4 | 10.6 ch.4 (bảo mật MCP) |
| Memory | ch.5 | 10.2 ch.7 (context) |
| Multi-agent | ch.6 | — |
| Framework | ch.7 | — |
| Sandbox, computer use | ch.8 | 10.6 ch.5 |
| Đánh giá agent | ch.9 | 10.6 ch.2 |

---

## Chương 1 — Agent là gì, và khi nào KHÔNG cần agent (~1.250 dòng)

**Mục tiêu:** định nghĩa agent chính xác; phân biệt được 4 mức tự chủ; biết chọn mức thấp nhất
giải quyết được bài toán.

**Nội dung:**

1. **Định nghĩa** — agent là hệ thống trong đó **mô hình quyết định trình tự hành động** để đạt
   mục tiêu, thay vì đi theo trình tự lập trình sẵn. Đây là ranh giới duy nhất thực sự quan trọng.
2. Công thức trong sổ tay người học — `Agent = LLM + Bộ nhớ + Công cụ + Lập kế hoạch` — đúng
   nhưng thiếu: còn cần **vòng lặp**, **điều kiện dừng**, và **ranh giới quyền hạn**. Bổ sung
   công thức đầy đủ.
3. **Phổ tự chủ 4 mức** — nội dung cốt lõi:
   | Mức | Tên | Ai quyết định trình tự | Ví dụ |
   |---|---|---|---|
   | 0 | Một lời gọi | Lập trình viên | Tóm tắt, phân loại |
   | 1 | Chuỗi (chain) | Lập trình viên | Trích xuất → kiểm tra → định dạng |
   | 2 | Định tuyến / workflow có nhánh | Lập trình viên + mô hình chọn nhánh | Phân loại ý định rồi rẽ nhánh |
   | 3 | **Agent** | Mô hình | Sửa lỗi trong codebase |
4. **Quy tắc vàng: chọn mức thấp nhất giải quyết được bài toán.** Mỗi mức lên cao là đánh đổi
   độ chính xác, chi phí, độ trễ, khả năng debug lấy tính linh hoạt.
5. **Bốn tiêu chí quyết định có nên dùng agent** — độ phức tạp (có mô tả trước được các bước
   không?), giá trị (kết quả có xứng với chi phí và độ trễ cao hơn?), khả năng (mô hình có làm
   nổi tác vụ này?), chi phí sai (lỗi có phát hiện và khắc phục được không?). Trả lời "không"
   cho bất kỳ tiêu chí nào ⇒ ở mức thấp hơn.
6. **Chi phí thật của agent** — nhân số lời gọi mô hình lên nhiều lần, độ trễ tính bằng phút,
   hành vi không tất định, khó tái hiện lỗi, khó viết test
7. Agent hợp và không hợp — bảng 12 tình huống thực tế chia hai cột, kèm lý do
8. **Ba dạng lỗi kinh điển của agent** — vòng lặp vô hạn, đi lạc mục tiêu, hành động phá huỷ do
   hiểu sai. Mỗi dạng kèm cơ chế phòng (giới thiệu, chi tiết ở ch.2 và ch.8)
9. Bức tranh agent 2026 — coding agent, agent nghiên cứu, agent hỗ trợ khách hàng, agent thao
   tác máy tính; mức trưởng thành thực tế của từng loại

**Tương tác:** cây quyết định tự chủ — trả lời 4 câu hỏi, nhận khuyến nghị mức 0–3 kèm lý do và
ước tính chi phí tương đối.

**Bài tập (5):** phân loại 10 tính năng sản phẩm vào 4 mức tự chủ; lấy một agent mô tả sẵn và
viết lại thành workflow mức 2, so sánh; ước tính chi phí và độ trễ của cùng tác vụ ở mức 1 và
mức 3; liệt kê điều kiện dừng cho một agent cụ thể; tìm 3 sản phẩm gọi là "agent" nhưng thực chất
là workflow.

**Quiz (7):** ranh giới agent/workflow nằm ở đâu; vì sao nên chọn mức thấp nhất; 4 tiêu chí quyết
định; agent đắt hơn vì sao; ba dạng lỗi kinh điển; agent hợp với loại tác vụ nào; "mô hình chọn
nhánh" là mức mấy.

---

## Chương 2 — Vòng lặp agent (~1.300 dòng)

**Mục tiêu:** cài được vòng lặp agent từ đầu; hiểu điều kiện dừng và cơ chế an toàn.

**Nội dung:**

1. **Vòng lặp cốt lõi** — nhận mục tiêu → suy nghĩ → chọn hành động → thực thi → quan sát →
   lặp tới khi xong. Cài bằng ~40 dòng Python thuần, **không dùng framework** — để thấy rõ agent
   không hề huyền bí.
2. **ReAct** — xen kẽ Reasoning và Acting; vì sao xen kẽ tốt hơn lập kế hoạch trước một lần
3. **Plan-and-Execute** — lập kế hoạch trước rồi thực thi; khi nào tốt hơn ReAct (tác vụ dài,
   cần phê duyệt kế hoạch trước); nhược điểm (kế hoạch cứng, không thích ứng)
4. **Reflection / tự phê bình** — agent tự đánh giá kết quả rồi thử lại; ⚠️ với mô hình hiện đại,
   ép tự kiểm tra quá mức gây lãng phí — mô hình đã tự kiểm chứng khá tốt
5. **Điều kiện dừng** — mục an toàn quan trọng nhất:
   - Đạt mục tiêu (làm sao biết? — cần tiêu chí kiểm được)
   - Giới hạn số vòng lặp cứng
   - Giới hạn ngân sách token/chi phí
   - Giới hạn thời gian
   - Phát hiện không tiến triển (lặp lại cùng hành động)
   - Lỗi không khắc phục được
6. **Chống vòng lặp vô hạn** — phát hiện chu trình (băm chuỗi hành động gần đây), đếm hành động
   trùng lặp, ⚠️ **luôn phải có ngắt mạch cứng** — một agent hỏng có thể đốt hết ngân sách trong
   vài phút *(→ 10.2 ch.10)*
7. **Xử lý lỗi trong vòng lặp** — trả lỗi tool về cho mô hình như một quan sát (để nó tự sửa)
   thay vì ném ngoại lệ; ⚠️ nhưng phải giới hạn số lần thử lại
8. **Quản lý ngữ cảnh trong vòng lặp dài** — kết quả tool tích tụ rất nhanh; chiến lược: dọn
   kết quả cũ, tóm tắt, ghi ra tệp và chỉ giữ đường dẫn. *→ 10.2 ch.7.*
9. **Người trong vòng lặp (human-in-the-loop)** — điểm dừng phê duyệt, mức độ tin cậy tăng dần,
   cơ chế can thiệp/huỷ giữa chừng
10. Streaming tiến trình cho người dùng — hiển thị agent đang làm gì; ảnh hưởng lớn tới cảm nhận
    độ trễ và mức độ tin tưởng
11. Ghi log vết chạy (trace) — ghi mọi suy nghĩ, hành động, quan sát; **bắt buộc** để debug agent
    *(→ ch.9, 10.6 ch.3)*

**Tương tác:** **agent loop animator** — chạy từng vòng ReAct trên tác vụ mẫu ("tìm giá vé và
đặt lịch"), hiện rõ Thought / Action / Observation từng bước, có nút kích hoạt lỗi vòng lặp vô
hạn để thấy ngắt mạch hoạt động.

**Bài tập (5):** cài vòng lặp agent 40 dòng không framework với 2 tool; thêm đủ 6 điều kiện dừng;
cài phát hiện chu trình bằng hash hành động; thêm điểm phê duyệt của con người trước hành động
phá huỷ; đo số vòng lặp và chi phí trung bình trên 10 tác vụ.

**Quiz (8):** ReAct khác plan-execute ra sao; điều kiện dừng nào bắt buộc phải có; lỗi tool nên
xử lý thế nào; vì sao cần ngắt mạch chi phí; ngữ cảnh phình ra do đâu; reflection khi nào phản
tác dụng; phát hiện chu trình bằng cách nào; trace dùng để làm gì.

---

## Chương 3 — Thiết kế tool (~1.300 dòng)

**Mục tiêu:** thiết kế bộ tool để agent dùng đúng; hiểu tool là ranh giới bảo mật.

**Kiến thức cần trước:** 10.2 ch.6 (cơ chế tool calling). Chương này về **thiết kế**, không lặp
lại cơ chế.

**Nội dung:**

1. Tool là giao diện lập trình dành cho mô hình — thiết kế nó như thiết kế API cho một lập trình
   viên mới vào, có năng lực nhưng không biết ngữ cảnh nội bộ
2. **Bảy nguyên tắc thiết kế tool**:
   - Một tool một việc, ranh giới rõ
   - Tên nói lên hành động (`search_orders`, không phải `handler2`)
   - Mô tả nói **khi nào gọi**, không chỉ nó làm gì
   - Tham số ít, có kiểu chặt, dùng enum khi tập giá trị hữu hạn
   - Trả về **tín hiệu cao, nhiễu thấp** — đừng đổ nguyên JSON 5.000 dòng vào ngữ cảnh
   - Lỗi phải hữu ích và hướng dẫn được cách sửa
   - Idempotent nếu có thể
3. **Bash vs tool chuyên biệt** — đánh đổi nền tảng: bash cho sức mạnh rộng nhưng harness chỉ
   thấy một chuỗi lệnh mờ đục; tool chuyên biệt cho phép chặn, phê duyệt, hiển thị, ghi log,
   song song hoá. Khi nào nên "nâng cấp" một hành động thành tool riêng.
4. **Số lượng tool** — quá nhiều tool làm mô hình chọn sai; ngưỡng thực tế; giải pháp khi có
   hàng chục tool: nhóm theo miền, tool search / nạp trễ (defer loading)
5. **Thiết kế đầu ra tool** — phân trang, cắt bớt, tóm tắt; ⚠️ kết quả tool là nguyên nhân số một
   làm phình ngữ cảnh trong agent chạy dài
6. **Lỗi tool** — phân biệt lỗi người dùng (mô hình sửa được: sai tham số) và lỗi hệ thống (mô
   hình không sửa được: dịch vụ chết); thông điệp lỗi nên gợi ý hành động tiếp theo
7. **Tool là ranh giới bảo mật** — mục dài, quan trọng:
   - ⚠️ Tham số tool là **đầu ra mô hình** ⇒ dữ liệu không tin cậy ⇒ luôn kiểm tra hợp lệ ở
     phía thực thi, không tin schema đã đủ
   - ⚠️ Kết quả tool có thể chứa **prompt injection** (nội dung web, email, tệp người dùng gửi)
   - Đặc quyền tối thiểu cho mỗi tool; tách quyền đọc và quyền ghi
   - Cổng phê duyệt cho hành động khó hoàn tác (xoá, chuyển tiền, gửi mail, đẩy code)
   - Hạn mức tần suất cho tool tốn kém
   - Ghi log mọi lời gọi tool kèm tham số — dấu vết kiểm toán
   *→ Đào sâu ở 10.6 ch.4–5.*
8. **Gọi tool song song** — thiết kế tool để an toàn khi chạy song song; đánh dấu tool nào chỉ
   đọc (an toàn song song) và tool nào có tác dụng phụ (phải tuần tự)
9. Tool trả về tệp hoặc dữ liệu lớn — ghi ra nơi lưu trữ, trả về đường dẫn + tóm tắt thay vì nội dung
10. Kiểm thử tool — test đơn vị cho hàm, và **test "mô hình có gọi đúng tool không"** với bộ
    tình huống *(→ ch.9)*
11. Ghi tài liệu tool — mô tả tool chính là tài liệu; giữ nó đồng bộ với hành vi thật, vì mô tả
    sai lệch với hành vi là lỗi không prompt nào cứu được

**Tương tác:** trình chấm điểm mô tả tool — dán mô tả tool, nhận checklist đánh giá theo 7 nguyên
tắc kèm gợi ý cải thiện.

**Bài tập (5):** thiết kế bộ 5 tool cho agent hỗ trợ khách hàng; sửa 4 mô tả tool tồi; thêm kiểm
tra hợp lệ + cổng phê duyệt cho tool có tác dụng phụ; thiết kế phân trang cho tool trả về nhiều
dữ liệu; viết test kiểm tra mô hình chọn đúng tool trên 15 tình huống.

**Quiz (8):** mô tả tool nên nói gì; vì sao tham số tool không đáng tin; bash vs tool chuyên biệt;
quá nhiều tool gây gì; lỗi tool nên trả về thế nào; tool nào an toàn để song song; kết quả tool
có thể chứa gì nguy hiểm; đặc quyền tối thiểu áp dụng ra sao.

---

## Chương 4 — MCP: Model Context Protocol (~1.300 dòng)

**Mục tiêu:** hiểu MCP giải quyết vấn đề gì; viết được MCP server; biết rủi ro bảo mật của nó.

⚠️ Chủ đề **hoàn toàn vắng mặt** trong sổ tay người học, nhưng tính tới 2026 đây là chuẩn tích
hợp tool được cả hệ sinh thái hội tụ về.

**Nội dung:**

1. **Bài toán M×N** — trước MCP: mỗi ứng dụng AI phải tự viết tích hợp cho từng nguồn dữ liệu;
   M ứng dụng × N nguồn = M×N bản tích hợp. MCP biến nó thành M+N. *→ Cùng dạng bài toán mà
   LSP giải cho IDE và ngôn ngữ lập trình — dùng phép so sánh này.*
2. **Kiến trúc MCP** — host, client, server; server phơi bày ba loại năng lực:
   - **Tools** — hàm mô hình gọi được
   - **Resources** — dữ liệu mô hình đọc được
   - **Prompts** — mẫu prompt dùng lại được
3. **Transport** — stdio (server chạy cục bộ) và HTTP streamable (server từ xa); bản spec
   2026-07-28 chuyển sang lõi **stateless** để mở rộng ngang dễ hơn — ghi rõ ngày kiểm chứng
4. **Vòng đời phiên** — khởi tạo, trao đổi năng lực, gọi tool, huỷ
5. **Viết MCP server** — làm từng bước bằng Python SDK: định nghĩa tool, khai báo schema, xử lý
   lời gọi, chạy thử bằng công cụ inspector
6. **Kết nối MCP server** — đăng ký trong ứng dụng host; cấu hình; xác thực
7. **Hệ sinh thái MCP 2026** — server phổ biến (hệ thống tệp, Git/GitHub, CSDL, tìm kiếm, công cụ
   công việc); cách tìm và đánh giá server của bên thứ ba; số liệu áp dụng có ghi ngày kiểm chứng
8. **Bảo mật MCP** — mục bắt buộc, đây là chỗ nguy hiểm nhất:
   - ⚠️ **MCP server là mã của bên thứ ba chạy với quyền của bạn** — cài server không rõ nguồn
     gốc tương đương cài extension tuỳ tiện
   - ⚠️ **Tool poisoning** — mô tả tool độc hại chứa chỉ dẫn ẩn cho mô hình
   - ⚠️ **Confused deputy** — server có quyền cao thực hiện hành động thay cho đầu vào không tin cậy
   - Xác thực và quản lý bí mật: ⚠️ **không nhét khoá API vào prompt** — dùng cơ chế lưu trữ bí
     mật của host
   - Kiểm soát egress mạng, chạy trong sandbox, rà soát danh sách tool
   *→ Nối 10.6 ch.4.*
9. **MCP vs tool calling gốc** — bảng: khi nào MCP đáng (nhiều tích hợp, dùng lại giữa nhiều
   ứng dụng, hệ sinh thái có sẵn), khi nào tool gốc đơn giản hơn (1–2 tool nội bộ)
10. Debug MCP — inspector, log, lỗi thường gặp

**Tương tác:** trình khám phá MCP — sơ đồ host/client/server tương tác; bấm vào từng thành phần
xem trách nhiệm; xem luồng thông điệp JSON-RPC của một lời gọi tool.

**Bài tập (5):** viết MCP server phơi bày 3 tool (đọc tệp, tìm kiếm, ghi ghi chú); kết nối server
đó vào một ứng dụng host và thử; thêm xác thực; kiểm thử tool poisoning bằng mô tả tool chứa chỉ
dẫn ẩn và quan sát hành vi; đánh giá bảo mật một MCP server công khai theo checklist.

**Quiz (8):** MCP giải bài toán gì; ba loại năng lực của server; stdio vs HTTP dùng khi nào;
tool poisoning là gì; MCP server chạy với quyền của ai; confused deputy nghĩa là gì; khi nào
không cần MCP; bí mật nên lưu ở đâu.

---

## Chương 5 — Bộ nhớ cho agent (~1.200 dòng)

**Mục tiêu:** thiết kế được hệ thống bộ nhớ; biết khi nào bộ nhớ gây hại.

**Nội dung:**

1. Vì sao cần bộ nhớ — API stateless; agent chạy dài vượt cửa sổ ngữ cảnh; người dùng mong hệ
   thống nhớ giữa các phiên
2. **Phân loại bộ nhớ** — bảng 4 loại kèm ví dụ và cách cài:
   - Ngữ cảnh làm việc (trong một lượt)
   - Bộ nhớ phiên (trong một cuộc hội thoại)
   - Bộ nhớ dài hạn (giữa các phiên)
   - Bộ nhớ chia sẻ (giữa nhiều agent) *(→ ch.6)*
3. **Bộ nhớ phiên** — cửa sổ trượt, tóm tắt, lai; đánh đổi *(nối 10.2 ch.7)*
4. **Bộ nhớ dài hạn** — ba cách cài:
   - Bộ nhớ dạng tệp — agent tự ghi/đọc ghi chú; đơn giản, minh bạch, dễ kiểm toán
   - Bộ nhớ vector — nhúng ký ức, truy xuất theo độ liên quan *(nối 10.3)*
   - Bộ nhớ có cấu trúc — CSDL với schema rõ (sở thích, dữ kiện, thực thể)
5. **Ghi cái gì** — vấn đề khó nhất: mô hình có xu hướng ghi quá nhiều thứ vô dụng. Tiêu chí:
   thông tin bền vững, không suy ra được từ dữ liệu khác, sẽ dùng lại. Ghi có chọn lọc.
6. **Lấy lại khi nào** — luôn nạp vs truy xuất theo liên quan; ngân sách token cho bộ nhớ
7. **Quên và cập nhật** — dữ kiện lỗi thời; giải quyết mâu thuẫn (ký ức mới đè ký ức cũ);
   xoá theo yêu cầu; đánh phiên bản
8. **Khi bộ nhớ gây hại** — mục quan trọng, ít tài liệu nói:
   - Ký ức sai kéo dài vĩnh viễn, đầu độc mọi phiên sau
   - ⚠️ Prompt injection ghi vào bộ nhớ = tấn công dai dẳng
   - Nhiễu bộ nhớ làm loãng ngữ cảnh
   - Vấn đề riêng tư: người dùng không biết hệ thống nhớ gì về mình
9. **Bảo mật và quyền riêng tư bộ nhớ** — ⚠️ tuyệt đối không lưu bí mật/khoá API vào bộ nhớ (nó
   được phát lại vào ngữ cảnh ở mọi phiên sau); PII và quyền được xoá (GDPR); cách ly theo người
   dùng; kiểm toán. *→ 10.6 ch.8.*
10. Thiết kế UI cho bộ nhớ — cho người dùng xem, sửa, xoá những gì hệ thống nhớ về họ; đây là
    yêu cầu sản phẩm lẫn yêu cầu pháp lý

**Tương tác:** trình khám phá bộ nhớ — mô phỏng 5 phiên hội thoại, xem bộ nhớ tích tụ ra sao,
với nút chèn một ký ức sai để thấy nó lan sang các phiên sau.

**Bài tập (5):** cài bộ nhớ dạng tệp cho agent với tiêu chí ghi rõ ràng; cài bộ nhớ vector và so
sánh chất lượng truy xuất; thiết kế cơ chế giải quyết mâu thuẫn giữa ký ức cũ và mới; kiểm thử
tấn công đầu độc bộ nhớ; xây giao diện cho người dùng xem/xoá bộ nhớ.

**Quiz (7):** 4 loại bộ nhớ khác nhau ra sao; tiêu chí ghi ký ức; ký ức sai nguy hiểm thế nào;
đầu độc bộ nhớ hoạt động ra sao; vì sao không lưu bí mật trong bộ nhớ; GDPR yêu cầu gì; bộ nhớ
vector vs bộ nhớ tệp.

---

## Chương 6 — Multi-agent (~1.250 dòng)

**Mục tiêu:** biết mẫu multi-agent; **và biết rằng phần lớn trường hợp không nên dùng**.

**Nội dung:**

1. Vì sao người ta muốn multi-agent — chuyên môn hoá, song song hoá, cách ly ngữ cảnh
2. **Vì sao phần lớn hệ multi-agent thất bại** — đặt thẳng lên đầu chương:
   - Chi phí và độ trễ nhân lên theo số agent
   - Mỗi lần bàn giao là một lần **mất mát ngữ cảnh** — agent nhận việc không thấy hội thoại gốc
   - Lỗi lan truyền và khuếch đại
   - Debug cực khó — lỗi ở agent nào, do bàn giao hay do bản thân?
   - Agent ghi đè công việc của nhau khi dùng chung tài nguyên
   - **Một agent tốt với bộ tool tốt thường thắng năm agent chuyên môn hoá**
3. **Ba trường hợp multi-agent thật sự đáng**:
   - Toả nhánh song song thật sự (đọc 20 tài liệu độc lập, xử lý 100 bản ghi)
   - Việc đọc nặng làm ngập ngữ cảnh của agent chính → giao cho worker rẻ hơn
   - Cần **góc nhìn độc lập** (nhiều người review cùng một thay đổi, mỗi người một lăng kính)
4. **Các mẫu kiến trúc**:
   - Orchestrator–worker (phổ biến và ổn định nhất)
   - Pipeline tuần tự (chuyên gia nối tiếp)
   - Bàn giao (handoff) — chuyển hẳn quyền điều khiển
   - Tranh luận / bỏ phiếu — nhiều agent, hợp nhất kết quả
   - Blackboard — trạng thái chung
5. **Thiết kế giao tiếp** — mỗi nhiệm vụ giao đi phải **tự chứa**: đường dẫn, ràng buộc, định
   dạng báo cáo mong đợi. Agent con **không thấy** hội thoại của agent cha — đây là hiểu lầm
   phổ biến nhất.
6. **Tối ưu chi phí** — dùng mô hình nhỏ rẻ cho worker đọc-nhiều, mô hình mạnh cho orchestrator
   lập kế hoạch và tổng hợp; kèm số liệu ví dụ
7. **Trạng thái chia sẻ** — hệ thống tệp chung, CSDL, hàng đợi; ⚠️ tranh chấp ghi và cách phòng
8. **Điều phối và giới hạn** — số agent chạy đồng thời tối đa, ngân sách tổng, phát hiện bế tắc
9. Đánh giá hệ multi-agent — đo từng agent riêng và đo toàn hệ; xác định agent nào là điểm nghẽn
   *(→ ch.9)*
10. **Danh sách kiểm tra trước khi dùng multi-agent** — 8 câu hỏi, nếu không trả lời được hết thì
    quay về một agent

**Tương tác:** trình mô phỏng orchestrator–worker — xem nhiệm vụ toả ra 3 worker, kết quả gom về;
so sánh chi phí/thời gian với phương án một agent tuần tự.

**Bài tập (5):** cài mẫu orchestrator–worker cho tác vụ nghiên cứu 5 nguồn; đo chi phí và thời
gian so với một agent làm tuần tự; thiết kế thông điệp giao việc tự chứa cho worker; xử lý ca
worker thất bại; tìm 3 hệ multi-agent mô tả sẵn và chỉ ra cái nào nên gộp lại thành một.

**Quiz (7):** vì sao multi-agent hay thất bại; mất mát ngữ cảnh xảy ra ở đâu; ba trường hợp đáng
dùng; orchestrator nên dùng mô hình nào; agent con thấy gì của agent cha; trạng thái chung rủi
ro gì; đo hiệu năng hệ multi-agent thế nào.

---

## Chương 7 — Agent framework (~1.200 dòng)

**Mục tiêu:** chọn được framework phù hợp; biết khi nào không cần framework nào cả.

**Nội dung:**

1. **Bạn cần framework không?** — mở đầu bằng câu hỏi này. Vòng lặp agent cơ bản là ~40 dòng
   (đã tự viết ở ch.2). Framework đáng dùng khi cần: quản lý trạng thái, khôi phục sau lỗi,
   quan sát được, điều phối phức tạp.
2. **Hai họ framework**:
   - **SDK của nhà cung cấp** — tối ưu cho một họ mô hình, ít lớp trừu tượng, bám sát tính năng mới
   - **Framework độc lập** — chạy đa nhà cung cấp, trừu tượng hoá dày hơn
3. **Bốn kiểu điều khiển** — trục phân loại hữu ích hơn là danh sách tên:
   - Dựa trên đồ thị (bạn khai báo tường minh các nút và cạnh) — kiểm soát cao nhất
   - Vòng lặp do mô hình dẫn dắt — đơn giản, ít kiểm soát
   - Dựa trên vai trò — mô tả các "nhân vật" và để chúng phối hợp
   - Tự viết — kiểm soát tuyệt đối, tự lo mọi thứ
4. **Bảng so sánh 8 framework** (8/2026, ghi ngày kiểm chứng): LangGraph, OpenAI Agents SDK,
   Claude Agent SDK, Google ADK, Pydantic AI, CrewAI, Mastra, Vercel AI SDK, Microsoft Agent
   Framework — theo: ngôn ngữ, kiểu điều khiển, độ trưởng thành, hỗ trợ MCP, quan sát được,
   phù hợp với ai
5. **Điểm hội tụ: MCP** — cả hệ sinh thái đã hội tụ về MCP làm chuẩn tích hợp tool, nghĩa là
   **tool viết dạng MCP server dùng lại được giữa các framework**. Đây là lập luận mạnh cho việc
   đầu tư vào tool chứ không đầu tư vào framework.
6. **Chi phí của lớp trừu tượng** — framework che mất prompt thật gửi đi; hệ quả với debug và
   tối ưu chi phí; cách nhìn xuyên qua lớp trừu tượng (bật log request thô)
7. **Khoá cứng vào nhà cung cấp (lock-in)** — cái gì di chuyển được (tool, prompt, eval) và cái
   gì không (mã điều phối); chiến lược giảm thiểu
8. **Khung chọn framework** — 6 câu hỏi: ngôn ngữ đội đang dùng? cần đa nhà cung cấp không?
   cần kiểm soát luồng tới mức nào? cần trạng thái bền vững không? có sẵn nền quan sát chưa?
   quy mô nhóm?
9. **Khuyến nghị thực dụng** — bắt đầu không framework để hiểu cơ chế → thêm framework khi thấy
   đau thật, không thêm trước; đầu tư nhiều vào tool và eval, ít vào framework
10. Di chuyển giữa framework — cái gì phải viết lại, ước lượng công sức

**Tương tác:** trình so sánh framework — chọn tiêu chí quan trọng, xem bảng lọc lại và gợi ý
2–3 lựa chọn kèm lý do.

**Bài tập (5):** cài cùng một agent bằng 2 cách (thuần + 1 framework) và so sánh số dòng code,
khả năng debug, chi phí; bật log request thô của framework và xem prompt thật; chuyển một agent
từ framework này sang framework khác; đánh giá 3 framework theo khung 6 câu hỏi cho bối cảnh của
mình; đóng gói một tool thành MCP server để dùng lại được ở cả 2 framework.

**Quiz (7):** khi nào cần framework; 4 kiểu điều khiển; MCP giúp gì cho tính di động; lớp trừu
tượng che mất cái gì; nên đầu tư vào đâu thay vì framework; framework đồ thị mạnh ở đâu; lock-in
nằm ở phần nào.

---

## Chương 8 — Agent trong sandbox: thực thi mã, thao tác máy tính (~1.250 dòng)

**Mục tiêu:** cho agent chạy mã và thao tác giao diện một cách an toàn.

**Nội dung:**

1. Vì sao agent cần chạy mã — tính toán chính xác, phân tích dữ liệu, tạo tệp, tự kiểm chứng
   kết quả. **Đừng bắt mô hình làm việc mà trình thông dịch làm tốt hơn.**
2. **Mô hình sandbox** — container, microVM, WASM, dịch vụ thực thi của nhà cung cấp; đánh đổi
   giữa mức cách ly, thời gian khởi động, và khả năng
3. **Cách ly** — hệ thống tệp, mạng, CPU/bộ nhớ, thời gian chạy; ⚠️ **mặc định chặn egress mạng**
   — mã do mô hình sinh mà có mạng là đường rò rỉ dữ liệu. *→ Nối DevOps ch.5 (namespaces/cgroups),
   OS ch.2 (process).*
4. Vòng đời sandbox — tạo, tái sử dụng giữa các bước, dọn dẹp; đánh đổi giữa giữ trạng thái và
   cách ly
5. **Programmatic tool calling** — agent viết mã gọi tool trong sandbox; kết quả trung gian ở lại
   trong mã, chỉ kết quả cuối vào ngữ cảnh. Tiết kiệm token đáng kể cho tác vụ nhiều bước.
6. **Computer use** — agent chụp màn hình và điều khiển chuột/bàn phím; trạng thái trưởng thành
   thực tế; độ phân giải và chi phí token *(nối 10.2 ch.8)*; ⚠️ rủi ro rất cao
7. **Tự động hoá trình duyệt** — Playwright/Puppeteer vs computer use; khi nào dùng cái nào
   (DOM có cấu trúc thì đừng nhìn ảnh)
8. **Bảo mật cho agent hành động** — mục dài:
   - ⚠️ Prompt injection từ nội dung web mà agent đọc — kịch bản tấn công đầy đủ
   - Đặc quyền tối thiểu; tài khoản riêng cho agent, không dùng tài khoản người thật
   - Phê duyệt cho hành động khó hoàn tác
   - Danh sách trắng domain
   - Ghi log và phát lại được mọi hành động
   *→ 10.6 ch.4–5.*
9. **Agent lập trình** — trường hợp trưởng thành nhất: đọc/sửa tệp, chạy test, commit; vì sao
   test là vòng phản hồi lý tưởng cho agent (tiêu chí thành công kiểm được bằng máy)
10. Quản lý tài nguyên — giới hạn thời gian chạy, bộ nhớ, số sandbox đồng thời, chi phí

**Tương tác:** trình khám phá ranh giới sandbox — bấm vào từng lớp cách ly (tệp, mạng, tài nguyên,
thời gian) để xem nó chặn kiểu tấn công nào.

**Bài tập (5):** chạy agent thực thi mã trong container có giới hạn tài nguyên; cài chặn egress
mạng và kiểm chứng; xây agent phân tích CSV rồi tự kiểm chứng bằng mã; kiểm thử kịch bản prompt
injection qua trang web agent đọc; thiết kế cổng phê duyệt cho agent lập trình trước khi commit.

**Quiz (7):** vì sao chặn mạng trong sandbox; programmatic tool calling tiết kiệm gì; computer
use vs Playwright; agent nên chạy dưới tài khoản nào; injection qua nội dung web hoạt động thế
nào; vì sao test là vòng phản hồi tốt cho agent lập trình; sandbox tái sử dụng đánh đổi gì.

---

## Chương 9 — Đánh giá agent (~1.250 dòng)

**Mục tiêu:** đo được agent bằng số; biết agent hỏng ở bước nào.

**Nội dung:**

1. Vì sao đánh giá agent khó hơn đánh giá một lời gọi — nhiều bước, không tất định, nhiều đường
   đi đúng, tác dụng phụ ra thế giới thật
2. **Ba tầng đánh giá**:
   - **Kết quả (outcome)** — có hoàn thành nhiệm vụ không? Chỉ số quan trọng nhất.
   - **Đường đi (trajectory)** — có đi đường hợp lý không? gọi đúng tool không? bao nhiêu bước?
   - **Từng bước (step)** — mỗi lời gọi tool có đúng tham số không?
3. **Định nghĩa "thành công"** — phần khó nhất; ba cách: khẳng định tất định (test pass, tệp tồn
   tại, bản ghi CSDL đúng — **luôn ưu tiên cách này**), LLM-as-judge, chấm tay
4. **Chỉ số cốt lõi** — tỉ lệ hoàn thành nhiệm vụ, số bước trung bình, chi phí trên mỗi nhiệm vụ
   hoàn thành (chỉ số kinh tế quan trọng nhất), độ trễ p95, tỉ lệ dùng tool đúng, tỉ lệ can thiệp
   của con người
5. **Xây bộ kiểm thử agent** — 30–100 nhiệm vụ có mức khó tăng dần; phải có nhiệm vụ **không thể
   hoàn thành** (kiểm tra agent có biết bỏ cuộc đúng lúc không) và nhiệm vụ có **bẫy injection**
6. **Môi trường tái lập được** — cố định trạng thái ban đầu, giả lập dịch vụ ngoài, quản lý tính
   không tất định (chạy nhiều lần, báo cáo phân bố thay vì một con số)
7. **Phân tích đường đi** — trực quan hoá vết chạy, tìm mẫu lỗi phổ biến: lặp, dùng sai tool,
   bỏ cuộc sớm, đi lạc mục tiêu
8. **Đánh giá theo lăng kính** — nhiều người chấm với tiêu chí khác nhau (đúng đắn / an toàn /
   hiệu quả) thay vì nhiều người chấm giống nhau; đa dạng bắt được lỗi mà lặp lại không bắt được
9. Eval online — tỉ lệ thành công thực tế, tỉ lệ người dùng huỷ giữa chừng, tỉ lệ leo thang sang
   người, phản hồi
10. **Kiểm thử hồi quy** — chạy bộ eval khi đổi prompt/tool/mô hình; ngưỡng chặn triển khai
    *(→ 10.6 ch.9)*
11. **Red teaming agent** — chủ động thử tấn công: injection qua tool result, cố làm agent lặp vô
    hạn, cố khiến agent vượt quyền *(→ 10.6 ch.4)*

**Tương tác:** trình xem vết chạy (trace viewer) — 3 vết chạy mẫu (thành công / lặp vô hạn /
đi lạc mục tiêu), xem từng bước và chỗ hỏng được đánh dấu.

**Bài tập (5):** xây bộ 20 nhiệm vụ có khẳng định tất định; đo tỉ lệ thành công và chi phí trên
mỗi nhiệm vụ; phân tích 10 vết chạy thất bại và phân loại nguyên nhân; thêm 5 nhiệm vụ bẫy
injection và đo tỉ lệ chống chịu; dựng eval agent chạy trong CI.

**Quiz (8):** ba tầng đánh giá agent; vì sao ưu tiên khẳng định tất định; chi phí trên mỗi nhiệm
vụ hoàn thành đo gì; bộ eval cần nhiệm vụ loại nào; xử lý tính không tất định ra sao; đánh giá
theo lăng kính là gì; red teaming agent làm gì; đo agent online bằng chỉ số nào.

---

## Chương 10 — Dự án: agent end-to-end (~1.300 dòng)

**Mục tiêu:** xây một agent hoàn chỉnh có tool, bộ nhớ, guardrails, eval và giám sát.

**Nội dung:**

1. Đề bài — **agent phân loại và xử lý issue kỹ thuật**: đọc issue mới, phân loại, tìm mã liên
   quan, đề xuất hướng sửa, gắn nhãn, hỏi lại người báo nếu thiếu thông tin.
   *(Chọn đề bài này vì: có tiêu chí thành công kiểm được, có tool đa dạng, có rủi ro thật, và
   sinh viên IT hiểu ngay bối cảnh.)*
2. **Quyết định mức tự chủ** — đi qua khung 4 tiêu chí ở ch.1, biện luận vì sao đề bài này thật
   sự cần mức 3, và phần nào của nó nên để ở mức 2
3. **Thiết kế bộ tool** — 7 tool: đọc issue, tìm mã, đọc tệp, tìm issue tương tự, gắn nhãn,
   bình luận, leo thang cho người. Phân loại chỉ-đọc vs có-tác-dụng-phụ.
4. **Vòng lặp agent** — cài đầy đủ với 6 điều kiện dừng, ngắt mạch chi phí, phát hiện chu trình
5. **Bộ nhớ** — nhớ quy ước của repo, phân loại đã làm trước đó, phản hồi từ maintainer
6. **Guardrails** — kiểm tra hợp lệ tham số, phê duyệt trước khi bình luận công khai, hạn mức
   tần suất, ⚠️ xử lý nội dung issue như dữ liệu không tin cậy (issue là do người ngoài viết —
   đây là véc-tơ injection thật)
7. **Observability** — vết chạy đầy đủ, log có cấu trúc, chỉ số theo bước. *→ 10.6 ch.3.*
8. **Eval** — 30 issue thật có nhãn chuẩn; chỉ số: độ chính xác phân loại, tỉ lệ tìm đúng mã liên
   quan, tỉ lệ đề xuất hữu ích, chi phí mỗi issue; kèm 5 issue bẫy injection
9. **Triển khai theo giai đoạn** — chế độ chỉ-quan-sát (agent đề xuất, người quyết) → bán tự động
   (tự làm việc rủi ro thấp) → tự động cho các loại đã chứng minh an toàn. Tiêu chí lên giai đoạn.
10. **Chi phí và mở rộng** — chi phí mỗi issue, chạy đồng thời, hàng đợi khi tải cao
11. **Hồi cứu (postmortem)** — 5 chế độ hỏng dự đoán trước được và cơ chế phòng cho từng cái
12. **Checklist agent production 20 mục**

**Tương tác:** trình mô phỏng agent — chạy agent trên 3 issue mẫu, xem từng bước, có nút chèn
nội dung injection để thấy guardrail hoạt động.

**Bài tập (5):** xây agent hoàn chỉnh theo đặc tả; thêm bộ eval 20 nhiệm vụ và đạt ngưỡng đề ra;
thêm cổng phê duyệt và kiểm thử; chạy red team 10 kịch bản tấn công; viết tài liệu vận hành 2
trang (runbook) cho agent.

**Quiz (8):** vì sao đề bài này cần mức 3; tool nào cần phê duyệt; nội dung issue có đáng tin
không; điều kiện dừng nào quan trọng nhất ở đây; chế độ chỉ-quan-sát để làm gì; đo chi phí mỗi
issue thế nào; bộ nhớ giúp gì cho agent này; chế độ hỏng nào nguy hiểm nhất.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | Agent là gì, và khi nào KHÔNG cần agent | 1.250 |
| 2 | Vòng lặp agent | 1.300 |
| 3 | Thiết kế tool | 1.300 |
| 4 | MCP: Model Context Protocol | 1.300 |
| 5 | Bộ nhớ cho agent | 1.200 |
| 6 | Multi-agent | 1.250 |
| 7 | Agent framework | 1.200 |
| 8 | Agent trong sandbox | 1.250 |
| 9 | Đánh giá agent | 1.250 |
| 10 | Dự án: agent end-to-end | 1.300 |
| | **Tổng** | **~12.600 dòng · 50 bài tập · 75 quiz** |
