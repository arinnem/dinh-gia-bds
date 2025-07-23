import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { TrendingUp, DollarSign, MapPin, Calendar, BarChart3, PieChart, Download, RefreshCw, Filter, Eye, FileText, Building, Home, Ruler, Car, Bed, Bath, Star } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import { AutomatedValuationModel } from '../services/avm';
import { RealEstateScraper } from '../services/scraper';

interface ValuationData {
  id: string;
  propertyTitle: string;
  location: string;
  aiEstimatedValue: string;
  averageEstimatedValue: string;
  confidence: number;
  status: 'completed' | 'processing' | 'pending';
  createdAt: string;
  lastUpdated: string;
  aiPriceRange: { min: number; max: number };
  averagePriceRange: { min: number; max: number };
  marketTrend: 'up' | 'down' | 'stable';
  trendPercentage: number;
  similarPropertiesCount: number;
  valuationMethod: 'both' | 'ai_only' | 'average_only';
  propertyDetails?: {
    area: number;
    bedrooms: number;
    bathrooms: number;
    parking: number;
    propertyType: string;
    condition: string;
    amenities: string[];
  };
  comparableProperties?: ComparableProperty[];
}

interface ComparableProperty {
  id: string;
  title: string;
  location: string;
  price: number;
  area: number;
  pricePerSqm: number;
  bedrooms: number;
  bathrooms: number;
  distance: number;
  similarity: number;
  source: 'database' | 'scraped';
  imageUrl?: string;
  listingDate: string;
  externalUrl?: string;
  screenshotUrl?: string;
}

interface MarketData {
  month: string;
  avgPrice: number;
  transactions: number;
  priceGrowth: number;
}

interface DistrictData {
  district: string;
  avgPrice: number;
  growth: number;
  transactions: number;
}

interface PropertyTypeData {
  type: string;
  value: number;
  percentage: number;
  color: string;
}

// Mock data with enhanced details
const mockValuations: ValuationData[] = [
  {
    id: '1',
    propertyTitle: 'Căn hộ cao cấp Vinhomes Central Park',
    location: 'Quận Bình Thạnh, TP.HCM',
    aiEstimatedValue: '5.2 tỷ',
    averageEstimatedValue: '5.1 tỷ',
    confidence: 92,
    status: 'completed',
    createdAt: '2024-01-15',
    lastUpdated: '2024-01-15',
    aiPriceRange: { min: 5.0, max: 5.4 },
    averagePriceRange: { min: 4.9, max: 5.3 },
    marketTrend: 'up',
    trendPercentage: 8.5,
    similarPropertiesCount: 8,
    valuationMethod: 'both',
    propertyDetails: {
      area: 85,
      bedrooms: 2,
      bathrooms: 2,
      parking: 1,
      propertyType: 'Căn hộ',
      condition: 'Mới',
      amenities: ['Hồ bơi', 'Gym', 'An ninh 24/7', 'Công viên']
    },
    comparableProperties: [
      {
        id: 'comp1',
        title: 'Căn hộ Vinhomes Central Park - Tòa P3',
        location: 'Quận Bình Thạnh, TP.HCM',
        price: 5100000000,
        area: 82,
        pricePerSqm: 62195122,
        bedrooms: 2,
        bathrooms: 2,
        distance: 0.2,
        similarity: 95,
        source: 'database',
        listingDate: '2024-01-10',
        externalUrl: 'https://batdongsan.com.vn/ban-can-ho-chung-cu-vinhomes-central-park-toa-p3',
        screenshotUrl: '/screenshots/comp1_screenshot.png'
      },
      {
        id: 'comp2',
        title: 'Căn hộ Saigon Royal',
        location: 'Quận 4, TP.HCM',
        price: 4800000000,
        area: 80,
        pricePerSqm: 60000000,
        bedrooms: 2,
        bathrooms: 2,
        distance: 1.5,
        similarity: 88,
        source: 'scraped',
        listingDate: '2024-01-08',
        externalUrl: 'https://alonhadat.com.vn/nha-dat/can-ho-saigon-royal-quan-4',
        screenshotUrl: '/screenshots/comp2_screenshot.png'
      }
    ]
  },
  {
    id: '2',
    propertyTitle: 'Nhà phố thương mại Phú Mỹ Hưng',
    location: 'Quận 7, TP.HCM',
    aiEstimatedValue: '12.8 tỷ',
    averageEstimatedValue: '12.5 tỷ',
    confidence: 88,
    status: 'completed',
    createdAt: '2024-01-14',
    lastUpdated: '2024-01-14',
    aiPriceRange: { min: 12.2, max: 13.5 },
    averagePriceRange: { min: 12.0, max: 13.0 },
    marketTrend: 'up',
    trendPercentage: 12.3,
    similarPropertiesCount: 6,
    valuationMethod: 'both',
    propertyDetails: {
      area: 120,
      bedrooms: 4,
      bathrooms: 3,
      parking: 2,
      propertyType: 'Nhà phố',
      condition: 'Tốt',
      amenities: ['Sân vườn', 'Gara ô tô', 'Sân thượng']
    },
    comparableProperties: [
      {
        id: 'comp3',
        title: 'Nhà phố Phú Mỹ Hưng - Khu A',
        location: 'Quận 7, TP.HCM',
        price: 12200000000,
        area: 115,
        pricePerSqm: 106086957,
        bedrooms: 4,
        bathrooms: 3,
        distance: 0.5,
        similarity: 92,
        source: 'database',
        listingDate: '2024-01-12',
        externalUrl: 'https://batdongsan.com.vn/ban-nha-rieng-phu-my-hung-khu-a',
        screenshotUrl: '/screenshots/comp3_screenshot.png'
      }
    ]
  },
  {
    id: '3',
    propertyTitle: 'Chung cư The Manor Mễ Trì',
    location: 'Quận Nam Từ Liêm, Hà Nội',
    aiEstimatedValue: '3.8 tỷ',
    averageEstimatedValue: '3.7 tỷ',
    confidence: 85,
    status: 'processing',
    createdAt: '2024-01-16',
    lastUpdated: '2024-01-16',
    aiPriceRange: { min: 3.6, max: 4.0 },
    averagePriceRange: { min: 3.5, max: 3.9 },
    marketTrend: 'stable',
    trendPercentage: 2.1,
    similarPropertiesCount: 7,
    valuationMethod: 'both',
    propertyDetails: {
      area: 95,
      bedrooms: 3,
      bathrooms: 2,
      parking: 1,
      propertyType: 'Chung cư',
      condition: 'Tốt',
      amenities: ['Hồ bơi', 'Sân chơi trẻ em', 'Siêu thị']
    },
    comparableProperties: [
      {
        id: 'comp4',
        title: 'Chung cư The Manor - Tòa B',
        location: 'Quận Nam Từ Liêm, Hà Nội',
        price: 3600000000,
        area: 92,
        pricePerSqm: 39130435,
        bedrooms: 3,
        bathrooms: 2,
        distance: 0.3,
        similarity: 93,
        source: 'database',
        listingDate: '2024-01-14'
      }
    ]
  }
];

const marketTrendData: MarketData[] = [
  { month: 'T7/2023', avgPrice: 58.2, transactions: 2156, priceGrowth: 5.2 },
  { month: 'T8/2023', avgPrice: 59.1, transactions: 2234, priceGrowth: 1.5 },
  { month: 'T9/2023', avgPrice: 60.3, transactions: 2187, priceGrowth: 2.0 },
  { month: 'T10/2023', avgPrice: 61.8, transactions: 2298, priceGrowth: 2.5 },
  { month: 'T11/2023', avgPrice: 63.2, transactions: 2156, priceGrowth: 2.3 },
  { month: 'T12/2023', avgPrice: 64.1, transactions: 2089, priceGrowth: 1.4 },
  { month: 'T1/2024', avgPrice: 65.2, transactions: 2347, priceGrowth: 1.7 }
];

const districtData: DistrictData[] = [
  { district: 'Quận 1', avgPrice: 95.2, growth: 8.5, transactions: 156 },
  { district: 'Quận 2', avgPrice: 78.9, growth: 12.3, transactions: 234 },
  { district: 'Quận 7', avgPrice: 72.1, growth: 15.2, transactions: 298 },
  { district: 'Quận Bình Thạnh', avgPrice: 68.5, growth: 9.8, transactions: 187 },
  { district: 'Quận Thủ Đức', avgPrice: 52.3, growth: 18.7, transactions: 345 }
];

const propertyTypeData: PropertyTypeData[] = [
  { type: 'Căn hộ', value: 45, percentage: 45, color: '#2563eb' },
  { type: 'Nhà phố', value: 25, percentage: 25, color: '#16a34a' },
  { type: 'Biệt thự', value: 15, percentage: 15, color: '#dc2626' },
  { type: 'Đất nền', value: 10, percentage: 10, color: '#ca8a04' },
  { type: 'Khác', value: 5, percentage: 5, color: '#9333ea' }
];

const COLORS = ['#2563eb', '#16a34a', '#dc2626', '#ca8a04', '#9333ea'];

export default function ValuationDashboard() {
  const [searchParams] = useSearchParams();
  const [valuations, setValuations] = useState<ValuationData[]>([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState('6months');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'valuations' | 'market'>('valuations');
  const [selectedValuation, setSelectedValuation] = useState<ValuationData | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize AVM and Scraper
  const avm = new AutomatedValuationModel();
  const scraper = new RealEstateScraper();

  const isNewProperty = searchParams.get('new') === 'true';
  const valuationId = searchParams.get('valuation_id');

  // Load valuations from database
  const loadValuations = async () => {
    try {
      setIsLoading(true);
      
      if (valuationId) {
        // Load specific valuation
        const response = await fetch(`http://localhost:8000/api/v1/valuations/${valuationId}`);
        if (response.ok) {
          const valuation = await response.json();
          
          // Convert backend data to frontend format
          const formattedValuation: ValuationData = {
            id: valuation.valuation_id.toString(),
            propertyTitle: valuation.property?.title || 'Bất động sản',
            location: `${valuation.property?.district || ''}, ${valuation.property?.city || ''}`.trim().replace(/^,\s*/, ''),
            aiEstimatedValue: `${(valuation.banker_adjusted_value / 1000000000).toFixed(1)} tỷ`,
            averageEstimatedValue: `${(valuation.banker_adjusted_value / 1000000000).toFixed(1)} tỷ`,
            confidence: 85, // Default confidence
            status: 'processing' as const,
            createdAt: valuation.valuation_date,
            lastUpdated: valuation.valuation_date,
            aiPriceRange: { 
              min: valuation.banker_adjusted_value / 1000000000 * 0.9, 
              max: valuation.banker_adjusted_value / 1000000000 * 1.1 
            },
            averagePriceRange: { 
              min: valuation.banker_adjusted_value / 1000000000 * 0.9, 
              max: valuation.banker_adjusted_value / 1000000000 * 1.1 
            },
            marketTrend: 'up' as const,
            trendPercentage: 8.5,
            similarPropertiesCount: 0,
            valuationMethod: 'both' as const,
            propertyDetails: {
              area: valuation.property?.land_area_sqm || 0,
              bedrooms: valuation.property?.bedrooms || 0,
              bathrooms: valuation.property?.bathrooms || 0,
              parking: 1,
              propertyType: valuation.property?.property_type || 'Căn hộ',
              condition: 'Tốt',
              amenities: []
            },
            comparableProperties: []
          };
          
          setValuations([formattedValuation]);
          
          // Auto-select the new valuation
          setSelectedValuation(formattedValuation);
          
          if (isNewProperty) {
            toast.success('Yêu cầu định giá đã được tạo thành công!');
          }
        }
      } else {
        // Load all user valuations (for now, use mock data)
        setValuations(mockValuations);
      }
    } catch (error) {
      console.error('Error loading valuations:', error);
      toast.error('Có lỗi xảy ra khi tải dữ liệu định giá!');
      // Fallback to mock data
      setValuations(mockValuations);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadValuations();
  }, [valuationId]);

  useEffect(() => {
    if (isNewProperty) {
      toast.success('Yêu cầu định giá đã được gửi thành công!');
    }
  }, [isNewProperty]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
    toast.success('Dữ liệu đã được cập nhật!');
  };

  const generateValuationReport = async (valuation: ValuationData) => {
    setIsGeneratingReport(true);
    try {
      toast.info('Đang tạo báo cáo định giá...');
      
      // Call the real API to generate report
      const response = await fetch(`http://localhost:8000/api/v1/valuations/${valuation.id}/generate_report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          report_type: 'valuation',
          format: 'pdf',
          include_comparables: true,
          include_market_analysis: true
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const reportResult = await response.json();
      
      // Update the valuation status to completed
      setValuations(prev => prev.map(v => 
        v.id === valuation.id 
          ? { ...v, status: 'completed' as const, reportId: reportResult.report.report_id }
          : v
      ));
      
      toast.success('Báo cáo định giá đã được tạo thành công!');
      
      // Store report data for potential download
      console.log('Generated Report:', reportResult.report);
      
      // Optionally trigger download
      if (reportResult.download_url) {
        // You can implement download functionality here
        console.log('Report available at:', reportResult.download_url);
      }
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('Có lỗi xảy ra khi tạo báo cáo!');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatArea = (area: number) => {
    return `${area} m²`;
  };

  const getSourceBadge = (source: 'database' | 'scraped') => {
    return source === 'database' ? (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        Cơ sở dữ liệu
      </span>
    ) : (
      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Web scraping
      </span>
    );
  };

  const getStatusColor = (status: ValuationData['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: ValuationData['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'processing':
        return 'Đang xử lý';
      case 'pending':
        return 'Chờ xử lý';
      default:
        return 'Không xác định';
    }
  };

  const getTrendIcon = (trend: ValuationData['marketTrend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingUp className="w-4 h-4 text-red-600 transform rotate-180" />;
      case 'stable':
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const renderValuationsTab = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Đang tải dữ liệu định giá...</p>
          </div>
        </div>
      );
    }

    return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng định giá</p>
              <p className="text-2xl font-bold text-gray-900">{valuations.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">
                {valuations.filter(v => v.status === 'completed').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang xử lý</p>
              <p className="text-2xl font-bold text-yellow-600">
                {valuations.filter(v => v.status === 'processing').length}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <RefreshCw className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Độ tin cậy TB</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round(valuations.reduce((acc, v) => acc + v.confidence, 0) / valuations.length)}%
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <PieChart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Phân bố theo loại BDS</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={propertyTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ type, percentage }) => `${type} ${percentage}%`}
                >
                  {propertyTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Hiệu suất định giá</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">98.5%</div>
              <div className="text-sm text-gray-600">Độ chính xác</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">2.3 phút</div>
              <div className="text-sm text-gray-600">Thời gian TB</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 mb-1">1,247</div>
              <div className="text-sm text-gray-600">Tổng định giá</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">4.8/5</div>
              <div className="text-sm text-gray-600">Đánh giá TB</div>
            </div>
          </div>
          
          <div className="space-y-3">
            {propertyTypeData.map((item, index) => (
              <div key={item.type} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.type}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-gray-900">{item.percentage}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Valuations List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Danh sách định giá</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                Làm mới
              </button>
              <Link
                to="/upload"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Định giá mới
              </Link>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bất động sản
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Giá ước tính (AI / Trung bình)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Độ tin cậy
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Xu hướng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {valuations.map((valuation) => (
                <tr key={valuation.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {valuation.propertyTitle}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {valuation.location}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-blue-600">
                        AI: {valuation.aiEstimatedValue}
                      </div>
                      <div className="text-sm font-bold text-green-600">
                        TB: {valuation.averageEstimatedValue}
                      </div>
                      <div className="text-xs text-gray-500">
                        {valuation.similarPropertiesCount} BDS tương tự
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {valuation.confidence}%
                      </div>
                      <div className="ml-2 w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${valuation.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getTrendIcon(valuation.marketTrend)}
                      <span className={`ml-1 text-sm font-medium ${
                        valuation.marketTrend === 'up' ? 'text-green-600' :
                        valuation.marketTrend === 'down' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {valuation.trendPercentage > 0 ? '+' : ''}{valuation.trendPercentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getStatusColor(valuation.status)
                    }`}>
                      {getStatusText(valuation.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(valuation.createdAt).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedValuation(valuation)}
                        className="text-blue-600 hover:text-blue-700"
                        title="Xem chi tiết so sánh"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generateValuationReport(valuation)}
                        disabled={isGeneratingReport}
                        className="text-green-600 hover:text-green-700 disabled:opacity-50"
                        title="Tạo báo cáo định giá"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-700">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Detailed Comparison Modal */}
      {selectedValuation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Chi tiết so sánh - {selectedValuation.propertyTitle}
                  </h2>
                  <p className="text-gray-600 mt-1">{selectedValuation.location}</p>
                </div>
                <button
                  onClick={() => setSelectedValuation(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {/* Property Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông tin bất động sản</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Diện tích</div>
                          <div className="font-semibold">{formatArea(selectedValuation.propertyDetails?.area || 0)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bed className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Phòng ngủ</div>
                          <div className="font-semibold">{selectedValuation.propertyDetails?.bedrooms || 0}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Phòng tắm</div>
                          <div className="font-semibold">{selectedValuation.propertyDetails?.bathrooms || 0}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Car className="w-4 h-4 text-gray-500" />
                        <div>
                          <div className="text-sm text-gray-500">Chỗ đậu xe</div>
                          <div className="font-semibold">{selectedValuation.propertyDetails?.parking || 0}</div>
                        </div>
                      </div>
                    </div>
                    {selectedValuation.propertyDetails?.amenities && (
                      <div className="mt-4">
                        <div className="text-sm text-gray-500 mb-2">Tiện ích</div>
                        <div className="flex flex-wrap gap-2">
                          {selectedValuation.propertyDetails.amenities.map((amenity, index) => (
                            <span key={index} className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Định giá</h3>
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-blue-600 font-medium">Giá AI (AVM)</div>
                      <div className="text-2xl font-bold text-blue-700">{selectedValuation.aiEstimatedValue}</div>
                      <div className="text-sm text-blue-600">Độ tin cậy: {selectedValuation.confidence}%</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-green-600 font-medium">Giá trung bình thị trường</div>
                      <div className="text-2xl font-bold text-green-700">{selectedValuation.averageEstimatedValue}</div>
                      <div className="text-sm text-green-600">{selectedValuation.similarPropertiesCount} BDS tương tự</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Comparable Properties Table */}
              {selectedValuation.comparableProperties && selectedValuation.comparableProperties.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Bất động sản tương tự</h3>
                    <button
                      onClick={() => generateValuationReport(selectedValuation)}
                      disabled={isGeneratingReport}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      {isGeneratingReport ? 'Đang tạo báo cáo...' : 'Tạo báo cáo định giá'}
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 rounded-lg">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Bất động sản
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá bán
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Giá/m²
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Diện tích
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Phòng
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Khoảng cách
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Độ tương tự
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nguồn
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Liên kết
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ảnh chụp
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedValuation.comparableProperties.map((property) => (
                          <tr key={property.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4">
                              <div className="flex items-start gap-3">
                                {property.imageUrl && (
                                  <img
                                    src={property.imageUrl}
                                    alt={property.title}
                                    className="w-16 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{property.title}</div>
                                  <div className="text-sm text-gray-500 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    {property.location}
                                  </div>
                                  <div className="text-xs text-gray-400">
                                    Ngày đăng: {new Date(property.listingDate).toLocaleDateString('vi-VN')}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-bold text-gray-900">
                                {formatCurrency(property.price)}
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm font-semibold text-blue-600">
                                {formatCurrency(property.pricePerSqm)}/m²
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{formatArea(property.area)}</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">
                                <div className="flex items-center gap-1">
                                  <Bed className="w-3 h-3" />
                                  {property.bedrooms}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Bath className="w-3 h-3" />
                                  {property.bathrooms}
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="text-sm text-gray-900">{property.distance.toFixed(1)} km</div>
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex items-center">
                                <div className="text-sm font-medium text-gray-900">{property.similarity}%</div>
                                <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-green-600 h-2 rounded-full"
                                    style={{ width: `${property.similarity}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              {getSourceBadge(property.source)}
                            </td>
                            <td className="px-4 py-4">
                              {property.externalUrl && (
                                <a
                                  href={property.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <Eye className="w-3 h-3" />
                                  Xem tin
                                </a>
                              )}
                            </td>
                            <td className="px-4 py-4">
                              {property.screenshotUrl && (
                                <a
                                  href={property.screenshotUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-green-600 hover:text-green-800 text-sm font-medium"
                                >
                                  <FileText className="w-3 h-3" />
                                  Ảnh chụp
                                </a>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {/* Summary Statistics */}
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="text-sm text-blue-600 font-medium">Giá trung bình</div>
                      <div className="text-lg font-bold text-blue-700">
                        {formatCurrency(
                          selectedValuation.comparableProperties.reduce((sum, prop) => sum + prop.price, 0) /
                          selectedValuation.comparableProperties.length
                        )}
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-sm text-green-600 font-medium">Giá/m² TB</div>
                      <div className="text-lg font-bold text-green-700">
                        {formatCurrency(
                          selectedValuation.comparableProperties.reduce((sum, prop) => sum + prop.pricePerSqm, 0) /
                          selectedValuation.comparableProperties.length
                        )}/m²
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="text-sm text-purple-600 font-medium">Độ tương tự TB</div>
                      <div className="text-lg font-bold text-purple-700">
                        {Math.round(
                          selectedValuation.comparableProperties.reduce((sum, prop) => sum + prop.similarity, 0) /
                          selectedValuation.comparableProperties.length
                        )}%
                      </div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <div className="text-sm text-orange-600 font-medium">Khoảng cách TB</div>
                      <div className="text-lg font-bold text-orange-700">
                        {(
                          selectedValuation.comparableProperties.reduce((sum, prop) => sum + prop.distance, 0) /
                          selectedValuation.comparableProperties.length
                        ).toFixed(1)} km
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    );
  };

  const renderMarketTab = () => (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Bộ lọc</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng thời gian</label>
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="3months">3 tháng</option>
              <option value="6months">6 tháng</option>
              <option value="1year">1 năm</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quận/Huyện</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả</option>
              <option value="quan1">Quận 1</option>
              <option value="quan2">Quận 2</option>
              <option value="quan7">Quận 7</option>
              <option value="binhThanh">Quận Bình Thạnh</option>
              <option value="thuDuc">Quận Thủ Đức</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại BDS</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả</option>
              <option value="apartment">Căn hộ</option>
              <option value="house">Nhà phố</option>
              <option value="villa">Biệt thự</option>
              <option value="land">Đất nền</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Khoảng giá</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="all">Tất cả</option>
              <option value="under2">Dưới 2 tỷ</option>
              <option value="2to5">2-5 tỷ</option>
              <option value="5to10">5-10 tỷ</option>
              <option value="over10">Trên 10 tỷ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Giá trung bình</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-green-600 mb-2">65.2M/m²</div>
          <div className="text-sm text-green-600">+8.3% so với tháng trước</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Giao dịch</h3>
            <BarChart3 className="w-6 h-6 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-blue-600 mb-2">2,347</div>
          <div className="text-sm text-blue-600">+12.5% so với tháng trước</div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tăng trưởng</h3>
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-purple-600 mb-2">+1.7%</div>
          <div className="text-sm text-purple-600">Tháng này</div>
        </div>
      </div>

      {/* Market Trend Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Xu hướng thị trường</h3>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={marketTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avgPrice') return [`${value} triệu/m²`, 'Giá trung bình'];
                  if (name === 'transactions') return [`${value}`, 'Giao dịch'];
                  return [value, name];
                }}
              />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="avgPrice"
                stroke="#2563eb"
                fill="#2563eb"
                fillOpacity={0.1}
                strokeWidth={2}
              />
              <Bar yAxisId="right" dataKey="transactions" fill="#16a34a" opacity={0.7} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* District Analysis */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Phân tích theo quận</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={districtData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="district" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'avgPrice') return [`${value} triệu/m²`, 'Giá trung bình'];
                  if (name === 'growth') return [`${value}%`, 'Tăng trưởng'];
                  return [value, name];
                }}
              />
              <Bar dataKey="avgPrice" fill="#2563eb" name="Giá trung bình" />
              <Bar dataKey="growth" fill="#16a34a" name="Tăng trưởng" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Định giá</h1>
              <p className="text-gray-600 mt-1">Quản lý và theo dõi các định giá bất động sản</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" />
                Bộ lọc
              </button>
              <Link
                to="/upload"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <DollarSign className="w-4 h-4" />
                Định giá mới
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <nav className="flex space-x-8">
              {[
                { id: 'valuations', label: 'Định giá của tôi', icon: BarChart3 },
                { id: 'market', label: 'Thị trường', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'valuations' && renderValuationsTab()}
        {activeTab === 'market' && renderMarketTab()}
      </div>
    </div>
  );
}