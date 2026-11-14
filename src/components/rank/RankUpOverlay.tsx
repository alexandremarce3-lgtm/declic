import { useEffect, useRef } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT, palettes } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { RankBadge, rankStyle } from './RankBadge';

const RAYS = 16;

/**
 * Cérémonie de promotion : l'ancien insigne se brise, le nouveau surgit
 * dans une gerbe de rayons, façon « réveil » de chasseur.
 */
export function RankUpOverlay() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { rankUp, dismissRankUp } = useProgress();

  const old = useRef(new Animated.Value(0)).current; // 0 → 1 : l'ancien disparaît
  const pop = useRef(new Animated.Value(0)).current; // 0 → 1 : le nouveau arrive
  const spin = useRef(new Animated.Value(0)).current; // rotation continue des rayons
  const text = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!rankUp) return;
    [old, pop, text].forEach((v) => v.setValue(0));
    spin.setValue(0);
    Animated.sequence([
      Animated.delay(250),
      Animated.timing(old, { toValue: 1, duration: 380, easing: Easing.in(Easing.back(2)), useNativeDriver: true }),
      Animated.spring(pop, { toValue: 1, friction: 4, tension: 70, useNativeDriver: true }),
      Animated.timing(text, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [rankUp, old, pop, spin, text]);

  if (!rankUp) return null;
  const ray = rankStyle(rankUp.to, colors).ring;

  return (
    <Modal transparent animationType="fade" visible onRequestClose={dismissRankUp} statusBarTranslucent>
      <View style={[styles.backdrop, { backgroundColor: palettes.dark.bg }]}>
        <View style={styles.stage}>
          {/* Rayons */}
          <Animated.View
            style={[
              styles.stage,
              {
                position: 'absolute',
                opacity: pop,
                transform: [
                  { rotate: spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
                  { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) },
                ],
              },
            ]}
          >
            {Array.from({ length: RAYS }, (_, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute',
                  width: 3,
                  height: i % 2 ? 110 : 150,
                  borderRadius: 2,
                  backgroundColor: ray,
                  opacity: i % 2 ? 0.35 : 0.7,
                  transform: [{ rotate: `${(360 / RAYS) * i}deg` }, { translateY: -(i % 2 ? 95 : 115) }],
                }}
              />
            ))}
          </Animated.View>

          {/* Ancien rang */}
          <Animated.View
            style={{
              position: 'absolute',
              opacity: old.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
              transform: [{ scale: old.interpolate({ inputRange: [0, 1], outputRange: [1, 0.2] }) }],
            }}
          >
            <RankBadge rank={rankUp.from} size={120} />
          </Animated.View>

          {/* Nouveau rang */}
          <Animated.View
            style={{
              opacity: pop,
              transform: [
                { scale: pop.interpolate({ inputRange: [0, 1], outputRange: [2.4, 1] }) },
                { rotate: pop.interpolate({ inputRange: [0, 1], outputRange: ['-90deg', '0deg'] }) },
              ],
            }}
          >
            <RankBadge rank={rankUp.to} size={150} />
          </Animated.View>
        </View>

        <Animated.View
          style={{
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.lg,
            opacity: text,
            transform: [{ translateY: text.interpolate({ inputRange: [0, 1], outputRange: [16, 0] }) }],
          }}
          accessibilityLiveRegion="assertive"
        >
          <AppText variant="overline" color={colors.accent}>
            {t.rankUp.kicker}
          </AppText>
          <AppText variant="display" color={palettes.dark.text} style={{ textAlign: 'center' }}>
            {t.rankUp.title(rankUp.to)}
          </AppText>
          <AppText variant="heading" color={ray} style={{ textAlign: 'center' }}>
            {t.ranks.titles[rankUp.to]}
          </AppText>
          <AppText color={palettes.dark.textMuted} style={{ textAlign: 'center' }}>
            {t.rankUp.from(rankUp.from)}
          </AppText>
          <Pressable
            onPress={dismissRankUp}
            accessibilityRole="button"
            style={({ pressed }) => ({
              marginTop: spacing.lg,
              minHeight: HIT,
              minWidth: 200,
              paddingHorizontal: spacing.xl,
              borderRadius: radius.pill,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: colors.accent,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <AppText variant="mono" color={colors.onAccent}>
              {t.rankUp.cta}
            </AppText>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  stage: { width: 320, height: 320, alignItems: 'center', justifyContent: 'center' },
});
