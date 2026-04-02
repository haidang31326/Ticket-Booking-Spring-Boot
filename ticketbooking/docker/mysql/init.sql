-- init.sql
CREATE DATABASE IF NOT EXISTS ticket_db;
USE ticket_db;

-- 1. Tạo dữ liệu cho bảng Venues (Địa điểm) trước
INSERT INTO venues (name, address, total_capacity) VALUES
                                                       ('Nhà hát Lớn Hà Nội', '01 Tràng Tiền, Hoàn Kiếm', 600),
                                                       ('Sân vận động Mỹ Đình', 'Đường Lê Đức Thọ, Nam Từ Liêm', 40000);

-- 2. Tạo dữ liệu cho bảng Events (Sự kiện)
INSERT INTO events (event_name, capacity, left_capacity, price, venue_id) VALUES
                                                                              ('Hòa nhạc Mùa Xuân 2026', 600, 600, 500000, 1),
                                                                              ('Trận cầu Siêu cúp', 40000, 40000, 200000, 2);

-- 3. Tạo tài khoản Admin mặc định
INSERT INTO customers (name, email, password, address) VALUES
    ('Admin HUYNH', 'admin@gmail.com', 'admin123', 'Hệ thống');