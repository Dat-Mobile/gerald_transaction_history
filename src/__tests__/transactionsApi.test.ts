import { mockTransactions } from '../data/transactions';
import { fetchTransactions } from '../services/transactionsApi';

describe('mock transaction source', () => {
  it('keeps transaction type and amount signs consistent', () => {
    expect(mockTransactions.length).toBeGreaterThanOrEqual(20);

    mockTransactions.forEach(transaction => {
      if (transaction.type === 'income') {
        expect(transaction.amount).toBeGreaterThan(0);
      } else {
        expect(transaction.amount).toBeLessThan(0);
      }
    });
  });

  it('fetches transactions sorted from newest to oldest without mutating source data', async () => {
    const result = await fetchTransactions({ delayMs: 0 });
    const timestamps = result.map(transaction =>
      new Date(transaction.date).getTime(),
    );
    const sortedTimestamps = [...timestamps].sort((left, right) => right - left);

    expect(result).not.toBe(mockTransactions);
    expect(timestamps).toEqual(sortedTimestamps);
  });

  it('can recover with a successful fetch after a failed request', async () => {
    await expect(
      fetchTransactions({ delayMs: 0, shouldFail: true }),
    ).rejects.toThrow('Unable to load transactions. Please try again.');

    await expect(fetchTransactions({ delayMs: 0 })).resolves.toHaveLength(
      mockTransactions.length,
    );
  });
});
