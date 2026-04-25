import type {
  Transaction,
  TransactionFilter,
} from '../types/transaction';

export const filterTransactions = (
  transactions: Transaction[],
  filter: TransactionFilter,
  merchantQuery: string,
): Transaction[] => {
  const normalizedQuery = merchantQuery.trim().toLocaleLowerCase();

  return transactions.filter(transaction => {
    const matchesType = filter === 'all' || transaction.type === filter;
    const matchesMerchant =
      normalizedQuery.length === 0 ||
      transaction.merchant.toLocaleLowerCase().includes(normalizedQuery);

    return matchesType && matchesMerchant;
  });
};
