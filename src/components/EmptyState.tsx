import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface EmptyStateProps {
  searchQuery: string;
}

export function EmptyState({ searchQuery }: EmptyStateProps) {
  const hasSearch = searchQuery.trim().length > 0;

  return (
    <View style={styles.container} accessibilityRole="summary">
      <Text style={styles.title}>No transactions found</Text>
      <Text style={styles.message}>
        {hasSearch
          ? 'Try a different merchant search or filter.'
          : 'Transactions will appear here once they are available.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 56,
  },
  title: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  message: {
    color: '#6B7280',
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
});
