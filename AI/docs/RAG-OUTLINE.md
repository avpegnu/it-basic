# Sub-pillar 10.3 — RAG & Tìm kiếm ngữ nghĩa · Outline 10 chương

**Folder:** `AI/RAG/`
**Theme:** Neural Paper — lệch tông **xanh mòng két** `#2f6f6a`
**Ước lượng:** ~12.800 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

RAG là kiến trúc ứng dụng AI phổ biến nhất trong doanh nghiệp, và cũng là thứ **bị làm sai
nhiều nhất**. Sổ tay người học gửi mô tả RAG ở mức "embed → search → prompt" — mức đó chạy được
demo nhưng hỏng trong production.

Thông điệp xuyên suốt sub-pillar:

> **Khi RAG cho câu trả lời tệ, phần lớn thời gian lỗi nằm ở khâu truy xuất, không phải khâu
> sinh.** Đổi mô hình lớn hơn không cứu được retrieval tồi.

Vì vậy 6/10 chương dành cho retrieval (embedding, vector DB, chunking, hybrid search, rerank,
đánh giá), chỉ 1 chương cho generation.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ liên kết tới |
|---|---|---|
| Embedding (ứng dụng) | ch.2 | 10.1 ch.10 (lý thuyết) |
| Chỉ mục ANN (HNSW/IVF) | ch.3 | Database ch.5 |
| Chunking | ch.4 | 10.2 ch.7 |
| Hybrid search + RRF | ch.5 | — |
| Reranking | ch.6 | — |
| Đánh giá RAG | ch.8 | 10.1 ch.6, 10.6 ch.2 |
| GraphRAG / Agentic RAG | ch.9 | 10.4 |

---

## Chương 1 — Vì sao cần RAG (~1.200 dòng)

**Mục tiêu:** hiểu RAG giải bài toán gì; biết khi nào **không** cần RAG.

**Nội dung:**

1. Bốn giới hạn của LLM trần mà RAG nhắm tới — mốc dữ liệu huấn luyện, không biết dữ liệu riêng
   tư, không truy vết được nguồn, dễ ảo giác trên chủ đề hiếm
2. **RAG là gì** — đưa thông tin liên quan vào ngữ cảnh **ngay tại thời điểm hỏi**, thay vì
   nhồi vào trọng số mô hình
3. **Kiến trúc RAG tối giản** — 5 bước; đi qua một ví dụ đầy đủ có dữ liệu thật, xem prompt cuối
   cùng gửi lên mô hình trông ra sao *(nhiều người học chưa từng nhìn thấy prompt này)*
4. **Hai pha tách biệt** — pha nạp dữ liệu (offline: tải → chunk → embed → lưu) và pha truy vấn
   (online: embed câu hỏi → tìm → rerank → prompt → trả lời). Nhầm lẫn hai pha là lỗi kiến trúc
   phổ biến.
5. **RAG vs Fine-tuning vs Long-context** — bảng so sánh 3 chiều theo: loại kiến thức, tần suất
   cập nhật, chi phí, độ trễ, khả năng truy vết nguồn. Quy tắc:
   **fine-tune cho *dạng* (giọng văn, định dạng, hành vi), RAG cho *dữ kiện*.**
6. **Khi nào KHÔNG cần RAG** — dữ liệu đủ nhỏ để nhét thẳng vào prompt; kiến thức đã có sẵn
   trong mô hình; câu hỏi không phụ thuộc tài liệu; khi truy vấn CSDL có cấu trúc là đáp án đúng
   (text-to-SQL, không phải RAG)
7. **RAG không phải lúc nào cũng là vector search** — với dữ liệu có cấu trúc, một câu SQL đúng
   tốt hơn mọi embedding; giới thiệu ý tưởng bộ định tuyến truy vấn
8. Vì sao RAG hay thất bại — dẫn số liệu: khi RAG trả lời sai, phần lớn trường hợp là do khâu
   truy xuất không đưa được đoạn văn đúng vào ngữ cảnh. Đặt nền cho toàn bộ sub-pillar.
9. Bản đồ đường đi 10 chương — chương nào giải quyết khâu nào trong pipeline

**Tương tác:** **RAG pipeline stepper** — bấm từng bước, xem dữ liệu biến đổi: câu hỏi → vector
→ kết quả tìm kiếm → sau rerank → prompt cuối → câu trả lời. Có nút "làm hỏng" từng khâu để
thấy hậu quả lan xuống cuối.

**Bảng quyết định:** 10 tình huống → RAG / fine-tune / long-context / SQL / không cần gì cả.

**Bài tập (5):** quyết định giải pháp cho 8 tình huống và biện luận; vẽ sơ đồ 2 pha cho một hệ
thống hỏi đáp tài liệu nội bộ; tính xem corpus bao lớn thì hết nhét vừa long-context; tìm 3
trường hợp trong đó SQL đúng hơn RAG; viết prompt RAG tối giản bằng tay và quan sát đầu ra.

**Quiz (7):** RAG giải quyết giới hạn nào; hai pha khác nhau ra sao; fine-tune cho gì và RAG cho
gì; long-context có thay được RAG không; khi nào không cần RAG; RAG hỏng chủ yếu ở khâu nào;
RAG có luôn dùng vector search không.

---

## Chương 2 — Embedding (~1.300 dòng)

**Mục tiêu:** hiểu embedding là gì, chọn được mô hình embedding, và biết bẫy với tiếng Việt.

**Kiến thức cần trước:** 10.1 ch.2 (cosine), 10.1 ch.10 (embedding trong Transformer).

**Nội dung:**

1. Embedding là gì — ánh xạ văn bản thành vector sao cho **gần nhau về nghĩa ⇒ gần nhau trong
   không gian**; điều này khác hoàn toàn khớp từ khoá
2. Không gian vector — chiều (dimension); trực giác về "hướng mang nghĩa"; vì sao số chiều cao
   lại cần thiết
3. **Cosine similarity** — vì sao là thước đo mặc định; so với tích vô hướng và khoảng cách
   Euclid; vai trò của chuẩn hoá vector
4. Mô hình embedding hoạt động thế nào — thường là Transformer encoder-only + pooling; embedding
   câu ≠ trung bình embedding từ
5. **Embedding không đối xứng cho tìm kiếm** — câu hỏi và tài liệu có phân bố khác nhau; nhiều
   mô hình yêu cầu tiền tố (`query:` / `passage:`) — ⚠️ **quên tiền tố là lỗi âm thầm làm giảm
   chất lượng mà không báo lỗi**
6. **Chọn mô hình embedding** — khung 6 tiêu chí: chất lượng truy xuất trên **dữ liệu của bạn**,
   hỗ trợ đa ngôn ngữ, số chiều (ảnh hưởng bộ nhớ và tốc độ), độ dài đầu vào tối đa, chi phí,
   API hay tự host. Kèm bảng tham chiếu 8/2026 có ghi ngày kiểm chứng.
7. **MTEB và giới hạn của nó** — bảng xếp hạng hữu ích để lọc sơ bộ, nhưng không đo được lĩnh vực
   riêng của bạn; **luôn phải đo lại trên dữ liệu thật** *(→ ch.8)*
8. **Tiếng Việt** — mục quan trọng riêng: mô hình chỉ-tiếng-Anh kém hẳn; các lựa chọn đa ngôn
   ngữ; chuẩn hoá Unicode NFC; ảnh hưởng của dấu; cách tự benchmark nhanh trên corpus tiếng Việt
9. Chi phí và thông lượng — giá theo triệu token, batch hoá, cache embedding *(embed lại cùng
   một chunk nhiều lần là lãng phí phổ biến)*
10. **Không trộn mô hình embedding** — vector từ 2 mô hình khác nhau không so sánh được; đổi mô
    hình ⇒ phải embed lại toàn bộ corpus; hệ quả vận hành và cách phòng (lưu tên + phiên bản mô
    hình kèm mỗi vector)
11. Giảm chiều & lượng tử hoá vector — Matryoshka embedding, cắt chiều, lưu int8/binary; đánh
    đổi bộ nhớ ↔ độ chính xác

**Tương tác:** **Embedding 2D** — ~40 từ/cụm từ tiếng Việt đã chiếu xuống 2D bằng PCA (toạ độ
tính sẵn); chọn 2 mục bất kỳ → hiện cosine similarity; có nhóm màu theo chủ đề để thấy cụm.

**Bài tập (5):** tính cosine giữa 5 cặp câu và xếp hạng độ liên quan; kiểm chứng tác động của
tiền tố `query:`/`passage:` trên cùng tập câu hỏi; so sánh 2 mô hình embedding trên 20 cặp
câu hỏi–đoạn văn tiếng Việt; đo mức giảm chất lượng khi cắt embedding từ 1024 xuống 256 chiều;
xây cache embedding có khoá theo hash nội dung.

**Quiz (8):** embedding khác khớp từ khoá chỗ nào; vì sao dùng cosine; tiền tố query/passage để
làm gì; trộn 2 mô hình embedding có được không; số chiều ảnh hưởng gì; MTEB đủ để chọn mô hình
chưa; NFC/NFD ảnh hưởng ra sao; đổi mô hình embedding phải làm gì.

---

## Chương 3 — Vector Database (~1.300 dòng)

**Mục tiêu:** hiểu chỉ mục ANN hoạt động thế nào; chọn được vector store phù hợp quy mô.

**Nội dung:**

1. Bài toán — tìm k vector gần nhất trong hàng triệu vector; brute-force là O(N·d) mỗi truy vấn
2. **ANN (Approximate Nearest Neighbor)** — đánh đổi độ chính xác lấy tốc độ; khái niệm **recall**
   của chỉ mục (khác recall của bài toán truy xuất — phân biệt rõ)
3. **HNSW** — đồ thị nhiều tầng; trực giác "đi tắt tầng cao rồi tinh chỉnh tầng thấp"; tham số
   `M`, `ef_construction`, `ef_search` và tác động của từng cái. *→ Nối Database ch.5: cùng họ
   tư duy với B-tree — cấu trúc dữ liệu đánh đổi bộ nhớ lấy tốc độ tra cứu.*
4. **IVF, PQ, IVF-PQ** — phân cụm + lượng tử hoá tích; khi nào tốt hơn HNSW (bộ nhớ hạn chế)
5. **Lọc theo metadata** — pre-filter vs post-filter, và vì sao "lọc rồi tìm" khó hơn nghe tưởng
   trên chỉ mục đồ thị; ⚠️ đây là chỗ nhiều hệ thống âm thầm mất recall
6. **Bảng so sánh vector store** (8/2026, có ghi ngày kiểm chứng): pgvector, Qdrant, Pinecone,
   Weaviate, Milvus, Chroma, FAISS — theo: mô hình vận hành, hybrid search có sẵn không, lọc
   metadata, quy mô phù hợp, chi phí
7. **pgvector là mặc định hợp lý** — nếu đã có Postgres: cùng backup, cùng quyền, cùng transaction,
   một hệ thống ít hơn để vận hành. Đủ tốt cho phần lớn workload dưới ~10M vector. Chỉ rời đi khi
   có lý do đo được. *→ Nối Database ch.10 (Replication & Sharding).*
8. Schema và metadata — thiết kế trường lọc (nguồn, ngày, quyền truy cập, phiên bản); lưu văn bản
   gốc ở đâu (trong vector store hay ngoài)
9. **Kiểm soát truy cập** — ⚠️ multi-tenancy trong vector store: mỗi truy vấn **phải** lọc theo
   quyền, nếu không sẽ rò rỉ tài liệu giữa các khách hàng. Đây là lỗi bảo mật RAG phổ biến nhất.
10. Vận hành — cập nhật/xoá vector, xây lại chỉ mục, sao lưu, giám sát độ trễ p95
11. Đo hiệu năng — recall@k của chỉ mục vs độ trễ; cách chọn `ef_search`

**Tương tác:** **vector search demo** — index đồ chơi 200 điểm 2D; so sánh brute-force và HNSW
về số phép so sánh và kết quả trả về; kéo `ef_search` để thấy đánh đổi recall/tốc độ.

**Bài tập (5):** cài brute-force k-NN bằng NumPy và đo thời gian theo N; dựng pgvector với chỉ
mục HNSW và đo recall@10 ở 3 mức `ef_search`; thiết kế schema metadata cho hệ thống tài liệu
đa phòng ban có phân quyền; tìm lỗi rò rỉ tenant trong đoạn code truy vấn cho sẵn; ước tính bộ
nhớ cần cho 5 triệu vector ở 3 mức số chiều.

**Quiz (8):** ANN đánh đổi gì; HNSW hoạt động ra sao; `ef_search` ảnh hưởng gì; pre-filter vs
post-filter; khi nào pgvector đủ; lưu văn bản gốc ở đâu; multi-tenancy rò rỉ thế nào; recall của
chỉ mục khác recall truy xuất ra sao.

---

## Chương 4 — Nạp dữ liệu & Chunking (~1.350 dòng)

**Mục tiêu:** xây pipeline nạp dữ liệu đáng tin; chọn chiến lược chunk đúng cho từng loại tài liệu.

**Thông điệp chương:** chunking là quyết định có **ảnh hưởng lớn nhất** tới chất lượng RAG, và
là chỗ ít được đầu tư nhất.

**Nội dung:**

1. Pipeline nạp dữ liệu — nguồn → tải → parse → làm sạch → chunk → làm giàu metadata → embed →
   lưu. Mỗi khâu có lỗi đặc trưng riêng.
2. **Parse tài liệu** — PDF (văn bản vs quét ảnh; bảng biểu; nhiều cột), DOCX, HTML (bỏ nav/quảng
   cáo), Markdown, mã nguồn, bảng tính. Kèm khuyến nghị công cụ và **cách kiểm tra chất lượng
   parse** (bước hay bị bỏ qua — parse hỏng thì mọi thứ phía sau vô nghĩa)
3. Làm sạch — bỏ header/footer lặp, sửa lỗi xuống dòng, chuẩn hoá khoảng trắng và Unicode,
   khử trùng lặp
4. **Vì sao phải chunk** — giới hạn đầu vào của mô hình embedding; nhiễu loãng khi đoạn quá dài;
   độ chính xác truy xuất
5. **Bốn chiến lược chunking**, mỗi cái kèm ưu/nhược và loại tài liệu phù hợp:
   - Cố định theo token + overlap — mặc định "tạm ổn"
   - Đệ quy theo dấu phân cách (đoạn → câu → từ) — mặc định tốt hơn
   - **Theo cấu trúc** (heading, section, hàm trong mã nguồn) — thường tốt nhất khi tài liệu có
     cấu trúc rõ
   - **Ngữ nghĩa** — cắt ở chỗ nghĩa đổi, đo bằng độ tương tự giữa các câu liền kề
6. **Chọn kích thước chunk** — không có con số thần thánh; cách xác định bằng thực nghiệm với
   bộ eval; đánh đổi: chunk nhỏ = truy xuất chính xác nhưng thiếu ngữ cảnh; chunk lớn = ngược lại
7. **Overlap** — vì sao cần, bao nhiêu là đủ, cái giá phải trả (lưu trữ + kết quả trùng lặp)
8. **Làm giàu ngữ cảnh cho chunk** — kỹ thuật quan trọng: thêm tiêu đề tài liệu + đường dẫn
   heading + tóm tắt ngữ cảnh vào đầu mỗi chunk trước khi embed. Giải quyết vấn đề "chunk mồ côi"
   (đoạn văn có đại từ mà không biết nó chỉ ai).
9. **Metadata** — nguồn, tiêu đề, đường dẫn section, ngày, tác giả, quyền, phiên bản, số trang.
   Metadata tốt cho phép lọc, trích dẫn chính xác, và cập nhật tăng dần.
10. **Chunk cha–con (parent–child)** — truy xuất bằng chunk nhỏ, đưa vào ngữ cảnh bằng chunk cha
    lớn hơn; kết hợp ưu điểm hai phía
11. Xử lý bảng biểu và hình ảnh — chuyển bảng thành Markdown, mô tả hình bằng mô hình thị giác
    *(→ 10.2 ch.8)*
12. **Cập nhật tăng dần** — phát hiện tài liệu đổi bằng hash, xoá/thay chunk cũ, tránh embed lại
    toàn bộ; xử lý tài liệu bị xoá

**Tương tác:** **chunking playground** — dán văn bản, chọn 1 trong 4 chiến lược + kích thước +
overlap, xem chunk được tô màu tách biệt; hiện số token mỗi chunk và cảnh báo chunk mồ côi.

**Bài tập (5):** chunk cùng một tài liệu bằng 4 chiến lược rồi so sánh chất lượng truy xuất trên
10 câu hỏi; cài chunking theo heading cho Markdown; thêm làm giàu ngữ cảnh và đo cải thiện;
thiết kế schema metadata cho tài liệu pháp lý có phiên bản; cài cập nhật tăng dần dựa trên hash.

**Quiz (8):** chunk nhỏ và lớn đánh đổi gì; overlap giải quyết vấn đề gì; chunk mồ côi là gì;
làm giàu ngữ cảnh giúp thế nào; parent–child hoạt động ra sao; parse hỏng ảnh hưởng tới đâu;
metadata dùng để làm gì ngoài lọc; cập nhật tăng dần phát hiện thay đổi bằng cách nào.

---

## Chương 5 — Truy xuất: dense, sparse và hybrid (~1.300 dòng)

**Mục tiêu:** hiểu vì sao vector search một mình không đủ; xây được hybrid retrieval.

**Nội dung:**

1. **Vector search một mình hỏng ở đâu** — mở đầu bằng ví dụ cụ thể: mã sản phẩm, tên riêng,
   số hiệu, thuật ngữ hiếm, từ viết tắt. Embedding "hiểu nghĩa" nhưng **mờ về ký tự chính xác**.
2. **Tìm kiếm sparse / từ khoá** — TF-IDF, **BM25**: công thức và trực giác từng thành phần
   (tần suất từ, độ hiếm, chuẩn hoá độ dài). Vì sao BM25 sau nhiều thập kỷ vẫn rất mạnh.
   *→ Nối Database ch.11 (Full-text search).*
3. **Dense vs sparse** — bảng so sánh: cái gì mỗi bên bắt được và bỏ sót; kết luận **bổ sung
   cho nhau, không thay thế**
4. **Hybrid search** — chạy song song 2 nhánh rồi hợp nhất
5. **Reciprocal Rank Fusion (RRF)** — công thức `Σ 1/(k + rank)`; vì sao hợp nhất theo **hạng**
   ổn định hơn theo điểm số (điểm số 2 hệ khác thang đo, không so được); chọn `k`
6. Hợp nhất theo điểm số có trọng số — khi nào dùng được, và vấn đề chuẩn hoá thang điểm
7. **Sparse vector học được** — SPLADE, miniCOIL: kết hợp ưu điểm hai phía; hỗ trợ trong các
   vector store hiện đại
8. **Xử lý truy vấn** — nơi cải thiện rẻ nhất:
   - Viết lại truy vấn (rõ nghĩa, bỏ từ thừa)
   - Mở rộng truy vấn (thêm từ đồng nghĩa, thuật ngữ liên quan)
   - **Phân rã truy vấn** cho câu hỏi nhiều ý → nhiều truy vấn con
   - **HyDE** — sinh câu trả lời giả rồi embed nó (câu trả lời giả gần tài liệu hơn câu hỏi)
   - Viết lại theo lịch sử hội thoại — ⚠️ bắt buộc với chatbot: "còn cái kia thì sao?" tự nó
     không truy xuất được gì
9. **Định tuyến truy vấn** — chọn nguồn dữ liệu / chọn công cụ (vector, SQL, API) theo loại
   câu hỏi
10. Chọn `top-k` — lấy rộng ở khâu truy xuất (50–100) rồi để rerank thu hẹp *(→ ch.6)*;
    vì sao top-k nhỏ ngay từ đầu là sai lầm
11. Khử trùng lặp và đa dạng hoá (MMR) — tránh 5 kết quả gần như giống hệt nhau

**Tương tác:** so sánh truy xuất — nhập truy vấn, xem 3 danh sách kết quả cạnh nhau (dense /
BM25 / hybrid-RRF) trên corpus mẫu; highlight tài liệu chỉ một bên tìm ra.

**Bài tập (5):** cài BM25 từ đầu bằng Python; xây hybrid + RRF và đo cải thiện recall@10 trên
bộ 20 câu hỏi; tìm 5 truy vấn mà dense thua BM25 và 5 truy vấn ngược lại; cài viết lại truy vấn
theo lịch sử hội thoại; so sánh HyDE với truy vấn thô trên câu hỏi mơ hồ.

**Quiz (8):** vì sao vector search bỏ sót mã sản phẩm; BM25 phạt/thưởng cái gì; RRF hợp nhất theo
gì và vì sao; HyDE hoạt động ra sao; vì sao chatbot cần viết lại truy vấn; top-k nên lấy rộng hay
hẹp và vì sao; MMR giải quyết vấn đề gì; SPLADE thuộc loại nào.

---

## Chương 6 — Reranking & lắp ráp ngữ cảnh (~1.150 dòng)

**Mục tiêu:** dùng reranker đúng cách; lắp ráp ngữ cảnh cuối tối ưu cho mô hình sinh.

**Nội dung:**

1. Vì sao cần rerank — retrieval tối ưu cho tốc độ trên hàng triệu tài liệu, nên buộc phải xấp
   xỉ; rerank tối ưu cho độ chính xác trên vài chục ứng viên
2. **Bi-encoder vs cross-encoder** — mấu chốt: bi-encoder mã hoá câu hỏi và tài liệu **riêng rẽ**
   (nên tính trước được, nhanh); cross-encoder đọc **cả cặp cùng lúc** (chính xác hơn nhiều,
   nhưng không tính trước được). Đây là lý do kiến trúc 2 tầng tồn tại.
3. **Mẫu truy xuất 2 tầng** — lấy 50–100 ứng viên bằng hybrid → rerank → giữ 5–10 đưa vào prompt.
   Kèm số liệu về mức cải thiện precision.
4. Lựa chọn reranker — API vs tự host; mô hình cross-encoder phổ biến; ColBERT (late interaction)
   như phương án trung gian
5. Chi phí và độ trễ của rerank — thêm bao nhiêu ms, tốn bao nhiêu; khi nào không đáng
6. **LLM-as-reranker** — dùng mô hình nhỏ chấm điểm liên quan; đắt hơn nhưng linh hoạt hơn
7. **Lắp ráp ngữ cảnh cuối** — phần nhiều người bỏ qua:
   - Thứ tự các đoạn (**"lost in the middle"**: đặt đoạn tốt nhất ở đầu và cuối)
   - Định dạng mỗi đoạn (đánh số, kèm nguồn để trích dẫn được)
   - Dấu phân cách rõ ràng giữa các đoạn và giữa đoạn với chỉ dẫn
   - ⚠️ **Đánh dấu rõ đây là dữ liệu, không phải chỉ dẫn** — phòng prompt injection
     *(→ 10.6 ch.4)*
8. **Ngân sách ngữ cảnh** — bao nhiêu đoạn là đủ; chừa chỗ cho câu trả lời; điểm lợi ích giảm dần
9. Nén ngữ cảnh — trích câu liên quan trong đoạn, tóm tắt đoạn dài trước khi đưa vào
10. Ngưỡng liên quan — khi **không có** đoạn nào đủ tốt thì phải nói "không tìm thấy" thay vì cố
    trả lời bằng rác *(→ ch.7)*

**Tương tác:** so sánh trước/sau rerank — cùng truy vấn, 2 cột kết quả với điểm liên quan, tô màu
tài liệu thực sự đúng để thấy rerank kéo chúng lên.

**Bài tập (5):** thêm cross-encoder rerank vào pipeline và đo precision@5 trước/sau; đo thêm bao
nhiêu độ trễ và chi phí; thử nghiệm thứ tự đoạn (tốt nhất ở đầu / giữa / cuối) và so sánh chất
lượng câu trả lời; cài ngưỡng liên quan + đường thoát "không tìm thấy"; nén đoạn dài bằng trích
câu và đo tác động.

**Quiz (7):** bi-encoder vs cross-encoder khác nhau ở đâu; vì sao không rerank luôn cả triệu tài
liệu; lấy bao nhiêu ứng viên rồi rerank; "lost in the middle" xử lý thế nào; vì sao phải đánh dấu
đoạn là dữ liệu; ngưỡng liên quan để làm gì; ColBERT nằm ở đâu trong phổ.

---

## Chương 7 — Sinh câu trả lời & trích dẫn nguồn (~1.150 dòng)

**Mục tiêu:** viết prompt RAG buộc mô hình bám ngữ cảnh và dẫn nguồn kiểm chứng được.

**Nội dung:**

1. Cấu trúc prompt RAG — vai trò, chỉ dẫn, ngữ cảnh có đánh số, câu hỏi, yêu cầu định dạng.
   Mẫu đầy đủ có thể dùng lại.
2. **Chỉ dẫn grounding** — câu chữ cụ thể hiệu quả: "chỉ dùng thông tin trong ngữ cảnh", "nếu
   ngữ cảnh không chứa câu trả lời, hãy nói không tìm thấy"; kèm phần **vì sao chỉ dẫn không đủ**
   và phải chặn thêm ở tầng ứng dụng
3. **Trích dẫn nguồn** — 3 cách: chú thích inline `[1]`, trích dẫn có cấu trúc qua schema, đánh
   dấu span trong văn bản gốc. Đánh đổi của mỗi cách.
4. ⚠️ **Kiểm chứng trích dẫn** — mô hình bịa được cả số trích dẫn; phải đối chiếu chuỗi được
   trích với tài liệu gốc ở tầng ứng dụng, đánh dấu trích dẫn không khớp
5. **Xử lý "không tìm thấy"** — thiết kế sản phẩm cho câu trả lời rỗng; gợi ý câu hỏi khác; đưa
   sang con người; ⚠️ đây là hành vi **quan trọng nhất** để người dùng tin hệ thống
6. Ngữ cảnh mâu thuẫn — khi 2 tài liệu nói ngược nhau: nêu cả hai, ưu tiên theo ngày/nguồn uy tín
7. Câu hỏi nhiều chặng — khi câu trả lời cần ghép từ nhiều đoạn; giới hạn của RAG một vòng
   *(→ ch.9)*
8. Streaming câu trả lời RAG — hiển thị nguồn trước hay sau; trải nghiệm người dùng
9. **Thiết kế UI cho RAG** — hiện đoạn nguồn, cho bấm mở tài liệu gốc, chỉ báo độ tin cậy, cơ chế
   phản hồi (👍/👎 chính là nguồn dữ liệu eval quý nhất) *(→ ch.8)*
10. Bảo mật ở khâu sinh — nội dung truy xuất là **dữ liệu không tin cậy**; lọc PII trước khi
    đưa vào ngữ cảnh; không để tài liệu điều khiển hành vi *(→ 10.6 ch.4–5)*

**Tương tác:** so sánh 3 prompt RAG (không grounding / có grounding / có grounding + trích dẫn)
trên cùng ngữ cảnh, kèm đầu ra thực tế ghi sẵn và đánh dấu chỗ khác biệt.

**Bài tập (5):** viết prompt RAG đầy đủ rồi kiểm thử với câu hỏi nằm ngoài tài liệu; cài kiểm
chứng trích dẫn đối chiếu văn bản gốc; xử lý ca 2 tài liệu mâu thuẫn; thiết kế trải nghiệm
"không tìm thấy"; thêm chú thích inline có link tới đoạn nguồn.

**Quiz (7):** grounding bằng chỉ dẫn có đủ không; trích dẫn có bịa được không; vì sao "không tìm
thấy" quan trọng; xử lý mâu thuẫn thế nào; nội dung truy xuất có đáng tin không; đánh số đoạn để
làm gì; phản hồi người dùng dùng vào việc gì.

---

## Chương 8 — Đánh giá RAG (~1.350 dòng)

**Mục tiêu:** đo được chất lượng RAG bằng số; biết khâu nào đang hỏng.

**Đây là chương quan trọng nhất về mặt thực chiến** — không có eval thì mọi cải tiến chỉ là cảm tính.

**Nội dung:**

1. Vì sao "thấy có vẻ ổn" không đủ — không so sánh được thay đổi, không phát hiện hồi quy,
   không biết cải thiện đến từ đâu
2. **Tách bạch đánh giá 2 tầng** — nguyên tắc nền tảng: đánh giá **retrieval** riêng và
   **generation** riêng. Nếu retrieval không lấy được đoạn đúng thì generation có giỏi mấy cũng
   vô nghĩa; trộn hai thứ lại thì không biết sửa đâu.
3. **Xây golden dataset** — 50–200 cặp câu hỏi–đáp án chuẩn với đoạn văn nguồn; nguồn câu hỏi:
   log thật, chuyên gia, sinh tổng hợp; phải có **câu hỏi bẫy không trả lời được**
4. **Chỉ số retrieval** — Recall@k, Precision@k, MRR, NDCG@k, Hit Rate. *→ Định nghĩa đã học ở
   10.1 ch.6; ở đây áp dụng.* Chỉ số nào quan trọng nhất trong bối cảnh RAG và vì sao
   (thường là Recall@k ở tầng retrieval, vì rerank sẽ lo precision).
5. **Chỉ số generation** — faithfulness (câu trả lời có bám ngữ cảnh không), answer relevancy,
   context precision/recall, độ chính xác trích dẫn
6. **LLM-as-judge** — cách viết prompt chấm điểm; thang điểm rời rạc kèm tiêu chí thay vì "chấm
   1–10"; ⚠️ **hiệu chuẩn judge với bộ chấm tay** — đây là nguồn sai số lớn nhất và bị đầu tư ít
   nhất; thiên lệch của judge (thiên vị câu dài, thiên vị vị trí)
7. Công cụ — Ragas, DeepEval, Promptfoo, Phoenix, LangSmith, Braintrust: mỗi cái mạnh ở đâu;
   mẫu phổ biến là **một công cụ cho eval lúc phát triển + một cho giám sát production**
8. **Quy trình cải thiện có hệ thống** — chẩn đoán theo cây quyết định:
   - Recall@50 thấp → lỗi chunking hoặc embedding hoặc thiếu keyword search
   - Recall cao nhưng Precision@5 thấp → cần rerank
   - Retrieval tốt nhưng câu trả lời tệ → lỗi prompt hoặc lắp ráp ngữ cảnh
   - Faithfulness thấp → grounding yếu
9. Eval online — phản hồi người dùng, tỉ lệ click nguồn, tỉ lệ hỏi lại, tỉ lệ chuyển sang người
10. **Eval trong CI** — chạy bộ eval mỗi khi đổi prompt/chunking/mô hình; ngưỡng chặn merge
    *(→ 10.6 ch.9)*
11. Chi phí eval — chạy bao nhiêu mẫu là đủ; lấy mẫu thông minh

**Tương tác:** **bảng điểm eval** — chọn 4 cấu hình RAG (baseline / +hybrid / +rerank / +làm giàu
ngữ cảnh), xem bảng chỉ số so sánh và biểu đồ; bấm vào một câu hỏi để xem nó hỏng ở khâu nào.

**Bài tập (5):** xây golden dataset 30 câu cho một corpus có sẵn; tính Recall@k và MRR cho 2 cấu
hình; viết prompt LLM-as-judge cho faithfulness rồi hiệu chuẩn với 20 mẫu chấm tay; chẩn đoán 4
kịch bản chỉ số cho sẵn và đề xuất cách sửa; dựng eval chạy tự động trong GitHub Actions.

**Quiz (8):** vì sao tách retrieval và generation; Recall@k đo gì trong RAG; faithfulness là gì;
LLM-as-judge cần hiệu chuẩn thế nào; judge thiên lệch ra sao; golden dataset cần câu hỏi loại gì;
recall cao + precision thấp thì sửa đâu; eval trong CI chặn cái gì.

---

## Chương 9 — RAG nâng cao (~1.250 dòng)

**Mục tiêu:** biết các biến thể RAG và khi nào chúng đáng phần chi phí tăng thêm.

**Nội dung:**

1. Khi RAG cơ bản không đủ — câu hỏi nhiều chặng, câu hỏi tổng hợp toàn corpus ("có bao nhiêu
   hợp đồng hết hạn quý này"), câu hỏi so sánh, câu hỏi thời gian
2. **Agentic RAG** — mô hình tự quyết định tìm gì, tìm mấy lần, khi nào đủ; vòng lặp
   truy xuất–suy luận. Chi phí và độ trễ tăng nhiều lần → **chỉ đáng khi độ chính xác là bắt buộc**
   (pháp lý, y tế, tài chính). *→ Nối 10.4.*
3. **Self-RAG / CRAG** — mô hình tự chấm điểm chất lượng đoạn truy xuất, tự quyết định truy xuất
   lại hay dùng kiến thức nội tại
4. **Multi-hop RAG** — phân rã câu hỏi, truy xuất theo chuỗi, ghép bằng chứng; chống lỗi lan truyền
5. **GraphRAG** — dựng đồ thị thực thể–quan hệ từ corpus; mạnh ở câu hỏi tổng hợp và câu hỏi về
   quan hệ; ⚠️ chi phí xây đồ thị rất lớn — nói thẳng khi nào **không** đáng
6. **Contextual retrieval** — thêm ngữ cảnh sinh bởi LLM vào từng chunk lúc nạp; hiệu quả cao,
   chi phí một lần; *(đã nhắc ở ch.4, ở đây phân tích sâu và đo)*
7. **RAG đa phương thức** — nhúng ảnh và văn bản vào cùng không gian; truy xuất bảng biểu và hình
   *(→ 10.2 ch.8)*
8. **RAG trên dữ liệu có cấu trúc** — text-to-SQL, kết hợp truy vấn CSDL với tìm kiếm ngữ nghĩa;
   khi nào đây mới là kiến trúc đúng. *→ Nối Database ch.2–3.*
9. **RAG hội thoại** — quản lý lịch sử, viết lại truy vấn theo ngữ cảnh, biết khi nào **không cần
   truy xuất** (câu chào hỏi, câu nói tiếp)
10. **Bảng đánh đổi** — 8 biến thể × độ phức tạp / chi phí / độ trễ / mức cải thiện / khi nào dùng.
    Thông điệp: **phần lớn hệ thống nên hoàn thiện RAG cơ bản cho tốt trước khi nghĩ tới biến thể.**

**Tương tác:** sơ đồ cây quyết định — trả lời 5 câu hỏi về đặc điểm bài toán, nhận gợi ý biến thể
RAG phù hợp kèm ước tính chi phí tương đối.

**Bài tập (5):** cài multi-hop RAG cho câu hỏi 2 chặng; đo chênh lệch chi phí/độ trễ giữa RAG cơ
bản và agentic RAG trên 20 câu; cài contextual retrieval và đo cải thiện recall; thiết kế bộ định
tuyến chọn giữa SQL và vector search; cài phát hiện "câu này không cần truy xuất".

**Quiz (7):** agentic RAG đắt hơn bao nhiêu và đáng khi nào; GraphRAG mạnh ở loại câu hỏi nào;
contextual retrieval làm gì; multi-hop lỗi lan truyền ra sao; khi nào text-to-SQL đúng hơn RAG;
RAG hội thoại cần xử lý gì thêm; nên tối ưu cái gì trước khi dùng biến thể.

---

## Chương 10 — Dự án: RAG production (~1.350 dòng)

**Mục tiêu:** ghép toàn bộ 9 chương thành một hệ thống hoàn chỉnh, có eval, có giám sát.

**Nội dung:**

1. Đề bài — trợ lý hỏi đáp tài liệu nội bộ: nhiều nguồn (PDF, Confluence, Google Docs), phân
   quyền theo phòng ban, có trích dẫn, tiếng Việt
2. **Kiến trúc đầy đủ** — sơ đồ có mọi thành phần: nguồn dữ liệu, hàng đợi nạp, worker,
   embedding service, vector store, API truy vấn, reranker, orchestrator, LLM, cache, eval,
   observability. *→ Nối System Design ch.5 (Message Queue), DevOps ch.6 (K8s).*
3. **Pipeline nạp dữ liệu** — lập lịch, phát hiện thay đổi bằng hash, xử lý lỗi, dead-letter
   queue, chạy lại; ước tính thời gian nạp lần đầu
4. **Đường truy vấn** — chi tiết từng bước với ngân sách độ trễ cho mỗi khâu (embed 20ms,
   search 30ms, rerank 100ms, LLM 2s…) và tổng p95 mục tiêu
5. **Phân quyền** — ⚠️ ánh xạ quyền của người dùng thành bộ lọc metadata; kiểm thử rò rỉ giữa các
   phòng ban; ghi log truy cập
6. **Caching nhiều tầng** — cache embedding, cache kết quả truy xuất, cache câu trả lời (ngữ
   nghĩa), prompt caching. *→ Nối System Design ch.3.*
7. **Giám sát** — độ trễ theo khâu, tỉ lệ cache hit, phân bố điểm liên quan, tỉ lệ "không tìm
   thấy", chi phí trên mỗi truy vấn, phản hồi người dùng. *→ 10.6 ch.3.*
8. **Vòng lặp eval** — bộ eval chạy hằng đêm, dashboard xu hướng, cảnh báo khi tụt
9. **Kế hoạch triển khai theo giai đoạn** — MVP (một nguồn, không rerank) → thêm hybrid → thêm
   rerank → thêm eval → mở rộng nguồn. Mỗi giai đoạn có tiêu chí "đủ tốt để đi tiếp".
10. **Checklist production 25 mục** — dùng được như checklist thật: dữ liệu, truy xuất, sinh,
    bảo mật, vận hành, chi phí
11. Sai lầm thường gặp trong dự án RAG thật — 10 mục rút từ các chương trước, mỗi mục kèm dấu
    hiệu nhận biết sớm

**Tương tác:** sơ đồ kiến trúc tương tác — bấm vào từng thành phần để xem trách nhiệm, công nghệ
gợi ý, và chương nào trong sub-pillar nói về nó.

**Bài tập (5):** xây RAG hoàn chỉnh trên corpus tài liệu tiếng Việt của chính mình; thêm phân
quyền và viết test chứng minh không rò rỉ; dựng bộ eval và chạy trong CI; thêm giám sát chi phí
và độ trễ theo khâu; viết tài liệu kiến trúc 2 trang cho hệ thống của mình.

**Quiz (8):** ngân sách độ trễ phân bổ thế nào; phân quyền cài ở đâu trong pipeline; cache tầng
nào tiết kiệm nhiều nhất; dead-letter queue để làm gì; MVP nên bỏ qua khâu nào; giám sát chỉ số
nào cảnh báo sớm nhất; nạp lại toàn bộ vs tăng dần; tỉ lệ "không tìm thấy" tăng nghĩa là gì.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | Vì sao cần RAG | 1.200 |
| 2 | Embedding | 1.300 |
| 3 | Vector Database | 1.300 |
| 4 | Nạp dữ liệu & Chunking | 1.350 |
| 5 | Truy xuất: dense, sparse và hybrid | 1.300 |
| 6 | Reranking & lắp ráp ngữ cảnh | 1.150 |
| 7 | Sinh câu trả lời & trích dẫn nguồn | 1.150 |
| 8 | Đánh giá RAG | 1.350 |
| 9 | RAG nâng cao | 1.250 |
| 10 | Dự án: RAG production | 1.350 |
| | **Tổng** | **~12.700 dòng · 50 bài tập · 76 quiz** |
