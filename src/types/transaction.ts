export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  merchant: string;
  amount: number;
  date: string;
  category: string;
  type: TransactionType;
}

export type TransactionFilter = 'all' | TransactionType;

export interface TransactionListItem extends Transaction {
  formattedAmount: string;
  formattedDate: string;
}
