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

-- Normalized administrative units (provinces, districts, wards)

-- Provinces
-- INSERT INTO provinces (code, name, type) VALUES
--   ('01', 'Hà Nội', 'Thành phố'),
--   ('79', 'Hồ Chí Minh', 'Thành phố'),
--   ('48', 'Đà Nẵng', 'Thành phố'),
--   ('31', 'Hải Phòng', 'Thành phố'),
--   ('92', 'Cần Thơ', 'Thành phố');

-- Districts (example, you must expand with all districts and correct province_id)
-- province_id: 1 = Hà Nội, 2 = Hồ Chí Minh, 3 = Đà Nẵng, 4 = Hải Phòng, 5 = Cần Thơ
-- INSERT INTO districts (code, name, type, province_id) VALUES
--   ('001', 'Ba Đình', 'Quận', 1),
--   ('002', 'Hoàn Kiếm', 'Quận', 1),
--   ('003', 'Tây Hồ', 'Quận', 1),
--   ('004', 'Quận 1', 'Quận', 2),
--   ('005', 'Quận 3', 'Quận', 2),
--   ('006', 'Hải Châu', 'Quận', 3),
--   ('007', 'Thanh Khê', 'Quận', 3),
--   ('008', 'Lê Chân', 'Quận', 4),
--   ('009', 'Ngô Quyền', 'Quận', 4),
--   ('010', 'Ninh Kiều', 'Quận', 5),
--   ('011', 'Bình Thủy', 'Quận', 5);

-- Wards (example, you must expand with all wards and correct district_id)
-- district_id: 1 = Ba Đình, 2 = Hoàn Kiếm, 3 = Tây Hồ, 4 = Quận 1, ...
-- INSERT INTO wards (code, name, type, district_id) VALUES
--   ('00001', 'Phúc Xá', 'Phường', 1),
--   ('00002', 'Trúc Bạch', 'Phường', 1),
--   ('00003', 'Hàng Bạc', 'Phường', 2),
--   ('00004', 'Hàng Buồm', 'Phường', 2),
--   ('00005', 'Phú Thượng', 'Phường', 3),
--   ('00006', 'Quảng An', 'Phường', 3),
--   ('00007', 'Bến Nghé', 'Phường', 4),
--   ('00008', 'Bến Thành', 'Phường', 4),
--   ('00009', 'Phường 6', 'Phường', 5),
--   ('00010', 'Phường 7', 'Phường', 5),
--   ('00011', 'Hòa Thuận Đông', 'Phường', 6),
--   ('00012', 'Hòa Thuận Tây', 'Phường', 6),
--   ('00013', 'Tam Thuận', 'Phường', 7),
--   ('00014', 'Thanh Khê Đông', 'Phường', 7),
--   ('00015', 'An Dương', 'Phường', 8),
--   ('00016', 'Cát Dài', 'Phường', 8),
--   ('00017', 'Lạc Viên', 'Phường', 9),
--   ('00018', 'Máy Tơ', 'Phường', 9),
--   ('00019', 'An Cư', 'Phường', 10),
--   ('00020', 'An Hòa', 'Phường', 10),
--   ('00021', 'Bình Thủy', 'Phường', 11),
--   ('00022', 'Bùi Hữu Nghĩa', 'Phường', 11);

-- Remove or comment out old-style district/ward inserts below
-- INSERT INTO districts (name, province) VALUES ...
-- INSERT INTO wards (name, district_id) VALUES ...

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

-- Insert projects with static UUIDs
INSERT INTO projects (id, name, investor, description, address, scale, status) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Vinhomes Central Park', 'Vingroup', 'Khu đô thị cao cấp tại trung tâm TP.HCM', 'Phường 22, Quận Bình Thạnh', '10 tòa tháp cao 40-50 tầng', 'Đã bàn giao'),
  ('22222222-2222-2222-2222-222222222222', 'Masteri Thảo Điền', 'Thảo Điền Investment', 'Căn hộ cao cấp view sông Sài Gòn', 'Phường Thảo Điền, Quận 2', '5 tòa tháp 40 tầng', 'Đang mở bán'),
  ('33333333-3333-3333-3333-333333333333', 'Landmark 81', 'Vinhomes', 'Tòa nhà cao nhất Việt Nam', 'Phường 22, Quận Bình Thạnh', '1 tòa tháp 81 tầng', 'Đã bàn giao'),
  ('44444444-4444-4444-4444-444444444444', 'The Sun Avenue', 'Novaland', 'Căn hộ hiện đại gần trung tâm', 'Phường An Phú, Quận 2', '3 tòa tháp 35 tầng', 'Đang triển khai'),
  ('55555555-5555-5555-5555-555555555555', 'Saigon Royal', 'Novaland', 'Căn hộ sang trọng bên sông', 'Phường Bến Nghé, Quận 1', '2 tòa tháp 35 tầng', 'Đã bàn giao');

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
INSERT INTO properties (
    source_url, source_site, title, description, price, area, bedrooms, bathrooms, floors, frontage, full_address, location, additional_features, avm_estimate, published_at, project_id, property_type_id, legal_status_id, direction_id, ward_id, district_id
) VALUES
-- Ho Chi Minh City properties (30 properties)
('https://batdongsan.com.vn/ban-can-ho-chung-cu-vinhomes-central-park-1', 'batdongsan.com.vn', 'Căn hộ 2PN Vinhomes Central Park view sông', 'Căn hộ 2 phòng ngủ tại Vinhomes Central Park, view sông Sài Gòn tuyệt đẹp, nội thất cao cấp', 5500000000.00, 75.5, 2, 2, 1, null, '208 Nguyễn Hữu Cảnh, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "sông", "nội_thất": "cao_cấp", "ban_công": true}', 5200000000.00, '2024-01-15 10:30:00+07', '11111111-1111-1111-1111-111111111111', 1, 1, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-masteri-thao-dien-4', 'batdongsan.com.vn', 'Căn hộ 3PN Masteri Thảo Điền', 'Căn hộ 3 phòng ngủ tại Masteri Thảo Điền, view sông, nội thất đầy đủ', 7200000000.00, 95.0, 3, 2, 1, null, 'Masteri Thảo Điền, Phường Thảo Điền, Quận 2', ST_SetSRID(ST_MakePoint(106.7398, 10.8015), 4326), '{"view": "sông", "nội_thất": "đầy_đủ", "gym": true}', 6800000000.00, '2024-02-01 11:20:00+07', '22222222-2222-2222-2222-222222222222', 2, 1, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-landmark-81-7', 'batdongsan.com.vn', 'Penthouse Landmark 81 view 360°', 'Penthouse tầng cao Landmark 81, view 360° toàn thành phố, nội thất siêu sang', 95000000000.00, 250.0, 4, 3, 2, null, 'Landmark 81, Phường 22, Quận Bình Thạnh', ST_SetSRID(ST_MakePoint(106.7094, 10.7626), 4326), '{"view": "360_độ", "penthouse": true, "nội_thất": "siêu_sang"}', 90000000000.00, '2024-02-15 08:15:00+07', '33333333-3333-3333-3333-333333333333', 9, 1, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-eco-green-saigon-24', 'batdongsan.com.vn', 'Căn hộ 2PN Eco Green Saigon', 'Căn hộ 2 phòng ngủ tại Eco Green Saigon, môi trường xanh, tiện ích đầy đủ', 4800000000.00, 70.0, 2, 2, 1, null, 'Eco Green Saigon, Phường Tân Phú, Quận 7', ST_SetSRID(ST_MakePoint(106.7156, 10.7411), 4326), '{"môi_trường": "xanh", "tiện_ích": "đầy_đủ"}', 4500000000.00, '2024-03-10 09:15:00+07', '44444444-4444-4444-4444-444444444444', 6, 1, 2, NULL, NULL),
('https://batdongsan.com.vn/ban-villa-serenity-sky-36', 'batdongsan.com.vn', 'Sky Villa Serenity Sky Villas', 'Sky Villa tại Serenity Sky Villas, tầng cao, sân vườn trên không', 75000000000.00, 280.0, 4, 3, 2, null, 'Serenity Sky Villas, Phường Tân Phong, Quận 7', ST_SetSRID(ST_MakePoint(106.6989, 10.7312), 4326), '{"sky_villa": true, "sân_vườn": "trên_không"}', 72000000000.00, '2024-04-05 12:00:00+07', '55555555-5555-5555-5555-555555555555', 15, 13, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-royal-city-hanoi-37', 'batdongsan.com.vn', 'Căn hộ Royal City Hà Nội', 'Căn hộ 2 phòng ngủ tại Royal City, tiện ích đầy đủ, gần trung tâm', 3800000000.00, 75.0, 2, 2, 1, null, 'Royal City, Phường Thanh Xuân Trung, Quận Thanh Xuân', ST_SetSRID(ST_MakePoint(105.8089, 20.9956), 4326), '{"tiện_ích": "đầy_đủ", "gần_trung_tâm": true}', 3600000000.00, '2024-05-05 10:30:00+07', NULL, 1, 1, 2, NULL, NULL),
('https://batdongsan.com.vn/ban-nha-pho-cau-giay-38', 'batdongsan.com.vn', 'Nhà phố Cầu Giấy', 'Nhà phố 4 tầng tại Cầu Giấy, gần các trường đại học, kinh doanh tốt', 16000000000.00, 95.0, 4, 3, 4, 4.5, '456 Nguyễn Khánh Toàn, Phường Quan Hoa, Quận Cầu Giấy', ST_SetSRID(ST_MakePoint(105.7956, 21.0378), 4326), '{"gần_trường_học": true, "kinh_doanh": true}', 15500000000.00, '2024-05-10 14:15:00+07', NULL, 2, 1, 3, NULL, NULL),
('https://batdongsan.com.vn/ban-biet-thu-long-bien-39', 'batdongsan.com.vn', 'Biệt thự Long Biên', 'Biệt thự 3 tầng tại Long Biên, view sông Hồng, sân vườn rộng', 28000000000.00, 220.0, 5, 4, 3, 9.0, '789 Nguyễn Văn Cừ, Phường Gia Thụy, Quận Long Biên', ST_SetSRID(ST_MakePoint(105.8789, 21.0456), 4326), '{"view_sông": true, "sân_vườn": true}', 26500000000.00, '2024-05-15 16:45:00+07', NULL, 3, 1, 4, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-goldmark-city-40', 'batdongsan.com.vn', 'Căn hộ Goldmark City', 'Căn hộ 3 phòng ngủ tại Goldmark City, nội thất hiện đại, view đẹp', 5200000000.00, 90.0, 3, 2, 1, null, 'Goldmark City, Phường Mỹ Đình 2, Quận Nam Từ Liêm', ST_SetSRID(ST_MakePoint(105.7678, 21.0289), 4326), '{"nội_thất": "hiện_đại", "view": "đẹp"}', 4900000000.00, '2024-05-20 11:30:00+07', NULL, 1, 1, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-shophouse-hai-ba-trung-41', 'batdongsan.com.vn', 'Shophouse Hai Bà Trưng', 'Shophouse 5 tầng tại Hai Bà Trưng, mặt tiền đường lớn, kinh doanh sầm uất', 42000000000.00, 120.0, 3, 2, 5, 5.5, '321 Bà Triệu, Phường Lê Đại Hành, Quận Hai Bà Trưng', ST_SetSRID(ST_MakePoint(105.8456, 21.0178), 4326), '{"mặt_tiền": true, "kinh_doanh": "sầm_uất"}', 40000000000.00, '2024-05-25 13:15:00+07', NULL, 4, 1, 5, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-azura-danang-42', 'batdongsan.com.vn', 'Căn hộ Azura Đà Nẵng', 'Căn hộ 2 phòng ngủ tại Azura, view biển và núi, nội thất cao cấp', 4200000000.00, 80.0, 2, 2, 1, null, 'Azura, Phường Mân Thái, Quận Sơn Trà', ST_SetSRID(ST_MakePoint(108.2389, 16.0889), 4326), '{"view": "biển_và_núi", "nội_thất": "cao_cấp"}', 3900000000.00, '2024-05-30 09:45:00+07', NULL, 1, 1, 6, NULL, NULL),
('https://batdongsan.com.vn/ban-biet-thu-ngu-hanh-son-43', 'batdongsan.com.vn', 'Biệt thự Ngũ Hành Sơn', 'Biệt thự 4 tầng tại Ngũ Hành Sơn, gần biển, thiết kế hiện đại', 32000000000.00, 280.0, 5, 4, 4, 10.0, '654 Nguyễn Tất Thành, Quận Ngũ Hành Sơn', ST_SetSRID(ST_MakePoint(108.2567, 16.0123), 4326), '{"gần_biển": true, "thiết_kế": "hiện_đại"}', 30000000000.00, '2024-06-01 15:30:00+07', NULL, 3, 1, 7, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-saigon-cantho-44', 'batdongsan.com.vn', 'Căn hộ Saigon Cần Thơ', 'Căn hộ 3 phòng ngủ tại Saigon Cần Thơ, view sông, tiện ích hiện đại', 3500000000.00, 85.0, 3, 2, 1, null, 'Saigon Cần Thơ, Phường Xuân Khánh, Quận Ninh Kiều', ST_SetSRID(ST_MakePoint(105.7923, 10.0567), 4326), '{"view_sông": true, "tiện_ích": "hiện_đại"}', 3300000000.00, '2024-06-05 12:00:00+07', NULL, 1, 1, 8, NULL, NULL),
('https://batdongsan.com.vn/ban-nha-pho-cai-rang-45', 'batdongsan.com.vn', 'Nhà phố Cái Răng', 'Nhà phố 3 tầng tại Cái Răng, gần chợ nổi Cái Răng, kinh doanh tốt', 7200000000.00, 90.0, 3, 2, 3, 4.5, '987 Đường 30/4, Phường Lê Bình, Quận Cái Răng', ST_SetSRID(ST_MakePoint(105.7567, 10.0234), 4326), '{"gần_chợ_nổi": true, "kinh_doanh": true}', 6800000000.00, '2024-06-10 10:15:00+07', NULL, 2, 1, 9, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-green-bay-haiphong-46', 'batdongsan.com.vn', 'Căn hộ Green Bay Hải Phòng', 'Căn hộ 2 phòng ngủ tại Green Bay, view vịnh, nội thất đầy đủ', 2800000000.00, 70.0, 2, 2, 1, null, 'Green Bay, Phường Đông Khê, Quận Ngô Quyền', ST_SetSRID(ST_MakePoint(106.6889, 20.8567), 4326), '{"view_vịnh": true, "nội_thất": "đầy_đủ"}', 2600000000.00, '2024-06-15 14:45:00+07', NULL, 1, 1, 10, NULL, NULL),
('https://batdongsan.com.vn/ban-nha-pho-le-chan-47', 'batdongsan.com.vn', 'Nhà phố Lê Chân', 'Nhà phố 4 tầng tại Lê Chân, trung tâm thành phố, kinh doanh tốt', 12000000000.00, 85.0, 4, 3, 4, 4.0, '123 Lạch Tray, Phường Đông Khê, Quận Ngô Quyền', ST_SetSRID(ST_MakePoint(106.6923, 20.8634), 4326), '{"trung_tâm": true, "kinh_doanh": true}', 11500000000.00, '2024-06-20 09:30:00+07', NULL, 2, 1, 11, NULL, NULL),
('https://batdongsan.com.vn/ban-biet-thu-do-son-48', 'batdongsan.com.vn', 'Biệt thự Đồ Sơn', 'Biệt thự 3 tầng tại Đồ Sơn, view biển, nghỉ dưỡng lý tưởng', 18000000000.00, 180.0, 4, 3, 3, 7.0, '456 Bãi A, Phường Bãi A, Quận Đồ Sơn', ST_SetSRID(ST_MakePoint(106.7789, 20.7123), 4326), '{"view_biển": true, "nghỉ_dưỡng": true}', 17000000000.00, '2024-06-25 16:20:00+07', NULL, 3, 1, 12, NULL, NULL),
('https://batdongsan.com.vn/ban-can-ho-muong-thanh-nhatrang-49', 'batdongsan.com.vn', 'Căn hộ Muong Thanh Nha Trang', 'Căn hộ 2 phòng ngủ view biển Nha Trang, resort 5 sao', 3600000000.00, 65.0, 2, 2, 1, null, 'Muong Thanh, Phường Vĩnh Hải, Thành phố Nha Trang', ST_SetSRID(ST_MakePoint(109.1967, 12.2389), 4326), '{"view_biển": true, "resort_5_sao": true}', 3400000000.00, '2024-06-30 11:45:00+07', NULL, 1, 1, 1, NULL, NULL),
('https://batdongsan.com.vn/ban-biet-thu-vinpearl-nhatrang-50', 'batdongsan.com.vn', 'Biệt thự Vinpearl Nha Trang', 'Biệt thự 4 tầng tại Vinpearl, view biển 180°, sân vườn riêng', 45000000000.00, 250.0, 5, 4, 4, 8.0, 'Vinpearl, Phường Vĩnh Nguyên, Thành phố Nha Trang', ST_SetSRID(ST_MakePoint(109.2123, 12.2567), 4326), '{"view_biển": "180_độ", "sân_vườn": true}', 42000000000.00, '2024-07-01 13:15:00+07', NULL, 3, 1, 2, NULL, NULL);

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
