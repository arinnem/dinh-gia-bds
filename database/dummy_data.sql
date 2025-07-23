-- Expanded Dummy data for Real Estate Database
-- Meeting Phase 1 requirements: 10 major cities, 50+ districts, 200+ wards, 50+ properties
-- Insert at least 20 records for each table

-- Insert property types
INSERT INTO property_types (name) VALUES
('Căn hộ chung cư'),
('Nhà riêng'),
('Biệt thự'),
('Shophouse'),
('Đất nền'),
('Nhà dự án'),
('Nhà tập thể'),
('Officetel'),
('Penthouse'),
('Studio'),
('Duplex'),
('Townhouse'),
('Villa'),
('Condotel'),
('Nhà phố thương mại'),
('Căn hộ dịch vụ'),
('Nhà mặt tiền'),
('Nhà hẻm'),
('Căn hộ cao cấp'),
('Nhà liền kề'),
('Đất thổ cư'),
('Đất nông nghiệp'),
('Đất công nghiệp');

-- Insert legal statuses
INSERT INTO legal_statuses (name) VALUES
('Sổ đỏ/Sổ hồng'),
('Hợp đồng mua bán'),
('Hợp đồng cọc với CĐT'),
('Giấy phép xây dựng'),
('Đang chờ sổ'),
('Vi bằng'),
('Giấy tờ tay'),
('Đất nông nghiệp'),
('Đất thổ cư (chưa sổ)'),
('Sổ đỏ chính chủ'),
('Giấy chứng nhận quyền sử dụng đất'),
('Hợp đồng góp vốn'),
('Giấy phép kinh doanh'),
('Sổ hồng riêng'),
('Giấy tờ đầy đủ'),
('Đang làm sổ'),
('Sổ chung'),
('Giấy ủy quyền'),
('Hợp đồng thuê đất'),
('Giấy phép đầu tư'),
('Sổ đỏ tách thửa'),
('Giấy chứng nhận đầu tư'),
('Hợp đồng chuyển nhượng');

-- Insert directions
INSERT INTO directions (name) VALUES
('Đông'),
('Tây'),
('Nam'),
('Bắc'),
('Đông-Bắc'),
('Tây-Bắc'),
('Đông-Nam'),
('Tây-Nam'),
('Đông-Đông-Bắc'),
('Tây-Tây-Bắc'),
('Nam-Đông-Nam'),
('Bắc-Tây-Bắc'),
('Đông-Đông-Nam'),
('Tây-Tây-Nam'),
('Nam-Tây-Nam'),
('Bắc-Đông-Bắc'),
('Hướng Đông chính'),
('Hướng Tây chính'),
('Hướng Nam chính'),
('Hướng Bắc chính'),
('Đông-Nam-Nam'),
('Tây-Bắc-Bắc'),
('Đông-Bắc-Bắc');

-- Insert districts for 10 major Vietnamese cities (50+ districts total)
INSERT INTO districts (name, province) VALUES
-- Ho Chi Minh City (23 districts)
('Quận 1', 'TP. Hồ Chí Minh'),
('Quận 2', 'TP. Hồ Chí Minh'),
('Quận 3', 'TP. Hồ Chí Minh'),
('Quận 4', 'TP. Hồ Chí Minh'),
('Quận 5', 'TP. Hồ Chí Minh'),
('Quận 6', 'TP. Hồ Chí Minh'),
('Quận 7', 'TP. Hồ Chí Minh'),
('Quận 8', 'TP. Hồ Chí Minh'),
('Quận 9', 'TP. Hồ Chí Minh'),
('Quận 10', 'TP. Hồ Chí Minh'),
('Quận 11', 'TP. Hồ Chí Minh'),
('Quận 12', 'TP. Hồ Chí Minh'),
('Quận Bình Thạnh', 'TP. Hồ Chí Minh'),
('Quận Gò Vấp', 'TP. Hồ Chí Minh'),
('Quận Phú Nhuận', 'TP. Hồ Chí Minh'),
('Quận Tân Bình', 'TP. Hồ Chí Minh'),
('Quận Tân Phú', 'TP. Hồ Chí Minh'),
('Huyện Bình Chánh', 'TP. Hồ Chí Minh'),
('Huyện Cần Giờ', 'TP. Hồ Chí Minh'),
('Huyện Củ Chi', 'TP. Hồ Chí Minh'),
('Huyện Hóc Môn', 'TP. Hồ Chí Minh'),
('Huyện Nhà Bè', 'TP. Hồ Chí Minh'),
('TP. Thủ Đức', 'TP. Hồ Chí Minh'),
-- Hanoi (12 districts)
('Quận Ba Đình', 'Hà Nội'),
('Quận Hoàn Kiếm', 'Hà Nội'),
('Quận Tây Hồ', 'Hà Nội'),
('Quận Long Biên', 'Hà Nội'),
('Quận Cầu Giấy', 'Hà Nội'),
('Quận Đống Đa', 'Hà Nội'),
('Quận Hai Bà Trưng', 'Hà Nội'),
('Quận Hoàng Mai', 'Hà Nội'),
('Quận Thanh Xuân', 'Hà Nội'),
('Quận Nam Từ Liêm', 'Hà Nội'),
('Quận Bắc Từ Liêm', 'Hà Nội'),
('Huyện Gia Lâm', 'Hà Nội'),
-- Da Nang (8 districts)
('Quận Hải Châu', 'Đà Nẵng'),
('Quận Thanh Khê', 'Đà Nẵng'),
('Quận Sơn Trà', 'Đà Nẵng'),
('Quận Ngũ Hành Sơn', 'Đà Nẵng'),
('Quận Liên Chiểu', 'Đà Nẵng'),
('Quận Cẩm Lệ', 'Đà Nẵng'),
('Huyện Hòa Vang', 'Đà Nẵng'),
('Huyện Hoàng Sa', 'Đà Nẵng'),
-- Can Tho (9 districts)
('Quận Ninh Kiều', 'Cần Thơ'),
('Quận Ô Môn', 'Cần Thơ'),
('Quận Bình Thuỷ', 'Cần Thơ'),
('Quận Cái Răng', 'Cần Thơ'),
('Quận Thốt Nốt', 'Cần Thơ'),
('Huyện Vĩnh Thạnh', 'Cần Thơ'),
('Huyện Cờ Đỏ', 'Cần Thơ'),
('Huyện Phong Điền', 'Cần Thơ'),
('Huyện Thới Lai', 'Cần Thơ'),
-- Hai Phong (7 districts)
('Quận Hồng Bàng', 'Hải Phòng'),
('Quận Ngô Quyền', 'Hải Phòng'),
('Quận Lê Chân', 'Hải Phòng'),
('Quận Hải An', 'Hải Phòng'),
('Quận Kiến An', 'Hải Phòng'),
('Quận Đồ Sơn', 'Hải Phòng'),
('Quận Dương Kinh', 'Hải Phòng'),
-- Bien Hoa (3 districts)
('Quận Long Biên', 'Biên Hòa'),
('Quận Tân Biên', 'Biên Hòa'),
('Quận Trảng Bom', 'Biên Hòa'),
-- Vung Tau (2 districts)
('Quận 1', 'Vũng Tàu'),
('Quận 2', 'Vũng Tàu'),
-- Nha Trang (2 districts)
('Quận Vĩnh Hải', 'Nha Trang'),
('Quận Tân An', 'Nha Trang'),
-- Hue (2 districts)
('Quận Phú Nhuận', 'Huế'),
('Quận Phú Hội', 'Huế'),
-- Buon Ma Thuot (2 districts)
('Quận Tân Lập', 'Buôn Ma Thuột'),
('Quận Ea Tam', 'Buôn Ma Thuột');

-- Insert wards (200+ wards across all districts)
INSERT INTO wards (name, district_id) VALUES
-- Ho Chi Minh City wards (120 wards)
-- District 1 wards (10 wards)
('Phường Bến Nghé', 1),
('Phường Bến Thành', 1),
('Phường Cầu Kho', 1),
('Phường Cầu Ông Lãnh', 1),
('Phường Cô Giang', 1),
('Phường Đa Kao', 1),
('Phường Nguyễn Cư Trinh', 1),
('Phường Nguyễn Thái Bình', 1),
('Phường Phạm Ngũ Lão', 1),
('Phường Tân Định', 1),
-- District 2 wards (9 wards)
('Phường An Phú', 2),
('Phường Bình An', 2),
('Phường Bình Khánh', 2),
('Phường Bình Trưng Đông', 2),
('Phường Bình Trưng Tây', 2),
('Phường Cát Lái', 2),
('Phường Thạnh Mỹ Lợi', 2),
('Phường Thảo Điền', 2),
('Phường Thủ Thiêm', 2),
-- District 3 wards (14 wards)
('Phường 1', 3),
('Phường 2', 3),
('Phường 3', 3),
('Phường 4', 3),
('Phường 5', 3),
('Phường 6', 3),
('Phường 7', 3),
('Phường 8', 3),
('Phường 9', 3),
('Phường 10', 3),
('Phường 11', 3),
('Phường 12', 3),
('Phường 13', 3),
('Phường 14', 3),
-- District 4 wards (18 wards)
('Phường 1', 4),
('Phường 2', 4),
('Phường 3', 4),
('Phường 4', 4),
('Phường 5', 4),
('Phường 6', 4),
('Phường 8', 4),
('Phường 9', 4),
('Phường 10', 4),
('Phường 12', 4),
('Phường 13', 4),
('Phường 14', 4),
('Phường 15', 4),
('Phường 16', 4),
('Phường 17', 4),
('Phường 18', 4),
('Phường Bến Vân Đồn', 4),
('Phường Tân Thuận Đông', 4),
-- District 5 wards (15 wards)
('Phường 1', 5),
('Phường 2', 5),
('Phường 3', 5),
('Phường 4', 5),
('Phường 5', 5),
('Phường 6', 5),
('Phường 7', 5),
('Phường 8', 5),
('Phường 9', 5),
('Phường 10', 5),
('Phường 11', 5),
('Phường 12', 5),
('Phường 13', 5),
('Phường 14', 5),
('Phường 15', 5),
-- District 6 wards (14 wards)
('Phường 1', 6),
('Phường 2', 6),
('Phường 3', 6),
('Phường 4', 6),
('Phường 5', 6),
('Phường 6', 6),
('Phường 7', 6),
('Phường 8', 6),
('Phường 9', 6),
('Phường 10', 6),
('Phường 11', 6),
('Phường 12', 6),
('Phường 13', 6),
('Phường 14', 6),
-- District 7 wards (10 wards)
('Phường Tân Thuận Đông', 7),
('Phường Tân Thuận Tây', 7),
('Phường Tân Kiểng', 7),
('Phường Tân Hưng', 7),
('Phường Bình Thuận', 7),
('Phường Tân Quy', 7),
('Phường Phú Thuận', 7),
('Phường Tân Phong', 7),
('Phường Tân Phú', 7),
('Phường Phú Mỹ', 7),
-- District 8 wards (16 wards)
('Phường 1', 8),
('Phường 2', 8),
('Phường 3', 8),
('Phường 4', 8),
('Phường 5', 8),
('Phường 6', 8),
('Phường 7', 8),
('Phường 8', 8),
('Phường 9', 8),
('Phường 10', 8),
('Phường 11', 8),
('Phường 12', 8),
('Phường 13', 8),
('Phường 14', 8),
('Phường 15', 8),
('Phường 16', 8),
-- District 9 wards (13 wards)
('Phường Long Bình', 9),
('Phường Long Thạnh Mỹ', 9),
('Phường Tân Phú', 9),
('Phường Hiệp Phú', 9),
('Phường Tăng Nhơn Phú A', 9),
('Phường Tăng Nhơn Phú B', 9),
('Phường Phước Long A', 9),
('Phường Phước Long B', 9),
('Phường Trường Thạnh', 9),
('Phường Long Phước', 9),
('Phường Long Trường', 9),
('Phường Phước Bình', 9),
('Phường Phú Hữu', 9),
-- District 10 wards (15 wards)
('Phường 1', 10),
('Phường 2', 10),
('Phường 3', 10),
('Phường 4', 10),
('Phường 5', 10),
('Phường 6', 10),
('Phường 7', 10),
('Phường 8', 10),
('Phường 9', 10),
('Phường 10', 10),
('Phường 11', 10),
('Phường 12', 10),
('Phường 13', 10),
('Phường 14', 10),
('Phường 15', 10),
-- Hanoi wards (40 wards)
-- Ba Dinh District (14 wards)
('Phường Phúc Xá', 24),
('Phường Trúc Bạch', 24),
('Phường Vĩnh Phúc', 24),
('Phường Cống Vị', 24),
('Phường Liễu Giai', 24),
('Phường Nguyễn Trung Trực', 24),
('Phường Quán Thánh', 24),
('Phường Ngọc Hà', 24),
('Phường Điện Biên', 24),
('Phường Đội Cấn', 24),
('Phường Ngọc Khánh', 24),
('Phường Kim Mã', 24),
('Phường Giảng Võ', 24),
('Phường Thành Công', 24),
-- Hoan Kiem District (18 wards)
('Phường Phúc Tấn', 25),
('Phường Đồng Xuân', 25),
('Phường Hàng Mã', 25),
('Phường Hàng Buồm', 25),
('Phường Hàng Đào', 25),
('Phường Hàng Bồ', 25),
('Phường Cửa Đông', 25),
('Phường Lý Thái Tổ', 25),
('Phường Hàng Bạc', 25),
('Phường Hàng Gai', 25),
('Phường Chương Dương Độ', 25),
('Phường Hàng Trống', 25),
('Cửa Nam', 25),
('Hàng Bông', 25),
('Tràng Tiền', 25),
('Trần Hưng Đạo', 25),
('Phan Chu Trinh', 25),
('Hàng Bài', 25),
-- Tay Ho District (8 wards)
('Phường Phú Thượng', 26),
('Phường Nhật Tân', 26),
('Phường Tứ Liên', 26),
('Phường Quảng An', 26),
('Phường Xuân La', 26),
('Phường Yên Phụ', 26),
('Phường Bưởi', 26),
('Phường Thụy Khuê', 26),
-- Da Nang wards (24 wards)
-- Hai Chau District (13 wards)
('Phường Thạch Thang', 32),
('Phường Hải Châu I', 32),
('Phường Hải Châu II', 32),
('Phường Phước Ninh', 32),
('Phường Hòa Thuận Tây', 32),
('Phường Hòa Thuận Đông', 32),
('Phường Nam Dương', 32),
('Phường Bình Hiên', 32),
('Phường Bình Thuận', 32),
('Phường Hòa Cường Bắc', 32),
('Phường Hòa Cường Nam', 32),
('Phường Thanh Bình', 32),
('Phường Thuận Phước', 32),
-- Thanh Khe District (11 wards)
('Phường Tam Thuận', 33),
('Phường Thanh Khê Tây', 33),
('Phường Thanh Khê Đông', 33),
('Phường Xuân Hà', 33),
('Phường Tân Chính', 33),
('Phường Chính Gián', 33),
('Phường Vĩnh Trung', 33),
('Phường Thạc Gián', 33),
('Phường An Khê', 33),
('Phường Hòa Khê', 33),
('Phường Tân Lập', 33),
-- Can Tho wards (16 wards)
-- Ninh Kieu District (13 wards)
('Phường Cái Khế', 40),
('Phường An Hòa', 40),
('Phường Thới Bình', 40),
('Phường An Nghiệp', 40),
('Phường An Cư', 40),
('Phường Tân An', 40),
('Phường An Phú', 40),
('Phường Xuân Khánh', 40),
('Phường Hưng Lợi', 40),
('Phường An Khánh', 40),
('Phường An Bình', 40),
('Phường Hưng Thạnh', 40),
('Phường Thới Hòa', 40),
-- O Mon District (3 wards)
('Phường Châu Văn Liêm', 41),
('Phường Thới Hòa', 41),
('Phường Thới Long', 41);

-- Insert users
INSERT INTO users (email, hashed_password, full_name, role) VALUES
('admin@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Nguyễn Văn Admin', 'Professional'),
('user1@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Trần Thị Lan', 'Standard'),
('user2@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Lê Văn Minh', 'Professional'),
('user3@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Phạm Thị Hoa', 'Standard'),
('user4@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Hoàng Văn Đức', 'Professional'),
('user5@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Ngô Thị Mai', 'Standard'),
('user6@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Vũ Văn Hùng', 'Professional'),
('user7@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Đặng Thị Linh', 'Standard'),
('user8@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Bùi Văn Thành', 'Professional'),
('user9@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Lý Thị Nga', 'Standard'),
('user10@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Đinh Văn Tùng', 'Professional'),
('user11@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Cao Thị Yến', 'Standard'),
('user12@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Dương Văn Khoa', 'Professional'),
('user13@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Tô Thị Bích', 'Standard'),
('user14@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Hồ Văn Long', 'Professional'),
('user15@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Võ Thị Thảo', 'Standard'),
('user16@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Trịnh Văn Nam', 'Professional'),
('user17@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Phan Thị Xuân', 'Standard'),
('user18@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Lương Văn Phúc', 'Professional'),
('user19@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Huỳnh Thị Thu', 'Standard'),
('user20@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Mạc Văn Tuấn', 'Professional');

-- Insert projects
INSERT INTO projects (name, investor, description, address, scale, status) VALUES
('Vinhomes Central Park', 'Vingroup', 'Khu đô thị cao cấp tại trung tâm TP.HCM', 'Phường 22, Quận Bình Thạnh', '10 tòa tháp cao 40-50 tầng', 'Đã bàn giao'),
('Masteri Thảo Điền', 'Thảo Điền Investment', 'Căn hộ cao cấp view sông Sài Gòn', 'Phường Thảo Điền, Quận 2', '5 tòa tháp 40 tầng', 'Đang mở bán'),
('Landmark 81', 'Vinhomes', 'Tòa nhà cao nhất Việt Nam', 'Phường 22, Quận Bình Thạnh', '1 tòa tháp 81 tầng', 'Đã bàn giao'),
('The Sun Avenue', 'Novaland', 'Căn hộ hiện đại gần trung tâm', 'Phường An Phú, Quận 2', '3 tòa tháp 35 tầng', 'Đang triển khai'),
('Saigon Royal', 'Novaland', 'Căn hộ sang trọng bên sông', 'Phường Bến Nghé, Quận 1', '2 tòa tháp 35 tầng', 'Đã bàn giao'),
('Eco Green Saigon', 'Xuân Mai Corp', 'Khu căn hộ xanh thân thiện môi trường', 'Phường Tân Phú, Quận 7', '6 tòa tháp 25 tầng', 'Đang mở bán'),
('Diamond Island', 'Phú Mỹ Hưng', 'Đảo kim cương giữa lòng Sài Gòn', 'Phường 22, Quận Bình Thạnh', '4 tòa tháp 35 tầng', 'Đang triển khai'),
('Gateway Thảo Điền', 'Capitaland', 'Căn hộ cao cấp phong cách Singapore', 'Phường Thảo Điền, Quận 2', '2 tòa tháp 28 tầng', 'Đã bàn giao'),
('Estella Heights', 'Keppel Land', 'Căn hộ cao cấp An Phú', 'Phường An Phú, Quận 2', '3 tòa tháp 40 tầng', 'Đang mở bán'),
('Sunrise City', 'Novaland', 'Khu đô thị hiện đại', 'Phường Tân Hưng, Quận 7', '8 tòa tháp 30 tầng', 'Đã bàn giao'),
('Midtown Sakura Park', 'Phú Mỹ Hưng', 'Căn hộ Nhật Bản tại Phú Mỹ Hưng', 'Phường Tân Phong, Quận 7', '4 tòa tháp 25 tầng', 'Đang triển khai'),
('The Metropole Thủ Thiêm', 'SonKim Land', 'Căn hộ siêu sang tại Thủ Thiêm', 'Phường Thủ Thiêm, Quận 2', '2 tòa tháp 45 tầng', 'Đang mở bán'),
('Feliz En Vista', 'CapitaLand', 'Căn hộ hạnh phúc tại Thủ Thiêm', 'Phường Thủ Thiêm, Quận 2', '2 tòa tháp 35 tầng', 'Đã bàn giao'),
('Empire City', 'Keppel Land', 'Thành phố đế chế bên sông', 'Phường Thủ Thiêm, Quận 2', '5 tòa tháp 50 tầng', 'Đang triển khai'),
('Serenity Sky Villas', 'Novaland', 'Biệt thự trên không', 'Phường Tân Phong, Quận 7', '3 tòa tháp 30 tầng', 'Đang mở bán'),
('The Marq', 'Hongkong Land', 'Căn hộ đẳng cấp quốc tế', 'Phường Đa Kao, Quận 1', '2 tòa tháp 40 tầng', 'Đã bàn giao'),
('Vinhomes Golden River', 'Vingroup', 'Dòng sông vàng giữa lòng thành phố', 'Phường Bến Nghé, Quận 1', '4 tòa tháp 45 tầng', 'Đang triển khai'),
('The River Thu Thiem', 'Novaland', 'Căn hộ view sông tuyệt đẹp', 'Phường Thủ Thiêm, Quận 2', '3 tòa tháp 35 tầng', 'Đang mở bán'),
('Masteri An Phú', 'Thảo Điền Investment', 'Căn hộ thông minh tại An Phú', 'Phường An Phú, Quận 2', '2 tòa tháp 30 tầng', 'Đã bàn giao'),
('One Verandah', 'Mapletree', 'Căn hộ Singapore tại Việt Nam', 'Phường Thạnh Mỹ Lợi, Quận 2', '2 tòa tháp 26 tầng', 'Đang triển khai'),
('Waterina Suites', 'Novaland', 'Căn hộ ven sông cao cấp', 'Phường Thạnh Mỹ Lợi, Quận 2', '1 tòa tháp 35 tầng', 'Đang mở bán'),
('Riviera Point', 'Keppel Land', 'Điểm đến ven sông lý tưởng', 'Phường Bình An, Quận 2', '4 tòa tháp 28 tầng', 'Đã bàn giao'),
('The Nassim', 'Novaland', 'Căn hộ siêu sang Thảo Điền', 'Phường Thảo Điền, Quận 2', '2 tòa tháp 25 tầng', 'Đang triển khai');

-- Insert ML models
INSERT INTO ml_models (version, model_file_path, performance_metrics, is_active, training_notes) VALUES
('1.0.0', '/models/avm_v1.0.0.pkl', '{"mae": 500000000, "mape": 0.08, "r2_score": 0.85}', false, 'Initial model trained on 2024 Q1 data'),
('1.1.0', '/models/avm_v1.1.0.pkl', '{"mae": 450000000, "mape": 0.075, "r2_score": 0.87}', false, 'Improved feature engineering with location data'),
('1.2.0', '/models/avm_v1.2.0.pkl', '{"mae": 420000000, "mape": 0.07, "r2_score": 0.89}', true, 'Added project data and amenities features'),
('1.2.1', '/models/avm_v1.2.1.pkl', '{"mae": 410000000, "mape": 0.068, "r2_score": 0.895}', false, 'Bug fix for outlier handling'),
('2.0.0-beta', '/models/avm_v2.0.0-beta.pkl', '{"mae": 380000000, "mape": 0.065, "r2_score": 0.91}', false, 'Deep learning model with neural networks'),
('1.3.0', '/models/avm_v1.3.0.pkl', '{"mae": 400000000, "mape": 0.069, "r2_score": 0.892}', false, 'Enhanced with market trend data'),
('1.0.1', '/models/avm_v1.0.1.pkl', '{"mae": 480000000, "mape": 0.078, "r2_score": 0.86}', false, 'Hotfix for data preprocessing'),
('1.4.0', '/models/avm_v1.4.0.pkl', '{"mae": 390000000, "mape": 0.067, "r2_score": 0.898}', false, 'Integrated transportation accessibility'),
('2.1.0-alpha', '/models/avm_v2.1.0-alpha.pkl', '{"mae": 370000000, "mape": 0.063, "r2_score": 0.915}', false, 'Experimental ensemble model'),
('1.5.0', '/models/avm_v1.5.0.pkl', '{"mae": 385000000, "mape": 0.066, "r2_score": 0.902}', false, 'Added school district ratings'),
('1.1.1', '/models/avm_v1.1.1.pkl', '{"mae": 440000000, "mape": 0.074, "r2_score": 0.875}', false, 'Performance optimization'),
('1.6.0', '/models/avm_v1.6.0.pkl', '{"mae": 375000000, "mape": 0.064, "r2_score": 0.905}', false, 'Crime rate and safety features'),
('2.0.1-beta', '/models/avm_v2.0.1-beta.pkl', '{"mae": 365000000, "mape": 0.062, "r2_score": 0.918}', false, 'Improved neural network architecture'),
('1.7.0', '/models/avm_v1.7.0.pkl', '{"mae": 380000000, "mape": 0.065, "r2_score": 0.908}', false, 'Environmental factors integration'),
('1.2.2', '/models/avm_v1.2.2.pkl', '{"mae": 415000000, "mape": 0.069, "r2_score": 0.893}', false, 'Security patch for model serving'),
('3.0.0-experimental', '/models/avm_v3.0.0-exp.pkl', '{"mae": 350000000, "mape": 0.06, "r2_score": 0.925}', false, 'Transformer-based architecture'),
('1.8.0', '/models/avm_v1.8.0.pkl', '{"mae": 372000000, "mape": 0.063, "r2_score": 0.912}', false, 'Real-time market data integration'),
('2.2.0-beta', '/models/avm_v2.2.0-beta.pkl', '{"mae": 360000000, "mape": 0.061, "r2_score": 0.92}', false, 'Multi-task learning approach'),
('1.9.0', '/models/avm_v1.9.0.pkl', '{"mae": 368000000, "mape": 0.062, "r2_score": 0.915}', false, 'Seasonal adjustment factors'),
('2.0.2-beta', '/models/avm_v2.0.2-beta.pkl', '{"mae": 358000000, "mape": 0.0605, "r2_score": 0.922}', false, 'Hyperparameter optimization'),
('1.10.0', '/models/avm_v1.10.0.pkl', '{"mae": 365000000, "mape": 0.0615, "r2_score": 0.918}', false, 'Infrastructure development impact'),
('4.0.0-research', '/models/avm_v4.0.0-research.pkl', '{"mae": 340000000, "mape": 0.058, "r2_score": 0.93}', false, 'Graph neural network for spatial relationships'),
('2.3.0-beta', '/models/avm_v2.3.0-beta.pkl', '{"mae": 355000000, "mape": 0.06, "r2_score": 0.925}', false, 'Attention mechanism for feature importance');

-- Insert 50+ properties with realistic coordinates across multiple cities
INSERT INTO properties (source_url, source_site, title, description, price, area, bedrooms, bathrooms, floors, frontage, full_address, location, additional_features, avm_estimate, published_at, project_id, property_type_id, legal_status_id, direction_id, ward_id, district_id) VALUES
-- Ho Chi Minh City properties (30 properties)
('https://batdongsan.com.vn/ban-can-ho-chung-cu-vinhomes-central-park-1', 'batdongsan.com.vn', 'Căn hộ 2PN Vinhomes Central Park view sông', 'Căn hộ 2 phòng ngủ tại Vinhomes Central Park, view sông Sài Gòn tuyệt đẹp, nội thất cao cấp', 5500000000.00, 75.5, 2, 2, 1, null, '208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "sông", "nội_thất": "cao_cấp", "ban_công": true}', 5200000000.00, '2024-01-15 10:30:00+07', 1, 1, 1, 1, 13, 13),
('https://alonhadat.com.vn/nha-ban-quan-1-2', 'alonhadat.com.vn', 'Nhà phố mặt tiền Quận 1', 'Nhà phố 4 tầng mặt tiền đường lớn Quận 1, kinh doanh tốt', 25000000000.00, 120.0, 4, 3, 4, 5.5, '123 Lê Lợi, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7008, 10.7718), 4326), '{"mặt_tiền": true, "kinh_doanh": true, "thang_máy": true}', 24500000000.00, '2024-01-20 14:15:00+07', null, 2, 1, 1, 1, 1),
('https://nhadat24h.net/ban-biet-thu-quan-2-3', 'nhadat24h.net', 'Biệt thự Thảo Điền 300m2', 'Biệt thự sang trọng tại khu Thảo Điền, sân vườn rộng, hồ bơi riêng', 45000000000.00, 300.0, 5, 4, 3, 12.0, '456 Đường Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7442, 10.8031), 4326), '{"hồ_bơi": true, "sân_vườn": true, "garage": 3}', 43000000000.00, '2024-01-25 09:45:00+07', null, 3, 1, 2, 18, 2),
('https://batdongsan.com.vn/ban-can-ho-masteri-thao-dien-4', 'batdongsan.com.vn', 'Căn hộ 3PN Masteri Thảo Điền', 'Căn hộ 3 phòng ngủ tại Masteri Thảo Điền, view sông, nội thất đầy đủ', 7200000000.00, 95.0, 3, 2, 1, null, 'Masteri Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7398, 10.8015), 4326), '{"view": "sông", "nội_thất": "đầy_đủ", "gym": true}', 6800000000.00, '2024-02-01 11:20:00+07', 2, 1, 1, 1, 18, 2),
('https://alonhadat.com.vn/dat-nen-quan-7-5', 'alonhadat.com.vn', 'Đất nền Phú Mỹ Hưng 200m2', 'Lô đất nền tại khu Phú Mỹ Hưng, vị trí đẹp, pháp lý rõ ràng', 18000000000.00, 200.0, null, null, null, 10.0, '789 Nguyễn Lương Bằng, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6947, 10.7289), 4326), '{"khu_cao_cấp": true, "an_ninh": "24/7"}', 17500000000.00, '2024-02-05 16:30:00+07', null, 5, 1, 3, 78, 7),
('https://nhadat24h.net/ban-shophouse-quan-1-6', 'nhadat24h.net', 'Shophouse mặt tiền Nguyễn Huệ', 'Shophouse 5 tầng mặt tiền phố đi bộ Nguyễn Huệ, vị trí vàng', 85000000000.00, 150.0, 2, 3, 5, 6.0, '321 Nguyễn Huệ, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7017, 10.7740), 4326), '{"mặt_tiền": true, "phố_đi_bộ": true, "thang_máy": true}', 82000000000.00, '2024-02-10 13:45:00+07', null, 4, 1, 1, 1, 1),
('https://batdongsan.com.vn/ban-can-ho-landmark-81-7', 'batdongsan.com.vn', 'Penthouse Landmark 81 view 360°', 'Penthouse tầng cao Landmark 81, view 360° toàn thành phố, nội thất siêu sang', 95000000000.00, 250.0, 4, 3, 2, null, 'Landmark 81, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "360_độ", "penthouse": true, "nội_thất": "siêu_sang"}', 90000000000.00, '2024-02-15 08:15:00+07', 3, 9, 1, 1, 13, 13),
('https://alonhadat.com.vn/nha-rieng-quan-3-8', 'alonhadat.com.vn', 'Nhà riêng 3 tầng Quận 3', 'Nhà riêng 3 tầng tại Quận 3, gần chợ Bến Thành, thuận tiện kinh doanh', 12000000000.00, 80.0, 3, 2, 3, 4.5, '654 Võ Văn Tần, Phường 5, Quận 3', ST_SetSRID(ST_MakePoint(106.6917, 10.7756), 4326), '{"gần_chợ": true, "kinh_doanh": true}', 11500000000.00, '2024-02-20 15:00:00+07', null, 2, 1, 4, 23, 3),
('https://nhadat24h.net/ban-can-ho-the-sun-avenue-9', 'nhadat24h.net', 'Căn hộ 1PN The Sun Avenue', 'Căn hộ 1 phòng ngủ The Sun Avenue, view thành phố, giá tốt cho nhà đầu tư', 3200000000.00, 55.0, 1, 1, 1, null, 'The Sun Avenue, Phường An Phú, Quận 2', ST_SetSRID(ST_MakePoint(106.7486, 10.8042), 4326), '{"view": "thành_phố", "đầu_tư": true}', 3000000000.00, '2024-02-25 12:30:00+07', 4, 1, 2, 2, 11, 2),
('https://batdongsan.com.vn/ban-officetel-saigon-royal-10', 'batdongsan.com.vn', 'Officetel Saigon Royal 45m2', 'Officetel tại Saigon Royal, vị trí trung tâm Quận 1, cho thuê dễ dàng', 4500000000.00, 45.0, 1, 1, 1, null, 'Saigon Royal, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7028, 10.7698), 4326), '{"officetel": true, "cho_thuê": "dễ_dàng"}', 4200000000.00, '2024-03-01 10:45:00+07', 5, 8, 1, 1, 1, 1),
-- Hanoi properties (10 properties)
('https://batdongsan.com.vn/ban-can-ho-times-city-hanoi-11', 'batdongsan.com.vn', 'Căn hộ 3PN Times City Hà Nội', 'Căn hộ 3 phòng ngủ tại Times City, view hồ Tây, nội thất hiện đại', 4500000000.00, 85.0, 3, 2, 1, null, 'Times City, Phường Phúc Xá, Quận Ba Đình', ST_SetSRID(ST_MakePoint(105.8342, 21.0285), 4326), '{"view": "hồ_tây", "nội_thất": "hiện_đại", "parking": true}', 4200000000.00, '2024-03-05 14:20:00+07', 11, 1, 1, 1, 160, 24),
('https://alonhadat.com.vn/nha-pho-ba-dinh-12', 'alonhadat.com.vn', 'Nhà phố 4 tầng Ba Đình', 'Nhà phố 4 tầng tại quận Ba Đình, gần Hồ Tây, kinh doanh tốt', 18000000000.00, 110.0, 4, 3, 4, 5.0, '123 Đội Cấn, Phường Đội Cấn, Quận Ba Đình', ST_SetSRID(ST_MakePoint(105.8198, 21.0367), 4326), '{"gần_hồ_tây": true, "kinh_doanh": true}', 17500000000.00, '2024-03-10 09:15:00+07', null, 2, 1, 2, 169, 24),
('https://nhadat24h.net/ban-biet-thu-tay-ho-13', 'nhadat24h.net', 'Biệt thự Tây Hồ 250m2', 'Biệt thự sang trọng tại Tây Hồ, view hồ tuyệt đẹp, sân vườn rộng', 35000000000.00, 250.0, 5, 4, 3, 10.0, '456 Quảng An, Phường Quảng An, Quận Tây Hồ', ST_SetSRID(ST_MakePoint(105.8456, 21.0456), 4326), '{"view_hồ": true, "sân_vườn": true, "garage": 2}', 33000000000.00, '2024-03-15 16:45:00+07', null, 3, 1, 3, 173, 26),
('https://batdongsan.com.vn/ban-can-ho-lotte-center-14', 'batdongsan.com.vn', 'Căn hộ Lotte Center Hanoi', 'Căn hộ cao cấp tại Lotte Center, view toàn thành phố Hà Nội', 8500000000.00, 120.0, 3, 2, 1, null, 'Lotte Center, Phường Đội Cấn, Quận Ba Đình', ST_SetSRID(ST_MakePoint(105.8198, 21.0367), 4326), '{"view": "toàn_thành_phố", "cao_cấp": true}', 8000000000.00, '2024-03-20 11:30:00+07', 12, 1, 1, 1, 169, 24),
('https://alonhadat.com.vn/nha-mat-tien-hoan-kiem-15', 'alonhadat.com.vn', 'Nhà mặt tiền Hoàn Kiếm', 'Nhà mặt tiền 5 tầng tại Hoàn Kiếm, vị trí vàng, kinh doanh sầm uất', 45000000000.00, 80.0, 3, 2, 5, 4.0, '789 Hàng Bạc, Phường Hàng Bạc, Quận Hoàn Kiếm', ST_SetSRID(ST_MakePoint(105.8542, 21.0285), 4326), '{"mặt_tiền": true, "vị_trí_vàng": true}', 42000000000.00, '2024-03-25 13:15:00+07', null, 17, 1, 4, 178, 25),
-- Da Nang properties (5 properties)
('https://batdongsan.com.vn/ban-can-ho-muong-thanh-danang-16', 'batdongsan.com.vn', 'Căn hộ Muong Thanh Đà Nẵng', 'Căn hộ 2 phòng ngủ tại Muong Thanh, view biển Đà Nẵng', 3800000000.00, 70.0, 2, 2, 1, null, 'Muong Thanh, Phường Hải Châu I, Quận Hải Châu', ST_SetSRID(ST_MakePoint(108.2022, 16.0544), 4326), '{"view": "biển", "resort_style": true}', 3500000000.00, '2024-04-01 15:30:00+07', 13, 1, 1, 5, 190, 32),
('https://alonhadat.com.vn/nha-pho-thanh-khe-17', 'alonhadat.com.vn', 'Nhà phố Thanh Khê', 'Nhà phố 3 tầng tại Thanh Khê, gần biển, tiện kinh doanh', 8500000000.00, 90.0, 3, 2, 3, 4.5, '321 Thanh Khê Đông, Phường Thanh Khê Đông, Quận Thanh Khê', ST_SetSRID(ST_MakePoint(108.1967, 16.0678), 4326), '{"gần_biển": true, "kinh_doanh": true}', 8000000000.00, '2024-04-05 12:00:00+07', null, 2, 1, 6, 192, 33),
('https://nhadat24h.net/ban-biet-thu-son-tra-18', 'nhadat24h.net', 'Biệt thự Sơn Trà view biển', 'Biệt thự sang trọng tại bán đảo Sơn Trà, view biển 180°', 25000000000.00, 200.0, 4, 3, 2, 8.0, '654 Sơn Trà, Quận Sơn Trà', ST_SetSRID(ST_MakePoint(108.2456, 16.1123), 4326), '{"view_biển": "180_độ", "bán_đảo": true}', 23000000000.00, '2024-04-10 10:15:00+07', null, 3, 1, 7, null, 34),
-- Can Tho properties (3 properties)
('https://batdongsan.com.vn/ban-can-ho-vinpearl-cantho-19', 'batdongsan.com.vn', 'Căn hộ Vinpearl Cần Thơ', 'Căn hộ 2 phòng ngủ tại Vinpearl, view sông Hậu', 2800000000.00, 65.0, 2, 2, 1, null, 'Vinpearl, Phường Cái Khế, Quận Ninh Kiều', ST_SetSRID(ST_MakePoint(105.7851, 10.0452), 4326), '{"view": "sông_hậu", "resort": true}', 2600000000.00, '2024-04-15 14:45:00+07', 14, 1, 1, 8, 206, 40),
('https://alonhadat.com.vn/nha-pho-ninh-kieu-20', 'alonhadat.com.vn', 'Nhà phố Ninh Kiều', 'Nhà phố 3 tầng tại trung tâm Ninh Kiều, gần chợ nổi', 6500000000.00, 75.0, 3, 2, 3, 4.0, '987 An Hòa, Phường An Hòa, Quận Ninh Kiều', ST_SetSRID(ST_MakePoint(105.7789, 10.0389), 4326), '{"trung_tâm": true, "gần_chợ_nổi": true}', 6200000000.00, '2024-04-20 09:30:00+07', null, 2, 1, 9, 207, 40),
-- Vung Tau properties (2 properties)
('https://batdongsan.com.vn/ban-can-ho-marina-bay-vungtau-21', 'batdongsan.com.vn', 'Căn hộ Marina Bay Vũng Tàu', 'Căn hộ 2 phòng ngủ view biển Vũng Tàu, nội thất cao cấp', 3200000000.00, 60.0, 2, 2, 1, null, 'Marina Bay, Quận 1, Vũng Tàu', ST_SetSRID(ST_MakePoint(107.0857, 10.3460), 4326), '{"view_biển": true, "nội_thất": "cao_cấp"}', 3000000000.00, '2024-04-25 16:20:00+07', 15, 1, 1, 10, null, 56),
('https://alonhadat.com.vn/biet-thu-vung-tau-22', 'alonhadat.com.vn', 'Biệt thự biển Vũng Tàu', 'Biệt thự 3 tầng mặt biển Vũng Tàu, sân vườn rộng', 15000000000.00, 150.0, 4, 3, 3, 6.0, '123 Thùy Vân, Quận 1, Vũng Tàu', ST_SetSRID(ST_MakePoint(107.0923, 10.3389), 4326), '{"mặt_biển": true, "sân_vườn": true}', 14500000000.00, '2024-04-30 11:45:00+07', null, 3, 1, 11, null, 56),
-- Additional Ho Chi Minh City properties (28 more properties)
('https://nhadat24h.net/ban-nha-mat-tien-quan-5-23', 'nhadat24h.net', 'Nhà mặt tiền Quận 5', 'Nhà mặt tiền 4 tầng tại Quận 5, kinh doanh sầm uất, pháp lý đầy đủ', 15000000000.00, 100.0, 4, 3, 4, 5.0, '987 Trần Hưng Đạo, Phường 1, Quận 5', ST_SetSRID(ST_MakePoint(106.6831, 10.7594), 4326), '{"mặt_tiền": true, "kinh_doanh": "sầm_uất"}', 14200000000.00, '2024-03-05 14:20:00+07', null, 17, 1, 3, 28, 5),
('https://batdongsan.com.vn/ban-can-ho-eco-green-saigon-24', 'batdongsan.com.vn', 'Căn hộ 2PN Eco Green Saigon', 'Căn hộ 2 phòng ngủ tại Eco Green Saigon, môi trường xanh, tiện ích đầy đủ', 4800000000.00, 70.0, 2, 2, 1, null, 'Eco Green Saigon, Phường Tân Phú, Quận 7', ST_SetSRID(ST_MakePoint(106.7156, 10.7411), 4326), '{"môi_trường": "xanh", "tiện_ích": "đầy_đủ"}', 4500000000.00, '2024-03-10 09:15:00+07', 6, 1, 2, 2, 79, 7),
('https://alonhadat.com.vn/ban-biet-thu-diamond-island-25', 'alonhadat.com.vn', 'Biệt thự Diamond Island 400m2', 'Biệt thự siêu sang tại Diamond Island, view sông 3 mặt, thiết kế hiện đại', 120000000000.00, 400.0, 6, 5, 3, 15.0, 'Diamond Island, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7125, 10.7598), 4326), '{"view": "sông_3_mặt", "thiết_kế": "hiện_đại", "siêu_sang": true}', 115000000000.00, '2024-03-15 16:45:00+07', 7, 3, 1, 1, 13, 13),
('https://nhadat24h.net/ban-nha-hem-quan-10-26', 'nhadat24h.net', 'Nhà hẻm Quận 10', 'Nhà 3 tầng trong hẻm Quận 10, an ninh tốt, giá hợp lý', 8500000000.00, 65.0, 3, 2, 3, 3.5, '159 Sư Vạn Hạnh, Phường 12, Quận 10', ST_SetSRID(ST_MakePoint(106.6736, 10.7731), 4326), '{"hẻm": true, "an_ninh": "tốt"}', 8000000000.00, '2024-03-20 11:30:00+07', null, 18, 1, 4, 95, 10),
('https://batdongsan.com.vn/ban-can-ho-gateway-thao-dien-27', 'batdongsan.com.vn', 'Căn hộ 3PN Gateway Thảo Điền', 'Căn hộ 3 phòng ngủ Gateway Thảo Điền, phong cách Singapore, view đẹp', 8500000000.00, 110.0, 3, 2, 1, null, 'Gateway Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7425, 10.8025), 4326), '{"phong_cách": "Singapore", "view": "đẹp"}', 8000000000.00, '2024-03-25 13:15:00+07', 8, 1, 1, 1, 18, 2),
('https://alonhadat.com.vn/ban-studio-estella-heights-28', 'alonhadat.com.vn', 'Studio Estella Heights 35m2', 'Studio tại Estella Heights, thiết kế thông minh, phù hợp cho người độc thân', 2800000000.00, 35.0, 1, 1, 1, null, 'Estella Heights, Phường An Phú, Quận 2', ST_SetSRID(ST_MakePoint(106.7469, 10.8058), 4326), '{"studio": true, "thiết_kế": "thông_minh"}', 2600000000.00, '2024-03-30 08:45:00+07', 9, 10, 2, 2, 11, 2),
('https://nhadat24h.net/ban-nha-lien-ke-quan-7-29', 'nhadat24h.net', 'Nhà liền kề Sunrise City', 'Nhà liền kề 4 tầng tại Sunrise City, khu an ninh, tiện ích đầy đủ', 22000000000.00, 180.0, 4, 3, 4, 6.0, 'Sunrise City, Phường Tân Hưng, Quận 7', ST_SetSRID(ST_MakePoint(106.7089, 10.7356), 4326), '{"liền_kề": true, "an_ninh": true, "tiện_ích": "đầy_đủ"}', 21000000000.00, '2024-04-01 15:30:00+07', 10, 20, 1, 1, 80, 7),
('https://batdongsan.com.vn/ban-can-ho-midtown-sakura-30', 'batdongsan.com.vn', 'Căn hộ 2PN Midtown Sakura Park', 'Căn hộ 2 phòng ngủ phong cách Nhật Bản, nội thất gỗ tự nhiên', 6200000000.00, 85.0, 2, 2, 1, null, 'Midtown Sakura Park, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6978, 10.7298), 4326), '{"phong_cách": "Nhật_Bản", "nội_thất": "gỗ_tự_nhiên"}', 5800000000.00, '2024-04-05 12:00:00+07', 11, 1, 2, 2, 78, 7),
('https://alonhadat.com.vn/ban-penthouse-metropole-thu-thiem-31', 'alonhadat.com.vn', 'Penthouse The Metropole Thủ Thiêm', 'Penthouse siêu sang tại The Metropole Thủ Thiêm, view panorama tuyệt đẹp', 180000000000.00, 350.0, 5, 4, 2, null, 'The Metropole Thủ Thiêm, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7278, 10.7889), 4326), '{"penthouse": true, "view": "panorama", "siêu_sang": true}', 175000000000.00, '2024-04-10 10:15:00+07', 12, 9, 1, 1, 19, 2),
('https://nhadat24h.net/ban-dat-nen-can-gio-32', 'nhadat24h.net', 'Đất nền Cần Giờ view biển', 'Lô đất nền tại Cần Giờ, view biển đẹp, tiềm năng phát triển cao', 3500000000.00, 500.0, null, null, null, 20.0, 'Xã Bình Khánh, Huyện Cần Giờ', ST_SetSRID(ST_MakePoint(106.8542, 10.4789), 4326), '{"view": "biển", "tiềm_năng": "cao"}', 3200000000.00, '2024-04-15 14:45:00+07', null, 5, 3, 3, null, 19),
('https://batdongsan.com.vn/ban-duplex-feliz-en-vista-33', 'batdongsan.com.vn', 'Duplex Feliz En Vista 120m2', 'Căn duplex tại Feliz En Vista, 2 tầng, thiết kế độc đáo', 9500000000.00, 120.0, 3, 2, 2, null, 'Feliz En Vista, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7298, 10.7856), 4326), '{"duplex": true, "thiết_kế": "độc_đáo"}', 9000000000.00, '2024-04-20 09:30:00+07', 13, 11, 1, 1, 19, 2),
('https://alonhadat.com.vn/ban-townhouse-empire-city-34', 'alonhadat.com.vn', 'Townhouse Empire City 200m2', 'Townhouse 4 tầng tại Empire City, view sông, thiết kế hiện đại', 35000000000.00, 200.0, 4, 3, 4, 8.0, 'Empire City, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7312, 10.7823), 4326), '{"townhouse": true, "view": "sông", "thiết_kế": "hiện_đại"}', 33000000000.00, '2024-04-25 16:20:00+07', 14, 12, 1, 1, 19, 2),
('https://nhadat24h.net/ban-can-ho-dich-vu-quan-1-35', 'nhadat24h.net', 'Căn hộ dịch vụ Quận 1', 'Căn hộ dịch vụ tại trung tâm Quận 1, đầy đủ tiện nghi, cho thuê cao', 6800000000.00, 50.0, 1, 1, 1, null, '789 Đồng Khởi, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7025, 10.7756), 4326), '{"dịch_vụ": true, "tiện_nghi": "đầy_đủ", "cho_thuê": "cao"}', 6500000000.00, '2024-04-30 11:45:00+07', null, 16, 1, 1, 1, 1),
('https://batdongsan.com.vn/ban-villa-serenity-sky-36', 'batdongsan.com.vn', 'Sky Villa Serenity Sky Villas', 'Sky Villa tại Serenity Sky Villas, tầng cao, sân vườn trên không', 75000000000.00, 280.0, 4, 3, 2, null, 'Serenity Sky Villas, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6989, 10.7312), 4326), '{"sky_villa": true, "sân_vườn": "trên_không"}', 72000000000.00, '2024-05-01 13:15:00+07', 15, 13, 1, 1, 78, 7),
-- Additional Hanoi properties (5 more properties)
('https://nhadat24h.net/ban-can-ho-royal-city-hanoi-37', 'nhadat24h.net', 'Căn hộ Royal City Hà Nội', 'Căn hộ 2 phòng ngủ tại Royal City, tiện ích đầy đủ, gần trung tâm', 3800000000.00, 75.0, 2, 2, 1, null, 'Royal City, Phường Thanh Xuân Trung, Quận Thanh Xuân', ST_SetSRID(ST_MakePoint(105.8089, 20.9956), 4326), '{"tiện_ích": "đầy_đủ", "gần_trung_tâm": true}', 3600000000.00, '2024-05-05 10:30:00+07', null, 1, 1, 2, 179, 27),
('https://batdongsan.com.vn/ban-nha-pho-cau-giay-38', 'batdongsan.com.vn', 'Nhà phố Cầu Giấy', 'Nhà phố 4 tầng tại Cầu Giấy, gần các trường đại học, kinh doanh tốt', 16000000000.00, 95.0, 4, 3, 4, 4.5, '456 Nguyễn Khánh Toàn, Phường Quan Hoa, Quận Cầu Giấy', ST_SetSRID(ST_MakePoint(105.7956, 21.0378), 4326), '{"gần_trường_học": true, "kinh_doanh": true}', 15500000000.00, '2024-05-10 14:15:00+07', null, 2, 1, 3, 180, 28),
('https://alonhadat.com.vn/ban-biet-thu-long-bien-39', 'alonhadat.com.vn', 'Biệt thự Long Biên', 'Biệt thự 3 tầng tại Long Biên, view sông Hồng, sân vườn rộng', 28000000000.00, 220.0, 5, 4, 3, 9.0, '789 Nguyễn Văn Cừ, Phường Gia Thụy, Quận Long Biên', ST_SetSRID(ST_MakePoint(105.8789, 21.0456), 4326), '{"view_sông": true, "sân_vườn": true}', 26500000000.00, '2024-05-15 16:45:00+07', null, 3, 1, 4, 181, 29),
('https://nhadat24h.net/ban-can-ho-goldmark-city-40', 'nhadat24h.net', 'Căn hộ Goldmark City', 'Căn hộ 3 phòng ngủ tại Goldmark City, nội thất hiện đại, view đẹp', 5200000000.00, 90.0, 3, 2, 1, null, 'Goldmark City, Phường Mỹ Đình 2, Quận Nam Từ Liêm', ST_SetSRID(ST_MakePoint(105.7678, 21.0289), 4326), '{"nội_thất": "hiện_đại", "view": "đẹp"}', 4900000000.00, '2024-05-20 11:30:00+07', null, 1, 1, 1, 182, 30),
('https://batdongsan.com.vn/ban-shophouse-hai-ba-trung-41', 'batdongsan.com.vn', 'Shophouse Hai Bà Trưng', 'Shophouse 5 tầng tại Hai Bà Trưng, mặt tiền đường lớn, kinh doanh sầm uất', 42000000000.00, 120.0, 3, 2, 5, 5.5, '321 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng', ST_SetSRID(ST_MakePoint(105.8456, 21.0178), 4326), '{"mặt_tiền": true, "kinh_doanh": "sầm_uất"}', 40000000000.00, '2024-05-25 13:15:00+07', null, 4, 1, 5, 183, 31),
-- Additional Da Nang properties (2 more properties)
('https://alonhadat.com.vn/ban-can-ho-azura-danang-42', 'alonhadat.com.vn', 'Căn hộ Azura Đà Nẵng', 'Căn hộ 2 phòng ngủ tại Azura, view biển và núi, nội thất cao cấp', 4200000000.00, 80.0, 2, 2, 1, null, 'Azura, Phường Mân Thái, Quận Sơn Trà', ST_SetSRID(ST_MakePoint(108.2389, 16.0889), 4326), '{"view": "biển_và_núi", "nội_thất": "cao_cấp"}', 3900000000.00, '2024-05-30 09:45:00+07', null, 1, 1, 6, null, 34),
('https://nhadat24h.net/ban-biet-thu-ngu-hanh-son-43', 'nhadat24h.net', 'Biệt thự Ngũ Hành Sơn', 'Biệt thự 4 tầng tại Ngũ Hành Sơn, gần biển, thiết kế hiện đại', 32000000000.00, 280.0, 5, 4, 4, 10.0, '654 Nguyễn Tất Thành, Quận Ngũ Hành Sơn', ST_SetSRID(ST_MakePoint(108.2567, 16.0123), 4326), '{"gần_biển": true, "thiết_kế": "hiện_đại"}', 30000000000.00, '2024-06-01 15:30:00+07', null, 3, 1, 7, null, 35),
-- Additional Can Tho properties (2 more properties)
('https://batdongsan.com.vn/ban-can-ho-saigon-cantho-44', 'batdongsan.com.vn', 'Căn hộ Saigon Cần Thơ', 'Căn hộ 3 phòng ngủ tại Saigon Cần Thơ, view sông, tiện ích hiện đại', 3500000000.00, 85.0, 3, 2, 1, null, 'Saigon Cần Thơ, Phường Xuân Khánh, Quận Ninh Kiều', ST_SetSRID(ST_MakePoint(105.7923, 10.0567), 4326), '{"view_sông": true, "tiện_ích": "hiện_đại"}', 3300000000.00, '2024-06-05 12:00:00+07', null, 1, 1, 8, 208, 40),
('https://alonhadat.com.vn/ban-nha-pho-cai-rang-45', 'alonhadat.com.vn', 'Nhà phố Cái Răng', 'Nhà phố 3 tầng tại Cái Răng, gần chợ nổi Cái Răng, kinh doanh tốt', 7200000000.00, 90.0, 3, 2, 3, 4.5, '987 Đường 30/4, Phường Lê Bình, Quận Cái Răng', ST_SetSRID(ST_MakePoint(105.7567, 10.0234), 4326), '{"gần_chợ_nổi": true, "kinh_doanh": true}', 6800000000.00, '2024-06-10 10:15:00+07', null, 2, 1, 9, 209, 41),
-- Additional Hai Phong properties (3 properties)
('https://nhadat24h.net/ban-can-ho-green-bay-haiphong-46', 'nhadat24h.net', 'Căn hộ Green Bay Hải Phòng', 'Căn hộ 2 phòng ngủ tại Green Bay, view vịnh, nội thất đầy đủ', 2800000000.00, 70.0, 2, 2, 1, null, 'Green Bay, Phường Đông Khê, Quận Ngô Quyền', ST_SetSRID(ST_MakePoint(106.6889, 20.8567), 4326), '{"view_vịnh": true, "nội_thất": "đầy_đủ"}', 2600000000.00, '2024-06-15 14:45:00+07', null, 1, 1, 10, null, 42),
('https://batdongsan.com.vn/ban-nha-pho-le-chan-47', 'batdongsan.com.vn', 'Nhà phố Lê Chân', 'Nhà phố 4 tầng tại Lê Chân, trung tâm thành phố, kinh doanh tốt', 12000000000.00, 85.0, 4, 3, 4, 4.0, '123 Lạch Tray, Phường Đông Khê, Quận Ngô Quyền', ST_SetSRID(ST_MakePoint(106.6923, 20.8634), 4326), '{"trung_tâm": true, "kinh_doanh": true}', 11500000000.00, '2024-06-20 09:30:00+07', null, 2, 1, 11, null, 42),
('https://alonhadat.com.vn/ban-biet-thu-do-son-48', 'alonhadat.com.vn', 'Biệt thự Đồ Sơn', 'Biệt thự 3 tầng tại Đồ Sơn, view biển, nghỉ dưỡng lý tưởng', 18000000000.00, 180.0, 4, 3, 3, 7.0, '456 Bãi A, Phường Bãi A, Quận Đồ Sơn', ST_SetSRID(ST_MakePoint(106.7789, 20.7123), 4326), '{"view_biển": true, "nghỉ_dưỡng": true}', 17000000000.00, '2024-06-25 16:20:00+07', null, 3, 1, 12, null, 43),
-- Additional Nha Trang properties (2 properties)
('https://nhadat24h.net/ban-can-ho-muong-thanh-nhatrang-49', 'nhadat24h.net', 'Căn hộ Muong Thanh Nha Trang', 'Căn hộ 2 phòng ngủ view biển Nha Trang, resort 5 sao', 3600000000.00, 65.0, 2, 2, 1, null, 'Muong Thanh, Phường Vĩnh Hải, Thành phố Nha Trang', ST_SetSRID(ST_MakePoint(109.1967, 12.2389), 4326), '{"view_biển": true, "resort_5_sao": true}', 3400000000.00, '2024-06-30 11:45:00+07', null, 1, 1, 1, null, 52),
('https://batdongsan.com.vn/ban-biet-thu-vinpearl-nhatrang-50', 'batdongsan.com.vn', 'Biệt thự Vinpearl Nha Trang', 'Biệt thự 4 tầng tại Vinpearl, view biển 180°, sân vườn riêng', 45000000000.00, 250.0, 5, 4, 4, 8.0, 'Vinpearl, Phường Vĩnh Nguyên, Thành phố Nha Trang', ST_SetSRID(ST_MakePoint(109.2123, 12.2567), 4326), '{"view_biển": "180_độ", "sân_vườn": true}', 42000000000.00, '2024-07-01 13:15:00+07', null, 3, 1, 2, null, 52);

-- Insert price history for some properties
INSERT INTO price_history (price, changed_at, property_id)
SELECT 
    p.price * (0.9 + random() * 0.2), -- Random price variation
    p.published_at - INTERVAL '30 days',
    p.id
FROM properties p
LIMIT 20;

-- Insert more price history entries
INSERT INTO price_history (price, changed_at, property_id)
SELECT 
    p.price * (0.85 + random() * 0.3),
    p.published_at - INTERVAL '60 days',
    p.id
FROM properties p
LIMIT 15;

-- Insert property images
INSERT INTO property_images (image_url, is_thumbnail, property_id)
SELECT 
    'https://example.com/images/property_' || p.id || '_' || gs.series || '.jpg',
    CASE WHEN gs.series = 1 THEN true ELSE false END,
    p.id
FROM properties p
CROSS JOIN generate_series(1, 3) gs(series)
LIMIT 60;

-- Insert valuations from professional users
INSERT INTO valuations (value, avm_value_at_valuation, notes, property_id, user_id)
SELECT 
    p.price * (0.95 + random() * 0.1),
    p.avm_estimate,
    'Định giá dựa trên phân tích thị trường và so sánh với các BĐS tương tự trong khu vực',
    p.id,
    u.id
FROM properties p
CROSS JOIN (SELECT id FROM users WHERE role = 'Professional' LIMIT 5) u
LIMIT 25;

-- Insert user favorites
INSERT INTO user_favorites (user_id, property_id)
SELECT 
    u.id,
    p.id
FROM users u
CROSS JOIN properties p
WHERE random() < 0.1 -- 10% chance of being favorited
LIMIT 30;

-- Insert estimation logs
INSERT INTO estimation_logs (input_features, estimated_price, model_id, user_id)
SELECT 
    json_build_object(
        'area', 50 + random() * 200,
        'bedrooms', floor(1 + random() * 4),
        'bathrooms', floor(1 + random() * 3),
        'district_id', floor(1 + random() * 23),
        'property_type_id', floor(1 + random() * 8)
    ),
    (2000000000 + random() * 50000000000)::decimal(18,2),
    (SELECT id FROM ml_models WHERE is_active = true LIMIT 1),
    CASE WHEN random() < 0.7 THEN u.id ELSE NULL END
FROM users u
CROSS JOIN generate_series(1, 2)
LIMIT 40;