-- Dummy data for Real Estate Database
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

-- Insert districts (Ho Chi Minh City)
INSERT INTO districts (name, province) VALUES
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
('TP. Thủ Đức', 'TP. Hồ Chí Minh');

-- Insert wards (sample for District 1)
INSERT INTO wards (name, district_id) VALUES
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
('Phường An Phú', 2),
('Phường Bình An', 2),
('Phường Bình Khánh', 2),
('Phường Bình Trưng Đông', 2),
('Phường Bình Trưng Tây', 2),
('Phường Cát Lái', 2),
('Phường Thạnh Mỹ Lợi', 2),
('Phường Thảo Điền', 2),
('Phường Thủ Thiêm', 2),
('Phường 1', 3),
('Phường 2', 3),
('Phường 3', 3),
('Phường 4', 3),
('Phường 5', 3);

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

-- Insert properties with realistic Ho Chi Minh City coordinates
INSERT INTO properties (source_url, source_site, title, description, price, area, bedrooms, bathrooms, floors, frontage, full_address, location, additional_features, avm_estimate, published_at, project_id, property_type_id, legal_status_id, direction_id, ward_id, district_id) VALUES
('https://batdongsan.com.vn/ban-can-ho-chung-cu-vinhomes-central-park-1', 'batdongsan.com.vn', 'Căn hộ 2PN Vinhomes Central Park view sông', 'Căn hộ 2 phòng ngủ tại Vinhomes Central Park, view sông Sài Gòn tuyệt đẹp, nội thất cao cấp', 5500000000.00, 75.5, 2, 2, 1, null, '208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "sông", "nội_thất": "cao_cấp", "ban_công": true}', 5200000000.00, '2024-01-15 10:30:00+07', (SELECT id FROM projects WHERE name = 'Vinhomes Central Park'), 1, 1, 1, 13, 13),
('https://alonhadat.com.vn/nha-ban-quan-1-2', 'alonhadat.com.vn', 'Nhà phố mặt tiền Quận 1', 'Nhà phố 4 tầng mặt tiền đường lớn Quận 1, kinh doanh tốt', 25000000000.00, 120.0, 4, 3, 4, 5.5, '123 Lê Lợi, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7008, 10.7718), 4326), '{"mặt_tiền": true, "kinh_doanh": true, "thang_máy": true}', 24500000000.00, '2024-01-20 14:15:00+07', null, 2, 1, 1, 1, 1),
('https://nhadat24h.net/ban-biet-thu-quan-2-3', 'nhadat24h.net', 'Biệt thự Thảo Điền 300m2', 'Biệt thự sang trọng tại khu Thảo Điền, sân vườn rộng, hồ bơi riêng', 45000000000.00, 300.0, 5, 4, 3, 12.0, '456 Đường Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7442, 10.8031), 4326), '{"hồ_bơi": true, "sân_vườn": true, "garage": 3}', 43000000000.00, '2024-01-25 09:45:00+07', null, 3, 1, 2, 18, 2),
('https://batdongsan.com.vn/ban-can-ho-masteri-thao-dien-4', 'batdongsan.com.vn', 'Căn hộ 3PN Masteri Thảo Điền', 'Căn hộ 3 phòng ngủ tại Masteri Thảo Điền, view sông, nội thất đầy đủ', 7200000000.00, 95.0, 3, 2, 1, null, 'Masteri Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7398, 10.8015), 4326), '{"view": "sông", "nội_thất": "đầy_đủ", "gym": true}', 6800000000.00, '2024-02-01 11:20:00+07', (SELECT id FROM projects WHERE name = 'Masteri Thảo Điền'), 1, 1, 1, 18, 2),
('https://alonhadat.com.vn/dat-nen-quan-7-5', 'alonhadat.com.vn', 'Đất nền Phú Mỹ Hưng 200m2', 'Lô đất nền tại khu Phú Mỹ Hưng, vị trí đẹp, pháp lý rõ ràng', 18000000000.00, 200.0, null, null, null, 10.0, '789 Nguyễn Lương Bằng, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6947, 10.7289), 4326), '{"khu_cao_cấp": true, "an_ninh": "24/7"}', 17500000000.00, '2024-02-05 16:30:00+07', null, 5, 1, 3, null, 7),
('https://nhadat24h.net/ban-shophouse-quan-1-6', 'nhadat24h.net', 'Shophouse mặt tiền Nguyễn Huệ', 'Shophouse 5 tầng mặt tiền phố đi bộ Nguyễn Huệ, vị trí vàng', 85000000000.00, 150.0, 2, 3, 5, 6.0, '321 Nguyễn Huệ, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7017, 10.7740), 4326), '{"mặt_tiền": true, "phố_đi_bộ": true, "thang_máy": true}', 82000000000.00, '2024-02-10 13:45:00+07', null, 4, 1, 1, 1, 1),
('https://batdongsan.com.vn/ban-can-ho-landmark-81-7', 'batdongsan.com.vn', 'Penthouse Landmark 81 view 360°', 'Penthouse tầng cao Landmark 81, view 360° toàn thành phố, nội thất siêu sang', 95000000000.00, 250.0, 4, 3, 2, null, 'Landmark 81, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "360_độ", "penthouse": true, "nội_thất": "siêu_sang"}', 90000000000.00, '2024-02-15 08:15:00+07', (SELECT id FROM projects WHERE name = 'Landmark 81'), 9, 1, 1, 13, 13),
('https://alonhadat.com.vn/nha-rieng-quan-3-8', 'alonhadat.com.vn', 'Nhà riêng 3 tầng Quận 3', 'Nhà riêng 3 tầng tại Quận 3, gần chợ Bến Thành, thuận tiện kinh doanh', 12000000000.00, 80.0, 3, 2, 3, 4.5, '654 Võ Văn Tần, Phường 5, Quận 3', ST_SetSRID(ST_MakePoint(106.6917, 10.7756), 4326), '{"gần_chợ": true, "kinh_doanh": true}', 11500000000.00, '2024-02-20 15:00:00+07', null, 2, 1, 4, 23, 3),
('https://nhadat24h.net/ban-can-ho-the-sun-avenue-9', 'nhadat24h.net', 'Căn hộ 1PN The Sun Avenue', 'Căn hộ 1 phòng ngủ The Sun Avenue, view thành phố, giá tốt cho nhà đầu tư', 3200000000.00, 55.0, 1, 1, 1, null, 'The Sun Avenue, Phường An Phú, Quận 2', ST_SetSRID(ST_MakePoint(106.7486, 10.8042), 4326), '{"view": "thành_phố", "đầu_tư": true}', 3000000000.00, '2024-02-25 12:30:00+07', (SELECT id FROM projects WHERE name = 'The Sun Avenue'), 1, 2, 2, 11, 2),
('https://batdongsan.com.vn/ban-officetel-saigon-royal-10', 'batdongsan.com.vn', 'Officetel Saigon Royal 45m2', 'Officetel tại Saigon Royal, vị trí trung tâm Quận 1, cho thuê dễ dàng', 4500000000.00, 45.0, 1, 1, 1, null, 'Saigon Royal, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7028, 10.7698), 4326), '{"officetel": true, "cho_thuê": "dễ_dàng"}', 4200000000.00, '2024-03-01 10:45:00+07', (SELECT id FROM projects WHERE name = 'Saigon Royal'), 8, 1, 1, 1, 1),
('https://alonhadat.com.vn/nha-mat-tien-quan-5-11', 'alonhadat.com.vn', 'Nhà mặt tiền Quận 5', 'Nhà mặt tiền 4 tầng tại Quận 5, kinh doanh sầm uất, pháp lý đầy đủ', 15000000000.00, 100.0, 4, 3, 4, 5.0, '987 Trần Hưng Đạo, Phường 1, Quận 5', ST_SetSRID(ST_MakePoint(106.6831, 10.7594), 4326), '{"mặt_tiền": true, "kinh_doanh": "sầm_uất"}', 14200000000.00, '2024-03-05 14:20:00+07', null, 17, 1, 3, null, 5),
('https://nhadat24h.net/ban-can-ho-eco-green-saigon-12', 'nhadat24h.net', 'Căn hộ 2PN Eco Green Saigon', 'Căn hộ 2 phòng ngủ tại Eco Green Saigon, môi trường xanh, tiện ích đầy đủ', 4800000000.00, 70.0, 2, 2, 1, null, 'Eco Green Saigon, Phường Tân Phú, Quận 7', ST_SetSRID(ST_MakePoint(106.7156, 10.7411), 4326), '{"môi_trường": "xanh", "tiện_ích": "đầy_đủ"}', 4500000000.00, '2024-03-10 09:15:00+07', (SELECT id FROM projects WHERE name = 'Eco Green Saigon'), 1, 2, 2, null, 7),
('https://batdongsan.com.vn/ban-biet-thu-diamond-island-13', 'batdongsan.com.vn', 'Biệt thự Diamond Island 400m2', 'Biệt thự siêu sang tại Diamond Island, view sông 3 mặt, thiết kế hiện đại', 120000000000.00, 400.0, 6, 5, 3, 15.0, 'Diamond Island, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7125, 10.7598), 4326), '{"view": "sông_3_mặt", "thiết_kế": "hiện_đại", "siêu_sang": true}', 115000000000.00, '2024-03-15 16:45:00+07', (SELECT id FROM projects WHERE name = 'Diamond Island'), 3, 1, 1, 13, 13),
('https://alonhadat.com.vn/nha-hem-quan-10-14', 'alonhadat.com.vn', 'Nhà hẻm Quận 10', 'Nhà 3 tầng trong hẻm Quận 10, an ninh tốt, giá hợp lý', 8500000000.00, 65.0, 3, 2, 3, 3.5, '159 Sư Vạn Hạnh, Phường 12, Quận 10', ST_SetSRID(ST_MakePoint(106.6736, 10.7731), 4326), '{"hẻm": true, "an_ninh": "tốt"}', 8000000000.00, '2024-03-20 11:30:00+07', null, 18, 1, 4, null, 10),
('https://nhadat24h.net/ban-can-ho-gateway-thao-dien-15', 'nhadat24h.net', 'Căn hộ 3PN Gateway Thảo Điền', 'Căn hộ 3 phòng ngủ Gateway Thảo Điền, phong cách Singapore, view đẹp', 8500000000.00, 110.0, 3, 2, 1, null, 'Gateway Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7425, 10.8025), 4326), '{"phong_cách": "Singapore", "view": "đẹp"}', 8000000000.00, '2024-03-25 13:15:00+07', (SELECT id FROM projects WHERE name = 'Gateway Thảo Điền'), 1, 1, 1, 18, 2),
('https://batdongsan.com.vn/ban-studio-estella-heights-16', 'batdongsan.com.vn', 'Studio Estella Heights 35m2', 'Studio tại Estella Heights, thiết kế thông minh, phù hợp cho người độc thân', 2800000000.00, 35.0, 1, 1, 1, null, 'Estella Heights, Phường An Phú, Quận 2', ST_SetSRID(ST_MakePoint(106.7469, 10.8058), 4326), '{"studio": true, "thiết_kế": "thông_minh"}', 2600000000.00, '2024-03-30 08:45:00+07', (SELECT id FROM projects WHERE name = 'Estella Heights'), 10, 2, 2, 11, 2),
('https://alonhadat.com.vn/nha-lien-ke-quan-7-17', 'alonhadat.com.vn', 'Nhà liền kề Sunrise City', 'Nhà liền kề 4 tầng tại Sunrise City, khu an ninh, tiện ích đầy đủ', 22000000000.00, 180.0, 4, 3, 4, 6.0, 'Sunrise City, Phường Tân Hưng, Quận 7', ST_SetSRID(ST_MakePoint(106.7089, 10.7356), 4326), '{"liền_kề": true, "an_ninh": true, "tiện_ích": "đầy_đủ"}', 21000000000.00, '2024-04-01 15:30:00+07', (SELECT id FROM projects WHERE name = 'Sunrise City'), 20, 1, 1, null, 7),
('https://nhadat24h.net/ban-can-ho-midtown-sakura-18', 'nhadat24h.net', 'Căn hộ 2PN Midtown Sakura Park', 'Căn hộ 2 phòng ngủ phong cách Nhật Bản, nội thất gỗ tự nhiên', 6200000000.00, 85.0, 2, 2, 1, null, 'Midtown Sakura Park, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6978, 10.7298), 4326), '{"phong_cách": "Nhật_Bản", "nội_thất": "gỗ_tự_nhiên"}', 5800000000.00, '2024-04-05 12:00:00+07', (SELECT id FROM projects WHERE name = 'Midtown Sakura Park'), 1, 2, 2, null, 7),
('https://batdongsan.com.vn/ban-penthouse-metropole-thu-thiem-19', 'batdongsan.com.vn', 'Penthouse The Metropole Thủ Thiêm', 'Penthouse siêu sang tại The Metropole Thủ Thiêm, view panorama tuyệt đẹp', 180000000000.00, 350.0, 5, 4, 2, null, 'The Metropole Thủ Thiêm, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7278, 10.7889), 4326), '{"penthouse": true, "view": "panorama", "siêu_sang": true}', 175000000000.00, '2024-04-10 10:15:00+07', (SELECT id FROM projects WHERE name = 'The Metropole Thủ Thiêm'), 9, 1, 1, 19, 2),
('https://alonhadat.com.vn/dat-nen-can-gio-20', 'alonhadat.com.vn', 'Đất nền Cần Giờ view biển', 'Lô đất nền tại Cần Giờ, view biển đẹp, tiềm năng phát triển cao', 3500000000.00, 500.0, null, null, null, 20.0, 'Xã Bình Khánh, Huyện Cần Giờ', ST_SetSRID(ST_MakePoint(106.8542, 10.4789), 4326), '{"view": "biển", "tiềm_năng": "cao"}', 3200000000.00, '2024-04-15 14:45:00+07', null, 5, 3, 3, null, 19),
('https://nhadat24h.net/ban-duplex-feliz-en-vista-21', 'nhadat24h.net', 'Duplex Feliz En Vista 120m2', 'Căn duplex tại Feliz En Vista, 2 tầng, thiết kế độc đáo', 9500000000.00, 120.0, 3, 2, 2, null, 'Feliz En Vista, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7298, 10.7856), 4326), '{"duplex": true, "thiết_kế": "độc_đáo"}', 9000000000.00, '2024-04-20 09:30:00+07', (SELECT id FROM projects WHERE name = 'Feliz En Vista'), 11, 1, 1, 19, 2),
('https://batdongsan.com.vn/ban-townhouse-empire-city-22', 'batdongsan.com.vn', 'Townhouse Empire City 200m2', 'Townhouse 4 tầng tại Empire City, view sông, thiết kế hiện đại', 35000000000.00, 200.0, 4, 3, 4, 8.0, 'Empire City, Phường Thủ Thiêm, Quận 2', ST_SetSRID(ST_MakePoint(106.7312, 10.7823), 4326), '{"townhouse": true, "view": "sông", "thiết_kế": "hiện_đại"}', 33000000000.00, '2024-04-25 16:20:00+07', (SELECT id FROM projects WHERE name = 'Empire City'), 12, 1, 1, 19, 2),
('https://alonhadat.com.vn/can-ho-dich-vu-quan-1-23', 'alonhadat.com.vn', 'Căn hộ dịch vụ Quận 1', 'Căn hộ dịch vụ tại trung tâm Quận 1, đầy đủ tiện nghi, cho thuê cao', 6800000000.00, 50.0, 1, 1, 1, null, '789 Đồng Khởi, Phường Bến Nghé, Quận 1', ST_SetSRID(ST_MakePoint(106.7025, 10.7756), 4326), '{"dịch_vụ": true, "tiện_nghi": "đầy_đủ", "cho_thuê": "cao"}', 6500000000.00, '2024-04-30 11:45:00+07', null, 16, 1, 1, 1, 1),
('https://nhadat24h.net/ban-villa-serenity-sky-24', 'nhadat24h.net', 'Sky Villa Serenity Sky Villas', 'Sky Villa tại Serenity Sky Villas, tầng cao, sân vườn trên không', 75000000000.00, 280.0, 4, 3, 2, null, 'Serenity Sky Villas, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6989, 10.7312), 4326), '{"sky_villa": true, "sân_vườn": "trên_không"}', 72000000000.00, '2024-05-01 13:15:00+07', (SELECT id FROM projects WHERE name = 'Serenity Sky Villas'), 13, 1, 1, null, 7);

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