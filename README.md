# Hệ thống Định giá Bất động sản (Real Estate Valuation System)

## Tổng quan

Hệ thống Định giá Bất động sản là một ứng dụng web toàn diện được xây dựng để cung cấp dịch vụ định giá bất động sản tự động sử dụng AI và phân tích dữ liệu thị trường. Hệ thống tích hợp các công nghệ hiện đại để thu thập, phân tích và đưa ra các báo cáo định giá chính xác.

## Tính năng chính

### 1. Định giá Tự động
- **AI Valuation Model (AVM)**: Sử dụng machine learning để định giá dựa trên dữ liệu lịch sử
- **Comparative Market Analysis**: So sánh với các bất động sản tương tự
- **Confidence Score**: Đánh giá độ tin cậy của kết quả định giá
- **Price Range**: Cung cấp khoảng giá từ thấp đến cao

### 2. Thu thập Dữ liệu (Web Scraping)
- **Multi-source Scraping**: Thu thập từ batdongsan.com.vn và alonhadat.com.vn
- **Screenshot Capture**: Chụp ảnh màn hình các trang tin đăng
- **Data Storage**: Lưu trữ dữ liệu và ảnh vào database
- **Respectful Scraping**: Tuân thủ robots.txt và rate limiting

### 3. Phân tích Thị trường
- **Market Trends**: Theo dõi xu hướng giá theo thời gian
- **District Analysis**: Phân tích theo quận/huyện
- **Property Type Analysis**: Phân tích theo loại bất động sản
- **Interactive Charts**: Biểu đồ tương tác với Recharts

### 4. Báo cáo và Xuất dữ liệu
- **Detailed Reports**: Báo cáo định giá chi tiết
- **Comparison Tables**: Bảng so sánh với BDS tương tự
- **External Links**: Liên kết đến tin gốc trên website
- **Screenshot Links**: Liên kết đến ảnh chụp màn hình
- **Export Functionality**: Xuất báo cáo PDF/Excel

### 5. Quản trị Hệ thống
- **Admin Dashboard**: Bảng điều khiển quản trị
- **User Management**: Quản lý người dùng
- **System Monitoring**: Theo dõi hiệu suất hệ thống
- **Data Management**: Quản lý dữ liệu và backup

## Kiến trúc Hệ thống

### Frontend
- **Framework**: React 18 với TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom components với Lucide React icons
- **Charts**: Recharts library
- **State Management**: Zustand
- **Routing**: React Router DOM
- **Notifications**: Sonner

### Backend Services
- **Web Scraping**: Selenium WebDriver
- **AI/ML**: Python-based valuation models
- **Database**: PostgreSQL với Row-Level Security
- **File Storage**: Local storage cho screenshots

### Database Schema
- **Users**: Quản lý người dùng và phân quyền
- **Properties**: Thông tin bất động sản
- **Valuations**: Kết quả định giá
- **Price History**: Lịch sử giá
- **Property Images**: Hình ảnh bất động sản
- **Page Screenshots**: Ảnh chụp màn hình từ scraping
- **ML Models**: Mô hình machine learning
- **Reference Data**: Dữ liệu tham chiếu (quận, huyện, loại BDS)

## Yêu cầu Hệ thống

### Phần mềm cần thiết
- **Node.js**: Version 18.0.0 hoặc cao hơn
- **npm/pnpm**: Package manager (pnpm được ưu tiên)
- **Python**: Version 3.8+ (cho web scraping)
- **PostgreSQL**: Version 13+ (cho database)
- **Chrome/Chromium**: Cho Selenium WebDriver

### Dependencies chính

#### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.8.0",
  "typescript": "^4.9.3",
  "vite": "^4.1.0",
  "tailwindcss": "^3.2.0",
  "lucide-react": "^0.263.1",
  "recharts": "^2.8.0",
  "zustand": "^4.4.0",
  "sonner": "^1.0.0"
}
```

#### Python Dependencies
```txt
selenium==4.15.0
webdriver-manager==4.0.1
psycopg2-binary==2.9.7
requests==2.31.0
beautifulsoup4==4.12.2
pandas==2.1.0
numpy==1.24.0
scikit-learn==1.3.0
```

## Hướng dẫn Cài đặt

### 1. Clone Repository
```bash
git clone <repository-url>
cd dinh-gia-bds
```

### 2. Cài đặt Frontend Dependencies
```bash
# Sử dụng pnpm (khuyến nghị)
pnpm install

# Hoặc sử dụng npm
npm install
```

### 3. Cài đặt Python Dependencies
```bash
# Tạo virtual environment
python -m venv venv

# Kích hoạt virtual environment
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# Cài đặt dependencies
pip install -r requirements.txt
```

### 4. Cấu hình Database
```bash
# Tạo database PostgreSQL
createdb dinh_gia_bds

# Chạy schema
psql -d dinh_gia_bds -f database/schema.sql
```

### 5. Cấu hình Environment Variables
Tạo file `.env` trong thư mục gốc:
```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/dinh_gia_bds

# Scraping
SCREENSHOT_DIR=./public/screenshots
SCRAPE_DELAY=2000
MAX_PAGES_PER_SITE=100

# API Keys (nếu cần)
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 6. Tạo thư mục Screenshots
```bash
mkdir -p public/screenshots
```

## Hướng dẫn Chạy Ứng dụng

### Development Mode

#### 1. Khởi động Frontend
```bash
# Sử dụng pnpm
pnpm dev

# Hoặc npm
npm run dev
```
Ứng dụng sẽ chạy tại: http://localhost:5173

#### 2. Chạy Web Scraper
```bash
# Kích hoạt Python virtual environment
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows

# Chạy scraper cho batdongsan.com.vn
python app/scrapers/bds_scraper.py

# Chạy scraper cho alonhadat.com.vn
python app/scrapers/alonhadat_scraper.py
```

### Production Build

#### 1. Build Frontend
```bash
pnpm build
# hoặc
npm run build
```

#### 2. Preview Production Build
```bash
pnpm preview
# hoặc
npm run preview
```

### Kiểm tra Code Quality
```bash
# Type checking
pnpm run check
# hoặc
npm run check

# Linting
pnpm run lint
# hoặc
npm run lint
```

## Cấu trúc Thư mục

```
dinh-gia-bds/
├── src/                          # Frontend source code
│   ├── components/               # Reusable components
│   ├── pages/                   # Page components
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   ├── utils/                   # Utility functions
│   └── types/                   # TypeScript type definitions
├── app/                         # Backend services
│   ├── scrapers/               # Web scraping modules
│   │   ├── bds_scraper.py      # Batdongsan.com.vn scraper
│   │   └── alonhadat_scraper.py # Alonhadat.com.vn scraper
│   ├── models/                 # ML models
│   └── utils/                  # Python utilities
├── database/                    # Database files
│   └── schema.sql              # Database schema
├── public/                     # Static assets
│   └── screenshots/            # Scraped screenshots
├── .trae/                      # Trae AI documents
│   └── documents/              # Product requirements
└── docs/                       # Documentation
```

## Workflow Phát triển

### 1. Quy trình Scraping
1. **Setup WebDriver**: Khởi tạo Selenium với Chrome
2. **Navigate to URL**: Truy cập trang web mục tiêu
3. **Capture Screenshot**: Chụp ảnh màn hình trang
4. **Parse Data**: Trích xuất thông tin bất động sản
5. **Store Data**: Lưu vào database với metadata
6. **Rate Limiting**: Tuân thủ delay giữa các request

### 2. Quy trình Định giá
1. **Input Validation**: Kiểm tra thông tin đầu vào
2. **Data Preparation**: Chuẩn bị dữ liệu cho model
3. **AI Prediction**: Chạy mô hình AI để dự đoán giá
4. **Comparable Analysis**: Tìm BDS tương tự
5. **Confidence Calculation**: Tính toán độ tin cậy
6. **Report Generation**: Tạo báo cáo định giá

### 3. Quy trình UI/UX
1. **Component Design**: Thiết kế component theo atomic design
2. **State Management**: Quản lý state với Zustand
3. **API Integration**: Tích hợp với backend services
4. **Error Handling**: Xử lý lỗi và loading states
5. **Responsive Design**: Đảm bảo responsive trên mọi thiết bị

## API Endpoints

### Valuation APIs
- `POST /api/valuations` - Tạo định giá mới
- `GET /api/valuations/:id` - Lấy thông tin định giá
- `GET /api/valuations` - Danh sách định giá
- `PUT /api/valuations/:id` - Cập nhật định giá

### Scraping APIs
- `POST /api/scrape/start` - Bắt đầu scraping
- `GET /api/scrape/status` - Trạng thái scraping
- `GET /api/scrape/results` - Kết quả scraping

### Market Data APIs
- `GET /api/market/trends` - Xu hướng thị trường
- `GET /api/market/districts` - Dữ liệu theo quận
- `GET /api/market/property-types` - Dữ liệu theo loại BDS

## Troubleshooting

### Lỗi thường gặp

#### 1. Selenium WebDriver Issues
```bash
# Cài đặt Chrome driver
pip install webdriver-manager

# Kiểm tra Chrome version
chrome --version
```

#### 2. Database Connection Issues
```bash
# Kiểm tra PostgreSQL service
sudo systemctl status postgresql

# Kiểm tra connection
psql -h localhost -U username -d dinh_gia_bds
```

#### 3. Port Conflicts
```bash
# Kiểm tra port đang sử dụng
netstat -tulpn | grep :5173

# Kill process nếu cần
kill -9 <PID>
```

#### 4. Permission Issues
```bash
# Cấp quyền cho thư mục screenshots
chmod 755 public/screenshots

# Cấp quyền cho Python scripts
chmod +x app/scrapers/*.py
```

## Đóng góp

### Quy tắc Coding
1. **TypeScript**: Sử dụng strict mode
2. **ESLint**: Tuân thủ rules đã cấu hình
3. **Prettier**: Format code trước khi commit
4. **Component Size**: Giữ component dưới 300 dòng
5. **Function Naming**: Sử dụng camelCase cho functions
6. **File Naming**: PascalCase cho components, camelCase cho utilities

### Git Workflow
1. **Branch Naming**: feature/feature-name, bugfix/bug-name
2. **Commit Messages**: Sử dụng conventional commits
3. **Pull Requests**: Yêu cầu review trước khi merge
4. **Testing**: Chạy tests trước khi commit

## Bảo mật

### Best Practices
1. **Environment Variables**: Không commit sensitive data
2. **SQL Injection**: Sử dụng parameterized queries
3. **XSS Protection**: Sanitize user inputs
4. **CORS**: Cấu hình CORS properly
5. **Rate Limiting**: Implement rate limiting cho APIs
6. **Authentication**: Sử dụng JWT tokens
7. **HTTPS**: Bắt buộc HTTPS trong production

## Monitoring và Logging

### Metrics cần theo dõi
1. **Performance**: Response time, throughput
2. **Errors**: Error rates, exception tracking
3. **Usage**: User activity, feature usage
4. **Infrastructure**: CPU, memory, disk usage
5. **Scraping**: Success rates, data quality

### Logging Strategy
1. **Structured Logging**: JSON format
2. **Log Levels**: ERROR, WARN, INFO, DEBUG
3. **Log Rotation**: Tự động rotate logs
4. **Centralized Logging**: Aggregate logs từ multiple sources

## Backup và Recovery

### Database Backup
```bash
# Daily backup
pg_dump dinh_gia_bds > backup_$(date +%Y%m%d).sql

# Restore from backup
psql dinh_gia_bds < backup_20240115.sql
```

### File Backup
```bash
# Backup screenshots
tar -czf screenshots_backup_$(date +%Y%m%d).tar.gz public/screenshots/

# Backup application
tar -czf app_backup_$(date +%Y%m%d).tar.gz --exclude=node_modules --exclude=venv .
```

## Liên hệ và Hỗ trợ

- **Documentation**: Xem thêm trong thư mục `/docs`
- **Issues**: Báo cáo lỗi qua GitHub Issues
- **Discussions**: Thảo luận qua GitHub Discussions
- **Email**: support@dinhgiabds.com

## License

MIT License - Xem file LICENSE để biết thêm chi tiết.