# Sub-pillar 10.5 — Fine-tuning & Model Serving · Outline 8 chương

**Folder:** `AI/FineTuning/`
**Theme:** Neural Paper — lệch tông **lục ô-liu** `#4f6b3a`
**Ước lượng:** ~10.400 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

Đây là sub-pillar **chuyên sâu nhất và ít dùng nhất**. Đa số AI Engineer sẽ không fine-tune mô
hình trong năm đầu đi làm — nhưng **sẽ bị hỏi về nó trong phỏng vấn**, và sẽ phải biết đủ để
nói "không, ở đây RAG là đúng" một cách có căn cứ.

Thông điệp xuyên suốt:

> **Thứ tự đúng là Prompt → RAG → Fine-tune → Distill.** Chỉ đi bước sau khi bước trước đã cạn
> khả năng cải thiện, và bạn có số liệu eval chứng minh điều đó.

> **Fine-tune cho *dạng*, RAG cho *dữ kiện*.** Fine-tuning định hình hành vi, giọng văn, định
> dạng đầu ra, quy ước lĩnh vực. Nó **không phải** cách nhồi kiến thức thay đổi hằng tuần.

Nửa sau (ch.5–8) về serving và hạ tầng hữu ích rộng hơn nhiều — kể cả người không bao giờ
fine-tune vẫn cần hiểu quantization, KV cache, và cách tính VRAM để nói chuyện được với đội
hạ tầng và để hiểu vì sao token đầu ra đắt.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ liên kết tới |
|---|---|---|
| Quyết định fine-tune hay không | ch.1 | 10.3 ch.1 |
| Dữ liệu huấn luyện | ch.2 | — |
| LoRA / QLoRA | ch.3 | — |
| RLHF / DPO / GRPO | ch.4 | 10.2 ch.1 |
| Quantization | ch.5 | 10.2 ch.2 |
| Inference server, KV cache | ch.6 | 10.2 ch.1 (prefill/decode) |
| GPU, VRAM | ch.7 | 10.1 ch.8 |
| Đánh giá mô hình đã tinh chỉnh | ch.8 | 10.6 ch.2 |

---

## Chương 1 — Khi nào fine-tune (~1.250 dòng)

**Mục tiêu:** ra được quyết định fine-tune hay không, có căn cứ; ước lượng được chi phí và
công sức thật.

**Nội dung:**

1. **Thang bậc bốn bước** — Prompt → RAG → Fine-tune → Distill. Mỗi bước: giải quyết vấn đề gì,
   chi phí, thời gian, ai làm được. Quy tắc: **không nhảy bậc.**
2. **Fine-tune cho *dạng*, RAG cho *dữ kiện*** — mục cốt lõi, giải thích kỹ:
   - Fine-tuning ghi vào **trọng số**: hành vi, giọng văn, định dạng, quy ước, cách từ chối
   - RAG ghi vào **ngữ cảnh**: sự kiện, tài liệu, dữ liệu thay đổi
   - Vì sao nhồi dữ kiện bằng fine-tuning là ý tưởng tồi: đắt, chậm cập nhật, không truy vết
     nguồn được, và mô hình vẫn bịa
3. **Sáu trường hợp fine-tuning thật sự đáng** — mỗi cái kèm ví dụ cụ thể:
   - Bám định dạng đầu ra chặt (schema JSON phức tạp, DSL riêng)
   - Giọng văn và phong cách nhất quán (thương hiệu, văn phong pháp lý)
   - Phân loại theo taxonomy riêng có nhiều nhãn
   - Ngôn ngữ hoặc lĩnh vực hẹp mà mô hình gốc yếu (⚠️ gồm cả **tiếng Việt chuyên ngành**)
   - Sinh mã trong framework nội bộ hiếm gặp
   - Chưng cất: mô hình nhỏ đạt chất lượng gần mô hình lớn cho một tác vụ hẹp → giảm chi phí và
     độ trễ ở quy mô lớn
4. **Sáu dấu hiệu KHÔNG nên fine-tune** — chưa thử nghiêm túc prompt engineering; chưa có bộ eval;
   dữ liệu dưới ~500 mẫu chất lượng; kiến thức thay đổi thường xuyên; cần trích dẫn nguồn;
   không có ai vận hành mô hình sau đó
5. **Chi phí thật** — bảng: thu thập và gán nhãn dữ liệu (thường là 80% công sức), tính toán
   huấn luyện, thử nghiệm, đánh giá, phục vụ mô hình riêng, bảo trì khi mô hình nền có bản mới
6. **Fine-tune API vs tự huấn luyện** — nhà cung cấp làm hộ (đơn giản, khoá cứng, ít kiểm soát)
   vs tự chạy trên open-weights (linh hoạt, cần GPU và kỹ năng)
7. **Chưng cất (distillation)** — mô hình lớn sinh dữ liệu, mô hình nhỏ học theo; hiện là con
   đường có tỉ lệ lợi ích/chi phí tốt nhất trong nhiều bài toán production; lưu ý điều khoản
   sử dụng của nhà cung cấp
8. **Cây quyết định đầy đủ** — từ "chất lượng chưa đủ" tới hành động cụ thể, có nhánh quay lại
9. Nghiên cứu tình huống — 3 tình huống: một cái đúng là nên fine-tune, một cái nên dùng RAG,
   một cái chỉ cần sửa prompt. Đi qua lập luận đầy đủ cho từng cái.

**Tương tác:** cây quyết định fine-tuning — trả lời 7 câu hỏi, nhận khuyến nghị kèm ước tính
chi phí/thời gian và lý do.

**Bài tập (4):** ra quyết định cho 8 tình huống và biện luận; ước tính tổng chi phí fine-tune
cho một bài toán cụ thể (gồm cả nhân công gán nhãn); thiết kế thí nghiệm chứng minh prompt đã
cạn khả năng cải thiện; thiết kế pipeline chưng cất cho một tác vụ phân loại.

**Quiz (7):** thứ tự bốn bước; fine-tune cho gì và RAG cho gì; vì sao không nhồi dữ kiện bằng
fine-tuning; cần bao nhiêu dữ liệu tối thiểu; chưng cất là gì; chi phí lớn nhất của fine-tuning
nằm ở đâu; dấu hiệu nào cho thấy chưa nên fine-tune.

---

## Chương 2 — Dữ liệu huấn luyện (~1.300 dòng)

**Mục tiêu:** xây được tập dữ liệu fine-tuning chất lượng; hiểu vì sao dữ liệu quyết định kết quả.

**Thông điệp:** **1.000 mẫu sạch thắng 100.000 mẫu bẩn.** Đây không phải khẩu hiệu — chương này
giải thích cơ chế vì sao.

**Nội dung:**

1. Dữ liệu quyết định kết quả — mô hình học **đúng cái bạn đưa**, kể cả lỗi, thiên lệch, và
   thói quen xấu trong dữ liệu
2. **Cần bao nhiêu mẫu** — khoảng thực tế theo loại tác vụ: bám định dạng (~100–500), giọng văn
   (~500–1.000), tác vụ lĩnh vực hẹp (~1.000–10.000); vì sao "càng nhiều càng tốt" là sai
3. **Nguồn dữ liệu** — log production (tốt nhất, vì đúng phân bố thật), chuyên gia viết tay,
   dữ liệu tổng hợp, tập công khai; ưu nhược từng nguồn
4. **Định dạng chat template** — cấu trúc messages, token đặc biệt, ⚠️ **mỗi mô hình có template
   riêng và dùng sai template là lỗi âm thầm phá hỏng kết quả**; cách kiểm tra template đúng
5. **Chất lượng dữ liệu** — checklist 10 mục: đúng, nhất quán, đa dạng, đại diện phân bố thật,
   độ dài phù hợp, không rò rỉ, không PII, không mâu thuẫn, có ca biên, có ca âm
6. **Ca âm và ca từ chối** — ⚠️ nếu tập dữ liệu chỉ có câu trả lời hữu ích, mô hình học cách
   **luôn trả lời** kể cả khi nên từ chối. Phải có mẫu "không đủ thông tin", "ngoài phạm vi".
7. **Dữ liệu tổng hợp** — sinh bằng mô hình mạnh; kỹ thuật tăng đa dạng; ⚠️ nguy cơ suy thoái do
   tự huấn luyện trên đầu ra của chính mình; luôn cần người rà soát mẫu
8. **Làm sạch và khử trùng lặp** — trùng lặp gần, chuẩn hoá, lọc theo độ dài, phát hiện ngoại lai;
   ⚠️ khử trùng lặp giữa tập huấn luyện và tập đánh giá — **rò rỉ ở đây làm mọi con số vô nghĩa**
   *(nối 10.1 ch.4)*
9. **Chia tập** — train/validation/test cho fine-tuning; test set phải phản ánh phân bố production
10. **Cân bằng nhãn và đa dạng** — mô hình thiên về nhãn xuất hiện nhiều; kỹ thuật cân bằng
11. **Riêng tư và pháp lý** — ⚠️ PII trong dữ liệu huấn luyện **nằm lại trong trọng số vĩnh viễn**,
    không xoá được như xoá một dòng CSDL; quyền sử dụng dữ liệu; giấy phép. *→ 10.6 ch.8.*
12. Đánh phiên bản tập dữ liệu — dữ liệu là mã nguồn; theo dõi thay đổi, tái lập được kết quả

**Tương tác:** trình kiểm tra tập dữ liệu — dán vài mẫu JSONL, nhận cảnh báo theo checklist
(thiếu ca âm, độ dài lệch, trùng lặp, template sai).

**Bài tập (5):** xây tập 100 mẫu cho một tác vụ trích xuất; kiểm tra và làm sạch một tập bẩn cho
sẵn; thêm ca âm và ca từ chối rồi quan sát tác động; sinh dữ liệu tổng hợp có kiểm soát đa dạng;
viết script phát hiện rò rỉ giữa train và test.

**Quiz (8):** vì sao ít-mà-sạch thắng nhiều-mà-bẩn; chat template sai gây gì; ca âm để làm gì;
rò rỉ train/test hậu quả ra sao; dữ liệu tổng hợp rủi ro gì; PII trong dữ liệu huấn luyện xoá
được không; cần bao nhiêu mẫu cho tác vụ định dạng; nguồn dữ liệu nào tốt nhất và vì sao.

---

## Chương 3 — SFT & PEFT: LoRA và QLoRA (~1.350 dòng)

**Mục tiêu:** hiểu LoRA hoạt động thế nào; chạy được một lần fine-tune; chọn được siêu tham số.

**Nội dung:**

1. **Full fine-tuning** — cập nhật toàn bộ trọng số; yêu cầu VRAM (trọng số + gradient + trạng
   thái optimizer ≈ 12–16 byte/tham số với Adam) — con số này giải thích vì sao gần như không ai
   làm full FT trên mô hình lớn
2. **Ý tưởng PEFT** — chỉ huấn luyện một phần rất nhỏ tham số; giữ nguyên (đóng băng) mô hình gốc
3. **LoRA** — mục trung tâm:
   - Trực giác: cập nhật trọng số trong fine-tuning có "hạng thấp" (low-rank), nên xấp xỉ được
     bằng tích hai ma trận nhỏ `A` và `B`
   - Công thức `W' = W + BA`, giải thích tham số **rank `r`** và **alpha**
   - Vì sao chỉ huấn luyện ~0,1–1% tham số mà vẫn hiệu quả
   - Chọn module nào để gắn adapter (attention projections là mặc định tốt)
4. **QLoRA** — mô hình gốc lượng tử hoá 4-bit + adapter LoRA huấn luyện ở độ chính xác cao hơn;
   cho phép fine-tune mô hình 7–14B trên một GPU tiêu dùng; đánh đổi chất lượng
5. **Siêu tham số** — bảng đầy đủ: rank, alpha, learning rate, số epoch, batch size, gradient
   accumulation, warmup, weight decay. Với mỗi cái: khoảng giá trị hợp lý, dấu hiệu đặt sai.
6. **Quên thảm hoạ (catastrophic forgetting)** — mô hình mất năng lực chung sau khi fine-tune hẹp;
   cách phát hiện (giữ một bộ eval năng lực chung để đo trước/sau) và cách giảm (learning rate
   thấp, ít epoch, trộn dữ liệu chung)
7. **Overfitting trong fine-tuning** — dấu hiệu trên loss validation; dừng sớm; vì sao 2–3 epoch
   thường đủ và 10 epoch thường là sai lầm
8. **Đọc đường cong huấn luyện** — 5 dạng đường cong và chẩn đoán tương ứng *(nối 10.1 ch.7)*
9. **Quản lý adapter** — nhiều adapter cho nhiều tác vụ trên cùng mô hình gốc; hoán đổi lúc chạy;
   gộp adapter vào trọng số gốc (merge) khi triển khai
10. **Công cụ** — Hugging Face PEFT + TRL, Unsloth, Axolotl, MLX (Apple Silicon); dịch vụ
    fine-tune của nhà cung cấp
11. **Đi qua một lần fine-tune đầy đủ** — chuẩn bị dữ liệu → cấu hình → huấn luyện → đánh giá →
    lưu adapter, có mã chạy được

**Tương tác:** máy tính VRAM cho fine-tuning — chọn kích thước mô hình, phương pháp (full/LoRA/
QLoRA), độ dài chuỗi, batch size → VRAM ước tính và GPU nào chạy được.

**Bài tập (5):** tính VRAM cần cho full FT vs LoRA vs QLoRA trên mô hình 7B; fine-tune LoRA một
mô hình nhỏ cho tác vụ định dạng; thử 3 giá trị rank và so sánh chất lượng + kích thước adapter;
phát hiện quên thảm hoạ bằng bộ eval năng lực chung; gộp adapter và đo độ trễ suy luận trước/sau.

**Quiz (8):** LoRA huấn luyện cái gì; rank ảnh hưởng ra sao; QLoRA khác LoRA chỗ nào; vì sao full
FT tốn VRAM gấp nhiều lần; quên thảm hoạ phát hiện thế nào; bao nhiêu epoch là hợp lý; adapter
gộp vào trọng số để làm gì; alpha có vai trò gì.

---

## Chương 4 — Alignment: RLHF, DPO, GRPO (~1.250 dòng)

**Mục tiêu:** hiểu mô hình được dạy "cư xử" ra sao; biết khi nào cần bước alignment riêng.

**Nội dung:**

1. Vì sao SFT chưa đủ — SFT dạy mô hình **bắt chước** câu trả lời tốt; nó không dạy mô hình
   **so sánh** hai câu trả lời và biết cái nào tốt hơn
2. **Dữ liệu sở thích (preference data)** — cặp (chọn, loại) cho cùng một prompt; cách thu thập;
   độ đồng thuận giữa người gán nhãn
3. **RLHF** — ba bước: SFT → huấn luyện reward model → tối ưu bằng PPO. Giải thích từng bước;
   vì sao phức tạp và không ổn định (cần giữ 4 mô hình trong bộ nhớ, dễ sập)
4. **DPO** — bỏ hẳn reward model, tối ưu trực tiếp trên cặp sở thích; ổn định hơn, đơn giản hơn,
   là lựa chọn mặc định hiện nay cho phần lớn nhóm
5. **GRPO** — tối ưu theo nhóm mẫu, mạnh ở tác vụ có **phần thưởng kiểm chứng được bằng máy**
   (toán, lập trình — chạy test là biết đúng sai); vì sao đây là chìa khoá của mô hình suy luận
6. **Bảng so sánh** — RLHF / DPO / GRPO theo: độ phức tạp, độ ổn định, dữ liệu cần, phù hợp tác
   vụ nào, chi phí tính toán
7. **Reward hacking** — mô hình tối ưu chỉ số thay vì tối ưu mục tiêu thật (câu trả lời dài hơn
   được chấm cao hơn → mô hình viết dài ra); cách phát hiện và giảm
8. **Thuế alignment (alignment tax)** — mô hình được căn chỉnh có thể kém đi ở một số năng lực;
   đo bằng eval đa dạng
9. **Khi nào cần alignment riêng** — hiếm với phần lớn nhóm: khi cần hành vi từ chối riêng, tông
   giọng đặc thù, hoặc tối ưu chỉ số kinh doanh cụ thể. Với đa số, SFT + prompt là đủ.
10. Alignment và an toàn — mối liên hệ với guardrails ở tầng ứng dụng; ⚠️ **alignment ở tầng mô
    hình không thay thế được guardrails ở tầng hệ thống** *(→ 10.6 ch.5)*

**Tương tác:** trình khám phá dữ liệu sở thích — xem 6 cặp (chọn/loại) và tự chấm, so với nhãn
chuẩn; thấy độ khó của việc gán nhãn sở thích nhất quán.

**Bài tập (4):** gán nhãn 20 cặp sở thích và đo độ nhất quán với bạn học/nhãn chuẩn; giải thích
vì sao DPO đơn giản hơn RLHF; tìm 3 ví dụ reward hacking trong sản phẩm thật; thiết kế bộ eval
phát hiện thuế alignment.

**Quiz (7):** SFT thiếu gì so với alignment; DPO bỏ được thành phần nào của RLHF; GRPO mạnh ở
đâu; reward hacking là gì; thuế alignment đo bằng cách nào; dữ liệu sở thích trông ra sao;
alignment có thay được guardrails không.

---

## Chương 5 — Lượng tử hoá và tối ưu mô hình (~1.250 dòng)

**Mục tiêu:** hiểu lượng tử hoá; chọn được định dạng phù hợp; ước tính được đánh đổi.

**Nội dung:**

1. Vì sao cần — mô hình lớn không vừa VRAM; suy luận chậm và tốn; **bộ nhớ thường là nút thắt
   chứ không phải tốc độ tính toán** ở pha decode *(nối 10.2 ch.1)*
2. **Kiểu số** — FP32, FP16, BF16, FP8, INT8, INT4: số bit, dải giá trị, độ chính xác; vì sao
   BF16 phổ biến trong huấn luyện (dải rộng như FP32, ít bit hơn)
3. **Lượng tử hoá là gì** — ánh xạ trọng số từ độ chính xác cao xuống thấp; scale và zero-point;
   lượng tử hoá theo nhóm (group-wise) để giảm sai số
4. **PTQ vs QAT** — lượng tử hoá sau huấn luyện (nhanh, phổ biến) vs huấn luyện có nhận thức
   lượng tử hoá (tốt hơn, tốn kém)
5. **Các định dạng** — GPTQ, AWQ, GGUF, bitsandbytes: cách hoạt động, dùng ở đâu, công cụ nào hỗ
   trợ; GGUF gắn với llama.cpp và chạy CPU/Apple Silicon
6. **Đánh đổi chất lượng** — bảng: mức bit ↔ mức giảm chất lượng ↔ mức tiết kiệm bộ nhớ; quy tắc
   thực tế (8-bit gần như không mất; 4-bit mất ít trên mô hình lớn, mất nhiều hơn trên mô hình nhỏ)
7. **Lượng tử hoá KV cache** — KV cache có thể vượt cả trọng số về dung lượng khi ngữ cảnh dài;
   lượng tử hoá nó là đòn bẩy lớn cho ngữ cảnh dài
8. **Các kỹ thuật tối ưu khác** — tỉa (pruning), chưng cất *(nối ch.1)*, giải mã suy đoán
   (speculative decoding), FlashAttention
9. **MoE (Mixture of Experts)** — nhiều tham số nhưng chỉ kích hoạt một phần mỗi token; ảnh hưởng
   tới yêu cầu bộ nhớ (vẫn phải nạp hết) và tốc độ
10. **Đo tác động** — perplexity, benchmark tác vụ, và ⚠️ **eval riêng của bạn** — mô hình lượng
    tử hoá có thể giữ điểm benchmark nhưng hỏng ở tác vụ cụ thể của bạn

**Tương tác:** máy tính bộ nhớ mô hình — chọn số tham số, mức bit, độ dài ngữ cảnh, batch size →
VRAM cho trọng số + KV cache; hiện GPU nào chạy được.

**Bài tập (4):** tính bộ nhớ cho mô hình 7B/13B/70B ở FP16/INT8/INT4; lượng tử hoá một mô hình
nhỏ và đo perplexity + tốc độ trước/sau; tính KV cache cho ngữ cảnh 32K và 128K; so sánh chất
lượng 4-bit trên tác vụ riêng bằng bộ eval tự xây.

**Quiz (7):** BF16 khác FP16 chỗ nào; PTQ vs QAT; 4-bit mất bao nhiêu chất lượng; KV cache chiếm
bao nhiêu; GGUF dùng ở đâu; MoE ảnh hưởng bộ nhớ ra sao; đo tác động lượng tử hoá bằng gì.

---

## Chương 6 — Model serving (~1.300 dòng)

**Mục tiêu:** phục vụ mô hình open-weights hiệu quả; hiểu các kỹ thuật tối ưu thông lượng.

**Nội dung:**

1. Suy luận khác huấn luyện — không cần gradient, tối ưu cho độ trễ và thông lượng, mẫu tải
   khác hẳn
2. **Prefill vs decode** — nhắc lại từ 10.2 ch.1 và đi sâu: prefill song song và tính-toán-nặng;
   decode tuần tự và bộ-nhớ-nặng. Toàn bộ kỹ thuật tối ưu bên dưới đều xuất phát từ sự khác biệt
   này.
3. **KV cache** — lưu gì, lớn bao nhiêu, vì sao là nút thắt chính; công thức tính
4. **PagedAttention** — quản lý KV cache theo trang giống bộ nhớ ảo của hệ điều hành; giảm phân
   mảnh triệt để. *→ Nối OS ch.9 (Paging) — cùng một ý tưởng, áp dụng ở tầng khác.*
5. **Continuous batching** — ghép request mới vào batch đang chạy thay vì đợi cả batch xong;
   tác động lớn tới thông lượng
6. **Prefix caching** — tái dùng KV cache cho phần tiền tố chung (system prompt, few-shot);
   tiết kiệm rất lớn khi nhiều request chia sẻ tiền tố. *→ Nối 10.2 ch.7 (prompt caching phía
   API chính là cơ chế này).*
7. **RadixAttention** — chia sẻ tiền tố theo cây, tổng quát hơn prefix caching phẳng
8. **Bảng so sánh inference server** — vLLM, SGLang, TensorRT-LLM, TGI, Ollama, llama.cpp:
   điểm mạnh, phần cứng, độ khó vận hành, phù hợp ai (8/2026, ghi ngày kiểm chứng)
9. **Triển khai** — container hoá, GPU trong Kubernetes, health check, khởi động nguội (nạp mô
   hình mất phút), autoscaling. *→ Nối DevOps ch.5, ch.6, ch.14.*
10. **Đo hiệu năng** — chỉ số phải theo dõi: TTFT, TPOT, thông lượng (token/s), số request đồng
    thời, tỉ lệ chiếm dụng GPU, tỉ lệ prefix cache hit; cách benchmark đúng (tải thực tế, không
    phải một request)
11. **Định tuyến và dự phòng** — nhiều bản sao, cân bằng tải nhận biết KV cache, dự phòng sang
    API khi quá tải. *→ Nối System Design ch.2 (Load Balancer).*
12. **Tự host vs API** — bảng hoà vốn: ở mức lưu lượng nào tự host mới rẻ hơn, tính cả GPU chạy
    không tải, nhân sự vận hành, thời gian chết

**Tương tác:** trình mô phỏng thông lượng — kéo số request đồng thời và độ dài ngữ cảnh, xem
thông lượng và độ trễ thay đổi, có nút bật/tắt continuous batching và prefix caching để thấy
tác động.

**Bài tập (5):** chạy vLLM phục vụ một mô hình nhỏ và benchmark; đo tác động của prefix caching
với system prompt dài; tính điểm hoà vốn tự-host vs API cho 3 mức lưu lượng; cấu hình health
check và autoscaling cho GPU pod; đo TTFT/TPOT ở 3 mức tải.

**Quiz (8):** prefill vs decode khác gì; PagedAttention giải quyết vấn đề gì; continuous batching
giúp gì; prefix caching tiết kiệm khi nào; KV cache lớn theo yếu tố nào; TTFT phụ thuộc gì;
khởi động nguội ảnh hưởng autoscaling ra sao; khi nào tự host rẻ hơn API.

---

## Chương 7 — Hạ tầng GPU (~1.150 dòng)

**Mục tiêu:** đọc được thông số GPU; tính được nhu cầu bộ nhớ; chọn được phần cứng và ước tính
chi phí.

**Nội dung:**

1. **Vì sao GPU** — song song hoá hàng nghìn phép nhân–cộng; so sánh CPU vs GPU về số nhân và
   băng thông bộ nhớ *(nối 10.1 ch.7)*
2. **Thông số quan trọng** — VRAM (quan trọng nhất), băng thông bộ nhớ (quyết định tốc độ decode),
   FLOPS (quyết định tốc độ prefill), số Tensor Core, kết nối liên GPU (NVLink)
3. **Nút thắt băng thông bộ nhớ** — mục hay bị hiểu sai: ở pha decode, GPU chờ nạp trọng số từ
   VRAM chứ không chờ tính toán; nên **băng thông bộ nhớ mới là con số cần nhìn**, không phải TFLOPS
4. **Tính VRAM** — công thức đầy đủ: trọng số + KV cache + kích hoạt + phần dư; ví dụ tính cho
   3 kích thước mô hình ở 3 mức lượng tử hoá
5. **Bảng GPU** — T4, L4, A10G, A100 (40/80GB), H100, và lựa chọn tiêu dùng (RTX 4090/5090);
   VRAM, băng thông, mô hình chạy được, giá thuê tham khảo (ghi ngày kiểm chứng)
6. **CUDA và phần mềm nền** — driver, CUDA toolkit, cuDNN, phiên bản PyTorch; ⚠️ địa ngục tương
   thích phiên bản và cách tránh (dùng image container dựng sẵn)
7. **Nhiều GPU** — song song theo dữ liệu, theo tensor, theo pipeline; khi nào cần; chi phí giao tiếp
8. **Thuê ở đâu** — cloud lớn, nhà cung cấp GPU chuyên biệt, spot instance; đánh đổi giá và độ
   sẵn sàng. *→ Nối DevOps ch.8 (Cloud Platforms).*
9. **Chi phí** — giá theo giờ, chi phí GPU chạy không tải (kẻ giết ngân sách), lập lịch,
   tự động tắt, spot + checkpoint. *→ Nối DevOps ch.13 (FinOps).*
10. **Apple Silicon và chạy cục bộ** — bộ nhớ hợp nhất, MLX, llama.cpp; mô hình nào chạy được
    trên Mac 16/32/64GB — hữu ích trực tiếp cho người học
11. Giám sát GPU — `nvidia-smi`, mức chiếm dụng, nhiệt độ, lỗi OOM và cách đọc

**Tương tác:** trình chọn GPU — nhập kích thước mô hình, mức lượng tử hoá, độ dài ngữ cảnh,
số request đồng thời → GPU nào chạy được, cần mấy con, chi phí ước tính mỗi tháng.

**Bài tập (4):** tính VRAM cho 6 tổ hợp mô hình × lượng tử hoá; chọn GPU cho 3 kịch bản triển
khai; ước tính chi phí tháng cho lưu lượng cho trước, có tính GPU chạy không tải; chạy một mô
hình nhỏ trên máy cá nhân bằng Ollama/MLX và đo tốc độ.

**Quiz (7):** thông số GPU nào quan trọng nhất cho decode; VRAM gồm những gì; vì sao băng thông
quan trọng hơn FLOPS ở decode; NVLink dùng khi nào; spot instance rủi ro gì; GPU chạy không tải
tốn bao nhiêu; bộ nhớ hợp nhất của Apple Silicon lợi ở đâu.

---

## Chương 8 — Đánh giá mô hình đã tinh chỉnh (~1.150 dòng)

**Mục tiêu:** chứng minh được fine-tuning có thật sự cải thiện; phát hiện hồi quy.

**Nội dung:**

1. Vì sao đây là chương cuối — **không có eval thì fine-tuning là mê tín**. Không đo được thì
   không biết mình đã làm tốt hơn hay tệ đi.
2. **Ba câu hỏi phải trả lời**: (a) có tốt hơn mô hình gốc ở tác vụ đích không? (b) có tệ đi ở
   năng lực chung không? (c) có tốt hơn phương án rẻ hơn (prompt/RAG) không? — **câu (c) là câu
   hay bị bỏ qua nhất**
3. **Bộ eval cho mô hình đã tinh chỉnh** — tập giữ riêng (held-out) đúng phân bố production;
   tập năng lực chung để phát hiện quên thảm hoạ; tập ca biên; tập an toàn
4. **So sánh công bằng** — cùng prompt, cùng tham số sinh, cùng tập kiểm thử; ⚠️ so sánh mô hình
   đã tinh chỉnh với mô hình gốc **có prompt tối ưu**, không phải với mô hình gốc dùng prompt tệ —
   đây là cách người ta hay tự lừa mình
5. **Chỉ số** — độ chính xác tác vụ, tỉ lệ hợp lệ theo schema, chỉ số tương đồng văn bản (và giới
   hạn của chúng), LLM-as-judge, chấm tay trên mẫu
6. **Kiểm định ý nghĩa thống kê** — chênh 2% trên 50 mẫu là nhiễu; cần bao nhiêu mẫu; khoảng tin cậy
7. **A/B testing trên production** — chia lưu lượng, chỉ số kinh doanh, thời gian chạy đủ dài,
   tiêu chí dừng
8. **Phát hiện hồi quy** — bộ eval chạy tự động khi có mô hình mới; so sánh với đường cơ sở;
   ngưỡng chặn *(→ 10.6 ch.2, ch.9)*
9. **Đánh giá an toàn** — mô hình đã tinh chỉnh có thể mất hành vi từ chối đã học; ⚠️ fine-tuning
   trên dữ liệu vô hại vẫn có thể làm suy yếu cơ chế an toàn — phải kiểm tra lại
10. **Đánh phiên bản mô hình** — theo dõi mô hình gốc, tập dữ liệu, siêu tham số, kết quả eval;
    tái lập được; lộ trình rollback
11. **Khi kết quả không cải thiện** — cây chẩn đoán: dữ liệu ít/bẩn? siêu tham số sai? bài toán
    vốn không hợp fine-tuning? Và **can đảm kết luận "nên quay lại RAG"** — đây là kết cục hợp lệ
    và thường xuyên xảy ra.

**Tương tác:** bảng điểm so sánh — mô hình gốc / gốc + prompt tốt / đã tinh chỉnh, trên 4 nhóm
chỉ số, kèm khoảng tin cậy để thấy chênh lệch nào là thật.

**Bài tập (4):** xây bộ eval 3 phần cho một mô hình đã tinh chỉnh; so sánh công bằng với mô hình
gốc có prompt tối ưu; tính xem cần bao nhiêu mẫu để chênh 3% có ý nghĩa; kiểm tra hồi quy an toàn
sau fine-tuning.

**Quiz (7):** ba câu hỏi eval phải trả lời; so sánh công bằng nghĩa là gì; vì sao phải có tập
năng lực chung; chênh lệch bao nhiêu mới đáng tin; fine-tuning ảnh hưởng an toàn thế nào; cần
theo dõi gì để tái lập; khi nào nên bỏ fine-tuning quay về RAG.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | Khi nào fine-tune | 1.250 |
| 2 | Dữ liệu huấn luyện | 1.300 |
| 3 | SFT & PEFT: LoRA và QLoRA | 1.350 |
| 4 | Alignment: RLHF, DPO, GRPO | 1.250 |
| 5 | Lượng tử hoá và tối ưu mô hình | 1.250 |
| 6 | Model serving | 1.300 |
| 7 | Hạ tầng GPU | 1.150 |
| 8 | Đánh giá mô hình đã tinh chỉnh | 1.150 |
| | **Tổng** | **~10.000 dòng · 35 bài tập · 59 quiz** |
