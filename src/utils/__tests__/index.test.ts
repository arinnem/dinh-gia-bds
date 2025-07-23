import { describe, it, expect } from '@jest/globals';
import {
  formatPrice,
  formatArea,
  formatDate,
  validateEmail,
  cn,
  generateId,
  formatNumber,
  debounce,
  throttle,
  formatPricePerM2,
  validatePhone,
  calculatePercentageChange,
} from '../index';

describe('Utility Functions', () => {
  describe('formatPrice', () => {
    it('formats price in billions correctly', () => {
      expect(formatPrice(1500000000)).toBe('1.5 tỷ');
      expect(formatPrice(1000000000)).toBe('1.0 tỷ');
      expect(formatPrice(2300000000)).toBe('2.3 tỷ');
    });

    it('formats price in millions correctly', () => {
      expect(formatPrice(500000000)).toBe('500 triệu');
      expect(formatPrice(150000000)).toBe('150 triệu');
      expect(formatPrice(50000000)).toBe('50 triệu');
    });

    it('formats smaller prices correctly', () => {
      expect(formatPrice(5000000)).toBe('5 triệu');
      expect(formatPrice(1000000)).toBe('1 triệu');
      expect(formatPrice(500000)).toBe('500k');
    });

    it('handles zero and negative values', () => {
      expect(formatPrice(0)).toBe('0');
      expect(formatPrice(-1000000)).toBe('-1 triệu');
    });
  });

  describe('formatArea', () => {
    it('formats area with correct unit', () => {
      expect(formatArea(100)).toBe('100 m²');
      expect(formatArea(50.5)).toBe('50,5 m²');
      expect(formatArea(1000)).toBe('1.000 m²');
    });

    it('handles decimal places', () => {
      expect(formatArea(100.123)).toBe('100,123 m²');
      expect(formatArea(50.999)).toBe('50,999 m²');
    });
  });

  describe('formatDate', () => {
    it('formats date strings correctly', () => {
      const date = '2024-01-15T10:30:00Z';
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15 tháng 1, 2024/);
    });

    it('formats Date objects correctly', () => {
      const date = new Date('2024-01-15T10:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toMatch(/15 tháng 1, 2024/);
    });

    it('handles invalid dates', () => {
      expect(formatDate('invalid-date')).toBe('Invalid Date');
      expect(formatDate('')).toBe('Invalid Date');
    });
  });

  describe('formatPricePerM2', () => {
    it('should format price per square meter', () => {
      expect(formatPricePerM2(2000000000, 100)).toBe('20 triệu/m²');
      expect(formatPricePerM2(1500000000, 75)).toBe('20 triệu/m²');
    });
  });

  describe('validatePhone', () => {
    it('should validate Vietnamese phone numbers', () => {
      expect(validatePhone('0901234567')).toBe(true);
      expect(validatePhone('+84901234567')).toBe(true);
      expect(validatePhone('0123456789')).toBe(false);
      expect(validatePhone('invalid')).toBe(false);
    });
  });

  describe('calculatePercentageChange', () => {
    it('should calculate percentage change correctly', () => {
      expect(calculatePercentageChange(100, 150)).toBe(50);
      expect(calculatePercentageChange(200, 100)).toBe(-50);
      expect(calculatePercentageChange(0, 100)).toBe(0);
    });
  });

  describe('validateEmail', () => {
    it('validates correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@example.org')).toBe(true);
    });

    it('rejects invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('cn (className utility)', () => {
    it('combines class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
      expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'active')).toBe('base active');
      expect(cn('base', false && 'active')).toBe('base');
    });

    it('handles objects', () => {
      expect(cn({ 'class1': true, 'class2': false, 'class3': true })).toBe('class1 class3');
    });
  });

  describe('generateId', () => {
    it('should generate unique IDs', () => {
      const id1 = generateId();
      const id2 = generateId();
      
      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe('string');
      expect(typeof id2).toBe('string');
      expect(id1).toHaveLength(8); // Default length
    });

    it('should generate IDs with custom length', () => {
      const id = generateId(12);
      expect(id).toHaveLength(12);
      expect(typeof id).toBe('string');
    });
  });

  describe('formatNumber', () => {
    it('formats numbers with commas', () => {
      expect(formatNumber(1000)).toBe('1.000');
      expect(formatNumber(1000000)).toBe('1.000.000');
      expect(formatNumber(1234567)).toBe('1.234.567');
    });

    it('handles decimal numbers', () => {
      expect(formatNumber(1000.50)).toBe('1.000,5');
      expect(formatNumber(1234.567)).toBe('1.234,567');
    });

    it('handles small numbers', () => {
      expect(formatNumber(100)).toBe('100');
      expect(formatNumber(0)).toBe('0');
      expect(formatNumber(-100)).toBe('-100');
    });
  });

  describe('debounce', () => {
    it('delays function execution', (done) => {
      let called = false;
      const fn = debounce(() => {
        called = true;
      }, 100);

      fn();
      expect(called).toBe(false);

      setTimeout(() => {
        expect(called).toBe(true);
        done();
      }, 150);
    });

    it('cancels previous calls', (done) => {
      let callCount = 0;
      const fn = debounce(() => {
        callCount++;
      }, 100);

      fn();
      fn();
      fn();

      setTimeout(() => {
        expect(callCount).toBe(1);
        done();
      }, 150);
    });
  });

  describe('throttle', () => {
    it('limits function calls', (done) => {
      let callCount = 0;
      const fn = throttle(() => {
        callCount++;
      }, 100);

      fn();
      fn();
      fn();

      expect(callCount).toBe(1);

      setTimeout(() => {
        fn();
        expect(callCount).toBe(2);
        done();
      }, 150);
    });
  });
});