import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { FilterTabs } from '../components/FilterTabs';
import { SearchInput } from '../components/SearchInput';
import { SkeletonTransactionRow } from '../components/SkeletonTransactionRow';
import {
  TRANSACTION_ROW_HEIGHT,
  TransactionRow,
} from '../components/TransactionRow';
import { fetchTransactions } from '../services/transactionsApi';
import type {
  Transaction,
  TransactionFilter,
  TransactionListItem,
} from '../types/transaction';
import { useDebouncedValue } from '../utils/debounce';
import { formatCurrency, formatTransactionDate } from '../utils/formatters';
import { filterTransactions } from '../utils/transactions';
import { SafeAreaView } from 'react-native-safe-area-context';

const SEARCH_DEBOUNCE_MS = 300;
const SKELETON_ROW_KEYS = [
  'skeleton-1',
  'skeleton-2',
  'skeleton-3',
  'skeleton-4',
  'skeleton-5',
  'skeleton-6',
];

const keyExtractor = (item: TransactionListItem) => item.id;

const getItemLayout = (
  _data: ArrayLike<TransactionListItem> | null | undefined,
  index: number,
) => ({
  length: TRANSACTION_ROW_HEIGHT,
  offset: TRANSACTION_ROW_HEIGHT * index,
  index,
});

const renderTransactionRow = ({
  item,
}: ListRenderItemInfo<TransactionListItem>) => (
  <TransactionRow transaction={item} />
);

export function TransactionHistoryScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] =
    useState<TransactionFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const debouncedSearchQuery = useDebouncedValue(
    searchQuery,
    SEARCH_DEBOUNCE_MS,
  );

  const loadTransactions = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setErrorMessage(null);

    try {
      const nextTransactions = await fetchTransactions();
      setTransactions(nextTransactions);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load transactions. Please try again.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const filteredTransactions = useMemo(
    () =>
      filterTransactions(transactions, selectedFilter, debouncedSearchQuery),
    [debouncedSearchQuery, selectedFilter, transactions],
  );

  const listData = useMemo<TransactionListItem[]>(
    () =>
      filteredTransactions.map(transaction => ({
        ...transaction,
        formattedAmount: formatCurrency(transaction.amount),
        formattedDate: formatTransactionDate(transaction.date),
      })),
    [filteredTransactions],
  );

  const handleFilterChange = useCallback((filter: TransactionFilter) => {
    setSelectedFilter(filter);
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  const handleRetry = useCallback(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleRefresh = useCallback(() => {
    loadTransactions(true);
  }, [loadTransactions]);

  const isInitialLoading = isLoading && transactions.length === 0;
  const shouldShowFullError =
    errorMessage !== null && transactions.length === 0;

  if (shouldShowFullError) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Gerald</Text>
          <Text style={styles.title}>Transaction History</Text>
        </View>

        <View style={styles.controls}>
          <SearchInput
            onChangeText={handleSearchChange}
            onClear={handleClearSearch}
            value={searchQuery}
          />
          <FilterTabs
            onChange={handleFilterChange}
            selectedFilter={selectedFilter}
          />
          <Text
            accessibilityLabel={`${listData.length} transactions shown`}
            style={styles.subtitle}
          >
            {listData.length} shown
          </Text>
        </View>

        {errorMessage !== null ? (
          <View
            accessibilityLabel={`Transaction refresh error. ${errorMessage}`}
            accessibilityRole="alert"
            style={styles.inlineErrorContainer}
          >
            <Text style={styles.inlineErrorText}>{errorMessage}</Text>
            <Pressable
              accessibilityLabel="Retry refreshing transactions"
              accessibilityRole="button"
              onPress={handleRetry}
              style={({ pressed }) => [
                styles.inlineRetryButton,
                pressed && styles.inlineRetryButtonPressed,
              ]}
            >
              <Text style={styles.inlineRetryButtonText}>Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {isInitialLoading ? (
          <View
            accessibilityLabel="Loading transactions"
            accessibilityRole="progressbar"
            style={styles.skeletonContainer}
          >
            {SKELETON_ROW_KEYS.map(key => (
              <SkeletonTransactionRow key={key} />
            ))}
          </View>
        ) : (
          <FlatList
            accessibilityLabel="Transaction list. Pull down to refresh transactions."
            contentContainerStyle={
              listData.length === 0
                ? styles.emptyListContent
                : styles.listContent
            }
            data={listData}
            getItemLayout={getItemLayout}
            initialNumToRender={10}
            keyExtractor={keyExtractor}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={<EmptyState searchQuery={searchQuery} />}
            maxToRenderPerBatch={12}
            refreshControl={
              <RefreshControl
                accessibilityLabel="Refresh transactions"
                onRefresh={handleRefresh}
                refreshing={isRefreshing}
                tintColor="#111827"
              />
            }
            removeClippedSubviews
            renderItem={renderTransactionRow}
            style={styles.list}
            windowSize={7}
            keyboardDismissMode="on-drag"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  controls: {
    gap: 14,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  emptyListContent: {
    flexGrow: 1,
  },
  eyebrow: {
    color: '#027A48',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 20,
  },
  inlineErrorContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3F2',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 8,
    marginHorizontal: 20,
    padding: 12,
  },
  inlineErrorText: {
    color: '#B42318',
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
  },
  inlineRetryButton: {
    borderColor: '#B42318',
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  inlineRetryButtonPressed: {
    backgroundColor: '#FEE4E2',
  },
  inlineRetryButtonText: {
    color: '#B42318',
    fontSize: 13,
    fontWeight: '800',
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 24,
  },
  safeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  skeletonContainer: {
    borderTopColor: '#EEF2F7',
    borderTopWidth: 1,
    flex: 1,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 0,
  },
});
