import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, MapPin, DollarSign, Home, Calendar, SlidersHorizontal } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  area: string;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  image: string;
  coordinates: [number, number];
  description: string;
  yearBuilt?: number;
}

// Mock property data
const mockProperties: Property[] = [
  {
    id: 1,
    title: 'Căn hộ cao cấp Vinhomes Central Park',
    location: 'Quận Bình Thạnh, TP.HCM',
    price: '5.2 tỷ',
    area: '85m²',
    type: 'Căn hộ',
    bedrooms: 2,
    bathrooms: 2,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20apartment%20building%20in%20Ho%20Chi%20Minh%20City%20Vietnam%20with%20glass%20facade%20and%20green%20spaces&image_size=landscape_4_3',
    coordinates: [10.7626, 106.6901],
    description: 'Căn hộ cao cấp với view sông Sài Gòn, đầy đủ tiện ích',
    yearBuilt: 2020
  },
  {
    id: 2,
    title: 'Nhà phố thương mại Phú Mỹ Hưng',
    location: 'Quận 7, TP.HCM',
    price: '12.8 tỷ',
    area: '120m²',
    type: 'Nhà phố',
    bedrooms: 3,
    bathrooms: 3,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20commercial%20townhouse%20in%20Phu%20My%20Hung%20district%20Ho%20Chi%20Minh%20City%20with%20contemporary%20architecture&image_size=landscape_4_3',
    coordinates: [10.7285, 106.7317],
    description: 'Nhà phố kinh doanh tại khu đô thị Phú Mỹ Hưng',
    yearBuilt: 2019
  },
  {
    id: 3,
    title: 'Biệt thự đơn lập Thảo Điền',
    location: 'Quận 2, TP.HCM',
    price: '25.5 tỷ',
    area: '300m²',
    type: 'Biệt thự',
    bedrooms: 4,
    bathrooms: 4,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20standalone%20villa%20in%20Thao%20Dien%20district%20Ho%20Chi%20Minh%20City%20with%20garden%20and%20pool&image_size=landscape_4_3',
    coordinates: [10.8031, 106.7438],
    description: 'Biệt thự sang trọng với sân vườn và hồ bơi riêng',
    yearBuilt: 2021
  },
  {
    id: 4,
    title: 'Chung cư The Manor Mễ Trì',
    location: 'Quận Nam Từ Liêm, Hà Nội',
    price: '3.8 tỷ',
    area: '95m²',
    type: 'Căn hộ',
    bedrooms: 3,
    bathrooms: 2,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20complex%20in%20Hanoi%20Vietnam%20with%20contemporary%20design%20and%20urban%20setting&image_size=landscape_4_3',
    coordinates: [21.0285, 105.7774],
    description: 'Chung cư cao cấp tại trung tâm Hà Nội',
    yearBuilt: 2018
  },
  {
    id: 5,
    title: 'Shophouse Vinhomes Ocean Park',
    location: 'Quận Gia Lâm, Hà Nội',
    price: '8.5 tỷ',
    area: '150m²',
    type: 'Nhà phố',
    bedrooms: 4,
    bathrooms: 3,
    image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20shophouse%20in%20Vinhomes%20Ocean%20Park%20Hanoi%20with%20commercial%20ground%20floor%20and%20residential%20upper%20floors&image_size=landscape_4_3',
    coordinates: [21.0227, 105.9363],
    description: 'Shophouse kinh doanh tại khu đô thị Vinhomes Ocean Park',
    yearBuilt: 2022
  }
];

const propertyTypes = ['Tất cả', 'Căn hộ', 'Nhà phố', 'Biệt thự', 'Đất nền'];
const priceRanges = [
  'Tất cả',
  'Dưới 2 tỷ',
  '2 - 5 tỷ',
  '5 - 10 tỷ',
  '10 - 20 tỷ',
  'Trên 20 tỷ'
];

export default function PropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedType, setSelectedType] = useState('Tất cả');
  const [selectedPriceRange, setSelectedPriceRange] = useState('Tất cả');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(mockProperties);

  useEffect(() => {
    let filtered = mockProperties;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (selectedType !== 'Tất cả') {
      filtered = filtered.filter(property => property.type === selectedType);
    }

    // Filter by price range (simplified logic)
    if (selectedPriceRange !== 'Tất cả') {
      // This would need more sophisticated price parsing in a real app
      filtered = filtered.filter(property => {
        const priceMatch = property.price.match(/(\d+(?:\.\d+)?)\s*(tỷ|triệu)?/i);
        if (!priceMatch) return true; // Skip filtering if price format is invalid

        let price = parseFloat(priceMatch[1]);
        const unit = priceMatch[2]?.toLowerCase();

        // Convert to billions for consistent comparison
        if (unit === 'triệu') {
          price = price / 1000;
        }

        switch (selectedPriceRange) {
          case 'Dưới 2 tỷ':
            return price < 2;
          case '2 - 5 tỷ':
            return price >= 2 && price <= 5;
          case '5 - 10 tỷ':
            return price >= 5 && price <= 10;
          case '10 - 20 tỷ':
            return price >= 10 && price <= 20;
          case 'Trên 20 tỷ':
            return price > 20;
          default:
            return true;
        }
      });
    }

    setFilteredProperties(filtered);
  }, [searchQuery, selectedType, selectedPriceRange]);

  const handleSearch = () => {
    setSearchParams({ q: searchQuery });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Tìm kiếm theo địa chỉ, dự án..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Bộ lọc
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Home className="w-5 h-5" />
                Danh sách
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-3 flex items-center gap-2 transition-colors ${
                  viewMode === 'map' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <MapPin className="w-5 h-5" />
                Bản đồ
              </button>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loại bất động sản
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {propertyTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Khoảng giá
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {priceRanges.map(range => (
                      <option key={range} value={range}>{range}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedType('Tất cả');
                      setSelectedPriceRange('Tất cả');
                      setSearchQuery('');
                    }}
                    className="w-full px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Xóa bộ lọc
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Tìm thấy <span className="font-semibold text-gray-900">{filteredProperties.length}</span> kết quả
          </p>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
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
                    <span className="text-xl font-bold text-green-600">{property.price}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{property.location}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Diện tích: {property.area}</span>
                    {property.bedrooms && (
                      <span>{property.bedrooms} PN • {property.bathrooms} WC</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {property.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Map View */
          <div className="h-96 lg:h-[600px] rounded-lg overflow-hidden shadow-lg">
            <MapContainer
              center={[10.7769, 106.7009]} // Ho Chi Minh City center
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredProperties.map((property) => (
                <Marker key={property.id} position={property.coordinates}>
                  <Popup>
                    <div className="p-2">
                      <img
                        src={property.image}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-sm mb-1">{property.title}</h3>
                      <p className="text-xs text-gray-600 mb-1">{property.location}</p>
                      <p className="text-sm font-bold text-green-600 mb-2">{property.price}</p>
                      <Link
                        to={`/property/${property.id}`}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        )}

        {/* No Results */}
        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy kết quả</h3>
            <p className="text-gray-600 mb-4">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('Tất cả');
                setSelectedPriceRange('Tất cả');
                setSearchParams({});
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </div>
    </div>
  );
}