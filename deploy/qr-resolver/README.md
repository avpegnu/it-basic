# API tra link đích cho QR

Phần đọc/tạo QR vẫn chạy local. Nút **Xem link đích** gửi URL tới
`POST /api/expand-url` cùng origin. API dùng Node.js 22+ và các module có sẵn,
không cần npm, database hoặc dịch vụ rút gọn link bên ngoài.

## Website hiện tại trên Vercel

Đã kiểm tra ngày 14/11/2026: `it.avpegnu.io.vn` được Vercel phục vụ. Endpoint
[`api/expand-url.js`](../../api/expand-url.js) dùng chung handler và resolver
trong thư mục này. Vercel tự triển khai function khi nhận commit mới; cấu hình
[`vercel.json`](../../vercel.json) đóng gói các module `.cjs`, cho phép hủy request
và đặt thời gian thực thi tối đa 20 giây. Không cần cài service/Nginx trên VPS
để dùng API trên Vercel. Giữ nguyên workflow deploy VPS độc lập.

Handler nhận được cả body JSON do Vercel parse sẵn lẫn stream HTTP ở service
VPS. Origin mặc định là `https://it.avpegnu.io.vn`; nếu đổi domain, đặt
`ALLOWED_ORIGIN` theo origin mới. Preview domain không tự được cho phép tra URL.
Giới hạn theo IP và số tác vụ dùng bộ nhớ của từng instance, không phải hạn mức
toàn deployment khi Vercel scale ra nhiều instance.

## Hành vi

- Theo tối đa 8 lần chuyển hướng HTTP 301/302/303/307/308; trả URL cuối và
  trạng thái HTTP của từng bước. Giữ query và fragment của link.
- Gửi GET và dừng sau khi nhận header; không chạy JavaScript/meta refresh,
  không giữ cookie hay gửi thông tin đăng nhập. GET có thể được ghi nhận là
  lượt truy cập, có thể tiêu thụ link dùng một lần; chỉ bấm khi muốn tra URL đó.
- URL phụ thuộc đăng nhập, vị trí, thiết bị, CAPTCHA hoặc mở ứng dụng có thể
  trả kết quả khác hoặc không tra được. Kết quả không xác nhận link an toàn.
- Chỉ nhận HTTP/HTTPS trên cổng mặc định. Kiểm tra toàn bộ DNS answers tại
  từng bước, từ chối IP nội bộ/dành riêng và ghim IP vào kết nối để tránh DNS
  rebinding; giữ hostname gốc cho Host/TLS và kiểm tra chứng chỉ bình thường.
- Timeout toàn bộ 12 giây, giới hạn 20 yêu cầu/phút/IP và 8 tra cứu đồng thời.
  Giới hạn URL 4.096 ký tự, JSON 8 KB, header đích 16 KB.
- Chỉ nghe `127.0.0.1:3040`, kiểm tra Origin; Nginx ghi đè X-Real-IP.
  Không ghi URL vào log của API. Access log tắt cho route, không đưa URL vào
  query string. Không có CORS công khai hay API proxy trả nội dung trang.

## Cài trên VPS (khi dùng hosting VPS)

Thực hiện một lần sau khi chủ sở hữu đồng ý bật API. Các file `deploy/`
đang được workflow loại khỏi rsync, nên chúng phải được cài riêng. **Không
thay `.github/workflows/deploy.yml` hoặc ghi đè cấu hình Nginx đang chạy.**

1. Kiểm tra `node --version` là 22 trở lên và `command -v node` trỏ tới
   `/usr/bin/node`; nếu dùng vị trí khác, sửa `ExecStart` trong file service.
   Kiểm tra cổng 3040 chưa dùng với `ss -ltn '( sport = :3040 )'`.
2. Chuyển thư mục `deploy/qr-resolver/` từ checkout đã review lên một thư mục
   tạm trên VPS. Tại thư mục đó, cài source và service:

   ```sh
   sudo install -d -m 755 /opt/it-basic-qr-resolver
   sudo install -m 644 resolve.cjs server.cjs /opt/it-basic-qr-resolver/
   sudo install -m 644 it-basic-qr-resolver.service /etc/systemd/system/
   sudo systemctl daemon-reload
   sudo systemctl enable --now it-basic-qr-resolver
   sudo systemctl status it-basic-qr-resolver --no-pager
   ```

3. Sao lưu `/etc/nginx/sites-available/it-basic`. Thêm nội dung
   [nginx-location.conf](nginx-location.conf) **vào server block HTTPS hiện có**
   của `it.avpegnu.io.vn`. Không chép đè cả file hoặc các chứng chỉ do Certbot
   quản lý. Sau đó:

   ```sh
   sudo nginx -t
   # Chỉ reload nếu nginx -t thành công.
   sudo systemctl reload nginx
   ```

4. Mở trang QR qua HTTPS, quét một URL công khai rồi bấm **Xem link đích**.
   Ảnh QR không được gửi lên API; chỉ gửi URL vừa đọc. Kiểm tra các URL nội bộ
   như `http://127.0.0.1/` phải bị từ chối.

Khi cập nhật API: cài lại hai file `.cjs` đã kiểm thử vào `/opt/it-basic-qr-resolver/`,
rồi `sudo systemctl restart it-basic-qr-resolver`. Push website tĩnh không tự
cập nhật service này. Xem lỗi vận hành bằng `journalctl -u it-basic-qr-resolver`.

Gỡ API: xóa location mới khỏi Nginx, kiểm tra config rồi reload; sau đó
`sudo systemctl disable --now it-basic-qr-resolver`. QR vẫn đọc/tạo bình thường;
nút tra link sẽ báo API chưa được bật.

## Kiểm thử local

```sh
node --test personal-tools/tests/qr-resolver.test.cjs
NODE_PATH=/tmp/personal-tools-qa/node_modules node personal-tools/tests/browser.cjs
```

Browser test dùng endpoint giả lập cho các chuyển hướng để không gửi URL ra
Internet. Unit test kiểm tra redirect, DNS/IP, timeout, loop và API; transport
được kiểm tra với HTTP server local riêng. Để thử live có chủ đích, chạy
`ALLOWED_ORIGIN=http://localhost:8000 node deploy/qr-resolver/server.cjs` và
dùng reverse proxy local cho cả trang tĩnh lẫn `/api/expand-url` trên cùng
origin. `python3 -m http.server` đơn lẻ không có API và giao diện sẽ báo rõ.
