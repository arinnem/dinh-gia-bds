import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import * as React from 'react';
import { afterEach, beforeAll, afterAll } from '@jest/globals';

// Extend Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveClass(className: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveValue(value: string | number): R;
      toBeChecked(): R;
      toHaveFocus(): R;
      toBeEmptyDOMElement(): R;
      toContainElement(element: HTMLElement | null): R;
    }
  }
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];
  
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
} as any;

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock Leaflet for map components
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'map-container' }, children);
  },
  TileLayer: () => React.createElement('div', { 'data-testid': 'tile-layer' }),
  Marker: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'marker' }, children);
  },
  Popup: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'popup' }, children);
  },
}));

// Mock recharts components
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'responsive-container' }, children);
  },
  LineChart: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'line-chart' }, children);
  },
  Line: () => React.createElement('div', { 'data-testid': 'line' }),
  XAxis: () => React.createElement('div', { 'data-testid': 'x-axis' }),
  YAxis: () => React.createElement('div', { 'data-testid': 'y-axis' }),
  CartesianGrid: () => React.createElement('div', { 'data-testid': 'cartesian-grid' }),
  Tooltip: () => React.createElement('div', { 'data-testid': 'tooltip' }),
  Legend: () => React.createElement('div', { 'data-testid': 'legend' }),
  PieChart: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'pie-chart' }, children);
  },
  Pie: () => React.createElement('div', { 'data-testid': 'pie' }),
  Cell: () => React.createElement('div', { 'data-testid': 'cell' }),
  BarChart: ({ children }: { children: React.ReactNode }) => {
    return React.createElement('div', { 'data-testid': 'bar-chart' }, children);
  },
  Bar: () => React.createElement('div', { 'data-testid': 'bar' }),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock fetch for API calls
beforeAll(() => {
  global.fetch = jest.fn();
});

// Mock environment variables on window
Object.defineProperty(window, '__VITE_CDN_URL__', {
  value: 'http://localhost:3000/api/v1/files',
  writable: true,
});

Object.defineProperty(window, '__VITE_API_URL__', {
  value: 'http://localhost:3000/api',
  writable: true,
});

afterAll(() => {
  jest.restoreAllMocks();
});