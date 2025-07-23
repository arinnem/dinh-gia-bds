import { Link } from 'react-router-dom';
import { Search, Upload, TrendingUp, MapPin, DollarSign, BarChart3 } from 'lucide-react';
import { useState } from 'react';

// Mock data for featured properties
const featuredProperties = [
  {
    id: 1,
    title: 'Căn hộ cao cấp Vinhomes Central Park',
    location: 'Quận Bình Thạnh, TP.HCM',
    price: '5.2 tỷ',
    area: '85m²',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20apartment%20building%20in%20Ho%20Chi%20Minh%20City%20Vietnam%20with%20glass%20facade%20and%20green%20spaces&image_size=landscape_4_3',
    type: 'Căn hộ'
  },
  {
    id: 2,
    title: 'Nhà phố thương mại Phú Mỹ Hưng',
    location: 'Quận 7, TP.HCM',
    price: '12.8 tỷ',
    area: '120m²',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20commercial%20townhouse%20in%20Phu%20My%20Hung%20district%20Ho%20Chi%20Minh%20City%20with%20contemporary%20architecture&image_size=landscape_4_3',
    type: 'Nhà phố'
  },
  {
    id: 3,
    title: 'Biệt thự đơn lập Thảo Điền',
    location: 'Quận 2, TP.HCM',
    price: '25.5 tỷ',
    area: '300m²',
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20standalone%20villa%20in%20Thao%20Dien%20district%20Ho%20Chi%20Minh%20City%20with%20garden%20and%20pool&image_size=landscape_4_3',
    type: 'Biệt thự'
  }
];

// Mock market statistics
const marketStats = [
  { label: 'Tổng giao dịch tháng', value: '2,847', icon: TrendingUp, change: '+12.5%' },
  { label: 'Giá trung bình/m²', value: '65.2M', icon: DollarSign, change: '+8.3%' },
  { label: 'Khu vực hot nhất', value: 'Quận 7', icon: MapPin, change: '+15.2%' },
  { label: 'Tỷ lệ tăng giá', value: '89%', icon: BarChart3, change: '+5.1%' }
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Phân tích bất động sản
              <span className="block text-blue-200">thông minh</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Định giá chính xác, phân tích thị trường chuyên sâu với công nghệ AI tiên tiến
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nhập địa chỉ hoặc tên dự án..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  />
                </div>
                <Link
                  to={`/search?q=${encodeURIComponent(searchQuery)}`}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Tìm kiếm
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/upload"
                className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Định giá bất động sản
              </Link>
              <Link
                to="/valuation"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-700 transition-colors flex items-center justify-center"
              >
                <BarChart3 className="w-5 h-5 mr-2" />
                Xem báo cáo thị trường
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Market Statistics */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Thống kê thị trường</h2>
            <p className="text-lg text-gray-600">Cập nhật thông tin thị trường bất động sản mới nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                  <p className="text-gray-600 mb-2">{stat.label}</p>
                  <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Bất động sản nổi bật</h2>
            <p className="text-lg text-gray-600">Những dự án được quan tâm nhiều nhất</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((property) => (
              <Link
                key={property.id}
                to={`/property/${property.id}`}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="aspect-w-16 aspect-h-9 overflow-hidden">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {property.type}
                    </span>
                    <span className="text-2xl font-bold text-green-600">{property.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Diện tích: {property.area}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/search"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              Xem tất cả bất động sản
              <Search className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}