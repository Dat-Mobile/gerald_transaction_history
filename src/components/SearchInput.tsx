import React, { memo } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface SearchInputProps {
  value: string;
  onChangeText: (value: string) => void;
  onClear: () => void;
}

export const SearchInput = memo(function SearchInput({
  value,
  onChangeText,
  onClear,
}: SearchInputProps) {
  const showClear = value.length > 0;

  return (
    <View style={styles.container}>
      <Text style={styles.searchGlyph} accessibilityElementsHidden>
        Search
      </Text>
      <TextInput
        accessibilityLabel="Search transactions by merchant name"
        autoCapitalize="none"
        autoCorrect={false}
        clearButtonMode="never"
        onChangeText={onChangeText}
        placeholder="Search merchants"
        placeholderTextColor="#9CA3AF"
        returnKeyType="search"
        style={styles.input}
        value={value}
      />
      {showClear ? (
        <Pressable
          accessibilityLabel="Clear merchant search"
          accessibilityRole="button"
          hitSlop={8}
          onPress={onClear}
          style={({ pressed }) => [
            styles.clearButton,
            pressed && styles.clearButtonPressed,
          ]}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </Pressable>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  clearButton: {
    alignItems: 'center',
    borderRadius: 6,
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  clearButtonPressed: {
    backgroundColor: '#E5E7EB',
  },
  clearButtonText: {
    color: '#374151',
    fontSize: 13,
    fontWeight: '700',
  },
  container: {
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  input: {
    color: '#111827',
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
  },
  searchGlyph: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
});
