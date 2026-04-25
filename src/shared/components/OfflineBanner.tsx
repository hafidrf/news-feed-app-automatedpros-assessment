import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

export const OfflineBanner = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>No internet connection</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.liveRed,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  text: {
    color: colors.white,
    fontWeight: '600',
    textAlign: 'center',
  },
});
