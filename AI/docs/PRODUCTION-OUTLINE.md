# Sub-pillar 10.6 — AI System Design & Production · Outline 10 chương

**Folder:** `AI/Production/`
**Theme:** Neural Paper — lệch tông **xám đá xanh** `#3c5570`
**Ước lượng:** ~13.100 dòng HTML
**Trạng thái:** 📝 chờ duyệt

---

## Vai trò của sub-pillar này

Đây là sub-pillar **quyết định người học có được nhận việc hay không**. Ai cũng làm được demo
RAG cuối tuần; thứ phân biệt AI Engineer thật là biết đưa nó vào production và giữ nó sống.

Ba thông điệp xuyên suốt:

> **1. Đánh giá (eval) là kỹ năng hạng nhất.** Không có eval thì mọi thay đổi là mê tín, không
> có cách nào biết bản mới tốt hơn hay tệ hơn. Đây cũng là thứ được hỏi nhiều nhất trong phỏng vấn.

> **2. Prompt injection là lỗ hổng kiến trúc, không phải bug.** Chỉ dẫn và dữ liệu dùng chung một
> kênh, và **không tồn tại thứ gì tương đương prepared statement** để tách chúng. Vì vậy phòng thủ
> phải nằm ở tầng hệ thống: hạn chế quyền, xác thực đầu ra, phê duyệt — chứ không phải ở tầng
> "prompt cẩn thận hơn".

> **3. Ứng dụng AI vẫn là phần mềm.** Mọi thứ đã học ở System Design và DevOps đều áp dụng, chỉ
> thêm vài đặc thù: chi phí theo token, đầu ra không tất định, độ trễ tính bằng giây.

## Chủ đề "thuộc" sub-pillar này (chương chủ)

| Chủ đề | Chương chủ | Nơi khác chỉ liên kết tới |
|---|---|---|
| Kiến trúc tổng thể | ch.1 | 10.3 ch.10, 10.4 ch.10 |
| Eval, LLM-as-judge | ch.2 | 10.3 ch.8, 10.4 ch.9, 10.5 ch.8 |
| Observability, tracing | ch.3 | mọi nơi |
| Prompt injection, OWASP | ch.4 | 10.2 ch.6, 10.4 ch.3–4 |
| Guardrails | ch.5 | 10.2 ch.9 |
| Độ trễ, mở rộng | ch.6 | 10.2 ch.10 |
| FinOps cho AI | ch.7 | 10.2 ch.10 |
| Quyền riêng tư, tuân thủ | ch.8 | 10.4 ch.5 |
| CI/CD, versioning prompt | ch.9 | 10.2 ch.5 |

---

## Chương 1 — Kiến trúc ứng dụng AI (~1.300 dòng)

**Mục tiêu:** vẽ được kiến trúc đầy đủ của một ứng dụng AI production; biết mỗi tầng chịu trách
nhiệm gì.

**Nội dung:**

1. Vì sao "gọi API là xong" chỉ đúng với demo — liệt kê thứ demo không có: eval, guardrails,
   observability, caching, quản lý chi phí, xử lý lỗi, phân quyền
2. **Kiến trúc tham chiếu 7 tầng** — sơ đồ trung tâm của chương, mỗi tầng có trách nhiệm rõ:
   1. Client (web/mobile) — streaming, trạng thái chờ, hiển thị nguồn
   2. API Gateway — xác thực, hạn mức, định tuyến. *→ System Design ch.7.*
   3. **Orchestrator** — trái tim: xây prompt, gọi tool, quản lý ngữ cảnh, vòng lặp
   4. Tầng dữ liệu — vector store, CSDL, cache, blob. *→ 10.3.*
   5. Tầng mô hình — API nhà cung cấp và/hoặc mô hình tự host. *→ 10.5 ch.6.*
   6. Tầng an toàn — guardrails vào/ra, kiểm duyệt, PII. *→ ch.5.*
   7. Tầng quan sát — tracing, chỉ số, log, eval. *→ ch.3.*
3. **Đồng bộ vs bất đồng bộ** — request–response cho chat; hàng đợi cho việc dài (agent, nạp dữ
   liệu, batch); webhook/polling để báo kết quả. *→ System Design ch.5.*
4. **Vì sao cần một orchestrator riêng** — không rải logic AI khắp code nghiệp vụ; một nơi để đo,
   một nơi để đổi mô hình, một nơi để thêm guardrails
5. **Trừu tượng hoá nhà cung cấp** — nên có lớp mỏng; ⚠️ nhưng **mỏng**: trừu tượng hoá dày sẽ
   chặn mất tính năng mới và làm khó debug. Cái gì nên trừu tượng hoá và cái gì không.
6. **Quản lý trạng thái** — hội thoại, phiên, tác vụ dài, bộ nhớ; lưu ở đâu; ⚠️ orchestrator nên
   stateless để mở rộng ngang
7. **Ba kiến trúc mẫu** — vẽ đầy đủ, đối chiếu:
   - Chatbot RAG (đồng bộ, độ trễ thấp)
   - Agent chạy nền (bất đồng bộ, hàng đợi, tác vụ dài)
   - Pipeline xử lý theo lô (nạp dữ liệu, phân loại hàng loạt)
8. **Chế độ suy giảm (degraded mode)** — điều gì xảy ra khi nhà cung cấp mô hình chết: mô hình dự
   phòng, câu trả lời từ cache, thông báo trung thực; ⚠️ **phải thiết kế trước, không phải xử lý
   khi sự cố**
9. **Ranh giới môi trường** — dev/staging/prod; dữ liệu thật trong staging là rủi ro riêng tư;
   khoá API tách biệt
10. **Chống mẫu (anti-pattern)** — gọi LLM thẳng từ frontend, không có timeout, đồng bộ cho việc
    dài, không có hạn mức, ghi log cả prompt chứa PII, một orchestrator khổng lồ làm mọi thứ

**Tương tác:** sơ đồ kiến trúc tương tác — bấm vào từng tầng xem trách nhiệm, công nghệ gợi ý,
chế độ hỏng, và chương nào nói về nó.

**Bài tập (5):** vẽ kiến trúc cho 3 sản phẩm mô tả sẵn; thiết kế chế độ suy giảm cho một chatbot
hỗ trợ; tìm 5 chống mẫu trong một kiến trúc cho sẵn; thiết kế ranh giới stateless cho orchestrator;
quyết định đồng bộ hay bất đồng bộ cho 6 tính năng.

**Quiz (8):** orchestrator chịu trách nhiệm gì; vì sao trừu tượng hoá nên mỏng; khi nào dùng hàng
đợi; chế độ suy giảm là gì; orchestrator nên stateless vì sao; gọi LLM từ frontend sai chỗ nào;
trạng thái hội thoại nên lưu ở đâu; API Gateway làm gì trong kiến trúc AI.

---

## Chương 2 — Evaluation: đo chất lượng hệ thống AI (~1.450 dòng)

**Mục tiêu:** xây được hệ thống eval hoàn chỉnh; biết dùng LLM-as-judge đúng cách.

**Đây là chương dài nhất và quan trọng nhất của sub-pillar.** Kỹ năng bị hỏi nhiều nhất trong
phỏng vấn AI Engineer 2026, và bị dạy ít nhất.

**Nội dung:**

1. Vì sao eval khó với hệ thống AI — đầu ra không tất định, nhiều câu trả lời đúng, chất lượng
   chủ quan, không có "compile error" báo cho biết đã sai
2. **Ba loại eval** — bảng, kèm khi nào dùng:
   - Tất định — khẳng định chính xác, khớp regex, hợp lệ theo schema, chạy test. **Luôn ưu tiên.**
   - Thống kê — tương đồng ngữ nghĩa, chỉ số truy xuất
   - LLM-as-judge — cho tiêu chí mở, chủ quan
3. **Golden dataset** — cách xây: nguồn (log production là tốt nhất), quy mô (bắt đầu 50, tăng
   dần), đa dạng, phải có **ca biên và ca không-trả-lời-được**; đánh phiên bản; ai sở hữu
4. **Viết tiêu chí eval** — sai lầm phổ biến nhất: tiêu chí mơ hồ ("câu trả lời có tốt không").
   Cách viết tiêu chí kiểm được: "câu trả lời có nêu đúng số tiền hoàn trả tối đa không",
   "câu trả lời có dẫn ít nhất một nguồn có trong ngữ cảnh không".
5. **LLM-as-judge** — mục dài, chi tiết:
   - Cách viết prompt chấm điểm; thang rời rạc có mô tả từng mức thay vì "chấm 1–10"
   - Chấm một câu (pointwise) vs so sánh cặp (pairwise) — pairwise ổn định hơn nhiều
   - ⚠️ **Hiệu chuẩn judge**: chấm tay 30–50 mẫu, đo mức đồng thuận giữa judge và người; đây là
     **nguồn sai số lớn nhất** và là bước hầu hết nhóm bỏ qua
   - Thiên lệch của judge: thiên vị câu dài, thiên vị vị trí (đảo thứ tự để khử), thiên vị
     tự-ưa-chuộng (mô hình chấm cao đầu ra của chính họ)
   - Chọn mô hình làm judge; chi phí eval
6. **Offline vs online eval** — offline: golden dataset, chạy trước khi triển khai; online: phản
   hồi người dùng, chỉ số ngầm (tỉ lệ hỏi lại, tỉ lệ bỏ giữa chừng, tỉ lệ leo thang), A/B test
7. **Chỉ số theo loại ứng dụng** — bảng: chatbot / RAG / agent / trích xuất / phân loại; chỉ số
   nào quan trọng cho từng loại. *→ Liên kết tới 10.3 ch.8 và 10.4 ch.9.*
8. **Eval trong CI** — chạy tự động khi đổi prompt / chunking / mô hình; ngưỡng chặn merge;
   chi phí và thời gian; lấy mẫu để giảm chi phí. *→ ch.9.*
9. **Phát hiện trôi (drift)** — chất lượng tụt dần vì dữ liệu đổi, hành vi người dùng đổi, hoặc
   nhà cung cấp âm thầm cập nhật mô hình; ⚠️ **eval định kỳ trên tập cố định là cách duy nhất
   phát hiện việc mô hình bên ngoài đổi hành vi**
10. **Vòng lặp cải thiện** — log production → lấy mẫu ca hỏng → thêm vào golden dataset → sửa →
    đo lại. Đây là động cơ chính giúp hệ thống tốt lên theo thời gian.
11. **Công cụ** — Ragas, DeepEval, Promptfoo, Phoenix, LangSmith, Braintrust, MLflow: mạnh ở đâu;
    mẫu phổ biến là một công cụ cho dev-time và một cho production monitoring (8/2026, ghi ngày
    kiểm chứng)
12. **Xây eval tối giản trong 50 dòng** — chứng minh không cần công cụ nào để bắt đầu; và đó là
    lý do không có cớ để không có eval

**Tương tác:** **bảng điều khiển eval** — chọn 3 phiên bản hệ thống, xem bảng chỉ số + biểu đồ
xu hướng; bấm vào một ca hỏng để xem đầu vào, đầu ra, điểm judge, và lý do.

**Bài tập (5):** xây golden dataset 40 mẫu cho một tính năng; viết 5 tiêu chí eval kiểm được từ
5 tiêu chí mơ hồ; viết prompt LLM-as-judge và hiệu chuẩn với 30 mẫu chấm tay, báo cáo mức đồng
thuận; đo thiên lệch vị trí của judge bằng cách đảo thứ tự; dựng eval chạy trong GitHub Actions
có ngưỡng chặn.

**Quiz (8):** vì sao ưu tiên eval tất định; pairwise hơn pointwise ở đâu; hiệu chuẩn judge làm
thế nào; thiên lệch vị trí khử ra sao; drift phát hiện bằng cách nào; tiêu chí eval tốt trông
thế nào; golden dataset cần ca gì; eval trong CI chặn cái gì.

---

## Chương 3 — Observability cho ứng dụng AI (~1.300 dòng)

**Mục tiêu:** dựng được hệ quan sát cho ứng dụng AI; debug được sự cố production.

**Nội dung:**

1. Vì sao observability của AI khác — một request là cả một cây lời gọi (LLM, retrieval, tool);
   chi phí gắn với từng lời gọi; "lỗi" thường là **câu trả lời tệ** chứ không phải exception
2. **Ba trụ cột** — trace, chỉ số, log; áp dụng vào bối cảnh AI.
   *→ Nối DevOps ch.10 (Prometheus, Grafana, Loki, OpenTelemetry, Jaeger).*
3. **Tracing** — mục trung tâm: một trace = một request người dùng; span cho mỗi bước (embed,
   search, rerank, LLM call, tool call); span lồng nhau cho agent; trace là công cụ debug số một
4. **OpenTelemetry GenAI semantic conventions** — chuẩn vendor-neutral cho thuộc tính `gen_ai.*`:
   tên mô hình, số token, lý do dừng, chi phí; vì sao dùng chuẩn thay vì SDK riêng của một hãng
   (tránh khoá cứng, ghép được với hạ tầng quan sát sẵn có). Ghi rõ trạng thái chuẩn hoá tính
   tới 8/2026 (phần lớn còn experimental) và hệ quả thực tế.
5. **Chỉ số phải theo dõi** — bảng đầy đủ chia nhóm:
   - Chất lượng: điểm eval, phản hồi người dùng, tỉ lệ "không tìm thấy", tỉ lệ leo thang
   - Hiệu năng: TTFT, độ trễ tổng p50/p95/p99, độ trễ theo từng bước
   - Chi phí: token vào/ra theo tính năng, chi phí mỗi request, chi phí mỗi người dùng, tỉ lệ
     cache hit
   - Độ tin cậy: tỉ lệ lỗi theo mã, tỉ lệ retry, tỉ lệ rate limit, tỉ lệ dùng dự phòng
   - Agent: số bước, tỉ lệ hoàn thành, tỉ lệ dùng tool
6. **Ghi log prompt và phản hồi** — ⚠️ mục nhạy cảm: cực kỳ hữu ích để debug **nhưng** chứa dữ
   liệu người dùng; chiến lược: che PII, lấy mẫu, thời hạn lưu trữ ngắn, kiểm soát truy cập,
   cho phép người dùng từ chối. *→ ch.8.*
7. **Cảnh báo** — cảnh báo theo cái gì: tỉ lệ lỗi, độ trễ p95, đột biến chi phí, tụt điểm eval;
   ⚠️ tránh mệt mỏi vì cảnh báo. *→ Nối DevOps ch.11 (SRE).*
8. **Bảng điều khiển** — 3 dashboard nên có: sức khoẻ vận hành, chi phí, chất lượng; ai xem cái nào
9. **Debug sự cố production** — quy trình 6 bước: tái hiện từ trace → xác định bước hỏng →
   kiểm tra đầu vào bước đó → so với ca thành công → sửa → thêm vào bộ eval
   *(bước cuối là bước hay bị quên và là lý do lỗi tái diễn)*
10. **Ba tình huống thực tế** — đi qua đầy đủ: chi phí đột nhiên tăng gấp 3; chất lượng tụt sau
    khi nhà cung cấp cập nhật mô hình; agent thỉnh thoảng chạy 40 bước
11. Công cụ — Langfuse, LangSmith, Phoenix, Helicone, và tự dựng bằng OTel + Grafana; đánh đổi

**Tương tác:** trình xem trace — một trace RAG đầy đủ dạng thác nước, bấm vào từng span xem đầu
vào/ra/token/chi phí/thời gian; có phiên bản trace lỗi để tập chẩn đoán.

**Bài tập (5):** thêm tracing OTel vào một ứng dụng RAG; dựng dashboard chi phí theo tính năng;
cài che PII cho log prompt; thiết lập 5 cảnh báo có ngưỡng hợp lý; chẩn đoán 3 trace lỗi cho sẵn.

**Quiz (8):** trace khác log ra sao; span nên chia theo cái gì; vì sao dùng OTel GenAI semconv;
log prompt rủi ro gì; chỉ số nào cảnh báo sớm nhất về chất lượng; p95 quan trọng hơn trung bình
vì sao; bước cuối của quy trình debug là gì; đột biến chi phí thường do đâu.

---

## Chương 4 — Bảo mật: OWASP LLM Top 10 (2026) (~1.400 dòng)

**Mục tiêu:** hiểu bề mặt tấn công của ứng dụng LLM; nhận diện và phòng từng loại.

**Nội dung:**

1. Vì sao bảo mật AI khác bảo mật web truyền thống — không có ranh giới cú pháp giữa chỉ dẫn và
   dữ liệu; đầu ra không tất định nên khó viết luật chặn; mô hình có thể bị thuyết phục
2. **OWASP Top 10 cho ứng dụng LLM, bản 2026** — đi qua từng mục với ví dụ tấn công cụ thể và
   biện pháp phòng. Ghi rõ đây là bản 2026 và nêu thay đổi đáng chú ý: **excessive agency leo từ
   hạng 6 (2025) lên hạng 3**, phản ánh việc sự cố production giờ tập trung ở hệ thống agentic.
   - **LLM01 Prompt Injection** (giữ hạng 1)
   - **LLM02 Lộ thông tin nhạy cảm**
   - **LLM03 Excessive Agency** ⬆️
   - Chuỗi cung ứng, đầu độc dữ liệu, xử lý đầu ra không an toàn, và các mục còn lại
3. **Prompt injection — mục dài nhất**:
   - **Trực tiếp** (người dùng nhập chỉ dẫn) vs **gián tiếp** (chỉ dẫn nằm trong tài liệu, trang
     web, email, kết quả tool mà mô hình đọc). Gián tiếp nguy hiểm hơn nhiều vì nạn nhân không
     hề gõ gì.
   - ⚠️ **Vì sao không có bản vá triệt để** — chỉ dẫn và dữ liệu chia sẻ một kênh; không có thứ
     tương đương prepared statement. Nói thẳng điều này thay vì hứa hẹn giải pháp.
   - Kịch bản tấn công đầy đủ: agent đọc issue GitHub → issue chứa chỉ dẫn ẩn → agent gọi tool
     đọc biến môi trường → gửi ra ngoài. Đi qua từng bước.
   - **Phòng thủ nhiều lớp**: đánh dấu rõ ranh giới dữ liệu, đặc quyền tối thiểu cho tool, xác
     thực đầu ra, phê duyệt của con người cho hành động khó hoàn tác, giới hạn egress, và
     **giả định phòng thủ prompt sẽ thất bại** → thiết kế sao cho khi nó thất bại thì thiệt hại
     bị chặn
4. **Lộ dữ liệu** — mô hình nhắc lại dữ liệu huấn luyện, ngữ cảnh của người dùng khác, bí mật hệ
   thống; ⚠️ rò rỉ qua vector store multi-tenant *(nối 10.3 ch.3)*; rò rỉ qua bộ nhớ agent
   *(nối 10.4 ch.5)*
5. **Excessive Agency** — agent có quá nhiều quyền so với việc cần làm; ba trục hạn chế: chức
   năng (bớt tool), quyền hạn (bớt scope), tự chủ (thêm phê duyệt)
6. **Xử lý đầu ra không an toàn** — ⚠️ đầu ra LLM đưa thẳng vào `eval()`, câu SQL, HTML (XSS),
   lệnh shell. **Đầu ra mô hình là dữ liệu không tin cậy** — xử lý như đầu vào người dùng.
   *→ Nối Networking ch.10 (Web security) — cùng họ với SQL injection và XSS.*
7. **Từ chối dịch vụ và bòn rút tài nguyên** — prompt đắt tiền, vòng lặp agent, khuếch đại token;
   phòng bằng hạn mức, giới hạn độ dài, ngân sách
8. **Chuỗi cung ứng** — mô hình từ nguồn không rõ, ⚠️ **MCP server của bên thứ ba**
   *(nối 10.4 ch.4)*, thư viện, tập dữ liệu; ⚠️ deserialization mô hình (pickle) — dùng safetensors
9. **Red teaming** — quy trình: xây bộ tấn công, chạy tự động, đo tỉ lệ chống chịu; công cụ; đưa
   vào CI
10. **Checklist bảo mật 25 mục** cho ứng dụng AI — dùng được như tài liệu rà soát thật
11. Ứng phó sự cố — phát hiện, cách ly, khôi phục, hồi cứu; ⚠️ có thể phải xoá bộ nhớ hoặc rebuild
    index nếu bị đầu độc

**Tương tác:** phòng trưng bày tấn công — 8 kịch bản injection thật, mỗi cái có payload, cơ chế
hoạt động, và các lớp phòng thủ chặn được nó ở đâu.

**Bài tập (5):** thực hiện injection gián tiếp qua tài liệu trên hệ RAG của mình và ghi lại kết
quả; áp dụng đặc quyền tối thiểu cho bộ tool cho sẵn; tìm 5 lỗ hổng trong một kiến trúc mô tả sẵn;
xây bộ red team 15 payload và đo tỉ lệ chống chịu; thiết kế phòng thủ nhiều lớp cho một agent đọc
email.

**Quiz (8):** injection gián tiếp khác trực tiếp ra sao; vì sao không có bản vá triệt để; excessive
agency hạn chế bằng 3 trục nào; đầu ra LLM có đáng tin không; MCP server bên thứ ba rủi ro gì;
pickle nguy hiểm chỗ nào; multi-tenant rò rỉ ở đâu; nguyên tắc thiết kế phòng thủ khi giả định
prompt defense sẽ thất bại.

---

## Chương 5 — Guardrails (~1.250 dòng)

**Mục tiêu:** cài được lớp bảo vệ vào/ra; cân bằng giữa an toàn và trải nghiệm.

**Nội dung:**

1. Guardrails là gì — kiểm soát tất định quanh một hệ thống không tất định; ⚠️ **guardrails ở
   tầng hệ thống, không phải chỉ dẫn trong prompt** — đây là điểm phân biệt cốt lõi
2. **Guardrails đầu vào**:
   - Kiểm tra độ dài và định dạng
   - Kiểm duyệt nội dung (nội dung độc hại)
   - Phát hiện PII trước khi gửi lên nhà cung cấp
   - Phát hiện prompt injection — ⚠️ nêu rõ **hiệu quả có giới hạn**, không được coi là đủ
   - Hạn mức tần suất theo người dùng
   - Kiểm tra chủ đề (câu hỏi có thuộc phạm vi sản phẩm không)
3. **Guardrails đầu ra**:
   - Hợp lệ theo schema *(nối 10.2 ch.6)*
   - Kiểm tra bám ngữ cảnh (câu trả lời có dựa trên nguồn không)
   - Kiểm duyệt và lọc PII
   - Chặn theo luật miền (không hứa hoàn tiền, không tư vấn y tế…)
   - Kiểm chứng trích dẫn *(nối 10.3 ch.7)*
   - ⚠️ Làm sạch trước khi render (chống XSS) và trước khi đưa vào lệnh
4. **Guardrails cho hành động** (agent) — danh sách trắng, phê duyệt, hạn mức, giới hạn egress,
   sandbox. *→ 10.4 ch.3, ch.8.*
5. **Cách cài** — luật tất định (rẻ, nhanh, dễ test) → mô hình phân loại nhỏ → LLM làm giám sát
   (đắt). Xếp tầng theo chi phí: chặn cái rẻ trước.
6. **Đánh đổi** — ⚠️ dương tính giả làm hỏng trải nghiệm; đo cả tỉ lệ chặn nhầm, không chỉ tỉ lệ
   chặn đúng; ngưỡng theo mức rủi ro của hành động
7. **Xử lý khi guardrail kích hoạt** — thông báo cho người dùng thế nào (⚠️ đừng tiết lộ luật —
   nó giúp kẻ tấn công dò); ghi log; leo thang cho người; có đường thoát
8. **Người trong vòng lặp** — thiết kế hàng đợi phê duyệt; độ trễ chấp nhận được; ⚠️ mệt mỏi vì
   phê duyệt khiến người ta bấm "đồng ý" theo phản xạ — thiết kế để hiếm khi cần phê duyệt
9. **Kiểm thử guardrails** — bộ ca kiểm thử cho cả tấn công lẫn ca lành tính (để đo dương tính
   giả); chạy trong CI
10. **Công cụ** — API kiểm duyệt của nhà cung cấp, thư viện guardrails mã nguồn mở, tự viết;
    khi nào dùng cái nào
11. **Kiến trúc guardrails tham chiếu** — sơ đồ đầy đủ với điểm kiểm tra ở từng vị trí và chi phí
    độ trễ của mỗi lớp

**Tương tác:** trình mô phỏng guardrail — nhập một prompt, xem nó đi qua 6 lớp kiểm tra, lớp nào
chặn và vì sao; có bộ mẫu tấn công và mẫu lành tính để thử.

**Bài tập (5):** cài 4 guardrail đầu vào và đo độ trễ thêm vào; cài kiểm tra bám ngữ cảnh cho
đầu ra RAG; đo tỉ lệ dương tính giả trên 50 truy vấn lành tính; thiết kế thông báo cho người dùng
khi bị chặn mà không tiết lộ luật; xây bộ kiểm thử guardrail 30 ca chạy trong CI.

**Quiz (8):** guardrails khác chỉ dẫn prompt chỗ nào; phát hiện injection có đủ không; đo dương
tính giả để làm gì; vì sao không tiết lộ luật chặn; xếp tầng guardrail theo nguyên tắc gì; làm
sạch đầu ra chống được gì; phê duyệt của con người có nhược điểm gì; ngưỡng nên đặt theo cái gì.

---

## Chương 6 — Độ trễ và mở rộng (~1.250 dòng)

**Mục tiêu:** đạt được mục tiêu độ trễ; mở rộng hệ thống AI dưới tải.

**Nội dung:**

1. Đặc thù độ trễ của AI — giây chứ không phải mili-giây; phương sai lớn; phụ thuộc độ dài đầu ra
2. **Ngân sách độ trễ** — chia mục tiêu tổng cho từng bước; ví dụ với RAG (embed 20ms, search
   30ms, rerank 100ms, LLM 2.000ms, guardrails 50ms) và với agent
3. **Streaming là bắt buộc** — TTFT là thứ người dùng cảm nhận; cách streaming qua nhiều tầng
   (LLM → backend → client); streaming cả tiến trình của agent. *→ 10.2 ch.3.*
4. **Cache nhiều tầng** — bảng đầy đủ, mỗi tầng: cache cái gì, tỉ lệ hit điển hình, rủi ro
   - Prompt caching (phía nhà cung cấp) *(→ 10.2 ch.7)*
   - Cache embedding
   - Cache kết quả truy xuất
   - Cache câu trả lời chính xác
   - Cache ngữ nghĩa — ⚠️ rủi ro trả nhầm câu trả lời gần giống
   *→ Nối System Design ch.3.*
5. **Suy đoán và tính trước** — bắt đầu truy xuất trong khi người dùng còn gõ; tính trước embedding
6. **Song song hoá** — gọi các bước độc lập cùng lúc; gọi tool song song; toả nhánh cho multi-agent
7. **Xử lý bất đồng bộ** — hàng đợi cho việc dài, worker, webhook/polling báo kết quả; thiết kế
   trải nghiệm chờ. *→ System Design ch.5.*
8. **Mở rộng ngang** — orchestrator stateless; ⚠️ trạng thái phiên phải ra ngoài (Redis/CSDL);
   ⚠️ **rate limit của nhà cung cấp mới là trần thật**, không phải số pod của bạn
9. **Xử lý rate limit** — hàng đợi phía client, backoff, nhiều khoá API, nhiều nhà cung cấp,
   suy giảm dịch vụ khi quá tải
10. **Ngắt mạch và dự phòng** — phát hiện nhà cung cấp suy yếu, chuyển sang mô hình dự phòng,
    trả câu trả lời từ cache, thông báo trung thực. *→ System Design ch.7, DevOps ch.14.*
11. **Kiểm thử tải** — mô phỏng tải thực tế (⚠️ độ dài prompt và đầu ra đa dạng, không phải một
    request lặp lại), tìm điểm gãy, kiểm chứng autoscaling. *→ DevOps ch.13.*
12. **Phân tích một sự cố độ trễ** — đi qua từng bước: p95 tăng gấp 4, dùng trace tìm ra nguyên
    nhân, sửa, xác nhận

**Tương tác:** trình phân bổ ngân sách độ trễ — kéo thanh cho từng bước, xem tổng so với mục tiêu;
bật/tắt cache và song song hoá để thấy tác động.

**Bài tập (5):** lập ngân sách độ trễ và đo thực tế cho một ứng dụng RAG; cài 3 tầng cache và đo
tỉ lệ hit; song song hoá các bước độc lập và đo cải thiện; thiết kế ngắt mạch + dự phòng và kiểm
thử bằng lỗi giả lập; chạy kiểm thử tải và tìm điểm gãy.

**Quiz (8):** TTFT vs tổng thời gian; cache ngữ nghĩa rủi ro gì; trần mở rộng thật nằm ở đâu;
orchestrator stateless để làm gì; ngắt mạch hoạt động ra sao; kiểm thử tải nên mô phỏng gì; bước
nào thường chiếm nhiều độ trễ nhất; suy đoán trước giúp gì.

---

## Chương 7 — FinOps cho AI (~1.200 dòng)

**Mục tiêu:** kiểm soát chi phí AI; xây được mô hình đơn vị kinh tế.

**Nội dung:**

1. Vì sao chi phí AI khác — biến đổi theo từng request, tăng theo hành vi người dùng, có thể
   bùng nổ vì một bug; ⚠️ không có "giới hạn tự nhiên" như CPU
2. **Hạch toán chi phí** — gán chi phí cho: tính năng, người dùng, tenant, mô hình, bước trong
   pipeline. ⚠️ Không đo được thì không tối ưu được — đây là điều kiện tiên quyết.
   *→ ch.3.*
3. **Kinh tế đơn vị** — chi phí trên mỗi request / người dùng hoạt động / tác vụ hoàn thành;
   so với doanh thu trên mỗi người dùng; xác định tính năng lỗ vốn
4. **Bảy đòn bẩy tối ưu** — nhắc lại từ 10.2 ch.10 nhưng ở góc hệ thống, kèm số liệu thực tế về
   mức tiết kiệm điển hình của từng đòn bẩy và công sức bỏ ra
5. **Định tuyến mô hình** — kiến trúc bậc thang: mô hình nhỏ xử lý phần lớn, leo thang khi cần;
   cách quyết định leo thang (điểm tin cậy, độ phức tạp, phân loại trước); đo tỉ lệ leo thang
6. **Hạn mức và ngân sách** — hạn mức theo người dùng và theo tenant; ngân sách cho mỗi tính năng;
   ⚠️ **ngắt mạch cứng** — một vòng lặp agent hỏng có thể đốt ngân sách tháng trong vài giờ
7. **Dự báo** — mô hình hoá chi phí theo tăng trưởng người dùng; kịch bản; ⚠️ tính cả trường hợp
   người dùng nặng (phân bố có đuôi dài)
8. **Xây vs mua** — tổng chi phí sở hữu đầy đủ: API vs tự host, tính cả GPU chạy không tải, nhân
   sự vận hành, thời gian chết, chi phí cơ hội. Điểm hoà vốn thật. *→ 10.5 ch.6–7.*
9. **Batch API** — giảm chi phí đáng kể cho việc không cần thời gian thực; kiến trúc để tận dụng
10. **Cảnh báo và bảng điều khiển chi phí** — theo dõi hằng ngày, phát hiện đột biến, quy trách
    nhiệm theo nhóm
11. **Nghiên cứu tình huống: giảm 70% chi phí** — đi qua 6 thay đổi với con số cụ thể, xếp theo
    tỉ lệ lợi ích trên công sức; nêu rõ thay đổi nào **không** hiệu quả như kỳ vọng và vì sao

**Tương tác:** **máy tính chi phí nâng cao** — nhập lưu lượng, phân bố loại request, chọn chiến
lược định tuyến, bật/tắt các đòn bẩy → chi phí tháng, phân rã theo tính năng, và dự báo 12 tháng.

**Bài tập (5):** xây bảng hạch toán chi phí theo tính năng; tính kinh tế đơn vị và tìm tính năng
lỗ vốn; thiết kế định tuyến 3 bậc và ước tính tiết kiệm; cài ngắt mạch ngân sách; dự báo chi phí
12 tháng theo 3 kịch bản tăng trưởng.

**Quiz (8):** chi phí AI khác chi phí hạ tầng thường ở đâu; kinh tế đơn vị đo gì; định tuyến mô
hình tiết kiệm bằng cách nào; ngắt mạch bảo vệ khỏi gì; batch API phù hợp việc gì; điểm hoà vốn
tự-host phụ thuộc gì; đuôi dài của phân bố người dùng ảnh hưởng dự báo ra sao; đòn bẩy nào thường
hiệu quả nhất.

---

## Chương 8 — Dữ liệu, quyền riêng tư và tuân thủ (~1.200 dòng)

**Mục tiêu:** xử lý dữ liệu người dùng đúng luật và đúng đạo đức trong ứng dụng AI.

**Nội dung:**

1. Dữ liệu đi đâu — sơ đồ luồng dữ liệu qua một ứng dụng AI: client → backend → nhà cung cấp mô
   hình → log → vector store → bộ nhớ. ⚠️ Mỗi điểm dừng là một rủi ro riêng tư.
2. **Chính sách của nhà cung cấp** — dữ liệu có được dùng để huấn luyện không, thời hạn lưu trữ,
   tuỳ chọn zero data retention, vị trí địa lý xử lý; ⚠️ **phải đọc điều khoản, không giả định**
3. **PII** — phát hiện, che, giả danh hoá; che ở đâu (trước khi gửi mô hình? trước khi log? cả hai);
   ⚠️ đánh đổi: che quá tay làm hỏng chất lượng câu trả lời
4. **Nơi PII hay rò rỉ mà ít ai để ý** — log prompt, trace, vector store, bộ nhớ agent, dữ liệu
   eval, ⚠️ **tập dữ liệu fine-tuning (không xoá được khỏi trọng số)** *(nối 10.5 ch.2)*
5. **GDPR và tương đương** — cơ sở pháp lý, tối thiểu hoá dữ liệu, giới hạn mục đích,
   ⚠️ **quyền được xoá — và vì sao nó rất khó với hệ thống AI** (dữ liệu nằm trong index, trong
   bộ nhớ, trong log, trong trọng số)
6. **Lưu trú dữ liệu** — yêu cầu địa lý; chọn vùng; ràng buộc với nhà cung cấp
7. **Cách ly tenant** — ⚠️ trong vector store *(nối 10.3 ch.3)*, trong cache (⚠️ **cache dùng chung
   giữa các tenant là lỗ hổng rò rỉ trực tiếp**), trong bộ nhớ, trong log
8. **Thời hạn lưu trữ** — giữ bao lâu cho debug vs rủi ro riêng tư; xoá tự động; ⚠️ sao lưu cũng
   phải xoá
9. **Đồng thuận và minh bạch** — nói cho người dùng biết AI đang được dùng, dữ liệu của họ đi đâu,
   nhớ gì về họ; cơ chế từ chối
10. **Đạo đức và công bằng** — thiên lệch trong đầu ra, khả năng tiếp cận, hệ quả cho nhóm yếu thế;
    kiểm thử thiên lệch cơ bản
11. **Quy định về AI** — bối cảnh 2026 ở mức khái quát: phân loại theo mức rủi ro, yêu cầu minh
    bạch, tài liệu hoá. Không đi sâu vào một khung pháp lý cụ thể vì thay đổi nhanh; dạy **cách
    đặt câu hỏi đúng** cho đội pháp chế.
12. **Checklist tuân thủ 20 mục**

**Tương tác:** sơ đồ luồng dữ liệu tương tác — bấm vào từng điểm dừng để xem dữ liệu gì ở đó,
rủi ro gì, và biện pháp gì.

**Bài tập (5):** vẽ luồng dữ liệu cho ứng dụng của mình và đánh dấu mọi điểm chứa PII; cài che PII
ở 3 vị trí và đo ảnh hưởng chất lượng; thiết kế quy trình xử lý yêu cầu xoá dữ liệu; kiểm tra rò
rỉ tenant qua cache; đọc điều khoản của một nhà cung cấp và tóm tắt 5 điểm quan trọng.

**Quiz (8):** dữ liệu dừng ở những đâu; zero data retention nghĩa là gì; PII rò rỉ ở chỗ nào hay
bị quên; vì sao quyền được xoá khó với AI; cache dùng chung rủi ro gì; fine-tuning và PII; lưu
trú dữ liệu ảnh hưởng kiến trúc ra sao; minh bạch với người dùng gồm những gì.

---

## Chương 9 — Deploy & CI/CD cho ứng dụng AI (~1.250 dòng)

**Mục tiêu:** triển khai thay đổi AI một cách an toàn, có thể rollback.

**Nội dung:**

1. Vì sao deploy AI khác — ⚠️ "thay đổi" gồm cả prompt, mô hình, cấu hình chunking, tập dữ liệu
   — không chỉ mã nguồn; và tác động của chúng **không thấy được qua test đơn vị**
2. **Prompt là mã nguồn** — để trong git (không phải trong CSDL không phiên bản), review qua PR,
   đánh phiên bản, gắn với kết quả eval
3. **Bốn thứ phải đánh phiên bản cùng nhau** — prompt, ID mô hình, cấu hình retrieval, phiên bản
   tập eval. ⚠️ Đổi một cái mà không ghi lại là mất khả năng tái lập.
4. **Pipeline CI cho AI** — các bước: lint → test đơn vị → **chạy bộ eval** → so với đường cơ sở →
   chặn nếu tụt quá ngưỡng → deploy. Chi phí và thời gian chạy eval; chiến lược lấy mẫu.
   *→ Nối DevOps ch.4 (CI/CD).*
5. **Chiến lược triển khai** — cờ tính năng (feature flag), canary, chia lưu lượng theo phần trăm,
   blue-green; ⚠️ đặc thù AI: cần thời gian đủ dài để thu đủ tín hiệu chất lượng, vì lỗi AI không
   nổ ngay như lỗi phần mềm. *→ Nối DevOps ch.14.*
6. **A/B testing thay đổi AI** — chỉ số, cỡ mẫu, thời gian; đo chỉ số kinh doanh chứ không chỉ
   chỉ số kỹ thuật
7. **Rollback** — ⚠️ rollback prompt dễ, rollback tập dữ liệu đã embed thì không — cần chiến lược
   riêng (giữ index cũ, đánh phiên bản index, chuyển đổi bằng alias)
8. **Quản lý môi trường** — dev/staging/prod; khoá API riêng, hạn mức riêng, ⚠️ dữ liệu staging
   không nên là dữ liệu thật
9. **Đổi mô hình** — quy trình đầy đủ: chạy eval trên mô hình mới, so sánh, kiểm tra chi phí và
   độ trễ, ⚠️ rà soát prompt (prompt viết cho mô hình cũ có thể phản tác dụng), canary, theo dõi.
   *→ Nối 10.2 ch.5 (rà soát prompt lỗi thời).*
10. **Nhà cung cấp âm thầm đổi hành vi** — ⚠️ mô hình cùng tên có thể đổi hành vi; **eval định kỳ
    trên tập cố định là cách duy nhất phát hiện**; ghim phiên bản khi có thể
11. **Runbook và trực sự cố** — sự cố AI trông thế nào; ai được gọi; các bước xử lý đầu tiên.
    *→ Nối DevOps ch.11 (SRE).*
12. **Checklist ra mắt 20 mục** cho tính năng AI

**Tương tác:** trình mô phỏng pipeline CI — xem một PR đổi prompt đi qua các cổng, cổng eval chặn
lại vì tụt điểm, và quá trình sửa

**Bài tập (5):** dựng CI chạy eval và chặn merge khi tụt quá ngưỡng; đưa prompt vào git với đánh
phiên bản gắn kết quả eval; thiết kế canary cho thay đổi mô hình; thiết kế chiến lược rollback
cho thay đổi chunking (đã embed lại toàn bộ index); viết runbook cho 3 sự cố AI điển hình.

**Quiz (8):** những gì phải đánh phiên bản cùng nhau; vì sao eval phải nằm trong CI; rollback
index khó ở đâu; canary cho AI cần lưu ý gì; đổi mô hình phải kiểm tra gì; phát hiện nhà cung cấp
đổi hành vi bằng cách nào; dữ liệu staging nên là gì; feature flag giúp gì.

---

## Chương 10 — Case study & Phỏng vấn AI Engineer (~1.500 dòng)

**Mục tiêu:** vận dụng toàn bộ 58 chương vào bài toán thiết kế hệ thống; sẵn sàng cho phỏng vấn.

**Đây là chương tổng kết của cả trụ cột.**

**Nội dung:**

### Phần A — Khung trả lời câu hỏi thiết kế hệ thống AI (~250 dòng)

Khung 7 bước, song song với khung System Design ở trụ cột 6 nhưng thêm phần đặc thù AI:

1. Làm rõ yêu cầu — ai dùng, quy mô, độ trễ chấp nhận được, **chi phí chấp nhận được**,
   **hậu quả khi trả lời sai**
2. **Xác định có cần AI không** — câu hỏi phân biệt ứng viên giỏi: nhiều bài toán không cần LLM
3. Ước lượng quy mô — request/giây, token/tháng, dung lượng dữ liệu, số vector, chi phí ước tính
4. Kiến trúc cấp cao — vẽ 7 tầng *(ch.1)*
5. Đi sâu vào 2–3 thành phần — thường là retrieval, orchestrator, hoặc eval
6. **Chiến lược đánh giá** — ⚠️ ứng viên nào chủ động nói về eval sẽ nổi bật ngay lập tức
7. Vận hành — giám sát, chi phí, bảo mật, chế độ hỏng

### Phần B — Năm case study đầy đủ (~750 dòng)

Mỗi case: yêu cầu → đánh đổi chính → kiến trúc → chi tiết then chốt → eval → chi phí → chế độ hỏng.

1. **Trợ lý hỏi đáp tài liệu doanh nghiệp** — RAG quy mô lớn, phân quyền phức tạp, đa nguồn.
   Trọng tâm: cách ly tenant, cập nhật tăng dần, trích dẫn.
2. **Agent hỗ trợ khách hàng** — tích hợp tool, leo thang sang người, an toàn thương hiệu.
   Trọng tâm: guardrails, mức tự chủ, đo tỉ lệ giải quyết.
3. **Trợ lý lập trình** — ngữ cảnh codebase lớn, độ trễ thấp, chi phí trên mỗi lập trình viên.
   Trọng tâm: chiến lược ngữ cảnh, caching, đánh giá bằng test.
4. **Pipeline phân loại nội dung** — thông lượng cao, chi phí thấp, chính xác cao.
   Trọng tâm: batch, định tuyến mô hình, khi nào mô hình cổ điển thắng LLM.
5. **Trợ lý nghiên cứu đa phương thức** — PDF + hình ảnh + web, câu hỏi tổng hợp nhiều nguồn.
   Trọng tâm: RAG đa phương thức, agentic retrieval, trích dẫn.

### Phần C — 60 câu hỏi phỏng vấn có đáp án (~500 dòng)

Chia 6 nhóm × 10 câu, mỗi câu có đáp án ngắn + **điều nhà tuyển dụng thực sự muốn nghe** +
sai lầm thường gặp. Mở rộng từ danh sách 50 câu trong sổ tay người học gửi, bổ sung các chủ đề
sổ tay thiếu (eval, MCP, bảo mật, chi phí):

1. **Nền tảng LLM** — token, attention, cửa sổ ngữ cảnh, sampling, prefill/decode, reasoning model
2. **RAG & Embedding** — chunking, hybrid search, rerank, đánh giá, khi nào không dùng RAG
3. **Agent & Tool** — vòng lặp, MCP, memory, multi-agent, khi nào không dùng agent
4. **Fine-tuning** — khi nào fine-tune, LoRA, DPO, dữ liệu, đánh giá
5. **Thiết kế hệ thống** — 10 câu dạng "hãy thiết kế…"
6. **Production** — eval, observability, bảo mật, chi phí, sự cố

### Phần D — Chuẩn bị phỏng vấn (~150 dòng)

- Portfolio dự án: 3 dự án nên có và cách trình bày (⚠️ **có số liệu eval là điểm cộng lớn nhất**)
- Câu hỏi nên hỏi ngược nhà tuyển dụng (để lộ ra công ty làm AI nghiêm túc hay chỉ theo trào lưu)
- Cách nói về thất bại và đánh đổi
- Sai lầm thường gặp: nói tên công cụ thay vì nói nguyên lý; không nhắc eval; đề xuất agent cho
  mọi thứ; không nói về chi phí

**Tương tác:** trình luyện phỏng vấn — chọn nhóm câu hỏi, hiện câu hỏi, tự trả lời, mở đáp án
mẫu và checklist "đã nhắc tới những ý nào".

**Bài tập (5):** làm đầy đủ 1 case study từ đầu, viết ra như bài phỏng vấn 45 phút; tự trả lời
20 câu rồi đối chiếu; chuẩn bị trình bày 5 phút cho một dự án của mình kèm số liệu eval; thiết kế
hệ thống cho một đề bài mới không có trong 5 case; viết danh sách 10 câu hỏi ngược cho nhà tuyển dụng.

**Quiz (8):** bước nào hay bị bỏ qua trong khung thiết kế; vì sao phải hỏi "có cần AI không";
nhà tuyển dụng tìm gì khi hỏi về eval; trình bày dự án nên có gì; sai lầm phổ biến khi trả lời;
ước lượng quy mô gồm gì; nói về đánh đổi thế nào; chế độ hỏng nên nhắc tới ở bước nào.

---

## Tổng kết sub-pillar

| Chương | Tên | Ước lượng |
|---|---|---|
| 1 | Kiến trúc ứng dụng AI | 1.300 |
| 2 | Evaluation: đo chất lượng hệ thống AI | 1.450 |
| 3 | Observability cho ứng dụng AI | 1.300 |
| 4 | Bảo mật: OWASP LLM Top 10 (2026) | 1.400 |
| 5 | Guardrails | 1.250 |
| 6 | Độ trễ và mở rộng | 1.250 |
| 7 | FinOps cho AI | 1.200 |
| 8 | Dữ liệu, quyền riêng tư và tuân thủ | 1.200 |
| 9 | Deploy & CI/CD cho ứng dụng AI | 1.250 |
| 10 | Case study & Phỏng vấn AI Engineer | 1.500 |
| | **Tổng** | **~13.100 dòng · 50 bài tập · 79 quiz + 60 câu phỏng vấn** |

---

## Tổng toàn trụ cột 10

| Sub-pillar | Chương | Dòng ước tính |
|---|---|---|
| 10.1 Foundations | 10 | ~12.800 |
| 10.2 LLM | 10 | ~12.700 |
| 10.3 RAG | 10 | ~12.700 |
| 10.4 Agent | 10 | ~12.600 |
| 10.5 FineTuning | 8 | ~10.000 |
| 10.6 Production | 10 | ~13.100 |
| **Tổng** | **58** | **~73.900 dòng · 282 bài tập · 443 quiz** |
