import React from 'react';
import { StyleSheet, View } from 'react-native';

export function SkeletonTransactionRow() {
  return (
    <View
      accessibilityLabel="Loading transaction"
      accessibilityRole="progressbar"
      style={styles.container}>
      <View style={styles.leftColumn}>
        <View style={styles.primaryLine} />
        <View style={styles.secondaryLine} />
      </View>
      <View style={styles.amountLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  amountLine: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    height: 16,
    width: 72,
  },
  container: {
    alignItems: 'center',
    borderBottomColor: '#EEF2F7',
    borderBottomWidth: 1,
    flexDirection: 'row',
    height: 88,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  leftColumn: {
    flex: 1,
    gap: 10,
    marginRight: 16,
  },
  primaryLine: {
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    height: 16,
    width: '72%',
  },
  secondaryLine: {
    backgroundColor: '#EEF2F7',
    borderRadius: 4,
    height: 14,
    width: '46%',
  },
});
