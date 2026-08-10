# JavaScript Curriculum — Outline chi tiết 12 chương (JS core + TypeScript)

**Sub-pillar:** JavaScript (thuộc Programming Language pillar — trụ cột 9 của IT Basic)
**Số chương:** 12 (8 JS core + 4 TypeScript)
**Phiên bản target:** ECMAScript 2024 + TypeScript 5.4+
**Started:** 2026-05-20
**Status:** Outline phase — chờ user approve trước khi viết HTML content

## Mục đích của file này

File này là **bản thiết kế chi tiết** (spec) cho 12 chương JavaScript. Khi sang Phase 2 (viết HTML), mỗi chương được viết bằng cách **mở rộng** outline tương ứng — không cần thiết kế lại scope, không cần quyết định lại nội dung gì có/không có.

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

## Triết lý chung của curriculum JavaScript

1. **Modern JavaScript first (ES2020+)** — ưu tiên `let`/`const`, arrow function, destructuring, spread, optional chaining, nullish coalescing. `var` chỉ nhắc khi giải thích hoisting/scope. Không dạy callback hell như default, chỉ giới thiệu lịch sử để hiểu vì sao có Promise/async.
2. **Tách 3 lớp: ngôn ngữ — runtime — ecosystem** — JavaScript ngôn ngữ (ECMAScript spec) ≠ JavaScript trong browser (Web API: DOM, fetch) ≠ JavaScript trong Node (fs, http). Curriculum tập trung lớp 1 (ngôn ngữ) + đủ lớp 2-3 để chạy code.
3. **TypeScript là superset, không phải thay thế** — học JS chắc trước (chương 1-8), rồi mới TS (chương 9-12). Mỗi feature TS đều được giải thích "vì sao JS không đủ".
4. **Mental model về event loop là critical** — chương 6 (async) dành slot lớn vẽ diagram call stack / web API / task queue / microtask queue. Không hiểu event loop = không viết được JS production.
5. **Type system như ngôn ngữ thiết kế** — TypeScript không chỉ "ngăn bug" mà còn là cách diễn đạt invariant, contract, intent. Chương 11 (advanced types) coi types là first-class citizen.
6. **So sánh với Dart khi có ích** — user vừa học Dart xong, nên reference nhanh: `Future` ≈ `Promise`, `Stream` ≈ `Observable/AsyncIterable`, Dart sound null safety ≈ TS strict mode + non-null assertion.

---

## Chương 1 — Hello JavaScript

### Mục tiêu chương

Học xong chương 1, người đọc sẽ:
- Hiểu lịch sử ngắn của JavaScript (Brendan Eich 1995, ECMAScript spec, các phiên bản lớn)
- Phân biệt JavaScript ngôn ngữ vs runtime (V8, SpiderMonkey, JavaScriptCore) vs môi trường (browser, Node, Deno, Bun)
- Chạy được JS ở 3 nơi: browser DevTools console, Node REPL, file `.js` qua `node`
- Biết các tool core: `node`, `npm`/`pnpm`/`yarn`, `npx`, `eslint`, `prettier`
- Hiểu khái niệm "ESM vs CommonJS" ở mức intro (sâu hơn ở chương 8)
- Setup được project mini: `npm init`, `package.json`, `node_modules`

### Lý do học

Đây là chương "lên xe" — không có chương này, mọi chương sau đều giả định người đọc chạy được file `.js`. Chương 1 cũng phá ngộ nhận lớn: "JavaScript là ngôn ngữ trên trình duyệt" — thực ra JS chạy ở rất nhiều nơi, và mỗi nơi cung cấp API khác nhau.

### Prerequisites

Không có — chương khởi đầu. Giả định người đọc đã dùng terminal cơ bản (tham khảo trụ cột CLI nếu cần).

### Sections

1. **JavaScript là gì** — Lịch sử (Netscape 1995, "10 ngày tạo ngôn ngữ"), ECMAScript spec (ES5/ES6/ES2015→ES2024), TC39 process, vì sao tên có "Java" mà không liên quan Java.
2. **Runtime và môi trường thực thi** — V8 (Chrome/Node), SpiderMonkey (Firefox), JavaScriptCore (Safari/Bun). Bảng so sánh Node vs Deno vs Bun: cùng V8 (Bun dùng JavaScriptCore) nhưng API khác.
3. **Chạy JS ở browser** — Mở DevTools (F12 / Cmd+Opt+I), tab Console, gõ `1 + 1`. Giải thích Console = REPL kèm Web API.
4. **Chạy JS với Node** — Cài Node (nvm khuyến khích), `node --version`, REPL `node`, chạy file `node hello.js`.
5. **Hello World** — File `hello.js`: `console.log('Xin chào JavaScript')`. Chạy bằng `node hello.js`. Đọc args qua `process.argv`.
6. **package.json — manifest của project JS** — `npm init -y`, các field quan trọng: `name`, `version`, `type` (module/commonjs), `scripts`, `dependencies`, `devDependencies`.
7. **npm ecosystem cơ bản** — npmjs.com, `npm install <pkg>`, `npm install -D <pkg>` (dev), `npm install -g` (global cảnh báo), `package-lock.json`. Khi nào nên dùng pnpm/yarn (workspaces, hard links).
8. **Tooling baseline** — Prettier (format), ESLint (lint), Node types nếu dùng TS. `npx` để chạy package mà không cần install global.
9. **IDE setup** — VS Code + extension JavaScript/TypeScript (built-in), Prettier, ESLint. Setting format on save.
10. **Compile mode** — JS không cần compile (interpreter), nhưng có 2 process biến đổi phổ biến: bundler (esbuild/vite/webpack/rollup) và transpiler (Babel cho legacy). Sâu hơn ở chương 8.

### Key concepts

- JavaScript là ngôn ngữ động, single-threaded, interpreted (có JIT optimization)
- ECMAScript = spec, JavaScript = implementation phổ biến của spec (cũng có ActionScript, JScript trong lịch sử)
- Browser cung cấp Web API (DOM, fetch, localStorage), Node cung cấp Node API (fs, http, process) — không trộn lẫn
- `package.json` ≈ `pubspec.yaml` của Dart, format JSON không phải YAML
- `node_modules/` ≈ `.dart_tool/` về vai trò "không commit" và `package-lock.json` ≈ `pubspec.lock`

### Code examples

1. `hello.js` — `console.log('Xin chào JavaScript')`, chạy với `node hello.js`
2. `greet.js` — `const name = process.argv[2] ?? 'bạn'; console.log(\`Xin chào, ${name}\`)`, chạy với `node greet.js Việt`
3. Snippet trong DevTools Console — `document.title`, `window.location.href`, demo Web API tồn tại
4. `package.json` mẫu — đầy đủ field, `"type": "module"` để dùng ESM
5. Demo `npm install lodash`, xem `node_modules/` mọc lên, `package-lock.json` thay đổi

### Visualizer / diagram

- Sơ đồ "JavaScript landscape": ECMAScript spec → engines (V8/SpiderMonkey/JSC) → runtimes (browser/Node/Deno/Bun) → ecosystem (npm/jsr)
- Bảng so sánh API có sẵn: cột (API, có ở browser, có ở Node, có ở Deno/Bun)
- Visual `package.json` mẫu với annotation từng field

### Bài tập (5)

1. Cài Node qua nvm, chạy `node --version`, screenshot kết quả.
2. Mở browser DevTools, gõ `navigator.userAgent` trong Console, copy kết quả. Sau đó chạy `node -e "console.log(process.version)"` — so sánh.
3. Tạo file `greet.js` đọc tên qua command-line args, in ra "Xin chào, [tên]" (nếu không có tên thì "Xin chào, bạn"). Chạy thử cả 2 cách.
4. `npm init -y` ở folder mới, mở `package.json`, sửa `"name"`, thêm script `"start": "node hello.js"`. Chạy `npm start`.
5. `npm install date-fns`, viết file dùng `format(new Date(), 'dd/MM/yyyy')` để in ngày hôm nay theo định dạng Việt Nam. Sau đó xoá `node_modules/`, chạy `npm install` lại — quan sát `package-lock.json` đảm bảo phiên bản giống nhau.

### Quiz (7)

1. JavaScript và Java có liên quan gì không? — Không. Tên "JavaScript" là marketing năm 1995 khi Java đang hot. Hai ngôn ngữ khác nhau hoàn toàn về thiết kế.
2. `console.log` có ở mọi môi trường JS không? — Có ở phần lớn (browser, Node, Deno, Bun) như de-facto standard, nhưng KHÔNG nằm trong ECMAScript spec. Nó là API của host environment.
3. `package.json` và `package-lock.json` khác gì? — `.json` là declaration (version range như `^1.2.0`), `.lock` là resolved version cụ thể (`1.2.5`). `.lock` PHẢI commit cho app để đảm bảo reproducible build.
4. `npm install -g` có nên dùng không? — Hạn chế. Lý do: package global dễ conflict version giữa project. Dùng `npx` hoặc devDependency + `npm scripts` thay thế.
5. `node hello.js` có cần `package.json` không? — Không. Node chạy được file `.js` standalone. Nhưng nếu file có `import`/`export`, cần `package.json` có `"type": "module"` HOẶC đổi đuôi `.mjs`.
6. ECMAScript phiên bản mới ra mỗi bao lâu? — Mỗi năm (kể từ ES2015). Mỗi tháng 6, TC39 finalize feature đã ở stage 4 thành phần của spec năm đó.
7. Trong browser, JS có truy cập file system local không? — Không trực tiếp (sandboxed). Chỉ qua File System Access API (user phải explicit chọn file) hoặc `<input type="file">`. Đây là lý do Node tồn tại — để JS làm server/CLI.

### Connects to

- Chương 2-8 — mọi ví dụ giả định người đọc chạy được `node file.js`
- Chương 8 (Modules) — đào sâu ESM/CommonJS đã touch ở section 6
- Chương 12 (TS Compiler) — `tsconfig.json` ≈ extension của `package.json`

### Ước lượng độ dài

~700-800 dòng HTML (chương khởi động, không quá nặng cú pháp, nặng setup + diagram).

---

## Chương 2 — Variables, Types & Coercion

### Mục tiêu chương

Học xong chương 2, người đọc sẽ:
- Hiểu 3 cách khai báo biến: `var`, `let`, `const` và biết KHI NÀO dùng cái nào (mặc định `const`, fallback `let`, tránh `var`)
- Phân biệt 7 primitive types: `string`, `number`, `bigint`, `boolean`, `undefined`, `symbol`, `null` (và Object như non-primitive)
- Hiểu `null` vs `undefined`: KHI NÀO JS cho ra `undefined` (uninitialized, missing arg, missing property) vs khi nào lập trình viên explicit gán `null`
- Nắm được type coercion: implicit (`==`, `+`, `if`) vs explicit (`Number()`, `String()`, `Boolean()`)
- Biết các gotcha kinh điển: `[] == ![]`, `NaN !== NaN`, `0.1 + 0.2 !== 0.3`, `typeof null === 'object'`
- Hiểu khi nào dùng `===` (strict) vs `==` (loose, gần như không bao giờ)

### Lý do học

Type coercion của JS là nguồn của hàng loạt bug nổi tiếng. Hiểu rule coercion = viết được code dự đoán được. Đây cũng là nền tảng để sang TypeScript: bạn cần biết JS "type" thật sự là gì (runtime) trước khi học TS "type" (compile-time).

### Prerequisites

Chương 1 (chạy được file JS).

### Sections

1. **Khai báo biến: `var`, `let`, `const`** — Bảng so sánh: scope (function vs block), hoisting (undefined vs TDZ), reassignment, redeclaration. Khuyến nghị: default `const`, dùng `let` khi cần thay đổi, `var` chỉ học để hiểu code cũ.
2. **7 primitive types** — Bảng từng type: ví dụ, `typeof` trả về gì, có wrapper object không (String/Number/Boolean), có gotcha gì.
3. **`null` vs `undefined`** — Mental model: `undefined` = "chưa được gán" (JS tự sinh), `null` = "explicit empty" (lập trình viên gán). Khi nào API trả `null` (vd `document.getElementById` không tìm thấy) vs `undefined`.
4. **Number — chỉ có 1 type number** — Không phân biệt int/float như Dart. Tất cả là IEEE 754 double. `0.1 + 0.2 = 0.30000000000000004`. `Number.MAX_SAFE_INTEGER`. `BigInt` cho số lớn hơn.
5. **String** — Single quote vs double quote vs backtick (template literal), `${expr}` interpolation, multiline, escape, immutable.
6. **Boolean và Truthy/Falsy** — 6 giá trị falsy: `false`, `0`, `''`, `null`, `undefined`, `NaN`. Tất cả còn lại truthy (kể cả `[]`, `{}`, `'0'`, `'false'`). `Boolean(x)` để convert.
7. **Type coercion — implicit** — Quy tắc `+` với string (concat), `+` với number (add), `-` chỉ number. Quy tắc `==` (Abstract Equality Comparison). Sơ đồ flow chart cho `==`.
8. **Type coercion — explicit** — `Number(x)`, `String(x)`, `Boolean(x)`, `parseInt`, `parseFloat`. Khi nào dùng cái nào. Trick `+x` (chuyển sang number), `!!x` (chuyển sang boolean).
9. **`typeof` operator** — Trả về string. Bảng: `typeof undefined === 'undefined'`, `typeof null === 'object'` (bug lịch sử). `typeof function === 'function'` (đặc biệt).
10. **Gotcha kinh điển và cách tránh** — `NaN !== NaN` (dùng `Number.isNaN`), `0.1 + 0.2` (dùng `toFixed` hoặc lib `decimal.js`), `[] == false` (dùng `===`), `typeof null` (kiểm tra `x === null` riêng).

### Key concepts

- `let`/`const` block-scoped, `var` function-scoped (di sản từ pre-ES6)
- Hoisting: tất cả khai báo "lên đầu scope" nhưng `let`/`const` ở TDZ (Temporal Dead Zone) cho đến dòng khai báo
- Primitive là immutable — `'abc'.toUpperCase()` không thay đổi string gốc mà trả về string mới
- `===` so sánh value + type, `==` còn coercion (gần như nên cấm trừ `x == null` để check cả null lẫn undefined)
- JS không có `int`, chỉ `number` (IEEE 754) → cẩn thận với phép cộng số thập phân
- `NaN` là number duy nhất không bằng chính nó

### Code examples

1. Demo TDZ — `console.log(x); let x = 5;` báo ReferenceError, vs `var` thì in `undefined`
2. Bảng `typeof` cho từng giá trị
3. Demo coercion: `1 + '2' === '12'`, `1 + true === 2`, `null + 1 === 1`, `undefined + 1 === NaN`
4. Demo gotcha `0.1 + 0.2` và cách dùng `(0.1 + 0.2).toFixed(2)` hoặc check `Math.abs(a - b) < Number.EPSILON`
5. Pattern check empty: `if (!value)` vs `if (value == null)` vs `if (value === undefined)` — khi nào dùng cái nào

### Visualizer / diagram

- Sơ đồ "Type hierarchy của JS": primitive (7 types) vs object
- Flow chart so sánh `==` (Abstract Equality) — các bước coerce
- Bảng truthy/falsy với ví dụ cụ thể
- Bảng so sánh `var`/`let`/`const` (scope, hoisting, reassign, redeclare)

### Bài tập (5)

1. Đoán kết quả không chạy: `console.log(typeof null, typeof undefined, typeof NaN, typeof [], typeof null === typeof {})`. Sau đó chạy thử và giải thích.
2. Viết function `isEmpty(value)` trả về `true` nếu value là `null`, `undefined`, `''`, hoặc `[]` rỗng / `{}` rỗng. Test với 10 case.
3. Tìm cách check `x` là số nguyên không. Hint: `Number.isInteger(x)`, nhưng còn `'5'` thì sao? Viết function `isStrictInteger(x)` strict hơn.
4. Demo gotcha: viết loop dùng `var i` trong setTimeout vs `let i` — giải thích vì sao kết quả khác nhau (closure + scope).
5. Viết function `safeJsonParse(str)` parse JSON, nếu lỗi trả về `null`. Khi parse `'null'` thì return gì? Khi parse `'undefined'` thì sao?

### Quiz (7)

1. `typeof null` trả về gì? — `'object'`. Đây là bug từ thuở JS đầu tiên không thể fix vì backward compat.
2. `[] == false` đúng hay sai? — Đúng (true). Vì coercion: `[]` → `''` → `0`, `false` → `0`, `0 == 0`. Đây là lý do dùng `===`.
3. `const obj = { a: 1 }; obj.a = 2;` có lỗi không? — Không. `const` chỉ chặn reassign biến, không chặn mutate object/array bên trong.
4. Trong `if (x)` thì `x = []` chạy nhánh nào? — Nhánh `true` (truthy). Vì `[]` là object, mọi object đều truthy.
5. `NaN === NaN` trả về gì? — `false`. Đây là rule của IEEE 754. Dùng `Number.isNaN(x)` hoặc `x !== x` để check.
6. `0.1 + 0.2 === 0.3` đúng hay sai? — Sai (false). Vì IEEE 754 double không biểu diễn được chính xác 0.1 và 0.2.
7. Khi nào nên dùng `==` thay `===`? — Hầu như không bao giờ. Một trường hợp hiếm: `x == null` để check cả `null` và `undefined` cùng lúc — nhưng có người vẫn thích viết `x === null || x === undefined` cho rõ ràng.

### Connects to

- Chương 3 (Functions/Scope) — đào sâu hoisting và TDZ
- Chương 4 (Objects) — phân biệt primitive vs object reference
- Chương 9 (TS types) — type của TS đối chiếu với type runtime của JS

### Ước lượng độ dài

~800-900 dòng HTML — nặng bảng so sánh + gotcha + flow chart.

---

## Chương 3 — Functions, Scope & Closures

### Mục tiêu chương

Học xong chương 3, người đọc sẽ:
- Phân biệt 4 cách định nghĩa function: function declaration, function expression, arrow function, method shorthand
- Hiểu `this` binding — quy tắc nào khi nào: default, implicit (method call), explicit (`call`/`apply`/`bind`), `new` (constructor), arrow (lexical)
- Nắm khái niệm scope: global, function, block; scope chain
- Hiểu hoisting: function declaration hoisted fully, function expression chỉ hoisted name (nếu `var`) hoặc TDZ (nếu `let`/`const`)
- Nắm closure: function nhớ scope lúc khai báo, dùng cho data privacy, factory, callback
- Biết các parameter pattern: default params, rest params, destructuring params

### Lý do học

Closure và `this` là 2 concept gây bug nhiều nhất với người chuyển từ ngôn ngữ khác sang JS. Hiểu chúng = không bị "tại sao `this` undefined?". Closure cũng là nền tảng cho module pattern, factory pattern, callback pattern phổ biến.

### Prerequisites

Chương 1-2.

### Sections

1. **4 cách định nghĩa function** — `function foo() {}`, `const foo = function() {}`, `const foo = () => {}`, `{ foo() {} }`. Bảng: hoisting? có `this` riêng? có `arguments` không? dùng `new` được không?
2. **Function là first-class** — Gán biến, truyền argument, return từ function, lưu trong array/object. Đây là gốc rễ của functional programming trong JS.
3. **Parameters: default, rest, destructuring** — `function foo(a = 1, b = 2, ...rest)`, `function foo({ x, y })`. Order matter: default đứng cuối, rest cuối cùng.
4. **Arrow function — khác gì function thường** — 4 điểm: (a) không có `this` riêng (dùng `this` lexical), (b) không có `arguments`, (c) không dùng được với `new`, (d) không có `prototype` property. Khi nào dùng / không dùng.
5. **`this` binding — 4 quy tắc** — Default (strict: undefined, sloppy: window), implicit (`obj.method()`), explicit (`fn.call(ctx)`, `fn.apply(ctx, args)`, `fn.bind(ctx)`), `new` binding. Arrow ngoại lệ: lexical, không bị các quy tắc trên.
6. **Scope — global / function / block** — Block scope chỉ áp dụng cho `let`/`const`. `var` ignore block. Demo: `if (true) { var x = 1; } console.log(x)` chạy, `let x` thì lỗi.
7. **Scope chain & hoisting** — Khi truy cập biến, JS đi từ scope hiện tại ra ngoài cho đến global. Hoisting: function declaration nhảy lên đầu scope, function expression với `var` chỉ tên nhảy lên (= undefined), với `let`/`const` ở TDZ.
8. **Closure — định nghĩa và ví dụ** — "Function + scope nó được tạo ra". Ví dụ counter: `function makeCounter() { let n = 0; return () => ++n; }`. Closure giữ biến sống lâu hơn function tạo ra nó.
9. **Closure patterns** — (a) Data privacy (encapsulation), (b) Factory function, (c) Memoization, (d) Once-only callback, (e) Currying.
10. **IIFE — Immediately Invoked Function Expression** — `(function() { ... })()`. Dùng để tạo scope cô lập (trước khi có module). Ngày nay ít cần vì có ESM.

### Key concepts

- Function declaration hoisted hoàn toàn → có thể gọi trước khi khai báo
- Function expression với `const` không hoisted → TDZ
- `this` của function thường = "ai gọi nó", `this` của arrow = "scope khai báo"
- Closure không phải feature riêng, mà là hệ quả của lexical scoping + first-class function
- `let` trong loop tạo scope mới mỗi iteration → fix bug `setTimeout` trong loop kinh điển

### Code examples

1. Demo 4 cách định nghĩa, table so sánh kèm sample
2. Demo `this` 4 cách bind, kèm output từng cách
3. Closure counter: `makeCounter()` trả về 3 hàm: increment, decrement, get
4. Demo `setTimeout` trong loop với `var` vs `let` — kết quả khác nhau, giải thích
5. Memoize pattern: `function memoize(fn) { const cache = new Map(); return (x) => cache.has(x) ? cache.get(x) : (cache.set(x, fn(x)), cache.get(x)); }`

### Visualizer / diagram

- Sơ đồ scope chain: global → outer → inner, lookup đi từ trong ra ngoài
- Diagram `this` binding: 4 rule với priority (new > explicit > implicit > default)
- Animation/visualizer closure: function "nắm tay" biến của scope cha
- Bảng so sánh function thường vs arrow (5 điểm)

### Bài tập (5)

1. Viết function `add(a, b)` 3 cách: declaration, expression, arrow. Kiểm tra hoisting bằng cách gọi `add(1, 2)` trước dòng khai báo cho từng cách.
2. Viết object `user` có method `greet()`. Sau đó gán `const fn = user.greet`. Gọi `fn()` — `this` là gì? Sửa lại để `this` luôn là `user` (3 cách: `bind`, arrow + capture, hoặc closure).
3. Viết function `once(fn)` — trả về function chỉ chạy `fn` 1 lần đầu, các lần sau return cached result. Test với function in `console.log`.
4. Viết function `curry(fn)` — convert `fn(a, b, c)` thành `fn(a)(b)(c)`. Bắt đầu với version fix 3 args, sau đó mở rộng cho n args.
5. Sửa bug: code dưới in ra `3 3 3` thay vì `0 1 2`. Sửa bằng 2 cách (đổi `var` → `let`, hoặc IIFE).
   ```js
   for (var i = 0; i < 3; i++) {
     setTimeout(() => console.log(i), 100);
   }
   ```

### Quiz (7)

1. Function declaration và function expression khác nhau ở điểm nào về hoisting? — Declaration hoisted toàn bộ (name + body), expression chỉ hoisted name (nếu `var`) hoặc TDZ (nếu `let`/`const`).
2. Arrow function có `this` riêng không? — Không. Arrow dùng `this` của scope khai báo (lexical). Đây là lý do arrow phù hợp với callback trong method.
3. `function foo() { console.log(this); } foo();` in ra gì? — Trong strict mode: `undefined`. Sloppy mode: `window` (browser) hoặc `global` (Node).
4. Closure có giải phóng biến sau khi function trả về không? — Không nếu vẫn còn reference đến closure. JS GC chỉ thu hồi khi không còn reference. Đó là lý do closure "nhớ" được.
5. `for (let i = 0; i < 3; i++) { setTimeout(() => console.log(i), 0); }` in ra gì? — `0 1 2`. Vì `let` tạo binding mới mỗi iteration. Nếu là `var` thì in `3 3 3` vì cùng 1 biến.
6. Có thể dùng `new` với arrow function không? — Không. Arrow không có internal `[[Construct]]` method.
7. `const fn = obj.method; fn.call(obj)` và `obj.method()` cho kết quả gì khác nhau? — Giống nhau, vì `call(obj)` explicit bind `this = obj`, tương đương implicit qua `obj.method()`.

### Connects to

- Chương 4 (Objects) — method là function attached vào object, `this` rule áp dụng
- Chương 5 (Iterables) — callback function passed cho map/filter/reduce
- Chương 6 (Async) — closure giữ scope cho async callback

### Ước lượng độ dài

~900-1000 dòng HTML — chương dày vì closure + this cần nhiều ví dụ.

---

## Chương 4 — Objects, Prototypes & Classes

### Mục tiêu chương

Học xong chương 4, người đọc sẽ:
- Tạo object bằng 4 cách: object literal, `new Object()`, `Object.create(proto)`, `class`
- Hiểu prototype chain: mỗi object có `__proto__`, lookup property đi theo chain
- Phân biệt `prototype` (property của Function/Class) vs `__proto__` (property của Instance)
- Sử dụng `class` syntax: constructor, instance method, static method, getter/setter, inheritance qua `extends`, `super`
- Hiểu private field (`#field`), khác gì convention `_field`
- Nắm pattern phổ biến: factory function, mixin, composition over inheritance
- Phân biệt reference vs value: primitive copy by value, object copy by reference

### Lý do học

JavaScript là ngôn ngữ prototype-based, nhưng cú pháp `class` (ES6) làm nó "trông giống" Java/C++. Hiểu sự khác biệt giúp đọc code library, tracking bug "method không tồn tại", và thiết kế hệ thống không lạm dụng inheritance.

### Prerequisites

Chương 1-3.

### Sections

1. **Object literal** — `{ key: value }`, shorthand property (`{ x }` ≡ `{ x: x }`), computed key (`{ [k]: v }`), method shorthand (`{ foo() {} }`).
2. **Property access** — Dot notation vs bracket notation, optional chaining `?.`, nullish coalescing `??`. Khi nào dùng bracket (key có dấu cách, dấu đặc biệt, hoặc dynamic).
3. **Reference vs value** — Demo: `const a = { x: 1 }; const b = a; b.x = 2; console.log(a.x)` in 2. Vs `const a = 1; let b = a; b = 2; console.log(a)` in 1. Lý do: object lưu reference.
4. **Object methods** — `Object.keys/values/entries`, `Object.assign`, spread `{...obj}`, `Object.freeze`, `Object.seal`, `Object.fromEntries`. Khi nào dùng cái nào.
5. **Prototype — mental model** — Mọi object có `__proto__` trỏ về parent. Khi truy cập property, JS đi theo chain từ object lên prototype, cho đến `null`. Lookup time O(chain depth).
6. **`Object.create(proto)`** — Cách low-level nhất tạo object với prototype tuỳ chọn. Hữu ích để hiểu cơ chế trước khi đến `class`.
7. **`class` syntax (ES6+)** — `class User { constructor(name) { this.name = name; } greet() { ... } }`. Behind the scenes: `class` chỉ là syntactic sugar cho `function` + `prototype`.
8. **Static method và static property** — `static makeAdmin()`. Dùng khi method không phụ thuộc instance state (vd factory, helper, constant).
9. **Getter / Setter** — `get fullName() { ... }`, `set fullName(value) { ... }`. Behavior như property nhưng có logic. Trade-off với method.
10. **Inheritance qua `extends` và `super`** — `class Admin extends User { constructor(name) { super(name); } }`. Khi nào hợp lý dùng inheritance (is-a), khi nào không (favor composition).
11. **Private field `#field` (ES2022)** — `class Counter { #count = 0; increment() { this.#count++; } }`. Khác `_count` convention: `#` thực sự private (compile-time enforce), `_` chỉ là quy ước.
12. **Composition over inheritance** — Pattern: thay vì `class B extends A`, ta dùng `class B { constructor() { this.a = new A(); } }` hoặc mixin. Demo case study: cây class deep vs composition flat.

### Key concepts

- JavaScript là prototype-based, không phải class-based — `class` là sugar
- Mọi instance đều có `__proto__` trỏ về `ConstructorFunction.prototype`
- Inheritance qua prototype chain, không phải copy field
- Object copy by reference, primitive copy by value
- Private field `#field` là feature ngôn ngữ thật sự, không phải convention

### Code examples

1. Demo `__proto__` chain: `[].__proto__ === Array.prototype`, `Array.prototype.__proto__ === Object.prototype`
2. `Object.create(null)` vs `{}` — khác nhau ở prototype (`null` vs `Object.prototype`)
3. Class `Animal` với method `speak`, class `Dog extends Animal` override `speak`, demo `super.speak()`
4. Counter với `#count` private vs `_count` convention — demo `counter._count = -999` hack được vs `counter.#count` không truy cập từ ngoài
5. Composition: `class Logger { log(msg) {...} }; class UserService { constructor() { this.logger = new Logger(); } }`

### Visualizer / diagram

- Diagram prototype chain với 3-4 level (instance → constructor.prototype → parent.prototype → Object.prototype → null)
- Bảng so sánh inheritance (extends) vs composition (has-a)
- Visualizer "reference vs value" — 2 ô nhớ với mũi tên cho object, ô đơn cho primitive
- Bảng method `Object.*` với input/output ví dụ

### Bài tập (5)

1. Viết function `deepClone(obj)` — clone object lồng nhau. Test với object có nested object, array, và circular reference (challenge).
2. Tạo class `BankAccount` với `#balance` private. Method `deposit`, `withdraw` (throw nếu không đủ), getter `balance`. Test rằng `account.#balance` từ ngoài không truy cập được.
3. Tạo class `Shape` (base), `Circle extends Shape`, `Square extends Shape`. Override `area()`. Sau đó refactor sang composition: `class Shape { constructor(strategy) { this.strategy = strategy; } area() { return this.strategy.area(); } }`. So sánh trade-off.
4. Viết `Object.pick(obj, keys)` (chọn 1 số key) và `Object.omit(obj, keys)` (loại 1 số key) — tương tự `_.pick`/`_.omit` của lodash.
5. Tạo mixin `Serializable` có method `toJSON()` và `fromJSON(str)`. Apply vào class `User` qua `Object.assign(User.prototype, Serializable)`. Demo work với cả `class User` viết bằng `class` syntax lẫn cũ.

### Quiz (8)

1. `{}` và `Object.create(null)` khác gì? — `{}` có prototype `Object.prototype` (do đó có `toString`, `hasOwnProperty`). `Object.create(null)` không có prototype, "pure dictionary". Tốt cho map dữ liệu user-input tránh prototype pollution.
2. `class` của JS có khác gì `class` của Java về bản chất? — Khác. Java class compile sang class file riêng, JS class chỉ là function + prototype. JS không có overload method (chỉ có method cuối ghi đè), không có abstract class native, không có interface.
3. Private field `#x` và `_x` khác gì? — `#x` thực sự private (cú pháp ngôn ngữ, runtime throw nếu truy cập từ ngoài). `_x` chỉ convention, vẫn truy cập được. Dùng `#` khi muốn enforce thật sự.
4. `instance.__proto__` và `Constructor.prototype` có liên quan gì? — `instance.__proto__ === Constructor.prototype`. Khi `new Constructor()`, JS gán `__proto__` của instance = `Constructor.prototype`.
5. `static` method gọi qua instance được không? — Không trực tiếp. `User.makeAdmin()` chạy, `userInstance.makeAdmin()` undefined. Static thuộc class, không thuộc instance.
6. Khi `class B extends A` và B có `constructor`, có bắt buộc gọi `super()` không? — Có. Phải gọi `super()` TRƯỚC khi truy cập `this`. JS sẽ throw nếu quên.
7. `Object.freeze(obj)` có làm nested object freeze không? — Không. Chỉ freeze level 1. Muốn deep freeze cần đệ quy tự viết.
8. Composition và inheritance, cái nào tốt hơn? — Tuỳ case. Inheritance phù hợp khi có quan hệ "is-a" rõ ràng (Admin is User). Composition phù hợp khi "has-a" (Car has Engine) và linh hoạt hơn cho thay đổi. Lời khuyên phổ biến: "favor composition over inheritance" để tránh tree class sâu khó refactor.

### Connects to

- Chương 5 (Iterables) — array là object đặc biệt với numeric key + length
- Chương 11 (TS Advanced Types) — type modeling cho class hierarchy
- OOP pillar (trụ cột 6) — design pattern cụ thể với class

### Ước lượng độ dài

~1000-1100 dòng HTML — nặng vì prototype + class + private + pattern.

---

## Chương 5 — Arrays, Iterables & Iteration Protocols

### Mục tiêu chương

Học xong chương 5, người đọc sẽ:
- Sử dụng thành thạo Array methods: `map`, `filter`, `reduce`, `forEach`, `find`, `findIndex`, `some`, `every`, `flat`, `flatMap`, `sort`
- Phân biệt mutating methods (`push`, `pop`, `splice`, `sort`) và non-mutating (`concat`, `slice`, `map`, mới: `toSorted`, `toReversed`)
- Hiểu Iteration Protocol: `[Symbol.iterator]`, `next()`, `done`/`value`
- Viết được custom iterable, custom iterator
- Sử dụng generator function (`function*`, `yield`) cho lazy sequence
- Nắm Set, Map, WeakSet, WeakMap — khi nào dùng cái nào
- Hiểu spread vs rest, destructuring array/object sâu

### Lý do học

Phần lớn data trong app JS là collection (array, object, response từ API). Master Array/Iterable methods = code ngắn hơn 50%, ít bug hơn. Iteration protocol là nền của `for...of`, spread, destructuring — feature dùng hàng ngày.

### Prerequisites

Chương 1-4.

### Sections

1. **Array — basic** — Tạo `[]`, `new Array(n)` (gotcha: tạo sparse), `Array.of`, `Array.from`. Length property và sparse array.
2. **Mutating vs non-mutating methods** — Bảng đầy đủ. Khuyên: trừ khi performance cần, ưu tiên non-mutating cho code dễ đọc + immutable mindset.
3. **Map, Filter, Reduce — trinity của functional JS** — Mỗi method: signature, ví dụ, gotcha. `reduce` đặc biệt: hơn 80% case dùng có thể đơn giản hoá bằng phối hợp khác.
4. **forEach vs for/of vs for** — Bảng: có thể break? có async work tốt? có index không? performance? Recommend: `for/of` mặc định, `forEach` cho side effect đơn giản, `for` cổ điển khi cần index + break.
5. **Find / Some / Every / Includes** — Cái nào early return, cái nào full scan, cái nào dùng `===` cái nào dùng predicate.
6. **Flat / FlatMap** — `flat(Infinity)` để flatten sâu, `flatMap` ≡ `map().flat(1)` nhưng efficient hơn.
7. **Sort — gotcha** — `[10, 1, 2].sort()` → `[1, 10, 2]` vì so sánh string. Phải truyền comparator: `.sort((a, b) => a - b)`. Sort mutate, `toSorted` (ES2023) không mutate.
8. **Spread và Rest** — Spread `...` để mở array/object ra, rest `...` để gom vào. Cùng cú pháp nhưng ngữ cảnh khác. Demo: copy array shallow, merge object, gather extra args.
9. **Destructuring** — Array: `const [a, b, ...rest] = arr`, object: `const { x, y: yAlias = 1 } = obj`. Nested, default, rename. Pattern: swap variable, function params, return multiple values.
10. **Iteration Protocol** — Object có `[Symbol.iterator]` method → iterable. `[Symbol.iterator]()` trả iterator (object có `next()` return `{ value, done }`). Demo: viết iterable custom (vd range).
11. **Generator function** — `function* range(start, end) { for (let i = start; i < end; i++) yield i; }`. Lazy, có thể dùng `for/of`, có thể spread. Sâu hơn ở chương 6 (cho async).
12. **Set / Map / WeakSet / WeakMap** — Set: unique value, dùng `.has` O(1) thay vì `.includes` O(n). Map: key bất kỳ (Object cũng được), giữ thứ tự insert. Weak: key là object, không giữ reference (GC được).

### Key concepts

- Array là object đặc biệt, key là string số ("0", "1", ...) và có length
- Mutating methods nguy hiểm trong concurrent code và React state — ưu tiên non-mutating
- `map`/`filter` luôn trả array mới cùng length (filter ≤), `reduce` trả gì cũng được (accumulator type)
- Iteration protocol là cơ chế ngầm sau `for/of`, spread, `Array.from`, `Promise.all`
- Set/Map là default cho lookup, Object chỉ khi key luôn string và nhỏ

### Code examples

1. Bảng so sánh mutating vs non-mutating với 10 method phổ biến
2. Demo `reduce` 5 use case: sum, group by, count occurrence, build object from pairs, flatten
3. Sort comparator: number, string locale (`localeCompare`), object by property, multi-key sort
4. Viết iterable `range(start, end, step)` bằng generator
5. Pattern Set: remove duplicates `[...new Set(arr)]`, intersection `a.filter(x => b.has(x))`

### Visualizer / diagram

- Bảng đầy đủ Array methods: mutating?, return value, callback signature, ví dụ
- Diagram iteration protocol: iterable → iterator → next() loop
- Visualizer destructuring: ánh xạ source → target
- Bảng Set/Map vs Object/Array: dùng cho gì

### Bài tập (5)

1. Cho `users = [{ name: 'An', age: 20 }, { name: 'Bình', age: 25 }, ...]`. Viết các operation: tên người ≥ 21 tuổi, tuổi trung bình, group by tên đầu chữ cái.
2. Viết function `unique(arr)` (xoá duplicate), `chunk(arr, size)` (chia array thành sub-array size cố định), `zip(...arrs)` (ghép theo index). Không dùng lodash.
3. Viết iterable `fibonacci()` bằng generator, lấy 10 số đầu bằng `[...take(fib(), 10)]`. Bonus: viết `take(iter, n)` cũng là generator.
4. Refactor: thay 1 đoạn code dùng `for` loop + array push thành `map/filter/reduce`. So sánh độ dài, đọc dễ hơn không.
5. Viết function `groupBy(arr, keyFn)` trả object, key là kết quả của `keyFn(item)`, value là array các item cùng key. Test với `groupBy(users, u => u.age >= 18 ? 'adult' : 'child')`.

### Quiz (8)

1. `[1, 2, 3].map(parseInt)` trả về gì? — `[1, NaN, NaN]`. Vì `map` truyền 3 arg `(value, index, array)`, `parseInt(value, radix)` lấy 2 arg. `parseInt('1', 0) = 1`, `parseInt('2', 1) = NaN` (radix 1 invalid), `parseInt('3', 2) = NaN` (3 không phải digit base 2).
2. `Array.from({ length: 3 }, (_, i) => i)` trả gì? — `[0, 1, 2]`. `Array.from` chấp nhận array-like + mapping function.
3. `[1, 2, 3].reduce((a, b) => a + b)` và `.reduce((a, b) => a + b, 0)` khác gì? — Cùng kết quả (6). Khác khi array rỗng: không có initial value sẽ throw TypeError, có `0` thì trả `0`.
4. `for (const item of obj)` chạy được không? Vì sao? — Không, trừ khi obj có `[Symbol.iterator]`. Plain object không iterable. Dùng `for...in` cho key, hoặc `Object.entries(obj)` rồi `for...of`.
5. `Set` và `Array.includes`, cái nào nhanh hơn cho lookup nhiều lần? — Set (O(1) avg) nhanh hơn `includes` (O(n)). Nếu lookup > 1 lần trên cùng collection, convert sang Set.
6. `[...arr1, ...arr2]` và `arr1.concat(arr2)` khác gì? — Kết quả giống. Spread linh hoạt hơn (chèn giữa, mix với value khác). Concat hơi nhanh hơn cho array lớn.
7. `arr.sort()` mặc định sort theo gì? — Theo string. Convert mọi element sang string rồi so sánh char code. Đó là lý do `[10, 1, 2]` sort thành `[1, 10, 2]`.
8. WeakMap khác Map ở điểm nào quan trọng? — WeakMap key phải là object, và reference đến key là weak — không ngăn GC. Tức là khi không còn ref đến key ngoài WeakMap, key có thể bị thu hồi và entry tự xoá. Dùng cho cache, metadata không muốn leak.

### Connects to

- Chương 6 (Async) — async iterator, generator cho async sequence
- Chương 7 (Error) — handle error trong reduce/map (mỗi callback nên pure)
- Dart Chương 6 (Iterables) — đối chiếu lazy iterable của Dart với JS

### Ước lượng độ dài

~950-1050 dòng HTML — nặng bảng method + ví dụ thực dụng.

---

## Chương 6 — Async JavaScript: Callbacks, Promise, async/await

### Mục tiêu chương

Học xong chương 6, người đọc sẽ:
- Hiểu single-threaded + event loop của JS qua diagram chi tiết: Call Stack, Web/Node API, Macrotask Queue, Microtask Queue
- Phân biệt callback hell và cách Promise giải quyết
- Sử dụng `Promise` API: `new Promise`, `then`/`catch`/`finally`, `Promise.all`/`allSettled`/`race`/`any`
- Viết async function với `async`/`await`, biết khi nào dùng `await` trong loop tuần tự vs `Promise.all` song song
- Hiểu error propagation: throw trong Promise chain, try/catch trong async function
- Sử dụng AbortController để cancel fetch / async operation
- Biết khi nào async không cần thiết (CPU-bound → vẫn block thread)

### Lý do học

Async là phần JS gây nhiều bug và confusion nhất. Hiểu event loop = không bị "tại sao callback chạy sau cái này?". Đây cũng là kiến thức bắt buộc cho mọi app thực tế (network call, file I/O, animation).

### Prerequisites

Chương 1-5.

### Sections

1. **Single-threaded + non-blocking — paradox** — JS chạy 1 thread, nhưng vẫn xử lý ngàn request đồng thời. Bí mật: event loop + Web/Node API chạy background.
2. **Event loop — diagram chi tiết** — Call Stack (chạy code sync), Web API (timer, fetch, DOM event), Macrotask Queue (setTimeout, setInterval, I/O callback), Microtask Queue (Promise.then, queueMicrotask). Rule: stack rỗng → drain microtask → 1 macrotask → loop.
3. **Callback** — Pattern cổ điển: `setTimeout(cb, 1000)`. Callback hell khi nest sâu. Inversion of control problem (ai gọi callback? khi nào? bao nhiêu lần?).
4. **Promise — 3 trạng thái** — Pending, Fulfilled, Rejected. Một khi settle, không thể thay đổi. Tạo: `new Promise((resolve, reject) => ...)`. Tiêu thụ: `.then(onFulfilled, onRejected)` hoặc `.then(...).catch(...)`.
5. **Promise chaining** — `.then(fn)` luôn trả Promise mới. Return value trong `.then` trở thành value của Promise tiếp. Return Promise sẽ flatten (không bị Promise<Promise<T>>).
6. **Promise.all / allSettled / race / any** — Bảng: input array, output, behavior khi 1 reject. all: short-circuit reject. allSettled: chờ hết, trả mảng `{status, value/reason}`. race: lấy cái settle đầu (resolve hoặc reject). any: lấy resolve đầu, reject nếu tất cả reject.
7. **async/await — sugar trên Promise** — `async function foo() { const x = await bar(); }` tương đương `bar().then(x => ...)`. Function có `async` luôn trả Promise.
8. **Tuần tự vs song song** — `for (const url of urls) { const data = await fetch(url); }` chạy tuần tự (chậm). `await Promise.all(urls.map(fetch))` chạy song song (nhanh).
9. **Error handling** — try/catch quanh await, hoặc `.catch` trên Promise. Lưu ý: error trong `setTimeout` callback KHÔNG bắt được bằng try/catch ngoài. Unhandled rejection warning.
10. **AbortController — cancel async** — `const controller = new AbortController(); fetch(url, { signal: controller.signal }); controller.abort();`. Hữu ích cho cleanup khi component unmount, race.
11. **Microtask vs macrotask order** — Code mẫu: `setTimeout(() => log('macro'), 0); Promise.resolve().then(() => log('micro'));` → in `micro` trước `macro` dù timeout 0.
12. **async không có nghĩa parallel** — `async` chỉ "yield" thread khi await. CPU-bound code (vd loop tính toán) vẫn block. Muốn parallel thật sự dùng Web Worker (browser) hoặc Worker Threads (Node).

### Key concepts

- Event loop là cơ chế single-threaded + non-blocking
- Microtask priority cao hơn macrotask
- `async function` luôn trả Promise (kể cả khi return value sync)
- `await` chỉ chạy được trong `async function` (hoặc top-level trong ESM)
- Promise không cancel native được, dùng AbortController

### Code examples

1. Diagram step-by-step: trace 5 dòng code có setTimeout + Promise + sync, xem từng tick event loop
2. Convert callback API (vd `fs.readFile`) thành Promise version (manually + `util.promisify`)
3. Demo sequential vs parallel: fetch 5 URL, đo thời gian 2 cách
4. Pattern retry: function gọi lại 3 lần nếu fail, exponential backoff
5. Pattern timeout: `Promise.race([fetch(url), new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000))])`

### Visualizer / diagram

- Sơ đồ event loop chi tiết với 4 thành phần (Stack, Web API, Macrotask, Microtask)
- Animation step-by-step: trace 1 đoạn code, hiển thị stack/queue qua từng tick
- Bảng `Promise.all`/`allSettled`/`race`/`any` với input/output ví dụ
- Diagram Promise state machine (pending → fulfilled/rejected)

### Bài tập (5)

1. Viết function `delay(ms)` trả Promise resolve sau `ms`. Demo dùng với `await delay(1000)`.
2. Viết function `fetchWithTimeout(url, ms)` — fetch URL, nếu quá `ms` ms thì reject với error 'timeout'.
3. Viết function `parallelLimit(tasks, limit)` — chạy `tasks` (mảng function trả Promise) với concurrency tối đa `limit`. Test với 10 task, limit 3.
4. Convert đoạn callback nested 4 level sang Promise chain, rồi sang async/await. So sánh 3 phiên bản về độ đọc.
5. Trace order log của đoạn code có 3 setTimeout + 3 Promise.then xen kẽ. Vẽ event loop từng tick.

### Quiz (8)

1. `console.log(1); setTimeout(() => console.log(2), 0); Promise.resolve().then(() => console.log(3)); console.log(4);` in thứ tự nào? — `1, 4, 3, 2`. Sync (1, 4) trước, microtask (3) trước macrotask (2).
2. `async function foo() { return 1; }` — `foo()` trả gì? — `Promise<1>`. Mọi `async function` đều trả Promise, dù return primitive.
3. `try { setTimeout(() => { throw new Error('oops'); }, 0); } catch(e) {}` có bắt được error không? — Không. Callback của setTimeout chạy ở context khác, try/catch không scope tới được. Phải bắt trong callback.
4. `await Promise.all([])` trả gì? — `[]`. Empty array → resolve ngay với array rỗng.
5. `await Promise.race([])` trả gì? — Promise pending mãi mãi. Vì race chờ ít nhất 1 settle, không có thì không bao giờ settle.
6. `for await (const x of asyncIterable)` chạy được không? — Có. Async iteration cho Stream/AsyncGenerator. Sâu hơn ở Dart Chương 7 đối chiếu.
7. `async function` chạy song song chứ? — Không. `async` chỉ làm cho function "có thể await". Chỉ chạy song song khi không await tuần tự (vd dùng `Promise.all`).
8. `Promise.allSettled` ra đời để giải quyết vấn đề gì của `Promise.all`? — `Promise.all` reject sớm khi 1 cái fail (mất kết quả các cái khác đã xong). `allSettled` chờ hết, trả mảng `{status, value/reason}` để xử lý từng cái độc lập.

### Connects to

- Chương 7 (Error) — error trong async chain
- Chương 5 (Iterables) — async iterator (`Symbol.asyncIterator`)
- Dart Chương 7 (Async, Future, Stream) — đối chiếu Promise vs Future, microtask queue
- Flutter Chương 10 (Network) — fetch / Dio đều dùng Promise/Future model

### Ước lượng độ dài

~1100-1200 dòng HTML — chương nặng nhất JS, cần nhiều diagram + ví dụ.

---

## Chương 7 — Error Handling & Defensive Patterns

### Mục tiêu chương

Học xong chương 7, người đọc sẽ:
- Hiểu Error là Object: có `name`, `message`, `stack`
- Tự tạo Error class kế thừa Error
- Phân biệt try/catch sync vs async (await trong try)
- Hiểu error boundary trong UI framework (intro Flutter/React)
- Nắm các pattern: Result type, early return, defensive copy, fail fast
- Tránh anti-pattern: swallow error, catch-all, console.log error mà không re-throw
- Sử dụng `globalThis.addEventListener('error')`, `process.on('uncaughtException')` cho global error

### Lý do học

Error handling tệ là gốc của crash production, log spam, và bug khó debug. Hiểu cách thiết kế error flow giúp code có "blast radius" nhỏ — 1 lỗi không sập toàn bộ app.

### Prerequisites

Chương 1-6.

### Sections

1. **Error object trong JS** — Built-in: `Error`, `TypeError`, `RangeError`, `SyntaxError`, `ReferenceError`. Property `name`, `message`, `stack`. Tạo bằng `new Error('msg')` hoặc `throw 'string'` (anti-pattern: nên throw Error).
2. **try / catch / finally** — Sync: bắt error sync. `finally` chạy bất kể có throw không (hữu ích cleanup). `catch(e)` ES2019+ có thể bỏ `(e)` nếu không cần.
3. **Custom error class** — `class ValidationError extends Error { constructor(field, msg) { super(msg); this.name = 'ValidationError'; this.field = field; } }`. Pattern để phân biệt loại error trong catch.
4. **try/catch trong async** — `try { const x = await foo(); } catch(e) {}`. Khác Promise chain: `.then().catch()` chỉ catch promise hiện tại trở về trước.
5. **Anti-pattern: swallow error** — `try { ... } catch {}` (no-op). Lý do nguy hiểm: lỗi mất tăm, debug không được. Nếu thực sự muốn ignore, ít nhất log.
6. **Anti-pattern: catch all rồi log** — `catch(e) { console.log(e); }` mà không re-throw. UI vẫn render "thành công" dù backend fail. Thường phải re-throw hoặc trả error state lên trên.
7. **Pattern Result type** — Thay vì throw, trả object `{ ok: true, value }` hoặc `{ ok: false, error }`. Inspiration từ Rust. Giúp caller bắt buộc xử lý error.
8. **Pattern fail fast** — Validate input ngay đầu function, throw sớm nếu invalid. Tránh đi nửa chừng mới fail (state inconsistent).
9. **Pattern defensive copy** — Khi nhận object từ caller, clone trước khi mutate. Tránh "side effect bí ẩn" làm caller bug.
10. **Global error handler** — Browser: `window.addEventListener('error', ...)` cho sync error, `window.addEventListener('unhandledrejection', ...)` cho promise reject không catch. Node: `process.on('uncaughtException')`, `process.on('unhandledRejection')`. Last-resort logging, KHÔNG dùng để recover.
11. **Error trong UI framework** — React ErrorBoundary, Flutter ErrorWidget. Thiết kế chia "khu vực error" để 1 widget fail không sập app.
12. **Logging error đúng cách** — Không log `Error` bằng `JSON.stringify` (mất stack). Dùng `error.message + error.stack`. Sentry / log service trong production.

### Key concepts

- Error là Object, không phải string — luôn `throw new Error(...)`
- try/catch trong sync và trong async function (await trong try) khác Promise chain
- Custom error class giúp distinguish loại lỗi và xử lý có target
- Global handler là "phao cuối", không phải strategy chính
- Result type là alternative pattern khi không muốn dùng exception flow

### Code examples

1. Built-in error types và khi nào throw cái nào
2. Custom error: `ValidationError`, `NetworkError`, `AuthError` — switch theo `error.name` hoặc `instanceof`
3. Pattern Result: `function safeParse(json) { try { return { ok: true, value: JSON.parse(json) }; } catch(e) { return { ok: false, error: e }; } }`
4. Demo `unhandledrejection`: `Promise.reject('oops')` không catch → trigger global handler
5. Pattern retry với error type: retry chỉ khi NetworkError, throw ngay với ValidationError

### Visualizer / diagram

- Sơ đồ Error class hierarchy: Error → TypeError/RangeError/... và custom
- Flow chart "khi nào dùng exception vs Result type"
- Bảng anti-pattern và pattern tốt
- Diagram error propagation: throw → catch theo call stack, async function dừng ở `await`

### Bài tập (5)

1. Tạo class `ApiError extends Error` có field `statusCode`, `endpoint`. Throw nó khi `fetch` trả status không 2xx.
2. Viết function `safeFetch(url)` dùng Result type: trả `{ ok: true, data }` hoặc `{ ok: false, error }`.
3. Viết wrapper `withRetry(fn, retries, shouldRetry)` — retry `fn` tối đa `retries` lần, chỉ retry nếu `shouldRetry(error)` true. Test với network call.
4. Tìm bug: function dưới swallow error gì? Fix lại.
   ```js
   async function loadUser(id) {
     try { return await fetch(`/users/${id}`).then(r => r.json()); }
     catch (e) { console.log(e); return null; }
   }
   ```
5. Setup `window.addEventListener('error')` và `window.addEventListener('unhandledrejection')` trong HTML test page, log tất cả error sang `localStorage`. Trigger sync error + async error, kiểm tra log.

### Quiz (7)

1. `throw 'oops'` và `throw new Error('oops')` khác gì? — String throw không có stack trace, không có `.name`, `.message`. Always prefer Error instance.
2. `try { await foo(); } catch(e) {}` — bắt được error gì? — Cả error của `foo()` (Promise reject) và error sync nếu `foo` throw trước khi return promise. Cả 2 đều rơi vào catch.
3. `finally` có chạy không nếu catch re-throw? — Có. `finally` luôn chạy: sau try thành công, sau catch (kể cả catch throw), trước khi error tiếp tục propagate.
4. `catch(e)` mà không re-throw thì error còn propagate không? — Không. Caller nghĩ rằng OK. Đây là lý do swallow nguy hiểm.
5. `instanceof Error` có hoạt động cho error từ JSON parse không? — Có. `JSON.parse` throw SyntaxError, là instance của Error.
6. Khi nào throw vs return error? — Throw cho lỗi exceptional, không lường (network fail, parse fail). Return error (Result type) cho expected error flow (validation fail, user input sai) muốn caller xử lý tường minh.
7. `Promise.reject(reason)` mà không catch — chuyện gì xảy ra? — Trigger `unhandledrejection` event. Node 15+ default crash process. Production phải có global handler.

### Connects to

- Chương 6 (Async) — error trong Promise chain
- Chương 9 (TS) — typed error qua discriminated union
- Flutter Chương 6/10 — Error widget, exception handling trong Dio
- Dart Chương 5 — try/catch Future trong Dart

### Ước lượng độ dài

~750-850 dòng HTML.

---

## Chương 8 — Modules, Bundlers & Runtime

### Mục tiêu chương

Học xong chương 8, người đọc sẽ:
- Phân biệt CommonJS (`require`/`module.exports`) và ESM (`import`/`export`)
- Hiểu vì sao có 2 module system, Node hỗ trợ cả 2, browser chỉ ESM
- Viết module ESM: named export, default export, re-export, dynamic import
- Hiểu tree-shaking — vì sao ESM cho phép, CommonJS thì không
- Biết bundler là gì: Vite, esbuild, Webpack, Rollup — khác nhau cơ bản
- Hiểu `package.json` field `main`, `module`, `exports`, `type`
- Setup project tối thiểu với Vite (Browser) và Node.js (ESM)

### Lý do học

Module system là cách JS scale từ vài file lên hàng ngàn file. Confusion giữa CJS và ESM là nguồn của lỗi "cannot use import statement outside module" rất phổ biến. Hiểu bundler giúp debug build issue, optimize size.

### Prerequisites

Chương 1-7.

### Sections

1. **Lịch sử module trong JS** — Pre-ES6: không có. Workaround: IIFE, AMD, UMD, CommonJS (Node). ES6 (2015) standard hoá ESM. Browser native ESM từ 2017.
2. **CommonJS — module system của Node (cũ)** — `const x = require('./mod')`, `module.exports = ...`. Synchronous, dynamic (require trong if/loop được). File `.js` default là CJS trừ khi `package.json` có `"type": "module"`.
3. **ESM — ECMAScript Modules** — `import x from './mod.js'`, `export const x = 1`. Static (import top-level), async load (browser), tree-shakeable. File `.mjs` luôn ESM, hoặc `.js` với `"type": "module"`.
4. **Named export vs default export** — Named: `export const foo; import { foo } from`. Default: `export default class Foo; import Foo from`. Có thể mix. Trade-off: default tự do rename khi import (dễ inconsistency), named ổn định hơn.
5. **Re-export — barrel file** — `export * from './a'; export { foo } from './b'`. Pattern barrel: file `index.ts` re-export hết. Pro: import gọn. Con: tree-shaking khó hơn, có thể tăng bundle size.
6. **Dynamic import** — `const mod = await import('./mod.js')`. Async, trả Promise. Dùng cho code-split (chỉ load khi cần), conditional load (env khác nhau).
7. **Tree-shaking** — Bundler phân tích static import, xoá code không dùng. Chỉ work với ESM static (CJS dynamic không phân tích được). Side effect (top-level code) chặn tree-shake → `"sideEffects": false` trong package.json.
8. **Bundler — concept** — Input nhiều file → output ít file (bundle). Resolve module graph, transform (TS/JSX), minify, split chunk, source map.
9. **Bundler — landscape** — esbuild (cực nhanh, Go), Vite (esbuild dev + Rollup prod, recommended), Webpack (cũ, mature, plugin nhiều), Rollup (library), Parcel (zero config), tsup (TS library). Khi nào dùng cái nào.
10. **package.json — fields cho module** — `"main"` (CJS entry cũ), `"module"` (ESM entry, không chuẩn nhưng widely supported), `"exports"` (chuẩn mới, conditional export theo runtime/environment), `"type"`.
11. **Setup tối thiểu — Node ESM** — `package.json` có `"type": "module"`, file `.js` dùng `import`. Lưu ý: phải có extension `.js` trong import path.
12. **Setup tối thiểu — Browser với Vite** — `npm create vite@latest my-app`, chọn template Vanilla JS, `npm run dev`. Hot reload, ESM native.

### Key concepts

- ESM là tương lai, CJS là di sản; nhưng hệ Node mature trên CJS nên còn lâu mới hết
- Browser CHỈ hỗ trợ ESM (không native CJS) — đó là lý do cần bundler để dùng package npm
- Tree-shaking là feature của bundler, chỉ work với ESM static
- `"type": "module"` trong `package.json` flip toàn folder sang ESM
- Vite là default tốt cho dự án mới — nhanh, ít config

### Code examples

1. Demo CJS: 2 file, `math.js` export `add`, `app.js` require + dùng
2. Demo ESM: 2 file, syntax import/export, kèm `"type": "module"`
3. Demo named vs default export — viết module với cả 2
4. Demo dynamic import: load module khi click button (browser) hoặc khi env biến set (Node)
5. `package.json` đầy đủ với `exports` conditional cho ESM/CJS/types

### Visualizer / diagram

- Bảng so sánh CJS vs ESM: syntax, timing, dynamic, tree-shake, browser
- Sơ đồ bundler: input files → resolve graph → transform → bundle output
- Bảng bundler landscape với strengths
- Diagram tree-shaking: import chỉ dùng 1 function, bundler xoá phần còn lại

### Bài tập (5)

1. Tạo 3 file: `math.js` export `add`/`subtract`, `string.js` export `capitalize`, `index.js` re-export hết. File `main.js` import từ `index.js` chỉ dùng `add`. Build với esbuild xem bundle có chứa `subtract`/`capitalize` không (tree-shake).
2. Convert một module CJS (do bạn viết) sang ESM. Lưu ý các điểm: thêm `.js` extension, đổi require/module.exports, set `"type": "module"`.
3. Setup project Vite mới, viết SPA đơn giản (1 button, click thì gọi `import('./greeting.js')`, log greeting). Kiểm tra Network tab: file `greeting.js` chỉ load sau khi click.
4. Đọc `package.json` của 3 npm package (vd: `lodash-es`, `axios`, `react`). Note `"main"`, `"module"`, `"exports"`, `"type"`. Giải thích sao mỗi package config khác nhau.
5. Tự build mini bundler bằng esbuild: input `src/index.js` (có import nhiều file), output `dist/bundle.js`. Chỉ dùng esbuild API, không Webpack.

### Quiz (7)

1. Trong Node, file `.js` mặc định là CJS hay ESM? — CJS, trừ khi `package.json` gần nhất có `"type": "module"`.
2. Browser native dùng module hệ nào? — ESM. Phải gắn `<script type="module">`.
3. Tree-shaking work với CJS không? — Không. CJS dynamic (`require` có thể trong if/loop) → bundler không phân tích static được.
4. `import.meta.url` là gì? — URL của module hiện tại (ESM only). Hữu ích để build path relative cho `fs.readFileSync` tương tự `__dirname` của CJS.
5. Vite trong dev mode có bundle không? — Không (chính xác hơn: chỉ bundle deps qua esbuild). Source code dev dùng ESM native, browser load từng file qua HTTP. Đó là lý do Vite cực nhanh.
6. Khi nào dùng default export vs named export? — Named cho hầu hết case (giữ tên ổn định, dễ refactor). Default cho main export của file (vd component React). Mix cả 2 OK nhưng có thể confuse.
7. `"sideEffects": false` trong `package.json` nghĩa gì? — Bảo bundler: module này không có side effect khi import (vd không patch global, không gọi function top-level). Bundler được phép tree-shake aggressive.

### Connects to

- Chương 12 (TS Compiler) — `tsconfig.json` có module-related options
- Chương 1 — `package.json` đã touch
- Flutter — không có bundler khái niệm, nhưng AOT compile tương tự

### Ước lượng độ dài

~800-900 dòng HTML.

---

## Chương 9 — TypeScript — Type System Foundations

### Mục tiêu chương

Học xong chương 9, người đọc sẽ:
- Hiểu vì sao có TypeScript: catch bug compile-time, IDE intellisense, document code qua type
- Setup project TS tối thiểu: `tsc`, `tsconfig.json`, `ts-node` / `tsx` cho dev
- Sử dụng primitive types: `string`, `number`, `boolean`, `null`, `undefined`, `bigint`, `symbol`, `never`, `unknown`, `any`
- Sử dụng type literal, union (`|`), intersection (`&`), narrowing
- Phân biệt `type` alias vs `interface` — khi nào dùng cái nào
- Viết function với typed params/return, optional/default params
- Hiểu type assertion (`as`) và type guard (`typeof`, `instanceof`, custom predicate)

### Lý do học

TypeScript đã trở thành mặc định trong industry JS (React, Vue, Node project mới). Hiểu type system = giảm 80% bug runtime, code dễ refactor hơn, dễ collaborate trong team.

### Prerequisites

Chương 1-8 (JS core).

### Sections

1. **TypeScript là gì** — Superset của JS, compile xuống JS. Type chỉ tồn tại compile-time, biến mất khi runtime. Khẩu hiệu: "JS that scales".
2. **Setup project TS** — `npm install -D typescript`, `npx tsc --init` tạo `tsconfig.json`. Chạy: `npx tsc` compile, hoặc `npx tsx file.ts` chạy trực tiếp (recommended).
3. **`tsconfig.json` essentials** — `"target"`, `"module"`, `"strict"`, `"esModuleInterop"`, `"skipLibCheck"`, `"outDir"`. Recommend bật strict.
4. **Primitive types** — Cú pháp `let x: string = 'a'`. Inference: `let x = 'a'` cũng work, TS suy ra. Khuyến nghị: để inference, chỉ annotate khi cần.
5. **Special types: `unknown`, `any`, `never`, `void`** — `any` = bypass type system (dùng tối thiểu). `unknown` = "tôi không biết, narrow đi". `never` = không bao giờ xảy ra (function throw, infinite loop). `void` = function không return.
6. **Literal types và union** — `type Status = 'idle' | 'loading' | 'success' | 'error'`. Còn gọi là string literal union — pattern phổ biến thay enum.
7. **Type alias vs Interface** — `type User = { name: string }` vs `interface User { name: string }`. Khác nhau: interface có declaration merging (cùng tên có thể khai báo nhiều lần, tự gộp), type alias không. Khuyến nghị: dùng `interface` cho object shape (mở rộng được), `type` cho union/intersection/utility.
8. **Intersection types** — `type A = { x: number } & { y: string }`. Combine multiple types. Khác `extends` ở chỗ intersection là toán tử (compose), interface extends là quan hệ (parent-child).
9. **Optional / Readonly properties** — `interface User { name: string; age?: number; readonly id: string; }`. Optional dùng `?`. Readonly chỉ chặn reassign từ TS, runtime không enforce.
10. **Function types** — `function add(a: number, b: number): number { return a + b; }`. Function type alias: `type Add = (a: number, b: number) => number`. Optional/default param, rest param với type.
11. **Type narrowing** — Khi value có union type, narrow bằng: `typeof x === 'string'`, `x instanceof Date`, `'prop' in obj`, custom predicate `function isUser(x): x is User { ... }`.
12. **Type assertion (`as`)** — `const el = document.getElementById('x') as HTMLInputElement`. Bảo TS "tin tôi, type này đúng". Dùng khi TS không suy ra được (vd DOM API). Cẩn thận: assertion không kiểm tra runtime.

### Key concepts

- TS chỉ compile-time check; runtime không có type
- `any` thoát type system, `unknown` an toàn hơn
- Literal union là pattern thay enum
- `interface` mở rộng được, `type` mạnh hơn về biểu đạt
- Narrowing là cách "convert" union về specific type trong scope

### Code examples

1. `tsconfig.json` recommend minimal cho project Node
2. Function `formatUser` nhận `{ name: string; age?: number }`, demo optional param
3. Type narrowing: function nhận `string | number`, dùng `typeof` để xử lý 2 nhánh
4. Custom predicate: `function isString(x: unknown): x is string { return typeof x === 'string'; }`
5. `as const` để literal type: `const STATUS = 'idle' as const` cho `'idle'` thay vì `string`

### Visualizer / diagram

- Bảng `any` vs `unknown` vs `never` — assignability matrix
- Type union/intersection: diagram Venn
- Bảng `interface` vs `type` (so sánh 6 điểm)
- Flow chart narrowing: union → specific qua type guard

### Bài tập (5)

1. Setup project TS mới với `npm init -y && npm i -D typescript tsx`. Tạo file `hello.ts` in 'Hello TS', chạy bằng `npx tsx hello.ts`.
2. Convert function JS bạn đã viết sang TS với typing đầy đủ. Bắt đầu với `: any`, dần dần thay bằng type cụ thể, đếm số lỗi `any` giảm dần.
3. Định nghĩa `type Result<T, E>` là discriminated union `{ ok: true; value: T } | { ok: false; error: E }`. Viết function `safeParse(json: string): Result<unknown, Error>`.
4. Viết type guard `isApiError(e: unknown): e is { status: number; message: string }` kiểm tra runtime shape của error.
5. Refactor: convert 1 file JS dùng `import('./foo')` sang TS, sửa các `any` thành type cụ thể. Đo coverage bằng `tsc --noEmit` không lỗi.

### Quiz (7)

1. TypeScript có check type ở runtime không? — Không. TS compile xuống JS thông thường (strip type), runtime hành xử như JS.
2. `any` và `unknown` khác gì? — `any` cho phép mọi thao tác (bypass type system). `unknown` đòi hỏi narrow trước khi dùng. Prefer `unknown` cho input từ ngoài.
3. `interface` có thể `extends` `type` không? — Có (nếu `type` là object shape). Ngược lại `type` có thể intersect interface.
4. `as const` làm gì? — Convert literal value thành readonly + literal type. `['a','b'] as const` → `readonly ['a','b']` thay vì `string[]`.
5. Khi nào dùng `type` thay `interface`? — Khi cần union (`A | B`), intersection (`A & B`), tuple (`[string, number]`), utility (`Partial<T>`). Interface chỉ cho object/function shape.
6. `null` và `undefined` có là subtype của mọi type không? — Tuỳ `strictNullChecks`. Bật (recommend): KHÔNG, phải explicit `T | null` hoặc `T | undefined`. Tắt: là subtype của mọi type (giống JS).
7. Type assertion `as` có ảnh hưởng runtime không? — Không. Hoàn toàn compile-time. Đó là lý do gọi "assertion" — assert with TS, runtime không kiểm tra.

### Connects to

- Chương 10 (Generics) — generic + literal type là combo mạnh
- Chương 11 (Advanced Types) — conditional/template literal/mapped
- Dart Chương 2 — đối chiếu sound null safety của Dart với strict mode TS

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 10 — TypeScript — Generics & Utility Types

### Mục tiêu chương

Học xong chương 10, người đọc sẽ:
- Viết generic function, generic class, generic interface
- Sử dụng generic constraint (`extends`) để giới hạn type
- Hiểu default type parameter (`<T = string>`)
- Sử dụng utility types built-in: `Partial`, `Required`, `Readonly`, `Pick`, `Omit`, `Record`, `Exclude`, `Extract`, `NonNullable`, `ReturnType`, `Parameters`, `Awaited`
- Viết utility type tự tạo đơn giản (vd `DeepPartial`, `Nullable`)
- Áp dụng generic vào function tiện ích phổ biến (`map`, `filter`, type-safe `get`)

### Lý do học

Generic là cách viết code reuse mà vẫn giữ type safety. Utility type biến TS từ "annotate" sang "compute" — type cũng là code, có thể tính toán. Đây là kỹ năng phân biệt người mới TS vs người thành thạo.

### Prerequisites

Chương 9.

### Sections

1. **Generic function — basic** — `function identity<T>(x: T): T { return x; }`. Dùng: `identity<number>(5)` hoặc inference `identity(5)`. Tránh `function identity(x: any): any` mất type info.
2. **Generic với multiple parameters** — `function pair<A, B>(a: A, b: B): [A, B] { return [a, b]; }`.
3. **Generic constraint** — `function getProp<T, K extends keyof T>(obj: T, key: K): T[K]`. Đảm bảo `key` thực sự là key của `obj`.
4. **Default type parameter** — `function create<T = string>(): T[] { return []; }`. Khi gọi `create()` không spec T, T = string.
5. **Generic class** — `class Stack<T> { items: T[] = []; push(x: T) {...} pop(): T | undefined {...} }`.
6. **Generic interface và type** — `interface Box<T> { value: T }`. Tương tự với `type`.
7. **Utility types — `Partial<T>` / `Required<T>` / `Readonly<T>`** — Make all props optional / required / readonly. Use case: update function chỉ cần một số field.
8. **Utility types — `Pick<T, K>` / `Omit<T, K>`** — Chọn / loại bớt một số key. Use case: tạo subtype cho form, response.
9. **Utility types — `Record<K, V>`** — Object với key thuộc K, value thuộc V. Use case: dictionary có key cố định.
10. **Utility types — `Exclude<T, U>` / `Extract<T, U>` / `NonNullable<T>`** — Filter union. Exclude xoá U khỏi T, Extract giữ chỉ U, NonNullable xoá null/undefined.
11. **Utility types — `ReturnType<F>` / `Parameters<F>` / `Awaited<P>`** — Lấy info từ function/promise type. Use case: typed wrapper function.
12. **Viết utility type tự** — `type Nullable<T> = T | null`, `type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] }`. Intro vào chương 11.

### Key concepts

- Generic = function/class lấy type làm parameter
- Constraint dùng `extends` (đừng nhầm class inheritance)
- Utility type là helper TS built-in để compute type từ type khác
- Pattern phổ biến: định nghĩa entity type chính, dùng utility derive các variant (CreateInput, UpdateInput, Response)

### Code examples

1. Identity, pair, swap với generic
2. `getProp` với constraint `K extends keyof T` — demo TS bắt key sai
3. `Stack<T>` class với generic
4. CRUD type pattern: `interface User { id, name, age }`, `type CreateUser = Omit<User, 'id'>`, `type UpdateUser = Partial<Omit<User, 'id'>>`
5. Pattern Result: `type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E }`

### Visualizer / diagram

- Bảng utility types với input/output ví dụ (15+ utility)
- Diagram: from entity type → variant type qua chain utility
- Flow chart "khi nào dùng utility nào"
- So sánh `Partial<T>` qua generic vs `Partial` đã built-in

### Bài tập (5)

1. Viết function `map<T, U>(arr: T[], fn: (x: T) => U): U[]`. Test với array number → array string.
2. Viết function `groupBy<T, K extends string | number>(arr: T[], keyFn: (x: T) => K): Record<K, T[]>`.
3. Tạo type `EventMap = { click: MouseEvent; submit: SubmitEvent; ... }`. Viết function `on<K extends keyof EventMap>(event: K, handler: (e: EventMap[K]) => void)` — type-safe event emitter.
4. Tạo `User` interface với 10 field. Derive: `CreateUserDto`, `UpdateUserDto`, `UserResponse` (Omit password), `UserListItem` (Pick id, name).
5. Viết utility type `OptionalKeys<T>` — trả union các key của T có thể optional (vd `name?: string` → 'name'). Hint: dùng conditional type (chương 11) hoặc dùng pattern key remapping.

### Quiz (7)

1. `function f<T>(x: T): T { return x; }` — gọi `f(5)` thì `T` là gì? — `number` (inference). Có thể explicit `f<number>(5)` cùng kết quả.
2. `Partial<T>` áp dụng đệ quy không? — Không. Chỉ level 1. Muốn deep cần tự viết `DeepPartial`.
3. `Pick<T, K>` và `Omit<T, K>` đối ngẫu? — Đúng. `Omit<T, K> = Pick<T, Exclude<keyof T, K>>`. Đó là cách Omit được định nghĩa.
4. `Record<string, number>` và `{ [key: string]: number }` khác gì? — Tương đương. `Record` là sugar đọc dễ hơn.
5. `ReturnType<typeof foo>` — sao dùng `typeof`? — Vì TS cần type-level operator. `typeof foo` chuyển variable `foo` thành type. Sau đó `ReturnType` extract return type.
6. Generic class có thể default constraint không? — Có. `class Container<T extends object = {}>`. Constraint + default cùng lúc.
7. `Required<T>` ngược của Partial — nó làm tất cả prop required, kể cả prop optional ban đầu? — Đúng. Nó remove `?` của mọi prop.

### Connects to

- Chương 11 (Advanced Types) — conditional/mapped type là cốt lõi viết utility tự
- Chương 12 (Practical) — generic trong fetch wrapper, repository pattern
- Dart Chương 8 — đối chiếu generic Dart

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 11 — TypeScript — Advanced Types

### Mục tiêu chương

Học xong chương 11, người đọc sẽ:
- Viết conditional types (`T extends U ? X : Y`)
- Hiểu `infer` để extract type từ generic
- Viết mapped types (`{ [K in keyof T]: ... }`)
- Sử dụng template literal types để build string type
- Hiểu key remapping (`{ [K in keyof T as ...]: ... }`)
- Đọc và hiểu utility type advanced trong source code TS chính thức và lib lớn (Prisma, React Query)
- Tránh anti-pattern: type quá phức tạp giết IDE performance

### Lý do học

Đây là level "TS wizard" — viết được utility type của riêng mình, đọc được code của library mạnh về types. Không phải app nào cũng cần level này, nhưng khi cần (vd build framework, type-safe ORM), đây là kiến thức không thay được.

### Prerequisites

Chương 9-10.

### Sections

1. **Conditional types** — `type IsString<T> = T extends string ? true : false`. Tương tự ternary trong runtime, nhưng cho type. Distributive: nếu `T` là union, conditional sẽ phân phối.
2. **`infer` keyword** — Extract type bên trong generic. `type ReturnType<F> = F extends (...args: any[]) => infer R ? R : never`. `infer R` đặt placeholder, TS điền R bằng type tương ứng.
3. **Distributive conditional** — `type ToArray<T> = T extends any ? T[] : never`. Apply với union: `ToArray<string | number>` = `string[] | number[]`. Tắt distributive bằng wrap tuple: `[T] extends [any] ? [T][] : never`.
4. **Mapped types** — `type ReadonlyT<T> = { readonly [K in keyof T]: T[K] }`. Lặp qua key, transform value.
5. **Modifier mapping** — `+readonly`, `-readonly`, `+?`, `-?`. Vd `type Mutable<T> = { -readonly [K in keyof T]: T[K] }`. Remove readonly.
6. **Key remapping với `as`** — `type Getters<T> = { [K in keyof T as \`get\${Capitalize<K & string>}\`]: () => T[K] }`. Generate getter name từ key.
7. **Template literal types** — `type Route = \`/users/\${string}\``. Build string type từ literal + variable. Combine với mapped để generate type động.
8. **Built-in helpers cho template** — `Uppercase<T>`, `Lowercase<T>`, `Capitalize<T>`, `Uncapitalize<T>`.
9. **Recursive types** — `type DeepReadonly<T> = { readonly [K in keyof T]: T[K] extends object ? DeepReadonly<T[K]> : T[K] }`. TS hỗ trợ recursion với depth limit để tránh infinite.
10. **`keyof` và index access type** — `keyof T` trả union các key. `T[K]` trả type của value. Combine: `T[keyof T]` = union các value type.
11. **Anti-pattern: over-engineered types** — Type quá phức tạp làm tsc chậm (>100ms/check), IDE lag. Một số dấu hiệu: lồng conditional > 5 level, infer chain dài, distributive bị bug. Khi nào dừng: nếu type khó đọc hơn JSDoc tương đương, dừng.
12. **Đọc utility type của lib** — Phân tích `Awaited`, `ConditionalKeys`, hoặc 1 type từ Prisma. Mục tiêu: build kỹ năng đọc.

### Key concepts

- Conditional + infer = pattern matching cho type
- Mapped + key remapping = transform object type
- Template literal = build string type tổ hợp
- Recursive type bị giới hạn depth (mặc định ~50 level)
- Cân nhắc trade-off: type chính xác vs build/IDE performance

### Code examples

1. `Awaited<T>` — extract type bên trong Promise (kể cả nested Promise)
2. `DeepReadonly<T>` — readonly đệ quy
3. `Mutable<T>` — strip readonly
4. `RouteParams<T>` — `\`/users/:id\`` → `{ id: string }` bằng template literal + infer
5. `PromisifyMethods<T>` — convert mọi method của class sang async version

### Visualizer / diagram

- Diagram conditional type với distributive
- Flow chart "khi nào type nào": conditional vs mapped vs template
- Bảng utility advanced (10+ pattern phổ biến)
- Example tracing: viết type custom, từng bước TS evaluate

### Bài tập (5)

1. Viết `Awaited<T>` — handle `Promise<Promise<number>>` → `number`.
2. Viết `DeepPartial<T>` — Partial đệ quy. Test với object nested 3 level.
3. Viết `PathParams<T extends string>` — `'/users/:id/posts/:postId'` → `{ id: string; postId: string }`.
4. Viết `Functions<T>` — pick chỉ các property là function của T. Hint: mapped + conditional, key remapping với `never` để loại.
5. Tìm 1 utility type từ Prisma Client TS định nghĩa, copy code, tự hiểu nó làm gì, viết comment giải thích từng dòng.

### Quiz (7)

1. `T extends U ? X : Y` — khi T là union, behavior gì? — Distributive: apply conditional cho từng member. `(A | B) extends C ? X : Y` = `(A extends C ? X : Y) | (B extends C ? X : Y)`.
2. Cách tắt distributive? — Wrap với tuple: `[T] extends [U] ? X : Y`. Tuple ngăn distribution.
3. `infer` chỉ dùng được trong conditional? — Đúng. `infer X` chỉ valid trong `extends` clause của conditional.
4. Mapped type có giữ optional/readonly modifier của T không? — Mặc định: có (homomorphic). Có thể explicit add/remove bằng `+?` `-?` `+readonly` `-readonly`.
5. `keyof T` khi `T` là `{ a: 1, b: 2 }`? — `'a' | 'b'`. Union literal type của các key.
6. Template literal type `\`/api/\${string}\`` match string nào? — Mọi string bắt đầu bằng `/api/`. Đó là cách build string type với pattern.
7. Recursion type có giới hạn không? — Có. TS hard limit ~50 level (có thể thay đổi qua version). Sâu hơn → "Type instantiation is excessively deep" error.

### Connects to

- Chương 12 (Practical) — apply advanced types vào project thực
- Chương 10 — utility types built-in là ví dụ của advanced

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Chương 12 — TypeScript — Compiler, Tooling & Practical Setup

### Mục tiêu chương

Học xong chương 12, người đọc sẽ:
- Hiểu `tsconfig.json` đầy đủ các option phổ biến (~30 option)
- Biết các strict mode flag và khuyến nghị tối ưu
- Setup project TS cho 3 use case: Node CLI/server, browser SPA (qua Vite), library publish lên npm
- Sử dụng declaration files (`.d.ts`) — khi nào tự viết, khi nào dùng `@types/*`
- Hiểu module resolution (`node`, `bundler`, `nodenext`)
- Debug TS code với source map
- Apply 1 số pattern thực dụng: typed env, typed fetch, repository pattern

### Lý do học

Đây là chương "đóng" của track TS — giúp người học chuyển từ "biết viết TS" sang "biết setup project TS production". Cũng tổng kết kiến thức 4 chương TS qua case study cụ thể.

### Prerequisites

Chương 9-11.

### Sections

1. **`tsconfig.json` — anatomy** — File JSON cấu hình compiler. 3 section: `compilerOptions`, `include`, `exclude`, `references`. Compile bằng `tsc` (đọc tsconfig tự động).
2. **Target và module** — `"target"`: ES version output (ES2015 → ES2022 → ESNext). `"module"`: module hệ thống output (CommonJS, ESNext, NodeNext). Match với runtime target.
3. **Strict mode** — `"strict": true` bật 8+ flag con: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, ... Khuyến nghị: luôn bật strict ngay từ đầu.
4. **Module resolution** — `"moduleResolution"`: `node` (cổ điển), `bundler` (Vite-like, no `.js` extension), `nodenext` (Node ESM). Phải match với module + runtime.
5. **Output options** — `"outDir"`, `"rootDir"`, `"declaration"` (sinh `.d.ts`), `"sourceMap"` (debug), `"removeComments"`, `"importHelpers"` (tslib).
6. **Path mapping** — `"baseUrl": "."`, `"paths": { "@/*": ["src/*"] }`. Cho import `@/components/Button` thay vì `../../../components/Button`. Lưu ý: cần runtime cũng support (vd tsconfig-paths cho Node, alias trong Vite).
7. **`.d.ts` declaration files** — Mô tả type cho code JS không có type (vd 3rd-party lib chưa hỗ trợ). Cài qua `@types/*` từ DefinitelyTyped, hoặc tự viết.
8. **Ambient declaration** — `declare module 'foo'`, `declare global { interface Window { myProp: string } }`. Mở rộng type global hoặc declare module ngoài.
9. **Project references** — Monorepo: nhiều package, mỗi cái có tsconfig riêng. `"references"` field link nhau, build incremental.
10. **Setup case 1: Node CLI** — `tsx` (recommended) hoặc `ts-node` + `nodemon`. `tsconfig.json` đơn giản, không cần bundle.
11. **Setup case 2: Browser SPA** — Vite + `--template vanilla-ts`. Vite tự handle TS, build sản phẩm là JS thuần.
12. **Setup case 3: Library publish** — `tsup` (zero config), output cả CJS + ESM + `.d.ts`. Field `"exports"` trong `package.json`.
13. **Patterns thực dụng**:
    - Typed env: `import { z } from 'zod'; const envSchema = z.object({...}); export const env = envSchema.parse(process.env);`
    - Typed fetch wrapper: `async function api<T>(url: string): Promise<T>`
    - Repository pattern: interface trừu tượng, implement Sqlite/Postgres/Mock
14. **Debug TS** — `"sourceMap": true`, VS Code debug config, breakpoint trong .ts code. Hoặc dùng `tsx` chạy trực tiếp.

### Key concepts

- `tsconfig.json` là entry point của mọi TS project — học đọc nó kỹ
- Strict mode là baseline production, không thoả hiệp
- Module resolution phải match runtime (Node vs Bundler khác nhau)
- `.d.ts` là cầu nối với code JS không có type
- Path mapping cần config cả TS lẫn runtime

### Code examples

1. `tsconfig.json` recommend cho Node ESM
2. `tsconfig.json` recommend cho Browser + Vite
3. `tsconfig.json` recommend cho library
4. Demo `.d.ts` cho lib JS không có type
5. Pattern typed fetch wrapper với generic + zod validation

### Visualizer / diagram

- Bảng các option `tsconfig.json` quan trọng (30 option) với recommend value
- Flow chart "setup TS cho use case nào"
- Diagram module resolution: import path → bundler/Node resolve → file
- Bảng so sánh `tsc` / `tsx` / `ts-node` / Vite TS handling

### Bài tập (5)

1. Tạo project TS Node CLI mới. Tools: `tsx`, `vitest`. Viết script `count-files.ts` đếm số file trong folder qua command-line arg. Compile bằng `tsc` ra `dist/`, chạy được `node dist/count-files.js`.
2. Setup Vite + React (hoặc Vue/Svelte) + TS. Sửa `tsconfig.json` bật strict + path mapping `@/*`. Viết 1 component đơn giản import qua alias.
3. Cài 1 npm package không có `.d.ts` (vd `string-strip-html` cũ). Viết file `string-strip-html.d.ts` declare module với type rất đơn giản (vd `function strip(html: string): string`). Demo import hoạt động.
4. Viết typed fetch wrapper `api<T>(url: string, init?: RequestInit): Promise<T>`. Test với endpoint trả JSON, type T là interface. Bonus: throw `ApiError` với type cụ thể nếu status không 2xx.
5. Setup mini-monorepo với 2 package (utils + app), dùng project references. Build cả 2 với `tsc -b`. Khi sửa utils, app rebuild incremental.

### Quiz (7)

1. `"strict": true` bật những flag con nào? — Tối thiểu: `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `alwaysStrict`, `noImplicitThis`, `useUnknownInCatchVariables`. Tổng 8+ tuỳ version.
2. `tsx` và `ts-node` khác gì? — Cả 2 chạy TS trực tiếp không cần compile. `tsx` dùng esbuild (rất nhanh), `ts-node` dùng tsc (chậm hơn, kiểm type chặt hơn). Khuyến nghị `tsx` cho dev.
3. `"moduleResolution": "bundler"` khi nào dùng? — Khi project dùng bundler (Vite, esbuild, webpack) handle import. Cho phép bỏ extension `.js` trong import path.
4. `.d.ts` có chứa code logic không? — Không. Chỉ chứa type declaration (interface, type, declare). Không có implementation.
5. `tsconfig.json` field `"include"` mặc định là gì? — Mọi file `.ts`/`.tsx`/`.d.ts` trong rootDir. Nếu không có `rootDir`, là folder chứa tsconfig.
6. Sao `@types/node` cần cài thường xuyên? — Vì `node` (built-in Node API) không có TS source, phải bổ sung qua DefinitelyTyped. Hầu hết project Node TS đều cài.
7. Project references để làm gì? — Cho phép monorepo (nhiều sub-project) compile incremental + tách type check theo package. Khi 1 package thay đổi, chỉ rebuild nó + dependents.

### Connects to

- Toàn bộ chương 9-11 (TS đã học) — apply vào setup thực
- Chương 8 (Modules) — module resolution là cầu nối
- Flutter — không tương ứng trực tiếp, nhưng `pubspec.yaml` ≈ `package.json` + `tsconfig.json` gộp lại

### Ước lượng độ dài

~900-1000 dòng HTML.

---

## Tổng kết và quyết định locked

### Decisions locked (cho Phase 2 viết HTML)

1. **JS+TS gộp 1 sub-folder "JavaScript"** — không tách. 12 chương = 8 JS core + 4 TS. Người học theo tuần tự, không nhảy.
2. **Modern JavaScript first (ES2020+)** — không dạy `var` là default, chỉ nhắc khi giải thích hoisting/scope.
3. **Tách 3 lớp ngôn ngữ/runtime/ecosystem** — mỗi chương phải nói rõ feature ở lớp nào.
4. **Bundler default = Vite** — không phải Webpack. Mọi ví dụ browser dùng Vite.
5. **Node version target: Node 20 LTS+** — assume ESM hỗ trợ, top-level await OK.
6. **TS version target: 5.4+** — `satisfies` operator, `const` type parameter, decorators stage 3 đều có.
7. **Tooling default: `tsx`** thay vì `ts-node`. Lý do: nhanh + ít config.
8. **Reference Dart khi có ích** — user vừa học Dart. Mỗi feature có comparison callout: `Future` ≈ `Promise`, sound null safety ≈ strict mode, Dart isolate ≈ Worker.

### Ước lượng tổng độ dài

- 12 chương × ~900 dòng trung bình = **~10,800 dòng HTML**
- Cộng index.html + theme.css = **~11,000-11,500 dòng**

### Theme đề xuất (chờ user confirm khi build CSS)

| Yếu tố | Đề xuất |
|---|---|
| Background | Warm beige `#f4ede1` (sáng hơn Flutter sepia) |
| Accent chính | JS amber `#f0c427` (low-saturated, không loud) — match logo JS |
| Accent phụ | TS blue `#3178c6` cho TypeScript section |
| Display font | **Fraunces** (chữ serif modern, optical size variable) |
| Body font | Inter (giữ chuẩn IT Basic) |
| Code font | JetBrains Mono |
| Code block bg | Dark warm `#2a2520` (không đen tuyền) |
| Callout | sepia notes như Dart nhưng tone vàng hơn |

Theme nên cảm giác "ấm + modern" để phản ánh JS = ngôn ngữ web năng động, không quá lạnh như Dart.

### Interactive component đề xuất

- **JavaScript playground inline** — textarea + button "Run" (eval qua iframe sandbox hoặc Web Worker), output console. Khác Dart vì JS chạy được native trong browser.
- **TypeScript type playground inline** — textarea code TS, button "Check", output errors (qua `monaco-editor` hoặc inline tsc) + type at cursor.
- **Event loop visualizer** — animation step-by-step cho chương 6 (call stack / queue / web API).

### Connects to existing pillars

- **Dart Chương 7 (Async)** — đối chiếu Promise vs Future, microtask queue
- **Flutter Chương 10 (Network)** — fetch / Dio pattern
- **OOP (trụ cột 6)** — class pattern khái quát, JS class là instance cụ thể
- **CLI (trụ cột 1)** — Node CLI script
- **DevOps (trụ cột 8)** — npm registry, package publish, CI/CD với Node

### Workflow cho Phase 2

1. User approve outline này (file `JAVASCRIPT-OUTLINE.md`)
2. User approve theme (cream/amber + Fraunces) hoặc đề xuất khác
3. Tôi tạo `JavaScript/css/theme.css`, `JavaScript/js/playground.js`, `JavaScript/index.html`
4. Viết 12 chương HTML theo trình tự, mỗi chương follow outline tương ứng
5. Update `Programming Language/index.html` thêm card JavaScript
6. Update `PLAN.md` checklist tiến độ
7. Update memory `project_dart_flutter_curriculum.md` (đổi tên thành `project_programming_language_curriculum.md`?)

---

**End of JAVASCRIPT-OUTLINE.md**
