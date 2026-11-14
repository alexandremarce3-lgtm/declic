import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useTheme } from '@/theme/useTheme';

/** Jauge d'XP animée (0 à 1). */
export function XpBar({ progress, height = 6, color }: { progress: number; height?: number; color?: string }) {
  const { colors } = useTheme();
  const value = useRef(new Animated.Value(progress)).current;

  useEffect(() => {
    Animated.timing(value, {
      toValue: Math.max(0, Math.min(1, progress)),
      duration: 700,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false, // anime une largeur
    }).start();
  }, [progress, value]);

  return (
    <View
      style={{ height, borderRadius: height / 2, backgroundColor: colors.surfaceAlt, overflow: 'hidden' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
    >
      <Animated.View
        style={{
          height,
          borderRadius: height / 2,
          backgroundColor: color ?? colors.accent,
          width: value.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
        }}
      />
    </View>
  );
}
