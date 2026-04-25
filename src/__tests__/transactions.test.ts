import type { Transaction } from '../types/transaction';
import { filterTransactions } from '../utils/transactions';

const transactions: Transaction[] = [
  {
    id: '1',
    merchant: 'Gerald Payroll',
    amount: 4250,
    date: '2026-04-19T09:00:00.000Z',
    category: 'Paycheck',
    type: 'income',
  },
  {
    id: '2',
    merchant: 'Whole Foods Market',
    amount: -86.42,
    date: '2026-04-18T18:24:00.000Z',
    category: 'Groceries',
    type: 'expense',
  },
  {
    id: '3',
    merchant: 'Blue Bottle Coffee',
    amount: -6.75,
    date: '2026-04-18T13:12:00.000Z',
    category: 'Dining',
    type: 'expense',
  },
];

describe('filterTransactions', () => {
  it('returns every transaction for the all filter with no search query', () => {
    expect(filterTransactions(transactions, 'all', '')).toEqual(transactions);
  });

  it('filters by transaction type', () => {
    expect(filterTransactions(transactions, 'income', '')).toEqual([
      transactions[0],
    ]);
    expect(filterTransactions(transactions, 'expense', '')).toEqual([
      transactions[1],
      transactions[2],
    ]);
  });

  it('searches merchant names case-insensitively', () => {
    expect(filterTransactions(transactions, 'all', 'blue')).toEqual([
      transactions[2],
    ]);
  });

  it('trims whitespace before searching merchant names', () => {
    expect(filterTransactions(transactions, 'all', '  WHOLE  ')).toEqual([
      transactions[1],
    ]);
  });

  it('combines type filtering with merchant search', () => {
    expect(filterTransactions(transactions, 'expense', 'gerald')).toEqual([]);
  });
});
