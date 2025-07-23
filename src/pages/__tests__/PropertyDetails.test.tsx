import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { mockProperty, mockValuation, mockApiResponse } from '../../test/utils';
import PropertyDetails from '../PropertyDetails';

// Mock the property service
const mockPropertyService = {
  getPropertyById: jest.fn(),
  getPropertyValuation: jest.fn(),
  getSimilarProperties: jest.fn(),
};

jest.mock('../../services/propertyService', () => mockPropertyService);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ id: '1' }),
  useNavigate: () => jest.fn(),
}));

describe('PropertyDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockPropertyService.getPropertyById.mockResolvedValue(mockProperty);
    mockPropertyService.getPropertyValuation.mockResolvedValue(mockValuation);
    mockPropertyService.getSimilarProperties.mockResolvedValue([]);
    
    global.fetch = jest.fn().mockResolvedValue(mockApiResponse.success(mockProperty));
  });

  it('renders loading state initially', () => {
    render(<PropertyDetails />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('displays property information after loading', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Test Property')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Test Location')).toBeInTheDocument();
    expect(screen.getByText('₫1.00 billion')).toBeInTheDocument();
  });

  it('shows property details in info card', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Property Type')).toBeInTheDocument();
    });
    
    expect(screen.getByText('apartment')).toBeInTheDocument();
    expect(screen.getByText('100 m²')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument(); // bedrooms
    expect(screen.getByText('2')).toBeInTheDocument(); // bathrooms
  });

  it('displays property amenities', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Swimming Pool')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Gym')).toBeInTheDocument();
    expect(screen.getByText('Security')).toBeInTheDocument();
  });

  it('shows tabbed interface for different sections', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Valuation')).toBeInTheDocument();
    expect(screen.getByText('Location')).toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Overview')).toBeInTheDocument();
    });
    
    // Click on Valuation tab
    const valuationTab = screen.getByText('Valuation');
    fireEvent.click(valuationTab);
    
    // Check if valuation content is displayed
    await waitFor(() => {
      expect(screen.getByText('AI Valuation Summary')).toBeInTheDocument();
    });
  });

  it('displays valuation information in valuation tab', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Valuation')).toBeInTheDocument();
    });
    
    // Click on Valuation tab
    fireEvent.click(screen.getByText('Valuation'));
    
    await waitFor(() => {
      expect(screen.getByText('₫1.20 billion')).toBeInTheDocument();
    });
    
    expect(screen.getByText('85%')).toBeInTheDocument(); // confidence score
  });

  it('shows location tab with map', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Location')).toBeInTheDocument();
    });
    
    // Click on Location tab
    fireEvent.click(screen.getByText('Location'));
    
    await waitFor(() => {
      expect(screen.getByTestId('map-container')).toBeInTheDocument();
    });
  });

  it('displays image gallery', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByAltText('Property Image 1')).toBeInTheDocument();
    });
  });

  it('shows similar properties section', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Similar Properties')).toBeInTheDocument();
    });
  });

  it('displays quick valuation section', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Quick Valuation')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Get instant property valuation')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate report/i })).toBeInTheDocument();
  });

  it('handles generate valuation report button click', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /generate report/i })).toBeInTheDocument();
    });
    
    const generateButton = screen.getByRole('button', { name: /generate report/i });
    fireEvent.click(generateButton);
    
    // Should show some feedback or navigation
    await waitFor(() => {
      expect(generateButton).toBeInTheDocument();
    });
  });

  it('handles error state when property not found', async () => {
    mockPropertyService.getPropertyById.mockRejectedValue(new Error('Property not found'));
    global.fetch = jest.fn().mockResolvedValue(mockApiResponse.error(404, 'Not Found'));
    
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Property not found')).toBeInTheDocument();
    });
  });

  it('displays property description in overview tab', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Test property description')).toBeInTheDocument();
    });
  });

  it('shows charts in valuation tab', async () => {
    render(<PropertyDetails />);
    
    await waitFor(() => {
      expect(screen.getByText('Valuation')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Valuation'));
    
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });
});