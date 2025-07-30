# Thiết kế Cơ sở dữ liệu: Nền tảng Phân tích Bất động sản

## Mục lục

### 1. [Bảng `users` (Người dùng)](#1-bảng-users-người-dùng)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ)

### 2. [Bảng `projects` (Dự án Bất động sản)](#2-bảng-projects-dự-án-bất-động-sản)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-1)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-1)

### 3. [Bảng `properties` (Bất động sản)](#3-bảng-properties-bất-động-sản)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-2)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-2)

### 4. [Bảng `price_history` (Lịch sử giá)](#4-bảng-price_history-lịch-sử-giá)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-3)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-3)

### 5. [Bảng `property_images` (Hình ảnh Bất động sản)](#5-bảng-property_images-hình-ảnh-bất-động-sản)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-4)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-4)

### 6. [Bảng `valuations` (Định giá thủ công)](#6-bảng-valuations-định-giá-thủ-công)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-5)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-5)

### 7. [Bảng `user_favorites` (Bất động sản yêu thích)](#7-bảng-user_favorites-bất-động-sản-yêu-thích)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-6)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-6)

### 8. [Bảng `ml_models` (Quản lý Mô hình Machine Learning)](#8-bảng-ml_models-quản-lý-mô-hình-machine-learning)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-7)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-7)

### 9. [Bảng `estimation_logs` (Nhật ký Ước tính giá)](#9-bảng-estimation_logs-nhật-ký-ước-tính-giá)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-8)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-8)

### 10. [Bảng `property_types` (Loại hình Bất động sản)](#10-bảng-property_types-loại-hình-bất-động-sản)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-9)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-9)

### 11. [Bảng `legal_statuses` (Tình trạng pháp lý)](#11-bảng-legal_statuses-tình-trạng-pháp-lý)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-10)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-10)

### 12. [Bảng `directions` (Hướng)](#12-bảng-directions-hướng)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-11)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-11)

### 13. [Bảng `districts` (Quận/Huyện)](#13-bảng-districts-quậnhuyện)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-12)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-12)

### 14. [Bảng `wards` (Phường/Xã)](#14-bảng-wards-phườngxã)
- [Chính sách Bảo mật Hàng (Row-Level Security - RLS)](#chính-sách-bảo-mật-hàng-row-level-security---rls-13)
- [Cấu trúc bảng và mối quan hệ](#cấu-trúc-bảng-và-mối-quan-hệ-13)

---

## 1. Bảng `users` (Người dùng)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Users can see and manage their own data." (Người dùng có thể xem và quản lý dữ liệu của chính họ).
>
> **Quy tắc:**
> - **SELECT, UPDATE, DELETE:** Người dùng chỉ có thể thực hiện các hành động này trên hàng dữ liệu có `id` trùng với `user_id` hiện tại của phiên làm việc.
> - **INSERT:** Người dùng mới có thể tạo tài khoản cho chính mình.
>
> **Mục đích:** Đảm bảo người dùng không thể xem hay chỉnh sửa thông tin của người dùng khác, bảo vệ quyền riêng tư tuyệt đối.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của người dùng, sử dụng định dạng UUID để tăng tính bảo mật. | Tự động tạo khi có người dùng mới đăng ký. | - |
| 2   | `email`                 | `VARCHAR(255), UNIQUE` | Địa chỉ email của người dùng, được sử dụng làm tên đăng nhập. | Bắt buộc, không được trùng lặp trong toàn bộ hệ thống. | - |
| 3   | `hashed_password`       | `VARCHAR(255)`      | Mật khẩu của người dùng sau khi đã được băm bằng một thuật toán mạnh (ví dụ: bcrypt). | Bắt buộc. Không bao giờ lưu mật khẩu dạng văn bản thô. | - |
| 4   | `full_name`             | `VARCHAR(255)`      | Họ và tên đầy đủ của người dùng. | Không bắt buộc, người dùng có thể cập nhật sau. | - |
| 5   | `role`                  | `VARCHAR(50)`       | Vai trò của người dùng để phân quyền trong hệ thống. | Bắt buộc. Mặc định là 'Standard'. Có thể là 'Professional'. | - |
| 6   | `created_at`            | `TIMESTAMPTZ`       | Dấu thời gian chính xác khi tài khoản được tạo, bao gồm cả múi giờ. | Tự động điền giá trị NOW() khi tạo bản ghi. | - |
| 7   | `updated_at`            | `TIMESTAMPTZ`       | Dấu thời gian chính xác khi thông tin tài khoản được cập nhật lần cuối. | Tự động cập nhật mỗi khi có thay đổi trên bản ghi. | - |

## 2. Bảng `projects` (Dự án Bất động sản)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for projects."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng, kể cả khách vãng lai, đều có thể xem thông tin của tất cả các dự án.
> - **INSERT, UPDATE, DELETE:** Bị cấm đối với người dùng cuối. Các hành động này chỉ được phép thực hiện bởi một vai trò dịch vụ (service role) có quyền quản trị.
>
> **Mục đích:** Công khai hóa thông tin dự án nhưng đảm bảo tính toàn vẹn của dữ liệu, chỉ cho phép quản trị viên hoặc hệ thống tự động cập nhật.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của dự án. | Tự động tạo. | - |
| 2   | `name`                  | `TEXT, UNIQUE`      | Tên thương mại đầy đủ và chính thức của dự án. | Bắt buộc, không được trùng lặp. | - |
| 3   | `investor`              | `TEXT`              | Tên của chủ đầu tư dự án. | Không bắt buộc. | - |
| 4   | `description`           | `TEXT`              | Đoạn văn mô tả tổng quan, giới thiệu về các điểm nổi bật của dự án. | Không bắt buộc. | - |
| 5   | `address`               | `TEXT`              | Địa chỉ của dự án (ví dụ: số, tên đường, phường, quận). | Không bắt buộc. | - |
| 6   | `scale`                 | `TEXT`              | Quy mô tổng thể của dự án. | Ví dụ: "Gồm 3 tòa tháp cao 40 tầng, tổng số 1500 căn hộ". | - |
| 7   | `status`                | `VARCHAR(100)`      | Tình trạng hiện tại của dự án. | Ví dụ: 'Đang triển khai', 'Đang mở bán', 'Đã bàn giao'. | - |
| 8   | `created_at`            | `TIMESTAMPTZ`       | Dấu thời gian khi bản ghi về dự án này được tạo trong hệ thống. | Tự động điền. | - |

## 3. Bảng `properties` (Bất động sản)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for properties."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng, kể cả khách vãng lai, đều có thể xem thông tin của tất cả các bất động sản.
> - **INSERT, UPDATE, DELETE:** Bị cấm đối với người dùng cuối. Các hành động này chỉ được phép thực hiện bởi vai trò dịch vụ của hệ thống (ví dụ: scraper).
>
> **Mục đích:** Đảm bảo mọi người có thể tìm kiếm và xem dữ liệu, nhưng chỉ hệ thống mới có quyền thay đổi để duy trì tính toàn vẹn dữ liệu.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của bất động sản. | Tự động tạo. | - |
| 2   | `source_url`            | `TEXT, UNIQUE`      | URL gốc của tin đăng trên trang web nguồn. | Bắt buộc, đảm bảo không thu thập trùng lặp một tin đăng. | - |
| 3   | `source_site`           | `VARCHAR(100)`      | Tên miền của trang web nguồn. | Bắt buộc. Ví dụ: 'batdongsan.com.vn'. | - |
| 4   | `title`                 | `TEXT`              | Tiêu đề của tin đăng, được thu thập từ nguồn. | Bắt buộc. | - |
| 5   | `description`           | `TEXT`              | Nội dung mô tả chi tiết về bất động sản. | Không bắt buộc. | - |
| 6   | `price`                 | `DECIMAL(18, 2)`    | Giá bán hiện tại của bất động sản, tính bằng VNĐ. | Lưu dưới dạng số thập phân để đảm bảo độ chính xác. | Liên kết tới bảng price_history. |
| 7   | `area`                  | `REAL`              | Diện tích của bất động sản, tính bằng mét vuông (m²). | Lưu dưới dạng số thực. | - |
| 8   | `bedrooms`              | `SMALLINT`          | Số lượng phòng ngủ. |  | - |
| 9   | `bathrooms`             | `SMALLINT`          | Số lượng phòng vệ sinh/phòng tắm. |  | - |
| 10  | `floors`                | `SMALLINT`          | Tổng số tầng của bất động sản. |  | - |
| 11  | `frontage`              | `REAL`              | Chiều rộng mặt tiền của bất động sản, tính bằng mét (m). |  | - |
| 12  | `full_address`          | `TEXT`              | Địa chỉ đầy đủ của bất động sản dưới dạng một chuỗi văn bản. |  | - |
| 13  | `location`              | `GEOMETRY(Point, 4326)` | Tọa độ địa lý (kinh độ, vĩ độ) của bất động sản. | Rất quan trọng. Sử dụng tiện ích mở rộng PostGIS để truy vấn không gian. | - |
| 14  | `additional_features`   | `JSONB`             | Lưu các thuộc tính khác, không cố định dưới dạng JSON. | Rất linh hoạt. Ví dụ: {"có_sân_vườn": true, "gần_trường_học": "Đại học Bách Khoa"}. | - |
| 15  | `avm_estimate`          | `DECIMAL(18, 2)`    | Giá trị ước tính từ mô hình AVM của hệ thống. | Được cập nhật định kỳ bởi một tiến trình của backend. | - |
| 16  | `published_at`          | `TIMESTAMPTZ`       | Ngày tin đăng được đăng tải gốc trên trang nguồn. |  | - |
| 17  | `last_scraped_at`       | `TIMESTAMPTZ`       | Lần cuối cùng scraper ghé thăm và cập nhật thông tin cho tin đăng này. | Tự động cập nhật mỗi khi scraper chạy. | - |
| 18  | `project_id`            | `UUID, FK`          | Khóa ngoại liên kết tới dự án mà bất động sản này thuộc về. | Cho phép giá trị NULL nếu là nhà riêng lẻ, không thuộc dự án nào. | properties.project_id -> projects.id |
| 19  | `property_type_id`      | `INT, FK`           | Khóa ngoại liên kết tới loại hình bất động sản. | Bắt buộc. | properties.property_type_id -> property_types.id |
| 20  | `legal_status_id`       | `INT, FK`           | Khóa ngoại liên kết tới tình trạng pháp lý. | Không bắt buộc. | properties.legal_status_id -> legal_statuses.id |
| 21  | `direction_id`          | `INT, FK`           | Khóa ngoại liên kết tới hướng nhà/hướng ban công. | Không bắt buộc. | properties.direction_id -> directions.id |
| 22  | `ward_id`               | `INT, FK`           | Khóa ngoại liên kết tới phường/xã. | Không bắt buộc. | properties.ward_id -> wards.id |
| 23  | `district_id`           | `INT, FK`           | Khóa ngoại liên kết tới quận/huyện. | Bắt buộc để lọc theo khu vực. | properties.district_id -> districts.id |

## 4. Bảng `price_history` (Lịch sử giá)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for price history."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng đều có thể xem được lịch sử giá.
> - **INSERT, UPDATE, DELETE:** Chỉ được phép thực hiện bởi vai trò dịch vụ của hệ thống (scraper).
>
> **Mục đích:** Minh bạch hóa sự biến động giá của bất động sản cho người dùng, đồng thời bảo vệ dữ liệu lịch sử khỏi các thay đổi trái phép.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của bản ghi lịch sử giá. | Tự động tạo. | - |
| 2   | `price`                 | `DECIMAL(18, 2)`    | Mức giá của bất động sản tại thời điểm được ghi nhận. | Bắt buộc. | - |
| 3   | `changed_at`            | `TIMESTAMPTZ`       | Thời điểm chính xác scraper phát hiện có sự thay đổi về giá. | Tự động điền. | - |
| 4   | `property_id`           | `UUID, FK`          | Khóa ngoại liên kết tới bất động sản có sự thay đổi giá. | Bắt buộc. ON DELETE CASCADE để xóa lịch sử nếu BĐS bị xóa. | price_history.property_id -> properties.id |

## 5. Bảng `property_images` (Hình ảnh Bất động sản)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for images."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng đều có thể xem hình ảnh.
> - **INSERT, UPDATE, DELETE:** Chỉ được phép thực hiện bởi vai trò dịch vụ của hệ thống (scraper).
>
> **Mục đích:** Cho phép hiển thị hình ảnh công khai trên giao diện người dùng và bảo vệ nguồn dữ liệu.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của bản ghi hình ảnh. | Tự động tạo. | - |
| 2   | `image_url`             | `TEXT`              | URL đầy đủ của tệp hình ảnh được lưu trữ. | Bắt buộc. | - |
| 3   | `is_thumbnail`          | `BOOLEAN`           | Đánh dấu đây có phải là ảnh đại diện (thumbnail) cho tin đăng hay không. | Mặc định là FALSE. | - |
| 4   | `property_id`           | `UUID, FK`          | Khóa ngoại liên kết tới bất động sản sở hữu hình ảnh này. | Bắt buộc. ON DELETE CASCADE. | property_images.property_id -> properties.id |

## 6. Bảng `valuations` (Định giá thủ công)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Professionals can add valuations; all can view results."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng đều có thể xem các kết quả định giá đã được thực hiện để tham khảo.
> - **INSERT, UPDATE:** Chỉ người dùng có vai trò 'Professional' mới có thể tạo hoặc sửa định giá của chính họ.
> - **DELETE:** Chỉ người dùng tạo ra định giá mới có quyền xóa nó.
>
> **Mục đích:** Cho phép các chuyên gia đóng góp chuyên môn, đồng thời chia sẻ kết quả đó với cộng đồng nhưng vẫn đảm bảo chỉ tác giả mới có quyền thay đổi.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của một lần định giá. | Tự động tạo. | - |
| 2   | `value`                 | `DECIMAL(18, 2)`    | Giá trị của bất động sản do người dùng chuyên nghiệp nhập vào. | Bắt buộc. | - |
| 3   | `avm_value_at_valuation`| `DECIMAL(18, 2)`    | Giá trị AVM của BĐS tại thời điểm định giá. | Dùng để so sánh, phân tích độ lệch giữa máy và người. | - |
| 4   | `notes`                 | `TEXT`              | Ghi chú, lý giải, hoặc bình luận chi tiết của thẩm định viên về mức giá họ đưa ra. | Không bắt buộc. | - |
| 5   | `created_at`            | `TIMESTAMPTZ`       | Thời điểm chính xác lần định giá này được thực hiện. | Tự động điền. | - |
| 6   | `property_id`           | `UUID, FK`          | Khóa ngoại liên kết tới bất động sản được định giá. | Bắt buộc. ON DELETE CASCADE. | valuations.property_id -> properties.id |
| 7   | `user_id`               | `UUID, FK`          | Khóa ngoại liên kết tới người dùng (vai trò 'Professional') đã thực hiện định giá. | Bắt buộc. | valuations.user_id -> users.id |

## 7. Bảng `user_favorites` (Bất động sản yêu thích)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Users can only manage their own list of favorites."
>
> **Quy tắc:**
> - **SELECT, INSERT, DELETE:** Người dùng chỉ có thể thực hiện các hành động này trên các hàng có `user_id` trùng với `user_id` hiện tại của phiên làm việc.
>
> **Mục đích:** Đảm bảo danh sách yêu thích của mỗi người dùng là riêng tư.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `user_id`               | `UUID, PK, FK`      | Khóa ngoại liên kết tới người dùng đã bấm yêu thích. | Là một phần của khóa chính kết hợp. | user_favorites.user_id -> users.id |
| 2   | `property_id`           | `UUID, PK, FK`      | Khóa ngoại liên kết tới bất động sản được yêu thích. | Là một phần của khóa chính kết hợp. | user_favorites.property_id -> properties.id |
| 3   | `created_at`            | `TIMESTAMPTZ`       | Thời điểm chính xác người dùng bấm nút yêu thích. | Tự động điền. | - |

## 8. Bảng `ml_models` (Quản lý Mô hình Machine Learning)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Read-only for services, restricted writes for admins."
>
> **Quy tắc:**
> - **SELECT:** Dịch vụ backend có thể đọc tất cả các phiên bản để chọn mô hình đang hoạt động (`is_active = TRUE`).
> - **INSERT, UPDATE, DELETE:** Bị cấm đối với người dùng cuối và các dịch vụ thông thường. Chỉ cho phép thực hiện bởi một vai trò đặc biệt, ví dụ 'ml_admin'.
>
> **Mục đích:** Bảo vệ tài sản trí tuệ và sự ổn định của hệ thống định giá, đảm bảo chỉ những người có chuyên môn mới có thể thay đổi các phiên bản mô hình.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của một phiên bản mô hình. | Tự động tạo. | - |
| 2   | `version`               | `VARCHAR(50), UNIQUE` | Tên phiên bản của mô hình theo chuẩn semantic versioning (ví dụ: '1.0.0', '1.1.0-beta'). | Bắt buộc. | - |
| 3   | `model_file_path`       | `TEXT`              | Đường dẫn tới tệp mô hình đã được huấn luyện và lưu trữ (ví dụ: trên S3, GCS). | Bắt buộc. Ví dụ: 's3://my-models-bucket/avm-v1.1.0.pkl'. | - |
| 4   | `performance_metrics`   | `JSONB`             | Các chỉ số đo lường hiệu suất của mô hình sau khi huấn luyện. | Lưu dưới dạng JSON. Ví dụ: {"mae": 500000000, "mape": 0.08, "r2_score": 0.85}. | - |
| 5   | `is_active`             | `BOOLEAN`           | Đánh dấu đây có phải là phiên bản đang được sử dụng chính thức trên hệ thống hay không. | Bắt buộc. Chỉ nên có một phiên bản có giá trị TRUE. | - |
| 6   | `training_notes`        | `TEXT`              | Ghi chú chi tiết về quá trình huấn luyện mô hình này. | Ví dụ: "Sử dụng dữ liệu từ Q1/2025, loại bỏ các BĐS > 100 tỷ, áp dụng feature engineering mới". | - |
| 7   | `created_at`            | `TIMESTAMPTZ`       | Thời gian mô hình được huấn luyện xong và lưu vào hệ thống. | Tự động điền. | - |

## 9. Bảng `estimation_logs` (Nhật ký Ước tính giá)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Users can only view their own estimation history."
>
> **Quy tắc:**
> - **SELECT:** Người dùng chỉ có thể xem các hàng có `user_id` trùng với `user_id` hiện tại của phiên làm việc.
> - **INSERT:** Chỉ được phép thực hiện bởi vai trò dịch vụ của backend khi có yêu cầu từ người dùng.
> - **UPDATE, DELETE:** Bị cấm để đảm bảo tính toàn vẹn của nhật ký.
>
> **Mục đích:** Cho phép người dùng xem lại lịch sử của mình mà không để lộ thông tin cho người khác, đồng thời thu thập dữ liệu quý giá cho việc phân tích.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `UUID, PK`          | Khóa chính duy nhất của một lần yêu cầu ước tính. | Tự động tạo. | - |
| 2   | `input_features`        | `JSONB`             | Dữ liệu đầu vào chính xác mà người dùng đã cung cấp để ước tính. | Bắt buộc. Lưu dưới dạng JSON. Ví dụ: {"area": 55, "latitude": 21.02, "longitude": 105.8, "bedrooms": 3}. | - |
| 3   | `estimated_price`       | `DECIMAL(18, 2)`    | Giá trị mà mô hình đã trả về cho người dùng. | Bắt buộc. | - |
| 4   | `created_at`            | `TIMESTAMPTZ`       | Thời điểm chính xác yêu cầu ước tính được thực hiện. | Tự động điền. | - |
| 5   | `model_id`              | `UUID, FK`          | Khóa ngoại tới phiên bản mô hình đã được dùng để đưa ra ước tính này. | Bắt buộc. | estimation_logs.model_id -> ml_models.id |
| 6   | `user_id`               | `UUID, FK`          | Khóa ngoại tới người dùng đã thực hiện ước tính. | Cho phép giá trị NULL nếu là người dùng vãng lai chưa đăng nhập. | estimation_logs.user_id -> users.id |

## 10. Bảng `property_types` (Loại hình Bất động sản)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for lookup data."
>
> **Quy tắc:**
> - **SELECT:** Mọi người dùng đều có thể đọc.
> - **INSERT, UPDATE, DELETE:** Chỉ được phép thực hiện bởi vai trò quản trị viên CSDL.
>
> **Mục đích:** Cung cấp dữ liệu cho các bộ lọc trên giao diện và đảm bảo tính nhất quán.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú |
|-----|--------------------------|---------------------|-----------|---------|
| 1   | `id`                    | `SERIAL, PK`        | Khóa chính tự tăng. |  |
| 2   | `name`                  | `VARCHAR(100), UNIQUE` | Tên loại hình bất động sản. | Ví dụ: 'Căn hộ chung cư', 'Nhà riêng', 'Biệt thự', 'Shophouse', 'Đất nền', 'Nhà dự án', 'Nhà tập thể', 'Officetel'. |

## 11. Bảng `legal_statuses` (Tình trạng pháp lý)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for lookup data."
>
> **Quy tắc:** Tương tự bảng property_types.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú |
|-----|--------------------------|---------------------|-----------|---------|
| 1   | `id`                    | `SERIAL, PK`        | Khóa chính tự tăng. |  |
| 2   | `name`                  | `VARCHAR(255), UNIQUE` | Tên của tình trạng pháp lý. | Ví dụ: 'Sổ đỏ/Sổ hồng', 'Hợp đồng mua bán', 'Hợp đồng cọc với CĐT', 'Giấy phép xây dựng', 'Đang chờ sổ', 'Vi bằng', 'Giấy tờ tay', 'Đất nông nghiệp', 'Đất thổ cư (chưa sổ)'. |

## 12. Bảng `directions` (Hướng)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for lookup data."
>
> **Quy tắc:** Tương tự bảng property_types.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú |
|-----|--------------------------|---------------------|-----------|---------|
| 1   | `id`                    | `SERIAL, PK`        | Khóa chính tự tăng. |  |
| 2   | `name`                  | `VARCHAR(50), UNIQUE` | Tên của hướng nhà/đất/ban công. | Ví dụ: 'Đông', 'Tây', 'Nam', 'Bắc', 'Đông-Bắc', 'Tây-Bắc', 'Đông-Nam', 'Tây-Nam'. |

## 13. Bảng `districts` (Quận/Huyện)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for lookup data."
>
> **Quy tắc:** Tương tự bảng property_types.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú |
|-----|--------------------------|---------------------|-----------|---------|
| 1   | `id`                    | `SERIAL, PK`        | Khóa chính tự tăng. |  |
| 2   | `name`                  | `VARCHAR(100), UNIQUE` | Tên chính thức của Quận hoặc Huyện. |  |
| 3   | `province`              | `VARCHAR(100)`      | Tên Tỉnh hoặc Thành phố trực thuộc trung ương. |  |

## 14. Bảng `wards` (Phường/Xã)

> **Chính sách Bảo mật Hàng (Row-Level Security - RLS):**
>
> **Tên chính sách:** "Public read-only access for lookup data."
>
> **Quy tắc:** Tương tự bảng property_types.

| STT | Trường thông tin (Field) | Kiểu dữ liệu & Khóa | Diễn giải | Ghi chú | Mối quan hệ |
|-----|--------------------------|---------------------|-----------|---------|-------------|
| 1   | `id`                    | `SERIAL, PK`        | Khóa chính tự tăng. |  | - |
| 2   | `name`                  | `VARCHAR(100)`      | Tên chính thức của Phường hoặc Xã. |  | - |
| 3   | `district_id`           | `INT, FK`           | Khóa ngoại liên kết tới Quận/Huyện mà Phường/Xã này thuộc về. | Bắt buộc. | wards.district_id -> districts.id |

# Address Normalization and Conversion (2025+)

## Database Changes
- Existing columns: `province`, `district`, `ward`, `street`, ... (current structure)
- New columns (for post-1/7/2025 structure):
  - `province_new` (TEXT, nullable)
  - `ward_new` (TEXT, nullable)
  - `street_new` (TEXT, nullable)

## Workflow
1. Extract address compartments (ward, district, province, street) using regex and/or Firecrawl AI.
2. If any compartment is missing or ambiguous:
   - Use tinhthanhpho.com API to look up missing info by ward/district/province name.
   - Fill in missing address fields.
3. Call `/api/v1/convert/address` with the codes to get the new address structure.
4. Insert all address fields (current and new) into the DB.

## API Reference
- [TinhThanhPho.com API Docs](https://tinhthanhpho.com/api-docs#introduction)

