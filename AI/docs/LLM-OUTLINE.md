# Sub-pillar 10.2 — LLM & Prompt Engineering · Outline 10 chương

**Folder:** `AI/LLM/`
**Theme:** Neural Paper — tông gốc **chàm-tím trầm** `#5b4b8a`
**Ước lượng:** ~13.000 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

Đây là **trung tâm của cả trụ cột**. Ba sub-pillar sau (RAG, Agent, Production) đều dựng trên
những gì học ở đây. Nếu người học chỉ có thời gian cho một sub-pillar, đây là sub-pillar đó.

Nguyên tắc riêng: **tách phần bền vững ra khỏi phần dễ lỗi thời.** Cơ chế (tokenization,
sampling, cửa sổ ngữ cảnh, tool calling) gần như không đổi; tên mô hình và bảng giá đổi vài
tháng một lần. Mọi số liệu dễ đổi gom vào ch.2 và ch.10, có ghi ngày kiểm chứng và nguồn tra lại.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ liên kết tới |
|---|---|---|
| Tokenization, token economics | ch.1 | 10.3 ch.4, 10.6 ch.7 |
| Cửa sổ ngữ cảnh | ch.1 | ch.7, 10.3 ch.6 |
| Sampling (temperature/top-p) | ch.1 | 10.6 ch.2 |
| Chọn mô hình | ch.2 | 10.6 ch.7 |
| Streaming, retry, lỗi API | ch.3 | 10.6 ch.6 |
| Kỹ thuật prompting | ch.4–5 | mọi nơi |
| Tool calling / function calling | ch.6 | 10.4 ch.3 (thiết kế tool) |
| Prompt caching | ch.7 | 10.6 ch.6 |
| Ảo giác (hallucination) | ch.9 | 10.3 ch.7 |
| Chi phí & độ trễ | ch.10 | 10.6 ch.7 (FinOps) |

---

## Chương 1 — LLM hoạt động thế nào (~1.400 dòng)

**Mục tiêu:** giải thích được vòng đời một lượt sinh văn bản từ chuỗi ký tự tới token đầu ra;
hiểu token, cửa sổ ngữ cảnh, và các tham số sampling ảnh hưởng ra sao.

**Kiến thức cần trước:** 10.1 ch.10 (Transformer).

**Nội dung:**

1. **Một câu tóm tắt:** LLM là cỗ máy dự đoán token kế tiếp, được huấn luyện trên lượng văn bản
   khổng lồ. Mọi thứ khác đều là hệ quả của câu này — bao gồm cả điểm mạnh lẫn ảo giác.
2. **Ba giai đoạn huấn luyện** — tiền huấn luyện (dự đoán token kế tiếp trên corpus lớn),
   tinh chỉnh theo chỉ dẫn (SFT), căn chỉnh theo sở thích người dùng (RLHF/DPO).
   Nêu rõ giai đoạn nào tạo ra "khả năng", giai đoạn nào tạo ra "sự hữu ích và an toàn".
   *→ Chi tiết kỹ thuật ở 10.5.*
3. **Tokenization** — vì sao không dùng ký tự và không dùng từ; BPE hoạt động thế nào;
   token ≠ từ; **tiếng Việt tốn nhiều token hơn tiếng Anh** (dấu, âm tiết rời) — hệ quả trực
   tiếp lên chi phí, có ví dụ đo cụ thể
4. **Từ token tới vector** — ma trận embedding; vì sao hai token nghĩa gần nhau có vector gần nhau
5. **Bên trong một lượt sinh** — token vào → N khối Transformer → logits trên toàn bộ từ vựng →
   softmax → chọn 1 token → nối vào chuỗi → lặp lại. Nhấn mạnh: **mô hình sinh từng token một,
   không "nghĩ ra cả câu rồi viết"**.
6. **Sampling** — greedy, temperature, top-k, top-p (nucleus); ảnh hưởng cụ thể lên đầu ra;
   `temperature=0` không đảm bảo hoàn toàn tất định (và vì sao)
7. **Cửa sổ ngữ cảnh** — là gì, đo bằng token; đầu vào + đầu ra cùng chia sẻ ngân sách; điều gì
   xảy ra khi vượt; "lost in the middle" — thông tin giữa ngữ cảnh dài bị chú ý kém hơn
8. **Prefill vs decode** — hai pha có đặc tính khác nhau: prefill song song và tính-toán-nặng,
   decode tuần tự và bộ-nhớ-nặng. Đây là nền tảng để hiểu vì sao token đầu ra đắt hơn token
   đầu vào (thường 4–5 lần) và vì sao có prompt caching. *→ 10.5 ch.6.*
9. **KV cache** — mô hình nhớ gì giữa các token trong cùng một lượt; vì sao nó ăn VRAM
10. Mô hình suy luận (reasoning model) — sinh chuỗi suy nghĩ trước khi trả lời; token suy nghĩ
    vẫn tính tiền; khi nào đáng dùng. *→ Prompting cho reasoning model ở ch.5.*
11. Những gì LLM **về bản chất** không làm được — không có trạng thái giữa các request (stateless),
    không tự cập nhật kiến thức, không tính toán chính xác đáng tin, không biết mình không biết

**Tương tác:**
- **Tokenizer visualizer** — gõ tiếng Việt/tiếng Anh, xem ranh giới token + đếm; đối chiếu trực
  tiếp chi phí 2 ngôn ngữ cho cùng nội dung
- **Sampling playground** — kéo temperature/top-k/top-p, xem phân phối xác suất biến dạng

**Bài tập (5):** đo số token của cùng một đoạn văn ở 2 ngôn ngữ và tính chênh lệch chi phí;
dự đoán đầu ra ở 3 mức temperature rồi kiểm chứng; tính ngân sách token cho một hội thoại 20
lượt; giải thích vì sao mô hình đếm chữ cái trong từ hay sai (gợi ý: tokenization); vẽ sơ đồ
vòng lặp sinh token.

**Quiz (8):** token có phải từ không; vì sao token đầu ra đắt hơn; cửa sổ ngữ cảnh chứa gì;
temperature=0 có tất định tuyệt đối không; top-p khác top-k; KV cache lưu gì; prefill vs decode;
vì sao LLM không nhớ hội thoại trước.

---

## Chương 2 — Bức tranh mô hình 2026 và cách chọn (~1.200 dòng)

**Mục tiêu:** biết cách **chọn** mô hình theo bài toán, không phải nhớ tên mô hình; đọc được
benchmark một cách hoài nghi.

⚠️ **Chương dễ lỗi thời nhất của trụ cột.** Cấu trúc để giảm thiểu: 70% là khung quyết định
bền vững, 30% là bảng số liệu có ghi ngày kiểm chứng + link tra lại.

**Nội dung:**

1. Ba trục phân loại — closed-weights qua API / open-weights tự host / mô hình nhỏ trên thiết bị;
   đánh đổi của mỗi trục (kiểm soát, chi phí, quyền riêng tư, công sức vận hành)
2. Bức tranh nhà cung cấp tính tới 8/2026 — Anthropic, OpenAI, Google, Meta, Mistral, Qwen,
   DeepSeek, Cohere. Bảng có **ghi rõ ngày kiểm chứng** và hướng dẫn tra lại giá/ID chính thức.
3. **Bậc mô hình trong cùng một nhà** — flagship / cân bằng / nhỏ-nhanh; đây mới là thứ cần nhớ,
   vì mọi nhà cung cấp đều tổ chức theo mô hình này. Ví dụ minh hoạ với họ Claude
   (Opus / Sonnet / Haiku) và cách ánh xạ sang các nhà khác.
4. **Khung chọn mô hình 5 câu hỏi** — nội dung cốt lõi của chương:
   - Tác vụ khó tới đâu (phân loại đơn giản ↔ suy luận nhiều bước)?
   - Ràng buộc độ trễ là gì (chat thời gian thực ↔ chạy nền)?
   - Ngân sách trên mỗi request?
   - Dữ liệu có được rời khỏi hạ tầng không?
   - Có cần đa phương thức / gọi tool / cửa sổ ngữ cảnh lớn không?
5. **Định tuyến mô hình (model routing)** — dùng mô hình nhỏ cho phần lớn lưu lượng, chỉ leo
   thang lên mô hình lớn khi cần; mẫu thiết kế và cách đo hiệu quả
6. **Benchmark và giới hạn của benchmark** — MMLU, GPQA, SWE-bench, HumanEval là gì; ba vấn đề:
   nhiễm dữ liệu huấn luyện, tối ưu-để-thi, và **benchmark không đo được cái bạn cần**.
   Kết luận: **eval riêng trên dữ liệu của bạn quan trọng hơn mọi bảng xếp hạng.**
   *→ 10.6 ch.2.*
7. Open-weights: khi nào đáng — quyền riêng tư, tuỳ biến sâu, chi phí ở quy mô rất lớn, không
   phụ thuộc nhà cung cấp; kèm chi phí ẩn (vận hành GPU, cập nhật, đội ngũ). *→ 10.5 ch.6–7.*
8. Mô hình nhỏ (SLM) và chạy cục bộ — Ollama, llama.cpp; khi nào 8B đủ dùng
9. Nghĩa vụ khi lệ thuộc nhà cung cấp — mô hình bị ngừng hỗ trợ, giá đổi, hành vi đổi giữa các
   phiên bản; chiến lược: lớp trừu tượng hoá mỏng + bộ eval riêng để phát hiện hồi quy khi đổi
   mô hình

**Tương tác:** cây quyết định chọn mô hình — trả lời 5 câu hỏi, nhận gợi ý bậc mô hình + lý do.

**Bảng quyết định:** 12 tình huống thực tế → bậc mô hình nên thử trước.

**Bài tập (5):** chọn mô hình cho 6 tình huống và biện luận; thiết kế chiến lược định tuyến 2
bậc cho một chatbot hỗ trợ; tra bảng giá chính thức hiện tại của 3 nhà cung cấp và lập bảng so
sánh; tìm một tuyên bố benchmark và chỉ ra nó có thể gây hiểu lầm ở đâu; ước tính chi phí tự
host một mô hình 8B so với dùng API ở 3 mức lưu lượng.

**Quiz (7):** vì sao không nên chọn mô hình theo bảng xếp hạng; nhiễm benchmark là gì; khi nào
open-weights đáng; định tuyến mô hình tiết kiệm bằng cách nào; cửa sổ ngữ cảnh lớn có luôn tốt
hơn không; đổi mô hình cần kiểm tra gì trước; SLM phù hợp việc gì.

---

## Chương 3 — Gọi LLM qua API (~1.300 dòng)

**Mục tiêu:** viết được lớp gọi LLM chịu lỗi tốt, có streaming, có đếm token và chi phí.

**Nội dung:**

1. Giải phẫu một request — model, messages, max_tokens, system prompt, tham số sampling
2. **Vai trò trong messages** — system / user / assistant; system prompt để làm gì và không nên
   để làm gì (⚠️ không đặt bí mật hay khoá API vào system prompt — nó nằm trong lịch sử phiên)
3. **API là stateless** — mọi lượt phải gửi lại toàn bộ lịch sử; hệ quả trực tiếp: chi phí tăng
   theo bình phương độ dài hội thoại nếu không quản lý
4. Đọc response — nội dung, `stop_reason`/`finish_reason` (và vì sao **phải** kiểm tra nó trước
   khi đọc nội dung), usage/token
5. **Streaming** — vì sao cần (cảm nhận độ trễ), Server-Sent Events, xử lý sự kiện từng phần,
   hiển thị lên UI. *→ Nối Networking ch.5 (HTTP) và Pillar 9 JS ch.4.*
6. **Xử lý lỗi** — bảng mã lỗi và cách xử lý từng loại: 400 (sửa request), 401, 429 (rate limit
   → backoff), 500/529 (thử lại), timeout, lỗi mạng. Cái nào **được** thử lại, cái nào không.
7. **Retry với exponential backoff + jitter** — cài từ đầu, rồi chỉ ra SDK thường đã có sẵn
8. Rate limit — RPM/TPM/TPD, đọc header rate-limit, hàng đợi phía client
9. Timeout và request dài — vì sao request `max_tokens` lớn phải streaming (nếu không sẽ đứt
   kết nối HTTP)
10. **Đếm token & tính chi phí** — API đếm token, log usage mỗi request, tích luỹ theo người
    dùng/tính năng. *→ Dashboard chi phí ở 10.6 ch.3.*
11. Batch API — giảm ~50% chi phí cho việc không cần thời gian thực
12. **Quản lý khoá API** — biến môi trường, không commit, không đưa vào frontend; vì sao gọi
    LLM **phải** qua backend của bạn, không gọi thẳng từ trình duyệt
13. Xây một lớp bọc (wrapper) mỏng — vì sao nên có, và vì sao nên **mỏng** (trừu tượng hoá quá
    dày sẽ chặn mất tính năng mới của nhà cung cấp)

**Tương tác:** mô phỏng luồng streaming SSE — xem các sự kiện đến theo thời gian và nội dung
được ráp dần.

**Đối chiếu TS:** ví dụ song song cho streaming trong Node/TypeScript, vì đây là chỗ TS thực sự
hay dùng (frontend + edge function).

**Bài tập (5):** viết wrapper có retry + backoff + jitter và test bằng lỗi giả lập; cài streaming
in ra terminal theo từng chunk; thêm bộ đếm token & chi phí tích luỹ; xử lý đúng 5 mã lỗi khác
nhau; đo chênh lệch độ trễ cảm nhận giữa streaming và không streaming.

**Quiz (8):** vì sao phải gửi lại lịch sử; `stop_reason` cần kiểm tra trước điều gì; lỗi nào
không nên retry; jitter để làm gì; vì sao không gọi API từ trình duyệt; batch API đánh đổi gì;
TPM khác RPM; streaming giảm độ trễ thật hay chỉ cảm nhận.

---

## Chương 4 — Prompt Engineering nền tảng (~1.300 dòng)

**Mục tiêu:** viết được prompt rõ ràng, có cấu trúc, ổn định; biết sửa prompt một cách có hệ
thống thay vì mò mẫm.

**Nội dung:**

1. Prompt là gì và vì sao nó quan trọng — cùng mô hình, prompt khác nhau cho kết quả khác hẳn
2. **Sáu thành phần của một prompt tốt** — vai trò, nhiệm vụ, ngữ cảnh, ràng buộc, định dạng
   đầu ra, ví dụ. Mẫu điền sẵn (đối chiếu với mẫu trong sổ tay người học gửi, có mở rộng).
3. **Nguyên tắc rõ ràng** — cụ thể hơn là lịch sự; nói cái muốn thay vì cái không muốn;
   một nhiệm vụ một prompt; tránh đại từ mơ hồ
4. **Zero-shot / one-shot / few-shot** — khi nào cần ví dụ; **ví dụ là tín hiệu mạnh nhất trong
   prompt** — mô hình bắt chước cả độ dài, giọng văn, cấu trúc của ví dụ, nên ví dụ tồi gây hại
   nhiều hơn không có ví dụ
5. Chọn ví dụ few-shot — đa dạng, bao phủ ca biên, không thiên lệch nhãn, thứ tự có ảnh hưởng
6. **Chain-of-Thought** — "suy nghĩ từng bước"; vì sao hiệu quả (cho mô hình thêm token để tính
   toán); ⚠️ **với mô hình suy luận hiện đại, CoT thủ công có thể phản tác dụng** —
   chi tiết ở ch.5
7. **Cấu trúc prompt** — dùng dấu phân cách rõ ràng (thẻ XML / Markdown); vì sao tách chỉ dẫn
   khỏi dữ liệu là **vừa vấn đề chất lượng vừa vấn đề bảo mật** *(→ ch.6, 10.6 ch.4)*
8. Yêu cầu định dạng đầu ra — mô tả bằng lời vs ép bằng schema; giới thiệu structured output
   *(chi tiết ở ch.6)*
9. **Quy trình sửa prompt có hệ thống** — thay một biến mỗi lần, giữ bộ ca kiểm thử cố định,
   ghi lại phiên bản. Đây là điểm khác biệt giữa "nghịch prompt" và "kỹ thuật prompt".
10. Prompt bị lỗi thời — chỉ dẫn viết cho mô hình cũ (kiểu "BẮT BUỘC PHẢI…", "đừng lười") gây
    phản tác dụng trên mô hình mới vốn bám sát chỉ dẫn hơn; cách rà soát và dọn dẹp
11. Bảo mật cơ bản của prompt — dữ liệu người dùng luôn là **không tin cậy**; không bao giờ nối
    thẳng vào chỉ dẫn *(→ 10.6 ch.4)*

**Tương tác:** **Prompt A/B** — bộ 6 cặp prompt tồi/tốt cho cùng nhiệm vụ, kèm đầu ra thực tế
ghi sẵn, highlight phần khác biệt và giải thích vì sao.

**Bài tập (5):** viết lại 5 prompt tồi cho sẵn; thiết kế bộ 4 ví dụ few-shot cho một tác vụ phân
loại và giải thích lựa chọn; xây bộ 10 ca kiểm thử cho một prompt rồi đo tỉ lệ đạt trước/sau khi
sửa; tìm 3 chỉ dẫn lỗi thời trong một system prompt cho sẵn; viết prompt tách rõ chỉ dẫn khỏi
dữ liệu người dùng.

**Quiz (8):** vì sao ví dụ few-shot tồi hại hơn không có ví dụ; CoT hoạt động nhờ đâu; dấu phân
cách giải quyết vấn đề gì; vì sao "đừng làm X" kém hiệu quả hơn "hãy làm Y"; thứ tự ví dụ có
ảnh hưởng không; sửa prompt nên thay mấy biến một lần; chỉ dẫn nhấn mạnh quá mức gây hại thế nào;
dữ liệu người dùng nên đặt ở đâu trong prompt.

---

## Chương 5 — Prompt Engineering nâng cao (~1.250 dòng)

**Mục tiêu:** nắm các kỹ thuật nâng cao và **biết khi nào chúng không còn cần thiết**.

**Nội dung:**

1. **Self-consistency** — sinh nhiều lời giải rồi bỏ phiếu; chi phí nhân lên; khi nào đáng
2. **ReAct** — xen kẽ Suy nghĩ / Hành động / Quan sát; nền tảng của agent *(→ 10.4 ch.2)*
3. **Prompt chaining** — chia nhiệm vụ phức tạp thành chuỗi prompt nhỏ; ưu điểm (dễ debug, dễ
   đánh giá từng khâu, rẻ hơn) và nhược điểm (độ trễ cộng dồn, lỗi lan truyền)
4. **Định tuyến (routing)** — một prompt phân loại ý định rồi chuyển tới prompt chuyên biệt
5. Đóng vai (role prompting) — hiệu quả tới đâu; bằng chứng cho thấy nó bị đánh giá quá cao;
   khi nào thực sự giúp (giọng văn, đối tượng đọc)
6. **Meta-prompting** — dùng LLM để viết và cải thiện prompt; quy trình vòng lặp có eval
7. **Reasoning model đổi luật chơi** — mục quan trọng nhất của chương:
   - Mô hình suy luận tự sinh chuỗi suy nghĩ; ép CoT thủ công thành thừa hoặc gây nhiễu
   - "Hãy suy nghĩ từng bước" có thể **làm giảm** chất lượng trên các mô hình này
   - Điều nên làm thay thế: mô tả mục tiêu và ràng buộc rõ ràng, điều chỉnh mức "effort"/độ sâu
     suy luận qua tham số API thay vì qua lời văn
   - Bảng: kỹ thuật nào còn giá trị / kỹ thuật nào đã lỗi thời trên reasoning model
8. **Context engineering thay thế prompt engineering** như nhãn chung của nghề — prompting là
   cách diễn đạt, context engineering là kiến trúc *(→ ch.7)*
9. Prompt cho tác vụ dài — chia nhỏ, tóm tắt trung gian, checklist trong prompt
10. **Kiểm soát phiên bản prompt** — prompt là mã nguồn: đưa vào git, gắn phiên bản, đánh giá
    trước khi triển khai *(→ 10.6 ch.9)*
11. Thư viện mẫu prompt — 10 mẫu dùng lại được: trích xuất, phân loại, tóm tắt, viết lại, so
    sánh, phê bình, dịch, sinh dữ liệu tổng hợp, giải thích mã, chấm điểm (LLM-as-judge)

**Tương tác:** trình duyệt mẫu prompt — chọn mẫu, xem cấu trúc + biến + đầu ra mẫu; sao chép được.

**Bài tập (5):** chuyển một prompt lớn thành chuỗi 3 prompt và so sánh chất lượng + chi phí;
cài self-consistency 5 mẫu cho bài toán số học và đo cải thiện; viết prompt định tuyến ý định
cho 6 loại yêu cầu; lấy một prompt có CoT thủ công và viết lại cho reasoning model; dùng
meta-prompting cải thiện một prompt rồi đo bằng bộ ca kiểm thử.

**Quiz (8):** self-consistency đánh đổi gì; ReAct gồm mấy pha; chaining giúp debug thế nào;
role prompting hiệu quả với việc gì; vì sao CoT thủ công có thể hại trên reasoning model;
context engineering khác prompt engineering ra sao; prompt nên versioning không và vì sao;
LLM-as-judge cần lưu ý gì.

---

## Chương 6 — Structured Output & Tool Calling (~1.350 dòng)

**Mục tiêu:** lấy được đầu ra máy đọc được một cách đáng tin; hiểu tool calling như một giao
thức, không phải phép màu.

**Nội dung:**

1. Vấn đề: văn bản tự do không ghép vào phần mềm được. Ba mức giải pháp: xin lịch sự → parse
   chịu lỗi → **ép bằng schema**
2. **JSON Schema** — kiểu, thuộc tính, `required`, `enum`, `additionalProperties: false`;
   viết schema tốt (mô tả từng trường là chỉ dẫn cho mô hình, không chỉ là kiểu dữ liệu)
3. **Structured output** — ép đầu ra khớp schema ở tầng giải mã; khác biệt với "xin mô hình
   trả JSON"; giới hạn schema thường gặp (đệ quy, ràng buộc số/độ dài)
4. Dùng Pydantic (Python) / Zod (TS) để định nghĩa schema và kiểm tra hợp lệ
5. Khi structured output thất bại — bị cắt vì `max_tokens`, bị từ chối, schema quá phức tạp;
   chiến lược dự phòng
6. **Tool calling / function calling** — cơ chế thật sự: mô hình **không tự chạy gì cả**, nó chỉ
   xuất ra một yêu cầu gọi hàm có cấu trúc; **ứng dụng của bạn mới là bên thực thi**.
   Hiểu sai điều này là gốc rễ của nhiều lỗi bảo mật.
7. **Vòng đời một lượt tool calling** — 6 bước, vẽ sơ đồ: gửi tool + prompt → mô hình trả
   `tool_use` → app thực thi → gửi lại `tool_result` → mô hình trả lời → lặp nếu cần
8. Viết mô tả tool tốt — mô tả tool là tài liệu cho mô hình; ghi rõ **khi nào nên gọi** chứ
   không chỉ nó làm gì; đặt tên tham số biết nói; dùng enum khi có tập giá trị cố định
9. **Gọi tool song song** — mô hình có thể yêu cầu nhiều tool một lượt; phải trả **tất cả** kết
   quả trong cùng một message, nếu không mô hình sẽ dần thôi gọi song song
10. Xử lý lỗi tool — đánh dấu lỗi và trả về thông điệp hữu ích để mô hình tự điều chỉnh, thay
    vì để ngoại lệ nổ ra
11. **Bảo mật của tool calling** — mục bắt buộc:
    - Tham số tool là **đầu ra mô hình**, tức là dữ liệu không tin cậy → luôn kiểm tra hợp lệ
    - Kết quả tool có thể chứa prompt injection (nội dung web, email, tệp người dùng)
    - Cổng phê duyệt cho hành động khó hoàn tác
    - Nguyên tắc đặc quyền tối thiểu cho từng tool
    *→ Đào sâu ở 10.4 ch.3 và 10.6 ch.4–5.*
12. Structured output vs tool calling — cái nào dùng khi nào (bảng quyết định)

**Tương tác:** trình soạn JSON Schema — chỉnh schema, xem đầu ra hợp lệ/không hợp lệ được đánh
dấu ngay.

**Đối chiếu TS:** Zod đặt cạnh Pydantic — chỗ TS ngang ngửa Python.

**Bài tập (5):** viết schema trích xuất thông tin đơn hàng từ email tự do; sửa 3 mô tả tool tồi;
cài vòng lặp tool calling đầy đủ với 2 tool; xử lý ca tool trả lỗi và ca mô hình gọi sai tham số;
thêm lớp kiểm tra hợp lệ + cổng phê duyệt cho một tool có tác dụng phụ.

**Quiz (8):** mô hình có tự chạy tool không; `tool_result` phải trả về ở đâu; vì sao trả thiếu
kết quả song song lại gây hại; mô tả tool ảnh hưởng gì; `additionalProperties: false` để làm gì;
structured output khác xin-JSON chỗ nào; tham số tool có đáng tin không; khi nào cần phê duyệt.

---

## Chương 7 — Context Engineering (~1.300 dòng)

**Mục tiêu:** quản lý cửa sổ ngữ cảnh như một tài nguyên khan hiếm; biết chọn đưa gì vào và
bỏ gì ra.

**Nội dung:**

1. Từ prompt engineering tới **context engineering** — không phải viết câu hay, mà là thiết kế
   xem thông tin nào có mặt trong cửa sổ ngữ cảnh, ở đâu, theo thứ tự nào. Gần với thiết kế hệ
   thống hơn là viết lách.
2. **Ngân sách ngữ cảnh** — bảng phân bổ: system prompt, định nghĩa tool, lịch sử, tài liệu
   truy xuất, câu hỏi hiện tại, chỗ chừa cho đầu ra
3. **Thứ tự quan trọng** — "lost in the middle"; đặt thứ quan trọng ở đầu và cuối
4. **Prompt caching** — cơ chế khớp tiền tố (prefix match); vì sao **một byte đổi ở đầu làm hỏng
   toàn bộ cache phía sau**; cách sắp xếp: nội dung ổn định trước, nội dung biến động sau
5. **Sát thủ thầm lặng của cache** — mục thực dụng nhất chương: dấu thời gian trong system prompt,
   UUID mỗi request, `json.dumps` không sắp xếp khoá, danh sách tool thay đổi theo người dùng,
   đổi mô hình giữa chừng. Kèm checklist rà soát và cách kiểm chứng bằng chỉ số cache-read.
6. **Quản lý lịch sử hội thoại** — cửa sổ trượt, tóm tắt, nén (compaction), lai giữa các cách;
   đánh đổi của từng cách
7. **Bộ nhớ (memory)** — khác lịch sử: thông tin bền vững qua nhiều phiên; lưu ở đâu, lấy lại
   thế nào, khi nào ghi. *→ Chi tiết ở 10.4 ch.5.*
8. **Cửa sổ ngữ cảnh dài có thay thế được RAG không** — phân tích thẳng thắn: chi phí tuyến tính
   theo độ dài, độ trễ prefill, chú ý loãng, và không giải quyết bài toán dữ liệu vượt quá mọi
   cửa sổ. Kết luận: bổ sung cho nhau chứ không thay thế. *→ 10.3 ch.1.*
9. **Nén ngữ cảnh** — tóm tắt tự động khi gần chạm ngưỡng; giữ lại gì, bỏ gì; rủi ro mất thông
   tin then chốt
10. Ngữ cảnh cho agent chạy dài — dọn kết quả tool cũ, tách trạng thái ra khỏi ngữ cảnh, ghi ra
    tệp thay vì giữ trong prompt. *→ 10.4.*
11. Đo lường — theo dõi số token theo từng thành phần, tỉ lệ cache hit, phân bố độ dài ngữ cảnh

**Tương tác:** **trình phân bổ ngân sách ngữ cảnh** — kéo thanh cho từng thành phần, xem tổng so
với giới hạn mô hình và chi phí ước tính; cảnh báo khi vượt.

**Bài tập (5):** lập ngân sách ngữ cảnh cho một chatbot hỗ trợ có RAG; tìm 4 sát thủ cache trong
đoạn code cho sẵn; cài chiến lược cửa sổ trượt + tóm tắt và so sánh chất lượng; đo tỉ lệ cache
hit trước/sau khi sắp xếp lại prompt; quyết định long-context hay RAG cho 5 tình huống.

**Quiz (8):** prompt caching khớp theo cái gì; vì sao dấu thời gian trong system prompt tai hại;
"lost in the middle" là gì; nén ngữ cảnh rủi ro gì; memory khác history ra sao; long-context có
thay được RAG không; nên đặt tài liệu truy xuất ở đâu; cache hit đo bằng chỉ số nào.

---

## Chương 8 — Đa phương thức: hình ảnh, tài liệu, âm thanh (~1.150 dòng)

**Mục tiêu:** dùng được mô hình thị giác và xử lý tài liệu; biết khi nào OCR truyền thống tốt
hơn mô hình thị giác.

**Nội dung:**

1. Đa phương thức nghĩa là gì — mô hình nhận nhiều loại đầu vào; kiến trúc ở mức khái niệm
   (bộ mã hoá hình ảnh chiếu vào cùng không gian với token văn bản)
2. **Gửi ảnh** — base64 vs URL; định dạng hỗ trợ; giới hạn kích thước; **ảnh tốn bao nhiêu
   token** và cách ước tính
3. Độ phân giải và chi phí — ảnh độ phân giải cao chính xác hơn nhưng tốn token gấp nhiều lần;
   khi nào nên giảm kích thước trước khi gửi
4. Việc mô hình thị giác làm tốt — mô tả, hỏi đáp trên ảnh, đọc biểu đồ, hiểu ảnh chụp màn hình,
   trích xuất dữ liệu có cấu trúc từ ảnh chụp
5. Việc mô hình thị giác làm kém — đếm chính xác, đo lường, chữ rất nhỏ, tọa độ chi tiết
6. **Xử lý tài liệu** — PDF: gửi thẳng vs trích xuất văn bản trước; **bảng biểu và bố cục nhiều
   cột là chỗ hỏng phổ biến nhất**; PDF quét ảnh
7. **OCR truyền thống vs mô hình thị giác** — bảng quyết định theo chi phí, độ chính xác, khối
   lượng; nhiều trường hợp pipeline lai là tối ưu
8. Trích xuất tài liệu có cấu trúc — kết hợp với structured output của ch.6; kèm điểm tin cậy
9. Âm thanh — chuyển giọng nói thành văn bản, sinh giọng nói; độ trễ trong ứng dụng thời gian
   thực; ⚠️ chất lượng nhận dạng **tiếng Việt** và các lưu ý riêng
10. **RAG đa phương thức** — nhắc trước, chi tiết ở 10.3 ch.9
11. Bảo mật — ⚠️ **prompt injection qua hình ảnh**: chữ nhúng trong ảnh có thể chứa chỉ dẫn;
    mô hình đọc được. *→ 10.6 ch.4.*

**Tương tác:** máy tính token cho ảnh — nhập kích thước ảnh, xem ước tính token và chi phí ở
vài mức độ phân giải.

**Bài tập (5):** trích xuất bảng từ ảnh chụp thành JSON có schema; so sánh chi phí và độ chính
xác của 3 mức độ phân giải trên cùng tác vụ; xây pipeline xử lý PDF chọn OCR hay vision theo
đặc điểm trang; kiểm thử một ảnh có chữ nhúng chỉ dẫn độc hại và quan sát hành vi; đánh giá
chất lượng nhận dạng tiếng Việt trên 10 mẫu.

**Quiz (7):** ảnh tốn token theo cái gì; khi nào dùng OCR thay vision; PDF nhiều cột hỏng ở đâu;
mô hình thị giác kém việc gì; prompt injection qua ảnh hoạt động thế nào; giảm kích thước ảnh
đánh đổi gì; xử lý bảng biểu nên làm sao.

---

## Chương 9 — Ảo giác và độ tin cậy (~1.200 dòng)

**Mục tiêu:** hiểu ảo giác từ gốc; biết bộ công cụ giảm thiểu và giới hạn của từng công cụ.

**Nội dung:**

1. **Ảo giác là gì và vì sao nó tất yếu** — mô hình tối ưu cho "token tiếp theo có khả năng cao",
   không tối ưu cho "đúng sự thật". Một phát biểu sai nhưng trôi chảy vẫn có xác suất cao.
   Đây là **tính chất của mục tiêu huấn luyện**, không phải lỗi cài đặt.
2. **Phân loại ảo giác** — bịa sự kiện, bịa nguồn/trích dẫn, nhầm lẫn thời điểm, suy luận sai,
   làm theo tiền giả định sai của người hỏi (sycophancy)
3. Khi nào ảo giác nhiều nhất — chủ đề hiếm, câu hỏi có tiền giả định sai, yêu cầu con số/ngày
   tháng cụ thể, chủ đề sau mốc dữ liệu huấn luyện, prompt mơ hồ
4. **Grounding** — bắt mô hình chỉ dùng ngữ cảnh cho sẵn; câu chữ prompt cụ thể để làm được điều
   này; **và vì sao chỉ dẫn thôi không đủ**
5. **Cho phép nói "không biết"** — mô hình mặc định thiên về trả lời; phải cấp phép rõ ràng và
   cho khuôn mẫu để từ chối
6. **Trích dẫn nguồn** — buộc dẫn nguồn giúp giảm bịa; nhưng ⚠️ **trích dẫn cũng bịa được** →
   phải kiểm chứng ở tầng ứng dụng (đối chiếu chuỗi trích dẫn với tài liệu gốc)
7. **Hiệu chuẩn độ tin cậy** — điểm tin cậy mô hình tự khai không đáng tin lắm; các cách khả
   dĩ hơn: nhất quán giữa nhiều mẫu, mô hình phê bình chéo, kiểm chứng bằng nguồn ngoài
8. **Kiểm chứng bằng công cụ** — số học đưa cho máy tính, sự kiện đưa cho tìm kiếm/CSDL,
   mã nguồn đưa cho trình chạy. **Đừng bắt mô hình làm việc mà phần mềm tất định làm tốt hơn.**
9. Mẫu thiết kế giảm ảo giác — RAG *(→10.3)*, sinh rồi kiểm chứng, mô hình phê bình, người trong
   vòng lặp, ràng buộc bằng schema
10. **Thiết kế UI cho sự bất định** — hiển thị nguồn, đánh dấu phần suy đoán, cho đường thoát;
    trách nhiệm sản phẩm chứ không chỉ trách nhiệm mô hình
11. Đo tỉ lệ ảo giác — xây bộ kiểm thử có đáp án chuẩn, gồm cả **câu hỏi bẫy không trả lời được**
    *(→ 10.6 ch.2)*

**Tương tác:** phòng trưng bày ảo giác — 8 ví dụ thật kèm phân loại và cách phòng tương ứng.

**Bài tập (5):** viết prompt grounding chặt rồi kiểm thử bằng câu hỏi ngoài phạm vi tài liệu;
xây bộ 10 câu hỏi bẫy có tiền giả định sai và đo tỉ lệ mô hình bị dắt mũi; cài kiểm chứng trích
dẫn đối chiếu với văn bản gốc; thiết kế cơ chế "không biết" cho một chatbot hỗ trợ; so sánh tỉ
lệ ảo giác trước/sau khi thêm RAG.

**Quiz (7):** ảo giác đến từ đâu về bản chất; vì sao chỉ dặn "đừng bịa" là không đủ; trích dẫn
có đáng tin không; điểm tin cậy mô hình tự khai đáng tin tới đâu; khi nào nên đưa việc cho công
cụ tất định; sycophancy là gì; bộ eval nên có loại câu hỏi nào.

---

## Chương 10 — Chi phí, độ trễ và tối ưu (~1.250 dòng)

**Mục tiêu:** ước tính và kiểm soát được chi phí, độ trễ của ứng dụng LLM.

**Nội dung:**

1. **Mô hình chi phí** — trả tiền theo token vào + token ra; token ra thường đắt hơn nhiều lần;
   cache-read rẻ hơn nhiều lần; cache-write đắt hơn một chút. Vì sao lại thế — nối về
   prefill/decode ở ch.1.
2. **Ước tính chi phí** — công thức từ lưu lượng: `req/tháng × (token vào × giá vào + token ra ×
   giá ra)`; đừng quên lịch sử hội thoại nhân token đầu vào lên theo số lượt
3. **Mô hình độ trễ** — thời gian tới token đầu tiên (TTFT) chịu ảnh hưởng của độ dài prompt;
   thời gian mỗi token đầu ra (TPOT) chịu ảnh hưởng của kích thước mô hình; tổng ≈
   `TTFT + TPOT × số token ra`
4. **Vì sao streaming là bắt buộc với UI** — TTFT là thứ người dùng cảm nhận, không phải tổng
   thời gian
5. **Bảy đòn bẩy tối ưu**, xếp theo hiệu quả trên công sức:
   1. Prompt caching *(→ ch.7)* — thường là đòn bẩy lớn nhất
   2. Chọn/định tuyến mô hình rẻ hơn cho phần lớn lưu lượng *(→ ch.2)*
   3. Rút gọn prompt — bỏ chỉ dẫn thừa, ví dụ thừa
   4. Giới hạn `max_tokens` và yêu cầu súc tích
   5. Cache câu trả lời cho câu hỏi lặp lại (cache ngữ nghĩa)
   6. Batch API cho việc không cần thời gian thực
   7. Song song hoá các lời gọi độc lập
6. **Cache ngữ nghĩa** — cache theo độ tương tự embedding thay vì khớp chuỗi; rủi ro trả nhầm
   câu trả lời cho câu hỏi gần giống; ngưỡng và cách phòng
7. **Tổng chi phí sở hữu** — API không chỉ có tiền token: còn eval, observability, guardrails,
   con người. So sánh với tự host. *→ 10.5 ch.7, 10.6 ch.7.*
8. Đặt ngân sách và hạn mức — hạn mức theo người dùng, ngắt mạch (circuit breaker), cảnh báo chi
   tiêu; ⚠️ chi phí AI có thể bùng nổ vì một vòng lặp agent hỏng — *(→ 10.4 ch.2)*
9. Đo lường — token theo tính năng, chi phí trên mỗi người dùng, chi phí trên mỗi tác vụ hoàn
   thành (chỉ số đáng giá nhất); *(→ 10.6 ch.3)*
10. Nghiên cứu tình huống: giảm 80% chi phí một ứng dụng RAG — đi qua từng đòn bẩy với con số cụ
    thể, chỉ rõ đòn bẩy nào đóng góp bao nhiêu

**Tương tác:** **máy tính chi phí** — nhập req/ngày, token vào/ra, chọn bậc mô hình, bật/tắt
caching và batching → chi phí tháng + biểu đồ phân rã. Có nút "áp dụng cả 7 đòn bẩy" để thấy
tổng tác động.

**Bài tập (5):** ước tính chi phí tháng cho một chatbot 10k người dùng; đo TTFT và TPOT thực tế
rồi so với ước tính; xác định 3 đòn bẩy tối ưu tốt nhất cho một kiến trúc cho sẵn; cài cache
ngữ nghĩa và đo tỉ lệ hit + tỉ lệ trả nhầm; thiết kế cơ chế ngắt mạch chi phí.

**Quiz (8):** vì sao token ra đắt hơn; TTFT phụ thuộc gì; đòn bẩy tối ưu nào thường lớn nhất;
cache ngữ nghĩa rủi ro gì; batch API phù hợp việc gì; chi phí trên mỗi tác vụ hoàn thành hơn chi
phí trên mỗi request ở chỗ nào; lịch sử hội thoại ảnh hưởng chi phí ra sao; ngắt mạch bảo vệ khỏi
điều gì.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | LLM hoạt động thế nào | 1.400 |
| 2 | Bức tranh mô hình 2026 và cách chọn | 1.200 |
| 3 | Gọi LLM qua API | 1.300 |
| 4 | Prompt Engineering nền tảng | 1.300 |
| 5 | Prompt Engineering nâng cao | 1.250 |
| 6 | Structured Output & Tool Calling | 1.350 |
| 7 | Context Engineering | 1.300 |
| 8 | Đa phương thức | 1.150 |
| 9 | Ảo giác và độ tin cậy | 1.200 |
| 10 | Chi phí, độ trễ và tối ưu | 1.250 |
| | **Tổng** | **~12.700 dòng · 50 bài tập · 77 quiz** |
