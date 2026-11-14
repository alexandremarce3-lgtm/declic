import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/** Pastille « +10 XP » qui monte puis s'efface, en haut de l'écran, à chaque gain. */
export function XpToast() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { lastGain } = useProgress();
  const insets = useSafeAreaInsets();
  const anim = useRef(new Animated.Value(0)).current;
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (!lastGain) return;
    setAmount(lastGain.amount);
    anim.setValue(0);
    Animated.sequence([
      Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 6, tension: 90 }),
      Animated.delay(900),
      Animated.timing(anim, { toValue: 2, duration: 350, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [lastGain, anim]);

  if (!lastGain) return null;

  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: insets.top + spacing.sm, left: 0, right: 0, alignItems: 'center' }}>
      <Animated.View
        accessibilityLiveRegion="polite"
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderRadius: radius.pill,
          backgroundColor: colors.accent,
          opacity: anim.interpolate({ inputRange: [0, 0.3, 1, 2], outputRange: [0, 1, 1, 0] }),
          transform: [
            { translateY: anim.interpolate({ inputRange: [0, 1, 2], outputRange: [-24, 0, -16] }) },
            { scale: anim.interpolate({ inputRange: [0, 1, 2], outputRange: [0.7, 1, 0.95] }) },
          ],
        }}
      >
        <AppText variant="mono" color={colors.onAccent}>
          ✦ {t.xp.gain(amount)}
        </AppText>
      </Animated.View>
    </View>
  );
}
