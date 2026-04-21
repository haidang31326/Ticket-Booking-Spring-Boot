#  Hệ thống Quản lý và Đặt vé Sự kiện (Ticket Booking System)

Đồ án xây dựng hệ thống quản lý địa điểm, sự kiện và hỗ trợ khách hàng đặt vé trực tuyến.
**Công nghệ sử dụng:** Java Spring Boot, Hibernate/JPA, MySQL, Docker & Docker Compose.

---

##  1. Link truy cập hệ thống (Live Demo)
Hiện tại dự án đang được deploy trên VPS để Giảng viên có thể test trực tiếp mà không cần cài đặt.
- **Backend API Base URL:** `http://157.245.204.215:3103/api/v1`
- *(Lưu ý: Nếu link server bị gián đoạn, Thầy vui lòng xem hướng dẫn chạy Local ở mục 4).*

---

##  2. Thông tin tài khoản Test (Dữ liệu đã được khởi tạo sẵn)
Hệ thống sử dụng Spring Security. Mật khẩu dưới Database đã được băm (Hash) bằng BCrypt, dưới đây là mật khẩu gốc để đăng nhập:

| Vai trò (Role) | Email đăng nhập | Mật khẩu | Chức năng chính |
| :--- | :--- | :--- | :--- |
| **ADMIN** | `admin@gmail.com` | `admin123` | Quản lý Venue, tạo Event, thống kê vé. |
| **USER** | `user1@gmail.com` | `123456` | Xem danh sách sự kiện, tiến hành đặt vé. |

---

##  3. Luồng chức năng chính để Test (Test Flow)
Để trải nghiệm đầy đủ nghiệp vụ của hệ thống, Thầy có thể test theo luồng sau:

**Luồng 1: Quản trị viên thiết lập sự kiện**
1. Đăng nhập bằng tài khoản **ADMIN**.
2. Gọi API thêm mới Địa điểm (`Venue`) -> Cung cấp thông tin: Tên, Địa chỉ, Sức chứa.
3. Gọi API tạo Sự kiện (`Event`) -> Gắn với ID của Venue vừa tạo, thiết lập giá vé (`ticket_price`) và số lượng chỗ.

**Luồng 2: Khách hàng đặt vé**
1. Đăng nhập bằng tài khoản **USER** (hoặc tạo tài khoản mới).
2. Lấy danh sách các Sự kiện đang mở bán.
3. Gọi API Đặt vé (`Booking`) -> Truyền vào `event_id`. Hệ thống sẽ tự động trừ đi số chỗ còn trống (`left_capacity`) của sự kiện đó.

---
##  4. Hướng dẫn chạy Local (Backup Option)

Trong trường hợp Server VPS gặp sự cố, Giảng viên có thể tải source code về và chạy trên máy cá nhân theo 1 trong 2 cách sau:

### Cách 1: Chạy bằng IntelliJ IDEA (Khuyên dùng để Debug code)
Nếu Thầy/Cô muốn chạy Backend trực tiếp từ IDE để xem log và debug:

**Bước 1: Khởi động Database (MySQL)**
Mở terminal tại thư mục gốc dự án và chạy riêng container Database:
`docker-compose up -d mysql-db`
*(DB sẽ chạy ở cổng `localhost:8282` với tài khoản `root` / `password`)*

**Bước 2: Đổi cấu hình kết nối**
Mở file `src/main/resources/application.properties` (hoặc `application-dev.properties` tùy môi trường) và điều chỉnh lại đường dẫn Database thành `localhost`:
- **Đổi thành:** `spring.datasource.url=jdbc:mysql://localhost:8282/ticketing`
  *(Lý do: Khi chạy Backend ở ngoài Docker, ứng dụng phải gọi vào cổng 8282 của máy chủ Local thay vì gọi tên container `mysql-db`).*

**Bước 3: Chạy ứng dụng**
Nhấn **Run** file `TicketingApplication.java`. Hệ thống sẽ khởi chạy tại: `http://localhost:3103`


