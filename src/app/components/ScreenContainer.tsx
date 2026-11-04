import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

export const ScreenContainer = ({ children }: { children: React.ReactNode }) => (
  <LinearGradient
    //@ts-ignore
    // colors={['#0F0C29', '#302B63', '#24243E']}
    // colors={['#60A5FA', '#FFFBEB', '#ECFDF5']}
    colors={['#FFFBEB','#60A5FA', '#ECFDF5']}
    style={styles.root}
  >
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <View style={[styles.blob, styles.blob1]} />
      <View style={[styles.blob, styles.blob2]} />
      {children}
    </SafeAreaView>
  </LinearGradient>
);

const styles = StyleSheet.create({
  root: { flex: 1 },
  blob: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.25,
  },
  blob1: {
    width: 320,
    height: 320,
    top: -120,
    right: -120,
    backgroundColor: '#7C3AED',
  },
  blob2: {
    width: 280,
    height: 280,
    bottom: -120,
    left: -120,
    backgroundColor: '#EC4899',
  },
});
