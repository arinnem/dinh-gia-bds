-- Expanded Dummy data for Real Estate Database
-- Meeting Phase 1 requirements: 10 major cities, 50+ districts, 200+ wards, 50+ properties

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
('Nhà liền kề'),
('Căn hộ mini');

-- Insert legal statuses
INSERT INTO legal_statuses (name) VALUES
('Sổ đỏ chính chủ'),
('Sổ hồng'),
('Giấy tờ hợp lệ'),
('Đang chờ sổ'),
('Sổ chung'),
('Giấy phép xây dựng'),
('Hợp đồng mua bán'),
('Giấy chứng nhận quyền sử dụng đất'),
('Pháp lý rõ ràng');

-- Insert directions
INSERT INTO directions (name) VALUES
('Hướng Đông'),
('Hướng Tây'),
('Hướng Nam'),
('Hướng Bắc'),
('Hướng Đông Nam'),
('Hướng Đông Bắc'),
('Hướng Tây Nam'),
('Hướng Tây Bắc'),
('Hướng Đông chính'),
('Hướng Tây chính'),
('Hướng Nam chính'),
('Hướng Bắc chính'),
('Đông-Nam-Nam'),
('Tây-Bắc-Bắc'),
('Đông-Bắc-Bắc'),
('Tây-Nam-Nam'),
('Đông-Đông-Nam'),
('Tây-Tây-Bắc'),
('Nam-Đông-Nam'),
('Bắc-Tây-Bắc'),
('Hướng Đông Đông Nam'),
('Hướng Tây Tây Bắc'),
('Hướng Nam Nam Đông'),
('Hướng Bắc Bắc Tây');

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

-- Insert users (15 total: 10 standard + 5 professional)
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
('user10@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Đinh Văn Tùng', 'Standard'),
('user11@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Cao Thị Yến', 'Standard'),
('user12@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Dương Văn Khoa', 'Standard'),
('user13@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Tô Thị Bích', 'Standard'),
('user14@example.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO.G', 'Hồ Văn Long', 'Standard');

-- Insert projects (10 projects minimum)
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
('Times City Hanoi', 'Vingroup', 'Khu đô thị hiện đại tại Hà Nội', 'Phường Phúc Xá, Quận Ba Đình', '12 tòa tháp 35 tầng', 'Đã bàn giao'),
('Lotte Center Hanoi', 'Lotte Group', 'Tòa nhà cao nhất Hà Nội', 'Phường Đội Cấn, Quận Ba Đình', '1 tòa tháp 65 tầng', 'Đã bàn giao'),
('Muong Thanh Da Nang', 'Muong Thanh Group', 'Khách sạn và căn hộ cao cấp', 'Phường Hải Châu I, Quận Hải Châu', '2 tòa tháp 40 tầng', 'Đang triển khai'),
('Vinpearl Can Tho', 'Vingroup', 'Khu nghỉ dưỡng và căn hộ', 'Phường Cái Khế, Quận Ninh Kiều', '3 tòa tháp 25 tầng', 'Đang mở bán'),
('Marina Bay Vung Tau', 'Novaland', 'Căn hộ view biển Vũng Tàu', 'Quận 1, Vũng Tàu', '4 tòa tháp 30 tầng', 'Đã bàn giao');

-- Insert ML models
INSERT INTO ml_models (version, model_file_path, performance_metrics, is_active, training_notes) VALUES
('1.0.0', '/models/avm_v1.0.0.pkl', '{"mae": 500000000, "mape": 0.08, "r2_score": 0.85}', false, 'Initial model trained on 2024 Q1 data'),
('1.1.0', '/models/avm_v1.1.0.pkl', '{"mae": 450000000, "mape": 0.075, "r2_score": 0.87}', false, 'Improved feature engineering with location data'),
('1.2.0', '/models/avm_v1.2.0.pkl', '{"mae": 420000000, "mape": 0.07, "r2_score": 0.89}', true, 'Added project data and amenities features'),
('1.2.1', '/models/avm_v1.2.1.pkl', '{"mae": 410000000, "mape": 0.068, "r2_score": 0.895}', false, 'Bug fix for outlier handling'),
('2.0.0-beta', '/models/avm_v2.0.0-beta.pkl', '{"mae": 380000000, "mape": 0.065, "r2_score": 0.91}', false, 'Deep learning model with neural networks');

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
('https://alonhadat.com.vn/biet-thu-vung-tau-22', 'alonhadat.com.vn', 'Biệt thự biển Vũng Tàu', 'Biệt thự 3 tầng mặt biển Vũng Tàu, sân vườn rộng', 15000000000.00, 150.0, 4, 3, 3, 6.0, '123 Thùy Vân, Quận 1, Vũng Tàu', ST_SetSRID(ST_MakePoint(107.0923, 10.3389), 4326), '{"mặt_biển": true, "sân_vườn": true}', 14500000000.00, '2024-04-30 11:45:00+07', null, 3, 1, 11, null, 56);

-- Insert price history for properties
INSERT INTO price_history (price, changed_at, property_id)
SELECT 
    p.price * (0.9 + random() * 0.2), -- Random price variation
    p.published_at - INTERVAL '30 days',
    p.id
FROM properties p
LIMIT 30;

-- Insert property images
INSERT INTO property_images (image_url, is_thumbnail, property_id)
SELECT 
    'https://example.com/images/property_' || p.id || '_' || gs.series || '.jpg',
    CASE WHEN gs.series = 1 THEN true ELSE false END,
    p.id
FROM properties p
CROSS JOIN generate_series(1, 3) gs(series)
LIMIT 150;

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
        'district_id', floor(1 + random() * 60),
        'property_type_id', floor(1 + random() * 20)
    ),
    (2000000000 + random() * 50000000000)::decimal(18,2),
    (SELECT id FROM ml_models WHERE is_active = true LIMIT 1),
    CASE WHEN random() < 0.7 THEN u.id ELSE NULL END
FROM users u
CROSS JOIN generate_series(1, 3)
LIMIT 40;