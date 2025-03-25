import { render, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import PoolGraphByEpoch from '../PoolGraphByEpoch';
import '@testing-library/jest-dom/vitest';
import { vi, describe, test, expect, beforeEach } from 'vitest';

// Mock axios
vi.mock('axios');

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }) => <div data-testid="mock-line-chart">{children}</div>,
  Line: () => <div data-testid="mock-line" />,
  XAxis: () => <div data-testid="mock-x-axis" />,
  YAxis: () => <div data-testid="mock-y-axis" />,
  CartesianGrid: () => <div data-testid="mock-cartesian-grid" />,
  Tooltip: () => <div data-testid="mock-tooltip" />,
  Legend: () => <div data-testid="mock-legend" />,
  ResponsiveContainer: ({ children }) => <div data-testid="mock-responsive-container">{children}</div>
}));

// Mock d3
vi.mock('d3', () => {
  const mockG = {
    append: vi.fn(() => ({
      attr: vi.fn(() => ({
        call: vi.fn(() => ({
          selectAll: vi.fn(() => ({
            enter: vi.fn(() => ({
              append: vi.fn(() => ({
                attr: vi.fn(() => ({
                  attr: vi.fn(() => ({
                    attr: vi.fn(() => ({
                      attr: vi.fn(() => ({
                        on: vi.fn(() => ({
                          on: vi.fn()
                        }))
                      }))
                    }))
                  }))
                }))
              }))
            }))
          }))
        }))
      }))
    }))
  };

  const mockSvg = {
    append: vi.fn(() => mockG),
    selectAll: vi.fn(() => ({
      remove: vi.fn()
    }))
  };

  return {
    select: vi.fn(() => mockSvg),
    scaleSequential: vi.fn(() => ({
      domain: vi.fn(() => ({
        interpolateBlues: vi.fn(() => vi.fn())
      }))
    })),
    scaleBand: vi.fn(() => ({
      domain: vi.fn(() => ({
        range: vi.fn(() => ({
          padding: vi.fn(() => ({
            bandwidth: vi.fn(() => 50)
          }))
        }))
      }))
    })),
    axisBottom: vi.fn(() => ({
      tickValues: vi.fn(() => ({
        call: vi.fn()
      }))
    })),
    format: vi.fn(() => vi.fn()),
    max: vi.fn(() => 1000),
    interpolateBlues: vi.fn(() => vi.fn())
  };
});

// Mock ResizeObserver
class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = ResizeObserver;

describe('PoolGraphByEpoch Component', () => {
  const mockApiResponse = {
    data: {
      rows: [
        {
          block_epoch: 1,
          block: 100,
          active_stake: 1000000,
          live_stake: 900000
        },
        {
          block_epoch: 2,
          block: 200,
          active_stake: 2000000,
          live_stake: 1800000
        }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    axios.get.mockResolvedValue(mockApiResponse);
  });

  test('renders loading state initially', () => {
    render(<PoolGraphByEpoch />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    const errorMessage = 'API Error';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));
    
    render(<PoolGraphByEpoch />);
    
    await waitFor(() => {
      expect(screen.getByText('Loading data...')).toBeInTheDocument();
    }, { timeout: 10000 });
  });
}); 