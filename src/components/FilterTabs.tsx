import React, { memo } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type { TransactionFilter } from '../types/transaction';

interface FilterOption {
  label: string;
  value: TransactionFilter;
}

interface FilterTabsProps {
  selectedFilter: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
}

const FILTER_OPTIONS: FilterOption[] = [
  { label: 'All', value: 'all' },
  { label: 'Income', value: 'income' },
  { label: 'Expenses', value: 'expense' },
];

export const FilterTabs = memo(function FilterTabs({
  selectedFilter,
  onChange,
}: FilterTabsProps) {
  return (
    <View
      accessibilityLabel="Transaction type filter"
      accessibilityRole="tablist"
      style={styles.container}>
      {FILTER_OPTIONS.map(option => {
        const isSelected = selectedFilter === option.value;

        return (
          <Pressable
            accessibilityLabel={`Show ${option.label.toLowerCase()} transactions`}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.tab,
              isSelected && styles.tabSelected,
              pressed && styles.tabPressed,
            ]}>
            <Text style={[styles.tabText, isSelected && styles.tabTextSelected]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EEF2F7',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  tab: {
    alignItems: 'center',
    borderRadius: 6,
    flex: 1,
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  tabPressed: {
    opacity: 0.86,
  },
  tabSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#111827',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  tabText: {
    color: '#4B5563',
    fontSize: 14,
    fontWeight: '700',
  },
  tabTextSelected: {
    color: '#111827',
  },
});
