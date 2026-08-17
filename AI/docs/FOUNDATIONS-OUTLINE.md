# Sub-pillar 10.1 — Nền tảng AI · Outline 10 chương

**Folder:** `AI/Foundations/`
**Theme:** Neural Paper — lệch tông **cát / hổ phách trầm** `#8a6a3f`
**Ước lượng:** ~12.500 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

Đây là sub-pillar duy nhất người học có thể **lướt nhanh nếu đã có nền ML**. Nó tồn tại để:

1. Trả lời dứt điểm "AI, ML, Deep Learning, Generative AI khác nhau chỗ nào" — câu hỏi phỏng
   vấn kinh điển mà rất nhiều người trả lời lấp lửng.
2. Dạy **đúng lượng toán cần dùng**, không hơn. Mỗi khái niệm toán phải chỉ ra được nó xuất
   hiện ở chương nào phía sau.
3. Xây đường dẫn thẳng tới **Transformer** (ch.10) — vì không hiểu attention thì mọi thứ ở
   10.2 chỉ là học vẹt API.

Người học tự đánh giá: nếu giải thích trôi chảy được backpropagation và self-attention thì
nhảy thẳng sang 10.2.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ được liên kết tới |
|---|---|---|
| AI vs ML vs DL vs GenAI | ch.1 | 10.2 ch.1 |
| Gradient, đạo hàm | ch.2 | ch.7 |
| Overfitting / bias–variance | ch.4 | 10.5 ch.3 |
| Precision / Recall / F1 | ch.6 | 10.3 ch.8, 10.6 ch.2 |
| Backpropagation | ch.7 | ch.8 |
| Attention, self-attention | ch.10 | 10.2 ch.1 |
| Embedding (khái niệm toán) | ch.10 | 10.3 ch.2 (embedding ứng dụng) |

---

## Chương 1 — AI là gì, và AI Engineer làm gì (~1.200 dòng)

**Mục tiêu:** phân biệt dứt điểm 4 tầng khái niệm; hiểu AI Engineer khác ML Engineer / Data
Scientist ở đâu; có lộ trình học cụ thể cho 6 tháng tới.

**Nội dung:**

1. Bốn vòng tròn lồng nhau — AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI. Mỗi tầng: định nghĩa,
   ví dụ điển hình, thứ nó làm được mà tầng ngoài không làm được. *(Diagram 4 hộp lồng nhau,
   thay cho 4 hộp rời trong sổ tay — vì quan hệ là bao hàm, không phải song song.)*
2. Vì sao "AI" là cái tên tệ — hiệu ứng AI (AI effect): thứ gì giải được rồi thì bị coi là
   "không phải AI nữa". Lịch sử: từ hệ chuyên gia → ML thống kê → deep learning → mô hình nền tảng.
3. **Ba nghề hay bị nhầm**, bảng so sánh: đầu vào / đầu ra / công cụ / kỹ năng cốt lõi
   - Data Scientist — phân tích, tìm insight từ dữ liệu
   - ML Engineer — huấn luyện & phục vụ mô hình, quan tâm feature pipeline, MLOps
   - **AI Engineer** — xây ứng dụng trên mô hình có sẵn; kỹ năng chính là kỹ thuật phần mềm +
     hệ thống + đánh giá, không phải huấn luyện mô hình
4. Vì sao nghề AI Engineer chỉ mới tồn tại — trước 2022 muốn dùng NLP phải tự huấn luyện; API
   mô hình nền tảng biến "làm mô hình" thành "gọi mô hình", và trọng tâm dịch chuyển sang
   thiết kế hệ thống quanh mô hình.
5. **"80% kỹ thuật, 20% mô hình"** — bóc tách một ứng dụng AI thật ra thành phần: retrieval,
   guardrails, eval, caching, observability, UI... phần "gọi mô hình" chỉ là một hộp nhỏ.
6. **Lộ trình học** — 7 bước, ánh xạ trực tiếp sang 6 sub-pillar của trụ cột, kèm dấu hiệu
   "đã đủ, đi tiếp được". Đối chiếu với lộ trình trong sổ tay người học gửi.
7. Ba dự án nên làm theo thứ tự tăng dần, kèm tiêu chí "xong" cụ thể:
   chatbot có bộ nhớ → RAG trên corpus thật **có đo bằng eval** → agent gọi tool giải quyết
   quy trình thật
8. Những gì AI **chưa** làm được tính tới 8/2026 — để đặt kỳ vọng đúng và tránh hứa quá trong
   phỏng vấn

**Tương tác:** không (chương định hướng) — bù lại có sơ đồ lộ trình dạng timeline có thể bấm
mở từng giai đoạn.

**Bảng quyết định:** "Bạn muốn làm gì → nên học nhánh nào".

**Bài tập (4):** tự đánh giá năng lực hiện tại theo checklist; phân loại 10 sản phẩm quen thuộc
vào 4 tầng khái niệm; viết mô tả 1 dự án AI muốn làm kèm tiêu chí thành công đo được; tra và
so sánh 3 tin tuyển dụng AI Engineer thật, trích ra kỹ năng lặp lại.

**Quiz (7):** GenAI có phải tập con của DL không (và vì sao "có"); AI Engineer khác ML Engineer;
vì sao phần lớn công việc AI không phải huấn luyện mô hình; hiệu ứng AI; vì sao eval quan trọng
hơn người mới nghĩ; "80/20" nghĩa là gì; lỗi lộ trình thường gặp.

---

## Chương 2 — Toán cho AI: đúng phần cần dùng (~1.300 dòng)

**Mục tiêu:** đọc hiểu ký hiệu trong tài liệu AI; hiểu vector/ma trận đủ để hiểu embedding;
hiểu gradient đủ để hiểu huấn luyện; hiểu xác suất đủ để hiểu sampling.

**Nguyên tắc của chương:** mỗi mục mở đầu bằng ô **"Dùng ở đâu"** trỏ tới chương cụ thể phía
sau. Không có mục nào không trỏ được.

**Nội dung:**

1. **Vector** — danh sách số có ý nghĩa hình học. Độ dài (norm), phép cộng, nhân vô hướng.
   → *Dùng ở 10.3 ch.2: embedding chính là vector.*
2. **Tích vô hướng & cosine similarity** — vì sao góc quan trọng hơn khoảng cách khi so sánh
   ngữ nghĩa; chuẩn hoá vector. → *Dùng ở 10.3 ch.2, ch.5.*
3. **Ma trận** — phép nhân ma trận là gì về mặt trực giác (biến đổi không gian); shape và
   quy tắc khớp chiều — nguồn gốc 90% lỗi shape khi mới học PyTorch.
   → *Dùng ở ch.7, ch.10.*
4. **Đạo hàm & gradient** — độ dốc; gradient là vector chỉ hướng dốc nhất; quy tắc chuỗi.
   Giải thích bằng hình ảnh "đi xuống thung lũng trong sương mù".
   → *Dùng ở ch.7 (backpropagation), 10.5 ch.3.*
5. **Xác suất** — phân phối, xác suất có điều kiện, định lý Bayes (một ví dụ đủ dùng: lọc thư rác).
   → *Dùng ở 10.2 ch.1: LLM xuất ra phân phối xác suất trên từ vựng.*
6. **Softmax** — biến điểm số thô thành phân phối xác suất; vì sao dùng `exp`; tính chất.
   → *Dùng ở 10.2 ch.1 (sampling), ch.10 (attention).*
7. **Thống kê mô tả** — trung bình, phương sai, độ lệch chuẩn, chuẩn hoá dữ liệu.
   → *Dùng ở ch.4, ch.6.*
8. **Entropy & cross-entropy** — đo độ "bất ngờ"; vì sao cross-entropy là hàm mất mát của mô
   hình ngôn ngữ; perplexity là gì. → *Dùng ở ch.7, 10.5 ch.8.*
9. **Ký hiệu toán hay gặp** — bảng tra: Σ, ∇, ‖·‖, argmax, 𝔼, ⊙, θ. Người học có thể quay lại
   tra bất cứ lúc nào.

**Tương tác:** máy tính cosine similarity giữa 2 vector 3 chiều tự nhập, kèm hình chiếu góc.

**Bài tập (5):** tính tay tích vô hướng và cosine của vài cặp vector rồi kiểm chứng bằng NumPy;
giải thích vì sao 2 vector cùng hướng khác độ dài lại có cosine bằng 1; tính softmax tay cho
[2, 1, 0] rồi xem temperature ảnh hưởng thế nào; tính gradient của `f(x) = x²+3x` và tìm cực
tiểu bằng gradient descent viết tay 5 bước; tính cross-entropy cho 2 phân phối dự đoán và giải
thích cái nào "tốt hơn".

**Quiz (8):** vì sao cosine chứ không phải khoảng cách Euclid; softmax làm gì; gradient chỉ
hướng nào; quy tắc chuỗi liên quan gì tới mạng nhiều lớp; cross-entropy đo cái gì; chuẩn hoá
để làm gì; shape `(3,4) @ (4,2)` ra gì; perplexity thấp nghĩa là gì.

---

## Chương 3 — Python cho AI: NumPy, Pandas, Matplotlib (~1.200 dòng)

**Mục tiêu:** thành thạo bộ ba thư viện nền; hiểu vì sao vector hoá (vectorization) nhanh hơn
vòng lặp hàng chục lần.

**Kiến thức cần trước:** Pillar 9 — Python ch.1–4. Chương này giả định đã biết cú pháp Python.

**Nội dung:**

1. Môi trường — `uv`, virtualenv, Jupyter vs script, khi nào dùng notebook (khám phá) và khi
   nào tuyệt đối không (production)
2. **NumPy** — `ndarray`, dtype, shape; indexing & slicing; **broadcasting** (giải thích kỹ,
   đây là nguồn lỗi phổ biến nhất); các phép rút gọn theo `axis`
3. Vector hoá — đo thời gian vòng lặp Python vs NumPy trên cùng phép tính, giải thích khoảng
   cách đến từ đâu (vòng lặp chạy trong C, không phải Python)
4. Đại số tuyến tính với NumPy — `@`, `.T`, `reshape`, `norm`; nối trực tiếp với ch.2
5. **Pandas** — `DataFrame`/`Series`; đọc CSV/JSON/Parquet; chọn lọc, `groupby`, `merge`;
   xử lý thiếu dữ liệu
6. Làm sạch dữ liệu thực tế — trùng lặp, kiểu sai, ngoại lai, chuẩn hoá văn bản tiếng Việt
   (dấu, Unicode NFC/NFD — chỗ rất hay hỏng khi xử lý tiếng Việt)
7. **Matplotlib** — biểu đồ đường/cột/scatter/histogram; khi nào dùng loại nào; đọc biểu đồ
   loss trong huấn luyện
8. Bẫy thường gặp — `SettingWithCopyWarning`, sao chép nông vs sâu, `float32` vs `float64` và
   ảnh hưởng tới bộ nhớ GPU

**Tương tác:** bảng broadcasting tương tác — chọn 2 shape, xem có broadcast được không và
kết quả shape là gì.

**Đối chiếu TS:** không có tương đương thực sự cho NumPy trong hệ JS; nói rõ đây là lý do
hệ sinh thái AI mặc định là Python.

**Bài tập (5):** viết lại 3 vòng lặp thành NumPy vector hoá và đo tốc độ; chuẩn hoá một ma trận
theo cột; làm sạch một CSV bẩn có sẵn; vẽ biểu đồ phân bố độ dài văn bản của một corpus tiếng
Việt; tự cài cosine similarity bằng NumPy rồi so với `sklearn`.

**Quiz (7):** broadcasting `(3,1)` với `(1,4)` ra shape gì; vì sao vector hoá nhanh hơn;
`.copy()` khi nào cần; `axis=0` nghĩa là gì; NFC vs NFD ảnh hưởng gì tới so khớp chuỗi tiếng
Việt; float32 tiết kiệm bao nhiêu bộ nhớ; khi nào không nên dùng notebook.

---

## Chương 4 — Machine Learning cơ bản (~1.250 dòng)

**Mục tiêu:** hiểu bài toán học máy được đặt ra thế nào; nắm chắc overfitting và cách phát hiện.

**Nội dung:**

1. Học máy là gì — học quy luật từ dữ liệu thay vì viết luật bằng tay. Ví dụ đối chiếu: viết
   luật lọc thư rác bằng `if` vs học từ dữ liệu.
2. **Ba nhóm bài toán** — có giám sát (phân loại, hồi quy), không giám sát (phân cụm, giảm
   chiều), học tăng cường. Ví dụ thực tế cho mỗi nhóm. *(Học tăng cường quay lại ở 10.5 ch.4
   dưới dạng RLHF.)*
3. Từ vựng nền — feature, label, mẫu, tham số (parameter) vs siêu tham số (hyperparameter),
   hàm mất mát, huấn luyện vs suy luận
4. **Chia dữ liệu** — train / validation / test; vì sao phải có 3 tập chứ không phải 2; test
   set chỉ được đụng đúng một lần
5. **Overfitting & underfitting** — biểu hiện trên đường cong loss; đánh đổi bias–variance;
   giải thích bằng ví dụ "học thuộc đề" vs "hiểu bài"
6. Cách chống overfitting — thêm dữ liệu, regularization L1/L2, dừng sớm, dropout (nhắc trước,
   chi tiết ở ch.7), giảm độ phức tạp mô hình
7. **Rò rỉ dữ liệu (data leakage)** — dạng phổ biến: chuẩn hoá trước khi chia tập, dùng đặc
   trưng tương lai, trùng lặp giữa train và test. Vì sao nó khiến kết quả đẹp giả tạo.
   *(Quay lại ở 10.6 ch.2 dưới dạng "eval bị nhiễm dữ liệu".)*
8. Cross-validation — k-fold, stratified k-fold, khi nào cần
9. Vòng đời một dự án ML — từ đặt bài toán tới giám sát sau triển khai; và vì sao khâu tốn
   thời gian nhất luôn là dữ liệu

**Tương tác:** slider độ phức tạp mô hình → xem đường khớp dữ liệu chuyển từ underfit sang
overfit, kèm 2 đường loss (train/val) di chuyển tương ứng.

**Bài tập (5):** nhìn 4 cặp đường cong loss, chẩn đoán tình trạng từng cái; tìm chỗ rò rỉ dữ
liệu trong một đoạn code cho sẵn; chia tập đúng cách cho dữ liệu chuỗi thời gian (bẫy: không
được xáo trộn); thiết kế k-fold cho dữ liệu mất cân bằng; giải thích vì sao 99% accuracy có
thể là kết quả tồi.

**Quiz (8):** vì sao cần validation set riêng; overfitting biểu hiện thế nào; bias cao nghĩa là
gì; regularization hoạt động ra sao; rò rỉ dữ liệu nguy hiểm chỗ nào; khi nào k-fold không dùng
được; tham số vs siêu tham số; test set dùng mấy lần.

---

## Chương 5 — Thuật toán ML kinh điển (~1.300 dòng)

**Mục tiêu:** biết 7 thuật toán nền, hiểu chúng phù hợp bài toán nào; dùng được scikit-learn.

**Vì sao vẫn học dù đã có LLM:** rất nhiều bài toán thực tế (phân loại, xếp hạng, phát hiện bất
thường, dự báo) vẫn được giải bằng mô hình cổ điển **rẻ hơn và chính xác hơn** LLM. Chương này
để không dùng búa tạ đập ruồi — và để trả lời phỏng vấn.

**Nội dung:**

1. **Hồi quy tuyến tính** — phương trình, hàm mất mát MSE, nghiệm bằng gradient descent; diễn
   giải hệ số
2. **Hồi quy logistic** — dùng sigmoid biến hồi quy thành phân loại; ngưỡng quyết định;
   vì sao vẫn gọi là "hồi quy"
3. **k-NN** — thuật toán không huấn luyện; chi phí nằm ở suy luận. *→ Nối thẳng tới 10.3 ch.3:
   vector search chính là k-NN quy mô lớn, và đó là lý do cần chỉ mục ANN.*
4. **Cây quyết định** — chia nhánh theo entropy/Gini; ưu điểm lớn nhất là giải thích được
5. **Random Forest & Gradient Boosting** — ensemble; vì sao XGBoost/LightGBM vẫn thắng deep
   learning trên dữ liệu bảng
6. **SVM** — biên lớn nhất, kernel trick (giải thích trực giác, không đi sâu công thức)
7. **k-means** — phân cụm; chọn k bằng elbow/silhouette; hạn chế
8. **PCA** — giảm chiều; phương sai giải thích được. *→ Nối tới 10.3 ch.2: giảm chiều embedding
   để tiết kiệm bộ nhớ vector DB, và tới trực quan hoá embedding 2D.*
9. **scikit-learn** — API thống nhất `fit`/`predict`/`transform`; `Pipeline`; `GridSearchCV`
10. **Bảng chọn thuật toán** — dữ liệu bảng / văn bản / ảnh / chuỗi thời gian × mục tiêu →
    nên thử gì trước

**Tương tác:** so sánh ranh giới quyết định — cùng một tập dữ liệu 2D, xem logistic regression
vs cây quyết định vs k-NN vẽ ranh giới khác nhau thế nào.

**Bài tập (5):** huấn luyện logistic regression trên tập Titanic và diễn giải hệ số; so sánh
random forest vs gradient boosting trên cùng dữ liệu; cài k-means bằng NumPy thuần; dùng PCA
giảm chiều rồi vẽ 2D; chọn thuật toán cho 5 tình huống mô tả sẵn và giải thích lý do.

**Quiz (8):** vì sao logistic regression là phân loại; k-NN tốn kém ở đâu; ensemble giúp gì;
kernel trick giải quyết vấn đề gì; chọn k trong k-means thế nào; PCA mất gì; khi nào cây tốt
hơn mạng nơ-ron; `fit_transform` trên test set sai chỗ nào.

---

## Chương 6 — Đánh giá mô hình (~1.200 dòng)

**Mục tiêu:** chọn đúng chỉ số cho đúng bài toán; đọc được confusion matrix và ROC; hiểu vì sao
accuracy thường là chỉ số tệ.

**Đây là chương xương sống** — precision/recall quay lại ở 10.3 ch.8 (đánh giá retrieval) và
10.6 ch.2 (eval hệ thống LLM).

**Nội dung:**

1. Vì sao accuracy lừa người — ví dụ dữ liệu mất cân bằng 99:1, mô hình "luôn đoán không" đạt
   99% mà vô dụng
2. **Confusion matrix** — TP/FP/TN/FN, đọc theo hàng và theo cột
3. **Precision, Recall, F1** — định nghĩa, trực giác ("nói ra bao nhiêu cái đúng" vs "bắt được
   bao nhiêu cái cần bắt"), đánh đổi giữa chúng
4. Chọn chỉ số theo hậu quả sai — bảng: chẩn đoán bệnh (ưu tiên recall), lọc thư rác (ưu tiên
   precision), gợi ý sản phẩm (ưu tiên precision@k)
5. **Đường cong ROC & AUC**, **Precision–Recall curve** — cái nào dùng khi nào (PR curve tốt
   hơn khi dữ liệu mất cân bằng nặng)
6. Chọn ngưỡng — ngưỡng 0.5 không thiêng liêng; chọn ngưỡng theo chi phí kinh doanh
7. **Chỉ số cho hồi quy** — MAE, MSE, RMSE, R²; MAE vs RMSE khác nhau ở độ nhạy với ngoại lai
8. **Chỉ số cho xếp hạng** — Precision@k, Recall@k, MRR, NDCG. *→ Chuẩn bị trực tiếp cho
   10.3 ch.8, nơi retrieval được đánh giá bằng đúng bộ chỉ số này.*
9. Baseline — luôn phải có; mô hình phức tạp không thắng baseline nghĩa là chưa xong việc
10. Sai lầm khi đánh giá — tối ưu trên test set, so sánh trên tập khác nhau, không có khoảng
    tin cậy

**Tương tác:** confusion matrix tương tác — kéo ngưỡng quyết định, xem TP/FP/TN/FN và
precision/recall/F1 thay đổi theo thời gian thực.

**Bài tập (5):** tính tay precision/recall/F1 từ confusion matrix cho sẵn; chọn chỉ số phù hợp
cho 6 tình huống và biện luận; vẽ ROC từ điểm số dự đoán thô; chọn ngưỡng tối ưu khi biết chi
phí FP và FN; tính NDCG@5 cho một kết quả xếp hạng.

**Quiz (8):** accuracy sai ở đâu; precision vs recall; F1 là trung bình gì và vì sao;
ROC-AUC = 0.5 nghĩa là gì; khi nào dùng PR curve; MAE vs RMSE; NDCG đo cái gì; vì sao cần baseline.

---

## Chương 7 — Deep Learning: mạng nơ-ron và lan truyền ngược (~1.400 dòng)

**Mục tiêu:** hiểu mạng nơ-ron học bằng cách nào; giải thích được backpropagation bằng lời;
biết các lựa chọn thiết kế cơ bản.

**Nội dung:**

1. Từ hồi quy tuyến tính tới nơ-ron — nơ-ron chỉ là hồi quy tuyến tính + hàm phi tuyến
2. Vì sao cần **hàm kích hoạt phi tuyến** — chứng minh trực giác: xếp chồng nhiều lớp tuyến
   tính vẫn chỉ ra một lớp tuyến tính
3. **MLP** — lớp, chiều rộng, chiều sâu; định lý xấp xỉ phổ quát và vì sao nó ít hữu ích trong
   thực tế
4. Hàm kích hoạt — sigmoid, tanh, **ReLU** và các biến thể, GELU/SiLU (dùng trong Transformer);
   vấn đề gradient tiêu biến
5. **Lan truyền ngược (backpropagation)** — quy tắc chuỗi áp dụng cho đồ thị tính toán;
   đi qua một ví dụ mạng 2 lớp **tính tay từng bước**
6. **Optimizer** — SGD, momentum, RMSprop, **Adam/AdamW**; learning rate là siêu tham số quan
   trọng nhất; lịch trình learning rate, warmup
7. Khởi tạo trọng số, chuẩn hoá batch/layer — vì sao **LayerNorm** thắng trong Transformer
8. Regularization trong DL — dropout, weight decay, augmentation, dừng sớm
9. Đọc đường cong huấn luyện — chẩn đoán: learning rate quá cao/thấp, overfit, dữ liệu bẩn
10. Vì sao deep learning cần GPU — song song hoá phép nhân ma trận. *→ Chi tiết ở 10.5 ch.7.*

**Tương tác:** playground mạng nơ-ron mini — chọn số lớp, số nơ-ron, hàm kích hoạt, learning
rate; xem ranh giới quyết định hình thành qua từng epoch trên dữ liệu 2D.

**Bài tập (5):** tính tay forward + backward cho mạng 2-2-1 với số cụ thể; giải thích vì sao
bỏ hàm kích hoạt thì mạng sâu vô nghĩa; thử 4 learning rate và mô tả 4 hành vi quan sát được;
cài gradient descent bằng NumPy cho hồi quy tuyến tính; chẩn đoán 4 đường cong huấn luyện.

**Quiz (8):** vì sao cần phi tuyến; ReLU giải quyết vấn đề gì; backprop dùng quy tắc gì; Adam
khác SGD chỗ nào; learning rate quá cao biểu hiện thế nào; dropout hoạt động ra sao; LayerNorm
vs BatchNorm; gradient tiêu biến là gì.

---

## Chương 8 — PyTorch thực chiến (~1.300 dòng)

**Mục tiêu:** viết được vòng lặp huấn luyện đầy đủ từ đầu; hiểu autograd; debug được lỗi shape
và lỗi thiết bị.

**Nội dung:**

1. Vì sao PyTorch — đồ thị động, hệ sinh thái nghiên cứu, Hugging Face dựng trên nó
2. **Tensor** — giống `ndarray` cộng thêm thiết bị (device) và gradient; chuyển đổi qua lại
   với NumPy
3. **Autograd** — `requires_grad`, `.backward()`, `.grad`; đồ thị tính toán được dựng lúc chạy;
   `torch.no_grad()` khi suy luận
4. **`nn.Module`** — định nghĩa mô hình, `forward`, `parameters()`; các lớp dựng sẵn
5. `Dataset` & `DataLoader` — batch, shuffle, `num_workers`, collate function
6. **Vòng lặp huấn luyện đầy đủ** — 6 bước, viết đi viết lại tới khi thuộc:
   `zero_grad → forward → loss → backward → step → log`. Nêu rõ hậu quả khi quên `zero_grad()`.
7. Đánh giá & lưu mô hình — `model.eval()` vs `model.train()`, `state_dict`, checkpoint
8. GPU — `.to(device)`, lỗi kinh điển "tensor ở khác thiết bị", `torch.cuda.is_available()`,
   mixed precision (FP16/BF16). *→ Nối tới 10.5 ch.5, ch.7.*
9. Debug — đọc lỗi shape, `print(x.shape)` là bạn thân, `torchinfo.summary`, gradient bằng NaN
10. Hugging Face `transformers` — nạp mô hình đã huấn luyện, `pipeline`, tokenizer. Cầu nối
    sang 10.2.

**Tương tác:** bảng vòng lặp huấn luyện tương tác — bấm từng bước, xem tensor nào thay đổi và
gradient chảy đi đâu.

**Bài tập (5):** huấn luyện MLP phân loại MNIST từ đầu tới cuối; cố tình bỏ `zero_grad()` và
giải thích hiện tượng quan sát được; viết `Dataset` tuỳ chỉnh cho dữ liệu văn bản tiếng Việt;
thêm dừng sớm và checkpoint; nạp một mô hình Hugging Face và chạy suy luận trên văn bản tiếng Việt.

**Quiz (8):** `zero_grad()` để làm gì; `no_grad()` khi nào; `model.eval()` ảnh hưởng lớp nào;
`state_dict` chứa gì; lỗi khác thiết bị xảy ra khi nào; `DataLoader` shuffle tập test không;
mixed precision đánh đổi gì; đồ thị động khác tĩnh chỗ nào.

---

## Chương 9 — CNN, RNN/LSTM và giới hạn của chúng (~1.150 dòng)

**Mục tiêu:** hiểu hai kiến trúc thống trị trước Transformer, và **hiểu chính xác vì sao chúng
thất bại với ngôn ngữ dài** — đây là bối cảnh bắt buộc để chương 10 có ý nghĩa.

**Nội dung:**

1. **CNN** — phép tích chập, kernel, feature map, pooling; tính bất biến tịnh tiến
2. Kiến trúc CNN kinh điển và học chuyển giao (transfer learning) — vì sao hiếm khi huấn luyện
   từ đầu. *→ Đây là mầm mống của ý tưởng "mô hình nền tảng + tinh chỉnh" ở 10.5.*
3. CNN ngày nay — vẫn tốt cho thị giác nhỏ gọn; Vision Transformer thay thế ở quy mô lớn
4. **RNN** — trạng thái ẩn, xử lý tuần tự; ý tưởng "bộ nhớ"
5. **Vấn đề gradient tiêu biến** trong chuỗi dài — vì sao RNN quên đầu câu
6. **LSTM/GRU** — cổng quên/vào/ra; cải thiện nhưng không giải quyết triệt để
7. Seq2seq + attention (Bahdanau, 2014) — **thời điểm attention ra đời**, ban đầu chỉ là bản vá
   cho RNN
8. **Ba giới hạn chí mạng của RNN**, dẫn thẳng sang chương 10:
   - Không song song hoá được theo chiều thời gian → huấn luyện chậm, không scale
   - Đường đi của thông tin giữa 2 token cách xa nhau là O(n) bước → tín hiệu suy giảm
   - Nút thắt cổ chai: nén cả câu nguồn vào một vector trạng thái
9. Câu hỏi kết chương: "nếu attention hữu ích đến thế, sao không **bỏ hẳn** RNN và chỉ giữ
   attention?" → đó chính là tiêu đề bài báo năm 2017.

**Tương tác:** minh hoạ tích chập — chọn kernel (làm mờ, phát hiện cạnh, làm nét), xem tác động
lên ảnh mẫu theo từng bước trượt.

**Bài tập (4):** tính tay đầu ra tích chập 3×3 trên ma trận 5×5; giải thích vì sao pooling giảm
tham số; vẽ sơ đồ đường đi gradient trong RNN 10 bước và chỉ chỗ tín hiệu suy giảm; liệt kê
3 lý do RNN không song song hoá được.

**Quiz (7):** CNN khai thác tính chất gì của ảnh; pooling để làm gì; RNN quên vì sao; LSTM giải
quyết bằng cách nào; attention xuất hiện lần đầu để làm gì; vì sao RNN chậm khi huấn luyện;
transfer learning tiết kiệm cái gì.

---

## Chương 10 — Transformer: kiến trúc chạy mọi LLM (~1.500 dòng)

**Mục tiêu:** giải thích được self-attention bằng lời và bằng công thức; hiểu vì sao kiến trúc
này song song hoá được; đọc được sơ đồ khối Transformer.

**Đây là chương quan trọng nhất của sub-pillar** — cầu nối trực tiếp sang 10.2.

**Nội dung:**

1. Bối cảnh — "Attention Is All You Need" (2017); ý tưởng cốt lõi: bỏ hẳn đệ quy, chỉ dùng
   attention
2. **Embedding token** — từ ID token thành vector; ma trận embedding học được là gì
3. **Mã hoá vị trí (positional encoding)** — vì sao **bắt buộc** phải có (attention vốn không
   phân biệt thứ tự); sinusoidal, learned, và **RoPE** — thứ hầu hết mô hình hiện đại dùng
4. **Self-attention** — trái tim của chương:
   - Trực giác Query / Key / Value bằng phép ẩn dụ tra cứu từ điển mềm
   - Công thức `softmax(QKᵀ/√d)V`, giải thích **từng thành phần**, kể cả vì sao chia `√d`
   - Đi qua một ví dụ số cụ thể trên câu 4 token, tính tay
5. **Multi-head attention** — nhiều "góc nhìn" song song; mỗi đầu học quan hệ khác nhau
   (cú pháp, đồng tham chiếu…)
6. **Masked self-attention** — vì sao mô hình sinh văn bản phải che token tương lai; ma trận
   mặt nạ tam giác
7. **Khối Transformer đầy đủ** — attention → cộng dư (residual) → LayerNorm → mạng feed-forward
   → cộng dư → LayerNorm; xếp chồng N khối
8. Ba biến thể và ai dùng cái nào — encoder-only (BERT: hiểu, phân loại, **embedding**),
   decoder-only (GPT/Claude/Llama: **sinh văn bản** — dạng thống trị hiện nay),
   encoder-decoder (T5: dịch, tóm tắt)
9. **Vì sao Transformer thắng** — song song hoá toàn bộ chuỗi khi huấn luyện; đường đi giữa 2
   token bất kỳ là O(1); scaling law hoạt động tốt
10. **Cái giá phải trả: độ phức tạp O(n²)** theo độ dài chuỗi — đây chính là gốc rễ của giới
    hạn cửa sổ ngữ cảnh, của chi phí token, và của mọi kỹ thuật tối ưu KV cache về sau.
    *→ Nối trực tiếp tới 10.2 ch.7 (context engineering) và 10.5 ch.5–6.*
11. Từ Transformer tới LLM — pretraining ở quy mô lớn biến kiến trúc này thành mô hình nền tảng.
    *→ Chi tiết ở 10.2 ch.1.*

**Tương tác:** **attention heatmap** — câu mẫu tiếng Việt, ma trận trọng số attention tô màu,
hover một token thấy nó "chú ý" tới token nào; chuyển giữa các đầu (head) để thấy mỗi đầu học
quan hệ khác nhau. Kèm nút bật/tắt mặt nạ nhân quả để thấy tam giác trên bị che.

**Bài tập (5):** tính tay self-attention cho chuỗi 3 token với Q/K/V cho sẵn; giải thích vì sao
bỏ positional encoding thì "chó cắn người" và "người cắn chó" thành giống hệt nhau; vẽ ma trận
mặt nạ nhân quả cho chuỗi 5 token; tính số phép toán attention cho chuỗi 1K vs 10K token và
nhận xét; cài self-attention một đầu bằng NumPy thuần.

**Quiz (8):** vì sao chia `√d`; Q, K, V khác nhau về vai trò; positional encoding giải quyết gì;
masked attention dùng ở đâu và vì sao; multi-head hơn single-head chỗ nào; residual connection
để làm gì; decoder-only vs encoder-only dùng cho việc gì; O(n²) gây hệ quả thực tế nào.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | AI là gì, và AI Engineer làm gì | 1.200 |
| 2 | Toán cho AI: đúng phần cần dùng | 1.300 |
| 3 | Python cho AI: NumPy, Pandas, Matplotlib | 1.200 |
| 4 | Machine Learning cơ bản | 1.250 |
| 5 | Thuật toán ML kinh điển | 1.300 |
| 6 | Đánh giá mô hình | 1.200 |
| 7 | Deep Learning: mạng nơ-ron và lan truyền ngược | 1.400 |
| 8 | PyTorch thực chiến | 1.300 |
| 9 | CNN, RNN/LSTM và giới hạn của chúng | 1.150 |
| 10 | Transformer: kiến trúc chạy mọi LLM | 1.500 |
| | **Tổng** | **~12.800 dòng · 47 bài tập · 77 quiz** |
