import { describe, it, expect, beforeEach } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '../../test/utils';
import { mockValuation, mockApiResponse } from '../../test/utils';
import ValuationDashboard from '../ValuationDashboard';

// Mock the valuation service
const mockValuationService = {
  getValuations: jest.fn(),
  createValuation: jest.fn(),
  getValuationById: jest.fn(),
  updateValuation: jest.fn(),
  deleteValuation: jest.fn(),
};

jest.mock('../../services/valuationService', () => mockValuationService);

// Mock react-router-dom
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

describe('ValuationDashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mock responses
    mockValuationService.getValuations.mockResolvedValue({
      valuations: [mockValuation],
      total: 1,
      page: 1,
      limit: 10
    });
    
    global.fetch = jest.fn().mockResolvedValue(mockApiResponse.success({ valuations: [mockValuation] }));
  });

  it('renders dashboard header and navigation', () => {
    render(<ValuationDashboard />);
    
    expect(screen.getByText('Valuation Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Manage and analyze property valuations')).toBeInTheDocument();
  });

  it('displays valuation statistics cards', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Total Valuations')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Average Value')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('Accuracy Rate')).toBeInTheDocument();
  });

  it('shows valuation trends chart', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Valuation Trends')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('displays recent valuations table', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Recent Valuations')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Property')).toBeInTheDocument();
    expect(screen.getByText('Estimated Value')).toBeInTheDocument();
    expect(screen.getByText('Confidence')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('shows market analysis section', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Market Analysis')).toBeInTheDocument();
    });
    
    expect(screen.getByText('District Performance')).toBeInTheDocument();
    expect(screen.getByText('Property Type Distribution')).toBeInTheDocument();
  });

  it('displays district performance chart', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('District Performance')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('shows property type distribution chart', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Property Type Distribution')).toBeInTheDocument();
    });
    
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
  });

  it('handles create new valuation button', () => {
    render(<ValuationDashboard />);
    
    const createButton = screen.getByText('New Valuation');
    expect(createButton).toBeInTheDocument();
    
    fireEvent.click(createButton);
    // Should trigger navigation or modal
  });

  it('displays valuation data in table', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('₫1.20 billion')).toBeInTheDocument();
    });
    
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('shows action buttons for each valuation', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('View valuation')).toBeInTheDocument();
    });
    
    expect(screen.getByLabelText('Edit valuation')).toBeInTheDocument();
    expect(screen.getByLabelText('Delete valuation')).toBeInTheDocument();
  });

  it('handles view valuation action', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('View valuation')).toBeInTheDocument();
    });
    
    const viewButton = screen.getByLabelText('View valuation');
    fireEvent.click(viewButton);
    
    // Should trigger navigation or modal
  });

  it('handles edit valuation action', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Edit valuation')).toBeInTheDocument();
    });
    
    const editButton = screen.getByLabelText('Edit valuation');
    fireEvent.click(editButton);
    
    // Should trigger edit mode or modal
  });

  it('handles delete valuation action', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByLabelText('Delete valuation')).toBeInTheDocument();
    });
    
    const deleteButton = screen.getByLabelText('Delete valuation');
    fireEvent.click(deleteButton);
    
    // Should show confirmation dialog
  });

  it('displays filter and search options', () => {
    render(<ValuationDashboard />);
    
    expect(screen.getByPlaceholderText('Search valuations...')).toBeInTheDocument();
    expect(screen.getByText('Filter by Date')).toBeInTheDocument();
    expect(screen.getByText('Filter by Status')).toBeInTheDocument();
  });

  it('handles search input', () => {
    render(<ValuationDashboard />);
    
    const searchInput = screen.getByPlaceholderText('Search valuations...');
    fireEvent.change(searchInput, { target: { value: 'test property' } });
    
    expect(searchInput).toHaveValue('test property');
  });

  it('shows pagination for valuations', async () => {
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Previous')).toBeInTheDocument();
    });
    
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    mockValuationService.getValuations.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({ valuations: [] }), 1000))
    );
    
    render(<ValuationDashboard />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles error state', async () => {
    mockValuationService.getValuations.mockRejectedValue(new Error('Failed to load'));
    
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('Error loading valuations')).toBeInTheDocument();
    });
  });

  it('shows empty state when no valuations', async () => {
    mockValuationService.getValuations.mockResolvedValue({
      valuations: [],
      total: 0,
      page: 1,
      limit: 10
    });
    
    render(<ValuationDashboard />);
    
    await waitFor(() => {
      expect(screen.getByText('No valuations found')).toBeInTheDocument();
    });
  });

  it('displays export options', () => {
    render(<ValuationDashboard />);
    
    expect(screen.getByText('Export')).toBeInTheDocument();
  });

  it('handles export functionality', () => {
    render(<ValuationDashboard />);
    
    const exportButton = screen.getByText('Export');
    fireEvent.click(exportButton);
    
    // Should trigger export functionality
  });

  it('shows refresh button', () => {
    render(<ValuationDashboard />);
    
    expect(screen.getByLabelText('Refresh data')).toBeInTheDocument();
  });

  it('handles refresh action', async () => {
    render(<ValuationDashboard />);
    
    const refreshButton = screen.getByLabelText('Refresh data');
    fireEvent.click(refreshButton);
    
    await waitFor(() => {
      expect(mockValuationService.getValuations).toHaveBeenCalledTimes(2);
    });
  });
});