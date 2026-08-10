# Deploy IT Basic lên VPS — it.avpegnu.io.vn

Site là **HTML tĩnh** (193 file, ~13 MB): không cần Node, PHP hay cơ sở dữ liệu —
chỉ cần Nginx phục vụ file. Khác với 3 service hiện có trên VPS (đều là reverse proxy
sang Node), site này **không chiếm cổng nào cả**.

## Hiện trạng VPS (đã kiểm tra ngày 10/08/2026)

| Hạng mục | Giá trị |
|---|---|
| Host | `180.93.42.176` — user `vanh` (thuộc nhóm `sudo`) |
| Hệ điều hành | Ubuntu 24.04.4 LTS |
| Nginx | 1.24.0 |
| Certbot | 2.9.0 + plugin `python3-certbot-nginx` |
| rsync | có sẵn tại `/usr/bin/rsync` |
| Đĩa | 50 GB, còn trống 19 GB |
| RAM | 3.8 GB, khả dụng 2.8 GB |

**Các site đang chạy** (`/etc/nginx/sites-available/sslm`):

| Subdomain | Đích | Ghi chú |
|---|---|---|
| `api.avpegnu.io.vn` | `localhost:3000` | có cấu hình SSE, timeout 24h |
| `avpegnu.io.vn` | `localhost:3001` | Student Portal |
| `manage.avpegnu.io.vn` | `localhost:3002` | Management Portal |
| `_` (default_server) | `/var/www/html` | file `default`, bắt request không khớp |

Dịch vụ nền khác: Redis (`127.0.0.1:6379`), Ollama (`127.0.0.1:11434`) — chỉ nghe nội bộ.

**Cả 3 subdomain dùng CHUNG một chứng chỉ** `/etc/letsencrypt/live/avpegnu.io.vn/`.

> ✅ **Không cần cài thêm phần mềm nào.** Toàn bộ công cụ đã có sẵn.

---

## Ba điểm an toàn đã xác minh trước

1. **`/var/www/it-basic` chưa tồn tại** — `/var/www/` hiện chỉ có `html`.
   Quan trọng vì script deploy dùng `rsync --delete` (xoá file thừa trên server).
   Thư mục đích tách biệt hoàn toàn với `/var/www/html` của site `default`.
2. **Config đặt ở file riêng** `it-basic`, không sửa file `sslm` đang chạy 3 service.
3. **Chứng chỉ SSL cấp riêng** bằng `--cert-name it-basic`, không đụng vào
   chứng chỉ dùng chung của 3 subdomain kia.

---

## Bước 1 — Thêm bản ghi DNS (iNET)

Trang quản lý DNS `avpegnu.io.vn` → **Thêm bản ghi**:

| Ô | Giá trị |
|---|---|
| Tên bản ghi | `it` |
| Loại bản ghi | `A · A (IPv4 Address)` |
| Giá trị bản ghi | `180.93.42.176` |
| TTL | `5 phút` |

Kiểm tra **trên máy Mac** (đợi 1–10 phút):

```bash
dig +short it.avpegnu.io.vn
```

Phải ra `180.93.42.176`. **Chưa ra thì đừng làm Bước 5** — Let's Encrypt cần
truy cập được subdomain qua cổng 80 mới cấp chứng chỉ.

---

## Bước 2 — Tạo thư mục trên VPS

```bash
ssh vanh@180.93.42.176
```

```bash
sudo mkdir -p /var/www/it-basic
sudo chown -R vanh:vanh /var/www/it-basic
sudo chmod -R 755 /var/www/it-basic
```

`chown` sang `vanh` để GitHub Actions ghi được mà không cần sudo.

---

## Bước 3 — Tạo SSH key riêng cho deploy

Dùng khoá **riêng cho việc deploy**, tách khỏi khoá cá nhân — lộ khoá này thì
thu hồi một dòng là xong, không ảnh hưởng gì khác.

**Trên máy Mac:**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/it-basic-deploy -N "" -C "github-actions-it-basic"
ssh-copy-id -i ~/.ssh/it-basic-deploy.pub vanh@180.93.42.176
ssh -i ~/.ssh/it-basic-deploy vanh@180.93.42.176 "echo OK"   # phải in ra OK
```

In khoá riêng để copy sang GitHub:

```bash
cat ~/.ssh/it-basic-deploy
```

> Copy **toàn bộ**, kể cả 2 dòng `-----BEGIN...` / `-----END...`.
> Không commit vào repo, không gửi qua chat.

---

## Bước 4 — Khai báo Secrets trên GitHub

`https://github.com/avpegnu/it-basic` → **Settings** → **Secrets and variables**
→ **Actions** → **New repository secret**:

| Tên secret | Giá trị |
|---|---|
| `SSH_HOST` | `180.93.42.176` |
| `SSH_USER` | `vanh` |
| `SSH_PRIVATE_KEY` | toàn bộ nội dung `cat ~/.ssh/it-basic-deploy` |
| `SITE_DOMAIN` | `it.avpegnu.io.vn` |

Cổng SSH là 22 (mặc định) nên không cần secret `SSH_PORT`.

---

## Bước 5 — Cấu hình Nginx

**Trên VPS:**

```bash
sudo nano /etc/nginx/sites-available/it-basic
```

Dán nội dung [`deploy/nginx-it-basic.conf`](./nginx-it-basic.conf) (đã điền sẵn
`it.avpegnu.io.vn`, không cần sửa gì).

```bash
sudo ln -s /etc/nginx/sites-available/it-basic /etc/nginx/sites-enabled/
sudo nginx -t                    # PHẢI thấy "syntax is ok" + "test is successful"
sudo systemctl reload nginx
```

> `nginx -t` báo lỗi thì **dừng lại, sửa xong mới reload** — reload config lỗi
> sẽ làm gián đoạn cả 3 service đang chạy.
> Dùng `reload` chứ không `restart`: nạp lại cấu hình mà không ngắt kết nối hiện có.

---

## Bước 6 — Cấp chứng chỉ HTTPS

```bash
sudo certbot --nginx -d it.avpegnu.io.vn --cert-name it-basic
```

- Chọn **2 – Redirect** để ép HTTP sang HTTPS.

> `--cert-name it-basic` tạo chứng chỉ **mới, độc lập**.
> Chứng chỉ dùng chung của `avpegnu.io.vn` / `api` / `manage` **không bị đụng tới**.
> Nếu certbot hỏi có muốn *expand* chứng chỉ cũ không → **chọn KHÔNG**.

Kiểm tra tự động gia hạn:

```bash
sudo certbot renew --dry-run
```

---

## Bước 7 — Deploy

**Trên máy Mac:**

```bash
cd "/Users/vietanh142004/Developer/IT Basic"
git add .github deploy
git commit -m "Thêm cấu hình deploy lên VPS qua GitHub Actions"
git push origin main
```

Mở tab **Actions** trên GitHub xem tiến trình → xong thì vào:

```
https://it.avpegnu.io.vn
```

Từ giờ **mỗi lần `git push` lên `main` là site tự cập nhật**, không cần SSH nữa.
Muốn chạy tay: **Actions** → **Deploy to VPS** → **Run workflow**.

---

## Xử lý sự cố

| Hiện tượng | Nguyên nhân | Cách xử lý |
|---|---|---|
| Vào subdomain ra **trang Nginx mặc định** | DNS chưa lan truyền, hoặc chưa reload nginx | `dig +short it.avpegnu.io.vn`; `sudo nginx -t && sudo systemctl reload nginx` |
| **403 Forbidden** | Nginx không đọc được thư mục | `sudo chmod -R 755 /var/www/it-basic` |
| **404** ở trang chủ | Chưa deploy | `ls /var/www/it-basic/` — phải thấy `index.html` |
| Actions đỏ ở **Setup SSH key** | `SSH_PRIVATE_KEY` thiếu dòng BEGIN/END | Dán lại toàn bộ output của `cat` |
| Actions đỏ ở **rsync** | Sai quyền thư mục đích | `sudo chown -R vanh:vanh /var/www/it-basic` |
| certbot **challenge failed** | Subdomain chưa trỏ đúng IP | Làm lại Bước 1, đợi DNS |
| Sửa bài xong vẫn hiện bản cũ | Cache trình duyệt | `Cmd + Shift + R` (HTML đã đặt `no-cache` nên hiếm khi bị) |

Xem log riêng của site này:

```bash
sudo tail -f /var/log/nginx/it-basic.error.log
```

---

## Việc nên làm sau khi xong

Mật khẩu SSH của `vanh` đã bị dán qua chat nên coi như **đã lộ**. Sau khi
key deploy hoạt động, nên:

```bash
passwd                                    # đổi mật khẩu mới
```

Và cân nhắc tắt hẳn đăng nhập bằng mật khẩu (chỉ cho phép SSH key):

```bash
sudo nano /etc/ssh/sshd_config            # PasswordAuthentication no
sudo systemctl reload ssh
```

> ⚠️ Chỉ tắt **sau khi** đã chắc chắn đăng nhập bằng key thành công,
> và nên giữ một phiên SSH đang mở để cứu nếu cấu hình sai.
