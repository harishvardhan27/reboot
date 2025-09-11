import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function GradientBackground({ children, colors = ['#667eea', '#764ba2'] }) {
  return (
    <View style={[styles.container, { backgroundColor: colors[0] }]}>
      <View style={[styles.overlay, { backgroundColor: colors[1] }]} />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  content: {
    flex: 1,
  },
});