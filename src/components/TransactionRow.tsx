import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import type { TransactionListItem } from '../types/transaction';

export const TRANSACTION_ROW_HEIGHT = 78;

interface TransactionRowProps {
  transaction: TransactionListItem;
}

export const TransactionRow = memo(function TransactionRow({
  transaction,
}: TransactionRowProps) {
  const isIncome = transaction.type === 'income';
  const rowAccessibilityLabel = `${transaction.merchant}, ${
    transaction.category
  }, ${isIncome ? 'income' : 'expense'}, ${transaction.formattedAmount}, ${
    transaction.formattedDate
  }`;

  return (
    <View
      accessible
      accessibilityLabel={rowAccessibilityLabel}
      style={styles.container}
    >
      <View style={styles.detailColumn}>
        <Text numberOfLines={1} style={styles.merchant}>
          {transaction.merchant}
        </Text>
        <View style={styles.metaRow}>
          <Text numberOfLines={1} style={styles.category}>
            {transaction.category}
          </Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.date}>{transaction.formattedDate}</Text>
        </View>
      </View>
      <Text
        numberOfLines={1}
        style={[styles.amount, isIncome ? styles.income : styles.expense]}
      >
        {transaction.formattedAmount}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  amount: {
    fontSize: 15,
    fontWeight: '800',
    marginLeft: 14,
    maxWidth: 124,
    textAlign: 'right',
  },
  category: {
    color: '#6B7280',
    flexShrink: 1,
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomColor: '#EEF2F7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: TRANSACTION_ROW_HEIGHT,
    paddingHorizontal: 20,
  },
  date: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  detailColumn: {
    flex: 1,
    minWidth: 0,
  },
  expense: {
    color: '#B42318',
  },
  income: {
    color: '#027A48',
  },
  merchant: {
    color: '#111827',
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 8,
  },
  metaRow: {
    alignItems: 'center',
    flexDirection: 'row',
    minWidth: 0,
  },
  separator: {
    color: '#9CA3AF',
    fontSize: 13,
    marginHorizontal: 7,
  },
});
