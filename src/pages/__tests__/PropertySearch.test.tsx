import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { mockProperty, mockApiResponse } from '../../test/utils';
import PropertySearch from '../PropertySearch';

// Mock the property service
const mockPropertyService = {
  searchProperties: jest.fn(),
  getPropertyTypes: jest.fn(),
  getDistricts: jest.fn(),
};

jest.mock('../../services/propertyService', () => mockPropertyService);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useSearchParams: () => [new URLSearchParams(), jest.fn()],
  useNavigate: () => jest.fn(),
}));

describe('PropertySearch Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockPropertyService.searchProperties.mockResolvedValue({
      properties: [mockProperty],
      total: 1,
      page: 1,
      limit: 10
    });
    mockPropertyService.getPropertyTypes.mockResolvedValue(['apartment', 'house', 'villa']);
    mockPropertyService.getDistricts.mockResolvedValue(['District 1', 'District 2', 'District 3']);
    
    global.fetch = jest.fn().mockResolvedValue(mockApiResponse.success({ properties: [mockProperty] }));
  });

  it('renders search filters and results', () => {
    render(<PropertySearch />);
    
    // Check for search filters
    expect(screen.getByPlaceholderText('Search by location, title...')).toBeInTheDocument();
    expect(screen.getByText('Property Type')).toBeInTheDocument();
    expect(screen.getByText('Price Range')).toBeInTheDocument();
    expect(screen.getByText('Area Range')).toBeInTheDocument();
  });

  it('displays property type filter options', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('All Types')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('House')).toBeInTheDocument();
    expect(screen.getByText('Villa')).toBeInTheDocument();
  });

  it('shows district filter options', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('All Districts')).toBeInTheDocument();
    });
  });

  it('displays search results', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('₫1.00 billion')).toBeInTheDocument();
  });

  it('handles search input changes', async () => {
    render(<PropertySearch />);
    
    const searchInput = screen.getByPlaceholderText('Search by location, title...');
    
    fireEvent.change(searchInput, { target: { value: 'District 1' } });
    
    expect(searchInput).toHaveValue('District 1');
  });

  it('filters properties by type', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('Apartment')).toBeInTheDocument();
    });
    
    const apartmentFilter = screen.getByText('Apartment');
    fireEvent.click(apartmentFilter);
    
    await waitFor(() => {
      expect(mockPropertyService.searchProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          property_type: 'apartment'
        })
      );
    });
  });

  it('shows price range slider', () => {
    render(<PropertySearch />);
    
    expect(screen.getByText('Min Price')).toBeInTheDocument();
    expect(screen.getByText('Max Price')).toBeInTheDocument();
  });

  it('shows area range slider', () => {
    render(<PropertySearch />);
    
    expect(screen.getByText('Min Area (m²)')).toBeInTheDocument();
    expect(screen.getByText('Max Area (m²)')).toBeInTheDocument();
  });

  it('displays bedrooms and bathrooms filters', () => {
    render(<PropertySearch />);
    
    expect(screen.getByText('Bedrooms')).toBeInTheDocument();
    expect(screen.getByText('Bathrooms')).toBeInTheDocument();
  });

  it('shows sort options', () => {
    render(<PropertySearch />);
    
    expect(screen.getByText('Sort by')).toBeInTheDocument();
    expect(screen.getByText('Price: Low to High')).toBeInTheDocument();
    expect(screen.getByText('Price: High to Low')).toBeInTheDocument();
    expect(screen.getByText('Newest First')).toBeInTheDocument();
    expect(screen.getByText('Area: Large to Small')).toBeInTheDocument();
  });

  it('handles sort selection', async () => {
    render(<PropertySearch />);
    
    const sortSelect = screen.getByDisplayValue('Price: Low to High');
    fireEvent.change(sortSelect, { target: { value: 'price_desc' } });
    
    await waitFor(() => {
      expect(mockPropertyService.searchProperties).toHaveBeenCalledWith(
        expect.objectContaining({
          sort: 'price_desc'
        })
      );
    });
  });

  it('displays view toggle buttons', () => {
    render(<PropertySearch />);
    
    expect(screen.getByLabelText('Grid view')).toBeInTheDocument();
    expect(screen.getByLabelText('List view')).toBeInTheDocument();
  });

  it('switches between grid and list view', () => {
    render(<PropertySearch />);
    
    const listViewButton = screen.getByLabelText('List view');
    fireEvent.click(listViewButton);
    
    // Check if view has changed (assuming different styling)
    expect(listViewButton.closest('button')).toHaveClass('bg-blue-600');
  });

  it('shows pagination controls', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('displays results count', async () => {
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('1 properties found')).toBeInTheDocument();
    });
  });

  it('handles empty search results', async () => {
    mockPropertyService.searchProperties.mockResolvedValue({
      properties: [],
      total: 0,
      page: 1,
      limit: 10
    });
    
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('No properties found')).toBeInTheDocument();
    });
  });

  it('shows loading state during search', () => {
    mockPropertyService.searchProperties.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ properties: [], total: 0 }), 1000))
    );
    
    render(<PropertySearch />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles search error', async () => {
    mockPropertyService.searchProperties.mockRejectedValue(new Error('Search failed'));
    
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading properties')).toBeInTheDocument();
    });
  });

  it('clears all filters', async () => {
    render(<PropertySearch />);
    
    // Apply some filters first
    const searchInput = screen.getByPlaceholderText('Search by location, title...');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    
    // Clear filters
    const clearButton = screen.getByText('Clear Filters');
    fireEvent.click(clearButton);
    
    expect(searchInput).toHaveValue('');
  });

  it('navigates to property details on click', async () => {
    const mockNavigate = jest.fn();
    jest.doMock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));
    
    render(<PropertySearch />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });
    
    const propertyCard = screen.getByText('Test Property').closest('div');
    if (propertyCard) {
      fireEvent.click(propertyCard);
    }
  });
});