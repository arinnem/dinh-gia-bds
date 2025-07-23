import { useState } from 'react';
import { Download, FileText, Calendar, Filter, Eye, Share2, Trash2, Plus, BarChart3, TrendingUp, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface Report {
  id: string;
  title: string;
  type: 'valuation' | 'market' | 'investment' | 'portfolio';
  status: 'completed' | 'generating' | 'failed';
  createdAt: string;
  size: string;
  format: 'pdf' | 'excel' | 'word';
  description: string;
  propertyCount?: number;
  downloadUrl?: string;
}

interface ReportTemplate {
  id: string;
  name: string;
  type: 'valuation' | 'market' | 'investment' | 'portfolio';
  description: string;
  icon: any;
  features: string[];
}

// Mock data
const mockReports: Report[] = [
  {
    id: '1',
    title: 'Báo cáo định giá - Vinhomes Central Park',
    type: 'valuation',
    status: 'completed',
    createdAt: '2024-01-15',
    size: '2.3 MB',
    format: 'pdf',
    description: 'Báo cáo định giá chi tiết cho căn hộ cao cấp',
    propertyCount: 1,
    downloadUrl: '#'
  },
  {
    id: '2',
    title: 'Phân tích thị trường Q1/2024',
    type: 'market',
    status: 'completed',
    createdAt: '2024-01-14',
    size: '5.7 MB',
    format: 'excel',
    description: 'Báo cáo tổng quan thị trường bất động sản quý 1',
    downloadUrl: '#'
  },
  {
    id: '3',
    title: 'Đánh giá đầu tư - Phú Mỹ Hưng',
    type: 'investment',
    status: 'generating',
    createdAt: '2024-01-16',
    size: 'Đang tạo...',
    format: 'word',
    description: 'Phân tích tiềm năng đầu tư khu vực Phú Mỹ Hưng',
    propertyCount: 5
  },
  {
    id: '4',
    title: 'Portfolio BDS - Tháng 1/2024',
    type: 'portfolio',
    status: 'completed',
    createdAt: '2024-01-13',
    size: '8.2 MB',
    format: 'pdf',
    description: 'Báo cáo tổng hợp danh mục bất động sản',
    propertyCount: 12,
    downloadUrl: '#'
  }
];

const reportTemplates: ReportTemplate[] = [
  {
    id: 'valuation',
    name: 'Báo cáo định giá',
    type: 'valuation',
    description: 'Báo cáo định giá chi tiết cho một bất động sản cụ thể',
    icon: BarChart3,
    features: [
      'Giá ước tính và khoảng tin cậy',
      'So sánh với thị trường',
      'Phân tích xu hướng giá',
      'Đánh giá rủi ro',
      'Khuyến nghị đầu tư'
    ]
  },
  {
    id: 'market',
    name: 'Báo cáo thị trường',
    type: 'market',
    description: 'Phân tích tổng quan thị trường bất động sản theo khu vực',
    icon: TrendingUp,
    features: [
      'Xu hướng giá theo thời gian',
      'Phân tích giao dịch',
      'So sánh các quận/huyện',
      'Dự báo thị trường',
      'Cơ hội đầu tư'
    ]
  },
  {
    id: 'investment',
    name: 'Phân tích đầu tư',
    type: 'investment',
    description: 'Đánh giá tiềm năng đầu tư và lợi nhuận dự kiến',
    icon: MapPin,
    features: [
      'Tính toán ROI',
      'Phân tích cash flow',
      'Đánh giá rủi ro',
      'So sánh phương án',
      'Khuyến nghị chiến lược'
    ]
  },
  {
    id: 'portfolio',
    name: 'Báo cáo danh mục',
    type: 'portfolio',
    description: 'Tổng hợp và phân tích toàn bộ danh mục bất động sản',
    icon: FileText,
    features: [
      'Tổng quan danh mục',
      'Hiệu suất từng BDS',
      'Phân tích đa dạng hóa',
      'Khuyến nghị tối ưu',
      'Báo cáo định kỳ'
    ]
  }
];

const formatOptions = [
  { value: 'pdf', label: 'PDF', icon: '📄' },
  { value: 'excel', label: 'Excel', icon: '📊' },
  { value: 'word', label: 'Word', icon: '📝' }
];

export default function Reports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'completed':
        return 'Hoàn thành';
      case 'generating':
        return 'Đang tạo';
      case 'failed':
        return 'Thất bại';
      default:
        return 'Không xác định';
    }
  };

  const getTypeText = (type: Report['type']) => {
    switch (type) {
      case 'valuation':
        return 'Định giá';
      case 'market':
        return 'Thị trường';
      case 'investment':
        return 'Đầu tư';
      case 'portfolio':
        return 'Danh mục';
      default:
        return 'Khác';
    }
  };

  const getFormatIcon = (format: Report['format']) => {
    switch (format) {
      case 'pdf':
        return '📄';
      case 'excel':
        return '📊';
      case 'word':
        return '📝';
      default:
        return '📄';
    }
  };

  const filteredReports = reports.filter(report => {
    if (selectedType !== 'all' && report.type !== selectedType) return false;
    if (selectedFormat !== 'all' && report.format !== selectedFormat) return false;
    return true;
  });

  const handleDownload = (report: Report) => {
    if (report.status === 'completed') {
      // Create a mock file content based on report type
      let content = '';
      let mimeType = '';
      let fileName = '';
      
      switch (report.format) {
        case 'pdf':
          content = `%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Kids [3 0 R]\n/Count 1\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(${report.title}) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n299\n%%EOF`;
          mimeType = 'application/pdf';
          fileName = `${report.title}.pdf`;
          break;
        case 'excel':
          content = `Báo cáo,${report.title}\nLoại,${getTypeText(report.type)}\nNgày tạo,${new Date(report.createdAt).toLocaleDateString('vi-VN')}\nTrạng thái,${getStatusText(report.status)}\nMô tả,${report.description}`;
          mimeType = 'text/csv';
          fileName = `${report.title}.csv`;
          break;
        case 'word':
          content = `${report.title}\n\nLoại báo cáo: ${getTypeText(report.type)}\nNgày tạo: ${new Date(report.createdAt).toLocaleDateString('vi-VN')}\nTrạng thái: ${getStatusText(report.status)}\n\nMô tả:\n${report.description}\n\nNội dung báo cáo sẽ được hiển thị ở đây...`;
          mimeType = 'text/plain';
          fileName = `${report.title}.txt`;
          break;
        default:
          content = `${report.title}\n${report.description}`;
          mimeType = 'text/plain';
          fileName = `${report.title}.txt`;
      }
      
      // Create and download the file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Đã tải xuống ${report.title}`);
    } else {
      toast.error('Báo cáo chưa sẵn sàng để tải xuống');
    }
  };

  const handleDelete = (reportId: string) => {
    setReports(prev => prev.filter(r => r.id !== reportId));
    toast.success('Đã xóa báo cáo');
  };

  const handleCreateReport = async (template: ReportTemplate, format: string) => {
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: Report = {
        id: Date.now().toString(),
        title: `${template.name} - ${new Date().toLocaleDateString('vi-VN')}`,
        type: template.type,
        status: 'generating',
        createdAt: new Date().toISOString().split('T')[0],
        size: 'Đang tạo...',
        format: format as any,
        description: template.description
      };
      
      setReports(prev => [newReport, ...prev]);
      setShowCreateModal(false);
      setSelectedTemplate(null);
      
      toast.success('Đã bắt đầu tạo báo cáo. Bạn sẽ nhận được thông báo khi hoàn thành.');
      
      // Simulate completion after 5 seconds
      setTimeout(() => {
        setReports(prev => prev.map(r => 
          r.id === newReport.id 
            ? { ...r, status: 'completed' as const, size: '3.2 MB', downloadUrl: '#' }
            : r
        ));
        toast.success('Báo cáo đã được tạo thành công!');
      }, 5000);
      
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo báo cáo');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Báo cáo</h1>
              <p className="text-gray-600 mt-1">Tạo và quản lý các báo cáo phân tích bất động sản</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Tạo báo cáo mới
            </button>
          </div>

          {/* Filters */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại báo cáo</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="valuation">Định giá</option>
                <option value="market">Thị trường</option>
                <option value="investment">Đầu tư</option>
                <option value="portfolio">Danh mục</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Định dạng</label>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="word">Word</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng báo cáo</p>
                <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'completed').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Download className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang tạo</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'generating').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tháng này</p>
                <p className="text-2xl font-bold text-purple-600">
                  {reports.filter(r => {
                    const reportDate = new Date(r.createdAt);
                    const now = new Date();
                    return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Danh sách báo cáo</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Báo cáo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loại
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Định dạng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kích thước
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
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {report.description}
                        </div>
                        {report.propertyCount && (
                          <div className="text-xs text-blue-600 mt-1">
                            {report.propertyCount} bất động sản
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getTypeText(report.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-2">{getFormatIcon(report.format)}</span>
                        <span className="text-sm text-gray-900 uppercase">{report.format}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {report.size}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        getStatusColor(report.status)
                      }`}>
                        {getStatusText(report.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(report.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleDownload(report)}
                          disabled={report.status !== 'completed'}
                          className="text-blue-600 hover:text-blue-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 hover:text-gray-700">
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(report.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Tạo báo cáo mới</h2>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6">
              {!selectedTemplate ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Chọn loại báo cáo</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reportTemplates.map((template) => {
                      const Icon = template.icon;
                      return (
                        <button
                          key={template.id}
                          onClick={() => setSelectedTemplate(template)}
                          className="text-left p-6 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all"
                        >
                          <div className="flex items-center mb-3">
                            <div className="bg-blue-100 p-2 rounded-lg mr-3">
                              <Icon className="w-6 h-6 text-blue-600" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                          </div>
                          <p className="text-gray-600 mb-3">{template.description}</p>
                          <ul className="text-sm text-gray-500 space-y-1">
                            {template.features.slice(0, 3).map((feature, index) => (
                              <li key={index} className="flex items-center">
                                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></span>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center mb-6">
                    <button
                      onClick={() => setSelectedTemplate(null)}
                      className="text-gray-600 hover:text-gray-800 mr-4"
                    >
                      ← Quay lại
                    </button>
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-lg mr-3">
                        <selectedTemplate.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{selectedTemplate.name}</h3>
                        <p className="text-gray-600">{selectedTemplate.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Tính năng bao gồm:</h4>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTemplate.features.map((feature, index) => (
                        <li key={index} className="flex items-center text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mb-6">
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Chọn định dạng xuất:</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {formatOptions.map((format) => (
                        <button
                          key={format.value}
                          onClick={() => handleCreateReport(selectedTemplate, format.value)}
                          disabled={isGenerating}
                          className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="text-2xl mb-2">{format.icon}</div>
                          <div className="font-medium text-gray-900">{format.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isGenerating && (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                      <p className="text-gray-600">Đang tạo báo cáo...</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}