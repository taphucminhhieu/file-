# VRP-GO-final — Tổng hợp thay đổi

Bản gộp hoàn chỉnh của hai nhánh `VRP-GO` và `motogo`, kèm trang đăng nhập/đăng ký mới.
Thư mục chạy: `C:/Users/Think T470/OneDrive/Ảnh/VRP-GO-final`

## 1. Nền tảng & cấu trúc

- Lấy **motogo** (bản mới hơn, đã sửa lỗi) làm nền: `index.html`, `css/style.css`, `js/effects.js`, `assets/favicon.svg`, `docs/`, toàn bộ `pages/`, `store/`, `operator/`.
- Bổ sung module **khach-hang/** từ VRP-GO: 5 HTML, 5 CSS, 4 JS (`index`, `account`, `calendar`, `payment`, `receipt`).
- Không sửa hai thư mục gốc `VRP-GO/` và `motogo/`.

## 2. Lỗi của VRP-GO đã được khắc phục

| Lỗi cũ | Cách xử lý trong bản gộp |
|---|---|
| Loader chặn mọi link nội bộ, ép chờ 1,1s | `effects.js` chỉ chặn logo + menu header, chờ 1s |
| Hero slideshow 2s quá nhanh | 4s (bản motogo) |
| Hiệu ứng click X + vòng cũ | Hiệu ứng chấm tròn gọn |
| `cursor: none` ở trang booking | `cursor: pointer` |
| Favicon `type=""`, dùng PNG nặng | `assets/favicon.svg`, `type="image/svg+xml"` |
| Logo khác nhau giữa các trang | Logo-mark SVG + logo-text đồng bộ (kể cả khach-hang) |
| Thiếu mục nav "Đơn của tôi", "Cửa hàng", "Vận hành" | Nav 6 mục đồng bộ toàn site |
| Mất `.step-icon`, `.header .header-actions` | Khôi phục ở cuối `css/style.css` |
| how-it-works bị 3 cột | Thêm `.page-steps` → 1 cột (tối đa 820px) |

## 3. Nối luồng thuê xe sang khach-hang

- `index.html` (8 card) và `pages/vehicles.html` (6 card):
  - `Chi tiết` → `vehicle-detail.html`
  - `Đặt cọc` → `../khach-hang/payment.html` (riêng trang chủ: `khach-hang/payment.html`)
  - `Thuê xe` → `../khach-hang/calendar.html`
- Khi bấm Đặt cọc/Thuê xe, ghi `sessionStorage`:
  `selectedVehicleName`, `selectedVehicleType`, `selectedVehicleRating`, `selectedVehicleSpecs`, `selectedVehiclePrice`, `selectedVehicleImage`.
- `booking.html` vẫn giữ làm luồng dự phòng.

## 4. Nav & giao diện khach-hang

- 24 file HTML dùng chung nav 6 mục, đúng `active` theo trang.
- khach-hang: thêm favicon SVG, thay logo-mark, thêm một override cục bộ giữ nút card xếp dọc (`.vehicle-actions`).
- Sửa responsive header phát hiện khi kiểm thử:
  - ≤1024px: header tự giãn chiều cao khi nav xuống dòng.
  - ≤760px: trả lại thanh nav cuộn ngang (trước đây payment/account ẩn nav nhưng thiếu nút hamburger).
  - ≤640px: nav cuộn ngang, nhãn không bị ngắt dòng, ẩn scrollbar.

## 5. Trang đăng nhập / đăng ký mới

- Thay `pages/login.html` và `pages/register.html` bằng giao diện hai panel chuyển động:
  - Đăng nhập / Đăng ký chuyển đổi bằng `switchMode()`.
  - Hiện/ẩn mật khẩu, modal "Quên mật khẩu", SweetAlert2.
  - `register.html` tự mở sẵn chế độ Đăng ký.
- Thêm:
  - `css/login-register.css`
  - `js/login-register.js` (Firebase Auth 10.8.0 + backend `http://127.0.0.1:8000`)
- Đồng bộ giao diện với site:
  - Dùng chung header (logo, nav, nút "Về trang chủ" để thoát) và footer của VRP-GO.
  - Đổi bảng màu teal cũ sang xanh header: panel `#0d4a38 → #065f46 → #0b7a58`, nút submit cùng gradient, focus input, link, modal dùng `#079b70`/`#0d4a38`.
  - Font Be Vietnam Pro, favicon SVG.
- Khi đăng nhập thành công: lưu cookie `access_token` + `localStorage.vrp_user`, hiện SweetAlert rồi quay về `index.html`.

## 6. Ẩn "Đơn của tôi" khi chưa đăng nhập

- `js/effects.js`: nếu không có cookie `access_token` thì xoá mục "Đơn của tôi" khỏi mọi menu (trang chủ, auth, khach-hang, store, operator...).
- Đăng nhập xong (cookie được set) → tải lại/điều hướng trang, mục tự xuất hiện.
- Không còn dựa vào `localStorage.vrp_user` cũ để tránh trạng thái đăng nhập giả.

## 7. Kiểm thử đã chạy

- Trang chủ: 8 card, hero 4 ảnh, slideshow, dots.
- `vehicles.html`: 6 card; Đặt cọc → payment đúng tên/loại/giá/ảnh; Thuê xe → calendar đúng tên xe.
- Payment → giả lập thanh toán → biên nhận; account, my-orders, store, operator render đúng.
- Login/register: đổi chế độ, ẩn/hiện mật khẩu, modal quên mật khẩu hoạt động; header/footer hiển thị, nút "Về trang chủ" hoạt động; nav "Đơn của tôi" ẩn khi chưa có cookie đăng nhập và hiện lại khi có `access_token`.
- 0 link nội bộ chết, không có lỗi console, không có request 404.

## 8. Cách chạy

```bash
cd "C:/Users/Think T470/OneDrive/Ảnh/VRP-GO-final"
python -m http.server 8080
```

Mở `http://127.0.0.1:8080`.

Lưu ý:
- Nên chạy qua HTTP server để `sessionStorage` và cookie hoạt động ổn định.
- Đăng nhập cần backend `http://127.0.0.1:8000` đang chạy và tài khoản Firebase đã xác thực email.
- Ảnh minh hoạ lấy từ Unsplash nên cần mạng.


## 19/11/2026 – Sửa logo footer
- Khắc phục xung đột CSS khiến logo ở chân trang bị xuống dòng/giãn thành khối.
- Cố định bố cục logo ngang, kích thước biểu tượng và màu chữ cho giao diện chính và khu vực khách hàng.
