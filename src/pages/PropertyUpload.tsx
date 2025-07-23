import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, Home, DollarSign, FileText, Camera, X, Plus, AlertCircle, CheckCircle } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface PropertyFormData {
  title: string;
  address: string;
  district: string;
  city: string;
  propertyType: string;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  direction?: string;
  legalStatus: string;
  description: string;
  expectedPrice?: number;

}

interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'document';
}

const propertyTypes = [
  'Căn hộ chung cư',
  'Nhà riêng',
  'Nhà phố thương mại',
  'Biệt thự',
  'Đất nền',
  'Kho xưởng',
  'Văn phòng',
  'Mặt bằng kinh doanh'
];

const districts = [
  'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10',
  'Quận 11', 'Quận 12', 'Quận Bình Thạnh', 'Quận Gò Vấp', 'Quận Phú Nhuận', 'Quận Tân Bình',
  'Quận Tân Phú', 'Quận Thủ Đức', 'Huyện Bình Chánh', 'Huyện Cần Giờ', 'Huyện Củ Chi', 'Huyện Hóc Môn', 'Huyện Nhà Bè'
];

const cities = ['TP. Hồ Chí Minh', 'Hà Nội', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Khác'];

const directions = ['Đông', 'Tây', 'Nam', 'Bắc', 'Đông Bắc', 'Đông Nam', 'Tây Bắc', 'Tây Nam'];

const legalStatuses = ['Sổ hồng', 'Sổ đỏ', 'Giấy tờ hợp lệ', 'Đang chờ sổ', 'Khác'];



export default function PropertyUpload() {
  const navigate = useNavigate();
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm<PropertyFormData>({
    defaultValues: {
      city: 'TP. Hồ Chí Minh',
      legalStatus: 'Sổ hồng',

    }
  });

  const watchedPropertyType = watch('propertyType');
  const watchedCity = watch('city');

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: (acceptedFiles) => {
      const newFiles = acceptedFiles.map(file => ({
        file,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' as const : 'document' as const
      }));
      setUploadedFiles(prev => [...prev, ...newFiles]);
    },
    onDropRejected: (rejectedFiles) => {
      rejectedFiles.forEach(rejection => {
        if (rejection.file.size > 10 * 1024 * 1024) {
          toast.error(`File ${rejection.file.name} quá lớn. Kích thước tối đa 10MB.`);
        } else {
          toast.error(`File ${rejection.file.name} không được hỗ trợ.`);
        }
      });
    }
  });

  const removeFile = (index: number) => {
    setUploadedFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    
    try {
      toast.info('Đang xử lý thông tin bất động sản...');
      
      // First, create the property
      const propertyResponse = await fetch('http://localhost:8000/api/v1/properties/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: data.title,
          address_full: data.address,
          district: data.district,
          city: data.city,
          property_type: data.propertyType,
          land_area_sqm: data.area,
          floor_area_sqm: data.area, // Assuming same for now
          bedrooms: data.bedrooms || null,
          bathrooms: data.bathrooms || null,
          year_built: data.yearBuilt || null,
          direction: data.direction || null,
          legal_status: data.legalStatus,
          description: data.description || null,
          expected_price: data.expectedPrice ? data.expectedPrice * 1000000000 : null, // Convert to VND
          latitude: 10.7769 + (Math.random() - 0.5) * 0.1, // Random coordinates in HCM area
          longitude: 106.7009 + (Math.random() - 0.5) * 0.1
        })
      });
      
      if (!propertyResponse.ok) {
        throw new Error('Failed to create property');
      }
      
      const property = await propertyResponse.json();
      
      toast.info('Đang tạo yêu cầu định giá...');
      
      // Then, create a valuation for this property
      const valuationResponse = await fetch('http://localhost:8000/api/v1/valuations/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_id: property.property_id,
          valuation_date: new Date().toISOString().split('T')[0],
          banker_adjusted_value: data.expectedPrice ? data.expectedPrice * 1000000000 : 5000000000, // Default 5 billion VND
          valuation_currency: 'VND',
          valuation_notes: `Định giá cho ${data.title} - ${data.propertyType} tại ${data.address}`
        })
      });
      
      if (!valuationResponse.ok) {
        throw new Error('Failed to create valuation');
      }
      
      const valuation = await valuationResponse.json();
      
      toast.success('Đã tạo yêu cầu định giá thành công! Đang chuyển đến trang định giá...');
      
      // Navigate to valuation page with the new valuation
      setTimeout(() => {
        navigate(`/valuation?new=true&valuation_id=${valuation.valuation_id}`);
      }, 1000);
      
    } catch (error) {
      console.error('Error creating property/valuation:', error);
      toast.error('Có lỗi xảy ra khi tạo yêu cầu định giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormContent = () => (
    <div className="space-y-8">
      {/* Basic Information Section */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex items-center mb-6">
          <Home className="w-6 h-6 text-blue-600 mr-3" />
          <h3 className="text-xl font-bold text-gray-900">Thông tin cơ bản</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bất động sản *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: Căn hộ cao cấp view sông..."
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại bất động sản *
            </label>
            <select
              {...register('propertyType', { required: 'Vui lòng chọn loại bất động sản' })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Chọn loại bất động sản</option>
              {propertyTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            {errors.propertyType && (
              <p className="mt-1 text-sm text-red-600">{errors.propertyType.message}</p>
            )}
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Diện tích (m²) *
             </label>
             <input
               type="number"
               {...register('area', { 
                 required: 'Vui lòng nhập diện tích',
                 min: { value: 1, message: 'Diện tích phải lớn hơn 0' }
               })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="85"
             />
             {errors.area && (
               <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
             )}
           </div>

           {(watchedPropertyType === 'Căn hộ chung cư' || watchedPropertyType === 'Nhà riêng' || watchedPropertyType === 'Biệt thự') && (
             <>
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Số phòng ngủ
                 </label>
                 <input
                   type="number"
                   {...register('bedrooms', { min: { value: 0, message: 'Số phòng ngủ không hợp lệ' } })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="2"
                 />
                 {errors.bedrooms && (
                   <p className="mt-1 text-sm text-red-600">{errors.bedrooms.message}</p>
                 )}
               </div>

               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                   Số phòng tắm
                 </label>
                 <input
                   type="number"
                   {...register('bathrooms', { min: { value: 0, message: 'Số phòng tắm không hợp lệ' } })}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                   placeholder="2"
                 />
                 {errors.bathrooms && (
                   <p className="mt-1 text-sm text-red-600">{errors.bathrooms.message}</p>
                 )}
               </div>
             </>
           )}

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Năm xây dựng
             </label>
             <input
               type="number"
               {...register('yearBuilt', { 
                 min: { value: 1900, message: 'Năm xây dựng không hợp lệ' },
                 max: { value: new Date().getFullYear() + 5, message: 'Năm xây dựng không hợp lệ' }
               })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="2020"
             />
             {errors.yearBuilt && (
               <p className="mt-1 text-sm text-red-600">{errors.yearBuilt.message}</p>
             )}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Hướng nhà
             </label>
             <select
               {...register('direction')}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             >
               <option value="">Chọn hướng</option>
               {directions.map(direction => (
                 <option key={direction} value={direction}>{direction}</option>
               ))}
             </select>
           </div>
         </div>
       </div>

       {/* Address & Legal Section */}
       <div className="bg-gray-50 rounded-lg p-6">
         <div className="flex items-center mb-6">
           <MapPin className="w-6 h-6 text-blue-600 mr-3" />
           <h3 className="text-xl font-bold text-gray-900">Địa chỉ & Pháp lý</h3>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Địa chỉ cụ thể *
             </label>
             <input
               type="text"
               {...register('address', { required: 'Vui lòng nhập địa chỉ' })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="VD: 123 Đường ABC, Phường XYZ..."
             />
             {errors.address && (
               <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
             )}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Tỉnh/Thành phố *
             </label>
             <select
               {...register('city', { required: 'Vui lòng chọn tỉnh/thành phố' })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             >
               {cities.map(city => (
                 <option key={city} value={city}>{city}</option>
               ))}
             </select>
             {errors.city && (
               <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
             )}
           </div>

           {watchedCity === 'TP. Hồ Chí Minh' && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-2">
                 Quận/Huyện *
               </label>
               <select
                 {...register('district', { required: 'Vui lòng chọn quận/huyện' })}
                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               >
                 <option value="">Chọn quận/huyện</option>
                 {districts.map(district => (
                   <option key={district} value={district}>{district}</option>
                 ))}
               </select>
               {errors.district && (
                 <p className="mt-1 text-sm text-red-600">{errors.district.message}</p>
               )}
             </div>
           )}

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Tình trạng pháp lý *
             </label>
             <select
               {...register('legalStatus', { required: 'Vui lòng chọn tình trạng pháp lý' })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
             >
               {legalStatuses.map(status => (
                 <option key={status} value={status}>{status}</option>
               ))}
             </select>
             {errors.legalStatus && (
               <p className="mt-1 text-sm text-red-600">{errors.legalStatus.message}</p>
             )}
           </div>

           <div>
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Giá mong muốn (tỷ VNĐ)
             </label>
             <input
               type="number"
               step="0.1"
               {...register('expectedPrice', { min: { value: 0, message: 'Giá không hợp lệ' } })}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="5.2"
             />
             {errors.expectedPrice && (
               <p className="mt-1 text-sm text-red-600">{errors.expectedPrice.message}</p>
             )}
           </div>

           <div className="md:col-span-2">
             <label className="block text-sm font-medium text-gray-700 mb-2">
               Mô tả chi tiết
             </label>
             <textarea
               {...register('description')}
               rows={4}
               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="Mô tả thêm về bất động sản: vị trí, tiện ích, đặc điểm nổi bật..."
             />
           </div>
         </div>
       </div>

       {/* File Upload Section */}
       <div className="bg-gray-50 rounded-lg p-6">
         <div className="flex items-center mb-6">
           <Camera className="w-6 h-6 text-blue-600 mr-3" />
           <h3 className="text-xl font-bold text-gray-900">Hình ảnh & Tài liệu</h3>
         </div>
         
         {/* File Upload */}
         <div
           {...getRootProps()}
           className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors mb-6 ${
             isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
           }`}
         >
           <input {...getInputProps()} />
           <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
           <p className="text-lg font-medium text-gray-900 mb-2">
             {isDragActive ? 'Thả file vào đây...' : 'Kéo thả file hoặc click để chọn'}
           </p>
           <p className="text-sm text-gray-600 mb-4">
             Hỗ trợ: JPG, PNG, PDF, DOC, DOCX (tối đa 10MB)
           </p>
           <button
             type="button"
             className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
           >
             Chọn file
           </button>
         </div>

         {/* Uploaded Files */}
         {uploadedFiles.length > 0 && (
           <div className="mb-6">
             <h4 className="text-lg font-semibold text-gray-900 mb-4">
               File đã tải lên ({uploadedFiles.length})
             </h4>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {uploadedFiles.map((uploadedFile, index) => (
                 <div key={index} className="relative group">
                   {uploadedFile.type === 'image' ? (
                     <img
                       src={uploadedFile.preview}
                       alt={`Upload ${index + 1}`}
                       className="w-full h-32 object-cover rounded-lg"
                     />
                   ) : (
                     <div className="w-full h-32 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                       <FileText className="w-8 h-8 text-gray-400 mb-2" />
                       <span className="text-xs text-gray-600 text-center px-2">
                         {uploadedFile.file.name}
                       </span>
                     </div>
                   )}
                   <button
                     type="button"
                     onClick={() => removeFile(index)}
                     className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               ))}
             </div>
           </div>
         )}


       </div>
     </div>
   );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Định giá bất động sản</h1>
            <p className="text-lg text-gray-600">Nhận báo cáo định giá chính xác từ AI trong vài phút</p>
          </div>
          

        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-xl shadow-md p-8">
            {renderFormContent()}

            {/* Submit Button */}
            <div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-lg"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-5 h-5 mr-2" />
                    Tạo báo cáo định giá
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}