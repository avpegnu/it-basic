# Trụ cột 10 — AI Engineering · Kế hoạch tổng

**Bắt đầu:** 2026-08-17
**Trạng thái:** 🚧 P0 — viết outline, chờ duyệt trước khi sinh HTML

---

## 1. Mục tiêu

Xây trụ cột thứ 10 của IT Basic: **AI Engineering** — giáo trình tiếng Việt đưa người học từ
"chưa biết gì về AI" tới "xây và vận hành được ứng dụng AI trong production, trả lời được phỏng
vấn AI Engineer".

Người học đã có nền 9 trụ cột trước (CLI, DSA, OS, Networking, Database, OOP, System Design,
DevOps, Programming Language — 147 chương). Trụ cột này lấp gap **AI/LLM** — mảng duy nhất
chưa có, và cũng là mảng thay đổi nhanh nhất.

### Điều trụ cột này KHÔNG làm

- Không phải giáo trình nghiên cứu ML. Không chứng minh định lý, không đọc paper dòng-theo-dòng.
- Không dạy huấn luyện mô hình nền từ đầu (pretraining) — thứ không ai ngoài vài phòng lab làm được.
- Không phải khoá "prompt hack". Prompting chỉ là 1 trong 6 sub-pillar.

Trọng tâm là **kỹ thuật**: xây, đánh giá, triển khai, vận hành, bảo mật hệ thống dùng mô hình
có sẵn — đúng nghĩa "AI Engineering", phân biệt với "ML Research".

---

## 2. Quyết định đã chốt (2026-08-17)

| Câu hỏi | Đáp án |
|---|---|
| Cấu trúc | 1 pillar `AI/` + 6 sub-folder (mô hình giống Pillar 9) |
| Phạm vi | **58 chương**: Foundations 10 · LLM 10 · RAG 10 · Agent 10 · FineTuning 8 · Production 10 |
| Theme | **"Neural Paper"** — giấy ấm off-white + chàm-tím trầm, mỗi sub-pillar lệch tông nhẹ |
| Ngôn ngữ code | **Python chính**, mỗi chương có callout đối chiếu TypeScript/JS ở chỗ khác biệt đáng kể |
| Thứ tự | Tuần tự 10.1 → 10.6 |
| Mốc kiến thức | **Tháng 8/2026** — tra cứu lại mọi số liệu (model ID, giá, phiên bản spec) khi viết |

---

## 3. Cấu trúc thư mục

```
IT Basic/
└── AI/
    ├── index.html                 ← TOC chung của Pillar 10
    ├── docs/
    │   ├── PLAN.md                ← file bạn đang đọc
    │   ├── FOUNDATIONS-OUTLINE.md ← 10 chương 10.1
    │   ├── LLM-OUTLINE.md         ← 10 chương 10.2
    │   ├── RAG-OUTLINE.md         ← 10 chương 10.3
    │   ├── AGENT-OUTLINE.md       ← 10 chương 10.4
    │   ├── FINETUNING-OUTLINE.md  ← 8 chương 10.5
    │   └── PRODUCTION-OUTLINE.md  ← 10 chương 10.6
    ├── shared/
    │   ├── css/base.css           ← layout + component chung 6 sub-pillar
    │   └── js/chapter.js          ← copy code, anchor, TOC highlight, reading progress
    ├── Foundations/   (10.1)  index.html · chuong/ · css/theme.css · js/
    ├── LLM/           (10.2)
    ├── RAG/           (10.3)
    ├── Agent/         (10.4)
    ├── FineTuning/    (10.5)
    └── Production/    (10.6)
```

---

## 4. Sáu sub-pillar

| # | Folder | Tên | Chương | Vai trò |
|---|---|---|---|---|
| 10.1 | `Foundations/` | Nền tảng AI | 10 | Từ zero tới hiểu Transformer. Ai đã học ML rồi có thể lướt. |
| 10.2 | `LLM/` | LLM & Prompt Engineering | 10 | Cách LLM hoạt động, gọi API, prompting, structured output, tool calling, context engineering |
| 10.3 | `RAG/` | RAG & Tìm kiếm ngữ nghĩa | 10 | Embedding → vector DB → chunking → hybrid retrieval → rerank → đánh giá |
| 10.4 | `Agent/` | AI Agent | 10 | Vòng lặp agent, tool design, MCP, memory, multi-agent, framework, đánh giá |
| 10.5 | `FineTuning/` | Fine-tuning & Model Serving | 8 | LoRA/QLoRA, DPO/GRPO, lượng tử hoá, vLLM/SGLang, GPU |
| 10.6 | `Production/` | AI System Design & Production | 10 | Eval, observability, bảo mật, guardrails, chi phí, case study, phỏng vấn |

Chi tiết từng chương: xem file outline tương ứng trong `docs/`.

---

## 5. Triết lý giáo trình

Bảy nguyên tắc xuyên suốt 58 chương — đây là thứ phân biệt giáo trình này với tutorial trên mạng.

### 1. Mental model trước API

Không dump lời gọi hàm. Mỗi khái niệm bắt đầu bằng **vấn đề nó giải quyết**, rồi mới tới cách
dùng. Người chỉ biết `client.messages.create(...)` mà không hiểu context window là gì sẽ bó tay
khi prompt bị cắt giữa chừng.

### 2. Dạy cả "khi nào KHÔNG dùng"

Đây là nguyên tắc quan trọng nhất của trụ cột này, vì hệ sinh thái AI đầy cám dỗ dùng sai công cụ:

- Khi nào **không** cần agent (workflow tĩnh rẻ hơn, ổn định hơn, dễ debug hơn)
- Khi nào **không** cần RAG (long-context đủ, hoặc dữ liệu vốn đã nằm trong prompt)
- Khi nào **không** cần fine-tune (gần như luôn luôn, nếu chưa cạn prompt + RAG)
- Khi nào **không** cần multi-agent (phần lớn trường hợp — nó nhân chi phí và độ trễ)
- Khi nào **không** cần vector DB riêng (pgvector đủ cho ~70% workload dưới 10M vector)

### 3. Đánh giá (evaluation) là nội dung chính, không phải phụ lục

Đây là kỹ năng bị hỏi nhiều nhất trong phỏng vấn AI Engineer 2026 và bị dạy ít nhất trên mạng.
Eval xuất hiện ở **4 chỗ**: đánh giá mô hình ML (10.1 ch.6), đánh giá RAG (10.3 ch.8),
đánh giá agent (10.4 ch.9), và eval hệ thống + LLM-as-judge + CI (10.6 ch.2).

### 4. Bảo mật là nội dung chính, không phải phụ lục

Kế thừa nguyên tắc đã dùng cho sub-pillar Java. Prompt injection không phải "lưu ý nhỏ" — nó là
lỗ hổng kiến trúc: chỉ dẫn và dữ liệu dùng chung một kênh (cửa sổ ngữ cảnh), và **không có
thứ gì tương đương prepared statement để tách chúng ra**. Có chương riêng (10.6 ch.4–5), cộng
callout rải trong 10.2 (tool calling), 10.3 (nội dung truy xuất là dữ liệu không tin cậy),
10.4 (excessive agency).

### 5. Số liệu phải tra cứu, không viết theo trí nhớ

Model ID, giá token, kích thước cửa sổ ngữ cảnh, phiên bản spec — **tra cứu tại thời điểm viết
từng chương**, ghi rõ ngày kiểm chứng trong callout. Mảng này lỗi thời sau 3 tháng. Nơi nào số
liệu chắc chắn sẽ thay đổi, dạy **cách tra** thay vì bắt nhớ con số.

### 6. Chi phí là ràng buộc thiết kế, không phải chuyện tính sau

Mỗi quyết định kiến trúc đều kèm hệ quả chi phí và độ trễ. Có máy tính chi phí tương tác;
có chương riêng về FinOps cho AI (10.6 ch.7).

### 7. Đối chiếu với các trụ cột đã học

Người học có sẵn 9 trụ cột. Tận dụng triệt để:

| Khái niệm AI | Nối với |
|---|---|
| Vector DB, chỉ mục HNSW | Database ch.5 (Indexes), ch.9 (NoSQL) |
| Caching nhiều tầng cho LLM | System Design ch.3 (Caching Strategies) |
| Hàng đợi cho tác vụ AI dài | System Design ch.5 (Message Queue) |
| Prompt injection | Networking ch.10 (Web security) — cùng họ với SQL injection/XSS |
| Deploy mô hình, GPU node | DevOps ch.6 (K8s), ch.8 (Cloud) |
| Observability, tracing | DevOps ch.10 (Prometheus/OTel/Jaeger) |
| Đạo hàm, gradient | Foundations ch.2 — tự chứa, không cần nền ngoài |
| `asyncio`, type hints | Pillar 9 Python ch.11, ch.12 |
| Event loop, streaming SSE | Pillar 9 JavaScript ch.4; Networking ch.5 (HTTP) |

---

## 6. Cấu trúc chuẩn của một chương

Mỗi file `chuong/chuongN.html` (~1.200–1.400 dòng) gồm, theo thứ tự:

1. `<header class="chapter-header">` — breadcrumb, số chương, tiêu đề, đoạn dẫn, metadata
   (độ dài / số bài tập / số quiz / kiến thức cần trước)
2. Callout **🎯 Mục tiêu chương** — 6–9 gạch đầu dòng cụ thể, đo được
3. 8–12 section `<h2 id="...">` nội dung chính
4. Ít nhất 1 **thành phần tương tác hoặc visualizer** (xem §7)
5. Ít nhất 1 **bảng so sánh** hoặc bảng quyết định ("dùng cái nào khi nào")
6. Callout **⚠️ Sai lầm thường gặp** — lấy từ lỗi thật, không bịa
7. Callout **🔗 Đối chiếu** — với trụ cột khác, hoặc với TypeScript/JS
8. `<h2 id="bai-tap">Bài tập</h2>` — 4–5 bài, mỗi bài có `<details>` gợi ý
9. `<h2 id="quiz">Quiz</h2>` — 7–8 câu, mỗi câu có `<details>` đáp án **kèm giải thích vì sao**
10. `<h2 id="tong-ket">Tổng kết</h2>` — danh sách gạch đầu dòng những gì đã nắm
11. `<h2 id="ket-noi">Kết nối</h2>` — trỏ tới chương trước/sau và trụ cột liên quan
12. `<nav class="chapter-nav">` — prev/next
13. `<aside class="toc">` — mục lục trong chương (sidebar, tự highlight khi cuộn)

**Ràng buộc chất lượng (kế thừa từ các trụ cột trước, không được cắt giảm):**

- Mọi ví dụ code phải **chạy được**, có comment tiếng Việt giải thích
- Không có đoạn "…" hay "để dành cho bạn tự làm" ở phần lý thuyết
- Mọi đáp án quiz phải giải thích **vì sao**, không chỉ nêu đáp án
- Thuật ngữ tiếng Việt dùng dạng đầy đủ, không rút gọn từ Hán-Việt
  (vd "Trừu tượng hoá", không "Trừu hoá")

---

## 7. Thành phần tương tác riêng của trụ cột AI

Mỗi trụ cột có "tính cách" tương tác riêng (CLI có terminal giả lập, DSA có visualizer thuật
toán). Với AI:

| Thành phần | Ở đâu | Mô tả |
|---|---|---|
| **Tokenizer visualizer** | 10.2 ch.1 | Gõ text → thấy ranh giới token + số token. Dùng bảng BPE rút gọn nhúng sẵn, minh hoạ cơ chế; nói rõ đây là mô phỏng, không phải tokenizer thật của mô hình nào. |
| **Attention heatmap** | 10.1 ch.10 | Ma trận attention tô màu trên một câu ngắn, hover xem token nào chú ý token nào. Trọng số tính sẵn, nhúng dạng JSON. |
| **Sampling playground** | 10.2 ch.1 | Kéo temperature / top-p / top-k → thấy phân phối xác suất token kế tiếp biến dạng. |
| **Embedding 2D** | 10.3 ch.2 | Scatter plot ~40 từ đã chiếu xuống 2D + máy tính cosine similarity giữa 2 từ bất kỳ. |
| **Chunking playground** | 10.3 ch.4 | Dán văn bản → xem 4 chiến lược chunk (fixed / recursive / semantic / by-heading) chia khác nhau ra sao. |
| **RAG pipeline stepper** | 10.3 ch.1 | Bấm từng bước, xem dữ liệu biến đổi qua embedding → search → rerank → prompt → answer. |
| **Agent loop animator** | 10.4 ch.2 | Chạy từng vòng ReAct trên một tác vụ mẫu; hiện rõ Thought / Action / Observation. |
| **Cost calculator** | 10.2 ch.10 | Nhập lưu lượng (request/ngày, token vào/ra) × giá mô hình → chi phí tháng, có so sánh khi bật prompt caching / batch. |
| **Vector search demo** | 10.3 ch.3 | Toy index ~200 vector, so sánh brute-force vs HNSW về số phép so sánh và độ chính xác. |
| **Prompt A/B** | 10.2 ch.4 | Đặt cạnh nhau prompt tồi / prompt tốt + đầu ra tương ứng (ghi sẵn), highlight khác biệt. |

Tất cả chạy **client-side thuần, không gọi API, không cần API key** — người học mở file bằng
trình duyệt là dùng được ngay. Dữ liệu (embedding, trọng số attention, đầu ra mẫu) tính sẵn và
nhúng vào JS.

---

## 8. Theme "Neural Paper"

Nền giấy ấm, chữ đen mềm, điểm nhấn chàm-tím trầm. Không glow, không scanline, contrast vừa
phải để đọc lâu — theo đúng phản hồi đã ghi nhận về việc mỏi mắt với theme "loud".

### Bảng màu gốc (`AI/shared/css/base.css`)

```
--bg          #faf8f4   nền giấy ấm
--bg-card     #ffffff
--bg-alt      #f2eee6
--text        #23212b
--text-soft   #4d4a58
--text-muted  #7d7a89
--ink         #14121c
--accent      #5b4b8a   chàm-tím trầm
--accent-deep #3f3363
--accent-soft #e6e1f0
--rust        #b4643c   cam đất — cảnh báo
--olive       #5f6b45   lục — "đúng/nên làm"
--border      #e3dccf
```

Font: **Newsreader** (serif, tiêu đề) · **Inter** (body) · **JetBrains Mono** (code).

### Lệch tông theo sub-pillar (`<sub>/css/theme.css`)

| Sub-pillar | `--accent` | Sắc thái |
|---|---|---|
| Foundations | `#8a6a3f` | cát / hổ phách trầm — "nền móng" |
| LLM | `#5b4b8a` | chàm-tím — màu gốc của pillar |
| RAG | `#2f6f6a` | xanh mòng két — "truy xuất, kho tri thức" |
| Agent | `#a35a2a` | cam đất đậm — "hành động" |
| FineTuning | `#4f6b3a` | lục ô-liu — "huấn luyện, tăng trưởng" |
| Production | `#3c5570` | xám đá xanh — "vận hành, ổn định" |

Component riêng của trụ cột (định nghĩa trong `base.css`, tô màu trong từng `theme.css`):
`.token-strip` · `.attention-grid` · `.pipeline-flow` · `.agent-loop` · `.vector-plot`
· `.cost-table` · `.model-card` · `.eval-scorecard` · `.threat-box` (bảo mật)
· `.decision-table` (dùng cái nào khi nào).

---

## 9. Trình tự thi công

| Giai đoạn | Nội dung | Trạng thái |
|---|---|---|
| **P0** | `PLAN.md` + 6 outline `.md` | 🚧 đang làm |
| **P1** | `shared/css/base.css`, `shared/js/chapter.js`, 6 `theme.css`, `AI/index.html`, 6 `index.html` sub-pillar, JS tương tác | ⏳ |
| **P2** | Foundations 10 chương | ⏳ |
| **P3** | LLM 10 chương | ⏳ |
| **P4** | RAG 10 chương | ⏳ |
| **P5** | Agent 10 chương | ⏳ |
| **P6** | FineTuning 8 chương | ⏳ |
| **P7** | Production 10 chương | ⏳ |
| **P8** | Tích hợp (xem §10) | ⏳ |

Sau P0, **outline phải được duyệt trước khi sinh HTML** — đây là workflow đã chốt từ Pillar 9.

---

## 10. Việc tích hợp cuối (P8)

Danh sách này hay bị bỏ sót, ghi ra để không quên:

1. **`shared/js/progress.js`** — thêm entry pillar:
   `{ id: 'AI', name: 'AI Engineering', total: 58, path: 'AI/index.html', accent: '#5b4b8a' }`
2. **`tools/build-search-index.js`** — 🔴 **cần sửa trước**: script hiện chỉ quét
   `<Pillar>/chuong/*.html`, nên **Pillar 9 (63 chương) đang không được index** và không tìm
   thấy qua ô search. Phải bổ sung xử lý pillar lồng sub-pillar
   (`<Pillar>/<Sub>/chuong/*.html`), rồi thêm cả Pillar 9 và Pillar 10 vào danh sách.
3. **`shared/data/search-index.js`** — regenerate bằng `node tools/build-search-index.js`
4. **Root `index.html`** — thêm card Pillar 10; cập nhật hero + footer + `<meta>` từ
   "9 trụ cột · 147 chương · 135 000+ dòng" → "10 trụ cột · 205 chương · ~210 000 dòng";
   `.overall-progress-fill` đổi gradient từ 9 đoạn sang 10 đoạn; thêm màu
   `.pillar-ai { --card-accent: #5b4b8a; }`; bổ sung giai đoạn AI vào phần "Lộ trình"
5. **`tools/check-links.js`** — chạy kiểm tra link chết toàn dự án
6. Cập nhật memory: `project_it_basic_progress.md`, thêm `project_ai_curriculum.md`

---

## 11. Rủi ro đã nhận diện

| Rủi ro | Cách xử lý |
|---|---|
| **Nội dung lỗi thời nhanh** — giá và model ID đổi vài tháng một lần | Gom số liệu dễ đổi vào ít chỗ nhất (10.2 ch.2 + máy tính chi phí), mỗi bảng có callout "kiểm chứng ngày X — tra lại tại <nguồn>". Dạy cách tra, không bắt nhớ. |
| **Khối lượng lớn** (58 chương) dễ dẫn tới viết ẩu về sau | Giữ nguyên chuẩn §6 cho mọi chương. Nếu đuối thì dừng lại hỏi, không hạ chất lượng. |
| **Trùng lặp giữa các sub-pillar** — vd caching xuất hiện ở 10.2, 10.3, 10.5, 10.6 | Mỗi khái niệm có **một chương chủ**; các chương khác chỉ liên kết tới, không viết lại. Bảng phân công chủ đề nằm ở đầu mỗi outline. |
| **Ví dụ code không chạy được** vì API đổi | Ưu tiên ví dụ dùng khái niệm ổn định (HTTP, JSON schema, thuật toán) hơn là chữ ký hàm của thư viện. Chỗ nào bắt buộc dùng SDK thì ghi rõ phiên bản. |
| **Sa đà vào toán** ở 10.1 | Chương 2 chỉ dạy phần thực sự dùng về sau, mỗi khái niệm toán phải chỉ ra được nó xuất hiện ở chương nào phía sau. |

---

## 12. Tài liệu tham khảo người học cung cấp

Người học gửi **10 trang sổ tay viết tay "Cẩm nang Kỹ thuật AI Hiện đại"** làm tài liệu tham
chiếu. Bảng đối chiếu — mọi trang đều được phủ và mở rộng sâu hơn:

| Trang sổ tay | Chương tương ứng |
|---|---|
| ① AI Engineering là gì + Lộ trình AI Engineer | 10.1 ch.1 |
| ② Cách LLM hoạt động | 10.2 ch.1 (+ Transformer ở 10.1 ch.10) |
| ③ Prompt Engineering | 10.2 ch.4, ch.5 |
| ④ RAG | Toàn bộ 10.3 (10 chương) |
| ⑤ AI Agent | Toàn bộ 10.4 (10 chương) |
| ⑥ AI Engineering Stack | 10.2 ch.2 + 10.6 ch.1 |
| ⑦ Fine-Tuning vs RAG | 10.5 ch.1 + 10.3 ch.1 |
| ⑧ Thiết kế Hệ thống AI | Toàn bộ 10.6 |
| ⑨ Câu hỏi Phỏng vấn AI | 10.6 ch.10 |
| ⑩ Lộ trình AI cho Kỹ sư | 10.1 ch.1 + `AI/index.html` |

### Chỗ sổ tay đã cũ hoặc thiếu — sẽ sửa/bổ sung

| Vấn đề trong sổ tay | Xử lý trong giáo trình |
|---|---|
| Bảng stack liệt kê "GPT-4, Claude 3, Gemini 1.5, Llama 3" | Cập nhật theo bức tranh 8/2026, và quan trọng hơn: dạy **cách chọn mô hình** thay vì liệt kê tên |
| Không nhắc **MCP** dù 2026 đây là chuẩn tích hợp tool | Có hẳn chương riêng: 10.4 ch.4 |
| Observability chỉ nêu tên công cụ | Bổ sung **OpenTelemetry GenAI semantic conventions** — chuẩn vendor-neutral (10.6 ch.3) |
| **Evaluation** gần như không xuất hiện | Thành nội dung xương sống, ở 4 chương khác nhau |
| RAG mô tả dạng "embed → search → prompt" | Bổ sung hybrid retrieval + RRF + reranking — điều kiện cần để RAG chạy được thật; nói rõ **retrieval mới là chỗ hỏng, không phải generation** |
| Fine-tuning trình bày ngang hàng với RAG | Làm rõ thứ tự **Prompt → RAG → Fine-tune → Distill**, và "fine-tune cho *dạng*, RAG cho *dữ kiện*" |
| Bảo mật chỉ có 1 dòng "chống prompt injection" | Chương riêng theo OWASP LLM Top 10 bản 2026, có ví dụ tấn công cụ thể |
| "Agent = LLM + Bộ nhớ + Công cụ + Lập kế hoạch" | Giữ, nhưng bổ sung phần **khi nào KHÔNG cần agent** — thứ sổ tay không có |
