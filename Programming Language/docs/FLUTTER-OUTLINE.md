# Flutter Curriculum — Outline chi tiết 15 chương

**Sub-pillar:** Flutter (thuộc Programming Language pillar — trụ cột 9 của IT Basic)
**Số chương:** 15
**Phiên bản Flutter target:** Flutter 3.22+ (Dart 3 mặc định, Material 3 mặc định, Impeller renderer)
**Started:** 2026-05-19
**Status:** Outline phase — chờ user approve trước khi viết HTML content
**Prerequisite curriculum:** đã học xong 8 chương Dart trước khi vào Flutter

## Mục đích của file này

Tương tự `DART-OUTLINE.md` — đây là **spec chi tiết** cho 15 chương Flutter. Khi sang Phase 2, mỗi chương là mở rộng outline tương ứng.

Mỗi chương gồm 11 mục: Mục tiêu, Lý do học, Prerequisites, Sections, Key concepts, Code examples, Visualizer/diagram, Bài tập, Quiz, Connects to, Ước lượng độ dài.

## Triết lý chung của curriculum Flutter

1. **Build mental model trước cú pháp** — Flutter có 3 mental model lớn (everything is a Widget, constraints flow down sizes flow up, declarative UI). Không nắm mental model thì code Flutter cứ thấy lạ mãi.
2. **Material 3 first** — không dạy Material 2 syntax cũ (`primarySwatch`, etc.). Material 3 là mặc định Flutter 3.16+.
3. **Theming nghiêm túc** — mỗi chương ví dụ phải tuân theo `ThemeData` thay vì hardcode color/size — đây là pattern bắt buộc thực tế.
4. **State management khách quan** — 3 chương riêng cho `setState`+`InheritedWidget`, `flutter_bloc`, và `Provider`/`Riverpod`/`GetX`. Không bias một thư viện — so sánh tradeoff thực tế, cho user tự chọn.
5. **Testing là first-class** — chương 14 không phải optional. Mọi feature dạy đều có pattern test tương ứng.
6. **Hot reload là superpower** — mỗi ví dụ phải tận dụng hot reload, có note khi nào hot reload không đủ và cần hot restart.
7. **Performance awareness từ đầu** — không dồn vào chương 15. Mỗi chương có "Performance note" nếu pattern có pitfall (vd `Opacity` widget rebuild expensive).

---

## Chương 1 — Flutter Setup

### Mục tiêu chương

- Cài Flutter SDK (qua `fvm` recommended) trên macOS
- Setup Android Studio + Xcode + iOS Simulator + Android Emulator
- Chạy `flutter doctor` và fix mọi warning
- Tạo project Flutter mới, hiểu cấu trúc folder sinh ra
- Chạy app trên iOS Simulator, Android Emulator, Chrome (Web), và macOS desktop
- Hiểu hot reload vs hot restart vs full rebuild
- Setup VS Code / Android Studio cho Flutter dev (extension, debugger)
- Hiểu `pubspec.yaml` Flutter vs Dart console

### Lý do học

Chương "lên xe" cho cả phần Flutter. Setup sai chỗ này thì 14 chương sau toàn debug môi trường thay vì học framework. Đặc biệt iOS Simulator/Xcode rất hay vướng — chương này dành nhiều section cho troubleshooting thực tế.

### Prerequisites

- Toàn bộ Dart curriculum (8 chương)
- Đã cài Xcode (macOS), Android Studio
- Quen terminal

### Sections

1. **Flutter là gì** — Lịch sử (Google 2017), kiến trúc 3 layer (Framework Dart / Engine C++ / Embedder platform-specific), cross-platform: iOS, Android, Web, macOS, Linux, Windows. So sánh ngắn với React Native, Native iOS/Android.
2. **Cài Flutter — qua FVM recommended** — `fvm` (Flutter Version Manager) cho phép switch version theo project, không cần global Flutter. Cài: `brew install fvm`, `fvm install stable`, `fvm global stable`. Lý do dùng FVM thay vì cài Flutter raw.
3. **Cài Flutter — raw method** — fallback nếu không dùng FVM: tải SDK, set PATH. Document đầy đủ để user biết khi cần.
4. **Setup iOS toolchain** — Xcode từ Mac App Store, mở Xcode 1 lần để accept license, `sudo xcodebuild -runFirstLaunch`, install CocoaPods qua `sudo gem install cocoapods`.
5. **Setup Android toolchain** — Android Studio, SDK Manager (cài API 34+), accept license `flutter doctor --android-licenses`, tạo AVD emulator.
6. **`flutter doctor`** — đọc output line by line, fix mọi `[!]` warning. Bảng troubleshoot 10 lỗi phổ biến.
7. **IDE setup** — VS Code: extension `Dart` + `Flutter` + `Awesome Flutter Snippets`, settings recommended (format on save, bracket pair). Android Studio: plugin Flutter + Dart.
8. **Tạo project đầu tiên** — `flutter create hello_flutter`. Cấu trúc folder: `lib/`, `test/`, `android/`, `ios/`, `web/`, `macos/`, `linux/`, `windows/`, `pubspec.yaml`, `analysis_options.yaml`. Giải thích mục đích từng folder.
9. **`pubspec.yaml` Flutter** — khác với Dart console: thêm `flutter:` section, asset/font declaration. Demo add 1 package từ pub.dev.
10. **Chạy app** — `flutter run` chọn device, `flutter run -d chrome`, `flutter run -d macos`. Multi-device: chạy đồng thời cùng app trên 2 device.
11. **Hot reload vs hot restart** — Hot reload: rebuild widget tree giữ state (R key). Hot restart: clear state, rerun main (Shift+R). Full rebuild: kill + run lại (cần khi đổi native config, asset, font).
12. **DevTools** — `flutter run` mở link DevTools, intro: Widget Inspector, Performance, Network, Logging. Sẽ deep dive ở chương 15.
13. **Build mode** — Debug (default), Profile, Release. Khi nào dùng cái nào.
14. **Quản lý version Flutter qua FVM** — `fvm use 3.22.0` per project, commit `.fvmrc` để team sync version.

### Key concepts

- FVM > global Flutter — quan trọng cho multi-project
- `flutter doctor` phải sạch trước khi học tiếp
- Hot reload không phải hot restart — nắm rõ khi nào nào cái nào
- Mỗi platform native folder (`ios/`, `android/`) là project native thực sự — có thể mở Xcode/Android Studio riêng để tweak

### Code examples

1. Command tạo project: `flutter create --org com.example.it_basic hello_flutter --platforms=ios,android,macos,web`
2. `pubspec.yaml` đầy đủ với assets, fonts, dependencies
3. `flutter doctor -v` output mẫu (đã pass) — annotate từng dòng
4. `lib/main.dart` của Flutter create — phân tích từng dòng (import, void main, MaterialApp, Scaffold, Text)
5. FVM workflow: `.fvmrc` file commit, team mới clone repo `fvm install` tự cài version chuẩn

### Visualizer / diagram

- Sơ đồ 3 layer Flutter: Framework (Dart) / Engine (C++/Skia/Impeller) / Embedder (iOS Swift, Android Kotlin)
- Flow diagram: source code → flutter run → JIT compile → push to device → Engine render → screen
- Bảng so sánh hot reload vs hot restart vs full rebuild: khi nào trigger, giữ state?, thời gian
- Cheat sheet `flutter` CLI top 15 lệnh thường dùng

### Bài tập (5)

1. Cài Flutter qua FVM, chạy `flutter doctor`, screenshot kết quả tất cả check pass.
2. Tạo project `it_basic_demo` với `flutter create`, chạy trên 3 device khác nhau (iOS Simulator, Android Emulator, Chrome), screenshot cả 3.
3. Sửa `lib/main.dart` đổi `'Flutter Demo Home Page'` thành tên bạn, hot reload, screenshot.
4. Cài package `cupertino_icons` (đã có) và `flutter_svg`. Chạy `flutter pub get`, kiểm tra `pubspec.lock`.
5. Mở project Flutter trong Xcode (`open ios/Runner.xcworkspace`), xem cấu trúc native iOS project. Đổi tên app hiển thị (Display Name) thành "Hello VN" trong Info.plist.

### Quiz (8)

1. `flutter doctor` báo `[!] Xcode - develop for iOS and macOS` — nguyên nhân phổ biến? — Xcode chưa cài đầy đủ Command Line Tools hoặc chưa accept license. Fix: mở Xcode 1 lần + `sudo xcodebuild -license accept`.
2. Hot reload không apply được change — chuyện gì thường xảy ra? — Đổi field/constant top-level, đổi enum, đổi `main()`, đổi global state init. Cần hot restart.
3. `flutter create` mặc định include platforms nào? — Tất cả nếu đã enable: iOS, Android, Web, macOS, Linux, Windows.
4. FVM khác `asdf-flutter` ở điểm? — Cả 2 đều version manager. FVM Flutter-specific với better symlink. asdf đa ngôn ngữ.
5. Mode `release` build chạy được hot reload không? — Không. Hot reload chỉ debug mode.
6. `pubspec.yaml` thêm `assets/images/` — Flutter biết file gì trong đó? — Chỉ file mình liệt kê hoặc folder kết thúc `/` (Flutter include hết).
7. iOS app có dùng được `flutter pub get` thay cho `pod install` không? — Không hoàn toàn. `flutter pub get` cập nhật Dart deps. iOS native deps cần `cd ios && pod install` (thường Flutter tự gọi sau pub get).
8. `flutter run` không thấy device nào — đầu tiên check gì? — `flutter doctor`, sau đó `flutter devices`, sau đó: simulator chưa mở (Android emulator/iOS Simulator), USB device chưa enable debugging.

### Connects to

- Mọi chương Flutter sau — assume `flutter run` chạy được
- Dart chương 1 (`dart` CLI vs `flutter` CLI)

### Ước lượng độ dài

~800-900 dòng HTML (đặc setup + troubleshooting).

---

## Chương 2 — Widget Tree & First App

### Mục tiêu chương

- Hiểu mental model "everything is a Widget" — kể cả padding, margin, alignment
- Phân biệt StatelessWidget vs StatefulWidget — khi nào dùng cái nào
- Hiểu vòng đời `build()` method và rebuild trigger
- Sử dụng `MaterialApp`, `Scaffold`, `AppBar`, `Text`, `Container`, `Center` cơ bản
- Hiểu khái niệm Widget Tree, Element Tree, RenderObject Tree (3 cây)
- Sử dụng `setState` cho local state
- Biết widget thường dùng: Image, Icon, ElevatedButton, TextButton, Card, ListTile

### Lý do học

Đây là chương **mental model cốt lõi nhất** của Flutter. Hiểu sai chỗ này thì 13 chương sau lệch hết. "Everything is a Widget" không phải slogan — phải nội hóa: padding là widget, margin là widget, even visibility là widget.

### Prerequisites

Chương 1 (Setup). Dart curriculum (đặc biệt class, named param required).

### Sections

1. **Mental model: Everything is a Widget** — vì sao Flutter chọn cách này. So sánh với HTML/CSS (style là attribute) hoặc SwiftUI (modifier). Tradeoff: composition mạnh, code dài hơn 1 chút.
2. **Widget Tree là gì** — UI là một function của state, return tree of Widget. `runApp(MyApp())` đẩy root widget vào engine.
3. **3 cây của Flutter** — Widget Tree (immutable spec), Element Tree (mutable instance giữa Widget và RenderObject), RenderObject Tree (real layout/paint). Chỉ giới thiệu, đi sâu ở chương 13.
4. **StatelessWidget** — extends, override `build(BuildContext context) → Widget`. Immutable. Khi nào dùng: UI thuần, không state riêng.
5. **StatefulWidget** — extends. Cần 2 class: `StatefulWidget` (immutable config) + `State<T>` (mutable state, có `setState`). Vòng đời `State`: `initState` → `build` → `didUpdateWidget` → `dispose`.
6. **`setState(() { ... })`** — gọi để báo "state đã đổi, rebuild đi". Bên trong callback đổi field state. Không gọi setState async sau dispose.
7. **MaterialApp & Scaffold** — `MaterialApp`: wrap app với theme, navigator, localization. `Scaffold`: skeleton 1 page (appBar, body, floatingActionButton, drawer, bottomNavigationBar).
8. **Widget hiển thị cơ bản** — `Text`, `Icon`, `Image.network`, `Image.asset`, `Container` (box với decoration), `SizedBox` (size cố định), `Padding`, `Center`.
9. **Widget interactive cơ bản** — `ElevatedButton`, `TextButton`, `IconButton`, `OutlinedButton`. Property `onPressed: null` để disable.
10. **BuildContext là gì** — handle vào Element Tree. Dùng để: lookup ancestor (`Theme.of(context)`), navigation, show snackbar.
11. **Key — phần lớn dùng implicit** — `ValueKey`, `ObjectKey`, `UniqueKey`. Khi nào cần (list reorder), khi nào không cần (đa số). Giới thiệu, deep dive ở chương 13.
12. **Counter app cổ điển** — đi từ default `flutter create` tới hiểu mọi dòng. Pattern setState.
13. **Cờ rebuild — `const` constructor** — `const Text('hi')` tránh rebuild widget khi parent rebuild. Lint rule khuyến khích.
14. **Widget vs Element vs RenderObject — table** — 3 vai trò, ai làm gì.

### Key concepts

- StatelessWidget không phải "không có state" — chỉ là state không thuộc widget này (có thể ở parent)
- `build()` có thể gọi nhiều lần — phải pure, không side effect
- `setState` schedule rebuild ở frame tiếp theo, không sync
- `BuildContext` thay đổi theo vị trí widget trong tree — không lưu vào field, dùng trong scope
- `const` constructor là performance hint chính

### Code examples

1. Counter app từ `flutter create` — phân tích từng dòng
2. Stateless `Greeting(String name)` widget
3. Stateful `Counter` widget với increment/decrement/reset
4. So sánh widget với `const` và không — đo rebuild count qua Flutter Inspector
5. Sử dụng `Container` với `decoration: BoxDecoration(color, borderRadius, boxShadow)` — recreate một card đơn giản
6. List of `Text` widget với `Column(children: [...])`
7. `Image.network` với placeholder + error builder

### Visualizer / diagram

- Diagram "Widget Tree" của Counter app: MaterialApp → Scaffold → AppBar + Body (Column → Text + Counter + Buttons)
- Sơ đồ Widget vs Element vs RenderObject: 3 tree song song, mỗi level mapping
- State lifecycle diagram: `createState` → `initState` → `didChangeDependencies` → `build` ↔ `setState` → `didUpdateWidget` → `dispose`
- Bảng StatelessWidget vs StatefulWidget: khi nào, signature, rebuild trigger

### Bài tập (5)

1. Recreate màn hình profile đơn giản (avatar tròn + name + email + 3 stat: posts/followers/following) — chỉ widget cơ bản, không cần state.
2. Viết `Counter` widget có 3 button: +1, -1, reset. Hiển thị giá trị hiện tại với `Text`.
3. Refactor counter dùng `const` cho widget không phụ thuộc state — bao nhiêu widget convert được? Bao nhiêu không?
4. Viết stateful widget `Clock` hiển thị thời gian hiện tại, dùng `Timer.periodic` trong `initState`, cancel ở `dispose`. (Chương 7 Dart đã dạy Timer/Stream.)
5. Tạo widget `WelcomeCard(name, role)` stateless với `Card` chứa avatar + 2 text. Sử dụng `BoxDecoration` cho avatar tròn.

### Quiz (8)

1. Stateful widget cần 2 class — vì sao? — Để widget config immutable (có thể `const`), nhưng state mutable. Framework swap state khi widget tree thay đổi.
2. `build()` gọi nhiều lần — có ổn không? — Có. Build phải pure, không side effect (đừng `Future.delayed` trong build).
3. `setState(() { fetch(); })` — bug ở đâu? — `setState` chỉ để đổi state. Fetch nên ngoài, sau đó setState với kết quả.
4. `const SizedBox(height: 16)` và `SizedBox(height: 16)` — runtime khác gì? — `const` canonicalize, 2 lần dùng cùng instance. Tránh rebuild waste.
5. `BuildContext` có thể truyền vào async function rồi dùng sau `await` không? — Cẩn thận: nếu widget unmount giữa chừng, context không còn hợp lệ. Check `if (!mounted) return;` trước khi dùng context sau await.
6. Widget có Key — vai trò chính là gì? — Giúp Flutter reconcile (match widget mới với element cũ) khi tree đổi shape, đặc biệt list reorder.
7. Scaffold cần thiết cho mọi page Flutter không? — Không bắt buộc, nhưng cung cấp skeleton (appBar, body, FAB, drawer). Bỏ qua cũng được, dùng `Container` thuần.
8. Khác biệt `Image.network(url)` và `Image.asset(path)`? — Network từ URL (cần permission internet, có placeholder/error builder), asset từ file local declare trong `pubspec.yaml`.

### Connects to

- Toàn bộ Flutter từ chương 3 trở đi — phải nắm "everything is widget"
- Chương 6 (setState pattern + lifting state up)
- Chương 13 (3 tree deep dive)

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 3 — Layout System

### Mục tiêu chương

- Hiểu mental model: "Constraints flow down, Sizes flow up, Parent positions"
- Sử dụng `Row`, `Column` với `MainAxisAlignment`, `CrossAxisAlignment`
- Sử dụng `Expanded`, `Flexible`, `Spacer` cho responsive layout
- Sử dụng `Stack` + `Positioned` cho overlap
- Sử dụng `Container`, `Padding`, `SizedBox`, `Align`, `Center`
- Sử dụng `ConstrainedBox`, `LimitedBox`, `FractionallySizedBox`
- Debug layout với `debugPaintSizeEnabled = true` và Flutter Inspector
- Hiểu khi nào widget bị "unbounded constraint" lỗi

### Lý do học

Layout là **chương debug nhiều nhất** của Flutter dev. 80% error message Flutter là về constraint/size — không hiểu mental model thì cứ try-and-error mãi. Đặc biệt error "RenderFlex overflowed by X pixels" hay "Vertical viewport was given unbounded height" — gặp mỗi tuần.

### Prerequisites

Chương 2 (widget tree, BuildContext).

### Sections

1. **Mental model constraint** — quy tắc 3 dòng: (1) Parent pass constraint xuống child, (2) child pick size trong constraint trả lên, (3) parent position child. Code mẫu cho từng bước.
2. **BoxConstraints** — minWidth, maxWidth, minHeight, maxHeight. Tight (min == max) vs loose. Bounded vs unbounded.
3. **`Row` và `Column`** — flex axis. `mainAxisAlignment` (axis dài), `crossAxisAlignment` (axis ngắn). Defaults.
4. **`Expanded` và `Flexible`** — chỉ dùng trong Row/Column/Flex. `Expanded` = `Flexible(fit: tight)`. Flex factor để chia tỷ lệ.
5. **`Spacer`** — `Expanded(child: SizedBox())` shorthand. Push other widget sang lề.
6. **`Stack` và `Positioned`** — overlap children. Default alignment: top-left. `Positioned.fill`, `Positioned(left, top, ...)`.
7. **`Container` là composite widget** — kết hợp Padding + ColoredBox + DecoratedBox + ConstrainedBox + Align + Transform. Lý do "Container" rất hay dùng — nó là kitchen sink.
8. **`SizedBox`** — fixed size. Common: `SizedBox(height: 16)` cho spacing.
9. **`Padding` & `EdgeInsets`** — `EdgeInsets.all(16)`, `EdgeInsets.symmetric(horizontal: 16, vertical: 8)`, `EdgeInsets.only(left: 8)`, `EdgeInsets.fromLTRB(...)`.
10. **`Center`, `Align`** — Center là Align(alignment: Alignment.center). Alignment values.
11. **`ConstrainedBox`, `LimitedBox`** — apply constraint thêm cho child. `LimitedBox` chỉ áp dụng khi parent unbounded.
12. **`FractionallySizedBox`** — width/height theo % parent.
13. **`AspectRatio`** — giữ tỷ lệ. Useful cho image, video.
14. **`IntrinsicHeight`, `IntrinsicWidth`** — performance warning, dùng cẩn thận. Compute pass extra.
15. **Lỗi phổ biến + cách fix:**
    - "RenderFlex overflowed by X pixels" → wrap với Expanded/Flexible, hoặc đổi sang SingleChildScrollView
    - "Vertical viewport was given unbounded height" → Column trong scrollable không có constraint, wrap với `Container(height: ...)` hoặc dùng `shrinkWrap: true`
    - "Cannot use Expanded outside a Flex" → Expanded chỉ dùng trong Row/Column/Flex
16. **Debug layout** — `debugPaintSizeEnabled = true` (vẽ box overlay). Flutter Inspector "Select widget" mode.

### Key concepts

- Constraint flow là **luật vật lý** Flutter — không vi phạm được
- `Row`/`Column` ưu tiên size dài theo axis chính
- `Expanded` "ngốn" remaining space — chỉ trong Flex parent
- `Stack` không bound — children có thể overflow visible
- `Container` là kitchen sink, không phải primitive — biết khi tách

### Code examples

1. Trace constraint flow qua `Center(child: Container(width: 100, height: 100, color: red))` — bước-bước.
2. `Row` 3 elements với flex 1:2:1 dùng `Expanded(flex: ...)`.
3. Card với avatar trái + 2 text giữa (expanded) + chevron phải.
4. Stack: image background + Positioned title bottom-left + heart icon top-right.
5. Recreate Instagram post layout: header (avatar + username + more icon), image full-width 1:1 aspect, action bar (like, comment, share, save), caption.
6. Debug case: `Row(children: [Text('long text...' * 100)])` — overflow → wrap với `Expanded`/`Flexible` để fix.
7. `IntrinsicHeight` use case: 2 column cao bằng nhau (mặc dù content khác).

### Visualizer / diagram

- Animation "Constraints flow down, Sizes flow up" — diagram 3 step
- Bảng BoxConstraints: tight vs loose, bounded vs unbounded, 4 cell với ví dụ
- Diagram Row với 3 child flex 1:2:1 — split visual
- Stack alignment grid: 9 alignment values với example
- EdgeInsets visualizer: `all`, `symmetric`, `only`, `fromLTRB` side-by-side

### Bài tập (5)

1. Recreate Twitter card layout (avatar + name + handle + text + actions row) — chỉ dùng widget chương 3.
2. Build responsive 2-column layout: nếu width > 600 thì 2 column 1:1, ngược lại 1 column. (Dùng `LayoutBuilder` — sẽ học sau, có thể prep ở đây.)
3. Stack: tạo profile header với background gradient + avatar center bottom (50% chìm dưới header).
4. Debug case: cho code có overflow, tìm lỗi và fix 3 cách khác nhau (Expanded, SingleChildScrollView, FittedBox).
5. Build pricing card 3 plan side-by-side dùng Row + Expanded + Card.

### Quiz (8)

1. `Expanded` dùng ngoài Row/Column được không? — Không. Lỗi runtime "Expanded must be a descendant of a Flex".
2. `Row` mà children tổng > viewport — chuyện gì? — Overflow error. Fix: Expanded/Flexible cho 1 child, hoặc wrap trong scrollable.
3. `mainAxisAlignment` của Row là trục nào? — Trục ngang (horizontal). Của Column là dọc.
4. `Container(width: 200)` trong parent constraint tight (size cố định 100) — kết quả width? — 100. Parent constraint thắng.
5. `Stack` default alignment là gì? — `AlignmentDirectional.topStart` (top-left ở LTR locale).
6. `Padding(padding: EdgeInsets.all(8), child: ...)` ≈ `Container(padding: ...)` — khác gì performance? — Tương đương. `Padding` đơn lẻ rẻ hơn `Container` (Container compose nhiều thứ).
7. `Flexible(flex: 2)` và `Expanded(flex: 2)` khác gì? — `Expanded` = `Flexible(fit: FlexFit.tight)`. Flexible default `loose` — child có thể nhỏ hơn space cấp.
8. Lỗi "Vertical viewport was given unbounded height" — nguyên nhân? — Đặt scrollable (ListView, GridView) trong Column không có constraint height. Fix: `Expanded`, `SizedBox(height: ...)`, hoặc `shrinkWrap: true` (cẩn thận performance).

### Connects to

- Chương 4 (Theming dùng layout) , 5 (Navigation layout per page)
- Chương 9 (Form layout)
- Chương 13 (RenderObject — deep dive constraint)

### Ước lượng độ dài

~1100-1200 dòng HTML (chương lớn nhất phần đầu, nhiều diagram).

---

## Chương 4 — Material vs Cupertino, Theming

### Mục tiêu chương

- Phân biệt Material (Android-style) vs Cupertino (iOS-style)
- Sử dụng `ThemeData` Material 3 với `ColorScheme.fromSeed`
- Hiểu các text style: `displayLarge`, `headlineMedium`, `bodyLarge`, `labelSmall`
- Apply theme trên widget qua `Theme.of(context).colorScheme.primary`
- Dark mode: `ThemeMode.system`, define cả `theme` và `darkTheme`
- Custom theme extension cho semantic color không có trong Material spec
- Typography Material 3 với Google Fonts package
- Custom CupertinoTheme cho phần iOS-style

### Lý do học

App Flutter thường ship ít nhất iOS + Android, theme đúng cách tránh hardcode `Color(0xFF...)` rải khắp. Pattern theme đúng = tap-into design system một chỗ, đổi 1 line đổi toàn app. Đây là cú khá khó cho dev mới — đa số viết Flutter đầu đời hardcode color hết.

### Prerequisites

Chương 2, 3 (widget cơ bản, layout).

### Sections

1. **Material vs Cupertino — chọn cái nào?** — Material thường: cross-platform, look giống nhau iOS/Android (Google's design). Cupertino: iOS-only look (Apple's design). Mix: dùng Material làm khung, swap component sang Cupertino chỉ ở iOS — phức tạp.
2. **`MaterialApp` properties chính** — `theme`, `darkTheme`, `themeMode`, `home`, `routes`, `onGenerateRoute`, `localizationsDelegates`.
3. **Material 3 (vs Material 2)** — M3 là mặc định từ Flutter 3.16+. Khác biệt visual: dynamic color, larger components, new typography scale.
4. **`ColorScheme.fromSeed`** — Material 3 way: cho 1 seed color, tạo 25+ color slot tự động. `primary`, `secondary`, `tertiary`, `surface`, `error`, `inverseSurface`, etc.
5. **`ThemeData` đầy đủ** — colorScheme, textTheme, useMaterial3, brightness, appBarTheme, cardTheme, elevatedButtonTheme, inputDecorationTheme.
6. **Text theme — 15 style của Material 3** — `displayLarge/Medium/Small`, `headlineLarge/Medium/Small`, `titleLarge/Medium/Small`, `bodyLarge/Medium/Small`, `labelLarge/Medium/Small`. Bảng size + weight default.
7. **Apply theme trong widget** — `Theme.of(context).colorScheme.primary`, `Theme.of(context).textTheme.bodyLarge`. Tip: `colorScheme` shortcut.
8. **`google_fonts` package** — `GoogleFonts.inter()` trả TextStyle, `GoogleFonts.interTextTheme()` trả TextTheme. Apply vào ThemeData.
9. **Dark mode** — define cả `theme` và `darkTheme`, `themeMode: ThemeMode.system` để theo OS. Demo override `ThemeMode.dark` cho app force-dark.
10. **Custom Theme Extension** — Material không có "success" color built-in. Cách thêm: `ThemeExtension<MyColors>` với fields tùy ý. Use case: brand color không match Material slot.
11. **Cupertino theme** — `CupertinoApp` thay `MaterialApp`. `CupertinoThemeData` với `primaryColor`, `brightness`. Mix với Material: cần `MaterialApp(theme: ..., builder: (_, child) => CupertinoTheme(...))`.
12. **Adaptive widget** — `Switch.adaptive`, `CircularProgressIndicator.adaptive`, `Icons.adaptive` — render khác nhau iOS/Android. Khi nào dùng.
13. **Typography & font registration** — Custom font: download `.ttf`, declare trong `pubspec.yaml` `fonts:`. Then `TextStyle(fontFamily: 'Fraunces')`.

### Key concepts

- Theme = single source of truth — đừng hardcode color/textstyle
- Material 3 ColorScheme có 25+ slot — quên `primary`/`accent`/`background` cũ
- ThemeExtension là escape hatch khi Material slot không đủ
- Cupertino không thay thế Material — chỉ cho phần look iOS-only
- Adaptive widget switch tự động — không phải mọi widget có adaptive version

### Code examples

1. `ThemeData` với `useMaterial3: true` + `ColorScheme.fromSeed(seedColor: Colors.deepPurple)` + `GoogleFonts.interTextTheme`.
2. Light + Dark theme với `ColorScheme.fromSeed(brightness: Brightness.dark)` — toggle via button.
3. Sử dụng `Theme.of(context).colorScheme` trong widget custom thay vì hardcode.
4. `ThemeExtension<BrandColors>` với `success`, `warning`, `info` field. Tạo extension method để access dễ.
5. Apply Google Fonts (Inter body + Fraunces display) — `GoogleFonts.interTextTheme(Theme.of(context).textTheme)`.
6. Compare cùng button widget với `Theme.of` access vs hardcode color — show benefit khi swap theme.
7. `CupertinoApp` minimal với CupertinoNavigationBar, CupertinoButton.

### Visualizer / diagram

- Bảng 25 color slot Material 3 ColorScheme — color preview + use case
- Typography scale Material 3 — 15 style với size/weight
- Diagram: seed color → algorithm Material → 25 slot màu. Show 3 example seed (purple, teal, orange).
- Side-by-side: Material button vs Cupertino button — visual diff
- Theme override chain: MaterialApp theme → Theme widget override → component-level theme

### Bài tập (5)

1. Setup `ThemeData` cho app shop coffee: seed color brown, Google Fonts Manrope (body) + Lora (display). Apply vào MaterialApp.
2. Add ThemeExtension `CoffeeColors` với 5 custom color (espresso, latte, cappuccino, macchiato, mocha). Use trong card menu.
3. Implement toggle dark mode bằng `ValueNotifier<ThemeMode>` + button trong AppBar. Persistent qua `SharedPreferences` (sẽ học chương 11, có thể skip persistent ở đây).
4. Refactor 1 màn hình có hardcode color/textstyle thành dùng Theme.of(context).
5. Tạo widget `AppButton(label, onPressed)` đọc theme, support 3 variant: primary/secondary/text. Demo dùng 3 chỗ.

### Quiz (8)

1. Material 3 vs Material 2 — flag nào enable M3? — `useMaterial3: true` (default từ Flutter 3.16+).
2. `Colors.blue` vs `colorScheme.primary` — chênh ở đâu? — `Colors.blue` hardcode. `colorScheme.primary` follow theme — thay theme là đổi color.
3. ThemeExtension giúp gì? — Thêm custom field (vd success color) không có trong ColorScheme. Type-safe access qua `Theme.of(context).extension<MyExt>()`.
4. `GoogleFonts.inter()` chạy mạng — có ổn cho production không? — Mặc định fetch runtime. Production nên dùng `GoogleFonts.config.allowRuntimeFetching = false` + bundle font file.
5. `Switch.adaptive` khác `Switch` ở điểm? — Trên iOS render CupertinoSwitch (look iOS), Android render Material Switch.
6. ColorScheme `onPrimary` nghĩa là gì? — Color của content (text, icon) đặt **trên** background `primary`. Pair luôn đi cùng.
7. Theme đổi runtime — widget có rebuild không? — Có nếu widget dùng `Theme.of(context)`. `of` register dependency, theme đổi trigger rebuild.
8. CupertinoApp có Scaffold không? — Không, dùng `CupertinoPageScaffold`.

### Connects to

- Mọi chương Flutter tiếp theo — apply theme đúng cách
- Chương 12 (animation cũng dùng color from theme)

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 5 — Navigation

### Mục tiêu chương

- Phân biệt Navigator 1.0 (imperative) vs Navigator 2.0 (declarative)
- Sử dụng `Navigator.push`, `pop`, `pushNamed`, `pushReplacement`, `pushAndRemoveUntil`
- Pass data giữa screen qua constructor (push) và `Navigator.pop(result)` (pop)
- Named routes: `routes: { '/login': (ctx) => LoginPage() }`, `onGenerateRoute`
- `go_router` package (recommended cho production app)
- Deep linking + URL strategies cho Web
- Bottom navigation, drawer, tab bar
- Modal: dialog, bottom sheet, snackbar

### Lý do học

App thật luôn nhiều screen. Navigator 1.0 ổn cho project nhỏ nhưng vỡ ở deep link và Web URL. `go_router` là chuẩn industry hiện tại (Flutter team maintain). Chương này cover cả 2 + khi nào dùng cái nào.

### Prerequisites

Chương 2, 3, 4 (widget, layout, theme).

### Sections

1. **Navigator 1.0 — imperative stack** — Stack of routes. Push lên top, pop ra. So sánh với native iOS UINavigationController.
2. **`Navigator.push` + `MaterialPageRoute`** — `Navigator.push(context, MaterialPageRoute(builder: (ctx) => DetailsPage(item: item)))`. Pass data via constructor.
3. **`Navigator.pop` với return value** — `Navigator.pop(context, result)`. Caller: `final result = await Navigator.push(...)`.
4. **`pushReplacement`, `pushAndRemoveUntil`** — replace top (vd sau login), pop till predicate (logout về home).
5. **Named routes (Navigator 1.0)** — `MaterialApp(routes: {...}, initialRoute: '/')`. `Navigator.pushNamed(context, '/details')`. Pass data: `arguments:`.
6. **`onGenerateRoute`** — dynamic route generation, hữu ích khi route phụ thuộc parameter (vd `/user/:id`).
7. **`onUnknownRoute`** — fallback cho route không match (404).
8. **Pitfall Navigator 1.0** — không tự sync với URL Web, deep link cần custom logic, transition between tab phức tạp.
9. **Navigator 2.0 — declarative** — UI là function của route state. Tay-on phức tạp, nên dùng wrapper.
10. **`go_router`** — wrapper Navigator 2.0 do Flutter team maintain. URL-first, deep link out-of-the-box, type-safe nếu dùng generator.
11. **`go_router` cơ bản** — `GoRouter(routes: [GoRoute(path: '/', builder: ...)])`. `GoRoute` với nested route, `redirect`, `errorBuilder`.
12. **Pass data với go_router** — path param `/user/:id`, query param `/search?q=...`, extra (non-URL state).
13. **Auth flow với `redirect`** — kiểm tra logged-in, redirect về `/login` nếu chưa.
14. **ShellRoute** — wrap nested routes với layout chung (vd bottom nav). Nested navigation per tab.
15. **Bottom navigation bar** — `Scaffold(bottomNavigationBar: BottomNavigationBar(...))`. Pattern persistent vs replace-page.
16. **Drawer & EndDrawer** — `Scaffold(drawer: Drawer(...))`. Swipe gesture handling.
17. **TabBar + TabBarView** — top tab. Cần `DefaultTabController` hoặc `TabController` manual.
18. **Modal — Dialog** — `showDialog`, `AlertDialog`, `SimpleDialog`, `Dialog` custom.
19. **Modal — Bottom sheet** — `showBottomSheet` (persistent), `showModalBottomSheet` (modal). Drag handle, scrollable.
20. **SnackBar** — `ScaffoldMessenger.of(context).showSnackBar`. Khác với `Scaffold.of` cũ.
21. **Web URL strategies** — `setUrlStrategy(PathUrlStrategy())` — bỏ `#` trong URL. Cần thiết khi go_router + web.

### Key concepts

- Navigator 1.0 phù hợp app đơn giản, learning curve thấp
- Navigator 2.0 raw quá phức tạp — đa số dùng wrapper (go_router)
- `go_router` = chuẩn industry 2024+
- Bottom nav 2 cách: replace screen (mất history per tab) vs ShellRoute (giữ history per tab)
- ScaffoldMessenger là pattern mới (Flutter 1.22+), thay ScaffoldState cho snackbar

### Code examples

1. Navigator 1.0: Home → push DetailsPage(item), pop(true), Home nhận result.
2. Named routes setup với 5 page: home, list, detail, profile, settings.
3. `onGenerateRoute` với regex `/user/(\\d+)` parse id.
4. Migration từ Navigator 1.0 sang go_router — same app, đo dòng code thay đổi.
5. `go_router` với auth: `redirect` check token, route protect.
6. `ShellRoute` với 3 tab bottom nav, mỗi tab có nested screen riêng giữ history.
7. `showModalBottomSheet` với scrollable content + drag handle.
8. `AlertDialog` confirm delete với 2 button.

### Visualizer / diagram

- Stack visualization: push/pop animation với route stack growing/shrinking
- go_router tree of routes — nested visualization
- Diagram URL → route → widget với go_router
- Comparison table Navigator 1.0 vs 2.0 vs go_router: features, ease, web support, deep link
- ShellRoute concept: shell wrap inner routes, persistent navigation

### Bài tập (5)

1. Build app 3 screen: Home → List → Detail. Dùng Navigator 1.0 named routes. Pass item từ List → Detail qua arguments.
2. Migrate bài 1 sang go_router. Path: `/`, `/list`, `/list/:id`. URL Web hiển thị đúng `/list/42` khi xem item id=42.
3. Add ShellRoute với bottom nav 3 tab: Home, Profile, Settings. Mỗi tab có nested screen — switch tab giữ history.
4. Implement auth flow: chưa login → `/login`, login xong → `/home`. Logout → clear, redirect `/login`.
5. Show modal bottom sheet với form input → return data via pop. Caller hiển thị data trong snackbar.

### Quiz (8)

1. `Navigator.push` return type? — `Future<T?>` — complete khi route pop. `T` là type result truyền vào `Navigator.pop(result)`.
2. Pass data qua named route — dùng property nào? — `Navigator.pushNamed(context, '/details', arguments: item)`. Caller đọc qua `ModalRoute.of(context)!.settings.arguments`.
3. `pushReplacement` khác `pushAndRemoveUntil`? — Replace top route only. PushAndRemoveUntil pop nhiều route cho đến predicate match, push mới.
4. go_router path `/user/:id` — đọc `id` thế nào trong builder? — `(context, state) => UserPage(id: state.pathParameters['id']!)`.
5. URL strategy `PathUrlStrategy` bỏ gì? — Bỏ `#/` (hash routing) khỏi URL Web. Yêu cầu server config redirect 404 về index.html.
6. ShellRoute vs nested GoRoute thường? — ShellRoute persistent shell widget (vd bottom nav) xung quanh inner route. Nested GoRoute không có persistent shell, full screen swap.
7. `showSnackBar` mới — context vẫn cần Scaffold parent không? — Cần Scaffold ancestor, nhưng dùng `ScaffoldMessenger.of(context)` không bị "ScaffoldState not found" như cũ.
8. Modal bottom sheet scrollable — property nào? — `isScrollControlled: true` + `DraggableScrollableSheet` cho behavior drag.

### Connects to

- Chương 6+ (state management cần consistent across navigation)
- Chương 11 (persistent auth state — SharedPreferences)
- Chương 14 (test navigation flow)

### Ước lượng độ dài

~1200-1300 dòng HTML.

---

## Chương 6 — State Management: setState & InheritedWidget

### Mục tiêu chương

- Hiểu spectrum state: ephemeral (widget state) vs app state (across widget)
- Pattern "lifting state up" — khi child cần share state với sibling
- Sử dụng `setState` đúng nơi đúng chỗ
- Hiểu `InheritedWidget` — primitive cho share state trong tree
- Tự viết InheritedWidget custom + helper static `of(context)`
- `InheritedNotifier` — InheritedWidget với rebuild tự động khi notifier thay đổi
- Hiểu khi nào setState không đủ + cần đến package state management

### Lý do học

90% beginner Flutter dùng `setState` cho mọi thứ — đến app vừa lớn là vỡ. Chương này build mental model: state ở đâu, ai quản lý, ai consume. **Nắm chương 6 thì chương 7-8 (Bloc/Provider/Riverpod) dễ hiểu hơn nhiều** — vì 3 package đó đều dựa trên InheritedWidget.

Đây cũng là chương "không cần thư viện ngoài" — Flutter ship sẵn InheritedWidget. Học để biết "khi nào package vs khi nào tự viết".

### Prerequisites

Chương 2 (StatefulWidget, setState), Chương 7 Dart (Stream, ChangeNotifier ≈ pattern).

### Sections

1. **State spectrum** — Ephemeral state (counter trong widget) vs App state (user logged in, theme, cart). Khi nào dùng cái gì.
2. **Pattern 1: Local setState** — khi state chỉ một widget care. Counter, toggle, input controller. Đơn giản, đủ.
3. **Pattern 2: Lifting state up** — 2 sibling widget cần share state → move state lên parent chung, pass xuống qua constructor + callback. Demo: list + filter.
4. **Pattern lifting fail khi tree sâu** — pass state qua 5 widget chỉ vì 2 widget ở leaf cần. Boilerplate khủng.
5. **Cứu cánh: `InheritedWidget`** — primitive Flutter cho share state tới mọi descendant. Lookup qua `context.dependOnInheritedWidgetOfExactType<T>()`.
6. **`InheritedWidget` anatomy** — extends `InheritedWidget`, có field `data`, override `updateShouldNotify`. Static `of(context)` helper.
7. **Khi `updateShouldNotify` trả `true`** — descendant đang dùng `data` rebuild. Trả `false` khi data không thay đổi (vd 2 instance cùng nội dung).
8. **Pattern: InheritedWidget + StatefulWidget wrapper** — InheritedWidget immutable, không thay đổi data trực tiếp. Wrap với StatefulWidget bên ngoài, state ở đó, InheritedWidget tái tạo khi state đổi.
9. **`InheritedNotifier<T extends Listenable>`** — variant: InheritedWidget với notifier (ChangeNotifier hoặc ValueNotifier). Auto rebuild descendant khi notifier `notifyListeners()`.
10. **`ValueListenableBuilder` + `ValueNotifier`** — đơn giản nhất cho single value. Widget rebuild khi value change.
11. **`ChangeNotifier`** — multiple value, custom notify timing. Pattern: extends `ChangeNotifier`, gọi `notifyListeners()` khi state đổi. Dispose ở `dispose`.
12. **`AnimatedBuilder`** — rebuild khi Listenable notify. Generic version của ValueListenableBuilder.
13. **Pitfall: setState async after dispose** — `await ... ; setState(...)` mà widget unmount giữa chừng → throw. Fix: `if (!mounted) return;`.
14. **Khi nào setState không đủ?** — App state global (user, theme), state cross route (cart không reset khi pop), state phức tạp transaction (multiple updates atomic).
15. **Spoiler: 3 con đường tiếp theo** — Bloc (chương 7), Provider/Riverpod/GetX (chương 8). Mỗi cái build trên InheritedWidget.

### Key concepts

- State có scope — ephemeral / lifting up / inherited / global
- InheritedWidget là primitive, không phải package
- `context.dependOnInheritedWidgetOfExactType` register dependency — context "subscribe" to inherited
- `ChangeNotifier` không phải state management framework — chỉ là Listenable
- Lifting state up nhanh, nhưng càng sâu càng đau — đó là lý do có package

### Code examples

1. Counter local setState — chuẩn.
2. List + filter: lifting state up. Filter state ở parent, pass xuống FilterBar + ItemList.
3. Custom `ThemeInherited` widget — share theme mode toàn tree, không cần Provider.
4. `InheritedNotifier<ValueNotifier<int>>` cho counter global — increment ở screen A, screen B thấy.
5. `ValueNotifier<bool>` cho dark mode toggle, `ValueListenableBuilder` rebuild MaterialApp khi đổi.
6. `ChangeNotifier` cho `CartModel` với add/remove/total. Listener rebuild Cart UI.
7. Pitfall demo: async setState gây "setState called after dispose" — fix với mounted check.

### Visualizer / diagram

- State scope diagram: pyramid ephemeral → lifted → inherited → global
- Lifting state up animation: state di chuyển từ leaf lên common parent
- InheritedWidget descendant rebuild chain: data change → updateShouldNotify true → descendants using data rebuild
- ChangeNotifier flow: notify → listeners called → rebuild

### Bài tập (5)

1. Counter app với 2 sibling button (+1, -1) và 1 sibling text hiển thị value. Implement bằng lifting state up.
2. Implement `ThemeManager` qua InheritedNotifier + ValueNotifier<ThemeMode>. Toggle button ở 1 screen, theme đổi toàn app.
3. Build CartModel (ChangeNotifier) với add/remove/total. UI 2 screen: ProductList (add to cart), Cart (show items + total).
4. Refactor một widget có async fetch + setState gây "setState after dispose" → fix bằng mounted check.
5. Tự viết InheritedWidget `LocaleProvider` cho i18n manual (không dùng package). Đổi locale, mọi descendant Text rebuild.

### Quiz (8)

1. `setState` gọi ngoài State class — chuyện gì? — Compile error. `setState` là method protected của State.
2. InheritedWidget descendant không gọi `.of(context)` — có rebuild khi data đổi không? — Không. `.of` register dependency.
3. `updateShouldNotify` trả `false` — chuyện gì? — Descendant không rebuild dù data đổi (vì InheritedWidget bảo "không có gì mới").
4. `ChangeNotifier` cần dispose không? — Có, nếu có listener. Gọi `dispose()` để clear listener.
5. `ValueListenableBuilder` listener gọi build mấy lần khi value đổi? — 1 lần. Frame builder.
6. State bị reset khi navigate đi rồi back — vì sao? — StatefulWidget bị remove khỏi tree, state dispose. Cần lift state lên parent giữ qua navigation.
7. `mounted` field trả gì? — `false` sau dispose. Dùng kiểm tra trước setState sau async.
8. `InheritedWidget` mutate field thẳng được không? — Không, InheritedWidget immutable. Phải tái tạo instance mới qua StatefulWidget wrapper.

### Connects to

- Chương 7 (Bloc dựa trên InheritedWidget)
- Chương 8 (Provider/Riverpod là wrapper trên ChangeNotifier/Notifier)

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 7 — State Management: flutter_bloc Deep Dive

### Mục tiêu chương

- Hiểu mô hình BLoC: Event in, State out qua Stream
- Phân biệt Cubit vs Bloc — khi nào dùng cái nào
- Sử dụng `BlocProvider`, `BlocBuilder`, `BlocListener`, `BlocConsumer`
- Thiết kế State class theo pattern: sealed class với multiple state types
- Test Bloc/Cubit độc lập với widget
- `MultiBlocProvider` cho nested provider
- `BlocSelector` cho rebuild optimization
- Pattern repository → bloc → view

### Lý do học

`flutter_bloc` là 1 trong 3 thư viện state management lớn nhất ecosystem. Hợp cho app medium-large. Có 2 lý do chọn Bloc: (1) tách logic khỏi widget rõ ràng, (2) test logic dễ vì là pure Dart function của event/state.

Lưu ý: chương này tập trung 1 package `flutter_bloc`, không phải pattern BLoC tổng quát. Có opinion: dùng Cubit cho 90% case, Bloc khi cần event chain rõ ràng.

### Prerequisites

Chương 6 (state spectrum, InheritedWidget) — bắt buộc. Dart Chương 7 (Stream).

### Sections

1. **Pattern BLoC là gì** — Business Logic Component. Tách logic ra khỏi UI. Input: Event (Stream). Output: State (Stream). UI subscribe state stream.
2. **Cubit — variant đơn giản hơn** — không có Event class, chỉ method gọi trực tiếp `emit(newState)`. Recommended cho đa số case.
3. **Bloc — variant đầy đủ** — Event class, `on<EventType>((event, emit) => emit(newState))`. Khi nào cần Event explicit: replay event, log analytics, complex flow.
4. **Cài `flutter_bloc`** — `dart pub add flutter_bloc`. (Note: trong outline mention `flutter_bloc` không phải `bloc` — wrapper.)
5. **Counter Cubit example** — `class CounterCubit extends Cubit<int> { CounterCubit() : super(0); void increment() => emit(state + 1); }`.
6. **`BlocProvider`** — wrap subtree, expose Cubit/Bloc. Tương tự InheritedWidget. `BlocProvider(create: (_) => CounterCubit(), child: ...)`.
7. **`BlocBuilder<Cubit, State>`** — rebuild widget khi state đổi. Optional `buildWhen` filter.
8. **`BlocListener`** — không rebuild, chỉ chạy callback (snackbar, navigate). `listenWhen` filter.
9. **`BlocConsumer`** — combine Builder + Listener.
10. **`BlocSelector`** — rebuild chỉ khi selector output đổi. Optimization: nested state class, chỉ care 1 field.
11. **Read vs Watch** — `context.read<MyCubit>()` lấy reference, no rebuild. `context.watch<MyCubit>()` subscribe rebuild. Khi nào dùng cái nào (read trong onPressed, watch trong build).
12. **Sealed state class** — cho complex state: `sealed class AuthState`, với `Initial`, `Loading`, `Authenticated(User)`, `Unauthenticated`. Switch exhaustive trong BlocBuilder.
13. **MultiBlocProvider** — nested provider tránh pyramid: `MultiBlocProvider(providers: [BlocProvider(create: ...), ...])`.
14. **Repository pattern** — `BlocProvider<UserBloc>(create: (ctx) => UserBloc(repository: ctx.read<UserRepository>()))`. Bloc không gọi HTTP trực tiếp.
15. **Async event với Bloc** — `on<LoadEvent>((event, emit) async { emit(Loading()); try { final data = await repo.fetch(); emit(Loaded(data)); } catch (e) { emit(Error(e)); } });`.
16. **Test Bloc** — `bloc_test` package. `blocTest<CounterCubit, int>('emit 1 on increment', build: () => CounterCubit(), act: (c) => c.increment(), expect: () => [1]);`.
17. **Pitfall: Bloc closure capture stale state** — `emit(state + 1)` đúng vì `state` getter, không stale. Nhưng `emit(currentValue + 1)` với captured variable sai.

### Key concepts

- Bloc/Cubit là pure Dart — test không cần Flutter
- `context.read` cho callback, `context.watch` cho build
- Sealed state + exhaustive switch trong BlocBuilder = robust UI
- Repository → Bloc → View — tách tier rõ ràng
- Cubit > Bloc cho 90% case

### Code examples

1. CounterCubit + UI: BlocProvider + BlocBuilder.
2. Login flow Cubit: `LoginCubit` emit `Loading`, `Success(User)`, `Error(message)`. UI BlocConsumer hiển thị + navigate khi success.
3. AuthBloc với explicit event: `LoginPressed`, `LogoutPressed`, `TokenExpired`. `on<LoginPressed>((e, emit) async {...})`.
4. MultiBlocProvider wrap MaterialApp với 3 Cubit: AuthCubit, ThemeCubit, CartCubit.
5. Repository pattern: `UserRepository` interface, `UserRepositoryImpl` HTTP, `UserCubit(repo)` inject. Test Cubit với mock repo.
6. BlocSelector: rebuild chỉ khi `cart.totalItems` đổi, không khi `cart.totalPrice` đổi (cùng state class).
7. Test Cubit với bloc_test: load success + failure case.

### Visualizer / diagram

- Flow diagram: UI → Event → Bloc → State → UI
- Stream timeline: events `[Increment, Decrement, Reset]` → states `[0, 1, 0]`
- Bảng BlocBuilder/Listener/Consumer/Selector: rebuild yes/no, callback yes/no, use case
- Sealed state diagram: AuthState với 4 subclass, switch coverage

### Bài tập (5)

1. Counter app dùng Cubit. Add reset button. Test Cubit với bloc_test (3 case: initial, increment, reset).
2. Login flow: form 2 field (email, password) → Cubit emit Loading → mock delay 1s → emit Success hoặc Error. UI show loading spinner, error snackbar, navigate khi success.
3. Refactor bài 2 từ Cubit sang Bloc (explicit Event). So sánh code length + clarity.
4. Cart Bloc với event AddItem/RemoveItem/Clear. State có items list + total. Test với 5 scenario.
5. Auth global: MultiBlocProvider wrap app. AuthBloc emit Authenticated/Unauthenticated. Listener navigate khi state đổi.

### Quiz (8)

1. Cubit và Bloc khác chính ở điểm? — Cubit emit trực tiếp via method. Bloc qua event class + `on<E>` handler. Bloc verbose hơn nhưng explicit hơn cho event chain.
2. `context.read` rebuild widget không? — Không. Chỉ lấy reference.
3. `BlocSelector` so với `BlocBuilder` ở điểm? — Selector rebuild chỉ khi selector output (subset state) đổi. Builder rebuild mỗi state change.
4. State class nên là immutable hay mutable? — Immutable. Bloc compare oldState vs newState để decide rebuild (qua ==). Mutable thì == always true, không rebuild.
5. `emit(state)` (same instance) có rebuild không? — Không, nếu `==` true. Bloc skip emit cùng giá trị.
6. Sealed state + switch exhaustive — analyzer guarantee gì? — Mọi state case có UI handle. Thêm state mới mà quên handle ở UI → compile lỗi.
7. Bloc nên dispose không? — `BlocProvider` tự `close()` Bloc khi unmount. Mình tự tạo phải `close()` thủ công.
8. Test Bloc cần Flutter context không? — Không. Bloc thuần Dart, test trong Dart unit test.

### Connects to

- Chương 6 (BlocProvider build trên InheritedWidget)
- Chương 8 (so sánh Bloc vs Provider/Riverpod/GetX)
- Chương 10 (Bloc gọi repository → HTTP)
- Chương 14 (test Bloc + widget test)

### Ước lượng độ dài

~1200-1300 dòng HTML.

---

## Chương 8 — State Management: Provider, Riverpod, GetX

### Mục tiêu chương

- Provider: foundational wrapper trên InheritedWidget, recommended cho beginner
- Riverpod: provider 2.0, compile-time safe, không cần BuildContext
- GetX: all-in-one (state, navigation, DI, i18n) — popular ở VN/India, controversial
- Hiểu tradeoff mỗi thư viện
- Migrate Counter app qua 4 cách: setState, Provider, Riverpod, GetX — so sánh code
- Recommendation: khi nào chọn cái nào

### Lý do học

Sau chương 7 (Bloc), chương 8 cover 3 alternative phổ biến. Mục tiêu **không phải dạy hết 3 library**, mà cho user **đủ context để chọn** + đọc code mở của người khác.

Thực tế ở VN: Provider (legacy app), Riverpod (modern), GetX (legacy/team không có senior), Bloc (enterprise). Hiểu cả 4 = đọc được code ở bất kỳ team nào.

### Prerequisites

Chương 6 (InheritedWidget), Chương 7 (Bloc — để so sánh).

### Sections

1. **Provider — chính thức Flutter team trước Riverpod** — wrapper trên InheritedWidget + ChangeNotifier.
2. **`ChangeNotifierProvider`** — provide instance của ChangeNotifier subclass. `Provider.of<T>(context, listen: true/false)`.
3. **`Consumer<T>` widget** — pattern recommended thay `Provider.of(context)` trong build.
4. **`MultiProvider`** — nested provider tránh pyramid.
5. **`context.read<T>()` / `context.watch<T>()` / `context.select<T, R>(selector)`** — short helper.
6. **`Provider.value` vs `Provider`** — value để reuse existing instance, không tạo mới.
7. **Provider pros/cons** — pros: simple, official, ít magic. Cons: cần BuildContext, không compile-time safe (Provider<T> không tồn tại → runtime error).
8. **Riverpod — Provider 2.0** — same author (Remi Rousselet). Không cần BuildContext (truy cập qua `ref`). Compile-time safe.
9. **Riverpod providers** — `Provider<T>`, `StateProvider<T>`, `StateNotifierProvider`, `FutureProvider<T>`, `StreamProvider<T>`, `NotifierProvider` (modern), `AsyncNotifierProvider`.
10. **`ConsumerWidget` + `ConsumerStatefulWidget`** — replace StatelessWidget/StatefulWidget. Build có `WidgetRef ref`.
11. **`ref.watch(provider)` / `ref.read(provider)` / `ref.listen(provider, callback)`** — 3 cách access.
12. **AutoDispose & family** — `provider.autoDispose` dispose khi không ai watch. `provider.family<T, Param>` parameterized provider.
13. **Riverpod pros/cons** — pros: compile-time safe, không context, async first-class. Cons: learning curve cao hơn, codegen optional làm phức tạp.
14. **GetX — all-in-one** — state (GetxController) + navigation (Get.to) + DI (Get.put) + i18n + snackbar.
15. **GetX state** — `Obx(() => Text('${controller.count}'))` reactive. `RxInt`, `RxString`, `Rx<T>`.
16. **GetX navigation** — `Get.to(NextPage())`, `Get.back()` không cần context.
17. **GetX pros/cons** — pros: ít boilerplate, không cần context. Cons: maintainer history controversial, breaking change thường, "magic" làm test khó.
18. **Counter migration — 4 cách:** setState → Provider → Riverpod → GetX. Side-by-side comparison.
19. **Recommendation framework:**
    - Project nhỏ / solo / học: Provider hoặc Riverpod
    - Team có Bloc experience: Bloc
    - Team muốn modern + safety: Riverpod
    - Tránh: GetX cho code mới (lý do: maintainer track record)
    - Legacy app: dùng theo team đã chọn
20. **Hiểu code mở** — đọc code Bloc, Provider, Riverpod, GetX — recognize syntax + intent.

### Key concepts

- 4 thư viện đều là Listenable abstraction trên InheritedWidget
- Riverpod = compile-time safe Provider, no context
- GetX powerful nhưng controversial — avoid for new code
- Migration giữa các thư viện = mostly tìm-thay (search-replace) idiom
- Mỗi thư viện đều có "Consumer/Builder/Observer" pattern — chỉ khác tên

### Code examples

1. ChangeNotifierProvider Counter — same Counter từ Bloc chương 7.
2. Provider với multiple state (Auth + Theme + Cart) — MultiProvider wrap.
3. Riverpod Counter — `final counterProvider = StateProvider<int>((ref) => 0);`, `ref.read(counterProvider.notifier).state++`.
4. Riverpod async: `FutureProvider<User>` fetch user, UI subscribe via `ref.watch(userProvider).when(data: ..., loading: ..., error: ...)`.
5. GetX Counter: `class CountCtrl extends GetxController { var count = 0.obs; void inc() => count++; }`.
6. GetX navigation: `Get.toNamed('/detail', arguments: item)`. Compare go_router.
7. Side-by-side 4-way: same Counter, count code lines + complexity.

### Visualizer / diagram

- Comparison table 4 way: Bloc / Provider / Riverpod / GetX với 10 criteria (boilerplate, type-safe, async, test ease, popularity, maintainer, codegen, learning, performance, recommended use case)
- Decision tree: "Tôi nên chọn cái nào?" — flowchart
- Spectrum diagram: explicit (Bloc) → ergonomic (GetX)

### Bài tập (5)

1. Counter app với Provider. Add reset button. Test với widget test.
2. Migrate bài 1 từ Provider sang Riverpod. Đếm số dòng code thay đổi.
3. Migrate bài 1 sang GetX. So sánh syntax với 2 cách trên.
4. Đọc code mở 1 OSS Flutter app (vd `wonderous_app`, `Reflect`). Identify state management dùng. Mô tả pattern họ dùng.
5. Cho 1 use case (vd shopping cart cross-screen), chọn thư viện phù hợp + giải thích reasoning.

### Quiz (8)

1. Provider vs Riverpod — khác chính ở điểm? — Riverpod compile-time safe (provider không tồn tại → compile error). Provider runtime error. Riverpod không cần BuildContext.
2. GetX maintainer history controversial — vấn đề gì? — Breaking changes thường, semver lỏng lẻo, một số design choice gây argue về best practice (vd nav không context).
3. `context.watch<T>()` vs `Consumer<T>` — khác gì? — `watch` rebuild whole widget. `Consumer` rebuild chỉ subtree trong builder — performance hint nếu widget lớn.
4. Riverpod `autoDispose` làm gì? — Dispose provider khi không widget nào watch. Tránh memory leak.
5. `Provider.value` vs `Provider`? — `Provider` tạo mới (lifecycle managed). `Provider.value` reuse existing instance, không dispose.
6. GetX `Get.put(Controller())` rồi `Get.find<Controller>()` — pattern gì? — Service locator / DI. Tương tự `get_it` package.
7. Riverpod `family` modifier — use case? — Parameterized provider: `userProvider.family<User, int>((ref, id) => fetchUser(id))`. Mỗi id → instance riêng cache.
8. Bloc vs Provider vs Riverpod vs GetX — mỗi cái build trên Listenable. Tại sao có nhiều thư viện? — Khác philosophy: explicit vs ergonomic, type-safety vs simplicity, separation of concerns vs all-in-one. Mỗi team trade-off khác.

### Connects to

- Chương 6 (foundation), Chương 7 (Bloc)
- Chương 10 (state quản lý API call kết quả)
- Chương 14 (test với mỗi state lib khác)

### Ước lượng độ dài

~1100-1200 dòng HTML.

---

## Chương 9 — Forms & Input

### Mục tiêu chương

- Sử dụng `TextField` với controller, focus node, decoration
- `Form` + `FormField` + `TextFormField` cho validation
- Global form state với `GlobalKey<FormState>`
- Validation realtime vs on submit
- Custom FormField (vd date picker, dropdown custom)
- Focus management: TabIndex, FocusScope, dismiss keyboard
- Sử dụng `Autocomplete<T>` widget
- Sử dụng `DropdownButtonFormField`, `Checkbox`, `Switch`, `Radio`, `Slider`
- File picker, image picker (qua package)

### Lý do học

Form là use case hằng ngày (login, signup, profile edit, search). Flutter có 2 cách: `TextField` raw (control manual) hoặc `Form` + `TextFormField` (helper validation). Hiểu cả 2 — Form không phải lúc nào cũng phù hợp (vd realtime search bar không cần Form).

### Prerequisites

Chương 2, 3, 4. Bloc/Provider basic để biết quản lý state form.

### Sections

1. **`TextField` cơ bản** — onChanged, controller, focusNode, decoration, keyboardType, obscureText.
2. **`TextEditingController`** — control programmatic. `controller.text`, `controller.clear`, listener. Dispose ở `dispose`.
3. **`InputDecoration`** — labelText, hintText, prefixIcon, suffixIcon, errorText, helperText, border, fillColor.
4. **`FocusNode`** — `focusNode.requestFocus()`, `focusNode.unfocus()`. Dispose. `FocusScope.of(context).requestFocus(nextNode)` cho TAB-like flow.
5. **Keyboard types** — `TextInputType.emailAddress`, `phone`, `number`, `multiline`, `url`, `datetime`.
6. **Keyboard action** — `textInputAction: TextInputAction.next` / `done` / `search`. Callback `onSubmitted`.
7. **`Form` widget + `GlobalKey<FormState>`** — group multiple field, gọi `formKey.currentState!.validate()` / `save()` / `reset()`.
8. **`TextFormField` với validator** — `validator: (value) => value!.isEmpty ? 'Required' : null`.
9. **Realtime vs on-submit validation** — `autovalidateMode: AutovalidateMode.onUserInteraction`. Bảng 4 mode.
10. **Custom FormField** — extends `FormField<T>`. Use case: date picker, multi-select, image upload.
11. **`DropdownButtonFormField`** — dropdown trong form.
12. **Checkbox, Switch, Radio, Slider** — primitive input. Khi nào dùng Switch (toggle), Radio (mutual exclusive), Checkbox (multi select), Slider (continuous range).
13. **`Autocomplete<T>` widget** — suggestion dropdown khi gõ. `optionsBuilder`, `optionsViewBuilder`.
14. **Dismiss keyboard pattern** — `FocusScope.of(context).unfocus()` khi tap outside. Wrap với `GestureDetector(onTap: () => FocusScope.of(context).unfocus())`.
15. **Image picker** — package `image_picker`. Pick từ gallery/camera. Permission iOS (Info.plist).
16. **File picker** — package `file_picker`. Pick file generic. Permission Android.
17. **Date/Time picker** — `showDatePicker`, `showTimePicker`. Locale support.
18. **Pitfall: TextField rebuild khi parent rebuild** — controller state preserved (vì controller external), text input không reset. Còn `initialValue` của TextFormField chỉ apply lần đầu — nếu cần reset thì gọi `controller.text = ...`.

### Key concepts

- `TextField` không cần controller nếu chỉ dùng `onChanged`. Cần controller khi cần read/write programmatically.
- `Form` + `FormState` group validation — tiện cho nhiều field
- Validation function trả `null` = OK, trả `String` = error message
- Focus node để tab giữa field — UX cần
- Custom FormField cho domain-specific input

### Code examples

1. Login form: email + password + remember me + submit. `Form` + `GlobalKey<FormState>` + validator.
2. Signup form 5 field với confirm password (custom validator so sánh 2 field).
3. Search bar realtime với debounce (`Timer.periodic` hoặc package `rxdart`).
4. Profile edit form với image picker avatar + 5 text field + date picker birthday.
5. Custom `DatePickerFormField<DateTime>` extends FormField — reusable.
6. Autocomplete city name từ list 100 city VN.
7. Tap outside to dismiss keyboard pattern wrap.

### Visualizer / diagram

- Form lifecycle diagram: state → validate → save → submit
- FocusNode chain: 5 field tab-able
- Bảng AutovalidateMode: disabled / always / onUserInteraction / onUnfocus
- Keyboard type matrix: type → keyboard layout iOS/Android visual

### Bài tập (5)

1. Login form: email validate format `^[\w-]+@[\w-]+\.[\w-]{2,}$`, password ≥ 8 ký tự. Submit gọi mock API (delay 1s) → snackbar success/fail.
2. Multi-step signup form 3 page: account info → personal info → preferences. Giữ state qua page.
3. Custom FormField cho phone VN format (auto-format `0901-234-567`). Validate đầu số.
4. Search bar suggestion: gõ city, Autocomplete show dropdown. Debounce 300ms.
5. Form edit profile với avatar (image_picker), 4 text field. Pre-fill data hiện tại. Submit update.

### Quiz (8)

1. `TextField` không dispose controller — chuyện gì? — Memory leak.
2. `validator` trả `null` nghĩa là gì? — Field hợp lệ. Trả `String` = error message.
3. `formKey.currentState!.validate()` chạy validator của field nào? — Tất cả TextFormField/FormField descendant của Form.
4. AutovalidateMode default? — `disabled`. Chỉ validate khi gọi `validate()` thủ công.
5. TextField `obscureText: true` — input dạng nào? — Hiển thị `•`. Dùng cho password.
6. Tab giữa field — config gì? — `textInputAction: TextInputAction.next` + `onSubmitted: (_) => FocusScope.of(context).requestFocus(nextNode)`.
7. `image_picker` cần permission iOS — config ở đâu? — `ios/Runner/Info.plist`: `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`.
8. `Form` reset gọi method nào? — `formKey.currentState!.reset()`. Reset value + validation state.

### Connects to

- Chương 10 (form submit → HTTP)
- Chương 11 (form data persistent)
- Chương 14 (test form interaction)

### Ước lượng độ dài

~1100-1200 dòng HTML.

---

## Chương 10 — Network: HTTP, Dio, Retrofit

### Mục tiêu chương

- Sử dụng package `http` cho REST call cơ bản (GET, POST, PUT, DELETE)
- Sử dụng `Dio` cho project lớn (interceptor, retry, timeout)
- Parse JSON: manual + `json_serializable` codegen
- Pattern Repository: tách HTTP khỏi widget
- Error handling: network, parse, business
- Timeout & retry strategy
- `retrofit` package: type-safe API client từ annotation
- Upload file (multipart)
- WebSocket cơ bản với `web_socket_channel`

### Lý do học

Mọi app real-world gọi API. Flutter có 2 lựa chọn chính: `http` (Flutter team, đủ cho 80% case) hoặc `dio` (community, mạnh hơn). Pattern repository + JSON model là chuẩn industry — không hiểu thì code rối.

### Prerequisites

Dart Chương 7 (Future, async/await, Stream). Chương 5 (state mgmt — Bloc/Provider gọi repo).

### Sections

1. **`http` package** — basic. `import 'package:http/http.dart' as http;`. `http.get(Uri.parse('...'))` trả `Future<Response>`.
2. **Response handling** — `response.statusCode`, `response.body` (String), `response.headers`. Check 2xx/4xx/5xx.
3. **JSON decode** — `jsonDecode(response.body)` từ `dart:convert`. Trả `Map<String, dynamic>` hoặc `List<dynamic>`.
4. **Model class manual** — `class User { final int id; final String name; User.fromJson(Map<String, dynamic> json) : id = json['id'], name = json['name']; Map<String, dynamic> toJson() => {'id': id, 'name': name}; }`.
5. **JSON codegen — `json_serializable`** — `@JsonSerializable() class User { ... User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json); }`. Run `dart run build_runner build`.
6. **`freezed` + `json_serializable`** — immutable model với copyWith, ==, hashCode tự sinh + JSON. Recommended pattern.
7. **POST/PUT/DELETE** — `http.post(uri, body: jsonEncode(data), headers: {'Content-Type': 'application/json'})`.
8. **Dio — package mạnh hơn** — `dart pub add dio`. `final dio = Dio(BaseOptions(baseUrl: '...', connectTimeout: ...));` `dio.get('/users')`.
9. **Dio interceptor** — request/response/error. Use case: add Authorization header, retry, log.
10. **Dio retry interceptor** — package `dio_smart_retry` hoặc tự viết. Retry 3 lần với exponential backoff.
11. **Dio cancel token** — `CancelToken` để cancel request khi widget unmount.
12. **Repository pattern** — `abstract class UserRepository { Future<User> fetchUser(int id); }`. Impl `UserRepositoryImpl(this.dio)`. Inject vào Bloc/Provider.
13. **Error class custom** — `class ApiException implements Exception { final int statusCode; final String message; }`. Throw từ repo.
14. **Timeout** — Dio `connectTimeout`, `receiveTimeout`. http: `.timeout(Duration(seconds: 10))`. Catch `TimeoutException`.
15. **Retry pattern** — exponential backoff cho lỗi transient.
16. **`retrofit` package** — annotation-driven HTTP client. `@RestApi() abstract class ApiClient { @GET('/users/{id}') Future<User> getUser(@Path() int id); }`. Codegen sinh impl.
17. **Upload file (multipart)** — `FormData.fromMap({'file': await MultipartFile.fromFile(path)})`.
18. **WebSocket** — `web_socket_channel` package. `WebSocketChannel.connect(Uri.parse('wss://...'))`, listen stream, send `channel.sink.add(...)`.
19. **GraphQL intro** — package `graphql_flutter`. Mention only, không deep dive.
20. **Pitfall: jsonDecode trên main isolate** — JSON lớn block UI. Dùng `compute(jsonDecode, response.body)` chuyển sang isolate.

### Key concepts

- `http` đủ cho project nhỏ. `dio` cho project lớn cần interceptor.
- `freezed` + `json_serializable` = chuẩn modern cho model
- Repository pattern bắt buộc cho test + maintain
- Always handle error + timeout
- JSON parse lớn → compute() ngoài main isolate

### Code examples

1. Fetch list user từ JSONPlaceholder API với `http`. Parse manual.
2. Same fetch với `dio` + freezed model.
3. Auth interceptor Dio: tự add `Authorization: Bearer $token` mọi request.
4. Retry interceptor: 5xx error retry 3 lần exponential backoff.
5. Repository pattern: `UserRepository`, `UserBloc(repo)`, test mock repo.
6. Retrofit: define `ApiClient` abstract với 5 endpoint, codegen impl.
7. Upload avatar: pick image (chương 9) → multipart upload → progress callback.
8. WebSocket chat demo: send message, listen incoming.

### Visualizer / diagram

- Sequence diagram: Widget → Bloc → Repository → HTTP → JSON parse → Model → Bloc emit → Widget
- Dio interceptor chain: request → interceptor 1 (auth) → interceptor 2 (log) → server → response → interceptor 1 → 2 → Widget
- Bảng so sánh http vs Dio vs Retrofit: features, complexity, codegen, use case
- Error flow: HTTP → status code → throw ApiException → catch ở Bloc → emit Error state → UI snackbar

### Bài tập (5)

1. Build app list user từ `https://jsonplaceholder.typicode.com/users`. Pull-to-refresh. Error state.
2. Add detail page khi tap user. Fetch detail từ `/users/:id`. Loading state.
3. Migrate từ `http` sang `dio`. Add interceptor log request/response.
4. Implement repository pattern: `UserRepository` interface, `UserRepositoryImpl(Dio)` concrete. UserBloc inject. Test UserBloc với mock repo.
5. Add JWT auth flow: login → save token (SharedPreferences chương 11) → interceptor add header → 401 → refresh token retry.

### Quiz (8)

1. `http.get` return type? — `Future<http.Response>`.
2. `jsonDecode` trên string JSON dài (10MB) — chuyện gì? — Block main isolate, UI jank. Fix: `compute(jsonDecode, body)`.
3. Dio interceptor `onError` — handler.next vs handler.reject? — `.next` continue chain. `.reject` stop, throw error sớm.
4. freezed model có method nào auto sinh? — copyWith, ==, hashCode, toString, optional toJson/fromJson.
5. CancelToken use case? — Cancel request khi widget unmount, tránh setState after dispose.
6. Retry với 401 (unauthorized) — strategy gì? — Refresh token, retry với token mới. Nếu refresh fail → logout.
7. Multipart upload Dio — class chính? — `FormData` + `MultipartFile`.
8. `http` package có handle redirect (3xx) tự không? — Có, mặc định follow. Disable: `Request..followRedirects = false`.

### Connects to

- Chương 7, 8 (state mgmt gọi repo)
- Chương 11 (cache response local)
- Chương 14 (test repo + bloc)

### Ước lượng độ dài

~1200-1300 dòng HTML.

---

## Chương 11 — Local Storage

### Mục tiêu chương

- Phân biệt key-value vs SQL vs NoSQL cho local
- `SharedPreferences` cho key-value primitive (bool, int, string, list of string)
- `flutter_secure_storage` cho sensitive data (token) — encrypted
- `sqflite` cho SQL relational
- `drift` (gen từ sqflite) cho type-safe SQL với codegen
- `hive` cho NoSQL key-value object — fast, no codegen needed
- `isar` cho NoSQL object DB modern — query + index
- Pattern offline-first
- Migration: schema thay đổi giữa version app

### Lý do học

Mọi app cần lưu state local: setting, cache API, draft form, offline data. Flutter có 5+ thư viện cho việc này — chọn sai → migration đau. Chương này dạy 5 thư viện chính + decision framework.

### Prerequisites

Chương 10 (HTTP — để cache result), Dart Chương 7 (async).

### Sections

1. **Spectrum lưu trữ local** — Bảng:
   - In-memory (state mgmt) — không persistent
   - SharedPreferences — key-value primitive, simple
   - SecureStorage — token, password (encrypted via Keychain/Keystore)
   - File system — `path_provider` + `dart:io` File
   - Sqflite — SQLite relational
   - Drift — sqflite + codegen type-safe
   - Hive / Isar — NoSQL object DB
2. **`shared_preferences`** — `SharedPreferences.getInstance()`, `prefs.setString('key', 'value')`, `prefs.getString('key')`. Async API.
3. **SharedPreferences pattern wrapper** — class `AppPrefs` wrap typed access. Avoid `prefs.getInt('counter')` rải khắp.
4. **`flutter_secure_storage`** — `FlutterSecureStorage()`, `storage.write/read/delete`. iOS Keychain, Android EncryptedSharedPreferences. Use case: JWT.
5. **File system** — `path_provider.getApplicationDocumentsDirectory()`, write file `File('$path/data.json').writeAsString(...)`.
6. **SQLite với `sqflite`** — open db, raw SQL `db.rawQuery('SELECT * FROM users WHERE id = ?', [1])`. Migration với `onUpgrade`.
7. **`drift` package — SQL type-safe** — define table với annotation, codegen DAO. Query DSL: `select(users)..where((u) => u.age.isBiggerThan(18))`.
8. **`hive` — NoSQL object** — register adapter (codegen optional), `Hive.openBox<User>('users')`, `box.put('key', user)`, `box.get('key')`.
9. **`isar` — NoSQL modern** — sucessor of Hive (same author). Indexes, query, embedded.
10. **Offline-first pattern** — fetch từ API → cache local → next time load local trước, refresh background.
11. **Cache invalidation** — TTL (time-to-live), refresh on app start, manual invalidate.
12. **Migration schema** — version field, upgrade script. Vd sqflite `onUpgrade: (db, oldV, newV) async { if (oldV < 2) await db.execute('ALTER TABLE ...'); }`.
13. **Backup & restore** — export DB file, import. Cloud sync (intro, không deep).
14. **Decision framework:**
    - Setting đơn giản (theme, locale, intro shown) → SharedPreferences
    - Token, password → SecureStorage
    - Cache API response (JSON list) → Hive/Isar hoặc file
    - Relational data (user + post + comment với join) → Drift
    - Offline-first app (full DB) → Drift hoặc Isar

### Key concepts

- SharedPreferences NOT for sensitive data
- SecureStorage encrypted nhưng vẫn được decrypt bởi app — không bảo vệ khỏi root device
- SQL → relational, NoSQL → object/document
- Codegen (drift, isar, hive adapter) trade-off: tốc độ vs setup phức tạp
- Migration là plan từ đầu, đừng chờ tới khi DB v3

### Code examples

1. SharedPreferences wrapper class `AppPrefs` với typed getter/setter (theme mode, locale, first run).
2. SecureStorage lưu JWT, đọc khi app start, clear khi logout.
3. Sqflite CRUD note (id, title, body, createdAt).
4. Drift schema + DAO cho table todo, query, watch (Stream).
5. Hive box `User` với HiveType annotation + adapter.
6. Offline-first pattern: open app → hiển thị data local → fetch API → update local + UI.
7. Migration: add column `priority` vào table todo từ v1 → v2.

### Visualizer / diagram

- Bảng so sánh 5 lựa chọn local storage: type, speed, complexity, encryption, codegen
- Decision tree: data type → recommended option
- Offline-first sequence diagram
- Schema migration timeline: v1 → v2 → v3 với delta

### Bài tập (5)

1. Setting page: dark mode toggle, locale dropdown, font size slider. Persist via SharedPreferences. App restart giữ setting.
2. Login form: lưu token vào SecureStorage. App start check token, auto-login nếu còn valid.
3. Note app CRUD với sqflite. Schema: id, title, body, createdAt. List, add, edit, delete.
4. Migrate bài 3 từ sqflite raw sang drift. So sánh code.
5. Offline-first: fetch list user → cache Hive → next open hiển thị cache + fetch background → update.

### Quiz (8)

1. SharedPreferences lưu được type gì? — primitive: bool, int, double, String, `List<String>`. Không lưu được Map, custom object trực tiếp (cần encode JSON).
2. SecureStorage tốc độ vs SharedPreferences? — Chậm hơn (encrypt overhead). Dùng cho sensitive only, không phải mọi setting.
3. Sqflite migration — gọi callback nào? — `onCreate` (lần đầu install) và `onUpgrade(db, oldV, newV)` (khi version tăng).
4. Drift cần codegen — command? — `dart run build_runner build`.
5. Hive vs Isar — khác chính? — Isar modern hơn (cùng author), có index + query mạnh hơn, recommend cho new project.
6. Cache TTL pattern — implement? — Lưu timestamp khi cache. Đọc: check `now - timestamp > ttl` → invalidate.
7. SharedPreferences sync API có không? — Không. Mọi method async (return Future). Mới có `SharedPreferencesAsync` (2024+).
8. SQLite vs NoSQL — chọn nào? — SQL cho relational + complex query. NoSQL cho object-oriented, ít join. Phụ thuộc data shape.

### Connects to

- Chương 10 (cache API response)
- Chương 6 (state quản lý loading từ cache)
- Chương 14 (test repo với mock storage)

### Ước lượng độ dài

~1100-1200 dòng HTML.

---

## Chương 12 — Animation

### Mục tiêu chương

- Phân biệt implicit vs explicit animation
- Sử dụng `AnimatedContainer`, `AnimatedOpacity`, `AnimatedAlign`, `AnimatedSwitcher` — implicit
- Sử dụng `AnimationController`, `Tween<T>`, `Curve` — explicit
- Sử dụng `TweenAnimationBuilder` — implicit chuẩn hơn
- Hiểu `vsync: this` với `SingleTickerProviderStateMixin`
- Sử dụng `Hero` widget cho shared element transition
- Sử dụng `Lottie` cho animation phức tạp (Adobe AfterEffects export)
- Custom animation với `CustomPainter` + animation
- Staggered animation: nhiều animation phối hợp
- Performance tip: `RepaintBoundary`

### Lý do học

Animation tốt → app feel premium. Flutter có 2 hệ: implicit (đơn giản, 80% use case) và explicit (control đầy đủ). Beginner thường jump thẳng explicit → over-engineer. Chương này dạy đúng spectrum.

### Prerequisites

Chương 2, 3, 4 (widget tree). Dart Chương 7 (async — animation chạy trên ticker).

### Sections

1. **Implicit vs Explicit** — Implicit: declare target state, Flutter tween từ state hiện tại. Explicit: control AnimationController, Tween, value mỗi frame.
2. **Implicit family — `Animated*` widgets:**
    - `AnimatedContainer` — color, size, decoration
    - `AnimatedOpacity` — fade
    - `AnimatedAlign` — position
    - `AnimatedDefaultTextStyle` — text style
    - `AnimatedCrossFade` — fade giữa 2 child
    - `AnimatedSwitcher` — swap child với transition
    - `AnimatedSize` — size change
3. **`TweenAnimationBuilder<T>`** — most flexible implicit. Cho tween, builder. Animation tự chạy khi tween thay đổi.
4. **AnimationController** — controller cho explicit. `AnimationController(vsync: this, duration: 1.second)`. Method: forward, reverse, repeat, stop.
5. **`vsync`** — sync animation với screen refresh. `SingleTickerProviderStateMixin` cho 1 controller. `TickerProviderStateMixin` cho nhiều.
6. **`Tween<T>`** — define begin/end. `Tween<double>(begin: 0, end: 100)`. Method `.animate(controller)` trả Animation<T>.
7. **`Curve`** — easing function. `Curves.easeInOut`, `Curves.easeOutCubic`, `Curves.elasticOut`. Bảng visualize curves.
8. **`CurvedAnimation`** — wrap controller với curve.
9. **`AnimatedBuilder`** — rebuild widget khi animation tick. Builder pattern cho performance.
10. **Multiple animation phối hợp** — multiple Tween từ cùng controller với `Interval` cho staggered.
11. **`Hero` widget — shared element transition** — same `tag` trên 2 page → animate giữa. Standard pattern detail page.
12. **`AnimatedList` / `AnimatedGrid`** — insert/remove item có animation. Cần `GlobalKey<AnimatedListState>`.
13. **`PageRouteBuilder` custom transition** — slide, fade, scale custom giữa route.
14. **Lottie animation** — package `lottie`. Load `.json` từ Adobe AE. `Lottie.asset('assets/loading.json')`.
15. **Rive — alternative Lottie** — package `rive`. Vector animation runtime với state machine.
16. **Physics-based animation — `SpringSimulation`, `BouncingScrollPhysics`** — không dùng Curve fixed, simulate physics.
17. **Performance — `RepaintBoundary`** — isolate paint region, tránh repaint parent khi animation chạy.
18. **DevTools — Flutter Performance Overlay** — bật trong app, đo FPS. Đỏ = jank.

### Key concepts

- Implicit đủ cho 80% case — đừng over-engineer với explicit
- AnimationController phải dispose
- Curve quan trọng hơn duration cho "feel" — easeOutCubic cho most case
- Hero tag unique giữa 2 page — duplicate tag = error
- RepaintBoundary là performance hint, không phải solution magic

### Code examples

1. Toggle button với `AnimatedContainer` đổi color + size + borderRadius.
2. `AnimatedSwitcher` swap icon với fade transition.
3. `TweenAnimationBuilder<double>` counter từ 0 → 100 với curve.
4. AnimationController + Tween manual: bouncing ball.
5. Staggered animation: 5 card slide in tuần tự cách 100ms.
6. Hero detail page: thumbnail → full image.
7. PageRouteBuilder custom slide-up.
8. Lottie loading animation từ LottieFiles.
9. CustomPainter + AnimationController: progress ring tròn.

### Visualizer / diagram

- Spectrum implicit ↔ explicit: bảng 7 implicit widget vs explicit pattern, khi nào dùng cái nào
- Curve visualization: 10 popular curve với graph mini
- AnimationController lifecycle: idle → forward → completed → reverse → dismissed
- Staggered animation timeline: interval per child

### Bài tập (5)

1. Toggle theme button với `AnimatedContainer` đổi background + icon rotate 180°.
2. Like animation: tap heart icon → scale up + color change + small particle burst. Dùng explicit.
3. Hero transition cho list grid product → detail page (full image + animated text fade in).
4. Loading screen với Lottie download free từ LottieFiles.
5. Bouncing notification badge: số đếm tăng → badge scale 0 → 1.2 → 1 với spring.

### Quiz (8)

1. `AnimatedContainer` cần controller không? — Không. Implicit tự nội.
2. `vsync` parameter — vai trò? — Sync animation với ticker (frame refresh). Tránh chạy khi screen off.
3. AnimationController không dispose — chuyện gì? — Memory leak. `super.dispose()` không tự dispose controller.
4. Hero tag duplicate giữa 2 page — chuyện gì? — Throw error. Tag phải unique trong scope.
5. `Curves.easeInOut` vs `Curves.linear` — khác feel? — easeInOut "natural", linear "robot-like". Easing usually preferred trừ progress indicator.
6. `RepaintBoundary` giúp gì? — Isolate paint layer, repaint chỉ phần thay đổi, không repaint cả tree.
7. Lottie vs Rive — chọn nào? — Lottie cho one-shot animation export từ AE. Rive cho interactive với state machine.
8. `AnimatedBuilder` builder gọi mỗi frame — performance ok? — Ok nếu widget trong builder rẻ. Đặt heavy widget ngoài, chỉ widget animated trong builder.

### Connects to

- Chương 13 (custom paint cho animation phức tạp)
- Chương 15 (performance overlay đo animation jank)

### Ước lượng độ dài

~1100-1200 dòng HTML.

---

## Chương 13 — Custom Paint & Render

### Mục tiêu chương

- Hiểu khi nào cần xuống low-level (CustomPainter, RenderObject)
- Sử dụng `CustomPainter` với `Canvas` API
- Vẽ shape: line, rect, circle, path, polygon
- Vẽ text với `TextPainter`
- Combine `CustomPainter` + `AnimationController`
- Hiểu RenderObject hierarchy: RenderBox, RenderSliver, RenderObject
- Tạo custom RenderObject (intro, không deep)
- Hit testing: tap detect on custom paint
- 3 cây deep dive: Widget / Element / RenderObject

### Lý do học

99% Flutter dev không bao giờ viết RenderObject custom. Nhưng 50% sẽ cần CustomPainter (chart, gauge, custom shape). Chương này dạy CustomPainter detail + intro 3 cây để hiểu Flutter render internals — kiến thức nền cho debug performance + understand framework.

### Prerequisites

Chương 2 (widget tree), Chương 12 (animation — pair với CustomPainter).

### Sections

1. **Khi nào custom paint?** — Chart không có package phù hợp, gauge, badge shape phức tạp, gradient phức tạp, signature pad, drawing app.
2. **`CustomPaint` widget + `CustomPainter`** — `CustomPaint(painter: MyPainter(), size: ...)`. Painter override `paint(Canvas, Size)` và `shouldRepaint(old)`.
3. **`Canvas` API** — `drawLine`, `drawRect`, `drawCircle`, `drawArc`, `drawPath`, `drawText`, `drawImage`. Coordinate (0,0) ở top-left.
4. **`Paint`** — style (fill/stroke), color, strokeWidth, strokeCap, strokeJoin, shader (gradient), maskFilter (blur).
5. **`Path`** — combine multiple line/curve. `moveTo`, `lineTo`, `quadraticBezierTo`, `cubicTo`, `arcTo`, `close`.
6. **Text painting** — `TextPainter(text: TextSpan(...), textDirection: ltr)..layout()..paint(canvas, offset)`. Không dùng `canvas.drawText` (deprecated).
7. **Save/restore canvas state** — `canvas.save()`, `canvas.translate/scale/rotate`, `canvas.restore()`. Pattern transform isolate.
8. **`shouldRepaint`** — return true khi cần repaint. Trả false nếu painter dùng same data → skip frame.
9. **Combine với animation** — pass `Animation` vào painter constructor, `super(repaint: animation)`. Mỗi tick → repaint.
10. **Hit testing** — `hitTest(Offset position)` trên CustomPainter. Use case: tap detect inside shape.
11. **Shader** — `Gradient.linear(...).createShader(rect)` cho paint.shader. Apply gradient/image as paint.
12. **Pattern: chart line đơn giản** — Path từ list data point, drawPath với stroke.
13. **3 cây deep dive — Widget / Element / RenderObject** — Widget là spec (immutable). Element là instance trong tree (mutable, lifecycle). RenderObject là thực sự layout/paint.
14. **RenderObject categories** — `RenderBox` (2D Cartesian), `RenderSliver` (scrollable), generic `RenderObject`.
15. **Tạo custom RenderObject (intro)** — extends `RenderBox`. Override `performLayout`, `paint`, `hitTestSelf`. Use case: cực hiếm, vd widget vừa size vừa paint custom mà CustomPainter không đủ.
16. **`MultiChildRenderObjectWidget`** — render multiple child với custom layout. Intro only.
17. **Tools:**
    - `flutter inspector` Widget Inspector
    - `debugPaintSizeEnabled = true`
    - `debugRepaintRainbowEnabled = true` — debug repaint
18. **Performance tip** — CustomPainter `shouldRepaint` trả false khi không cần. RepaintBoundary wrap CustomPaint nếu nó repaint thường.

### Key concepts

- CustomPainter là tool đủ mạnh cho 95% custom drawing
- RenderObject hiếm khi tự viết — chỉ khi framework không đủ
- Widget = spec, Element = instance, RenderObject = layout/paint
- Canvas coordinate (0,0) top-left, y tăng xuống
- `shouldRepaint` return logic chính xác = performance

### Code examples

1. Custom progress ring: drawArc với sweep angle từ animation 0 → 2π.
2. Signature pad: `GestureDetector` capture pan, lưu list `Offset`, CustomPainter drawPath.
3. Chart: line chart từ list `(x, y)`, axes + grid + line.
4. Custom widget badge có shape ngôi sao 5 cánh: Path moveTo/lineTo theo math.
5. Gauge speedometer: arc + needle rotate theo value.
6. RepaintRainbow demo: enable, screenshot show repaint zones.
7. Intro custom RenderBox: widget tạo box size 100x100, paint red. (Demonstrative, không production.)

### Visualizer / diagram

- 3 cây side-by-side: Widget Tree, Element Tree, RenderObject Tree với mapping
- Canvas operations cheatsheet: drawLine, drawRect, drawCircle, drawPath
- Path commands visualize: moveTo, lineTo, quadraticBezierTo, cubicTo, arcTo
- Coordinate system: top-left origin, y-axis down

### Bài tập (5)

1. Custom signature pad widget. Save khi user nhấn done.
2. Donut chart hiển thị 4 slice từ data `[(label, value, color)]`. Animate sweep từ 0 → full khi mount.
3. Custom progress ring với % ở giữa. Animate từ 0 → target khi value change.
4. Gauge speedometer: needle rotate -90° đến 90° theo value 0-100.
5. Star rating widget: 5 sao paint với fill % theo rating (vd 3.5 sao).

### Quiz (8)

1. `CustomPainter.shouldRepaint` luôn trả true — vấn đề? — Repaint mỗi frame, performance kém. Trả true chỉ khi data đổi.
2. Canvas coordinate (0,0) ở đâu? — Top-left.
3. `canvas.translate(50, 0)` rồi drawLine từ (0,0) đến (100, 0) — vẽ từ đâu đến đâu? — Từ (50, 0) đến (150, 0) screen.
4. `TextPainter` cần gọi method nào trước paint? — `.layout()` để compute width/height của text.
5. RenderObject vs CustomPainter — khác? — CustomPainter chỉ paint trong size cấp sẵn. RenderObject cũng decide layout (size con và self).
6. `RepaintBoundary` quanh CustomPaint giúp gì? — Isolate paint layer, parent rebuild không trigger CustomPainter repaint.
7. Path đóng kín — method nào? — `path.close()` nối end về start.
8. Animation passed vào painter constructor `super(repaint: anim)` — vai trò? — Mỗi tick anim → CustomPainter repaint tự động, không cần shouldRepaint custom.

### Connects to

- Chương 12 (animation pair custom painter)
- Chương 15 (performance overlay đo paint time)

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 14 — Testing

### Mục tiêu chương

- Phân biệt 3 level test: Unit / Widget / Integration / Golden
- Setup `flutter_test` (đã có), `mockito` hoặc `mocktail` cho mock
- Viết unit test cho Dart logic (Bloc, Cubit, utility, model)
- Viết widget test với `WidgetTester`: pump, tap, drag, expect
- Viết integration test với `integration_test` package
- Golden test (visual regression) với `matchesGoldenFile`
- Coverage report với `--coverage`
- CI tích hợp test (intro GitHub Actions)

### Lý do học

Test thường bị skip "vì gấp" — sau đó refactor không dám vì sợ vỡ. Flutter có test infra tốt nhất ecosystem mobile. Chương này dạy đủ 3 level + cách mỗi level test cái gì.

### Prerequisites

Tất cả chương trước (test cover những gì đã học).

### Sections

1. **Pyramid test** — Unit (nhiều) → Widget (vừa) → Integration (ít). Cost vs confidence tradeoff.
2. **Setup `flutter_test`** — đã có sẵn trong dev_dependencies. `test/foo_test.dart` chạy với `flutter test`.
3. **Unit test cơ bản** — `test('description', () { expect(2 + 2, 4); });`. `group` group test. `setUp`/`tearDown`.
4. **`expect` + matchers** — `equals`, `isA<>()`, `throwsA`, `contains`, `everyElement`, `predicate`.
5. **Async test** — `test('...', () async { ... });`. Return Future, expect resolve.
6. **Mock với `mocktail`** — `class MockUserRepo extends Mock implements UserRepository {}`. `when(() => mockRepo.fetch(1)).thenAnswer((_) async => user);`. `verify(() => mockRepo.fetch(1)).called(1);`.
7. **`mockito` alternative** — codegen-based. `@GenerateMocks([UserRepository])`. Build_runner sinh.
8. **Test Bloc — `bloc_test`** — đã đề cập chương 7. `blocTest('description', build: ..., act: ..., expect: ...)`.
9. **Test Cubit — pattern đơn giản** — `final cubit = CounterCubit(); cubit.increment(); expect(cubit.state, 1);`.
10. **Widget test cơ bản** — `testWidgets('description', (tester) async { await tester.pumpWidget(MyApp()); expect(find.text('Hello'), findsOneWidget); });`.
11. **`WidgetTester` API** — `pumpWidget`, `pump`, `pumpAndSettle`, `tap`, `enterText`, `drag`. `find.byKey`, `find.byType`, `find.text`, `find.byIcon`.
12. **Test interaction** — counter tap +1: `await tester.tap(find.byIcon(Icons.add))`, `await tester.pump()`, `expect(find.text('1'), findsOneWidget)`.
13. **Test với provider — `BlocProvider` trong test** — wrap widget tree với BlocProvider khi pump. Inject mock Bloc.
14. **Test navigation** — `tester.pump()` trigger navigation, `expect(find.byType(NextPage), findsOneWidget)`.
15. **Test form** — `enterText` vào TextField, tap submit, verify validation message hoặc API call.
16. **Test FutureBuilder/StreamBuilder** — `pumpAndSettle` đợi async resolve.
17. **Integration test — package `integration_test`** — chạy trên real device/emulator. Test full flow login → list → detail.
18. **Golden test (visual regression)** — `matchesGoldenFile('golden.png')`. Capture screenshot, so sánh với baseline. Cập nhật khi UI đổi intentional.
19. **Coverage** — `flutter test --coverage` sinh `coverage/lcov.info`. View qua `genhtml`.
20. **CI — GitHub Actions intro** — workflow chạy `flutter test` trên PR.

### Key concepts

- Test pyramid: unit nhiều, integration ít. Cost tăng theo level.
- Mock chỉ ranh giới: HTTP, DB, time. Không mock business logic.
- `pump()` vs `pumpAndSettle()` — pump 1 frame vs đợi animation done.
- Golden test khó CI cross-platform vì pixel diff. Dùng flag `--update-goldens` khi UI đổi.
- Coverage không phải target — 80% smart hơn 100%.

### Code examples

1. Unit test utility function `String formatPrice(int)`.
2. Cubit test: 3 case Counter (initial 0, increment 1, decrement -1).
3. Mock UserRepository test UserBloc: success + error case.
4. Widget test Counter app: tap +1, verify text "1".
5. Widget test login form: enter email/password, tap submit, verify API call.
6. Integration test full flow: open app → login → see home page → logout.
7. Golden test home page widget.
8. CI workflow `.github/workflows/test.yml` chạy `flutter test --coverage`.

### Visualizer / diagram

- Test pyramid với cost/confidence ratio
- WidgetTester lifecycle: pumpWidget → pump (advance time/frame) → find → expect
- Mock pattern: real impl ↔ interface ↔ mock impl
- Coverage report visualization

### Bài tập (5)

1. Unit test cho `class Validator { static String? email(String?), static String? password(String?) }`.
2. Bloc test cho CartBloc: add, remove, clear, total. 5 case.
3. Widget test cho LoginPage: form validation, mock auth bloc, submit success → navigate.
4. Integration test cho counter app: tap 5 lần, verify "5".
5. Golden test cho settings page với 3 theme khác nhau (light/dark/custom).

### Quiz (8)

1. `pump()` vs `pumpAndSettle()` — khi nào dùng cái nào? — `pump(duration)` advance 1 frame hoặc duration cụ thể. `pumpAndSettle` đợi đến khi không còn frame schedule (animation done). Dùng `pumpAndSettle` sau navigate, `pump` sau setState.
2. Mock object — chỉ nên mock cái gì? — Boundary: HTTP, DB, time, external service. Không mock business logic của chính mình.
3. `find.byType(ElevatedButton)` trả gì? — `Finder` instance — descriptor để find widget. Dùng với `expect(finder, findsOneWidget/findsNWidgets/findsNothing)`.
4. `bloc_test` `expect` parameter — return type? — `Function returning List of states`. Lazy để cho phép Matcher.
5. Coverage `lcov.info` — view tool? — `genhtml coverage/lcov.info -o coverage/html` rồi mở index.html.
6. Test fail vì golden khác baseline — fix? — Verify UI change intentional → `flutter test --update-goldens` update baseline. Commit.
7. Test Bloc cần inject mock repo — pattern? — Constructor inject: `CounterBloc(this.repo)`. Test: `CounterBloc(mockRepo)`.
8. CI GitHub Actions chạy `flutter test` cần setup gì? — Action `subosito/flutter-action` setup Flutter SDK trước, sau đó `flutter pub get` + `flutter test`.

### Connects to

- Mọi chương trước (test cover feature)
- Chương 15 (CI build + test)

### Ước lượng độ dài

~1100-1200 dòng HTML.

---

## Chương 15 — Performance, DevTools, Build & Deploy

### Mục tiêu chương

- Sử dụng Flutter DevTools toàn diện: Inspector, Performance, Memory, Network, Logging
- Hiểu Performance Overlay (GPU + UI thread bars)
- Tối ưu rebuild: `const`, `RepaintBoundary`, `selector` pattern
- Đo build time, scroll performance, animation FPS
- Memory profiling — phát hiện leak
- Build release: APK, App Bundle, IPA, macOS app, web build
- Sign Android: keystore, build.gradle
- Sign iOS: certificate, provisioning profile, Xcode signing
- Deploy: Google Play, App Store, Firebase App Distribution, TestFlight
- Web deploy: Firebase Hosting, Cloudflare Pages
- Flavor: dev/staging/prod build với different config

### Lý do học

Chương cuối — đưa app từ "chạy trên máy mình" → "ship cho user". Đây là phần thường bị bỏ qua hoặc làm vội. Chương dài + nhiều technical detail iOS/Android.

### Prerequisites

Tất cả chương trước. CI/CD basic (đã học DevOps pillar).

### Sections

1. **Performance Overlay** — `MaterialApp(showPerformanceOverlay: true)`. 2 bar: UI (Dart code build/layout time), Raster (GPU paint). Đỏ = > 16ms = jank.
2. **DevTools — Widget Inspector** — Select widget, xem widget tree, properties. Highlight render bounds.
3. **DevTools — Performance** — record CPU, flame chart. Identify slow widget build.
4. **DevTools — Memory** — heap snapshot, allocation timeline. Detect leak.
5. **DevTools — Network** — log HTTP request, response, timing.
6. **DevTools — Logging** — `print`, `debugPrint`, `log` (dart:developer). Filter level.
7. **Common performance issues + fix:**
   - Rebuild quá nhiều → `const`, `Selector`, split widget
   - `Opacity` widget expensive → dùng `AnimatedOpacity` hoặc `Color.fromOpacity` background
   - `ClipPath` repaint thường → cache với `RepaintBoundary`
   - Long list không lazy → `ListView.builder` thay `ListView(children: [...])`
   - Image lớn không resize → `Image.network(cacheWidth, cacheHeight)` hoặc `ResizeImage`
   - State update không necessary → `select` granular
8. **Build mode** — Debug (assert + JIT), Profile (AOT + profile flag), Release (AOT + minify).
9. **Build Android APK** — `flutter build apk --release`. APK ở `build/app/outputs/flutter-apk/`.
10. **Android App Bundle (AAB)** — `flutter build appbundle --release`. Google Play preferred.
11. **Android signing** — `key.properties`, `keystore.jks`, `android/app/build.gradle` signingConfigs.
12. **Build iOS IPA** — `flutter build ipa`. IPA cho ad-hoc/App Store. Cần Xcode + Apple Developer account.
13. **iOS signing** — Apple Developer certificate, Provisioning Profile, Bundle ID, Team. Automatic vs manual signing.
14. **Build macOS app** — `flutter build macos`. Cần notarize cho distribute outside App Store.
15. **Build Web** — `flutter build web --release`. Output ở `build/web/`. CanvasKit vs HTML renderer.
16. **Web hosting** — Firebase Hosting (`firebase init`, `firebase deploy`), Cloudflare Pages, Netlify, Vercel.
17. **Firebase App Distribution** — internal testing app. Upload AAB/IPA, invite tester.
18. **TestFlight** — iOS beta. Upload IPA qua Xcode hoặc Transporter.
19. **Google Play Console** — internal/closed/open testing, production. Release management.
20. **Flavor — multi env** — dev/staging/prod build với different bundle id, app name, API endpoint. Setup `--flavor` Android + Xcode scheme iOS.
21. **CI/CD intro** — fastlane, Codemagic, Bitrise, GitHub Actions với Flutter action. Auto build + deploy on tag.
22. **Crash reporting — Sentry / Firebase Crashlytics** — capture exception runtime production.
23. **Analytics — Firebase Analytics / Mixpanel** — track user behavior.
24. **App size optimization** — `--split-per-abi` Android (giảm 50%), `--tree-shake-icons`, remove unused asset.
25. **Pubspec icons — `flutter_launcher_icons` package** — sinh icon từ 1 source file.
26. **Splash screen — `flutter_native_splash`** — declare trong pubspec, sinh native splash.

### Key concepts

- Profile mode != release mode — profile có debug overhead
- AAB > APK cho Play (smaller download, dynamic delivery)
- iOS signing là pain point lớn nhất — học kỹ
- Web có 2 renderer: CanvasKit (heavier, consistent) vs HTML (lighter, less feature)
- Flavor setup khác hẳn iOS vs Android — pattern không unified

### Code examples

1. Performance Overlay enable + screenshot khi scroll fast list.
2. Optimize: `ListView` 1000 item → `ListView.builder` → đo diff time.
3. `const` constructor mọi widget không state → đo rebuild diff.
4. `key.properties` Android + signingConfigs setup.
5. Xcode iOS Bundle ID + team config.
6. `firebase init hosting` + `firebase deploy` Flutter Web.
7. Flavor setup full: 3 env với api_url khác.
8. GitHub Actions workflow: trigger on tag `v*`, build + deploy TestFlight.

### Visualizer / diagram

- DevTools panels overview screenshot annotated
- Performance Overlay anatomy: 2 bar UI vs Raster, 16ms threshold
- Build pipeline: source → compile (mode dependent) → bundle → sign → distribute
- App Store flow: build IPA → upload Transporter → TestFlight review → release
- Play Store flow: build AAB → upload Console → internal track → review → production
- Renderer Web: CanvasKit vs HTML feature matrix

### Bài tập (5)

1. Bật Performance Overlay, scroll list 1000 item — UI bar đỏ → optimize bằng `ListView.builder` + `const` + RepaintBoundary. Đo lại, đỏ → xanh.
2. Build release APK signed với keystore tự sinh. Cài lên Android device thực tế.
3. Build IPA, upload TestFlight, gửi cho 1 tester thật.
4. Setup 3 flavor (dev/staging/prod) với 3 firebase project (hoặc 3 API endpoint). Run + build từng flavor.
5. CI GitHub Actions: trigger merge to `main` → build APK + web + upload Firebase App Distribution.

### Quiz (8)

1. APK vs AAB — Google Play khuyến nghị cái nào? — AAB (Android App Bundle). Google split per device, download nhỏ hơn.
2. Profile mode khác Release? — Profile = AOT compile + profile flag (cho DevTools track). Slight slower than Release, faster than Debug. Để đo performance gần production.
3. Web CanvasKit vs HTML renderer — chọn nào? — CanvasKit feature đầy đủ, render giống mobile, heavy (~2MB). HTML nhẹ, một số widget không support hoàn hảo. Mặc định Flutter pick auto.
4. iOS signing "automatically manage" — vấn đề tiềm tàng? — Cần đăng nhập Apple Developer account, đôi khi vẽ certificate sai. Manual signing đáng tin hơn cho CI.
5. App size lớn — trick giảm? — `--split-per-abi` (Android), `--tree-shake-icons`, remove unused asset, dùng `flutter_image_compress` cho image.
6. Flavor Android setup — file nào? — `android/app/build.gradle` `productFlavors { dev {}, staging {}, prod {} }`.
7. Firebase Crashlytics capture exception nào? — Native crash + Dart uncaught exception. Cần `FlutterError.onError` + `PlatformDispatcher.instance.onError`.
8. Hot reload hoạt động build mode nào? — Chỉ Debug.

### Connects to

- Tất cả chương trước — build app production
- DevOps pillar (CI/CD đã học)

### Ước lượng độ dài

~1300-1400 dòng HTML (chương dài nhất, nhiều technical detail).

---

## Tổng kết outline Flutter

### Bảng tổng số dòng dự kiến

| Chương | Tên | Ước lượng dòng |
|---|---|---|
| 1 | Flutter Setup | 800-900 |
| 2 | Widget Tree & First App | 1000-1100 |
| 3 | Layout System | 1100-1200 |
| 4 | Material vs Cupertino, Theming | 1000-1100 |
| 5 | Navigation | 1200-1300 |
| 6 | State Management — setState & InheritedWidget | 1000-1100 |
| 7 | State Management — flutter_bloc | 1200-1300 |
| 8 | State Management — Provider/Riverpod/GetX | 1100-1200 |
| 9 | Forms & Input | 1100-1200 |
| 10 | Network — HTTP, Dio, Retrofit | 1200-1300 |
| 11 | Local Storage | 1100-1200 |
| 12 | Animation | 1100-1200 |
| 13 | Custom Paint & Render | 1000-1100 |
| 14 | Testing | 1100-1200 |
| 15 | Performance, Build & Deploy | 1300-1400 |
| **Tổng** | | **~16300-17800 dòng HTML** |

### Cộng tổng Programming Language pillar

- Dart: ~7250-8050 dòng (8 chương)
- Flutter: ~16300-17800 dòng (15 chương)
- **Tổng: ~23500-25800 dòng HTML** — lớn hơn DevOps (14 chương) nhưng nhỏ hơn 2 pillar lớn nhất

### Phụ thuộc giữa các chương

```
1 (Setup) → 2 (Widget Tree)
    ↓
    3 (Layout) → 4 (Theming) → 5 (Navigation)
                                   ↓
                                   6 (setState)
                                      ↓
                                      7 (Bloc) | 8 (Provider/Riverpod/GetX)
                                         ↓        ↓
                                         9 (Forms) — 10 (Network) — 11 (Storage)
                                                              ↓
                                                              12 (Animation)
                                                                 ↓
                                                                 13 (Custom Paint)
                                                                    ↓
                                                                    14 (Testing)
                                                                       ↓
                                                                       15 (Performance + Deploy)
```

- Chương 1, 2, 3, 4, 5: linear foundation
- Chương 6, 7, 8: state mgmt trio — chỉ cần chọn 1 path để follow, nhưng đọc cả 3 cho perspective
- Chương 9-15: build trên foundation, có thể đảo nhẹ thứ tự

### Quyết định locked (2026-05-19)

Cùng nguyên tắc với Dart outline:

1. **Material 3 first** — không dạy Material 2 syntax cũ
2. **State mgmt 3 chương riêng** — không đào sâu 1 lib, cho user perspective chọn
3. **Test là chương riêng** (chương 14) — không scatter test khắp chapter
4. **Performance + deploy gộp chương 15** — chương cuối lớn, OK
5. **Cupertino chỉ giới thiệu trong chương 4** — không có chương riêng (use case ít)
6. **GraphQL, gRPC chỉ mention không deep** — REST đủ chuẩn

### Style giáo trình

Theo `PLAN.md` đã lock:
- Tiếng Việt thuật ngữ đầy đủ ("Trừu tượng hóa", "Mở rộng", giữ Widget/Stream/Future)
- Theme sepia/warm low-contrast, khác Dart theme
- Embed DartPad/Flutter sample hoặc screenshot live preview
- 4-5 bài tập + 6-8 quiz mỗi chương
- Đáp án bài tập collapsible

### Bước tiếp theo

Sau khi outline Flutter locked → Phase 2:
1. Design + build shared CSS (typography, callout, code block, layout)
2. Build Dart theme + Flutter theme CSS (palette khác nhau)
3. Build 3 index.html
4. Update IT Basic root index thêm pillar 9
5. Bắt đầu Dart chuong1.html → Flutter chuong1.html song song
