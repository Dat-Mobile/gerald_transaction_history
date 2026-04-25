import { mockTransactions } from '../data/transactions';
import type { Transaction } from '../types/transaction';

interface FetchTransactionsOptions {
  delayMs?: number;
  shouldFail?: boolean;
}

const DEFAULT_DELAY_MS = 650;

export const fetchTransactions = async ({
  delayMs = DEFAULT_DELAY_MS,
  shouldFail = false,
}: FetchTransactionsOptions = {}): Promise<Transaction[]> => {
  await new Promise<void>(resolve => {
    setTimeout(resolve, delayMs);
  });

  if (shouldFail) {
    throw new Error('Unable to load transactions. Please try again.');
  }

  return [...mockTransactions].sort(
    (left, right) =>
      new Date(right.date).getTime() - new Date(left.date).getTime(),
  );
};
