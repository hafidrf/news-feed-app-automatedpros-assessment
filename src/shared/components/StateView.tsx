import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

interface StateViewProps {
  title: string;
  subtitle?: string;
  loading?: boolean;
}

export const StateView = ({ title, subtitle, loading }: StateViewProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        {loading ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Text style={styles.iconSymbol}>•</Text>
        )}
      </View>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 8,
    backgroundColor: colors.primaryBg,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#101a30',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  iconSymbol: {
    fontSize: 16,
    color: colors.accent,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    color: '#9db1ce',
    textAlign: 'center',
  },
});
