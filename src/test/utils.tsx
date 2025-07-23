import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Mock data generators
export const mockProperty = {
  id: '1',
  title: 'Test Property',
  location: 'Test Location',
  price: 1000000000,
  area: 100,
  bedrooms: 3,
  bathrooms: 2,
  parking: 1,
  year_built: 2020,
  floor: 5,
  direction: 'South',
  legal_status: 'Full ownership',
  description: 'Test property description',
  amenities: ['Swimming Pool', 'Gym', 'Security'],
  images: [
    {
      id: '1',
      url: 'https://example.com/image1.jpg',
      alt: 'Property Image 1',
      is_primary: true
    }
  ],
  property_type: 'apartment',
  district: 'District 1',
  ward: 'Ward 1',
  street: 'Test Street',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockValuation = {
  id: '1',
  property_id: '1',
  estimated_value: 1200000000,
  confidence_score: 0.85,
  valuation_date: '2024-01-01T00:00:00Z',
  methodology: 'Comparative Market Analysis',
  notes: 'Test valuation notes',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z'
};

export const mockComparableProperty = {
  id: '2',
  title: 'Comparable Property',
  location: 'Similar Location',
  price: 950000000,
  area: 95,
  bedrooms: 3,
  bathrooms: 2,
  distance: 0.5,
  similarity_score: 0.9
};

// Mock API responses
export const mockApiResponse = {
  success: <T>(data: T) => ({
    ok: true,
    json: async () => data,
    status: 200,
    statusText: 'OK'
  }),
  error: (status: number = 400, message: string = 'Bad Request') => ({
    ok: false,
    json: async () => ({ error: message }),
    status,
    statusText: message
  })
};

// Wait for async operations
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { customRender as render };