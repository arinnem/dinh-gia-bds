import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import Home from '../Home';

// Mock the property service
jest.mock('../../services/propertyService', () => ({
  searchProperties: jest.fn(),
  getFeaturedProperties: jest.fn(),
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the hero section with search functionality', () => {
    render(<Home />);
    
    // Check for hero section elements
    expect(screen.getByText('Find Your Perfect Property')).toBeInTheDocument();
    expect(screen.getByText('Discover the best real estate opportunities with our advanced valuation platform')).toBeInTheDocument();
    
    // Check for search form
    expect(screen.getByPlaceholderText('Enter location, property type, or keywords...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search properties/i })).toBeInTheDocument();
  });

  it('displays quick action buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('Quick Valuation')).toBeInTheDocument();
    expect(screen.getByText('Browse Properties')).toBeInTheDocument();
    expect(screen.getByText('Market Analysis')).toBeInTheDocument();
  });

  it('shows market statistics section', () => {
    render(<Home />);
    
    expect(screen.getByText('Market Overview')).toBeInTheDocument();
    expect(screen.getByText('Total Properties')).toBeInTheDocument();
    expect(screen.getByText('Average Price')).toBeInTheDocument();
    expect(screen.getByText('Price Growth')).toBeInTheDocument();
    expect(screen.getByText('Market Activity')).toBeInTheDocument();
  });

  it('displays featured properties section', () => {
    render(<Home />);
    
    expect(screen.getByText('Featured Properties')).toBeInTheDocument();
    expect(screen.getByText('Discover our handpicked selection of premium properties')).toBeInTheDocument();
  });

  it('handles search form submission', async () => {
    render(<Home />);
    
    const searchInput = screen.getByPlaceholderText('Enter location, property type, or keywords...');
    const searchButton = screen.getByRole('button', { name: /search properties/i });
    
    // Type in search input
    fireEvent.change(searchInput, { target: { value: 'District 1' } });
    expect(searchInput).toHaveValue('District 1');
    
    // Submit search form
    fireEvent.click(searchButton);
    
    // Wait for any async operations
    await waitFor(() => {
      expect(searchInput).toHaveValue('District 1');
    });
  });

  it('renders property type filter buttons', () => {
    render(<Home />);
    
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Apartment')).toBeInTheDocument();
    expect(screen.getByText('House')).toBeInTheDocument();
    expect(screen.getByText('Villa')).toBeInTheDocument();
    expect(screen.getByText('Office')).toBeInTheDocument();
  });

  it('handles property type filter selection', () => {
    render(<Home />);
    
    const apartmentFilter = screen.getByText('Apartment');
    fireEvent.click(apartmentFilter);
    
    // Check if the filter is visually selected (assuming it has active styling)
    expect(apartmentFilter.closest('button')).toHaveClass('bg-blue-600');
  });

  it('displays mock featured properties', () => {
    render(<Home />);
    
    // Check for mock property data
    expect(screen.getByText('Luxury Apartment in District 1')).toBeInTheDocument();
    expect(screen.getByText('Modern Villa in District 2')).toBeInTheDocument();
    expect(screen.getByText('Cozy House in District 7')).toBeInTheDocument();
  });

  it('shows property details in featured section', () => {
    render(<Home />);
    
    // Check for property details
    expect(screen.getByText('₫15.5 billion')).toBeInTheDocument();
    expect(screen.getByText('120 m²')).toBeInTheDocument();
    expect(screen.getByText('3 beds')).toBeInTheDocument();
    expect(screen.getByText('2 baths')).toBeInTheDocument();
  });

  it('has accessible navigation elements', () => {
    render(<Home />);
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Market Overview' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Featured Properties' })).toBeInTheDocument();
  });
});