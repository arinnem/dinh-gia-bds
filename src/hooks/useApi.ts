import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import api, {
  Property,
  PropertyValuation,
  SearchFilters,
  SearchResponse,
  User,
  Report,
  MarketData,
} from '../services/api';

// Query Keys
export const queryKeys = {
  properties: {
    all: ['properties'] as const,
    search: (filters: SearchFilters) => ['properties', 'search', filters] as const,
    detail: (id: string) => ['properties', 'detail', id] as const,
    similar: (id: string) => ['properties', 'similar', id] as const,
    valuation: (id: string) => ['properties', 'valuation', id] as const,
  },
  valuations: {
    all: ['valuations'] as const,
    user: (page: number) => ['valuations', 'user', page] as const,
  },
  market: {
    all: ['market'] as const,
    data: (city?: string, district?: string) => ['market', 'data', city, district] as const,
    trends: (period: string) => ['market', 'trends', period] as const,
    districts: (city: string) => ['market', 'districts', city] as const,
  },
  reports: {
    all: ['reports'] as const,
    list: (page: number) => ['reports', 'list', page] as const,
    detail: (id: string) => ['reports', 'detail', id] as const,
  },
  user: {
    current: ['user', 'current'] as const,
  },
  admin: {
    stats: ['admin', 'stats'] as const,
    users: (page: number) => ['admin', 'users', page] as const,
  },
};

// Properties Hooks
export const useSearchProperties = (filters: SearchFilters = {}) => {
  return useQuery({
    queryKey: queryKeys.properties.search(filters),
    queryFn: () => api.searchProperties(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => api.getProperty(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSimilarProperties = (id: string, limit: number = 5) => {
  return useQuery({
    queryKey: queryKeys.properties.similar(id),
    queryFn: () => api.getSimilarProperties(id, limit),
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 minutes
  });
};

export const usePropertyValuation = (id: string) => {
  return useQuery({
    queryKey: queryKeys.properties.valuation(id),
    queryFn: () => api.getPropertyValuation(id),
    enabled: !!id,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyData: Omit<Property, 'id' | 'createdAt' | 'updatedAt'>) =>
      api.createProperty(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success('Bất động sản đã được tạo thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo bất động sản: ${error.message}`);
    },
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Property> }) =>
      api.updateProperty(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success('Bất động sản đã được cập nhật!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật bất động sản: ${error.message}`);
    },
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteProperty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all });
      toast.success('Bất động sản đã được xóa!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa bất động sản: ${error.message}`);
    },
  });
};

// Valuation Hooks
export const useRequestValuation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (propertyData: {
      type: string;
      area: number;
      bedrooms?: number;
      bathrooms?: number;
      address: string;
      district: string;
      city: string;
      yearBuilt?: number;
      direction?: string;
      amenities?: string[];
    }) => api.requestValuation(propertyData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.valuations.all });
      toast.success('Yêu cầu định giá đã được gửi thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi gửi yêu cầu định giá: ${error.message}`);
    },
  });
};

export const useUserValuations = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.valuations.user(page),
    queryFn: () => api.getUserValuations(page, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Market Data Hooks
export const useMarketData = (city?: string, district?: string) => {
  return useQuery({
    queryKey: queryKeys.market.data(city, district),
    queryFn: () => api.getMarketData(city, district),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useMarketTrends = (period: '1m' | '3m' | '6m' | '1y' = '6m') => {
  return useQuery({
    queryKey: queryKeys.market.trends(period),
    queryFn: () => api.getMarketTrends(period),
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

export const useDistrictAnalysis = (city: string) => {
  return useQuery({
    queryKey: queryKeys.market.districts(city),
    queryFn: () => api.getDistrictAnalysis(city),
    enabled: !!city,
    staleTime: 60 * 60 * 1000, // 1 hour
  });
};

// Reports Hooks
export const useReports = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.reports.list(page),
    queryFn: () => api.getReports(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useReport = (id: string) => {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => api.getReport(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGenerateReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: {
      type: 'valuation' | 'market' | 'investment' | 'portfolio';
      format: 'pdf' | 'excel' | 'word';
      propertyIds?: string[];
      filters?: any;
      template?: string;
    }) => api.generateReport(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      toast.success('Báo cáo đang được tạo. Bạn sẽ nhận được thông báo khi hoàn thành.');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tạo báo cáo: ${error.message}`);
    },
  });
};

export const useDownloadReport = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await api.downloadReport(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${id}.pdf`; // Default filename
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onSuccess: () => {
      toast.success('Báo cáo đã được tải xuống!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi tải báo cáo: ${error.message}`);
    },
  });
};

export const useDeleteReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => api.deleteReport(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reports.all });
      toast.success('Báo cáo đã được xóa!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi xóa báo cáo: ${error.message}`);
    },
  });
};

// File Upload Hooks
export const useUploadFile = () => {
  return useMutation({
    mutationFn: ({ file, type }: { file: File; type?: 'property' | 'document' }) =>
      api.uploadFile(file, type),
    onSuccess: () => {
      toast.success('File đã được upload thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi upload file: ${error.message}`);
    },
  });
};

export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: ({ files, type }: { files: File[]; type?: 'property' | 'document' }) =>
      api.uploadMultipleFiles(files, type),
    onSuccess: () => {
      toast.success('Các file đã được upload thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi upload files: ${error.message}`);
    },
  });
};

// Authentication Hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      api.login(email, password),
    onSuccess: (data) => {
      api.setToken(data.token);
      queryClient.setQueryData(queryKeys.user.current, data.user);
      toast.success('Đăng nhập thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi đăng nhập: ${error.message}`);
    },
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: {
      email: string;
      password: string;
      name: string;
    }) => api.register(userData),
    onSuccess: (data) => {
      api.setToken(data.token);
      queryClient.setQueryData(queryKeys.user.current, data.user);
      toast.success('Đăng ký thành công!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi đăng ký: ${error.message}`);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      api.clearToken();
      queryClient.clear();
    },
    onSuccess: () => {
      toast.success('Đăng xuất thành công!');
    },
  });
};

export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.user.current,
    queryFn: () => api.getCurrentUser(),
    retry: false,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

// Admin Hooks
export const useSystemStats = () => {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: () => api.getSystemStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUsers = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: queryKeys.admin.users(page),
    queryFn: () => api.getUsers(page, limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: 'user' | 'admin' }) =>
      api.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users(1) });
      toast.success('Vai trò người dùng đã được cập nhật!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi cập nhật vai trò: ${error.message}`);
    },
  });
};

// Scraping Hooks
export const useTriggerScraping = () => {
  return useMutation({
    mutationFn: (sources: string[] = []) => api.triggerScraping(sources),
    onSuccess: () => {
      toast.success('Quá trình thu thập dữ liệu đã được khởi động!');
    },
    onError: (error: Error) => {
      toast.error(`Lỗi khởi động thu thập dữ liệu: ${error.message}`);
    },
  });
};

export const useScrapingStatus = (jobId: string) => {
  return useQuery({
    queryKey: ['scraping', 'status', jobId],
    queryFn: () => api.getScrapingStatus(jobId),
    enabled: !!jobId,
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 0, // Always fresh
  });
};

// Custom hooks for common patterns
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const usePagination = (initialPage: number = 1) => {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(10);

  const nextPage = () => setPage(prev => prev + 1);
  const prevPage = () => setPage(prev => Math.max(1, prev - 1));
  const goToPage = (newPage: number) => setPage(Math.max(1, newPage));
  const resetPage = () => setPage(1);

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    goToPage,
    resetPage,
  };
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
};

// Import React hooks
import { useState, useEffect } from 'react';