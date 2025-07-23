import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, DollarSign, Home, Calendar, Ruler, Bed, Bath, Car, TrendingUp, Download, Share2, Heart, ArrowLeft } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { api } from '../services/api';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PropertyDetails {
  property_id: number;
  address_full: string;
  address_city: string;
  address_district: string;
  address_ward?: string;
  latitude?: number;
  longitude?: number;
  property_type: string;
  land_area_sqm?: number;
  floor_area_sqm?: number;
  num_storeys?: number;
  num_bedrooms?: number;
  num_bathrooms?: number;
  year_built?: number;
  description?: string;
  listing_price?: number;
  listing_price_currency: string;
  created_at: string;
  updated_at: string;
}

interface SimilarProperty {
  property_id: number;
  address_full: string;
  address_district: string;
  listing_price?: number;
  floor_area_sqm?: number;
  distance: string;
  latitude?: number;
  longitude?: number;
  image: string;
}

// Mock valuation data for display
const mockValuationData = {
  estimatedValue: '5.1 - 5.4 tỷ',
  confidence: 92,
  lastUpdated: '2024-01-15',
  priceHistory: [
    { month: 'T1/2023', price: 4.8 },
    { month: 'T3/2023', price: 4.9 },
    { month: 'T6/2023', price: 5.0 },
    { month: 'T9/2023', price: 5.1 },
    { month: 'T12/2023', price: 5.2 },
    { month: 'T1/2024', price: 5.2 }
  ],
  marketComparison: [
    { factor: 'Vị trí', score: 95, market: 85 },
    { factor: 'Tiện ích', score: 90, market: 75 },
    { factor: 'Thiết kế', score: 88, market: 80 },
    { factor: 'An ninh', score: 95, market: 70 },
    { factor: 'Giao thông', score: 85, market: 78 }
  ]
};

// Mock amenities for display
const mockAmenities = ['Hồ bơi', 'Gym', 'Công viên', 'An ninh 24/7', 'Thang máy', 'Chỗ đậu xe', 'Trường học', 'Siêu thị'];

// Mock images for display
const mockImages = [
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20luxury%20apartment%20interior%20living%20room%20with%20city%20view&image_size=landscape_16_9',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=contemporary%20apartment%20bedroom%20with%20large%20windows%20and%20modern%20furniture&image_size=landscape_16_9',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20kitchen%20with%20granite%20countertops%20and%20stainless%20appliances&image_size=landscape_16_9',
  'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20apartment%20bathroom%20with%20marble%20tiles%20and%20modern%20fixtures&image_size=landscape_16_9'
];

// Helper functions
const formatPrice = (price?: number, currency: string = 'VND'): string => {
  if (!price) return 'Liên hệ';
  if (price >= 1000000000) {
    return `${(price / 1000000000).toFixed(1)} tỷ`;
  } else if (price >= 1000000) {
    return `${(price / 1000000).toFixed(0)} triệu`;
  }
  return price.toLocaleString('vi-VN') + ' VND';
};

const formatArea = (area?: number): string => {
  if (!area) return 'N/A';
  return `${area}m²`;
};

const getPropertyTypeLabel = (type: string): string => {
  const typeMap: { [key: string]: string } = {
    'APARTMENT': 'Căn hộ',
    'HOUSE': 'Nhà riêng',
    'VILLA': 'Biệt thự',
    'LAND': 'Đất nền'
  };
  return typeMap[type] || type;
};

const calculatePricePerSqm = (price?: number, area?: number): string => {
  if (!price || !area) return 'N/A';
  const pricePerSqm = price / area;
  if (pricePerSqm >= 1000000) {
    return `${(pricePerSqm / 1000000).toFixed(1)} triệu/m²`;
  }
  return `${pricePerSqm.toLocaleString('vi-VN')} VND/m²`;
};

export default function PropertyDetails() {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [similarProperties, setSimilarProperties] = useState<SimilarProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'valuation' | 'location'>('overview');

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Fetch property details
        const propertyData = await api.getProperty(id);
        setProperty(propertyData as any);
        
        // Fetch similar properties (mock for now)
        const mockSimilarProperties: SimilarProperty[] = [
          {
            property_id: 2,
            address_full: 'Căn hộ Masteri Thảo Điền, Quận 2, TP.HCM',
            address_district: 'Quận 2',
            listing_price: 4800000000,
            floor_area_sqm: 80,
            distance: '2.5km',
            latitude: 10.8031,
            longitude: 106.7438,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20apartment%20building%20exterior%20with%20glass%20facade%20urban%20setting&image_size=landscape_4_3'
          },
          {
            property_id: 3,
            address_full: 'Căn hộ The Sun Avenue, Quận 2, TP.HCM',
            address_district: 'Quận 2',
            listing_price: 5500000000,
            floor_area_sqm: 90,
            distance: '3.1km',
            latitude: 10.7891,
            longitude: 106.7234,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=contemporary%20residential%20tower%20with%20balconies%20and%20green%20spaces&image_size=landscape_4_3'
          },
          {
            property_id: 4,
            address_full: 'Căn hộ Saigon Royal, Quận 4, TP.HCM',
            address_district: 'Quận 4',
            listing_price: 4900000000,
            floor_area_sqm: 82,
            distance: '1.8km',
            latitude: 10.7574,
            longitude: 106.7053,
            image: 'https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=luxury%20apartment%20complex%20with%20river%20view%20modern%20architecture&image_size=landscape_4_3'
          }
        ];
        setSimilarProperties(mockSimilarProperties);
        
      } catch (err) {
        console.error('Error fetching property data:', err);
        setError('Không thể tải thông tin bất động sản. Vui lòng thử lại sau.');
        toast.error('Không thể tải thông tin bất động sản');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Đang tải...</h2>
          <p className="text-gray-600">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {error || 'Không tìm thấy bất động sản'}
          </h2>
          <Link to="/search" className="text-blue-600 hover:text-blue-700">
            Quay lại tìm kiếm
          </Link>
        </div>
      </div>
    );
  }

  const coordinates: [number, number] = [
    property.latitude || 10.7626,
    property.longitude || 106.6901
  ];
  const pricePerSqm = calculatePricePerSqm(property.listing_price, property.floor_area_sqm);



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              to="/search"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại tìm kiếm
            </Link>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg transition-colors ${
                  isLiked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
              </button>
              <button 
                onClick={() => navigator.share({ 
                  title: property.title, 
                  url: window.location.href 
                })}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Chia sẻ bất động sản"
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button 
                onClick={() => { /* Implement download functionality */ }}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                aria-label="Tải xuống thông tin"
              >
                <Download className="w-5 h-5" />
              </button>          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 xl:col-span-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="aspect-w-16 aspect-h-9">
                <img
                  src={mockImages[currentImageIndex]}
                  alt={property.address_full}
                  className="w-full h-64 sm:h-80 md:h-96 lg:h-[400px] xl:h-[500px] 2xl:h-[600px] object-cover"
                />
              </div>
              <div className="p-4 lg:p-6">
                <div className="flex gap-2 lg:gap-3 overflow-x-auto">
                  {mockImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-12 lg:w-20 lg:h-16 xl:w-24 xl:h-18 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <nav className="flex">
                  {[
                    { id: 'overview', label: 'Tổng quan' },
                    { id: 'valuation', label: 'Định giá' },
                    { id: 'location', label: 'Vị trí' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 px-4 lg:px-6 py-3 lg:py-4 text-sm lg:text-base font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-600 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-4 lg:p-6 xl:p-8">
                {activeTab === 'overview' && (
                  <div className="space-y-6 lg:space-y-8">
                    {/* Description */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Mô tả</h3>
                      <p className="text-gray-600 leading-relaxed text-base lg:text-lg">
                        {property.description || 'Thông tin mô tả sẽ được cập nhật sớm.'}
                      </p>
                    </div>

                    {/* Amenities */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-3 lg:mb-4">Tiện ích</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 lg:gap-4">
                        {mockAmenities.map((amenity, index) => (
                          <div key={index} className="bg-blue-50 text-blue-700 px-3 py-2 lg:px-4 lg:py-3 rounded-lg text-sm lg:text-base text-center font-medium">
                            {amenity}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'valuation' && (
                  <div className="space-y-6 lg:space-y-8">
                    {/* Valuation Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 lg:p-8 rounded-lg lg:rounded-xl">
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Định giá AI</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                        <div className="text-center">
                          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-blue-600">{mockValuationData.estimatedValue}</div>
                          <div className="text-sm lg:text-base text-gray-600 mt-1">Giá ước tính</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600">{mockValuationData.confidence}%</div>
                          <div className="text-sm lg:text-base text-gray-600 mt-1">Độ tin cậy</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900">{pricePerSqm}</div>
                          <div className="text-sm lg:text-base text-gray-600 mt-1">Giá/m²</div>
                        </div>
                      </div>
                    </div>

                    {/* Price History Chart */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Lịch sử giá</h3>
                      <div className="h-64 lg:h-80 xl:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockValuationData.priceHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip formatter={(value) => [`${value} tỷ`, 'Giá']} />
                            <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={3} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Market Comparison */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">So sánh thị trường</h3>
                      <div className="h-64 lg:h-80 xl:h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={mockValuationData.marketComparison}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="factor" fontSize={12} />
                            <YAxis fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="score" fill="#2563eb" name="Bất động sản này" />
                            <Bar dataKey="market" fill="#94a3b8" name="Trung bình thị trường" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'location' && (
                  <div className="space-y-6 lg:space-y-8">
                    {/* Map */}
                    <div className="h-96 lg:h-[500px] xl:h-[600px] rounded-lg lg:rounded-xl overflow-hidden">
                      <MapContainer
                        center={coordinates}
                        zoom={14}
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={coordinates}>
                          <Popup>
                            <div className="text-center">
                              <h4 className="font-semibold">{property.address_full}</h4>
                              <p className="text-sm text-gray-600">{property.address_district}, {property.address_city}</p>
                            </div>
                          </Popup>
                        </Marker>
                        <Circle
                          center={coordinates}
                          radius={1000}
                          fillColor="blue"
                          fillOpacity={0.1}
                          color="blue"
                          weight={1}
                        />
                        {similarProperties.map((similar) => (
                          <Marker key={similar.property_id} position={[similar.latitude || 0, similar.longitude || 0]}>
                            <Popup>
                              <div className="text-center">
                                <img src={similar.image} alt={similar.address_full} className="w-32 h-20 object-cover rounded mb-2" />
                                <h4 className="font-semibold text-sm">{similar.address_full}</h4>
                                <p className="text-xs text-gray-600">{similar.address_district}</p>
                                <p className="text-sm font-bold text-green-600">{formatPrice(similar.listing_price)}</p>
                                <Link
                                  to={`/property/${similar.property_id}`}
                                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1 inline-block"
                                >
                                  Xem chi tiết
                                </Link>
                              </div>
                            </Popup>
                          </Marker>
                        ))}
                      </MapContainer>
                    </div>

                    {/* Similar Properties */}
                    <div>
                      <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-4 lg:mb-6">Bất động sản tương tự gần đây</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 lg:gap-6">
                        {similarProperties.map((similar) => (
                          <Link
                            key={similar.property_id}
                            to={`/property/${similar.property_id}`}
                            className="bg-white border border-gray-200 rounded-lg lg:rounded-xl p-4 lg:p-5 hover:shadow-md transition-shadow"
                          >
                            <img src={similar.image} alt={similar.address_full} className="w-full h-32 lg:h-40 object-cover rounded lg:rounded-lg mb-3" />
                            <h4 className="font-semibold text-sm lg:text-base mb-1 line-clamp-2">{similar.address_full}</h4>
                            <p className="text-xs lg:text-sm text-gray-600 mb-2">{similar.address_district}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm lg:text-base font-bold text-green-600">{formatPrice(similar.listing_price)}</span>
                              <span className="text-xs lg:text-sm text-gray-500">{similar.distance}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 xl:col-span-4 space-y-6">
            {/* Property Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
              <div className="mb-4">
                <span className="bg-blue-100 text-blue-800 text-xs lg:text-sm font-semibold px-2.5 py-0.5 lg:px-3 lg:py-1 rounded">
                  {getPropertyTypeLabel(property.property_type)}
                </span>
              </div>
              <h1 className="text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 mb-2 lg:mb-3">{property.address_full}</h1>
              <div className="flex items-center text-gray-600 mb-4 lg:mb-6">
                <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-1 lg:mr-2" />
                <span className="text-sm lg:text-base">{property.address_district}, {property.address_city}</span>
              </div>
              <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-green-600 mb-6 lg:mb-8">{formatPrice(property.listing_price)}</div>

              {/* Property Details */}
              <div className="space-y-3 lg:space-y-4">
                {property.floor_area_sqm && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Diện tích sàn</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{formatArea(property.floor_area_sqm)}</span>
                  </div>
                )}
                {property.land_area_sqm && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Ruler className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Diện tích đất</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{formatArea(property.land_area_sqm)}</span>
                  </div>
                )}
                {property.num_bedrooms && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Bed className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Phòng ngủ</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{property.num_bedrooms}</span>
                  </div>
                )}
                {property.num_bathrooms && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Bath className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Phòng tắm</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{property.num_bathrooms}</span>
                  </div>
                )}
                {property.num_storeys && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Home className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Số tầng</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{property.num_storeys}</span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                      <span className="text-sm lg:text-base">Năm xây dựng</span>
                    </div>
                    <span className="font-semibold lg:text-lg">{property.year_built}</span>
                  </div>
                )}
              </div>

              {/* Contact Button */}
              <button className="w-full bg-blue-600 text-white py-3 lg:py-4 rounded-lg lg:rounded-xl font-semibold lg:text-lg hover:bg-blue-700 transition-colors mt-6 lg:mt-8">
                Liên hệ tư vấn
              </button>
            </div>

            {/* Quick Valuation */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 lg:p-8 border border-green-200">
              <div className="flex items-center mb-4 lg:mb-6">
                <TrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-green-600 mr-2 lg:mr-3" />
                <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Định giá nhanh</h3>
              </div>
              <p className="text-sm lg:text-base text-gray-600 mb-4 lg:mb-6">
                Nhận báo cáo định giá chi tiết cho bất động sản này
              </p>
              <Link
                to={`/valuation?property=${property.property_id}`}
                className="w-full bg-green-600 text-white py-3 lg:py-4 px-4 lg:px-6 rounded-lg lg:rounded-xl font-semibold lg:text-lg hover:bg-green-700 transition-colors inline-block text-center"
              >
                Tạo báo cáo định giá
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}