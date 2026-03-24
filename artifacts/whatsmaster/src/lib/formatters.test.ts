/**
 * Tests pour les utilitaires de formatage
 */

import { describe, it, expect } from 'vitest';
import {
  formatNumber,
  formatCurrency,
  formatDate,
  formatRelativeTime,
  formatPhoneNumber,
  truncateText,
  formatPercentage,
  daysBetween,
  isPast,
  isToday,
  generateId,
  debounce,
  throttle,
  clamp,
  isValidEmail,
  stripHtml,
  capitalize,
  slugify,
} from '../formatters';

describe('formatNumber', () => {
  it('should format numbers with thousand separators', () => {
    expect(formatNumber(1000)).toBe('1 000');
    expect(formatNumber(1000000)).toBe('1 000 000');
  });

  it('should format string numbers', () => {
    expect(formatNumber('1234.56')).toBe('1 234,56');
  });

  it('should handle invalid numbers', () => {
    expect(formatNumber(NaN)).toBe('0');
    expect(formatNumber('invalid')).toBe('0');
  });
});

describe('formatCurrency', () => {
  it('should format currency in EUR', () => {
    expect(formatCurrency(1000)).toContain('€');
    expect(formatCurrency(99.99)).toMatch(/99,99\s?€/);
  });

  it('should format currency in USD', () => {
    expect(formatCurrency(1000, 'USD', 'en-US')).toContain('$');
  });

  it('should handle string amounts', () => {
    expect(formatCurrency('50.50')).toMatch(/50,50/);
  });
});

describe('formatDate', () => {
  it('should format dates', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBeTruthy();
  });

  it('should format date strings', () => {
    expect(formatDate('2024-01-15')).toBeTruthy();
  });

  it('should handle invalid dates', () => {
    expect(formatDate('invalid')).toBe('Date invalide');
  });

  it('should use custom options', () => {
    const date = new Date('2024-01-15');
    const formatted = formatDate(date, { month: 'short', day: 'numeric' });
    expect(formatted).toBeTruthy();
  });
});

describe('formatRelativeTime', () => {
  it('should format recent times', () => {
    const now = new Date();
    expect(formatRelativeTime(now)).toBeTruthy();
  });

  it('should handle past dates', () => {
    const yesterday = new Date(Date.now() - 86400000);
    expect(formatRelativeTime(yesterday)).toContain('jour');
  });

  it('should handle invalid dates', () => {
    expect(formatRelativeTime('invalid')).toBe('Date invalide');
  });
});

describe('formatPhoneNumber', () => {
  it('should format phone numbers', () => {
    expect(formatPhoneNumber('+33612345678')).toBe('+33 61 23 45 67');
  });

  it('should handle various formats', () => {
    expect(formatPhoneNumber('0612345678')).toBe('06 12 34 56 78');
  });
});

describe('truncateText', () => {
  it('should truncate long text', () => {
    expect(truncateText('Hello World', 5)).toBe('He...');
  });

  it('should not truncate short text', () => {
    expect(truncateText('Hi', 10)).toBe('Hi');
  });

  it('should use custom suffix', () => {
    expect(truncateText('Hello', 3, ' [read more]')).toBe('Hel [read more]');
  });
});

describe('formatPercentage', () => {
  it('should format percentages', () => {
    expect(formatPercentage(75.5)).toBe('75,5%');
    expect(formatPercentage(100)).toBe('100,0%');
  });

  it('should handle custom decimals', () => {
    expect(formatPercentage(75.555, 2)).toBe('75,56%');
  });

  it('should handle string values', () => {
    expect(formatPercentage('50.5')).toBe('50,5%');
  });
});

describe('daysBetween', () => {
  it('should calculate days between dates', () => {
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-01-11');
    expect(daysBetween(date1, date2)).toBe(10);
  });

  it('should handle string dates', () => {
    expect(daysBetween('2024-01-01', '2024-01-08')).toBe(7);
  });
});

describe('isPast', () => {
  it('should return true for past dates', () => {
    const yesterday = new Date(Date.now() - 86400000);
    expect(isPast(yesterday)).toBe(true);
  });

  it('should return false for future dates', () => {
    const tomorrow = new Date(Date.now() + 86400000);
    expect(isPast(tomorrow)).toBe(false);
  });
});

describe('isToday', () => {
  it('should return true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('should return false for other dates', () => {
    const yesterday = new Date(Date.now() - 86400000);
    expect(isToday(yesterday)).toBe(false);
  });
});

describe('generateId', () => {
  it('should generate unique IDs', () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it('should use custom prefix', () => {
    const id = generateId('test');
    expect(id).toMatch(/^test_/);
  });
});

describe('debounce', () => {
  it('should delay function execution', async () => {
    let called = false;
    const debouncedFn = debounce(() => {
      called = true;
    }, 10);

    debouncedFn();
    expect(called).toBe(false);

    await new Promise(resolve => setTimeout(resolve, 20));
    expect(called).toBe(true);
  });
});

describe('throttle', () => {
  it('should limit function calls', () => {
    let callCount = 0;
    const throttledFn = throttle(() => {
      callCount++;
    }, 100);

    throttledFn();
    throttledFn();
    throttledFn();
    
    expect(callCount).toBe(1);
  });
});

describe('clamp', () => {
  it('should clamp value within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
  });
});

describe('isValidEmail', () => {
  it('should validate emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('user@domain.co.uk')).toBe(true);
  });
});

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
  });

  it('should trim result', () => {
    expect(stripHtml('  <div>Content</div>  ')).toBe('Content');
  });
});

describe('capitalize', () => {
  it('should capitalize first letter', () => {
    expect(capitalize('hello')).toBe('Hello');
    expect(capitalize('HELLO')).toBe('Hello');
  });

  it('should handle empty strings', () => {
    expect(capitalize('')).toBe('');
  });
});

describe('slugify', () => {
  it('should create slugs', () => {
    expect(slugify('Hello World!')).toBe('hello-world');
    expect(slugify('Café & Thé')).toBe('caf-th');
  });

  it('should handle special characters', () => {
    expect(slugify('Test @#$% Special')).toBe('test-special');
  });
});
