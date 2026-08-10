# Dart Curriculum — Outline chi tiết 8 chương

**Sub-pillar:** Dart (thuộc Programming Language pillar — trụ cột 9 của IT Basic)
**Số chương:** 8
**Phiên bản Dart target:** Dart 3.3+ (sound null safety mặc định, patterns, records, extension types)
**Started:** 2026-05-19
**Status:** Outline phase — chờ user approve trước khi viết HTML content

## Mục đích của file này

File này là **bản thiết kế chi tiết** (spec) cho 8 chương Dart. Khi sang Phase 2 (viết HTML), mỗi chương được viết bằng cách **mở rộng** outline tương ứng — không cần thiết kế lại scope, không cần quyết định lại nội dung gì có/không có.

Mỗi chương trong outline này gồm:
- **Mục tiêu chương** — học xong làm được gì
- **Lý do học** — vì sao chương này quan trọng cho Flutter / cho cả ngôn ngữ
- **Prerequisites** — cần đọc chương nào trước
- **Sections** — các section con cụ thể trong chương
- **Key concepts** — list khái niệm bắt buộc phải cover
- **Code examples** — kịch bản ví dụ cụ thể sẽ dùng
- **Visualizer / diagram** — hình ảnh/bảng/sơ đồ cần vẽ
- **4-5 bài tập** — đề + định hướng giải
- **6-8 quiz** — câu hỏi + đáp án + lý do
- **Connects to** — Flutter chương nào sẽ sử dụng kiến thức này
- **Ước lượng độ dài** — số dòng HTML dự kiến

## Triết lý chung của curriculum Dart

1. **Dart 3 first** — không dạy syntax pre-null-safety, không dạy `new` keyword (đã optional từ Dart 2). Patterns và records là mặc định, không phải "feature mới lạ".
2. **Hướng tới Flutter nhưng không phụ thuộc Flutter** — mọi ví dụ trong Dart curriculum phải chạy được bằng `dart run` standalone, không cần Flutter SDK. Lý do: học Dart sạch trước, Flutter sau.
3. **So sánh với JS/TS khi có ích** — user có nền JS/TS, mention điểm tương đồng/khác biệt với JS/TS để build mental model nhanh (ví dụ: `Future` ≈ `Promise`, `Stream` ≈ `Observable`, type system stricter than TS).
4. **Mental model trước syntax** — mỗi concept mở đầu bằng "vì sao có cái này", rồi mới đến cú pháp. Không dump cú pháp khô.
5. **Sound null safety là điều kiện sống** — không dạy null safety như feature optional, mà như fact của ngôn ngữ.

---

## Chương 1 — Hello Dart

### Mục tiêu chương

Học xong chương 1, người đọc sẽ:
- Cài được Dart SDK trên macOS (có nhắc Linux/Windows)
- Chạy được file `.dart` đầu tiên bằng `dart run` và hiểu vòng đời compile/execute
- Biết các lệnh Dart CLI core: `run`, `compile`, `format`, `analyze`, `test`, `pub`
- Hiểu cấu trúc một Dart project tối thiểu: `pubspec.yaml`, `lib/`, `bin/`, `test/`
- Sử dụng DartPad cho thí nghiệm nhanh trên trình duyệt
- Phân biệt Dart vs Flutter, Dart standalone vs Dart trong Flutter

### Lý do học

Đây là chương "lên xe" — không có chương này, mọi chương sau đều giả định người đọc đã chạy được `dart run`. Chương 1 đảm bảo môi trường + workflow trước khi đi sâu cú pháp.

### Prerequisites

Không có — chương khởi đầu. Giả định người đọc đã dùng terminal cơ bản (tham khảo trụ cột CLI nếu cần).

### Sections

1. **Dart là gì** — Lịch sử (Google 2011), mục tiêu thiết kế (client-side optimized, multi-platform), so sánh ngắn với JS/TS/Kotlin/Swift, vị trí Dart trong hệ sinh thái Flutter.
2. **Cài Dart SDK** — 3 cách: (a) standalone qua brew/installer, (b) đi kèm khi cài Flutter SDK, (c) qua Docker. Cách kiểm tra: `dart --version`.
3. **DartPad — chạy Dart trên trình duyệt** — Link dartpad.dev, dùng để test nhanh không cần cài.
4. **Hello World** — file `hello.dart` đơn giản nhất, `main()` function, `print()`. Chạy bằng `dart run hello.dart`.
5. **Dart CLI toolchain** — Bảng các lệnh: `dart run`, `dart compile exe`, `dart compile js`, `dart format`, `dart analyze`, `dart test`, `dart pub`. Khi nào dùng cái nào.
6. **Tạo project chuẩn** — `dart create -t console my_app`, giải thích từng file/folder sinh ra: `pubspec.yaml`, `lib/`, `bin/`, `test/`, `analysis_options.yaml`, `.dart_tool/`.
7. **Package management cơ bản** — pub.dev, `dart pub add http`, `dart pub get`, `dart pub upgrade`, lock file.
8. **IDE setup** — VS Code + Dart extension (recommended), IntelliJ/Android Studio + Dart plugin, format on save, analyzer integration.
9. **Compile mode** — JIT (`dart run`) vs AOT (`dart compile exe`), hot reload chỉ có ở Flutter, không có ở Dart pure CLI.

### Key concepts

- `main()` là entry point bắt buộc của Dart program
- File `.dart` không có `class` cũng chạy được — Dart không phải Java
- `pubspec.yaml` ≈ `package.json` của JS, format YAML không phải JSON
- DartPad ≠ Dart full — không phải mọi feature đều chạy ở DartPad
- `dart` CLI ≠ `flutter` CLI — `flutter` wrap `dart` + thêm Flutter-specific commands

### Code examples

1. `hello.dart` — single function `main` in `print('Xin chào Dart')`
2. `main_with_args.dart` — `void main(List<String> args)` đọc command-line args
3. `pubspec.yaml` mẫu cho console app — đầy đủ field `name`, `description`, `environment`, `dependencies`, `dev_dependencies`
4. Project tree dùng `tree` command output, comment từng folder
5. Demo `dart format` trước/sau, `dart analyze` báo unused variable

### Visualizer / diagram

- Sơ đồ "Dart toolchain": source `.dart` → analyzer → (JIT runtime / AOT compile / dart2js / Flutter engine)
- Bảng so sánh `dart` CLI vs `flutter` CLI (cột: lệnh, có ở dart, có ở flutter, mô tả)
- Visual project tree với mô tả từng file

### Bài tập (5)

1. Cài Dart SDK, chạy `dart --version`, screenshot kết quả.
2. Viết file `greet.dart` nhận tên qua command-line args, in ra "Xin chào, [tên]" — chạy bằng `dart run greet.dart Việt`.
3. Tạo console project mới bằng `dart create`, đọc file `bin/<name>.dart` mà dart sinh ra, giải thích từng dòng.
4. Add package `args` từ pub.dev, chạy `dart pub get`, xem `pubspec.lock` thay đổi gì.
5. Compile file `greet.dart` thành executable AOT bằng `dart compile exe`, chạy file binary, so sánh thời gian khởi động vs `dart run`.

### Quiz (7)

1. `main()` của Dart program có bắt buộc return type không? — Có, `void` (hoặc `Future<void>` nếu async). Lý do: Dart strict về type.
2. Khi cài Flutter SDK, có cần cài thêm Dart SDK riêng không? — Không. Flutter SDK đi kèm Dart SDK tương thích, dùng `flutter` CLI sẽ gọi Dart bundled.
3. Câu lệnh nào compile Dart ra JavaScript? — `dart compile js`. Dùng cho Dart web (hiếm, đa số chuyển sang Flutter Web).
4. `pubspec.yaml` và `pubspec.lock` khác gì? — `.yaml` là declaration người viết, `.lock` là resolved version cụ thể do `pub get` sinh. `.lock` nên commit vào git cho app, có thể bỏ cho library.
5. `dart run` và `dart compile exe` khác gì về performance? — `dart run` JIT (khởi động nhanh, runtime chậm hơn AOT), `compile exe` AOT (khởi động chậm vì binary lớn, runtime nhanh, không cần Dart SDK ở máy chạy).
6. DartPad có hỗ trợ đọc file từ disk không? — Không. DartPad chạy sandbox trên trình duyệt, không có I/O thực sự.
7. Folder `.dart_tool/` có nên commit lên git không? — Không. Đây là cache analyzer/build, giống `node_modules/`.

### Connects to

- Flutter Chương 1 (Flutter Setup) — nhắc lại CLI nhưng dùng `flutter` thay `dart`
- Dart Chương 2 trở đi — mọi ví dụ giả định người đọc chạy được `dart run`

### Ước lượng độ dài

~700-800 dòng HTML (chương khởi động, không quá nặng cú pháp, nặng setup + diagram).

---

## Chương 2 — Variables & Types

### Mục tiêu chương

- Hiểu Dart type system: static + sound (sau Dart 2.12)
- Phân biệt `var`, `final`, `const`, `dynamic`, `Object`, `Object?`
- Sử dụng đúng built-in types: `int`, `double`, `num`, `String`, `bool`, `List`, `Set`, `Map`
- Hiểu type inference vs type annotation và khi nào nên dùng cái nào
- Sử dụng string interpolation, raw string, multi-line string thành thạo
- Hiểu `null` không phải value bình thường — phải explicit qua nullable type `T?`

### Lý do học

Type system là xương sống của Dart — khác hẳn JS dynamic. User có nền TS sẽ thấy quen, nhưng Dart **strict hơn TS** (sound null safety, không có `any` ngoại lệ). Hiểu sai chương này thì chương 4 (class) và chương 5 (null safety) sẽ lệch.

### Prerequisites

Chương 1 (chạy được `dart run`).

### Sections

1. **Static type system là gì** — so sánh với JS (dynamic), Python (gradual), TS (gradual), Dart (sound static). Vì sao Dart strict.
2. **Khai báo biến — 4 cách:** `var`, `final`, `const`, type annotation explicit. Bảng quyết định khi nào dùng cái nào.
3. **`final` vs `const`** — `final`: gán 1 lần (có thể là runtime value), `const`: compile-time constant. Hệ quả: `const` cho phép canonical instance (instance giống nhau dùng chung memory).
4. **Type inference** — `var x = 5` infer `int`, `var xs = [1, 2]` infer `List<int>`. Khi nào inference fail và phải annotate.
5. **Numeric types** — `int`, `double`, `num` (parent của 2 cái kia), `int` ↔ `double` không auto-convert. BigInt cho số cực lớn.
6. **`String`** — single quote vs double quote, interpolation `$name` và `${expr}`, multi-line `'''...'''`, raw `r'...'`, escape character, `String` immutable.
7. **`bool`** — chỉ `true`/`false`, **không có truthy/falsy** (khác JS). `if (1)` lỗi compile.
8. **`null` và nullable** — `null` chỉ assignable vào nullable type `T?`. `int x = null` lỗi compile. `int? x = null` OK.
9. **`dynamic` và `Object?`** — `dynamic`: tắt type check (giống TS `any`, dùng cẩn thận). `Object?`: gốc của mọi type, type check vẫn hoạt động.
10. **Type promotion / flow analysis** — Dart analyzer tự thu hẹp type sau `if (x != null)` block.
11. **Symbol và Runes (intro)** — `#name` Symbol, `Runes` cho Unicode code points (chương 6 đi sâu hơn).

### Key concepts

- `var` ≠ `dynamic`: `var` infer type tại compile-time, sau đó type cố định
- `const` instance được canonicalize: 2 `const Point(1, 2)` cùng ref
- `int` không phải subtype của `double` — convert thủ công `.toDouble()`
- `String` so sánh bằng `==` (giá trị), không như Java
- Sound null safety: nếu type là `T` (không có `?`), giá trị **không bao giờ** null

### Code examples

1. `var x = 5; x = 'a';` — lỗi compile (var đã infer int)
2. `dynamic y = 5; y = 'a';` — OK
3. `final now = DateTime.now();` vs `const pi = 3.14;` — final OK với runtime, const không
4. So sánh `var xs = const [1, 2, 3]` và `var ys = [1, 2, 3]` — `xs` immutable view, `ys` mutable
5. String interpolation: `'Tên: $name, tuổi: ${user.age}, tổng: ${a + b}'`
6. Multi-line string mô phỏng JSON template
7. Raw string cho regex: `r'\d+\s+\w+'` không cần escape backslash
8. Demo null safety: `int? maybeAge = null; print(maybeAge?.toString() ?? 'không biết');`

### Visualizer / diagram

- Sơ đồ type hierarchy Dart: `Object?` ← `Object` ← `num` ← `int`/`double`, `String`, `bool`, `Null`...
- Bảng so sánh `var` / `final` / `const` / explicit type (cột: reassign?, compile-time?, type fixed?)
- Bảng "khi nào dùng cái gì" — quyết định flowchart cho biến

### Bài tập (5)

1. Khai báo 5 biến: 1 `var`, 1 `final`, 1 `const`, 1 explicit type, 1 nullable. Mỗi cái 1 dòng kèm comment giải thích.
2. Viết function `formatPrice(int amount, String currency)` trả về string format `"1,500,000 VND"` — dùng interpolation + format helper.
3. Cho biết các dòng nào sau compile lỗi, vì sao: (a) `int x = 3.0`, (b) `num y = 3`, (c) `double z = 3`, (d) `var w; w = 5;`.
4. Viết const `class Color` với 3 const instance `red`, `green`, `blue`, demo `identical(Color.red, Color.red)` trả `true`.
5. Refactor đoạn code dùng `dynamic` thành type cụ thể, đo "code an toàn hơn" qua `dart analyze`.

### Quiz (8)

1. `var x = 5` rồi `x = '5'` — chuyện gì xảy ra? — Lỗi compile, `x` đã infer `int`.
2. `final` và `const` — cái nào tạo canonical instance? — `const`.
3. `1 == 1.0` ở Dart trả về gì? — `true`. `int` và `double` so sánh giá trị qua `num`.
4. `if (1) { ... }` ở Dart hợp lệ không? — Không, lỗi compile. Dart không có truthy, `if` cần `bool` thuần.
5. Kiểu nào là parent chung của `int` và `double`? — `num`.
6. `int? x;` chưa gán giá trị — `x` mặc định là gì? — `null` (vì nullable).
7. `int x;` (non-nullable) chưa gán giá trị, đọc `x` — chuyện gì? — Lỗi compile (definite assignment).
8. Khác biệt `'a$b'` và `'a${b}'` là gì? — Không có, cả 2 đều interpolation. `${...}` cần khi expression không phải identifier đơn (vd `${a.b}`).

### Connects to

- Chương 3 (function param types), Chương 4 (class field types), Chương 5 (null safety đầy đủ), Chương 6 (Collection types `List<T>`)
- Flutter chương 2 (widget property types — đa số non-nullable)

### Ước lượng độ dài

~800-900 dòng HTML (đặc lý thuyết + nhiều ví dụ ngắn).

---

## Chương 3 — Functions & Control Flow

### Mục tiêu chương

- Khai báo function với positional, optional positional, và named parameters
- Hiểu `required` keyword cho named params
- Dùng arrow function syntax `=>` cho function ngắn
- Function là first-class: gán biến, truyền argument, return function
- Viết closure và hiểu capture biến
- Dùng control flow đầy đủ: `if`, `switch` (cũ + Dart 3 expression form), `for`, `while`, `do-while`, `break`, `continue`, `label`
- Hiểu `assert` và khi nào dùng

### Lý do học

Function trong Dart có cú pháp đặc biệt (named params + required) — đây chính là pattern xuất hiện ở **mọi widget constructor Flutter**. Không nắm chương này, đọc code Flutter sẽ confused. Switch expression (Dart 3) cũng là cú pháp mới sẽ gặp khắp nơi.

### Prerequisites

Chương 2 (types).

### Sections

1. **Function declaration cơ bản** — return type, name, parameter list, body. So sánh với JS function.
2. **Positional parameters** — bắt buộc theo thứ tự: `int add(int a, int b)`.
3. **Optional positional parameters** — `[]`: `String greet(String name, [String? title])`. Default value.
4. **Named parameters** — `{}`: `Widget build({Key? key, required String label})`. `required` keyword (bắt buộc named param không nullable phải có default hoặc required).
5. **Default parameter values** — chỉ const expression: `int retry({int times = 3})`.
6. **Arrow function** — `=>` shorthand cho function chỉ có 1 expression: `int sq(int x) => x * x;`
7. **Anonymous function / lambda** — `(x) => x + 1`, `(x) { return x + 1; }`.
8. **Function as first-class value** — gán biến `var f = sq;`, truyền `xs.map(sq)`, return từ function khác.
9. **Function type** — `int Function(int)` là type của một function. Typedef: `typedef IntTransformer = int Function(int);`
10. **Closure** — function lambda capture biến scope ngoài. Ví dụ counter factory.
11. **Control flow — if/else** — không gì lạ, nhưng nhắc lại điều kiện phải `bool` (không truthy).
12. **Control flow — switch statement cổ điển** — `case ... :`, `break` (Dart không fallthrough mặc định), `default`.
13. **Switch expression (Dart 3)** — `var x = switch (val) { 1 => 'one', 2 => 'two', _ => 'other' };` — chương 8 đi sâu pattern matching, chương 3 chỉ giới thiệu.
14. **For / for-in / forEach** — for index, for-in iterator, `.forEach()` method. Khi nào dùng cái nào (forEach không `break` được).
15. **While / do-while** — chuẩn.
16. **break/continue + label** — vòng lồng nhau, label `outer:` để break từ vòng trong.
17. **assert** — debug-only check, không chạy ở production AOT.

### Key concepts

- Named param + `required` keyword = pattern bắt buộc đọc trước khi nhìn Flutter widget
- Function là object thực sự (có `.call()`, `.toString()`)
- Closure capture by reference, không by value
- `switch` không fallthrough — không cần `break` vẫn an toàn (khác C/Java)
- Switch expression phải exhaustive — analyzer cảnh báo nếu thiếu case

### Code examples

1. Function với 3 kiểu param: `void show(String msg, [bool loud = false], {Color? color})`
2. Widget-style constructor giả lập: `MyButton({required String label, VoidCallback? onPressed})`
3. Arrow function trong `.map`: `[1,2,3].map((x) => x * 2)`
4. Closure: `Function makeCounter() { var i = 0; return () => ++i; }` — gọi 3 lần ra 1, 2, 3
5. Switch expression: phân loại HTTP status code (200/300/400/500) → message
6. Vòng for-in iterate `Map<String, int>` qua `.entries`
7. Label break trong nested loop tìm value

### Visualizer / diagram

- Sơ đồ "anatomy of a Dart function" — annotate từng phần (return type, name, positional, optional, named, body)
- Bảng so sánh 3 loại parameter (positional / optional positional / named) — cú pháp, default, gọi
- Diagram closure: function object giữ reference đến outer scope variable

### Bài tập (5)

1. Viết hàm `connectToServer({required String host, int port = 8080, bool secure = false})` — gọi 3 cách khác nhau.
2. Viết `Function makeMultiplier(int factor)` trả về function nhân factor. Test: `var double = makeMultiplier(2); double(5)` → 10.
3. Cho list status code `[200, 201, 301, 404, 500]`, dùng switch expression mapping ra `['ok', 'created', 'redirect', 'not found', 'error']`.
4. Tìm bug trong đoạn code closure quên `var` (hint: shadowing). Sửa lại.
5. Viết function lấy `List<int>` trả về sum dùng cả for-in lẫn `.fold` — so sánh code length / readability.

### Quiz (8)

1. Named parameter nullable mặc định có cần `required` không? — Không. `String?` đã imply optional.
2. Named parameter non-nullable không có default — cần gì? — `required` keyword.
3. Dart switch có fallthrough mặc định như C không? — Không. Mỗi case auto-break.
4. Arrow function `=>` body có thể chứa nhiều statement không? — Không, chỉ 1 expression. Cần nhiều statement thì dùng `{ }`.
5. `void Function()` và `Function` khác gì? — `void Function()` là type cụ thể (function không param, không return). `Function` là parent type generic, mất type safety.
6. Closure capture biến — khi biến outer thay đổi, closure thấy giá trị mới hay cũ? — Mới (capture by reference).
7. `for (var i = 0; i < 3; i++)` và `[0,1,2].forEach((i) {...})` — cái nào break được giữa chừng? — `for` được, `forEach` không.
8. `assert(condition)` chạy trong production AOT build không? — Không. Chỉ chạy ở debug mode / `dart run`.

### Connects to

- Chương 4 (constructor là function đặc biệt + named param + required)
- Chương 7 (async function là một dạng function với keyword `async`)
- Chương 8 (switch expression đi cùng patterns)
- Flutter từ chương 2 trở đi — mọi widget constructor dùng `{required ...}`

### Ước lượng độ dài

~900-1000 dòng HTML (chương đông syntax + nhiều ví dụ).

---

## Chương 4 — Classes & Inheritance

### Mục tiêu chương

- Khai báo class với field, method, constructor
- Sử dụng đủ 5 loại constructor: default, named, initializer list, redirecting, factory
- Hiểu getter/setter (computed property)
- Phân biệt instance member vs static member
- Inheritance: `extends`, `@override`, `super`, abstract class/method
- Interface (implicit interface) và `implements`
- Mixin: `mixin`, `with`, `on` constraint
- Hiểu class modifier Dart 3: `base`, `final`, `sealed`, `interface`, `mixin`
- Override `toString`, `==`, `hashCode` đúng cách + pattern `copyWith`

### Lý do học

Mọi `Widget` Flutter là `class extends StatelessWidget` hoặc `extends StatefulWidget`. Mọi state management bloc/cubit dùng inheritance. Pattern `copyWith` xuất hiện ở mọi immutable state class. Class modifier Dart 3 (`sealed`) là nền của exhaustive pattern matching ở chương 8.

User đã học OOP ở trụ cột OOP (8 chương), chương này **không dạy lại OOP từ đầu** — chỉ map kiến thức OOP sang cú pháp Dart, nhấn mạnh điểm khác (implicit interface, mixin, factory constructor, class modifier).

### Prerequisites

- Chương 2 (types), Chương 3 (function & named param)
- IT Basic — trụ cột OOP (đã học inheritance/polymorphism/interface conceptually)

### Sections

1. **Class anatomy** — field, method, constructor. Naming convention: PascalCase class, camelCase member.
2. **Constructor default** — `class Point { int x, y; Point(this.x, this.y); }` — `this.x` shorthand.
3. **Named constructor** — `Point.origin() : x = 0, y = 0;`. Khi nào dùng (multiple constructors).
4. **Initializer list** — `Point(this.x, this.y) : assert(x >= 0)`. Chạy trước body, trước `super()`.
5. **Const constructor** — class có thể có `const Point(this.x, this.y)` khi tất cả field `final`. Cho phép canonical instance.
6. **Redirecting constructor** — `Point.zero() : this(0, 0);` — gọi constructor khác cùng class.
7. **Factory constructor** — `factory Logger(String name) { return _cache[name] ??= Logger._(name); }`. Không bắt buộc trả về instance mới — dùng cho singleton/caching/subclass selection.
8. **Getter/setter** — `int get area => width * height;`, `set width(int v) { _width = v; }`. Dart access field/getter giống nhau từ caller (no `()`).
9. **Static member** — `static const pi = 3.14;`, `static List<User> all() => ...`. Truy cập qua tên class.
10. **Private member** — Dart không có `private` keyword, dùng prefix `_`. Scope: library-private (không class-private).
11. **Inheritance — `extends`** — single inheritance, gọi `super` constructor, `@override` method.
12. **Abstract class & abstract method** — `abstract class Shape { double area(); }`. Không instantiate được.
13. **Implicit interface — `implements`** — mọi class là interface ẩn của chính nó. `class Dog implements Animal` không kế thừa code, chỉ commit signature.
14. **Mixin — `with`, `mixin`, `on`** — share code không qua inheritance. `mixin Swimmer on Animal { ... }` constraint mixin chỉ dùng được cho subclass Animal.
15. **Class modifier Dart 3** — `base` (chỉ extends, không implements ngoài file), `final` (không subtype), `sealed` (subset of final, dùng cho exhaustive switch), `interface` (chỉ implements, không extends), `mixin class`.
16. **`toString`, `==`, `hashCode`** — override chuẩn. Lý do `==` và `hashCode` luôn đi đôi.
17. **Pattern `copyWith`** — chuẩn cho immutable model: `User copyWith({String? name, int? age}) => User(name: name ?? this.name, age: age ?? this.age);`
18. **Enum nâng cao** — enum có constructor, field, method (Dart 2.17+). Ví dụ `enum Status { active(1), inactive(0); final int code; const Status(this.code); }`.

### Key concepts

- Constructor `this.x` shorthand = auto-assign field
- `factory` constructor breaks "always new instance" rule — dùng để cache/share
- Implicit interface: mọi class là interface ngầm — đừng phải định nghĩa interface riêng nếu không cần
- Mixin ≠ multiple inheritance — mixin compose code, không phải parent
- Class modifier Dart 3 = kiểm soát ai được extend/implement (encapsulation library)

### Code examples

1. `class Point` đầy đủ: const constructor, named constructor `origin`, `==`/`hashCode`, `toString`, `copyWith`.
2. Singleton qua factory: `class Logger { static final _instances = <String, Logger>{}; factory Logger(String name) => _instances[name] ??= Logger._(name); Logger._(this.name); final String name; }`
3. Abstract `Shape` + concrete `Circle`, `Rectangle`, `Triangle` với `double area()`.
4. Mixin `Comparable` + `Sortable on List`: `mixin Sortable<T> on List<T> { void quickSort() { ... } }`
5. `sealed class Result<T>` với `Success<T>` và `Failure<T>` — dùng cho exhaustive switch ở chương 8.
6. Enum `Priority` với `final int weight; const Priority(this.weight);` + method `bool isHigherThan(Priority other) => weight > other.weight;`

### Visualizer / diagram

- Sơ đồ "anatomy of a Dart class" với annotate: field, getter, constructor, factory, static, instance method
- Bảng so sánh `extends` / `implements` / `with` — cái nào kế thừa code, cái nào chỉ signature
- Diagram "class modifier matrix" Dart 3: cột (base, final, sealed, interface, mixin, none), hàng (extends cho phép?, implements cho phép?)
- Visualizer cho mixin compose: class A + mixin B + mixin C = class final với linearization order

### Bài tập (5)

1. Implement `class Money` với field `amount: int` (cents), `currency: String`. Override `==`, `hashCode`, `toString`. Thêm `copyWith`. Test 2 instance bằng amount/currency cùng giá trị → `==` trả `true`.
2. Tạo `abstract class Shape` với `double area()`. Implement 3 subclass: `Circle`, `Rectangle`, `Triangle`. Viết function `Shape biggest(List<Shape> shapes)` trả Shape lớn nhất.
3. Viết `mixin Logger` thêm `void log(String msg)` cho bất kỳ class nào. Apply vào 2 class khác nhau.
4. Refactor singleton manual (`static instance` + private constructor) sang dùng `factory` constructor — so sánh code.
5. Tạo `sealed class ApiResult<T>` với `Success<T>(T data)` và `Failure(String error)`. Chuẩn bị cho switch exhaustive (sẽ dùng ở chương 8).

### Quiz (8)

1. Constructor `Point.origin()` gọi từ ngoài bằng cách nào? — `Point.origin()` (tên class.tên constructor).
2. `factory` constructor có bắt buộc trả về instance mới không? — Không. Có thể cache, có thể trả subclass.
3. Dart có keyword `interface` không? — Có (Dart 3 class modifier), nhưng từ Dart 2 mọi class đã là implicit interface — `implements AnyClass` luôn được.
4. Sau `class A extends B with M1, M2`, thứ tự lookup method là gì? — A → M2 → M1 → B → Object (linearization).
5. Override `==` mà không override `hashCode` — chuyện gì? — Analyzer cảnh báo. Hash-based collection (Set, Map) sẽ vỡ.
6. `sealed` class Dart 3 dùng để làm gì? — Giới hạn subclass trong cùng file, cho phép switch exhaustive.
7. `_name` field — private ở scope nào? — Library scope (file scope nếu không export), không phải class scope.
8. `static` method gọi từ instance được không? — Không. Chỉ qua tên class: `User.all()`.

### Connects to

- Chương 5 (null safety cho field `late`)
- Chương 8 (sealed class + pattern matching)
- Flutter chương 2 (StatelessWidget/StatefulWidget = class extends)
- Flutter chương 7 (Bloc/Cubit dựa trên class hierarchy)
- OOP pillar (cross-reference: Dart map kiến thức OOP đã học)

### Ước lượng độ dài

~1000-1100 dòng HTML (chương lớn nhất + nhiều ví dụ class).

---

## Chương 5 — Null Safety & Error Handling

### Mục tiêu chương

- Hiểu sound null safety là gì, vì sao Dart 2.12+ làm điều này
- Phân biệt `T` (non-nullable) và `T?` (nullable)
- Dùng đủ null-aware operator: `?.`, `??`, `??=`, `...?`, `?[]`
- Dùng `!` non-null assertion đúng chỗ + hiểu rủi ro
- Hiểu `late` keyword: late init + lazy late
- Bắt exception đúng: `try/catch/finally`, `on Type catch`, `rethrow`
- Phân biệt `Exception` vs `Error`
- Xử lý lỗi async với try/catch + await
- Tự định nghĩa exception class

### Lý do học

Sound null safety là **fact** của Dart — không thể tránh. Mỗi field widget, mỗi response API, mỗi state value đều phải quyết định "có nullable không". Sai null safety = crash runtime hoặc analyzer scream. Đây là chương "lái xe an toàn" — không nắm chương này, code chương sau sẽ đầy `?` và `!` random.

### Prerequisites

Chương 2 (types), Chương 4 (class).

### Sections

1. **Vì sao có null safety** — lịch sử "billion dollar mistake" của Tony Hoare. Dart trước 2.12 (unsound), sau 2.12 (sound). Sound = analyzer + runtime guarantee.
2. **Nullable type `T?`** — bài học chính. Mọi type mặc định non-nullable. Muốn null phải explicit `T?`.
3. **Definite assignment analysis** — `int x; print(x);` lỗi vì chưa gán. Local non-nullable phải gán trước khi đọc.
4. **Null-aware operator group** — bảng 5 operator:
   - `?.` access an toàn: `user?.name`
   - `??` default value: `name ?? 'guest'`
   - `??=` assign nếu null: `name ??= 'default'`
   - `...?` spread null-safe: `[...?maybeList]`
   - `?[]` index null-safe: `map?['key']`
5. **Non-null assertion `!`** — promote `T?` thành `T`. Lỗi runtime nếu thực sự null. Khi nào dùng (analyzer không thể chứng minh non-null nhưng dev biết).
6. **Type promotion / flow analysis** — sau `if (x != null) { x.method(); }`, trong block `x` thành `T` không cần `!`. Hạn chế: chỉ với local variable (field cần copy ra local).
7. **`late` keyword** — `late String name;` — chưa gán nhưng hứa sẽ gán trước khi đọc. Lỗi runtime nếu đọc trước gán.
8. **`late final` + lazy late** — `late final config = _loadConfig();` — gán lần đầu khi đọc, sau đó cache. Pattern lazy initialization.
9. **`Exception` vs `Error`** — `Exception` cho lỗi catchable thông thường (network, parse). `Error` cho bug programming (NullThrownError, RangeError) — không nên catch.
10. **try/catch/finally** — cú pháp chuẩn.
11. **`on Type catch (e)`** — chỉ catch type cụ thể, có thể nhiều block `on`.
12. **`rethrow`** — bắt log rồi ném tiếp, giữ stack trace.
13. **Custom exception class** — `class NetworkException implements Exception { final String message; ... }`. Không bắt buộc extends Exception (chỉ implements).
14. **Stack trace** — `catch (e, st) { print(st); }`.
15. **Async error handling** — `try/catch` quanh `await`, `Future.catchError`, error zone (intro, chi tiết chương 7).
16. **`assert(condition, message)`** — debug check, không thay thế null safety.

### Key concepts

- Sound null safety = analyzer **chứng minh** non-null tại compile time
- `late` = "tôi đảm bảo sẽ gán" — analyzer tin, runtime kiểm tra
- `!` = "tôi đảm bảo non-null" — bypass analyzer, runtime kiểm tra
- `Exception` ≠ `Error` — semantic khác, không phải convention naming
- Flow analysis chỉ work với local variable (field bị invalidate khi gọi method khác)

### Code examples

1. So sánh code pre-null-safety vs sound: handle null `user.address.city`.
2. Demo 5 null-aware operator trên một object lồng.
3. `late` cho dependency injection: `late final Database db; void setDb(Database d) => db = d;`
4. Lazy late: `late final expensiveValue = compute();` — chỉ chạy khi đọc lần đầu.
5. Custom exception `class ApiException implements Exception { ApiException(this.statusCode, this.message); final int statusCode; final String message; }`
6. `on FormatException catch (e) { ... } on Exception catch (e) { ... } catch (e, st) { ... }` — nhiều layer.
7. Async error: `try { final r = await fetchUser(); } on NetworkException catch (e) { ... }`.

### Visualizer / diagram

- Sơ đồ "null safety decision tree": gặp value lúc design — nó có thể null thật sự không?
   - Có → `T?` + xử lý null bằng operator
   - Không → `T` + đảm bảo gán
   - Phụ thuộc init order → `late`
- Bảng 5 null-aware operator: input → output, ví dụ ngắn
- Sơ đồ exception class hierarchy: `Object` → `Exception` (interface) + `Error` (class)

### Bài tập (5)

1. Cho data model `class User { final String name; final Address? address; }` và `class Address { final String? city; }`. Viết `String displayCity(User u)` trả về city hoặc `'Không có địa chỉ'` — dùng null-aware operator, không dùng if/else.
2. Refactor đoạn code dùng `!` quá nhiều thành code an toàn (dùng if-null-check + flow promotion).
3. Implement `late final Database db` pattern + factory để inject database. Test: gọi `db.query()` trước khi `setDb` → expect lỗi runtime với message rõ ràng.
4. Định nghĩa `class ApiException` với 3 field, override `toString`. Throw từ function `fetchUser`, catch ở caller, log message.
5. Viết async function `fetchAndParse(String url)` xử lý 3 loại lỗi: network (NetworkException), parse (FormatException), khác (catch generic). Mỗi loại trả về một fallback khác nhau.

### Quiz (8)

1. `int x = null;` ở Dart 3 — chuyện gì? — Lỗi compile.
2. `late String name;` chưa gán, đọc — chuyện gì? — Lỗi runtime `LateInitializationError`.
3. `obj!.method()` — `!` làm gì? — Promote `T?` thành `T`, runtime throw nếu thực sự null.
4. `a ?? b` — khi nào trả `b`? — Khi `a` là `null`.
5. `a ??= b` — khi nào assign? — Khi `a` đang null.
6. Sau `if (x != null) { ... x.method(); ... }` (x là local `int?`) — trong block `x` cần `!` không? — Không, flow promotion lo rồi.
7. Catch `Error` (vd `RangeError`) — nên hay không nên? — Không nên. `Error` là bug programming, nên fix code không phải catch.
8. `rethrow` khác `throw e` ở điểm gì? — `rethrow` giữ stack trace gốc, `throw e` tạo stack trace mới.

### Connects to

- Chương 4 (field `late`)
- Chương 7 (Future error)
- Flutter chương 6+ (state nullable / non-nullable, BuildContext không null, etc.)

### Ước lượng độ dài

~850-950 dòng HTML.

---

## Chương 6 — Collections & Iterables

### Mục tiêu chương

- Sử dụng thành thạo `List`, `Set`, `Map` với generic type
- Phân biệt growable / fixed / unmodifiable list
- Hiểu `Iterable` là lazy — chỉ compute khi consume
- Dùng higher-order method: `map`, `where`, `fold`, `reduce`, `expand`, `take`, `skip`, `any`, `every`, `firstWhere`
- Dùng spread operator `...` và `...?`
- Dùng collection-if / collection-for: `[if (cond) x, for (var i in xs) i]`
- Hiểu khi nào tách Iterable → List bằng `.toList()`
- Sort, reverse, group by, unique

### Lý do học

Collection là tool dùng mỗi ngày. Higher-order method (map/where/fold) là pattern functional cốt lõi — Flutter UI build từ list widget (`children: items.map(...).toList()`), state class lưu collection (`List<Todo>`). Collection-if/for là cú pháp **rất Flutter-friendly** để xây widget tree có điều kiện.

### Prerequisites

Chương 2 (generic List<T>), Chương 3 (function/lambda — vì higher-order method nhận lambda).

### Sections

1. **3 collection cơ bản** — `List<T>` (sequence ordered, allow duplicate), `Set<T>` (unique, unordered nominal), `Map<K, V>` (key-value).
2. **List literal & constructor** — `[1, 2, 3]`, `List.filled(5, 0)`, `List.generate(5, (i) => i * 2)`, `List.from(iter)`, `List.of(iter)`.
3. **List operation cơ bản** — `add`, `remove`, `insert`, `removeAt`, `clear`, `length`, `indexOf`, `contains`, `sort`.
4. **Growable vs fixed-length** — `List.filled(5, 0, growable: false)` không thể add. `<int>[]` mặc định growable.
5. **Set literal & constructor** — `{1, 2, 3}`, `Set<int>()`, `Set.from(iter)`. Khác `Map` literal (cũng `{}`) — set có giá trị, map có key:value.
6. **Set operation** — `union`, `intersection`, `difference`, `contains`. Lý do dùng Set thay List (uniqueness, O(1) contains).
7. **Map literal & operation** — `{'a': 1, 'b': 2}`, `map['a']`, `map['a'] = 1`, `map.containsKey`, `map.keys`, `map.values`, `map.entries`, `forEach((k, v) => ...)`.
8. **Iterable — lazy by design** — `where`, `map`, `take` trả `Iterable`, **không** compute đến khi `forEach`/`.toList()`/`for-in`. Demo: `print` trong `.map((x) { print(x); return x; })` không in cho đến khi consume.
9. **Higher-order method group** — bảng:
   - `map<R>((T e) => R)` — transform
   - `where((T e) => bool)` — filter
   - `expand((T e) => Iterable<R>)` — flatMap
   - `fold<R>(R initial, (R acc, T e) => R)` — reduce với initial value và type khác
   - `reduce((T a, T b) => T)` — như fold nhưng acc cùng type, không initial
   - `take(int n)`, `skip(int n)` — prefix/suffix
   - `firstWhere`, `lastWhere`, `singleWhere` — tìm
   - `any`, `every`, `contains` — boolean check
10. **Spread operator** — `[...xs, ...ys]` flatten. `[...?maybeList]` null-safe.
11. **Collection-if / collection-for** — `[1, 2, if (cond) 3, for (var i in xs) i * 2]`. Pattern build Flutter widget list có điều kiện.
12. **Sort & comparator** — `xs.sort((a, b) => a.compareTo(b))`. `Comparable` interface.
13. **Convert giữa types** — `.toList()`, `.toSet()`, `Map.fromIterable`, `Map.fromEntries`.
14. **Unmodifiable view** — `List.unmodifiable(xs)`, `Map.unmodifiable(m)` — view không cho phép modify (vẫn share data).
15. **`Iterable.empty()` và `const` collection** — `const []` vs `[]` — const collection canonicalize.
16. **Performance note** — `List.contains` O(n), `Set.contains` O(1) (avg). Khi nào nên switch.

### Key concepts

- `Iterable` lazy — chỉ compute khi consume. Chain dài không cost gấp đôi.
- Set vs Map literal đều `{}` — analyzer infer qua nội dung. `{}` trống = empty Map.
- `map`/`where` trả Iterable, không phải List — cần `.toList()` để materialize.
- `xs.sort()` mutate `xs` (không trả về Iterable mới). Khác `.sorted()` của Kotlin.
- Collection-if/for là sugar, compile-time, không phải runtime loop.

### Code examples

1. List của user: filter `where`, transform `map`, fold tính tổng tuổi.
2. Set deduplicate username từ list user.
3. Map group user by city: `users.fold<Map<String, List<User>>>({}, (acc, u) => acc..putIfAbsent(u.city, () => []).add(u))`.
4. Spread merge 2 list config, ưu tiên override.
5. Collection-if build menu items: `[home, profile, if (isAdmin) adminPanel, settings]`.
6. Demo lazy: `[1,2,3].map((x) { print('mapping $x'); return x*2; })` không in cho đến khi `.toList()`.
7. Sort user theo age tăng dần, sau đó tên A→Z (compound compare).

### Visualizer / diagram

- Sơ đồ pipe: input List → `.where(...)` → `.map(...)` → `.toList()` — annotate lazy zone vs materialized.
- Bảng so sánh List/Set/Map: ordered?, unique?, lookup complexity, use case.
- Diagram spread + collection-if compile như thế nào (just sugar)
- Performance table: contains O(n) vs O(1), sort O(n log n), insert at front O(n) vs O(1).

### Bài tập (5)

1. Cho `List<User>` với field `age, city, premium`. Viết 1 expression chain lấy email của top 3 user premium theo age giảm dần, ở city 'HN'.
2. Refactor for-loop tính tổng giá trị giỏ hàng thành `.fold`.
3. Group books theo author: `Map<String, List<Book>>` từ `List<Book>`. Dùng `fold` hoặc `groupBy` (manual).
4. Build menu items động cho 3 role user khác nhau dùng collection-if. So sánh với cách viết if/else thông thường — đo số dòng.
5. Tạo function `Iterable<int> primes()` trả về vô hạn prime — dùng generator/lazy. Demo `primes().take(10).toList()` không loop vô hạn.

### Quiz (8)

1. `<int>[].runtimeType` ≈ gì? — `List<int>` (growable).
2. `{1, 2, 3}` là Set hay Map? — Set. `{1: 'a'}` là Map.
3. `{}` (rỗng) là Set hay Map? — Map. Vì không có context infer.
4. `[1, 2, 3].map((x) => x * 2)` trả type gì? — `Iterable<int>`, không phải `List<int>`.
5. `xs.sort()` mutate xs hay trả mới? — Mutate. Không return.
6. Cách tìm element đầu thỏa điều kiện hoặc null nếu không có? — `xs.firstWhere(pred, orElse: () => null)` (cần List của nullable). Hoặc Dart 3: `xs.firstWhereOrNull(pred)` từ package collection.
7. Spread `[...xs, ...?maybeYs]` — khi `maybeYs` null, kết quả? — Chỉ chứa elements của `xs`. `...?` null-safe skip.
8. `Map.fromEntries([MapEntry('a', 1), MapEntry('b', 2)])` ≈ gì? — `{'a': 1, 'b': 2}`.

### Connects to

- Chương 7 (Stream là Iterable async)
- Chương 8 (collection pattern matching, generic List<T>)
- Flutter chương 3 (children: <Widget>[...])
- Flutter chương 9+ (state list của entity)

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 7 — Async, Future & Stream

### Mục tiêu chương

- Hiểu Dart concurrency model: single-threaded event loop + isolate
- Sử dụng `Future<T>`, `async`/`await`, `Future.value`, `Future.error`, `Future.delayed`
- Xử lý lỗi async đúng: try/catch quanh await, `.catchError`
- `Future.wait`, `Future.any` cho parallel
- Hiểu `Stream<T>`: single-subscription vs broadcast
- Tạo Stream: `StreamController`, `Stream.fromIterable`, `Stream.periodic`, `async*`/`yield`
- Tiêu thụ Stream: `await for`, `.listen`, transform `.map`/`.where`/`.asyncMap`/`.distinct`
- Quản lý StreamSubscription: pause/resume/cancel
- Intro Isolate: `compute`, `Isolate.spawn` (chỉ overview)

### Lý do học

UI Flutter là **stream of frames** — không hiểu async/stream thì không hiểu Flutter. State management `Bloc` dùng `Stream<State>`. Network call ai cũng dùng `await http.get`. Animation chạy trên event loop. Đây là chương "tim mạch" — bỏ qua thì chương Flutter sẽ vỡ.

### Prerequisites

- Chương 3 (function/closure), Chương 5 (error handling), Chương 6 (Iterable — Stream tương tự nhưng async)

### Sections

1. **Concurrency model Dart** — single-threaded event loop, microtask queue + event queue. So sánh với multi-thread (Java) và async (JS).
2. **Event loop visualizer** — vòng lặp: pull microtask → drain → pull event → drain → repeat. Microtask priority cao hơn event.
3. **`Future<T>` là gì** — "promise của value sẽ có sau". So sánh với JS Promise (rất giống). Tạo: `Future.value(5)`, `Future.delayed(Duration(seconds: 1), () => 'hi')`, `Future.error(Exception('boom'))`.
4. **`then` / `catchError` / `whenComplete`** — chaining cổ điển, vẫn dùng được khi không cần await (vd onPressed).
5. **`async` / `await`** — sugar cho `Future`. Function `async` luôn trả `Future`. `await` chỉ hợp lệ trong function `async`.
6. **Error handling async** — try/catch quanh `await`, hoặc `.catchError`. Mix 2 cách. Async error trong onPressed (không await) sẽ thành **unhandled exception** — pattern dễ sai.
7. **`Future.wait`** — chạy song song N future, đợi tất cả. `Future.wait([f1, f2, f3])`. So sánh với loop `await` tuần tự.
8. **`Future.any`** — đợi cái đầu tiên xong. Pattern timeout: `Future.any([fetch(), Future.delayed(5s, () => null)])`.
9. **`Stream<T>` là gì** — "iterable async". Mỗi value đến tại một thời điểm trong tương lai. So sánh với Observable RxJS.
10. **Single-subscription vs broadcast stream** — single: chỉ 1 listener, dữ liệu buffer. Broadcast: nhiều listener, không buffer. Convert: `stream.asBroadcastStream()`.
11. **Tạo stream — `StreamController`** — manual push: `controller.add(value)`, `controller.addError(e)`, `controller.close()`. `controller.stream` lấy stream.
12. **Tạo stream — generator `async*`/`yield`** — `Stream<int> count() async* { for (var i = 0; i < 5; i++) { yield i; await Future.delayed(...); } }`.
13. **Tạo stream — built-in** — `Stream.fromIterable([1,2,3])`, `Stream.periodic(Duration(seconds: 1), (i) => i)`.
14. **Tiêu thụ stream — `.listen`** — `stream.listen((value) {...}, onError: ..., onDone: ...)`. Trả `StreamSubscription`.
15. **Tiêu thụ stream — `await for`** — chỉ trong function `async`: `await for (var v in stream) { print(v); }`. Tuần tự.
16. **Transform stream** — `.map`, `.where`, `.asyncMap`, `.distinct`, `.take`, `.skip`. Trả stream mới.
17. **StreamSubscription lifecycle** — `pause()`, `resume()`, `cancel()`. Pattern dispose ở Flutter widget.
18. **Isolate intro** — Dart isolate = thread riêng, không share memory, communicate qua message. `compute(fn, arg)` shortcut. `Isolate.spawn` raw. Chỉ giới thiệu, không deep dive (nằm ngoài scope chính).

### Key concepts

- Single-thread event loop ≠ chậm — vì I/O không block, CPU work mới cần isolate
- `async` function **không chạy ngay** — schedule lên microtask. Đừng giả định sync trong async.
- `await` chỉ pause function hiện tại, không block event loop
- Stream single-subscription cancel ≠ stream rỗng — cancel để giải phóng resource
- Mỗi `StreamSubscription` không cancel = memory leak (đặc biệt Flutter dispose)

### Code examples

1. Compare `then` style vs `async/await` style cho cùng logic fetch.
2. `Future.wait` parallel 3 API call, đo thời gian vs tuần tự.
3. Timeout pattern: `result = await Future.any([fetchData(), Future.delayed(timeout, () => throw TimeoutException())])`.
4. `StreamController` build event bus đơn giản.
5. `Stream.periodic` clock 1Hz, transform `.map((tick) => DateTime.now())` → in mỗi giây.
6. Async generator `async*` đếm prime infinite, `.take(10)` materialize.
7. Pattern Flutter widget: `late StreamSubscription _sub; @override void dispose() { _sub.cancel(); }`.
8. `compute` chạy heavy parse JSON ngoài main isolate.

### Visualizer / diagram

- Diagram event loop: microtask queue + event queue, vòng lặp pull
- Timeline: tuần tự `await a; await b;` vs `Future.wait([a, b])` — 2 thanh ngang biểu diễn time
- Sơ đồ Stream: producer → optional transform → subscription
- Bảng Future vs Stream: 1 giá trị vs N giá trị, completes vs done, await vs await-for
- Bảng `then`/`catchError` vs `async/await` — viết style tương đương

### Bài tập (5)

1. Viết function `Future<String> fetchUser(int id)` mock với `Future.delayed`. Gọi tuần tự 3 lần và parallel 3 lần, đo `Stopwatch`. Báo cáo time chênh.
2. Build timer countdown 10→0 dùng `Stream.periodic` + transform. Print mỗi giây, dừng khi 0.
3. Viết retry helper: `Future<T> retry<T>(Future<T> Function() task, {int times = 3, Duration delay = const Duration(seconds: 1)})`. Test với function fail 2 lần đầu, thành công lần 3.
4. Implement event bus đơn giản dùng `StreamController.broadcast`. 2 listener cùng nghe, 1 publisher. Demo cả 2 nhận event.
5. Refactor đoạn code `.then().catchError().whenComplete()` thành `async/await` + try/catch/finally. So sánh độ dễ đọc.

### Quiz (8)

1. `async` function trả về type gì khi không có `await`? — Vẫn `Future`. Chỉ là Future hoàn thành sớm (synchronously khi không có await).
2. Microtask và event task — cái nào ưu tiên? — Microtask cao hơn. `Future.value()` schedule microtask, `Future.delayed(0ms)` schedule event.
3. `await Future.wait([f1, f2])` — nếu `f1` lỗi, `f2` còn chạy? — Còn chạy, nhưng `Future.wait` trả error ngay, kết quả `f2` bị bỏ. Dùng `eagerError: false` (mặc định true).
4. Stream single-subscription `.listen` 2 lần — chuyện gì? — Lỗi runtime. Phải dùng broadcast.
5. `await for (var v in stream)` — body có thể `break` không? — Có, cancel subscription tự động.
6. `async*` function trả type gì? — `Stream<T>`. So với `async` (Future<T>).
7. `compute(fn, arg)` chạy ở đâu? — Isolate khác main isolate. `fn` phải top-level hoặc static (vì isolate không share closure).
8. Lưu `StreamSubscription` vào field rồi dispose — vì sao quan trọng ở Flutter? — Để cancel khi widget unmount, tránh callback gọi `setState` sau dispose → crash.

### Connects to

- Chương 8 (Generic type Future<T> / Stream<T>)
- Flutter chương 2 (FutureBuilder/StreamBuilder)
- Flutter chương 7 (Bloc dựa trên Stream)
- Flutter chương 10 (HTTP call async)

### Ước lượng độ dài

~1100-1200 dòng HTML (chương dài nhất, nhiều diagram + code).

---

## Chương 8 — Generics, Extension, Patterns (Dart 3)

### Mục tiêu chương

- Khai báo generic class `Box<T>` và generic method `T first<T>(List<T> xs)`
- Hiểu bounded generic `T extends Comparable`
- Viết extension method để thêm function cho built-in type
- Hiểu extension types (Dart 3.3+) như zero-cost wrapper
- Sử dụng records `(int, String)` và named records `({int x, int y})`
- Dùng patterns: destructuring, switch with pattern, if-case
- Kết hợp sealed class + exhaustive switch
- Hiểu khi nào dùng record vs class

### Lý do học

Đây là chương "Dart hiện đại" — phần lớn pattern code mới bạn sẽ thấy ở Flutter packages 2024+ dùng các feature này. Records thay thế phần lớn use case "DTO class". Pattern matching làm code state-handling sạch hơn nhiều so với chain `if/else`. Generic là **bắt buộc** ở mọi `List<T>`, `Stream<T>`, `Bloc<E, S>`.

Đây cũng là chương "kết thúc Dart" — sau chương này, người đọc có thể đọc 80% code Dart/Flutter modern.

### Prerequisites

Tất cả chương 1-7.

### Sections

1. **Generic class** — `class Box<T> { final T value; Box(this.value); }`. Use case: container, repository, response.
2. **Generic method** — `T first<T>(List<T> xs) => xs.first;`. Type inference từ argument.
3. **Bounded generic** — `class Sortable<T extends Comparable<T>>`. Constraint để dùng method của bound.
4. **Multiple type parameters** — `class Cache<K, V>`, `Map<K, V>`. Quy ước naming (T, E, K, V, R).
5. **Variance trong Dart** — Dart generic mặc định covariant (different from Java invariant). `List<Cat>` is `List<Animal>`. Tradeoff: type-safety sacrifice (potential runtime error).
6. **Extension method** — `extension StringX on String { String capitalize() => ...; }`. Gọi như instance method.
7. **Extension getter/operator** — extension cũng có thể thêm getter, setter, operator (`+`, `[]`).
8. **Extension types (Dart 3.3+)** — `extension type Email(String value) { ... }`. Zero-cost wrapper, compile time chỉ là String, runtime không boxing. Use case: domain type-safety (Email khác String thường).
9. **Records** — `(int, String)` positional, `({int age, String name})` named. Truy cập: `r.$1`, `r.$2`, `r.age`, `r.name`. Equality structural.
10. **Records — khi nào dùng vs class** — class khi cần method/behavior/identity. Record khi chỉ cần "túi data" ngắn hạn (return nhiều giá trị, intermediate state).
11. **Pattern — destructuring** — `var (a, b) = (1, 2);`, `var {age: a} = user;` (with class via getters), `final [first, ...rest] = list;`.
12. **Pattern trong switch statement** — `switch (val) { case (0, 0): ...; case (var x, var y) when x == y: ...; }`. Exhaustive với sealed.
13. **Switch expression** — đã giới thiệu ở chương 3, đây mở rộng với pattern phức tạp.
14. **If-case** — `if (val case (var x, _)) { ... }` — tests pattern match + bind.
15. **Sealed class + exhaustive switch** — pattern matching đầy đủ trên `sealed class Result`. Analyzer ép cover hết.
16. **Object pattern** — match shape: `Point(:var x, :var y) when x == y`.
17. **Wildcard `_`** — `case (var x, _)` — bỏ qua phần tử.
18. **Tóm tắt: khi nào dùng feature nào?** — guideline cuối chương.

### Key concepts

- Generic giữ type safety, không phải boilerplate
- Extension thêm method "ảo" — không thay đổi class gốc
- Extension type khác extension: tạo type **mới** (chỉ compile-time), không phải thêm method
- Record = anonymous tuple/struct, structural equality
- Pattern matching = destructuring + type check + binding cùng lúc
- Sealed + switch = compiler-enforced exhaustiveness — chống bug "quên case"

### Code examples

1. `class Repository<T extends Entity>` với CRUD generic, instantiate `UserRepository extends Repository<User>`.
2. Extension `extension on int { String toVnd() => '$this VND'; }` — `1000.toVnd()`.
3. Extension type `Email`: `extension type const Email(String value) { static Email? tryParse(String s) => s.contains('@') ? Email(s) : null; }`. Demo: `Email != String` ở compile time, nhưng `Email.value` access raw.
4. Record return multiple value: `(int, String) parseLine(String line) => (id, name);`.
5. Destructure tuple từ function: `var (id, name) = parseLine('1:viet');`.
6. Sealed `Result<T>` + switch exhaustive: `switch (r) { case Success(:var data): ...; case Failure(:var error): ...; }`.
7. If-case validate input: `if (json case {'name': String name, 'age': int age}) { ... }`.
8. Pattern + when guard: `switch (point) { case Point(:var x, :var y) when x == y: 'diagonal'; case Point(x: 0, :var y): 'on y-axis: $y'; default: 'normal'; }`.

### Visualizer / diagram

- Sơ đồ generic instantiation: `Box<int>` → compile time substitute T = int
- Bảng so sánh extension vs extension type
- Bảng so sánh record vs class (equality, mutability, method, identity)
- Cheat sheet pattern syntax: list pattern, map pattern, object pattern, record pattern
- Diagram "exhaustive switch with sealed": flowchart compiler check

### Bài tập (5)

1. Implement `class Stack<T>` với `push`, `pop`, `peek`, `isEmpty`, generic. Test với `Stack<int>` và `Stack<String>`.
2. Viết extension `extension DateTimeX on DateTime { bool get isToday => ...; bool get isYesterday => ...; String get relative => ...; }`. Test với 5 DateTime khác nhau.
3. Refactor function trả `Map<String, dynamic>` chứa 3 field thành function trả record `(String name, int age, bool premium)`. So sánh code caller.
4. Implement `sealed class ApiState<T>` với 4 case: `Idle`, `Loading`, `Success(T data)`, `Error(String message)`. Viết function `String describe(ApiState state)` dùng switch exhaustive.
5. Validate JSON với if-case: nhận `Map<String, dynamic>`, return `User?` nếu hợp lệ shape `{name: String, age: int}`. Không dùng `if/else` chain.

### Quiz (8)

1. `T first<T>(List<T> xs)` — gọi `first([1, 2, 3])` type là gì? — `int`. Inferred from argument.
2. Extension thêm method `toVnd` cho `int` — instance method gốc trùng tên thì sao? — Method gốc thắng. Extension không override.
3. Extension type `Email` runtime là gì? — Là `String` (boxing-free). Compile-time type khác.
4. `(1, 'a') == (1, 'a')` — `true` hay `false`? — `true`. Record equality structural.
5. `({int age, String name})` và `({String name, int age})` — same type? — Có. Named record so sánh theo tên + type, không thứ tự.
6. Sealed class trong file A, switch ở file B không cover hết case — analyzer cảnh báo không? — Có. Sealed enforce exhaustive.
7. `case Point(:var x, x: var y)` — viết khác `case Point(x: var x, y: var y)` không? — Đầu tiên sai cú pháp (`:var x` là named shorthand cho `x: var x`, không thể conflict). Câu trả lời tinh: `case Point(:var x, :var y)` tương đương `case Point(x: var x, y: var y)`.
8. Khi nào nên dùng record thay class? — Khi data tạm thời, không cần method, không cần identity stable, không có behavior. Đại diện: function trả nhiều giá trị.

### Connects to

- Tất cả Flutter chương dùng Generic class (`Bloc<E, S>`, `Provider<T>`, `Future<T>`)
- Flutter chương 7 (Bloc state class thường sealed cho exhaustive)
- Flutter chương 10 (parse JSON với pattern matching)

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Tổng kết outline Dart

### Bảng tổng số dòng dự kiến

| Chương | Tên | Ước lượng dòng |
|---|---|---|
| 1 | Hello Dart | 700-800 |
| 2 | Variables & Types | 800-900 |
| 3 | Functions & Control Flow | 900-1000 |
| 4 | Classes & Inheritance | 1000-1100 |
| 5 | Null Safety & Error Handling | 850-950 |
| 6 | Collections & Iterables | 900-1000 |
| 7 | Async, Future & Stream | 1100-1200 |
| 8 | Generics, Extension, Patterns | 1000-1100 |
| **Tổng** | | **~7250-8050 dòng HTML** |

### Phụ thuộc giữa các chương

```
1 → 2 → 3 → 4 → 5
            ↓
            6 → 7
                ↓
                8 (cần tất cả)
```

- Chương 1, 2, 3: linear, không skip được
- Chương 4: cần 2 + 3, mở rộng OOP (đã học pillar OOP)
- Chương 5: cần 2 + 4
- Chương 6: cần 2 + 3 + 5 (vì higher-order method dùng lambda)
- Chương 7: cần 3 + 5 + 6
- Chương 8: cần tất cả

### Các pattern xuyên suốt

1. **So sánh với JS/TS** — mỗi chương dành 1-2 callout cho user có nền JS.
2. **Mental model trước cú pháp** — mỗi feature mở đầu bằng "vì sao có".
3. **Code chạy được** — mọi example phải copy-paste vào DartPad là chạy.
4. **Linking forward** — chương 1-7 luôn nhắc trước cú pháp Dart 3 (records, patterns) sẽ giải thích đầy đủ ở chương 8.
5. **Linking ra Flutter** — cuối mỗi chương "Connects to Flutter" trỏ đến chương Flutter sẽ dùng kiến thức.

### Quyết định locked (2026-05-19)

User đã chốt 6 quyết định:

1. **Scope 8 chương** — giữ nguyên. Cân đối, mỗi chương đủ 1 concept lớn.
2. **Thứ tự** — Iterable (ch.6) trước Async (ch.7). Lý do: higher-order method (`map`, `where`, `fold`) là nền cho Stream transform.
3. **Isolate depth** — chỉ giới thiệu ngắn ở ch.7 (`compute` + `Isolate.spawn`). Use case hiếm trong app thường, không cần đậm.
4. **Class modifier Dart 3** — gộp vào chương 4 như outline hiện tại. Tự nhiên — biến thể của khai báo class.
5. **DartPad** — **embed iframe** vào HTML chương để chạy code inline, không phải link out. Yêu cầu shared CSS/JS hỗ trợ.
6. **Đáp án bài tập** — viết collapsible (`<details><summary>Gợi ý đáp án</summary>...`) ở cuối chương. Reveal-on-click, không spoil.

Sau khi outline Dart locked → FLUTTER-OUTLINE.md (15 chương) → Phase 2 build CSS theme + index.html + bắt đầu HTML chuong1.html.
