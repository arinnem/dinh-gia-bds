import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, TrendingUp, Eye, Clock, ArrowRight } from 'lucide-react';

interface NewsArticle {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  category: 'market' | 'policy' | 'investment' | 'analysis';
  location?: string;
  readTime: number;
  views: number;
  featured: boolean;
}

// Mock news data - will be replaced with database data
const mockNews: NewsArticle[] = [
  {
    id: 1,
    title: 'Thị trường bất động sản TP.HCM tăng trưởng mạnh trong quý 4/2024',
    excerpt: 'Giá bất động sản tại các quận trung tâm TP.HCM tiếp tục tăng 8-12% so với cùng kỳ năm trước, với nguồn cung khan hiếm và nhu cầu cao.',
    content: 'Theo báo cáo mới nhất từ các chuyên gia bất động sản, thị trường TP.HCM đang chứng kiến sự tăng trưởng mạnh mẽ...',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Ho%20Chi%20Minh%20City%20skyline%20with%20modern%20buildings%20and%20real%20estate%20development&image_size=landscape_16_9',
    publishedAt: '2024-01-15T10:30:00Z',
    author: 'Nguyễn Văn An',
    category: 'market',
    location: 'TP.HCM',
    readTime: 5,
    views: 1250,
    featured: true
  },
  {
    id: 2,
    title: 'Chính sách mới về thuế bất động sản có hiệu lực từ tháng 2/2024',
    excerpt: 'Luật thuế bất động sản mới sẽ tác động đáng kể đến thị trường, đặc biệt là phân khúc nhà ở cao cấp và bất động sản đầu tư.',
    content: 'Chính phủ vừa ban hành nghị định mới về thuế bất động sản...',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Vietnamese%20government%20building%20with%20documents%20and%20legal%20papers%20about%20real%20estate%20tax&image_size=landscape_16_9',
    publishedAt: '2024-01-14T14:20:00Z',
    author: 'Trần Thị Bình',
    category: 'policy',
    readTime: 7,
    views: 980,
    featured: true
  },
  {
    id: 3,
    title: 'Xu hướng đầu tư bất động sản 2024: Tập trung vào khu vực ngoại thành',
    excerpt: 'Các nhà đầu tư đang chuyển hướng sang các khu vực ngoại thành với tiềm năng tăng trưởng cao và giá cả hợp lý hơn.',
    content: 'Trong bối cảnh giá bất động sản trung tâm ngày càng cao...',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=suburban%20real%20estate%20development%20in%20Vietnam%20with%20modern%20houses%20and%20green%20spaces&image_size=landscape_16_9',
    publishedAt: '2024-01-13T09:15:00Z',
    author: 'Lê Minh Hoàng',
    category: 'investment',
    readTime: 6,
    views: 750,
    featured: false
  },
  {
    id: 4,
    title: 'Phân tích chi tiết: Vì sao giá căn hộ tại Quận 2 tăng vọt?',
    excerpt: 'Quận 2 (nay là TP. Thủ Đức) đang trở thành điểm nóng với mức tăng giá 15-20% trong 6 tháng qua.',
    content: 'Khu vực Quận 2 đã chứng kiến sự phát triển mạnh mẽ về hạ tầng...',
    imageUrl: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20buildings%20in%20Thu%20Duc%20City%20Vietnam%20with%20urban%20development&image_size=landscape_16_9',
    publishedAt: '2024-01-12T16:45:00Z',
    author: 'Phạm Thị Lan',
    category: 'analysis',
    location: 'Quận 2',
    readTime: 8,
    views: 1100,
    featured: false
  },
  {
    id: 5,
    title: 'Dự báo thị trường bất động sản Hà Nội năm 2024',
    excerpt: 'Thị trường Hà Nội dự kiến sẽ ổn định hơn với nguồn cung tăng từ các dự án mới được phê duyệt.',
    content: 'Theo