# Tài liệu Yêu cầu Sản phẩm: Nền tảng Phân tích Bất động sản

**Phiên bản:** 2.2 (Thiết kế API chi tiết)  
**Ngày:** 7 tháng 7, 2025  
**Tác giả:** Coding Partner  
**Tình trạng:** Hoàn thiện

## 1. Giới thiệu

Tài liệu này phác thảo các yêu cầu về chức năng và kỹ thuật cho Nền tảng Phân tích Bất động sản. Mục tiêu chính của nền tảng là trao quyền cho người dùng—từ người mua và bán cá nhân đến các chuyên viên ngân hàng và thẩm định viên chuyên nghiệp—với những hiểu biết toàn diện, dựa trên dữ liệu về thị trường bất động sản Việt Nam.

Hệ thống sẽ đạt được điều này bằng cách:

- Tổng hợp dữ liệu một cách có đạo đức và mạnh mẽ từ các trang web bất động sản lớn của Việt Nam, có khả năng xử lý các trang web động, sử dụng JavaScript.
- Làm giàu dữ liệu này bằng các thông tin pháp lý và quy hoạch công khai.
- Cung cấp một công cụ định giá hai chế độ tinh vi, bao gồm Mô hình Định giá Tự động (AVM) dựa trên AI và chức năng cho phép chuyên gia ghi đè thủ công.
- Mang đến các chức năng tìm kiếm nâng cao, so sánh và xuất dữ liệu thông qua một giao diện người dùng hiện đại và sạch sẽ.

Nền tảng này giải quyết nhu cầu thiết yếu của thị trường về dữ liệu bất động sản minh bạch, hợp nhất và thông minh, vượt ra ngoài các danh sách tin đăng đơn giản để cung cấp một nguồn thông tin đáng tin cậy duy nhất cho việc phân tích và định giá tài sản.

## 2. Mục tiêu và Tầm nhìn

### Mục tiêu của Người dùng
Đưa ra quyết định sáng suốt khi mua, bán hoặc phân tích bất động sản bằng cách truy cập dữ liệu toàn diện, ước tính giá dựa trên AI và các so sánh thị trường tại một nơi duy nhất.

### Mục tiêu của Người dùng Chuyên nghiệp
Hợp lý hóa quy trình định giá bằng cách sử dụng AVM làm cơ sở, đồng thời vẫn giữ được khả năng áp dụng đánh giá chuyên môn của mình để đưa ra con số cuối cùng.

### Mục tiêu Kinh doanh
Trở thành nền tảng hàng đầu và đáng tin cậy nhất cho phân tích dữ liệu bất động sản tại Việt Nam bằng cách cung cấp công cụ chính xác và toàn diện nhất trên thị trường.

### Mục tiêu Sản phẩm
Xây dựng một nền tảng có khả năng mở rộng, an toàn và mạnh mẽ, có thể xử lý việc tổng hợp dữ liệu quy mô lớn từ các trang web phức tạp và cung cấp thông tin chi tiết theo thời gian thực do AI hỗ trợ cho người dùng.

## 3. Thiết kế Hệ thống & Kiến trúc

Nền tảng sẽ được xây dựng trên một kiến trúc hiện đại, tách rời (decoupled) để đảm bảo khả năng mở rộng, an toàn và bảo trì.

### 3.1. Thu thập Dữ liệu (Scraping) - Phân tích Kiến trúc Chi tiết

Đây là thành phần quan trọng và phức tạp nhất, đòi hỏi một kiến trúc lai (Hybrid Architecture) để đảm bảo hiệu suất, sự ổn định và khả năng thích ứng lâu dài.

#### 3.1.1. Tổng quan Kiến trúc Scraper

Hệ thống scraping sẽ được xây dựng dựa trên một bộ điều phối trung tâm (Orchestrator) và một bộ công cụ thu thập đa dạng. Bộ điều phối sẽ quyết định sử dụng công cụ nào cho từng tác vụ cụ thể, tối ưu hóa giữa tốc độ và khả năng xử lý.

**Bộ điều phối (Orchestrator):** Scrapy Framework. Scrapy không chỉ là một scraper, mà là một framework hoàn chỉnh, chịu trách nhiệm:

- **Lập lịch và Đồng bộ hóa (Scheduling & Concurrency):** Quản lý hàng đợi các URL cần thu thập, kiểm soát số lượng yêu cầu đồng thời để tối ưu hiệu suất và tránh gây quá tải.
- **Quản lý Middleware:** Xử lý các tác vụ trung gian như xoay vòng proxy, thay đổi User-Agent, và tự động thử lại các yêu cầu thất bại.
- **Item Pipeline:** Một chuỗi các bước xử lý dữ liệu sau khi thu thập, bao gồm làm sạch, chuẩn hóa, xác thực và lưu trữ vào cơ sở dữ liệu.
- **Cơ chế Ra quyết định:** Dựa trên cấu hình cho từng domain, Scrapy sẽ quyết định "giao việc" cho công cụ thu thập phù hợp.

#### 3.1.2. Bộ công cụ Thu thập Dữ liệu

##### A. Requests + BeautifulSoup4 (Trình thu thập Tĩnh - Lightweight Static Scraper)

**Công nghệ:** Thư viện requests để thực hiện các yêu cầu HTTP và BeautifulSoup4 để phân tích cú pháp HTML tĩnh.

**Trường hợp sử dụng:**
- Tốc độ cao nhất: Dành cho các trang web có nội dung được trả về trực tiếp trong mã HTML ban đầu (server-side rendering).
- Tác vụ phụ trợ: Tìm nạp và phân tích các tệp robots.txt và sitemap.xml một cách hiệu quả.

**Ưu điểm:**
- Cực kỳ nhanh: Không cần render trang, chỉ tải và phân tích văn bản.
- Tiêu thụ tài nguyên thấp: Yêu cầu rất ít CPU và bộ nhớ.

**Nhược điểm:**
- Hoàn toàn không thể xử lý nội dung được tạo ra bởi JavaScript phía client.

##### B. Playwright (Trình render Động - Heavy-Duty Dynamic Renderer)

**Công nghệ:** Playwright, một thư viện tự động hóa trình duyệt hiện đại của Microsoft.

**Trường hợp sử dụng:**
- Trang web phức tạp: Dành cho các Single-Page Application (SPA) xây dựng bằng React, Vue, Angular, nơi dữ liệu được tải thông qua các lệnh gọi API sau khi trang đã tải xong.
- Tương tác người dùng: Có khả năng mô phỏng các hành động của người dùng như cuộn trang để tải thêm dữ liệu (infinite scroll), nhấp vào nút để mở popup, hoặc điền vào biểu mẫu.

**Quy trình tích hợp với Scrapy:**
1. Scrapy Downloader Middleware sẽ chặn một yêu cầu được đánh dấu là "động".
2. Middleware này gọi Playwright để mở một trang mới trong một trình duyệt không giao diện (headless Chromium).
3. Playwright điều hướng đến URL, chờ cho đến khi các phần tử dữ liệu quan trọng xuất hiện (`page.wait_for_selector()`) hoặc mạng không còn hoạt động (`page.wait_for_load_state('networkidle')`).
4. Playwright trích xuất mã HTML cuối cùng (`page.content()`) và trả về cho Scrapy.
5. Scrapy Spider tiếp tục phân tích HTML này như bình thường.

**Ưu điểm:**
- Khả năng xử lý tối đa: Có thể thu thập dữ liệu từ bất kỳ trang web nào mà trình duyệt có thể hiển thị.
- Độ tin cậy cao: Cung cấp các cơ chế chờ đợi thông minh, giảm thiểu lỗi do tải trang chậm.

**Nhược điểm:**
- Tiêu thụ tài nguyên cao: Mỗi yêu cầu cần khởi chạy một instance trình duyệt, tốn nhiều CPU và bộ nhớ hơn đáng kể.
- Chậm hơn: Quá trình render làm tăng đáng kể thời gian cho mỗi yêu cầu.

##### C. Puppeteer (Giải pháp thay thế cho Playwright)

> **Ghi chú:** Puppeteer là một thư viện tương tự Playwright, được phát triển bởi Google và cũng rất mạnh mẽ. Việc lựa chọn giữa Playwright và Puppeteer thường phụ thuộc vào sở thích của đội ngũ phát triển. Trong tài liệu này, chúng ta chuẩn hóa việc sử dụng Playwright, nhưng ghi nhận Puppeteer là một giải pháp thay thế hoàn toàn khả thi.

#### 3.1.3. Chiến lược Chống chặn và Đảm bảo Độ bền

**Quản lý Proxy:** Tích hợp một dịch vụ proxy của bên thứ ba (ví dụ: Bright Data, Smartproxy) để có một bể chứa lớn các địa chỉ IP (cả dân cư và trung tâm dữ liệu) và tự động xoay vòng chúng cho mỗi yêu cầu.

**Quản lý Danh tính Trình duyệt:**
- Xoay vòng User-Agent: Duy trì một danh sách các chuỗi User-Agent của các trình duyệt phổ biến và chọn ngẫu nhiên cho mỗi yêu cầu.
- Quản lý Header: Mô phỏng các HTTP header đầy đủ giống như một trình duyệt thực.

**Xử lý CAPTCHA:** Lên kế hoạch cho tương lai bằng cách thiết kế hệ thống để có thể tích hợp các dịch vụ giải CAPTCHA của bên thứ ba (ví dụ: 2Captcha, Anti-CAPTCHA) thông qua một API nếu các trang web mục tiêu bắt đầu triển khai các biện pháp bảo vệ nâng cao.

### 3.2. Cơ sở dữ liệu (Database)

**Công nghệ:** PostgreSQL (Phiên bản 15+) với tiện ích mở rộng PostGIS.

**Lý do:** PostgreSQL cung cấp khả năng lưu trữ mạnh mẽ, tuân thủ ACID. PostGIS là yếu tố quan trọng để thực hiện các truy vấn không gian địa lý hiệu quả.

**Lược đồ (Schema) chính:** Bao gồm các bảng properties, property_images, users, và valuations với các ràng buộc khóa ngoại phù hợp.

### 3.3. Thiết kế Backend chi tiết (API)

**Công nghệ:** FastAPI.

**Tiền tố API:** Tất cả các endpoint sẽ bắt đầu bằng `/api/v1`.

**Xác thực:** Sử dụng JWT (JSON Web Tokens) với luồng OAuth2 Password Flow. Token sẽ được gửi trong header Authorization dưới dạng `Bearer <token>`.

#### 3.3.1. Endpoints Xác thực & Người dùng (Authentication & Users)

##### 1. POST /token

**Mô tả:** Cấp access token cho người dùng đã đăng ký.

**Ủy quyền:** Công khai (Public).

**Request Body:** application/x-www-form-urlencoded
- `username` (str, required): Email của người dùng.
- `password` (str, required): Mật khẩu của người dùng.

**Response (200 OK):**
```json
{
  "access_token": "string",
  "token_type": "bearer"
}
```

**Lỗi:**
- 400 Bad Request: Thiếu username hoặc password.
- 401 Unauthorized: Sai thông tin đăng nhập.

##### 2. POST /users/register

**Mô tả:** Đăng ký một tài khoản người dùng mới.

**Ủy quyền:** Công khai.

**Request Body:** application/json
```json
{
  "email": "user@example.com", // required, valid email format
  "password": "string", // required, min 8 characters
  "full_name": "string" // optional
}
```

**Response (201 Created):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "string",
  "role": "Standard"
}
```

**Lỗi:**
- 400 Bad Request: Dữ liệu không hợp lệ (ví dụ: email sai định dạng, mật khẩu quá ngắn).
- 409 Conflict: Email đã tồn tại.

##### 3. GET /users/me

**Mô tả:** Lấy thông tin của người dùng đang đăng nhập.

**Ủy quyền:** Người dùng đã đăng nhập (Standard, Professional).

**Response (200 OK):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "full_name": "string",
  "role": "Standard" // or "Professional"
}
```

**Lỗi:**
- 401 Unauthorized: Chưa đăng nhập.

#### 3.3.2. Endpoints Bất động sản (Properties)

##### 1. GET /properties

**Mô tả:** Lấy danh sách các bất động sản với bộ lọc và phân trang.

**Ủy quyền:** Công khai.

**Query Parameters:**
- `page` (int, default: 1): Trang hiện tại.
- `size` (int, default: 20, max: 100): Số lượng kết quả mỗi trang.
- `query` (str, optional): Từ khóa tìm kiếm chung (địa chỉ, quận, tên đường).
- `min_price`, `max_price` (float, optional): Lọc theo khoảng giá.
- `min_area`, `max_area` (float, optional): Lọc theo khoảng diện tích.
- `bedrooms` (int, optional): Lọc theo số phòng ngủ chính xác.
- `district` (str, optional): Lọc theo quận/huyện.
- `sort_by` (str, optional, enum: created_at, price, area): Trường để sắp xếp.
- `order` (str, optional, enum: asc, desc, default: desc): Thứ tự sắp xếp.

**Response (200 OK):**
```json
{
  "total": 1234,
  "page": 1,
  "size": 20,
  "items": [
    {
      "id": "uuid",
      "title": "string",
      "price": 10500000000,
      "area": 60.5,
      "address": "string",
      "district": "string",
      "thumbnail_url": "string"
    }
  ]
}
```

**Lỗi:**
- 400 Bad Request: Tham số không hợp lệ.

##### 2. GET /properties/{property_id}

**Mô tả:** Lấy thông tin chi tiết của một bất động sản.

**Ủy quyền:** Công khai.

**Response (200 OK):** (Bao gồm tất cả các trường dữ liệu đã scrape)
```json
{
  "id": "uuid",
  "source": "batdongsan.com.vn",
  "url": "string",
  "price": 10500000000,
  "area": 60.5,
  "bedrooms": 3,
  "bathrooms": 2,
  "full_address": "string",
  "district": "string",
  "ward": "string",
  "latitude": 21.0277644,
  "longitude": 105.8341598,
  "description": "string",
  "images": ["url1", "url2"],
  "zoning_info": "string | null",
  //... các trường khác
  "avm_estimate": 10200000000, // Ước tính từ AVM
  "manual_valuation": { // Định giá thủ công gần nhất nếu có
    "value": 11000000000,
    "updated_at": "datetime",
    "valuer_name": "string"
  } | null
}
```

**Lỗi:**
- 404 Not Found: Không tìm thấy bất động sản.

##### 3. GET /properties/similar/{property_id}

**Mô tả:** Lấy danh sách các bất động sản tương tự (gần vị trí, diện tích tương đương).

**Ủy quyền:** Công khai.

**Response (200 OK):** Mảng các đối tượng bất động sản (cấu trúc rút gọn như trong GET /properties).

**Lỗi:**
- 404 Not Found: Không tìm thấy bất động sản gốc.

#### 3.3.3. Endpoints Định giá & Tương tác (Valuation & Interaction)

##### 1. POST /properties/estimate

**Mô tả:** Ước tính giá trị một bất động sản dựa trên thông tin đầu vào (không cần lưu BĐS).

**Ủy quyền:** Người dùng đã đăng nhập (Standard, Professional).

**Request Body:** application/json
```json
{
  "area": 55.0, // required
  "latitude": 21.02776, // required
  "longitude": 105.83415, // required
  "bedrooms": 3, // required
  "bathrooms": 2, // optional
  "frontage": 4.5 // optional
}
```

**Response (200 OK):**
```json
{
  "estimated_price": 9800000000,
  "confidence_score": 0.85
}
```

**Lỗi:**
- 400 Bad Request: Thiếu các trường bắt buộc.
- 401 Unauthorized: Chưa đăng nhập.

##### 2. POST /properties/{property_id}/manual-valuation

**Mô tả:** Cho phép người dùng chuyên nghiệp gửi định giá thủ công.

**Ủy quyền:** Chỉ người dùng chuyên nghiệp (Professional).

**Request Body:** application/json
```json
{
  "value": 11000000000, // required
  "notes": "string" // optional, ghi chú của thẩm định viên
}
```

**Response (201 Created):**
```json
{
  "valuation_id": "uuid",
  "property_id": "uuid",
  "user_id": "uuid",
  "value": 11000000000,
  "notes": "string",
  "created_at": "datetime"
}
```

**Lỗi:**
- 401 Unauthorized: Chưa đăng nhập.
- 403 Forbidden: Người dùng không có vai trò "Professional".
- 404 Not Found: Không tìm thấy bất động sản.

##### 3. POST /export/excel

**Mô tả:** Xuất thông tin của một danh sách bất động sản ra file Excel.

**Ủy quyền:** Người dùng đã đăng nhập (Standard, Professional).

**Request Body:** application/json
```json
{
  "property_ids": ["uuid1", "uuid2", "uuid3"] // required
}
```

**Response (200 OK):** application/vnd.openxmlformats-officedocument.spreadsheetml.sheet

Nội dung là file Excel.

**Lỗi:**
- 400 Bad Request: Danh sách ID rỗng hoặc không hợp lệ.
- 401 Unauthorized: Chưa đăng nhập.

## 4. Lộ trình Triển khai MVP (Sản phẩm Khả thi Tối thiểu)

### MVP 1: Nền tảng Dữ liệu (Mục tiêu: 1-2 tháng)

**Mục tiêu:** Xác thực pipeline dữ liệu cốt lõi.

**Tính năng:** Xây dựng trình thu thập Scrapy + Playwright cho batdongsan.com.vn. Thiết lập CSDL, các endpoint backend cơ bản (GET /properties, GET /properties/{id}), và giao diện React đơn giản để duyệt tin.

### MVP 2: Lớp Thông minh (Mục tiêu: +2 tháng)

**Mục tiêu:** Giới thiệu các tính năng AI và so sánh cốt lõi.

**Tính năng:** Thêm trình thu thập cho alonhadat.com.vn. Phát triển và tích hợp mô hình LightGBM v1. Xây dựng các tính năng/endpoint: ước tính giá, bất động sản tương tự và xuất ra excel.

### MVP 3: Bộ công cụ Chuyên nghiệp & Giữ chân Người dùng (Mục tiêu: +2 tháng)

**Mục tiêu:** Giới thiệu các tính năng cho người dùng chuyên nghiệp.

**Tính năng:** Thêm trình thu thập thông tin quy hoạch/pháp lý. Triển khai xác thực JWT với vai trò người dùng. Xây dựng tính năng "Yêu thích" và Giao diện/Endpoint Điều chỉnh Thủ công cho người dùng "Professional".

## 5. Các Chỉ số Thành công (Success Metrics)

### Tương tác Người dùng
- Người dùng hoạt động hàng ngày (DAU)
- Số lượt tìm kiếm mỗi phiên
- Số lượt ước tính giá được thực hiện

### Chất lượng Dữ liệu & "Sức khỏe" của Trình thu thập
- Sai số phần trăm tuyệt đối trung bình (MAPE) của AVM
- Tỷ lệ thu thập thành công và số lượng cảnh báo lỗi xác thực

### Chuyển đổi & Mức độ chấp nhận của Người dùng Chuyên nghiệp
- Số lượng đăng ký người dùng mới (phân theo vai trò)
- Số lượng định giá thủ công được gửi
- Số lượt xuất file Excel được thực hiện