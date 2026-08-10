# 📐 KẾ HOẠCH — Fullstack Realtime Contact Center

> **Lộ trình ôn tập phỏng vấn** cho vị trí **Junior/Middle Fullstack Developer**
> Tech stack: **Node.js · TypeScript · NestJS · React · Realtime (WebSocket/Redis/Queue)**
> Domain: **SaaS Contact Center** (Call Center · Live Chat Omnichannel · CRM · Workflow Automation)
>
> ⚠️ Tài liệu mang tính **tổng quát**, mô tả nghiệp vụ & công nghệ của *domain* này nói chung —
> không gắn với bất kỳ công ty cụ thể nào.

---

## 1. Mục tiêu

Nắm chắc **100% tech stack + tư duy thiết kế nghiệp vụ** cần cho một vị trí Fullstack
xây dựng nền tảng **SaaS Contact Center realtime**, đủ tự tin trả lời phỏng vấn từ nền
tảng ngôn ngữ đến kiến trúc hệ thống.

### Bản đồ năng lực cần đạt
| Nhóm | Nội dung |
|------|----------|
| Ngôn ngữ & Runtime | JavaScript chuyên sâu, bất đồng bộ, Event Loop, TypeScript |
| Backend | Node.js core, Express, REST API, Auth/JWT/RBAC, NestJS |
| Dữ liệu | SQL (MySQL/PostgreSQL), NoSQL (MongoDB), ORM/ODM, data modeling |
| Realtime & Scaling | WebSocket/Socket.IO, Redis, Message Queue (BullMQ), scaling realtime |
| Frontend | React, Hooks, data fetching, TailwindCSS, realtime UI |
| Nghiệp vụ & Thiết kế | ACD, IVR, Omnichannel, CRM, RBAC, Workflow Automation, Multi-tenancy |
| Tổng hợp | System Design realtime, Deploy/Monitoring, Mock phỏng vấn |

---

## 2. Phong cách trực quan

Theme **"Command Center / Phòng điều hành Contact Center"** (style riêng, không trùng tài liệu khác):
- Giao diện **dashboard tối** (dark control-room), accent **xanh lá + cyan neon**
- Motif: headset, sóng âm cuộc gọi, đèn trạng thái live (online/busy/away), card thống kê động
- Sidebar điều hướng kiểu bảng điều khiển; progress bar theo module; "đèn realtime" nhấp nháy
- Mỗi Part có màu nhận diện riêng

---

## 3. Cấu trúc kỹ thuật

```
Fullstack-ContactCenter/
├── PLAN.md                  ← tài liệu này
├── index.html               ← Hub: bản đồ lộ trình + tiến độ + tổng quan
├── assets/
│   └── style.css            ← theme chung (Command Center) + helper JS
├── A/  A1, A2, A3           ← mỗi Phần một thư mục con riêng
├── B/  B1, B2, B3, B4
├── C/  C1 … C4
├── D/  D1 … D4
├── E/  E1 … E6
├── F/  F1 … F5
├── G/  G1 … G6
├── H/  H1 … H6
└── I/  I1, I2, I3
```

- Mỗi **Phần** nằm trong một thư mục con (A/, B/, …, I/) cho dễ duyệt.
- Mỗi chương = 1 file HTML **self-contained** (HTML + CSS theme + JS inline), mở chạy ngay.
- Đường dẫn tương đối: chương trỏ về `../assets/style.css` và `../index.html`; liên kết cùng Phần dùng tên file trần, khác Phần dùng `../<Phần>/<file>`.
- Lưu tiến độ học bằng `localStorage`.

---

## 4. Cấu trúc MỖI chương (đồng nhất, sâu ~600–900 dòng)

1. 🎯 **Mục tiêu & liên hệ thực tế** — học cái này dùng để làm gì trong hệ thống Contact Center
2. 📖 **Lý thuyết chi tiết** — giải thích cặn kẽ kèm sơ đồ/minh hoạ
3. 💻 **Ví dụ code thực chiến** — gắn với bối cảnh Call Center / Live Chat / CRM
4. ⚠️ **Lỗi thường gặp & best practices**
5. 🧪 **Bài tập** — có gợi ý lời giải
6. ✅ **Quiz tương tác** — chấm điểm ngay
7. 🎤 **Ngân hàng câu hỏi phỏng vấn** — nhiều câu hỏi thật + đáp án mẫu + "bẫy" hay gặp, gắn đúng nội dung chương

---

## 5. Lộ trình nội dung (nền tảng → công nghệ → nghiệp vụ)

### PHẦN A — Nền tảng Ngôn ngữ & Runtime
- **A1.** JavaScript chuyên sâu cho Backend (closure, prototype, `this`, scope, module)
- **A2.** Bất đồng bộ & Event Loop (Promise, async/await, micro/macrotask)
- **A3.** TypeScript cho Backend (generics, decorators, utility types, cấu hình)

### PHẦN B — Node.js Core
- **B1.** Kiến trúc Node.js (V8, libuv, event loop trong Node, process)
- **B2.** Module system, npm, môi trường, cấu hình
- **B3.** Streams, Buffer, EventEmitter, File System
- **B4.** HTTP thuần & xây REST API cơ bản

### PHẦN C — Express & REST API
- **C1.** Express: routing, middleware, error handling
- **C2.** Thiết kế RESTful API chuẩn (nguyên tắc, status code, versioning)
- **C3.** Validation, DTO, xử lý lỗi tập trung
- **C4.** Authentication & Phân quyền: JWT, refresh token, bcrypt, RBAC

### PHẦN D — Database
- **D1.** SQL (MySQL/PostgreSQL): schema, query, index, transaction
- **D2.** MongoDB & Mongoose: document model, aggregation
- **D3.** ORM/ODM: TypeORM/Prisma & Mongoose thực chiến
- **D4.** SQL vs NoSQL & data modeling cho Contact Center

### PHẦN E — NestJS
- **E1.** Kiến trúc NestJS & Dependency Injection
- **E2.** Modules, Controllers, Providers/Services sâu
- **E3.** Guards, Interceptors, Pipes, Filters, Middleware
- **E4.** NestJS + Database + Config + Validation
- **E5.** NestJS Authentication/Authorization (Passport, JWT, RBAC)
- **E6.** NestJS WebSocket Gateway & Microservices

### PHẦN F — Realtime & Scaling ⭐
- **F1.** WebSocket nền tảng + Socket.IO
- **F2.** Realtime patterns: rooms, namespaces, broadcast
- **F3.** Redis: data structures, caching, pub/sub, session
- **F4.** Message Queue & BullMQ (job, worker, retry, scheduling)
- **F5.** Kiến trúc realtime & scaling WebSocket (Redis adapter, horizontal scaling)

### PHẦN G — Frontend: React
- **G1.** React core (JSX, component, props, state)
- **G2.** Hooks (useState/useEffect/useContext/useReducer/custom)
- **G3.** React nâng cao (performance, memo, context, patterns)
- **G4.** Data fetching (React Query/SWR, Axios) & state management
- **G5.** TailwindCSS + UI components
- **G6.** Realtime UI: dựng Dashboard/CRM/Call UI nối WebSocket

### PHẦN H — Nghiệp vụ & Tư duy thiết kế ⭐ (đào sâu tư duy thiết kế)
- **H1.** Tổng quan kiến trúc SaaS Contact Center
- **H2.** Call Center: ACD, phân phối cuộc gọi, IVR, call state machine
- **H3.** Live Chat Omnichannel: routing đa kênh, presence
- **H4.** CRM & Dashboard realtime: data model, analytics
- **H5.** Phân quyền (RBAC/ABAC) + Workflow & Automation engine
- **H6.** SaaS Multi-tenancy & system design tổng hợp

### PHẦN I — System Design & DevOps tổng hợp
- **I1.** System Design cho hệ thống realtime
- **I2.** Deploy/Docker/CI-CD/Monitoring áp dụng
- **I3.** Capstone: Mock phỏng vấn — thiết kế Contact Center end-to-end + bộ câu hỏi tổng hợp

---

## 6. Quy mô & cách triển khai

- **Tổng: ~41 chương** (~25.000–35.000 dòng HTML)
- Xây **tăng dần theo từng Part**; mỗi Part hoàn thành sẽ cập nhật tiến độ ở Hub.
- Thứ tự build: Hub + Part A → B → C → D → E → F → G → H → I.

---

## 7. Trạng thái

| Part | Chương | Trạng thái |
|------|--------|-----------|
| Hub  | index  | ✅ |
| A    | A1–A3  | ✅ |
| B    | B1–B4  | ✅ |
| C    | C1–C4  | ✅ |
| D    | D1–D4  | ✅ |
| E    | E1–E6  | ✅ |
| F    | F1–F5  | ✅ |
| G    | G1–G6  | ✅ |
| H    | H1–H6  | ✅ |
| I    | I1–I3  | ✅ |

> Ký hiệu: ⏳ chưa làm · 🔨 đang làm · ✅ xong
