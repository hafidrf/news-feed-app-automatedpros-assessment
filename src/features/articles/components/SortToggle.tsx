import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArticleSortKey } from '../../../shared/types/article';
import { colors } from '../../../shared/theme/colors';

interface SortToggleProps {
  value: ArticleSortKey;
  onChange: (value: ArticleSortKey) => void;
}

export const SortToggle = ({ value, onChange }: SortToggleProps) => {
  return (
    <View style={styles.container}>
      <SortButton
        label="Sort: Score"
        selected={value === 'score'}
        onPress={() => onChange('score')}
      />
      <SortButton
        label="Sort: Time"
        selected={value === 'time'}
        onPress={() => onChange('time')}
      />
    </View>
  );
};

interface SortButtonProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const SortButton = ({ label, selected, onPress }: SortButtonProps) => (
  <Pressable
    testID={label}
    onPress={onPress}
    style={[styles.button, selected ? styles.buttonActive : null]}>
    <Text style={[styles.buttonText, selected ? styles.buttonTextActive : null]}>
      {label}
    </Text>
  </Pressable>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: '#101a30',
    borderRadius: 12,
    padding: 4,
  },
  button: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    alignItems: 'center',
  },
  buttonActive: {
    backgroundColor: colors.accent,
    shadowColor: '#0f172a',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  buttonText: {
    color: '#9db1ce',
    fontWeight: '600',
    fontSize: 13,
  },
  buttonTextActive: {
    color: colors.primaryBg,
  },
});
