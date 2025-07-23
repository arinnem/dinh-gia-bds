import { useState } from 'react';
import { Users, Building, FileText, TrendingUp, Settings, Shield, Database, Activity, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface SystemMetric {
  id: string;
  name: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'stable';
  icon: any;
  color: string;
}

interface UserActivity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
  details: string;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  message: string;
  timestamp: string;
  resolved: boolean;
}

// Mock data
const systemMetrics: SystemMetric[] = [
  {
    id: '1',
    name: 'Tổng người dùng',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'blue'
  },
  {
    id: '2',
    name: 'BDS đã phân tích',
    value: '15,632',
    change: '+8.3%',
    trend: 'up',
    icon: Building,
    color: 'green'
  },
  {
    id: '3',
    name: 'Báo cáo tạo',
    value: '4,291',
    change: '+15.7%',
    trend: 'up',
    icon: FileText,
    color: 'purple'
  },
  {
    id: '4',
    name: 'Doanh thu (VNĐ)',
    value: '847M',
    change: '+22.1%',
    trend: 'up',
    icon: TrendingUp,
    color: 'orange'
  }
];

const userActivityData = [
  { month: 'T1', users: 1200, properties: 3400, reports: 800 },
  { month: 'T2', users: 1400, properties: 3800, reports: 950 },
  { month: 'T3', users: 1600, properties: 4200, reports: 1100 },
  { month: 'T4', users: 1800, properties: 4600, reports: 1250 },
  { month: 'T5', users: 2100, properties: 5200, reports: 1400 },
  { month: 'T6', users: 2400, properties: 5800, reports: 1600 }
];

const propertyTypeData = [
  { name: 'Căn hộ', value: 45, color: '#3B82F6' },
  { name: 'Nhà phố', value: 25, color: '#10B981' },
  { name: 'Biệt thự', value: 15, color: '#F59E0B' },
  { name: 'Đất nền', value: 10, color: '#EF4444' },
  { name: 'Khác', value: 5, color: '#8B5CF6' }
];

const recentActivities: UserActivity[] = [
  {
    id: '1',
    user: 'Nguyễn Văn A',
    action: 'Tạo báo cáo định giá',
    timestamp: '2024-01-16 14:30',
    status: 'success',
    details: 'Vinhomes Central Park - Căn hộ 2PN'
  },
  {
    id: '2',
    user: 'Trần Thị B',
    action: 'Upload dữ liệu BDS',
    timestamp: '2024-01-16 14:15',
    status: 'success',
    details: '15 bất động sản mới'
  },
  {
    id: '3',
    user: 'Lê Văn C',
    action: 'Đăng nhập hệ thống',
    timestamp: '2024-01-16 14:00',
    status: 'warning',
    details: 'Đăng nhập từ IP lạ'
  },
  {
    id: '4',
    user: 'Phạm Thị D',
    action: 'Xuất báo cáo Excel',
    timestamp: '2024-01-16 13:45',
    status: 'success',
    details: 'Báo cáo thị trường Q1/2024'
  },
  {
    id: '5',
    user: 'Hoàng Văn E',
    action: 'Cập nhật thông tin',
    timestamp: '2024-01-16 13:30',
    status: 'error',
    details: 'Lỗi xác thực dữ liệu'
  }
];

const systemAlerts: SystemAlert[] = [
  {
    id: '1',
    type: 'warning',
    message: 'Dung lượng database đạt 85% - cần mở rộng',
    timestamp: '2024-01-16 14:00',
    resolved: false
  },
  {
    id: '2',
    type: 'info',
    message: 'Bảo trì hệ thống định kỳ vào 2h sáng ngày mai',
    timestamp: '2024-01-16 13:30',
    resolved: false
  },
  {
    id: '3',
    type: 'error',
    message: 'API scraping gặp lỗi với nguồn dữ liệu batdongsan.com.vn',
    timestamp: '2024-01-16 12:15',
    resolved: true
  }
];

export default function AdminDashboard() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [alerts, setAlerts] = useState<SystemAlert[]>(systemAlerts);

  const getStatusIcon = (status: UserActivity['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  const tabs = [
    { id: 'overview', name: 'Tổng quan', icon: Activity },
    { id: 'users', name: 'Người dùng', icon: Users },
    { id: 'properties', name: 'Bất động sản', icon: Building },
    { id: 'reports', name: 'Báo cáo', icon: FileText },
    { id: 'system', name: 'Hệ thống', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Quản trị hệ thống</h1>
              <p className="text-gray-600 mt-1">Giám sát và quản lý toàn bộ hệ thống</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Hệ thống hoạt động bình thường
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Bảo mật
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSelectedTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                      selectedTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* System Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {systemMetrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <div key={metric.id} className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.name}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                        <p className={`text-sm ${
                          metric.trend === 'up' ? 'text-green-600' : 
                          metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {metric.change} so với tháng trước
                        </p>
                      </div>
                      <div className={`bg-${metric.color}-100 p-3 rounded-lg`}>
                        <Icon className={`w-6 h-6 text-${metric.color}-600`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Activity Chart */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động hệ thống</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={userActivityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="users" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="properties" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="reports" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Property Types */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố loại BDS</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={propertyTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Activities & Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activities */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động gần đây</h3>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="mt-1">
                        {getStatusIcon(activity.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{activity.user}</p>
                          <span className="text-xs text-gray-500">{activity.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-600">{activity.action}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Alerts */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cảnh báo hệ thống</h3>
                <div className="space-y-4">
                  {alerts.map((alert) => (
                    <div key={alert.id} className={`p-3 rounded-lg border ${
                      alert.resolved ? 'bg-gray-50 border-gray-200' : 
                      alert.type === 'error' ? 'bg-red-50 border-red-200' :
                      alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                      'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`font-medium ${
                              alert.resolved ? 'text-gray-600' : 'text-gray-900'
                            }`}>
                              {alert.message}
                            </p>
                            {!alert.resolved && (
                              <button
                                onClick={() => resolveAlert(alert.id)}
                                className="text-xs text-blue-600 hover:text-blue-700"
                              >
                                Giải quyết
                              </button>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                          {alert.resolved && (
                            <p className="text-xs text-green-600 mt-1">✓ Đã giải quyết</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'users' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý người dùng</h3>
            <p className="text-gray-600">Tính năng quản lý người dùng sẽ được phát triển trong phiên bản tiếp theo.</p>
          </div>
        )}

        {selectedTab === 'properties' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý bất động sản</h3>
            <p className="text-gray-600">Tính năng quản lý bất động sản sẽ được phát triển trong phiên bản tiếp theo.</p>
          </div>
        )}

        {selectedTab === 'reports' && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quản lý báo cáo</h3>
            <p className="text-gray-600">Tính năng quản lý báo cáo sẽ được phát triển trong phiên bản tiếp theo.</p>
          </div>
        )}

        {selectedTab === 'system' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Cấu hình hệ thống</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Database</p>
                      <p className="text-sm text-gray-600">PostgreSQL 14.2</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">API Server</p>
                      <p className="text-sm text-gray-600">FastAPI 0.104.1</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Web Scraper</p>
                      <p className="text-sm text-gray-600">Ulixee Hero</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm text-yellow-600">Cảnh báo</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Redis Cache</p>
                      <p className="text-sm text-gray-600">Redis 7.0</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">File Storage</p>
                      <p className="text-sm text-gray-600">AWS S3</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Email Service</p>
                      <p className="text-sm text-gray-600">SendGrid</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Hoạt động</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Thống kê hiệu suất</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">99.9%</div>
                  <div className="text-sm text-gray-600">Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1.2s</div>
                  <div className="text-sm text-gray-600">Thời gian phản hồi</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">2.4GB</div>
                  <div className="text-sm text-gray-600">Dung lượng sử dụng</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}