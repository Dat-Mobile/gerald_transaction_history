import {
  formatCurrencyForLocale,
  formatTransactionDateForLocale,
} from '../utils/formatters';

describe('formatters', () => {
  it('formats USD amounts with a locale-aware currency formatter', () => {
    expect(formatCurrencyForLocale(4250, 'en-US')).toBe('$4,250.00');
    expect(formatCurrencyForLocale(-86.42, 'en-US')).toBe('-$86.42');
  });

  it('formats transaction dates with a locale-aware date formatter', () => {
    expect(
      formatTransactionDateForLocale(
        '2026-04-18T18:24:00.000Z',
        'en-US',
        'UTC',
      ),
    ).toBe('Apr 18, 2026');
  });
});
