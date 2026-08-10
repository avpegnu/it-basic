# Programming Language Pillar — Curriculum tổng

**Owner:** vietanh142004 (huyqh95@gmail.com)
**Started:** 2026-05-19
**Status:** ✅ **HOÀN THÀNH 100% — 45/45 chương, 4 sub-pillar đã ship (2026-05-20)**
- ✅ **Dart 8/8** (~7,745 dòng)
- ✅ **Flutter 15/15** (~16,460 dòng)
- ✅ **JavaScript 12/12** (8 JS core + 4 TypeScript, 14,722 dòng)
- ✅ **Python 10/10** (14,248 dòng)
- **Tổng: 45 chương / 53,175 dòng HTML** (vượt ước lượng ban đầu ~44,000)

## Mục tiêu

Xây dựng giáo trình tự học Dart + Flutter hoàn chỉnh, chính xác, chi tiết, làm thành **trụ cột thứ 9** trong `~/Developer/IT Basic/` cùng style với CLI/OOP/DevOps/etc.

User đã có nền: OOP, Design Patterns, Database, DevOps, CLI, OS, DSA, System Design (84 chương). Project này lấp gap **ngôn ngữ + framework** cụ thể.

## Cấu trúc folder

```
IT Basic/
└── Programming Language/
    ├── index.html              ← TOC chung của Programming Language pillar
    ├── docs/                   ← outline/spec docs
    │   ├── PLAN.md             ← bạn đang đọc
    │   ├── DART-OUTLINE.md     ← 8 chương Dart ✅
    │   ├── FLUTTER-OUTLINE.md  ← 15 chương Flutter ✅
    │   ├── JAVASCRIPT-OUTLINE.md ← 12 chương JS/TS (mới — chờ approve)
    │   └── PYTHON-OUTLINE.md   ← 10 chương Python (mới — chờ approve)
    ├── shared/
    │   ├── css/                ← style chung
    │   └── js/                 ← script chung
    ├── Dart/                   ✅ 8/8 chương
    │   ├── index.html
    │   ├── chuong/             ← chuong1.html → chuong8.html
    │   ├── css/                ← Dart theme: cream + dart blue
    │   └── js/
    ├── Flutter/                ✅ 15/15 chương
    │   ├── index.html
    │   ├── chuong/             ← chuong1.html → chuong15.html
    │   ├── css/                ← Flutter theme: sepia + flutter cyan
    │   └── js/
    ├── JavaScript/             📝 outline xong, chờ HTML
    │   ├── index.html          ← TBD
    │   ├── chuong/             ← chuong1.html → chuong12.html (TBD)
    │   ├── css/                ← TBD: warm beige + JS amber + TS blue
    │   └── js/                 ← TBD: JS playground + TS type playground
    └── Python/                 📝 outline xong, chờ HTML
        ├── index.html          ← TBD
        ├── chuong/             ← chuong1.html → chuong10.html (TBD)
        ├── css/                ← TBD: off-white + python blue + python yellow
        └── js/                 ← TBD: Pyodide playground
```

## Quyết định người dùng (locked)

| Câu hỏi | Đáp án |
|---|---|
| Cấu trúc | `Programming Language/Dart + Flutter + JavaScript + Python` (1 pillar, 4 sub-folder) |
| Phạm vi | **8 Dart + 15 Flutter + 12 JS/TS + 10 Python = 45 chương** |
| Workflow | **Outline (.md) trước → user approve → mới viết content HTML** |
| Style content | Giáo trình thuần + có ví dụ minh hoạ độc lập (KHÔNG tie-in project nào cụ thể) |
| Tốc độ | Chất lượng > tốc độ. Mỗi chương cần "chính xác, chi tiết" |
| JS+TS | Gộp 1 sub-folder "JavaScript" (8 JS core + 4 TS) — không tách 2 sub-folder |
| Python scope | Core Python đầy đủ (không bao gồm framework Django/FastAPI, không bao gồm data science) |
| Độ sâu JS/Python | Đầy đủ như Dart (full curriculum), không refresher gọn |

## Mục lục dự kiến — Dart (8 chương)

1. **Hello Dart** — chạy file Dart đầu tiên, REPL, tooling
2. **Variables & Types** — type system, var/final/const, type inference
3. **Functions & Control Flow** — function as first-class, closures, arrow, named/positional params
4. **Classes & Inheritance** — constructor, factory, getter/setter, mixin, abstract
5. **Null Safety & Error Handling** — sound null safety, ?/!/late, try/catch/Future error
6. **Collections & Iterables** — List/Set/Map, spread, where/map/reduce, lazy iterable
7. **Async, Future & Stream** — Future, async/await, Stream, Isolate (intro)
8. **Generics, Extension, Patterns** — generic class/method, extension methods, Dart 3 patterns/records/sealed

## Mục lục dự kiến — Flutter (15 chương)

1. **Flutter Setup** — install, fvm, IDE setup, `flutter doctor`, `flutter run`
2. **Widget Tree & First App** — runApp, MaterialApp, Scaffold, Stateless vs Stateful
3. **Layout System** — Row/Column, Flex, Stack, Expanded, Padding, Container, constraint flow
4. **Material vs Cupertino, Theming** — ThemeData, ColorScheme, typography, dark mode
5. **Navigation** — Navigator 1.0 (push/pop), Navigator 2.0 (Router/Pages), named routes, go_router
6. **State Management — setState & InheritedWidget** — local state, lifting state up
7. **State Management — flutter_bloc deep dive** — Cubit, Bloc, BlocProvider, BlocBuilder, BlocListener
8. **State Management — Provider / Riverpod / GetX** — so sánh, khi nào dùng cái nào
9. **Forms & Input** — TextField, Form, FormField, validator, FocusNode, keyboard handling
10. **Network — HTTP, Dio, Retrofit** — REST call, interceptor, error handling, model parsing
11. **Local Storage** — SharedPreferences, sqflite, hive, secure storage
12. **Animation** — implicit (AnimatedContainer), explicit (AnimationController), Hero, custom curves
13. **Custom Paint & Render** — CustomPainter, RenderObject, when to drop down to low-level
14. **Testing** — unit test, widget test, integration test, golden test, mocking
15. **Performance, DevTools, Build & Deploy** — flutter inspector, timeline, build apk/ipa/web

## Style giáo trình (lock — match conventions IT Basic)

- Tiếng Việt, **thuật ngữ đầy đủ** ("Trừu tượng hóa", "Bất biến", không cắt rút gọn). Giữ technical term tiếng Anh khi cần (Stream, Widget, Future).
- Mỗi chương HTML standalone, không cần build tool
- Font: Inter (body) + serif display (mỗi pillar có thể khác nhau) + JetBrains Mono (code)
- **Mỗi pillar có theme/màu/font/style RIÊNG** — Dart theme khác Flutter theme, không copy CLI/OOP
- **Tránh theme loud**: KHÔNG dùng CRT amber, KHÔNG Solarized Dark (đã thử, gây mỏi mắt). Ưu tiên **sepia/reading mode, low contrast, warm**, không glow, không scanline.
- Callout: 📘 (note), 💡 (tip), ⚠️ (warning), 🎯 (goal), 🧠 (mental model), 🔥 (gotcha)
- **Độ dài không cap** — chất lượng > độ dài. Tham khảo Chương 1 DSA (~600-900 dòng) làm baseline, dài hơn nếu cần đảm bảo độ sâu.
- **Bắt buộc cho mọi chương:**
  - Mục tiêu chương + lý do học
  - Lý thuyết chi tiết (không tóm tắt 1 dòng)
  - Code mẫu chạy được + comment giải thích
  - Visualizer / bảng so sánh / diagram khi áp dụng được
  - **4-5 bài tập** (có đề + gợi ý)
  - **6-8 quiz** có giải thích đáp án
  - Tổng kết cuối chương

## Theme đề xuất (sẽ confirm khi build CSS)

| Pillar | Concept | Color palette | Display font |
|---|---|---|---|
| **Dart** | "Modern + clean" (Dart logo bluish) | cream/off-white + dart blue accent + amber highlight | Fraunces hoặc Crimson Text |
| **Flutter** | "Playful + visual" (Flutter logo cyan/blue) | sepia paper + flutter cyan + electric blue | Recoleta hoặc DM Serif |

Cả 2 đều low-contrast, warm-ish, friendly cho đọc lâu.

## Interactive component đề xuất

| Pillar | Component |
|---|---|
| Dart | Code playground inline (textarea + "run" giả lập, hoặc link DartPad embed) |
| Flutter | Widget tree visualizer (SVG/HTML tree), layout sandbox |

## Roadmap thời gian (gợi ý)

| Tuần | Việc |
|---|---|
| Tuần 0 (đang làm) | Phase 1: structure + outlines + indexes |
| Tuần 1-2 | Dart chương 1-4 (HTML content) |
| Tuần 2-3 | Dart chương 5-8 |
| Tuần 3-4 | Flutter chương 1-5 |
| Tuần 4-6 | Flutter chương 6-15 |

## Cách tiếp tục từ project khác

Khi user mở Claude Code ở `~/Developer/IT Basic/` hoặc bất kỳ đâu khác, có thể tiếp tục bằng cách:

1. Mở/đọc file này: `~/Developer/IT Basic/Programming Language/docs/PLAN.md`
2. Đọc OUTLINE chi tiết: `DART-OUTLINE.md` và `FLUTTER-OUTLINE.md`
3. Check trạng thái: liệt kê file trong `Dart/chuong/` và `Flutter/chuong/` xem chương nào đã viết
4. Tiếp tục viết chương tiếp theo theo outline

## Checklist tiến độ tổng

- [x] Tạo folder structure
- [x] CSS shared style (shared/css/base.css + Dart/css/theme.css + Flutter/css/theme.css)
- [x] index.html — Programming Language pillar
- [x] index.html — Dart sub-pillar (roadmap 8 chương)
- [x] index.html — Flutter sub-pillar (roadmap 15 chương, 4 phase grouping)
- [x] DART-OUTLINE.md (8 chương · 872 dòng) — locked 2026-05-19
- [x] FLUTTER-OUTLINE.md (15 chương · 1624 dòng) — locked 2026-05-19
- [x] Update IT Basic/index.html thêm Pillar 9 card + stats 9 trụ cột/107 chương/90k+ dòng
- [x] User approve outline → Phase 2 (viết HTML content) — đã ship đầy đủ

## Dart chapters status — ✅ HOÀN THÀNH 8/8 (2026-05-19)

- [x] chuong1.html — Hello Dart (855 dòng)
- [x] chuong2.html — Variables & Types (890 dòng)
- [x] chuong3.html — Functions & Control Flow (940 dòng)
- [x] chuong4.html — Classes & Inheritance (1010 dòng)
- [x] chuong5.html — Null Safety & Error Handling (910 dòng)
- [x] chuong6.html — Collections & Iterables (950 dòng)
- [x] chuong7.html — Async, Future & Stream (1150 dòng)
- [x] chuong8.html — Generics, Extension, Patterns (1040 dòng)

**Tổng Dart:** ~7,745 dòng HTML — vượt ước lượng 7,250-8,050.

## Flutter chapters status — ✅ HOÀN THÀNH 15/15 (2026-05-20)

- [x] chuong1.html — Flutter Setup (~870 dòng)
- [x] chuong2.html — Widget Tree & First App (~1050 dòng)
- [x] chuong3.html — Layout System (~1100 dòng)
- [x] chuong4.html — Material vs Cupertino, Theming (~1020 dòng)
- [x] chuong5.html — Navigation (~1170 dòng)
- [x] chuong6.html — setState & InheritedWidget (~1020 dòng)
- [x] chuong7.html — flutter_bloc Deep Dive (~1230 dòng)
- [x] chuong8.html — Provider/Riverpod/GetX (~1110 dòng)
- [x] chuong9.html — Forms & Input (~1080 dòng)
- [x] chuong10.html — Network: HTTP, Dio, Retrofit (~1170 dòng)
- [x] chuong11.html — Local Storage (~1090 dòng)
- [x] chuong12.html — Animation (~1090 dòng)
- [x] chuong13.html — Custom Paint & Render (~990 dòng)
- [x] chuong14.html — Testing (~1090 dòng)
- [x] chuong15.html — Performance, Build & Deploy (~1280 dòng)

**Tổng Flutter:** ~16,460 dòng HTML — gần exact ước lượng 16,300-17,800.

## Tổng kết Pillar 9 (HOÀN THÀNH 2026-05-20)

### 4 sub-pillar đã ship
- **Dart:** 8 chương · ~7,745 dòng (Cream + Dart blue, font Crimson Pro)
- **Flutter:** 15 chương · ~16,460 dòng (Sepia + Cyan, font DM Serif Display)
- **JavaScript:** 12 chương · ~14,500 dòng (Warm beige + JS amber + TS blue, font Fraunces)
  - 8 chương JS core (chương 1-8) + 4 chương TypeScript (chương 9-12)
- **Python:** 10 chương · ~14,000 dòng (Off-white + Python blue + yellow, font Source Serif 4)

### Tổng
- **45 chương · ~52,700 dòng HTML**
- 4 sub-pillar với theme + interactive component riêng biệt
- 4 outline MD (~5,000 dòng): DART, FLUTTER, JAVASCRIPT, PYTHON
- Infrastructure: 5 index.html + shared CSS/JS + 4 theme CSS + 2 playground JS (JS + Python/Pyodide)
- 200+ bài tập + quiz có giải thích đáp án

## JavaScript chapters status — ✅ HOÀN THÀNH 12/12 (2026-05-20)

8 chương JS core + 4 chương TypeScript:

- [x] chuong1.html — Hello JavaScript (Node, browser, npm, Vite intro)
- [x] chuong2.html — Variables, Types & Coercion (let/const, == vs ===, gotchas)
- [x] chuong3.html — Functions, Scope & Closures (4 cách định nghĩa, this, closure)
- [x] chuong4.html — Objects, Prototypes & Classes (prototype chain, class syntax, private #)
- [x] chuong5.html — Arrays, Iterables & Iteration Protocols (map/filter/reduce, generator, Set/Map)
- [x] chuong6.html — Async JS (event loop, Promise, async/await, microtask)
- [x] chuong7.html — Error Handling & Defensive Patterns (Result type, custom Error class)
- [x] chuong8.html — Modules, Bundlers & Runtime (ESM vs CJS, Vite, tree-shake)
- [x] chuong9.html — TypeScript Type System Foundations (primitive, union, narrowing, type vs interface)
- [x] chuong10.html — TypeScript Generics & Utility Types (Partial/Pick/Omit/Record, custom utility)
- [x] chuong11.html — TypeScript Advanced Types (conditional, infer, mapped, template literal)
- [x] chuong12.html — TypeScript Compiler, Tooling & Practical (tsconfig, .d.ts, typed fetch)

## Python chapters status — ✅ HOÀN THÀNH 10/10 (2026-05-20)

10 chương Python core:

- [x] chuong1.html — Hello Python (pyenv, venv, uv, pyproject.toml, PEP 8)
- [x] chuong2.html — Variables, Types & Operators (int arbitrary precision, f-string, immutability)
- [x] chuong3.html — Data Structures (list/tuple/dict/set, comprehension, collections module)
- [x] chuong4.html — Control Flow & Functions (match/case, *args/**kwargs, LEGB scope)
- [x] chuong5.html — OOP in Python (dunder, @property, @dataclass, Protocol, duck typing)
- [x] chuong6.html — Iterators, Generators & Itertools (yield, lazy eval, infinite, itertools toolbox)
- [x] chuong7.html — Decorators & Context Managers (@wraps, @lru_cache, with, @contextmanager)
- [x] chuong8.html — Async Python (asyncio, async/await, GIL, httpx async)
- [x] chuong9.html — Typing & Static Analysis (mypy strict, Protocol, Generic PEP 695, TypedDict)
- [x] chuong10.html — Testing, Packaging & Tooling (pytest, fixture, ruff, pyproject build, PyPI publish)

## Roadmap mở rộng (2026-05-20 trở đi)

Sau khi user approve 2 outline mới, thứ tự đề xuất:

1. **JavaScript trước** (12 chương) — user có nền JS/TS sẵn, học vừa nhẹ tay vừa lấp gap chính quy
2. **Python sau** (10 chương) — học từ zero, không có nền sẵn → cần focus và thời gian
3. (Sau đó nếu muốn mở rộng): Go, Rust, hoặc framework (Django/FastAPI/Next.js) thành Pillar 10
