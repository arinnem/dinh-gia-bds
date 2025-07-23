import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, SearchFilters, Property } from '../services/api';

// User Store
interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()((
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      setUser: (user) => set({ 
        user, 
        isAuthenticated: !!user 
      }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ 
        user: null, 
        isAuthenticated: false 
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
));

// Search Store
interface SearchState {
  filters: SearchFilters;
  searchHistory: string[];
  recentSearches: SearchFilters[];
  savedSearches: (SearchFilters & { id: string; name: string; createdAt: string })[];
  setFilters: (filters: Partial<SearchFilters>) => void;
  resetFilters: () => void;
  addToHistory: (query: string) => void;
  addRecentSearch: (filters: SearchFilters) => void;
  saveSearch: (filters: SearchFilters, name: string) => void;
  removeSavedSearch: (id: string) => void;
  clearHistory: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  type: '',
  minPrice: undefined,
  maxPrice: undefined,
  minArea: undefined,
  maxArea: undefined,
  bedrooms: undefined,
  bathrooms: undefined,
  district: '',
  city: 'ho-chi-minh',
  sortBy: 'date',
  sortOrder: 'desc',
  page: 1,
  limit: 12,
};

export const useSearchStore = create<SearchState>()((
  persist(
    (set, get) => ({
      filters: defaultFilters,
      searchHistory: [],
      recentSearches: [],
      savedSearches: [],
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters, page: 1 }
      })),
      resetFilters: () => set({ filters: defaultFilters }),
      addToHistory: (query) => {
        if (!query.trim()) return;
        set((state) => {
          const newHistory = [query, ...state.searchHistory.filter(h => h !== query)].slice(0, 10);
          return { searchHistory: newHistory };
        });
      },
      addRecentSearch: (filters) => {
        set((state) => {
          const newRecent = [filters, ...state.recentSearches.filter(
            s => JSON.stringify(s) !== JSON.stringify(filters)
          )].slice(0, 5);
          return { recentSearches: newRecent };
        });
      },
      saveSearch: (filters, name) => {
        const id = Date.now().toString();
        const savedSearch = {
          id,
          name,
          ...filters,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({
          savedSearches: [savedSearch, ...state.savedSearches]
        }));
      },
      removeSavedSearch: (id) => {
        set((state) => ({
          savedSearches: state.savedSearches.filter(s => s.id !== id)
        }));
      },
      clearHistory: () => set({ 
        searchHistory: [], 
        recentSearches: [] 
      }),
    }),
    {
      name: 'search-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
));

// Favorites Store
interface FavoritesState {
  favoriteProperties: string[];
  favoriteSearches: string[];
  addToFavorites: (propertyId: string) => void;
  removeFromFavorites: (propertyId: string) => void;
  isFavorite: (propertyId: string) => boolean;
  addFavoriteSearch: (searchId: string) => void;
  removeFavoriteSearch: (searchId: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()((
  persist(
    (set, get) => ({
      favoriteProperties: [],
      favoriteSearches: [],
      addToFavorites: (propertyId) => {
        set((state) => ({
          favoriteProperties: [...new Set([...state.favoriteProperties, propertyId])]
        }));
      },
      removeFromFavorites: (propertyId) => {
        set((state) => ({
          favoriteProperties: state.favoriteProperties.filter(id => id !== propertyId)
        }));
      },
      isFavorite: (propertyId) => {
        return get().favoriteProperties.includes(propertyId);
      },
      addFavoriteSearch: (searchId) => {
        set((state) => ({
          favoriteSearches: [...new Set([...state.favoriteSearches, searchId])]
        }));
      },
      removeFavoriteSearch: (searchId) => {
        set((state) => ({
          favoriteSearches: state.favoriteSearches.filter(id => id !== searchId)
        }));
      },
      clearFavorites: () => set({ 
        favoriteProperties: [], 
        favoriteSearches: [] 
      }),
    }),
    {
      name: 'favorites-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
));

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'vi' | 'en';
  mapView: 'list' | 'map' | 'both';
  notifications: Notification[];
  loading: Record<string, boolean>;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (language: 'vi' | 'en') => void;
  setMapView: (view: 'list' | 'map' | 'both') => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
  setLoading: (key: string, loading: boolean) => void;
  isLoading: (key: string) => boolean;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useUIStore = create<UIState>()((
  persist(
    (set, get) => ({
      sidebarOpen: false,
      theme: 'system',
      language: 'vi',
      mapView: 'both',
      notifications: [],
      loading: {},
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setMapView: (mapView) => set({ mapView }),
      addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification: Notification = {
          ...notification,
          id,
          timestamp: new Date().toISOString(),
          read: false,
        };
        set((state) => ({
          notifications: [newNotification, ...state.notifications].slice(0, 50)
        }));
      },
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },
      clearNotifications: () => set({ notifications: [] }),
      setLoading: (key, loading) => {
        set((state) => ({
          loading: { ...state.loading, [key]: loading }
        }));
      },
      isLoading: (key) => {
        return get().loading[key] || false;
      },
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        language: state.language,
        mapView: state.mapView,
      }),
    }
  )
));

// Property Comparison Store
interface ComparisonState {
  compareList: Property[];
  addToCompare: (property: Property) => void;
  removeFromCompare: (propertyId: string) => void;
  clearCompare: () => void;
  isInCompare: (propertyId: string) => boolean;
  canAddMore: () => boolean;
}

export const useComparisonStore = create<ComparisonState>((set, get) => ({
  compareList: [],
  addToCompare: (property) => {
    const { compareList } = get();
    if (compareList.length >= 3) return; // Max 3 properties
    if (compareList.find(p => p.id === property.id)) return; // Already in list
    
    set({ compareList: [...compareList, property] });
  },
  removeFromCompare: (propertyId) => {
    set((state) => ({
      compareList: state.compareList.filter(p => p.id !== propertyId)
    }));
  },
  clearCompare: () => set({ compareList: [] }),
  isInCompare: (propertyId) => {
    return get().compareList.some(p => p.id === propertyId);
  },
  canAddMore: () => {
    return get().compareList.length < 3;
  },
}));

// Recent Views Store
interface RecentViewsState {
  recentProperties: Property[];
  recentSearches: SearchFilters[];
  addRecentProperty: (property: Property) => void;
  addRecentSearch: (search: SearchFilters) => void;
  clearRecentProperties: () => void;
  clearRecentSearches: () => void;
}

export const useRecentViewsStore = create<RecentViewsState>()((
  persist(
    (set) => ({
      recentProperties: [],
      recentSearches: [],
      addRecentProperty: (property) => {
        set((state) => {
          const filtered = state.recentProperties.filter(p => p.id !== property.id);
          return {
            recentProperties: [property, ...filtered].slice(0, 10)
          };
        });
      },
      addRecentSearch: (search) => {
        set((state) => {
          const filtered = state.recentSearches.filter(
            s => JSON.stringify(s) !== JSON.stringify(search)
          );
          return {
            recentSearches: [search, ...filtered].slice(0, 5)
          };
        });
      },
      clearRecentProperties: () => set({ recentProperties: [] }),
      clearRecentSearches: () => set({ recentSearches: [] }),
    }),
    {
      name: 'recent-views-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
));

// Settings Store
interface SettingsState {
  preferences: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    marketingEmails: boolean;
    priceAlerts: boolean;
    newListingAlerts: boolean;
    reportReminders: boolean;
    currency: 'VND' | 'USD';
    measurementUnit: 'metric' | 'imperial';
    defaultMapZoom: number;
    autoSaveSearches: boolean;
    showPropertyTips: boolean;
    compactView: boolean;
  };
  updatePreferences: (preferences: Partial<SettingsState['preferences']>) => void;
  resetPreferences: () => void;
}

const defaultPreferences: SettingsState['preferences'] = {
  emailNotifications: true,
  pushNotifications: true,
  marketingEmails: false,
  priceAlerts: true,
  newListingAlerts: true,
  reportReminders: true,
  currency: 'VND',
  measurementUnit: 'metric',
  defaultMapZoom: 12,
  autoSaveSearches: true,
  showPropertyTips: true,
  compactView: false,
};

export const useSettingsStore = create<SettingsState>()((
  persist(
    (set) => ({
      preferences: defaultPreferences,
      updatePreferences: (newPreferences) => {
        set((state) => ({
          preferences: { ...state.preferences, ...newPreferences }
        }));
      },
      resetPreferences: () => set({ preferences: defaultPreferences }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
));

// Analytics Store (for tracking user behavior)
interface AnalyticsState {
  events: AnalyticsEvent[];
  trackEvent: (event: Omit<AnalyticsEvent, 'id' | 'timestamp'>) => void;
  getEvents: (type?: string) => AnalyticsEvent[];
  clearEvents: () => void;
}

interface AnalyticsEvent {
  id: string;
  type: 'search' | 'view' | 'click' | 'download' | 'share' | 'favorite' | 'compare';
  action: string;
  data: Record<string, any>;
  timestamp: string;
}

export const useAnalyticsStore = create<AnalyticsState>()((
  persist(
    (set, get) => ({
      events: [],
      trackEvent: (event) => {
        const id = Date.now().toString();
        const newEvent: AnalyticsEvent = {
          ...event,
          id,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({
          events: [newEvent, ...state.events].slice(0, 1000) // Keep last 1000 events
        }));
      },
      getEvents: (type) => {
        const { events } = get();
        return type ? events.filter(e => e.type === type) : events;
      },
      clearEvents: () => set({ events: [] }),
    }),
    {
      name: 'analytics-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        events: state.events.slice(0, 100) // Only persist last 100 events
      }),
    }
  )
));

// Combined store selectors for convenience
export const useAppStore = () => {
  const user = useUserStore();
  const search = useSearchStore();
  const favorites = useFavoritesStore();
  const ui = useUIStore();
  const comparison = useComparisonStore();
  const recentViews = useRecentViewsStore();
  const settings = useSettingsStore();
  const analytics = useAnalyticsStore();

  return {
    user,
    search,
    favorites,
    ui,
    comparison,
    recentViews,
    settings,
    analytics,
  };
};

// Store actions for common operations
export const storeActions = {
  // Initialize app with user data
  initializeApp: (user: User | null) => {
    useUserStore.getState().setUser(user);
    if (user) {
      useUIStore.getState().addNotification({
        type: 'success',
        title: 'Chào mừng trở lại!',
        message: `Xin chào ${user.name}`,
      });
    }
  },

  // Handle search with analytics
  performSearch: (filters: SearchFilters) => {
    useSearchStore.getState().setFilters(filters);
    useSearchStore.getState().addRecentSearch(filters);
    useAnalyticsStore.getState().trackEvent({
      type: 'search',
      action: 'property_search',
      data: { filters },
    });
  },

  // Handle property view with analytics
  viewProperty: (property: Property) => {
    useRecentViewsStore.getState().addRecentProperty(property);
    useAnalyticsStore.getState().trackEvent({
      type: 'view',
      action: 'property_view',
      data: { propertyId: property.id, propertyType: property.type },
    });
  },

  // Handle logout
  logout: () => {
    useUserStore.getState().logout();
    useFavoritesStore.getState().clearFavorites();
    useComparisonStore.getState().clearCompare();
    useUIStore.getState().clearNotifications();
  },

  // Clear all user data
  clearAllData: () => {
    useUserStore.getState().logout();
    useSearchStore.getState().clearHistory();
    useFavoritesStore.getState().clearFavorites();
    useComparisonStore.getState().clearCompare();
    useRecentViewsStore.getState().clearRecentProperties();
    useRecentViewsStore.getState().clearRecentSearches();
    useUIStore.getState().clearNotifications();
    useAnalyticsStore.getState().clearEvents();
  },
};

export default useAppStore;