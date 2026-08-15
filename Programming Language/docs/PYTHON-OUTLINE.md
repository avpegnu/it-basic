# Python Curriculum — Outline chi tiết 10 chương (Core Python)

**Sub-pillar:** Python (thuộc Programming Language pillar — trụ cột 9 của IT Basic)
**Số chương:** 14 (Core Python — không bao gồm framework như Django/FastAPI hay data science)
**Phiên bản target:** Python 3.12+ (PEP 695 generic syntax, exception groups, match statement đã ổn định)
**Started:** 2026-05-20
**Mở rộng:** 2026-08-14 — từ 10 lên 14 chương
**Status:** ✅ Hoàn thành — 14 chương / ~20.800 dòng HTML

---

## ⚠️ Lưu ý về đánh số chương (cập nhật 2026-08-14)

Curriculum ban đầu 10 chương thiếu năm mảng nền tảng: xử lý ngoại lệ, module & package, xử lý tệp
tin, biểu thức chính quy, và dự án thực chiến. Bốn chương mới đã được chèn vào và các chương cũ được
đánh số lại:

| Chương mới | Nội dung | Tương ứng chương cũ |
|---|---|---|
| 1 | Hello Python | 1 *(bổ sung mục 4.1 — Chú thích & docstring)* |
| 2 | Variables, Types & Operators | 2 *(bổ sung mục 6 — Nhập/Xuất, mục 11 — Bảng toán tử đầy đủ)* |
| 3 | Data Structures | 3 |
| 4 | Control Flow & Functions | 4 |
| **5** | **Exceptions & Error Handling** | 🆕 mới |
| **6** | **Modules & Packages** | 🆕 mới |
| **7** | **File I/O & Regex** | 🆕 mới |
| 8 | OOP in Python | 5 *(bổ sung mục 8 — Đóng gói & name mangling)* |
| 9 | Iterators, Generators & Itertools | 6 |
| 10 | Decorators & Context Managers | 7 |
| 11 | Async Python | 8 |
| 12 | Typing & Static Analysis | 9 |
| 13 | Testing, Packaging & Tooling | 10 |
| **14** | **Dự án thực chiến** | 🆕 mới |

**Bốn chương mới:**

- **Chương 5 — Exceptions & Error Handling** (~1.522 dòng): cơ chế gỡ ngăn xếp, cây phân cấp
  exception, bộ tứ `try`/`except`/`else`/`finally`, `raise ... from ...`, custom exception mang dữ
  liệu, EAFP vs LBYL và TOCTOU, đọc traceback, năm anti-pattern, `ExceptionGroup`/`except*` (3.11+),
  `assert`/`warnings`/`log.exception`.
- **Chương 6 — Modules & Packages** (~1.359 dòng): module = một file, bốn dạng `import`, cơ chế
  import bốn bước và `sys.modules` cache, `__name__ == "__main__"` và ba lý do bắt buộc,
  `__init__.py`/`__all__`/`__main__.py`, absolute vs relative import, `sys.path` và bẫy shadowing,
  `python -m`, src layout, circular import với bốn cách gỡ, bản đồ stdlib.
- **Chương 7 — File I/O & Regex** (~1.551 dòng): bảng chế độ mở tệp đầy đủ, `with`, bốn cách đọc,
  encoding và BOM, `pathlib`, JSON (`ensure_ascii=False`), CSV (`newline=""`, `utf-8-sig`), toàn bộ
  module `re` (cú pháp, tham lam vs lười, nhóm có tên, bảy hàm, cờ, `VERBOSE`), khi nào không dùng
  regex và rủi ro ReDoS.
- **Chương 14 — Dự án thực chiến** (~1.409 dòng): ranh giới script/sản phẩm, `argparse` với
  sub-command, mẫu "lập kế hoạch / thực thi" cho `--dry-run` miễn phí, thu thập dữ liệu web đúng mực
  (`robots.txt`, rate limit), REST API với retry đúng loại lỗi, `sqlite3` và chống SQL injection,
  cron với bốn cái bẫy môi trường, checklist chất lượng 12 mục.

## Mục đích của file này

File này là **bản thiết kế chi tiết** (spec) cho 10 chương Python. Khi sang Phase 2 (viết HTML), mỗi chương được viết bằng cách **mở rộng** outline tương ứng — không cần thiết kế lại scope, không cần quyết định lại nội dung gì có/không có.

Mỗi chương trong outline này gồm:
- **Mục tiêu chương** — học xong làm được gì
- **Lý do học** — vì sao chương này quan trọng cho roadmap tổng
- **Prerequisites** — cần đọc chương nào trước
- **Sections** — các section con cụ thể trong chương
- **Key concepts** — list khái niệm bắt buộc phải cover
- **Code examples** — kịch bản ví dụ cụ thể sẽ dùng
- **Visualizer / diagram** — hình ảnh/bảng/sơ đồ cần vẽ
- **4-5 bài tập** — đề + định hướng giải
- **6-8 quiz** — câu hỏi + đáp án + lý do
- **Connects to** — chương khác sẽ sử dụng kiến thức này
- **Ước lượng độ dài** — số dòng HTML dự kiến

## Triết lý chung của curriculum Python

1. **Python 3.12+ first** — không dạy Python 2 (đã EOL từ 2020). Tận dụng feature mới: type hint syntax PEP 695, `match` statement, exception groups, f-string đầy đủ.
2. **Pythonic idioms** — không dạy "Java in Python". Ưu tiên: comprehension over loop, EAFP (Easier to Ask Forgiveness than Permission) over LBYL (Look Before You Leap), duck typing over isinstance check.
3. **Type hints first-class** — không coi typing là feature optional. Từ chương 2 đã introduce, chương 9 đi sâu mypy/Protocol/Generic. Mọi code example có type hints.
4. **Standard library trước framework** — Python's "batteries included" là USP. Hiểu `os`, `pathlib`, `json`, `re`, `itertools`, `functools`, `collections`, `asyncio` trước khi thêm pip dependency.
5. **So sánh JS/TS khi có ích** — user có nền JS/TS, mention điểm tương đồng/khác biệt: list ≈ array, dict ≈ object, decorator ≈ HOC, async/await syntax giống JS (semantics khác do GIL).
6. **Tooling modern** — ưu tiên `uv` (recommended 2024+) hoặc `poetry` cho dependency. `pytest` cho test. `ruff` cho lint + format (thay flake8 + black). `mypy` cho type check.

---

## Chương 1 — Hello Python

### Mục tiêu chương

Học xong chương 1, người đọc sẽ:
- Cài Python 3.12+ trên macOS qua `pyenv` (recommended) hoặc Homebrew
- Hiểu khái niệm "virtual environment" và tại sao luôn dùng — không cài package global
- Chạy được file `.py` đầu tiên bằng `python file.py` và REPL bằng `python`
- Biết các tool baseline: `pip`, `venv`, `uv` (modern), `pyenv`
- Hiểu PEP — Python Enhancement Proposal, có PEP 8 (style), PEP 20 (Zen of Python), PEP 257 (docstring)
- Setup được project mini với `uv init` hoặc `python -m venv .venv`

### Lý do học

Đây là chương "lên xe". Đặc biệt với Python, việc setup virtualenv đúng từ đầu cực kỳ quan trọng — nhiều người mới Python bị bug "package version conflict" do install global tất cả. Chương này khoá thói quen tốt.

### Prerequisites

Không có — chương khởi đầu. Giả định người đọc đã dùng terminal cơ bản (tham khảo trụ cột CLI nếu cần).

### Sections

1. **Python là gì** — Lịch sử (Guido van Rossum, 1991), triết lý (PEP 20), ai dùng Python (Google, Instagram, NASA, OpenAI, data science). Vị trí Python: scripting, data, ML, web backend, automation.
2. **Cài Python — pitfall hay gặp** — macOS đã có Python 2 cũ rồi Python 3 (Apple ships). Không nên dùng python system. Recommend `pyenv` (manage nhiều version) hoặc Homebrew (đơn giản hơn). Windows: official installer. Linux: hầu hết đã sẵn.
3. **REPL — Python interactive** — `python` hoặc `python3` mở REPL. Test expression nhanh. Exit: `exit()` hoặc Ctrl+D. Bonus: `ipython` REPL nâng cao.
4. **Hello World** — File `hello.py`: `print('Xin chào Python')`. Chạy: `python hello.py`. Đọc args qua `sys.argv` (chương 4 sâu hơn).
5. **Virtual environment — vì sao cần** — Python cài package global mặc định (qua pip). Khi project A cần `requests==2.0` và project B cần `requests==2.30` → conflict. Venv tạo môi trường biệt lập cho mỗi project.
6. **Tạo venv với `python -m venv`** — Built-in. `python -m venv .venv`, activate `.venv/bin/activate` (Unix) hoặc `.venv\Scripts\activate` (Windows), deactivate bằng `deactivate`. Lưu ý: thêm `.venv` vào `.gitignore`.
7. **`uv` — tool modern (2024+)** — Cài bằng `curl -LsSf https://astral.sh/uv/install.sh | sh`. `uv init` tạo project, `uv add requests` thêm dep, `uv run python file.py` chạy với venv tự động. Cực nhanh (Rust). Recommend cho project mới.
8. **`pip` cơ bản** — `pip install <pkg>`, `pip install -r requirements.txt`, `pip freeze > requirements.txt`. PyPI là registry (pypi.org).
9. **`pyproject.toml` — modern manifest** — Tương đương `package.json`. Chứa metadata + dependency. Standard PEP 621. uv/poetry/hatch đều dùng.
10. **PEP 8 và Zen of Python** — Style guide chính thức. `import this` trong REPL in ra Zen of Python (19 nguyên tắc thiết kế). Highlight: "There should be one obvious way to do it", "Readability counts".
11. **IDE setup** — VS Code + Python extension (Pylance) là default tốt. PyCharm Community/Pro chuyên Python. Setup: format on save với `ruff`, type check với `mypy` hoặc Pylance strict.
12. **Compile mode** — Python KHÔNG compile sang executable. Nó "compile" sang bytecode `.pyc` ngầm (cache trong `__pycache__/`), rồi interpret. Khác Dart/C/Go AOT compile.

### Key concepts

- Python là interpreted, dynamic, garbage-collected, multi-paradigm
- Mỗi project Python NÊN có venv riêng — đây là quy tắc bất di bất dịch
- `pyproject.toml` là modern, `setup.py` là cũ
- `uv` là tool 2024+ recommended, `pip + venv` là baseline ai cũng nên biết
- Python "compile" ra bytecode runtime, không phải binary

### Code examples

1. `hello.py` — `print('Xin chào Python')`
2. `greet.py` — `import sys; name = sys.argv[1] if len(sys.argv) > 1 else 'bạn'; print(f'Xin chào, {name}')`
3. Demo `python -m venv .venv` từng bước
4. Demo `uv init my-app && cd my-app && uv add requests && uv run python -c "import requests; print(requests.__version__)"`
5. `pyproject.toml` mẫu cho mini app

### Visualizer / diagram

- Sơ đồ Python toolchain: source `.py` → bytecode `.pyc` → CPython interpreter
- Bảng so sánh `pip + venv` vs `uv` vs `poetry`
- Visual project tree với venv: `.venv/`, `pyproject.toml`, `.python-version`, `src/`
- Bảng "khi nào dùng tool nào"

### Bài tập (5)

1. Cài Python 3.12 qua pyenv. Chạy `python --version` confirm.
2. Tạo venv, activate, cài `requests`, chạy file `fetch.py` GET `https://httpbin.org/get` và in response. Deactivate. Cài lại `requests` ngoài venv → bug "global pollution".
3. Setup `uv` mới, `uv init`, viết `greet.py` đọc tên qua args, in greeting. Chạy bằng `uv run python greet.py`.
4. Đọc `pyproject.toml` của 3 package phổ biến trên PyPI (vd: `requests`, `httpx`, `pytest`). Note các field `name`, `version`, `dependencies`, `requires-python`.
5. Chạy `import this` trong REPL. Đọc Zen of Python. Pick 3 nguyên tắc bạn thấy thú vị, comment 1-2 câu vì sao.

### Quiz (7)

1. macOS đã có Python sẵn, sao không dùng? — Đó là Python system của OS, dùng cho tooling Apple. Cài/sửa package vào nó có thể làm hỏng OS tool. Luôn dùng `pyenv` hoặc Homebrew Python.
2. Virtual environment giải quyết vấn đề gì? — Package conflict giữa projects. Mỗi project có deps version riêng, không can thiệp lẫn nhau.
3. `pip` và `uv` khác gì? — `pip` là tool cài package mặc định, sync, mature. `uv` mới, viết bằng Rust, nhanh hơn pip 10-100x, bao gồm cả venv management. Tương lai mặc định.
4. `.python-version` là gì? — File text chứa version Python project mong muốn (vd `3.12.4`). `pyenv` đọc file để switch version tự động khi vào folder.
5. Python "compile" không? — Có compile ngầm sang bytecode (`.pyc`), nhưng vẫn cần Python interpreter để chạy. Khác AOT compile của Dart/C/Go ra binary chạy độc lập.
6. Sao cần `python -m pip` thay vì `pip` đôi khi? — Để chắc chắn dùng pip của Python interpreter cụ thể, tránh confuse khi có nhiều version Python.
7. Khi commit code, có nên commit `.venv/` không? — Không. `.venv/` chứa binary + package phụ thuộc OS. Commit `pyproject.toml` / `requirements.txt` để người khác recreate venv.

### Connects to

- Chương 2 trở đi — mọi ví dụ giả định chạy được trong venv
- CLI pillar — pyenv, venv là CLI tooling
- DevOps pillar — Docker hoá Python app (mỗi container có venv riêng)

### Ước lượng độ dài

~700-800 dòng HTML.

---

## Chương 2 — Variables, Types & Operators

### Mục tiêu chương

Học xong chương 2, người đọc sẽ:
- Sử dụng các built-in primitive type: `int`, `float`, `str`, `bool`, `bytes`, `None`
- Hiểu Python `int` không bị overflow (arbitrary precision), khác JS number / Dart int
- Sử dụng f-string thành thạo: `f'name={name}'`, format spec, expression bên trong
- Phân biệt immutable (int, str, tuple, frozenset) vs mutable (list, dict, set) — implication về copy, hash, default arg
- Biết comparison operator: `==` (value), `is` (identity), `in` (membership), chain comparison `a < b < c`
- Sử dụng type hints cơ bản: `x: int = 5`, `name: str = 'An'`
- Hiểu truthy/falsy của Python (`0`, `''`, `[]`, `{}`, `None`, `False` đều falsy)

### Lý do học

Type system của Python rất linh hoạt (duck typing) nhưng có gotcha riêng (immutability, identity vs equality). Hiểu để viết code an toàn và tận dụng type hints như tài liệu.

### Prerequisites

Chương 1.

### Sections

1. **Khai báo biến** — `x = 5`. Không cần `let`/`var`/type. Python dynamic typing. Convention: `snake_case`. Constant: `UPPER_CASE` (chỉ convention, không enforce).
2. **`int` — arbitrary precision** — `2 ** 100` ra số ~10^30, không overflow. Khác JS (`Number.MAX_SAFE_INTEGER`), khác Dart (`int` 64-bit). Trade-off: chậm hơn cho số rất lớn.
3. **`float` — IEEE 754 double** — Giống JS/Dart. `0.1 + 0.2 = 0.30000000000000004`. Dùng `decimal.Decimal` cho tính tiền chính xác, `fractions.Fraction` cho phân số chính xác.
4. **`str` — Unicode mặc định** — Python 3 string là Unicode (khác Python 2 ASCII default). Indexing `s[0]`, slicing `s[1:3]`, immutable (`s[0] = 'a'` lỗi). Methods: `upper`, `lower`, `strip`, `split`, `join`, `replace`, `startswith`, `find`.
5. **f-string** — `f'name={name}, age={age + 1}'`. Format spec: `f'{x:.2f}'` (2 decimal), `f'{x:>10}'` (right-align width 10), `f'{x:,}'` (thousands separator). Python 3.12+: f-string có thể nest nhau và dùng full expression.
6. **`bool` — subclass của int** — `True == 1`, `False == 0`. `True + True == 2`. Chỉ Python.
7. **`None` — singleton** — Tương đương `null` của JS / Dart. Có 1 và chỉ 1 `None`. Check: `x is None` (KHÔNG `x == None`, dù work).
8. **Immutable vs mutable** — `int`, `float`, `str`, `tuple`, `frozenset`, `bytes` immutable. `list`, `dict`, `set`, `bytearray` mutable. Implication: pass mutable vào function có thể bị modify, dùng làm dict key chỉ được nếu immutable + hashable.
9. **Reference semantics** — Python "name → object". `a = [1, 2]; b = a; b.append(3)` → `a == [1, 2, 3]` vì cùng object. `import copy` cho `copy.copy` (shallow) hoặc `copy.deepcopy` (deep).
10. **Comparison: `==` vs `is`** — `==` value equality (call `__eq__`). `is` identity (same object id). `5 == 5.0 → True`, `5 is 5.0 → False`. Chỉ dùng `is` với `None`, `True`, `False`, sentinel.
11. **`in` operator** — Membership test. `'a' in 'abc' → True`, `1 in [1, 2, 3] → True`, `'key' in dict → True`. O(n) cho list, O(1) cho set/dict.
12. **Chain comparison** — `0 < x < 10`. Tương đương `0 < x and x < 10` nhưng `x` chỉ eval 1 lần. Đẹp hơn JS/Dart.
13. **Type hints cơ bản** — `name: str = 'An'`, `age: int = 25`. Không enforce runtime, chỉ hint cho IDE/mypy. Sâu hơn ở chương 9.

### Key concepts

- Python int không overflow (arbitrary precision)
- Mọi giá trị là object — `(5).bit_length()` work
- Immutable vs mutable quyết định behavior khi pass, copy, hash
- `is` ≠ `==` — đừng nhầm
- Type hints là metadata, không enforce runtime
- f-string là cú pháp format khuyên dùng (thay `'%s' % x`, `'{}'.format(x)`)

### Code examples

1. Demo `2 ** 100` — số rất lớn không overflow
2. Demo f-string format spec với 10 ví dụ
3. Bug ẩn: function có default arg là `[]` — call nhiều lần share cùng list (mutable default trap)
4. Demo `==` vs `is`: `a = [1,2]; b = [1,2]; print(a == b, a is b)` → `True False`
5. Chain comparison: `0 <= score <= 100`

### Visualizer / diagram

- Bảng built-in types Python với immutable flag, ví dụ
- Diagram "name → object" memory model (vẽ name là pointer tới object)
- Bảng so sánh `==` vs `is` với case ví dụ
- Bảng truthy/falsy Python

### Bài tập (5)

1. Viết function `format_money(amount: float, currency: str) -> str` trả về string format kiểu '$1,234.56' (US) hoặc '1.234,56 €' (EU tuỳ currency). Dùng f-string format spec.
2. Mutable default trap: viết function `add_item(item, items=[])` rồi gọi 3 lần với item khác nhau, không truyền items. Quan sát bug. Sửa bằng `items=None` + `if items is None: items = []`.
3. Đoán output không chạy: `a = 256; b = 256; print(a is b)` và `a = 257; b = 257; print(a is b)`. Python cache integer nhỏ (-5 to 256). Test với string short cũng vậy.
4. Viết function `is_palindrome(s: str) -> bool` check chuỗi đối xứng (ignore case, ignore non-alphanumeric). Test với 'A man a plan a canal Panama'.
5. Viết function `compare(a, b) -> int` trả -1 nếu a < b, 0 nếu a == b, 1 nếu a > b. Dùng chain comparison.

### Quiz (7)

1. `True + True` trả gì? — `2`. Vì `bool` là subclass `int`, `True == 1`.
2. `[] == []` và `[] is []` trả gì? — `True` và `False`. List khác nhau là object khác nhau (identity), nhưng cùng value (equality).
3. `'abc' * 3` trả gì? — `'abcabcabc'`. Python overload `*` với string = repeat.
4. Sao `x = 0.1 + 0.2; x == 0.3` False? — IEEE 754 không biểu diễn 0.1 và 0.2 chính xác. Dùng `math.isclose(x, 0.3)` hoặc `decimal.Decimal`.
5. `len('café')` trả gì? — `4` (Python 3 đếm Unicode character đúng). Python 2 sẽ trả `5` (đếm byte UTF-8).
6. `0 < x < 10 < y` chain compare work không? — Có. Tương đương `0 < x and x < 10 and 10 < y`. Python cho chain bất kỳ.
7. `x: int = '5'` — runtime có lỗi không? — Không! Type hint không enforce. Cần `mypy` để check tĩnh.

### Connects to

- Chương 3 (Data structures) — list/tuple/dict tạo từ syntax + cách dùng
- Chương 9 (Typing) — type hints sâu
- Dart Chương 2 — đối chiếu int infinite của Python với int 64-bit Dart

### Ước lượng độ dài

~800-900 dòng HTML.

---

## Chương 3 — Data Structures: list, tuple, dict, set

### Mục tiêu chương

Học xong chương 3, người đọc sẽ:
- Sử dụng thành thạo 4 collection chính: `list` (mutable sequence), `tuple` (immutable sequence), `dict` (key-value), `set` (unique unordered)
- Hiểu khi nào dùng cái nào: list (order, allow dup), tuple (fixed, return multiple), dict (lookup by key), set (uniqueness, math operation)
- Sử dụng comprehension cho list/dict/set/generator
- Dùng slicing nâng cao: `s[::-1]` reverse, `s[::2]` step
- Dùng `collections` stdlib: `Counter`, `defaultdict`, `deque`, `OrderedDict`, `namedtuple`
- Hiểu performance: O(1) cho dict/set lookup, O(n) cho list, O(1) cho append + O(n) cho insert/delete giữa
- Hiểu dict ordered theo insertion (Python 3.7+ guaranteed)

### Lý do học

Data structure là công cụ hằng ngày. Chọn đúng cấu trúc = code nhanh + đọc dễ. Comprehension là một trong những syntax đẹp nhất của Python, master nó = code Pythonic ngay.

### Prerequisites

Chương 1-2.

### Sections

1. **List — mutable sequence** — `[1, 2, 3]`. Method: `append`, `extend`, `insert`, `pop`, `remove`, `sort`, `reverse`, `index`, `count`. `list(iterable)` để convert.
2. **Tuple — immutable sequence** — `(1, 2, 3)` hoặc `1, 2, 3` (comma đủ). Method ít: chỉ `count`, `index`. Hashable → dùng làm dict key. Phân biệt `(1,)` (tuple 1 phần tử) vs `(1)` (chỉ là int 1).
3. **Tuple unpacking** — `x, y = 1, 2`, swap `a, b = b, a`. Function return nhiều giá trị: `def get_user(): return name, age`. Star unpack: `first, *rest = [1, 2, 3, 4]` → `first=1, rest=[2,3,4]`.
4. **Dict — key-value map** — `{'a': 1, 'b': 2}`. Key phải hashable (immutable). Truy cập: `d['a']` (KeyError nếu thiếu), `d.get('a', default)` (an toàn). Method: `keys`, `values`, `items`, `pop`, `update`, `setdefault`.
5. **Dict ordered từ 3.7+** — Trước 3.7 không order. Từ 3.7 ordered theo insertion. Không cần `OrderedDict` nữa (chỉ khi muốn `move_to_end` method).
6. **Set — unique unordered** — `{1, 2, 3}` (note: `{}` là dict, không phải set rỗng — dùng `set()`). Math op: `a | b` union, `a & b` intersection, `a - b` difference, `a ^ b` symmetric diff. Method: `add`, `remove`, `discard` (no error), `union`, `intersection`.
7. **Frozenset — set immutable** — `frozenset({1, 2, 3})`. Hashable → dùng làm dict key hoặc set element.
8. **Slicing** — `s[start:stop:step]`. `[::-1]` reverse, `[::2]` mọi index chẵn, `[-3:]` 3 phần tử cuối. Apply cho list, tuple, string, bytes.
9. **Comprehension** — List: `[x**2 for x in range(10)]`. With filter: `[x for x in range(10) if x % 2 == 0]`. Nested: `[[x*y for y in range(3)] for x in range(3)]`. Dict: `{x: x**2 for x in range(5)}`. Set: `{x % 5 for x in range(20)}`. Generator: `(x**2 for x in range(10))` — lazy.
10. **`collections.Counter`** — `Counter('mississippi')` → `Counter({'s': 4, 'i': 4, ...})`. Method `most_common(n)`, `+`, `-`, `subtract`. Cực hữu ích cho frequency count.
11. **`collections.defaultdict`** — Dict tự tạo default khi key chưa có. `dd = defaultdict(list); dd['a'].append(1)` — không cần check key tồn tại.
12. **`collections.deque`** — Double-ended queue. `appendleft`, `popleft` O(1) (list `insert(0)` O(n)). Dùng cho queue, sliding window.
13. **`collections.namedtuple` và `dataclass`** — Namedtuple tạo tuple subclass có tên field. Dataclass (chương 5) là cách modern hơn.

### Key concepts

- 4 collection chính có trade-off khác nhau — chọn theo use case
- Comprehension thay loop trong nhiều case, đọc dễ hơn
- Dict/Set lookup O(1) trung bình (hash table), list O(n)
- Tuple immutable + hashable → key dict
- `collections` stdlib có nhiều structure chuyên dụng

### Code examples

1. List comprehension 5 use case: square, filter, transform string, flatten 2D, conditional value
2. Dict comprehension build: invert dict, group by, count
3. Set operation: tìm chung 2 list, tìm duplicate, unique
4. `Counter` cho word frequency trong file
5. `defaultdict(list)` group by — vs viết manually với `if key not in d`

### Visualizer / diagram

- Bảng 4 collection chính với column: mutable, ordered, allow dup, lookup time, use case
- Diagram slicing với ví dụ visual (chuỗi với highlight start/stop/step)
- Visualizer comprehension: source → filter → transform → output
- Bảng `collections` module với mỗi tool + when use

### Bài tập (5)

1. Viết function `count_vowels(s: str) -> dict[str, int]` đếm số vowel trong string. Dùng `Counter` so với dict manual — so sánh độ ngắn.
2. Viết function `group_by_first_letter(words: list[str]) -> dict[str, list[str]]` — group word theo chữ cái đầu. Dùng `defaultdict`.
3. Cho list `[3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]`, dùng comprehension + set lấy unique sorted descending.
4. Implement `flatten(lst: list)` — flatten list lồng nhau N level. Recursive + comprehension.
5. Implement sliding window: `def windows(arr: list, size: int) -> list[list]` — trả về mảng các sub-array size cố định. Vd `windows([1,2,3,4], 2) = [[1,2], [2,3], [3,4]]`. So sánh dùng `deque` vs index loop.

### Quiz (8)

1. `{}` tạo gì? — Dict rỗng, không phải set. Set rỗng phải dùng `set()`.
2. `(1)` và `(1,)` khác gì? — `(1)` là int 1 (dấu ngoặc chỉ grouping). `(1,)` là tuple 1 phần tử.
3. List comprehension và generator expression khác gì? — List `[x for x in ...]` tạo list ngay (eager). Generator `(x for x in ...)` lazy, mỗi lần `next()` mới sinh phần tử.
4. Tại sao set lookup nhanh hơn list? — Set hash table O(1) avg, list scan tuyến tính O(n).
5. `dict.get('key')` và `dict['key']` khác gì? — `get` return None (hoặc default truyền vào) nếu key không có. `[]` raise KeyError.
6. Có thể dùng list làm key dict không? — Không. List mutable → không hashable. Tuple được vì immutable.
7. `sorted(lst)` và `lst.sort()` khác gì? — `sorted` return list mới, không mutate. `.sort()` in-place, return None.
8. Tại sao Python 3.7+ guarantee dict ordered? — Implementation detail (CPython) từ 3.6 đã ordered, 3.7 chính thức vào spec. Trước đó coi như unordered.

### Connects to

- Chương 4 — comprehension dùng nhiều trong control flow
- Chương 6 — generator expression là chủ đề chương sau
- Dart Chương 6 — đối chiếu List/Map/Set Dart với Python

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 4 — Control Flow & Functions

### Mục tiêu chương

Học xong chương 4, người đọc sẽ:
- Sử dụng `if`/`elif`/`else` và `match`/`case` (Python 3.10+)
- Loop: `for`, `while`, `break`, `continue`, `else` clause của loop (đặc thù Python)
- Định nghĩa function với `def`, type hints, default args, `*args`, `**kwargs`
- Hiểu scope LEGB (Local, Enclosing, Global, Built-in), `global` và `nonlocal` keyword
- Sử dụng lambda function cho callback ngắn
- Hiểu argument passing: positional, keyword, positional-only (`/`), keyword-only (`*`)
- Hiểu pass-by-object-reference của Python (khác pass-by-value/reference)

### Lý do học

Control flow + function là kỹ năng core của mọi ngôn ngữ. Python có một số điểm đặc biệt (loop có else, `match` mới ra, scope LEGB) cần master để viết code Pythonic.

### Prerequisites

Chương 1-3.

### Sections

1. **`if`/`elif`/`else`** — Cú pháp Python: indent (4 space chuẩn PEP 8). Không có ternary `?:`, dùng `x if cond else y`. Truthy/falsy của Python apply ngay.
2. **`match`/`case` (Python 3.10+)** — Structural pattern matching. Hơn switch của ngôn ngữ khác: match shape của data. `case [1, 2, *rest]`, `case {'name': name}`, `case Point(x=0, y=0)`.
3. **`for` loop** — `for x in iterable:`. Iterable: list, tuple, string, dict (loop key), file, generator. `enumerate(lst)` cho cả index + value, `zip(a, b)` ghép 2 iterable.
4. **`while` loop** — `while condition:`. Ít dùng hơn `for` trong Python. Use case: loop đến khi gặp điều kiện (input, network).
5. **`break`, `continue`** — Giống ngôn ngữ khác. Tip: dùng để giảm nesting (early break/continue).
6. **`else` clause của loop** — Đặc thù Python. `for x in ...: ... else: ...` — else chạy khi loop xong KHÔNG bị break. Use case: tìm element, không tìm thấy thì else.
7. **Function với `def`** — `def add(a: int, b: int) -> int: return a + b`. Docstring: `"""..."""` ngay sau def. Convention: dùng cho function quan trọng.
8. **Default args và keyword args** — `def greet(name, greeting='Hi'): ...`. Call: `greet('An')` hoặc `greet('An', 'Hello')` hoặc `greet(name='An')`. Mutable default trap (đã nói chương 2).
9. **`*args` và `**kwargs`** — `*args` thu các positional dư vào tuple, `**kwargs` thu keyword dư vào dict. `def log(*args, **kwargs): print(args, kwargs)`.
10. **Positional-only và keyword-only** — `def f(pos_only, /, both, *, kw_only)`. `/` cấm dùng tên cho arg trước nó. `*` cấm dùng position cho arg sau nó. Hữu ích cho API design.
11. **Scope LEGB** — Local → Enclosing → Global → Built-in. Lookup theo thứ tự. `global x` để bind global trong function, `nonlocal x` để bind enclosing.
12. **Closure** — Function nested return function. Inner function nhớ scope của outer. `def make_counter(): count = 0; def inc(): nonlocal count; count += 1; return count; return inc`.
13. **Lambda** — `lambda x: x * 2`. Anonymous function inline. Hạn chế: 1 expression, không có statement. Dùng cho callback ngắn (sorted key, filter).
14. **Pass-by-object-reference** — Python không pass by value (int copy giá trị) cũng không reference (modify caller's variable). Pass reference đến object. Modify mutable trong function thấy ở ngoài, reassign biến local không thấy.

### Key concepts

- `match`/`case` là pattern matching, không phải switch đơn thuần
- Loop `else` clause unique Python — dùng khi cần
- Mutable default arg là trap kinh điển — luôn `None`
- Scope LEGB là rule lookup tên trong Python
- Pass-by-object-reference: hiểu nhầm là pass-by-reference dẫn đến bug

### Code examples

1. `match` shape data: parse command từ list `['add', 1, 2]`
2. Loop `else`: tìm prime trong range, không tìm thấy thì else
3. Pattern `*args` + `**kwargs` với logging wrapper
4. Demo closure: `make_multiplier(n)` return function nhân n
5. Demo pass-by-object: function `add_item(lst, item)` mutate vs function `reset(lst)` reassign — kết quả khác

### Visualizer / diagram

- Flow chart `if/elif/else` vs `match/case`
- Diagram LEGB scope với ví dụ
- Bảng `*args`/`**kwargs` với input/output
- Visualizer pass-by-object: name → object, function tạo local name riêng

### Bài tập (5)

1. Viết function `fizzbuzz(n: int) -> list[str]` — generate sequence FizzBuzz từ 1 đến n. Dùng `match`/`case` thay if/elif chain.
2. Viết decorator skeleton (sâu hơn chương 7): `def trace(fn): def wrapper(*args, **kwargs): print(f'calling {fn.__name__} with {args} {kwargs}'); return fn(*args, **kwargs); return wrapper`. Apply lên 1 function.
3. Viết function `parse_command(parts: list[str])` dùng `match`/`case` xử lý các pattern: `['add', x, y]`, `['del', id]`, `['list']`, default.
4. Viết function `apply(funcs: list, value)` — apply tuần tự danh sách function lên value. `apply([str.upper, len], 'hello') = 5`. Dùng `for` + reduce idea.
5. Viết function `make_accumulator()` return function — mỗi lần gọi cộng thêm value vào tổng và return tổng. Test:
   ```python
   acc = make_accumulator()
   acc(5)  # 5
   acc(10) # 15
   acc(2)  # 17
   ```

### Quiz (7)

1. `for x in []: print(x) else: print('done')` in gì? — `done`. Else chạy vì loop xong không break.
2. `def f(x=[]): x.append(1); return x; f(); f(); f()` trả gì? — `[1]`, `[1, 1]`, `[1, 1, 1]`. Mutable default share.
3. `def f(*, a, b)` — gọi `f(1, 2)` work không? — Không. `*` ép a, b keyword-only. Phải `f(a=1, b=2)`.
4. `global` và `nonlocal` khác gì? — `global x` ref biến module-level. `nonlocal x` ref biến enclosing function (level cha, không phải global).
5. Lambda có thể chứa statement không? — Không. Chỉ 1 expression. Không `if`/`for` statement, có `if/else` expression.
6. Trong `match` case, có thể bind variable không? — Có. `case Point(x=0, y=y_val)` bind `y_val` để dùng trong block case.
7. `def f(a, b, /, c, d, *, e)` — gọi `f(1, 2, 3, 4, e=5)` work? `f(1, b=2, c=3, d=4, e=5)`? — Lần 1 work. Lần 2 không work vì `b` là positional-only (trước `/`).

### Connects to

- Chương 5 (OOP) — method là function trên object
- Chương 6 (Generator) — function với `yield`
- Chương 7 (Decorator) — function nhận function

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 5 — OOP in Python

### Mục tiêu chương

Học xong chương 5, người đọc sẽ:
- Định nghĩa class, instance, attribute, method
- Hiểu `self` và phân biệt instance method vs class method (`@classmethod`) vs static method (`@staticmethod`)
- Sử dụng inheritance, override, `super()`
- Hiểu MRO (Method Resolution Order) và multiple inheritance
- Sử dụng dunder method (`__init__`, `__repr__`, `__str__`, `__eq__`, `__hash__`, `__len__`, `__iter__`, `__add__`, ...)
- Dùng `@property` để tạo getter/setter
- Dùng `@dataclass` (Python 3.7+) — modern way để viết data class
- Hiểu duck typing: "if it walks like a duck..." — Python không quan tâm type, quan tâm method

### Lý do học

OOP của Python rất linh hoạt — gần như mọi thứ là object, bạn có thể override gần như mọi behavior bằng dunder method. Hiểu OOP Python = đọc được source code stdlib + viết được API đẹp.

### Prerequisites

Chương 1-4.

### Sections

1. **Class — cú pháp** — `class User: pass`. Tạo instance: `u = User()`. Convention: `PascalCase` cho class name.
2. **`__init__` — constructor** — `def __init__(self, name): self.name = name`. `self` là instance, tự pass vào method. KHÔNG có `new` keyword.
3. **Instance attribute vs class attribute** — `self.x = 1` (instance), `class Foo: x = 1` (class). Class attribute share giữa instance. Mutable class attribute là trap (mọi instance thấy thay đổi).
4. **Method types** — Instance method (default, có self), `@classmethod` (có cls), `@staticmethod` (không có self/cls). Bảng khi nào dùng cái nào.
5. **Inheritance** — `class Admin(User): pass`. Override method: define lại tên method. `super().method()` gọi method của parent. Chain `super().__init__(...)`.
6. **Multiple inheritance và MRO** — `class C(A, B): pass`. MRO C3 linearization xác định thứ tự lookup. `C.__mro__` xem chain. Diamond problem được giải quyết.
7. **Dunder method core** — `__repr__` (debug), `__str__` (user-friendly), `__eq__` (==), `__hash__` (hashable), `__len__` (len()), `__iter__` (for loop), `__contains__` (in), `__getitem__` (`obj[key]`), `__call__` (`obj()`).
8. **`__eq__` và `__hash__` cùng đi** — Override `__eq__` mà không override `__hash__` → object không hashable. Rule: `a == b` → `hash(a) == hash(b)`.
9. **Property — `@property`** — Method behave như attribute. `@property def name(self): ...`, `@name.setter def name(self, value): ...`. Hữu ích cho computed value, validation.
10. **`@dataclass`** — Decorator generate `__init__`, `__repr__`, `__eq__` tự động từ field. Cú pháp `@dataclass class User: name: str; age: int`. Option: `frozen=True` (immutable), `slots=True` (memory optimize).
11. **Abstract base class — `abc`** — `from abc import ABC, abstractmethod`. Class có `@abstractmethod` không instantiate được. Dùng cho interface.
12. **Protocol (PEP 544) — structural typing** — `from typing import Protocol`. Khai báo "có method X, Y" — bất kỳ class match là OK, không cần inherit. Sâu hơn chương 9.
13. **Duck typing** — Triết lý Python: "Nếu nó kêu quack quack thì nó là vịt". Không kiểm tra `isinstance`, kiểm tra "có method này không". EAFP > LBYL.

### Key concepts

- `self` là instance, tự pass khi gọi `instance.method()`
- Inheritance multiple được, dùng MRO để resolve
- Dunder method override để class hành xử như built-in (iterable, hashable, callable)
- `@property` biến method thành attribute interface
- `@dataclass` giảm boilerplate cho data class
- Duck typing > explicit type check trong Python idiom

### Code examples

1. Class `BankAccount` với `__init__`, `deposit`, `withdraw`, `__repr__`
2. Inheritance: `Animal` → `Dog`, `Cat`. `super().__init__()`. Override `speak()`.
3. Dunder method: `class Vector` với `__add__`, `__sub__`, `__eq__`, `__repr__`
4. `@property`: `class Circle` với `radius` field và `area` property
5. `@dataclass`: convert class `Point` viết kiểu OOP truyền thống sang dataclass

### Visualizer / diagram

- Class diagram (UML mini) cho inheritance + composition
- Diagram MRO C3 linearization với ví dụ diamond
- Bảng dunder method với mô tả use case
- Bảng `@property` vs method thường vs attribute thuần
- So sánh `class` truyền thống vs `@dataclass` — lines of code

### Bài tập (5)

1. Tạo class `Vector2D` với field `x`, `y`. Implement `__add__`, `__sub__`, `__mul__` (scalar), `__eq__`, `__repr__`. Test `Vector2D(1, 2) + Vector2D(3, 4) == Vector2D(4, 6)`.
2. Tạo class hierarchy: `Shape` (abstract, có method `area()`), `Circle`, `Square`, `Rectangle`. Sử dụng `ABC`. Demo polymorphism: list các Shape, gọi `area()` từng cái.
3. Convert class `User` thường (có `__init__`, `__repr__`, `__eq__`, `__hash__` viết tay) sang `@dataclass(frozen=True)`. So sánh số dòng code, behavior.
4. Tạo class `Temperature` với `_celsius` (private convention) và property `celsius`, `fahrenheit`, `kelvin` đều computed từ `_celsius`. Setter của bất kỳ property update `_celsius`.
5. Multiple inheritance: tạo `Mixin` cho serialize JSON (`to_json` method dùng `dataclasses.asdict`). Apply mixin lên class `Product`. Demo dùng được.

### Quiz (8)

1. `self` là gì? — Tham chiếu đến instance, tự động pass khi gọi `instance.method()`. Bắt buộc làm parameter đầu của instance method.
2. `@classmethod` và `@staticmethod` khác gì? — Classmethod nhận `cls` (class), dùng cho alternative constructor. Static không nhận gì, chỉ namespace logic vào class. Class method có thể được override, static không.
3. `__str__` và `__repr__` khác gì? — `__str__` user-facing (print), `__repr__` developer-facing (debug, REPL), nên unambiguous (best practice: `eval(repr(obj))` recreate obj).
4. Multiple inheritance MRO theo thứ tự nào? — C3 linearization (left-to-right, depth-first, but with rules for diamond). Xem `Class.__mro__`.
5. `@dataclass` tự generate những gì? — `__init__`, `__repr__`, `__eq__` mặc định. Optional: `__hash__` (nếu frozen=True), `__order__` (gt/lt/...) nếu order=True.
6. `@property` setter có optional không? — Có. Nếu chỉ `@property def x` mà không có `@x.setter`, property là read-only.
7. Khi override `__eq__`, phải override gì khác? — `__hash__`. Nếu không, class không hashable (Python tự set `__hash__ = None`).
8. Duck typing với `isinstance` check, cái nào Pythonic hơn? — Duck typing thường Pythonic hơn. Nhưng khi cần guarantee API (vd framework), `isinstance` + ABC / Protocol là lựa chọn hợp lý.

### Connects to

- Chương 6 (Iterator) — class với `__iter__` là iterable custom
- Chương 7 (Decorator + Context manager) — class với `__enter__`/`__exit__` là context manager
- Chương 9 (Typing) — Protocol, Generic class
- OOP pillar (trụ cột 6) — Python OOP là instance cụ thể

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 6 — Iterators, Generators & Itertools

### Mục tiêu chương

Học xong chương 6, người đọc sẽ:
- Hiểu iterator protocol: `__iter__` trả iterator, `__next__` trả value hoặc raise `StopIteration`
- Viết iterable custom (class với `__iter__`)
- Viết generator function với `yield` — lazy evaluation
- Sử dụng generator expression `(x for x in ...)` thay list comprehension khi cần lazy
- Hiểu `send()`, `throw()`, `close()` của generator (advanced)
- Dùng `itertools` stdlib: `chain`, `count`, `cycle`, `repeat`, `islice`, `groupby`, `combinations`, `permutations`, `product`, `accumulate`
- Hiểu eager vs lazy evaluation, infinite iterator

### Lý do học

Generator là một trong những feature đẹp nhất Python — viết được code lazy, tiết kiệm memory, xử lý infinite stream. `itertools` là toolbox combinatorial pattern phổ biến. Master = code Pythonic + xử lý big data trên 1 máy nhỏ.

### Prerequisites

Chương 1-5.

### Sections

1. **Iterable vs Iterator** — Iterable: có `__iter__` method, trả Iterator. Iterator: có `__next__` method, trả value hoặc raise `StopIteration`. `for x in iterable` ngầm gọi `iter()` rồi loop `next()`.
2. **`iter()` và `next()` built-in** — `it = iter([1,2,3]); next(it) → 1; next(it) → 2`. Sau hết phần tử `next(it)` raise `StopIteration`.
3. **Iterable custom — class** — Implement `__iter__` return self (nếu chính nó là iterator) hoặc return iterator object riêng. Implement `__next__` để generate value.
4. **Generator function với `yield`** — `def count_up_to(n): for i in range(n): yield i`. Khi gọi, return generator object (chưa chạy code). Mỗi `next()` chạy đến `yield` tiếp theo, return value, pause state. Khi hết function → StopIteration.
5. **Generator expression** — `(x**2 for x in range(10))`. Cú pháp như list comprehension nhưng `()`. Lazy: không tạo list, tạo generator.
6. **Lazy vs eager** — List comprehension eager (tạo tất cả ngay), generator lazy (tạo từng phần tử). Trade-off: memory (lazy thắng) vs speed of repeated access (list thắng — generator chỉ chạy 1 lần).
7. **Infinite generator** — `def count(): i = 0; while True: yield i; i += 1`. Loop `for x in count(): if x > 100: break`. Hoặc `itertools.islice(count(), 100)`.
8. **`yield from`** — Delegate đến generator khác. `def chain(*iterables): for it in iterables: yield from it`. Cleaner than nested for + yield.
9. **`send()`, `throw()`, `close()`** — Generator 2 chiều. `gen.send(value)` resume và pass value vào `yield`. Hiếm dùng trong app code, nền của coroutine cũ (pre-async).
10. **`itertools.chain`** — Nối nhiều iterable. `chain([1,2], [3,4], [5,6]) → 1,2,3,4,5,6`.
11. **`itertools.count`, `cycle`, `repeat`** — Infinite iterator. `count(10)` → 10,11,12,... `cycle([1,2,3])` → 1,2,3,1,2,3,... `repeat('x', 3)` → x,x,x.
12. **`itertools.islice`** — Slice iterator (kể cả infinite). `islice(count(), 5, 10)` → 5,6,7,8,9.
13. **`itertools.groupby`** — Group consecutive elements with same key. Lưu ý: chỉ group adjacent, nên thường cần sort trước.
14. **`itertools.combinations`, `permutations`, `product`** — Combinatorial. `combinations([1,2,3], 2)` → (1,2),(1,3),(2,3). `permutations` cho phép thứ tự khác. `product` Cartesian.
15. **`itertools.accumulate`** — Cumulative reduce. `accumulate([1,2,3,4])` → 1,3,6,10. Mặc định `+`, có thể truyền function khác (max, multiply).

### Key concepts

- Iterator one-shot: hết phần tử là xong, không reset (phải tạo iterator mới)
- Generator function pause state ở `yield`, resume khi `next()` tiếp theo
- Generator expression cú pháp ngắn cho generator function 1 expression
- Lazy evaluation đặc biệt hữu ích cho big data, infinite stream
- `itertools` là Swiss army knife — đọc doc 1 lần để biết tool nào có sẵn

### Code examples

1. Class `Countdown` với `__iter__`/`__next__` — đếm ngược từ n về 0
2. Generator `fibonacci()` infinite — lấy 10 số đầu bằng `islice`
3. Read file lazy: `def read_lines(path): with open(path) as f: yield from f` — không load toàn bộ vào memory
4. Pattern producer-consumer với generator
5. `groupby` ví dụ: group log entries by date (sort trước)

### Visualizer / diagram

- Diagram iterator protocol: iterable → iter() → iterator → next() loop → StopIteration
- Animation generator: code pause ở yield, biến giữ state
- Bảng eager vs lazy với memory/time trade-off
- Bảng `itertools` 15+ tool với input/output ví dụ

### Bài tập (5)

1. Viết generator `range_step(start, stop, step)` tương tự `range()` nhưng chấp nhận float step. Test `list(range_step(0, 1, 0.1))`.
2. Viết generator `chunks(iterable, size)` — yield list size phần tử mỗi lần. Test với list lớn.
3. Đọc 1 file CSV bằng generator, không load hết vào memory. Filter row có cột nào đó match condition. Đếm số row qua.
4. Implement `take(iterable, n)` và `drop(iterable, n)` — tương tự `islice(it, 0, n)` và `islice(it, n, None)` nhưng tự viết.
5. Tìm tất cả tổ hợp 3 số từ list `[1, 2, 3, 4, 5]` có sum = 8. Dùng `itertools.combinations` + filter.

### Quiz (7)

1. `range(10)` là iterable hay iterator? — Iterable (có `__iter__`). Mỗi lần `iter(range(10))` cho iterator mới. Có thể loop range nhiều lần.
2. Generator có hash được không? — Là object, có `id` riêng, nên hash được. Nhưng 2 generator khác nhau hash khác — hiếm dùng.
3. `[x for x in gen]` và `list(gen)` khác gì? — Cùng kết quả. List comprehension consume generator. Sau đó `gen` rỗng.
4. Generator có thể reuse không? — Không. Một khi consume xong, raise StopIteration. Tạo lại bằng gọi function generator lần nữa.
5. `yield from gen` và `for x in gen: yield x` khác gì? — Giống về output, khác về 2 chiều: `yield from` còn forward `send()`, `throw()`, `return value` (StopIteration value). Tinh tế hơn.
6. `itertools.groupby([1,1,2,2,1,1])` — kết quả? — 3 group: (1, iter of [1,1]), (2, iter of [2,2]), (1, iter of [1,1]). Vì groupby chỉ group adjacent, nên có 2 group key=1 riêng biệt.
7. Generator vs list, cái nào nhanh hơn? — Tuỳ. Generate 1 lần: generator nhanh hơn (không tạo list). Đọc nhiều lần: list nhanh hơn (cache). Big data: generator vì memory.

### Connects to

- Chương 7 (Decorator) — decorator có thể wrap generator
- Chương 8 (Async) — async generator (`async def` với `yield`)
- Chương 10 (Testing) — fixture có thể là generator (`yield` rồi cleanup)
- JS Chương 5 — đối chiếu generator JS

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 7 — Decorators & Context Managers

### Mục tiêu chương

Học xong chương 7, người đọc sẽ:
- Hiểu decorator là function nhận function trả function
- Viết decorator đơn giản, có argument, decorator stack (multiple)
- Hiểu `functools.wraps` để giữ metadata function gốc
- Sử dụng decorator stdlib: `@property`, `@classmethod`, `@staticmethod`, `@functools.cache`, `@functools.lru_cache`, `@dataclass`
- Hiểu context manager là gì, `with` statement
- Viết context manager bằng class (`__enter__`/`__exit__`) và bằng `contextlib.contextmanager` (generator)
- Sử dụng nested context manager, `contextlib.ExitStack`

### Lý do học

Decorator + context manager là 2 syntactic sugar đặc trưng Python — cho phép tách concern (logging, caching, transaction, resource cleanup) khỏi business logic. Master = code clean, reusable, Pythonic.

### Prerequisites

Chương 1-6.

### Sections

1. **Decorator — mental model** — Decorator là function nhận function trả function. `@decorator def f(): ...` tương đương `f = decorator(f)`.
2. **Decorator đơn giản** — `def trace(fn): def wrapper(*args, **kwargs): print(f'calling {fn.__name__}'); return fn(*args, **kwargs); return wrapper`. Apply: `@trace`.
3. **`functools.wraps`** — Wrapper mặc định mất `__name__`, `__doc__` của fn gốc. `@functools.wraps(fn)` trên wrapper để bảo toàn.
4. **Decorator có argument** — Cần thêm 1 lớp: `def repeat(n): def decorator(fn): def wrapper(*args, **kwargs): for _ in range(n): result = fn(*args, **kwargs); return result; return wrapper; return decorator`. Apply: `@repeat(3)`.
5. **Decorator stack** — `@a` `@b` `def f` = `f = a(b(f))`. Bottom-up. Order matter.
6. **`functools.cache` / `lru_cache`** — Memoize function result. `@cache` (Python 3.9+) unlimited size, `@lru_cache(maxsize=128)` có limit. Hữu ích cho recursion (Fibonacci).
7. **Class-based decorator** — Class với `__call__` thay function. Hữu ích khi decorator có state.
8. **Decorator trong stdlib và lib** — `@dataclass` (auto generate), `@property` (method as attribute), `@app.route('/')` (web framework như Flask), `@pytest.fixture`.
9. **Context manager — `with` statement** — `with open('file') as f: ...`. `with` đảm bảo cleanup (close) chạy kể cả có exception. Quan trọng cho resource (file, lock, db connection, transaction).
10. **Context manager — class** — Implement `__enter__` (return value bind vào `as`) và `__exit__(exc_type, exc_val, exc_tb)` (cleanup). Return True trong `__exit__` để suppress exception.
11. **Context manager — `contextlib.contextmanager`** — Decorator biến generator thành context manager. Cấu trúc: `try: yield value finally: cleanup`. Ngắn hơn class.
12. **Nested with** — `with open(a) as f1, open(b) as f2: ...`. Multiple cm trong 1 with.
13. **`contextlib.ExitStack`** — Khi số cm dynamic. `with ExitStack() as stack: files = [stack.enter_context(open(f)) for f in paths]`.
14. **`contextlib.suppress`** — `with suppress(FileNotFoundError): os.remove('temp')` — bỏ qua exception cụ thể. Cleaner than try/except pass.

### Key concepts

- Decorator = HOF (higher-order function) đặc trưng Python
- `@decorator` syntax sugar cho `f = decorator(f)`
- `functools.wraps` để bảo toàn metadata khi wrap
- Context manager đảm bảo cleanup deterministic
- `with` là Python's "RAII" pattern (C++ analog)

### Code examples

1. Decorator `@timing` đo thời gian function chạy
2. Decorator `@retry(n)` retry function n lần nếu exception
3. `@lru_cache` cho Fibonacci — benchmark trước/sau (huge speedup)
4. Context manager class `Timer` — log thời gian khi `with`
5. `@contextmanager` cho database transaction: `try: yield conn; conn.commit() except: conn.rollback()`

### Visualizer / diagram

- Diagram decorator unwrap: `@a @b def f` → `f = a(b(f))`
- Flow chart context manager: `with` → `__enter__` → block → `__exit__` (kể cả exception)
- Bảng `functools` decorator built-in
- So sánh class CM vs `@contextmanager` (giống/khác)

### Bài tập (5)

1. Viết decorator `@measure_time` log thời gian function chạy. Test với function chạy lâu.
2. Viết decorator factory `@retry(times=3, exceptions=(IOError,))` retry chỉ khi exception thuộc tuple. Test với function raise random.
3. Viết context manager `temp_file()` (class hoặc decorator) — tạo file temp, yield path, cleanup file khi exit. Test:
   ```python
   with temp_file() as path:
       with open(path, 'w') as f:
           f.write('hello')
   # File should be deleted now
   ```
4. Viết decorator `@validate_types` — đọc type hints của function, raise TypeError nếu arg type không match. Hint: dùng `inspect`, `typing.get_type_hints`.
5. Tìm bug: decorator dưới mất docstring. Fix bằng `functools.wraps`.
   ```python
   def log_calls(fn):
       def wrapper(*args, **kwargs):
           print(f'calling {fn.__name__}')
           return fn(*args, **kwargs)
       return wrapper

   @log_calls
   def add(a, b):
       """Add two numbers."""
       return a + b

   print(add.__name__)  # 'wrapper' instead of 'add'
   print(add.__doc__)   # None instead of "Add two numbers."
   ```

### Quiz (8)

1. `@dec` `def f()` chạy `dec` khi nào? — Khi `def f` được evaluate (import time / definition time), không phải khi gọi `f()`.
2. Decorator stack `@a` `@b` apply thứ tự nào? — Bottom-up: `b` trước, `a` sau. Tương đương `f = a(b(f))`.
3. `functools.wraps` làm gì? — Copy metadata (`__name__`, `__doc__`, `__module__`, `__wrapped__`) từ fn gốc sang wrapper. Để debug/introspection không bị confuse.
4. Context manager `__exit__` return True nghĩa là gì? — Suppress exception (không re-raise). Mặc định None/False thì re-raise.
5. `with open(a) as f1, open(b) as f2:` nếu open(b) lỗi, f1 có close không? — Có. Python đã enter cm thứ nhất, exception ở cm thứ 2 → trigger `__exit__` của cm 1.
6. `@functools.cache` và `@functools.lru_cache` khác gì? — `cache` (3.9+) unlimited size, `lru_cache(maxsize=N)` limit. Cả 2 cache result theo args. Args phải hashable.
7. Class với `__call__` có thể làm decorator không? — Có. `class Logger: def __call__(self, fn): def wrapper(*args, **kwargs): ...; return wrapper`. `@Logger()` apply.
8. `with` statement và `try/finally` khác gì? — `with` syntactically đẹp hơn, ngắn hơn, ít lỗi quên cleanup. Behind the scenes vẫn là try/finally.

### Connects to

- Chương 5 (OOP) — `@property`, `@classmethod`, `@staticmethod` là decorator built-in
- Chương 8 (Async) — `@asynccontextmanager`, `async with`
- Chương 10 (Testing) — `@pytest.fixture`, `@pytest.mark`

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 8 — Async Python: asyncio, async/await

### Mục tiêu chương

Học xong chương 8, người đọc sẽ:
- Hiểu vì sao có asyncio: Python sync I/O block thread, async không block
- Phân biệt sync, threading, multiprocessing, asyncio — khi nào dùng cái nào
- Hiểu GIL (Global Interpreter Lock) và implication cho threading
- Viết coroutine với `async def`, await với `await`
- Sử dụng `asyncio.run`, `asyncio.gather`, `asyncio.create_task`, `asyncio.wait_for`
- Hiểu event loop của asyncio (giống event loop JS)
- Viết async context manager (`async with`) và async iterator (`async for`)
- Hiểu các thư viện async phổ biến: `aiohttp`, `httpx`, `aiofiles`, `asyncpg`

### Lý do học

Async I/O scale rất tốt cho app I/O-bound (web server, network client, scraper). Hiểu async Python = viết được app handle ngàn concurrent request trên 1 thread. Hiểu GIL = biết khi nào nên threading vs multiprocessing.

### Prerequisites

Chương 1-7.

### Sections

1. **Concurrency vs Parallelism** — Concurrency = nhiều task interleave (1 CPU OK). Parallelism = nhiều task chạy thực sự cùng lúc (cần nhiều CPU). Asyncio cho concurrency, multiprocessing cho parallelism.
2. **GIL — Global Interpreter Lock** — CPython chỉ cho 1 thread thực thi Python bytecode 1 lúc. → Threading không parallel CPU-bound code. Nhưng threading vẫn cải thiện I/O-bound (thread block I/O thì thread khác chạy).
3. **Bảng so sánh: sync, threading, multiprocessing, asyncio** — Concurrency, parallelism, GIL impact, shared state, overhead, use case.
4. **Coroutine — `async def`** — `async def fetch(url): ...`. Khi gọi return coroutine object (chưa chạy). Phải `await` hoặc đẩy vào event loop.
5. **`await` — chỉ trong async function** — `result = await coro`. Block coroutine hiện tại đến khi coro xong, yield control cho event loop chạy task khác.
6. **`asyncio.run`** — Entry point top-level. Mở event loop, chạy coro chính, close. Không gọi từ trong coroutine.
7. **`asyncio.gather`** — Chạy nhiều coroutine song song. `results = await asyncio.gather(coro1, coro2, coro3)`. Return list theo thứ tự input. Nếu 1 lỗi, gather có thể cancel cái khác (option).
8. **`asyncio.create_task`** — Schedule coro chạy nền, không await ngay. Return Task object — `task.cancel()`, `task.result()`. Để fire-and-forget hoặc await sau.
9. **`asyncio.wait_for`** — Timeout cho coroutine. `await asyncio.wait_for(coro, timeout=5)`. Raise `TimeoutError` nếu quá.
10. **`asyncio.Queue`** — Async FIFO queue cho producer-consumer pattern.
11. **`async with` và `async for`** — Async context manager (`__aenter__`/`__aexit__`), async iterator (`__aiter__`/`__anext__`).
12. **Event loop của asyncio** — Single-threaded. Loop chạy task, mỗi task chạy đến `await`, yield, loop pick task khác. Giống JS event loop về concept.
13. **Sync vs async function — không trộn** — Gọi sync function nặng trong coro sẽ block event loop. Dùng `loop.run_in_executor(None, sync_func)` để chạy sync trong thread pool.
14. **Thư viện async ecosystem** — `aiohttp` (HTTP client + server), `httpx` (HTTP client, support cả sync/async), `aiofiles` (file I/O), `asyncpg` (PostgreSQL), `motor` (MongoDB), `redis.asyncio`.

### Key concepts

- GIL = 1 thread Python tại 1 lúc → asyncio cho I/O, multiprocessing cho CPU
- `async def` tạo coroutine; cần `await` hoặc đẩy event loop
- `gather` chạy song song, `await` tuần tự
- Không gọi sync block trong async (như `time.sleep`, `requests.get`) → dùng async version (`asyncio.sleep`, `httpx.AsyncClient`)
- Event loop của asyncio tương tự event loop JS (microtask queue, callback)

### Code examples

1. So sánh sync vs async fetch 10 URL: `requests` (sync, ~10s) vs `httpx.AsyncClient` (async, ~1s)
2. Pattern producer-consumer với `asyncio.Queue`
3. `wait_for` cho timeout 1 fetch
4. Async context manager: `async with httpx.AsyncClient() as client: await client.get(...)`
5. Mix sync + async: dùng `run_in_executor` để chạy `time.sleep(1)` sync trong async function mà không block loop

### Visualizer / diagram

- Sơ đồ event loop asyncio (giống JS event loop)
- Bảng concurrency model: sync, thread, multiprocess, asyncio
- Diagram coroutine lifecycle: created → pending → done/cancelled
- Visualizer task scheduling: 3 task interleave qua await point

### Bài tập (5)

1. Viết async function `fetch(url, session)` dùng `httpx.AsyncClient`. Fetch 10 URL song song với `gather`. So sánh thời gian với sync version.
2. Viết `download_all(urls, concurrency=5)` — limit concurrent download. Hint: `asyncio.Semaphore`.
3. Viết `with_timeout(coro, seconds)` — async function wrap coro với timeout, return None nếu timeout. So sánh với `asyncio.wait_for`.
4. Implement async queue worker: producer push URL vào queue, 5 consumer fetch URL. Run đến khi producer xong, signal consumer dừng.
5. Bug check: function dưới có lỗi gì? Fix.
   ```python
   async def slow_task():
       time.sleep(2)  # BUG: blocks event loop
       return 42
   ```

### Quiz (8)

1. `async def f(): return 1` — gọi `f()` trả gì? — Coroutine object, không phải 1. Phải `await f()` hoặc `asyncio.run(f())` để lấy giá trị.
2. GIL khiến threading vô dụng cho CPU-bound? — Đúng cho CPython và Python code thuần. Nhưng numpy/SciPy unlock GIL trong C code, vẫn lợi từ thread.
3. `asyncio.gather([1, 2, 3])` work không? — Không. `gather` cần awaitable (coroutine, task, future), không phải value thường. Phải truyền `coro1, coro2, coro3` hoặc unpacked.
4. Coroutine chạy lúc nào? — Khi được schedule vào event loop. Tạo coroutine = chưa chạy. `asyncio.run`, `await`, `create_task` đều schedule.
5. `await fetch_a(); await fetch_b()` và `await asyncio.gather(fetch_a(), fetch_b())` khác gì? — Cái đầu tuần tự (a xong mới b). Cái sau song song (cả 2 cùng start, await đến khi cả 2 xong).
6. Có thể `await` trong sync function không? — Không. `await` chỉ valid trong `async def`. Sync function muốn chờ async phải `asyncio.run(coro)`.
7. `asyncio.create_task` vs `await coro` khác gì? — `await coro` chạy ngay và đợi. `create_task(coro)` schedule chạy nền, không đợi (Task chạy đồng thời với code tiếp theo).
8. `time.sleep(1)` trong async function gây chuyện gì? — Block event loop 1s. Không task khác chạy được. Dùng `await asyncio.sleep(1)` thay.

### Connects to

- Chương 6 (Generator) — async generator nâng cao
- Chương 10 (Testing) — `pytest-asyncio` test async function
- JS Chương 6 — đối chiếu event loop JS vs asyncio Python
- Dart Chương 7 — async/await giống nhau ở level cú pháp

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Chương 9 — Typing & Static Analysis

### Mục tiêu chương

Học xong chương 9, người đọc sẽ:
- Sử dụng type hints đầy đủ: primitive, container (`list[int]`, `dict[str, User]`), `Optional`, `Union` (hoặc `|` syntax 3.10+)
- Hiểu `Any`, `Never`, `TypeAlias`, `Final`, `Literal`
- Dùng `Protocol` cho structural typing (duck typing có type check)
- Viết generic function/class với syntax PEP 695 (Python 3.12+): `def f[T](x: T) -> T`
- Cài và chạy `mypy` strict mode
- Dùng `TypedDict` cho dict structure
- Hiểu type narrowing với `isinstance`, `assert`, `TypeGuard`

### Lý do học

Type hints biến Python từ "dynamic ngầm" thành "dynamic explicit" — vẫn linh hoạt nhưng catch bug sớm. Industry adopt rộng rãi cho codebase > 10k dòng. Hiểu typing = code dễ maintain, dễ refactor.

### Prerequisites

Chương 1-8.

### Sections

1. **Type hints — recap và sâu** — `x: int = 5`, `def f(x: int) -> str: ...`. Runtime ignore, static check qua mypy/Pyright.
2. **Container types — `list[T]`, `dict[K, V]`, `tuple[T, ...]`** — Python 3.9+ dùng built-in. Trước đó `List`, `Dict` từ `typing`.
3. **`Optional[T]` và `T | None`** — `Optional[str] = str | None`. Cú pháp `|` (3.10+) gọn hơn. Khuyên dùng `|`.
4. **`Union[A, B]` và `A | B`** — Union 2+ type. `int | str | None`.
5. **`Any` — escape hatch** — Tương đương TS `any`. Disable type check. Dùng ít nhất có thể.
6. **`Never` — bottom type** — Function không bao giờ return (raise, infinite loop). `def fail() -> Never: raise RuntimeError`.
7. **`Literal` — exact value type** — `Literal['red', 'green', 'blue']`. Tương đương TS literal union. Pattern thay enum.
8. **`Final` — không reassign** — `x: Final = 5`. Mypy enforce, runtime không.
9. **`TypeAlias` — đặt tên cho type** — `UserId: TypeAlias = int`. Python 3.12+ dùng `type` statement: `type UserId = int`.
10. **`TypedDict` — typed dict structure** — `class User(TypedDict): name: str; age: int`. Khác `@dataclass`: vẫn là dict (`u['name']`), runtime không có class. Hữu ích cho JSON response.
11. **`Protocol` — structural typing** — `class Drawable(Protocol): def draw(self) -> None: ...`. Class nào có `draw()` đều match, không cần inherit. Duck typing có type check.
12. **Generic function — PEP 695 (3.12+)** — `def first[T](items: list[T]) -> T: return items[0]`. Trước đó: `from typing import TypeVar; T = TypeVar('T')`.
13. **Generic class — PEP 695** — `class Stack[T]: items: list[T] = []`. Trước đó kế thừa `Generic[T]`.
14. **Type narrowing** — `isinstance(x, str)` narrow `x: int | str` về `str` trong scope. `assert x is not None` narrow `T | None` về `T`. `TypeGuard[T]` cho custom predicate.
15. **Cài và chạy mypy** — `pip install mypy`. `mypy file.py` hoặc `mypy --strict file.py`. Config qua `pyproject.toml` `[tool.mypy]`.
16. **Pyright / Pylance** — Alternative cho mypy, viết bằng Node. Pylance trong VS Code dùng Pyright. Strict mode option.
17. **Anti-pattern: over-typing** — Type hint mọi local variable là noise. Type hint function signature, attribute, complex local là đủ.

### Key concepts

- Type hints không enforce runtime, cần mypy/Pyright check
- Container generic dùng `list[T]` (3.9+), không cần `List[T]` từ typing
- Protocol = duck typing có type check (structural)
- Generic syntax PEP 695 (3.12+) ngắn gọn hơn TypeVar cũ
- TypedDict cho dict shape, dataclass cho class instance
- Narrowing biến union về specific qua isinstance/assert/TypeGuard

### Code examples

1. Function `parse_user(data: dict) -> User` với TypedDict cho input
2. Generic function `first[T](items: list[T]) -> T | None`
3. Protocol `class Hashable(Protocol): def __hash__(self) -> int: ...`
4. Pattern Result với generic: `class Result[T, E]: ...`
5. Narrowing: function nhận `str | bytes`, isinstance check

### Visualizer / diagram

- Bảng `typing` module với feature + when use
- So sánh `TypedDict` vs `@dataclass` vs `Pydantic BaseModel`
- Diagram type narrowing flow
- Bảng strict mode flag (mypy strict bật những gì)

### Bài tập (5)

1. Type hint đầy đủ 1 file Python bạn đã viết. Chạy `mypy --strict`. Fix lỗi cho đến 0 error.
2. Define `TypedDict` cho response API: `User` có name (str), age (int), tags (list[str]), email (str | None). Viết function nhận response JSON, validate, return User instance.
3. Implement `Repository[T]` generic class với methods `find_by_id(id: int) -> T | None`, `save(item: T) -> None`. Test với `Repository[User]` và `Repository[Product]`.
4. Viết Protocol `Comparable`: có `__lt__`. Function `min_of(items: list[Comparable]) -> Comparable` return min. Apply với `int`, `str`, custom class.
5. Type guard: viết `def is_str_list(x: list[object]) -> TypeGuard[list[str]]` — check tất cả phần tử là str. Sau đó function nhận `list[object]`, dùng guard để narrow.

### Quiz (7)

1. Type hints có ảnh hưởng runtime không? — Không. Python runtime ignore type hints (trừ khi dùng library như Pydantic, beartype runtime validate).
2. `def f(x: list) -> None` vs `def f(x: list[int]) -> None` — khác gì với mypy? — Cái sau strict hơn: chỉ chấp nhận `list[int]`. Cái đầu `list[Any]`.
3. `Optional[int]` và `int | None` khác gì? — Tương đương. `Optional` cũ, `|` mới (3.10+). Khuyên `|`.
4. `Any` và `object` khác gì? — `Any` disable check (mọi operation OK). `object` là supertype, chỉ method của object dùng được, phải narrow để dùng method cụ thể.
5. `Protocol` khác `ABC` ở điểm nào? — Protocol structural (match shape), ABC nominal (phải inherit). Protocol pythonic hơn cho duck typing.
6. `TypeVar` cũ và `T` syntax PEP 695 khác gì? — Tương đương. PEP 695 ngắn gọn, scope rõ ràng (per-function/class). TypeVar cũ vẫn work nhưng verbose.
7. Mypy strict mode bật gì? — Disallow untyped function, disallow Any, warn unused ignore, check return statements, vài flag nữa. Recommend cho project mới.

### Connects to

- Chương 5 (OOP) — Protocol vs ABC, type hint cho method
- Chương 6 (Generator) — `Iterator[T]`, `Generator[Y, S, R]`
- Chương 10 (Testing) — type test, `assert_type`
- TS Chương 9-11 — type system Python so với TS

### Ước lượng độ dài

~950-1050 dòng HTML.

---

## Chương 10 — Testing, Packaging & Tooling

### Mục tiêu chương

Học xong chương 10, người đọc sẽ:
- Sử dụng `pytest` thành thạo: test function, fixture, parametrize, marker
- Viết unit test, mock với `unittest.mock` hoặc `pytest-mock`
- Hiểu test pyramid: unit > integration > e2e
- Đo coverage với `coverage.py` / `pytest-cov`
- Setup `pyproject.toml` đầy đủ cho project
- Hiểu build và publish package lên PyPI
- Sử dụng `ruff` (lint + format), `mypy` (type check), `pytest` (test) — toolchain modern
- Setup pre-commit hook

### Lý do học

Đây là chương "đóng" của track Python — chuyển từ "viết được Python" sang "ship được Python production". Testing và packaging là 2 skill quan trọng cho mọi codebase serious.

### Prerequisites

Chương 1-9.

### Sections

1. **`pytest` — vì sao thay `unittest`** — `unittest` (stdlib) verbose, class-based. `pytest` đơn giản: function `def test_foo()`, dùng `assert`. Plugin ecosystem mạnh.
2. **Test function basic** — File `test_*.py`. Function `def test_*()`. Dùng `assert x == y`. Chạy: `pytest`.
3. **Fixture — setup/teardown** — `@pytest.fixture def db(): conn = connect(); yield conn; conn.close()`. Test inject bằng tham số: `def test_x(db): ...`. Yield-based: code trước yield = setup, sau = teardown.
4. **Fixture scope** — `function` (default, mỗi test 1 instance), `class`, `module`, `session`. Cẩn thận state leak với scope rộng.
5. **`@pytest.mark.parametrize`** — Test nhiều input với 1 function. `@pytest.mark.parametrize('a, b, expected', [(1, 2, 3), (4, 5, 9)]) def test_add(a, b, expected): assert add(a, b) == expected`.
6. **Marker** — `@pytest.mark.slow`, `@pytest.mark.integration`. Skip selectively: `pytest -m 'not slow'`.
7. **`conftest.py`** — File chia sẻ fixture cho tests cùng folder. Pytest tự pickup.
8. **Mock với `unittest.mock`** — `from unittest.mock import patch, MagicMock`. `@patch('module.func')` thay func bằng mock. `mock.assert_called_with(args)`.
9. **`pytest-mock`** — Plugin wrap mock đẹp hơn. Fixture `mocker`.
10. **Coverage** — `coverage run -m pytest && coverage report`. Hoặc `pytest --cov=src`. Target: ≥ 80% cho lib, ≥ 60% cho app.
11. **`pyproject.toml` đầy đủ** — `[project]` (name, version, deps), `[project.optional-dependencies]` (dev), `[tool.pytest.ini_options]`, `[tool.mypy]`, `[tool.ruff]`. 1 file config tất cả.
12. **Build wheel** — `pip install build && python -m build`. Tạo `.whl` (binary) và `.tar.gz` (source) trong `dist/`.
13. **Publish PyPI** — `pip install twine && twine upload dist/*`. Cần account PyPI + API token.
14. **`ruff` — lint + format modern** — `pip install ruff`. `ruff check .` lint, `ruff format .` format. Cực nhanh (Rust). Thay thế `flake8` + `black` + `isort`.
15. **Pre-commit hook** — `pre-commit` framework. `.pre-commit-config.yaml` declare hooks (ruff, mypy, pytest). `pre-commit install` setup git hook.

### Key concepts

- pytest convention-over-config: function `test_*` tự pickup
- Fixture là DI cho test
- Mock isolate unit khỏi external dependency
- pyproject.toml là single source of truth modern
- ruff thay nhiều tool cũ, cực nhanh

### Code examples

1. Test `add(a, b)` với parametrize 5 case
2. Fixture `temp_db` setup db trước test, drop sau
3. Mock HTTP call: `@patch('requests.get')` để không gọi real network
4. `pyproject.toml` đầy đủ cho project Python typical
5. Publish flow: build wheel → upload TestPyPI → upload PyPI

### Visualizer / diagram

- Bảng test framework Python: unittest vs pytest vs ward
- Diagram test pyramid: unit (nhiều) > integration > e2e (ít)
- Flow publish PyPI: code → build → twine upload → pypi.org
- Bảng ruff vs flake8 + black + isort

### Bài tập (5)

1. Viết function `is_palindrome(s: str) -> bool` (chương 2). Tạo file test với pytest, dùng parametrize 10 case. Chạy đảm bảo green.
2. Viết function `fetch_user_data(user_id: int) -> dict` gọi `requests.get`. Test với mock `requests.get` trả fake JSON. Không gọi real network.
3. Setup `pyproject.toml` + `ruff` + `mypy` + `pytest` cho 1 project mini. Add `[tool.ruff]` rules, `[tool.mypy]` strict. Chạy `ruff check`, `mypy`, `pytest` — all green.
4. Tạo package nhỏ (vd `my-utils` với 2 function), build wheel, install local từ wheel: `pip install ./dist/my_utils-0.1.0-py3-none-any.whl`. Test import từ project khác.
5. Setup `pre-commit-config.yaml` với hooks: ruff, mypy, pytest. Cài `pre-commit install`. Test: thử commit code có lỗi ruff → bị reject.

### Quiz (8)

1. pytest và unittest, cái nào built-in? — `unittest` (stdlib). `pytest` là 3rd-party, phải `pip install pytest`. Nhưng phần lớn project Python dùng pytest.
2. Fixture scope mặc định? — `function`. Mỗi test 1 instance fixture.
3. `@pytest.mark.parametrize` thay được nhiều test function không? — Có. 1 function + nhiều input, sinh ra nhiều test case. Giảm boilerplate.
4. `@patch` áp dụng theo thứ tự nào với multiple decorator? — Bottom-up vào parameter order. `@patch('a'), @patch('b'), def test(mock_b, mock_a):` (b inner bind trước).
5. Coverage 100% có nghĩa code đúng? — Không. Coverage chỉ đo % line/branch được execute. Không đo có assertion đúng không. Code có thể execute mà bug logic.
6. `pyproject.toml` thay file gì? — `setup.py` (build), `setup.cfg` (metadata), `MANIFEST.in` một phần, `requirements.txt` (deps có thể thay). Modern: 1 file.
7. Khác `ruff format` và `black`? — `ruff format` viết Rust, nhanh hơn black ~30x. Output gần như giống black (cùng style). Khuyên ruff format cho project mới.
8. Pre-commit hook lúc nào chạy? — Trước `git commit`. Nếu hook fail, commit bị reject. Bảo đảm code chưa fix không vào history.

### Connects to

- Toàn bộ chương trước — apply lên project Python production
- DevOps pillar (trụ cột 8) — CI/CD chạy pytest, ruff, mypy

### Ước lượng độ dài

~1000-1100 dòng HTML.

---

## Tổng kết và quyết định locked

### Decisions locked (cho Phase 2 viết HTML)

1. **Python 3.12+ target** — tận dụng `match`/`case`, PEP 695 generic syntax, exception groups.
2. **Tooling default: `uv`** — recommended trong Chương 1 setup, sau đó dùng xuyên suốt.
3. **Type hints xuyên suốt** — mọi code example có type hints, không "Python-without-types" như tutorial cũ.
4. **`pytest` thay `unittest`** — test stack mặc định.
5. **`ruff` thay `flake8` + `black` + `isort`** — lint/format mặc định.
6. **Standard library trước framework** — không dạy Django/FastAPI/Flask. Bạn học core Python xong, framework là chương riêng (sau này có thể là Pillar 10).
7. **Async với asyncio + httpx** — không dạy Twisted hay Trio. asyncio là chuẩn stdlib.
8. **PEP 8 strict + ruff strict** — code example tuân theo.

### Ước lượng tổng độ dài

- 10 chương × ~950 dòng trung bình = **~9,500 dòng HTML**
- Cộng index.html + theme.css = **~9,800-10,000 dòng**

### Theme đề xuất (chờ user confirm khi build CSS)

| Yếu tố | Đề xuất |
|---|---|
| Background | Off-white warm `#f5f1e8` (gần Dart nhưng tone khác) |
| Accent chính | Python blue `#306998` (logo Python xanh đậm) |
| Accent phụ | Python yellow `#ffd43b` (logo Python vàng) |
| Display font | **Source Serif 4** (variable, modern serif, contrast vừa) |
| Body font | Inter |
| Code font | JetBrains Mono |
| Code block bg | Dark blue-grey `#1e2533` (gần colorscheme Atom One Dark) |
| Callout | xanh nhạt cho note, vàng nhạt cho warning |

Theme nên cảm giác "calm + thinking" — phản ánh Python = ngôn ngữ rõ ràng, sạch sẽ, không loud.

### Interactive component đề xuất

- **Python playground inline** — nhúng Pyodide (Python in browser via WASM) cho user chạy code trực tiếp trong page. Khác Dart/JS — full Python stdlib có sẵn.
- **REPL widget** — đặc biệt cho chương 1-3, user nhập expression, xem output.
- **Visualizer comprehension** — animation list/dict comprehension step-by-step (chương 3).

### Connects to existing pillars

- **Dart Chương 2/6/7** — đối chiếu type system, collection, async
- **JavaScript Chương 6/9** — async, type hint, Python typing tương tự TS
- **OOP (trụ cột 6)** — Python OOP instance cụ thể
- **CLI (trụ cột 1)** — Python script là CLI tool phổ biến
- **DSA (trụ cột 2)** — Python là ngôn ngữ phổ biến để học DSA (interview)
- **DevOps (trụ cột 8)** — Docker hoá Python app, CI/CD cho Python project

### Workflow cho Phase 2

1. User approve outline này (file `PYTHON-OUTLINE.md`)
2. User approve theme (cream/blue + Source Serif 4) hoặc đề xuất khác
3. Tôi tạo `Python/css/theme.css`, `Python/js/playground.js` (Pyodide), `Python/index.html`
4. Viết 10 chương HTML theo trình tự, mỗi chương follow outline tương ứng
5. Update `Programming Language/index.html` thêm card Python
6. Update `PLAN.md` checklist tiến độ
7. Update memory `project_dart_flutter_curriculum.md` (đổi tên rộng hơn: `project_programming_language_curriculum.md`)

---

**End of PYTHON-OUTLINE.md**
