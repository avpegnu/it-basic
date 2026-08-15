# Java Curriculum — Outline 14 chương

**Sub-pillar:** Java (sub-pillar 9.5 thuộc Programming Language — trụ cột 9 của IT Basic)
**Số chương:** 14
**Phiên bản target:** Java 21 LTS (record, sealed, pattern matching cho switch, virtual thread, text block)
**Theme:** "Blueprint Slate + Java Orange" — nền xanh-xám lạnh, điểm nhấn cam Java, slab serif (Bitter)
**Ngày hoàn thành:** 2026-08-14
**Trạng thái:** ✅ Hoàn thành — 14 chương / ~19.300 dòng HTML

---

## Triết lý curriculum

1. **Java 21 LTS làm chuẩn** — không dạy Java 8 của mười năm trước. `record` thay POJO, `switch`
   expression thay `switch` có `break`, `java.time` thay `Date`, `Path`/`Files` thay `File`,
   `ArrayDeque` thay `Stack`/`Vector`. Nơi nào cách viết cũ vẫn hay gặp trong dự án thật thì học cả
   hai, nhưng luôn nói rõ cái nào nên dùng.
2. **Giải thích cơ chế, không chỉ cú pháp** — vì sao `HashMap` cần `h & (n-1)`, vì sao generic bị
   xoá kiểu, vì sao `dem++` không nguyên tử. Mỗi hành vi "kỳ lạ" đều truy về nguyên nhân kỹ thuật.
3. **Dạy cả cách KHÔNG dùng** — khi nào tránh kế thừa, khi nào không dùng Stream, khi nào không dùng
   parallel stream, vì sao không deserialize dữ liệu ngoài.
4. **Bảo mật là nội dung chính, không phải phụ lục** — SQL injection (ch.13), deserialization
   (ch.11), lộ khoá bí mật (ch.13) đều có mục riêng với ví dụ tấn công cụ thể.
5. **Đối chiếu Python/JS/TS** — người học đã có sub-pillar khác; mỗi chương có callout chỉ rõ chỗ
   Java làm khác và vì sao.
6. **Góc phỏng vấn** — các câu hỏi phỏng vấn Java kinh điển được trả lời trực tiếp trong quiz và
   bảng riêng (đặc biệt ch.8 về `HashMap`).

---

## Bốn giai đoạn

| Giai đoạn | Chương | Chủ đề |
|---|---|---|
| 1 — Nền tảng ngôn ngữ | 1-3 | JVM, kiểu dữ liệu, điều khiển luồng |
| 2 — Hướng đối tượng | 4-6 | Class, kế thừa, ngoại lệ |
| 3 — Thư viện cốt lõi | 7-11 | Collections, Map, Generics, Stream, I/O |
| 4 — Hệ thống thật | 12-14 | Đa luồng, JDBC, kiểm thử & dự án |

---

## Danh sách chương

### Chương 1 — Hello Java: JDK, JVM & công cụ (~1.435 dòng)
JDK ⊃ JRE ⊃ JVM; chuỗi mã nguồn → bytecode → JIT → mã máy; ba mô hình thực thi (AOT/thông
dịch/lai); cài bằng SDKMAN, chọn bản phân phối (Temurin vs Oracle JDK); `javac`/`java`; đọc bytecode
bằng `javap -c`; JShell; quy tắc tên tệp ↔ tên class public; `package` ↔ cây thư mục; Maven vs
Gradle, `pom.xml`, vòng đời build; phiên bản LTS; IDE.

### Chương 2 — Biến, kiểu dữ liệu & toán tử (~1.545 dòng)
8 kiểu nguyên thủy; tràn số (không báo lỗi) và `Math.*Exact`; chia số nguyên (cắt về 0, khác
Python); IEEE 754 và `BigDecimal` cho tiền; nguyên thủy vs tham chiếu, stack/heap, "truyền theo giá
trị"; wrapper, autoboxing và bẫy cache −128…127; `String` bất biến, String pool, `StringBuilder`,
text block; ép kiểu mở rộng/thu hẹp và bẫy `+=`; `var`, `final`; bảng toán tử đầy đủ, `>>>`.

### Chương 3 — Điều khiển luồng, mảng & nhập xuất (~1.412 dòng)
`if` (điều kiện phải là boolean); `switch` câu lệnh và fall-through; `switch` biểu thức (Java 14+)
với `->`, `yield`, và kiểm tra đủ nhánh; pattern matching cho `switch` (Java 21) với `when`; bốn
kiểu vòng lặp; nhãn (Java không có `goto`); mảng là object, mảng nhiều chiều và răng cưa; lớp
`Arrays`; `Scanner` và bẫy `nextInt()`+`nextLine()`; `printf` với bảng chỉ định định dạng, `%n`.

### Chương 4 — OOP cơ bản: class, object & đóng gói (~1.417 dòng)
Class ↔ object; trường có giá trị mặc định (biến cục bộ thì không) và lý do kỹ thuật; constructor là
hàng rào kiểm tra, `this(...)`, constructor mặc định biến mất; `this`; nạp chồng và varargs; bốn mức
truy cập; đóng gói thật (không phải getter/setter cho mọi trường) và rò rỉ tham chiếu collection;
`static`; thứ tự khởi tạo 7 bước; `toString`/`equals`/`hashCode` và hợp đồng; vòng đời object, rò rỉ
bộ nhớ trong Java, vì sao không dùng `finalize()`.

### Chương 5 — OOP nâng cao: kế thừa, đa hình & interface (~1.564 dòng)
`extends`, `super()`, chuỗi constructor; override vs overload (lúc chạy vs lúc biên dịch) và bốn quy
tắc override; đa hình và dynamic dispatch (`invokevirtual`); ép kiểu object, pattern matching cho
`instanceof`; `abstract class`; `interface` với `default`/`static`/`private` method, vấn đề kim
cương; **`record`** (compact constructor, giới hạn); **`sealed`** + record pattern = kiểu dữ liệu đại
số; `enum` đầy đủ (trường, constructor, override theo hằng số, `EnumMap`/`EnumSet`, singleton, cấm
lưu `ordinal()`); bốn loại nested class và quy tắc "mặc định static"; **ưu tiên composition hơn
inheritance** với ví dụ `DemPhanTu extends ArrayList`.

### Chương 6 — Ngoại lệ: checked, unchecked & try-with-resources (~1.265 dòng)
Cơ chế gỡ ngăn xếp; cây `Throwable` (Error / RuntimeException / checked); tiêu chí phân biệt
("người gọi làm được gì?"); `try`/`catch`/`finally`, multi-catch, bẫy `return` trong `finally`,
`System.exit()` bỏ qua `finally`; **try-with-resources** và suppressed exception; `throw` vs
`throws`; custom exception mang dữ liệu; vì sao ngôn ngữ hiện đại bỏ checked exception; exception
chaining và đọc `Caused by`; sáu anti-pattern; khôi phục cờ ngắt với `InterruptedException`.

### Chương 7 — Collections Framework: List, Set, Queue (~1.437 dòng)
Cây `Iterable` → `Collection` → `List`/`Set`/`Queue`; bảng so sánh bốn nhóm (theo sổ tay trang 15);
`ArrayList` vs `LinkedList` và vì sao cache CPU khiến `ArrayList` gần như luôn thắng; bẫy
`remove(int)` vs `remove(Object)`; `List.of` vs `Arrays.asList` vs `unmodifiableList`; ba loại `Set`
và bẫy `TreeSet` dùng `compareTo`; `ArrayDeque` làm cả Stack lẫn Queue, `PriorityQueue` và mẫu
top-K; `Iterator`, `modCount`, `ConcurrentModificationException`; `Comparable` vs `Comparator`, cấm
viết `compare` bằng phép trừ; lớp `Collections`; **bảng độ phức tạp** và cây quyết định chọn cấu
trúc; class di sản cần tránh.

### Chương 8 — Map Framework & hợp đồng equals/hashCode (~1.363 dòng)
Theo sổ tay trang 16. Bên trong `HashMap`: bảng bucket, `h & (n-1)` và vì sao dung lượng là luỹ thừa
của 2, trộn bit `h ^ (h>>>16)`, va chạm, hệ số tải 0.75, resize, treeify ở ngưỡng 8/64; hợp đồng
`equals`/`hashCode` và hậu quả im lặng khi vi phạm; khoá phải bất biến (entry bị kẹt vĩnh viễn);
bảng so sánh `HashMap`/`LinkedHashMap`/`TreeMap`/`Hashtable`; duyệt qua `entrySet()`; API Java 8+
(`getOrDefault`, `merge`, `computeIfAbsent`, `putIfAbsent`); cache LRU bằng `LinkedHashMap`; truy vấn
thứ tự của `TreeMap`; `EnumMap`; **bảng góc phỏng vấn** 10 câu.

### Chương 9 — Generics: kiểu tổng quát (~1.258 dòng)
Vấn đề generics giải quyết; generic class/method; bounded type và giới hạn đệ quy; **tính bất biến**
và vì sao (đối lập với mảng hiệp biến); wildcard `?`/`? extends`/`? super`; **PECS** với ví dụ từ
JDK; **type erasure** và bảy hệ quả (không `instanceof` sâu, không `new T()`, không mảng generic,
không nạp chồng theo tham số kiểu…); raw type lây lan; `@SuppressWarnings` đặt hẹp; đối chiếu
TypeScript/Python.

### Chương 10 — Java hàm: lambda, Stream API & Optional (~1.359 dòng)
Functional interface và `@FunctionalInterface`; lambda, ràng buộc effectively final và lý do; bốn
loại method reference; interface hàm dựng sẵn và cách kết hợp; **ba đặc tính Stream** (lười, một lần
dùng, không sửa nguồn) và xử lý theo chiều dọc; tạo stream; thao tác trung gian (`flatMap`,
`takeWhile`) và kết thúc; **`Collectors`** với `groupingBy` nhiều tầng, `partitioningBy`, `teeing`;
**`Optional`** đúng cách và ba cách dùng sai; parallel stream với sáu điều kiện và cảnh báo pool
chung; **khi nào `for` vẫn tốt hơn Stream**.

### Chương 11 — Xử lý tệp tin & Serialization (~1.251 dòng)
Theo sổ tay trang 17. `File` (cũ) vs `Path`/`Files` (nên dùng) và khác biệt về cách báo lỗi; API
`Files` một dòng; cây stream I/O byte vs ký tự, mẫu Decorator; vì sao `Buffered` nhanh hơn trăm lần;
tránh `FileReader` không encoding; bảng chọn cách đọc theo kích thước tệp; ghi an toàn qua tệp tạm +
`ATOMIC_MOVE`; tệp nhị phân, `DataStream`, `RandomAccessFile`; **Serialization**: `Serializable`,
`transient`, `serialVersionUID`, constructor không được gọi; **rủi ro bảo mật** (gadget chain,
`ObjectInputFilter`); **JSON với Jackson** là lựa chọn hiện đại.

### Chương 12 — Đa luồng & đồng thời (~1.360 dòng)
Heap chung / stack riêng; đồng thời vs song song; `start()` vs `run()`, vòng đời luồng; **race
condition** với bytecode của `dem++`; `synchronized` (loại trừ + hiển thị), khoá trên
`private final Object`; `volatile` chỉ giải quyết hiển thị; **deadlock** với bốn điều kiện Coffman
và cách phá; `ExecutorService` và cảnh báo hàng đợi không giới hạn; `Callable`/`Future`/
**`CompletableFuture`**; collection an toàn luồng, `Atomic*`, `LongAdder`, CAS, `BlockingQueue`;
**virtual thread** (Java 21) — viết đồng bộ, mở rộng như bất đồng bộ, và ba lưu ý (không pool, không
cho CPU-bound, cẩn thận pinning).

### Chương 13 — JDBC & cơ sở dữ liệu (~1.334 dòng)
Theo sổ tay trang 18. Kiến trúc JDBC và bốn loại driver; `Connection` và rò rỉ kết nối;
**`Statement` vs `PreparedStatement`** với ba payload SQL injection cụ thể và giải thích cơ chế
chống; tên bảng/cột phải dùng danh sách trắng; `ResultSet`, `wasNull()`, bảng ánh xạ kiểu SQL↔Java;
CRUD đầy đủ với khoá tự sinh và phân trang; **giao dịch**: ACID, `commit`/`rollback`, savepoint, bốn
mức cô lập và ba hiện tượng bất thường; **batch** và vì sao nhanh hơn 50-100 lần; **connection pool**
HikariCP và công thức chọn kích thước; **mẫu DAO**; `BigDecimal` cho tiền, `java.time` cho ngày giờ.

### Chương 14 — Kiểm thử, build & dự án thực chiến (~1.296 dòng)
Vì sao test tiết kiệm thời gian; kim tự tháp test; **JUnit 5** (assertion, `assertThrows`,
`assertAll`, vòng đời, `@Nested`, `@TempDir`); **parameterized test**; **Mockito** và khi nào không
mock; độ phủ test và vì sao 100% không phải mục tiêu (mutation testing); **Maven** vòng đời, `scope`,
**fat JAR**; **dự án hệ thống quản lý thư viện** ghép cả 13 chương với ba tầng test (unit / mock /
integration bằng SQLite trong bộ nhớ); **checklist chất lượng 12 mục**; "khó test = thiết kế chưa
tốt".

---

## Thống kê

| Chỉ số | Giá trị |
|---|---|
| Số chương | 14 |
| Tổng dòng HTML | ~19.296 |
| Trung bình mỗi chương | ~1.378 dòng |
| Bài tập | 70 (5 mỗi chương) |
| Quiz | 112 (8 mỗi chương) |
| Mục h2 | 205 |

## Tham chiếu sổ tay

Bốn trang sổ tay do người học cung cấp đã được đối chiếu và mở rộng:

| Trang sổ tay | Chương tương ứng | Mở rộng thêm |
|---|---|---|
| 15 — Tổng quan Collections Framework | Chương 7 | Độ phức tạp, cache CPU, `Iterator`/`modCount`, `Comparator` tổ hợp, cây quyết định |
| 16 — Map Framework | Chương 8 | Thuật toán `put`/`get`, trộn bit, treeify, khoá bất biến, API Java 8+, LRU cache |
| 17 — Xử lý File & Serialization | Chương 11 | NIO.2, ghi nguyên tử, rủi ro gadget chain, JSON thay thế |
| 18 — JDBC cơ bản | Chương 13 | Payload injection cụ thể, mức cô lập, batch, HikariCP, mẫu DAO |

## Component riêng của theme Java

Định nghĩa trong `Java/css/theme.css`:

- `.jvm-flow` — sơ đồ luồng nhiều giai đoạn (dùng cho biên dịch JVM, cơ chế `HashMap`, kiến trúc JDBC)
- `.hierarchy` — cây phân cấp bằng ký tự (Collections, `Throwable`, `Map`, JDK/JRE/JVM)
- `.java-note` — khối "☕ Java-ism" giải thích cơ chế
- `.java-rule` — khối quy tắc vàng
- `.bigo` — nhãn độ phức tạp có màu (good/mid/bad)
- `.code-wrap.jshell` — khối code kiểu REPL JShell
- `.tok-ann` — token cho annotation `@Override`
