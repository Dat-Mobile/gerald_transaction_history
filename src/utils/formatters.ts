const usdFormatter = new Intl.NumberFormat(undefined, {
  style: 'currency',
  currency: 'USD',
});

const transactionDateFormatter = new Intl.DateTimeFormat(undefined, {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

export const formatCurrency = (amount: number): string =>
  usdFormatter.format(amount);

export const formatTransactionDate = (date: string): string =>
  transactionDateFormatter.format(new Date(date));

export const formatCurrencyForLocale = (
  amount: number,
  locale: string,
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

export const formatTransactionDateForLocale = (
  date: string,
  locale: string,
  timeZone?: string,
): string =>
  new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone,
  }).format(new Date(date));
