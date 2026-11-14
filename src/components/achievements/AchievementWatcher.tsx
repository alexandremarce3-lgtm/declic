import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Animated, AppState, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useGameState } from '@/hooks/useGameState';
import { useI18n } from '@/i18n';
import { COUNTERS, type Achievement } from '@/lib/achievements';
import { useJournal } from '@/storage/journal';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { AchievementBadge } from './AchievementBadge';
import { achievementText } from './achievementText';

type Toast = { achievement: Achievement; extra: number };

/**
 * Surveille les conditions des succès, enregistre ceux qui sont remplis
 * et les annonce un par un en bas de l'écran.
 * Compte aussi les visites nocturnes / matinales (succès secrets).
 */
export function AchievementWatcher() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const insets = useSafeAreaInsets();
  const { ready, unlockAchievements, bump } = useProgress();
  const journal = useJournal();
  const { achievements } = useGameState();

  const [queue, setQueue] = useState<Toast[]>([]);
  const anim = useRef(new Animated.Value(0)).current;

  // Heure de la visite → Noctambule / Heure bleue
  useEffect(() => {
    if (!ready) return;
    const check = () => {
      const h = new Date().getHours();
      if (h < 5) bump(COUNTERS.nightVisits);
      else if (h < 7) bump(COUNTERS.dawnVisits);
    };
    check();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && check());
    return () => sub.remove();
  }, [ready, bump]);

  // Déblocage
  useEffect(() => {
    if (!ready || !journal.ready) return;
    const candidates = achievements.filter((a) => a.earned && !a.unlocked).map((a) => a.id);
    if (!candidates.length) return;
    const fresh = unlockAchievements(candidates);
    if (!fresh.length) return;
    const found = achievements.filter((a) => fresh.includes(a.id));
    // Rattrapage (mise à jour de l'app) : un seul toast résumé au lieu d'une avalanche
    setQueue((q) => (found.length > 3 ? [...q, { achievement: found[0], extra: found.length - 1 }] : [...q, ...found.map((a) => ({ achievement: a, extra: 0 }))]));
  }, [achievements, ready, journal.ready, unlockAchievements]);

  // Affichage séquentiel
  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    anim.setValue(0);
    const run = Animated.sequence([
      Animated.spring(anim, { toValue: 1, friction: 7, tension: 80, useNativeDriver: true }),
      Animated.delay(2200),
      Animated.timing(anim, { toValue: 0, duration: 250, useNativeDriver: true }),
    ]);
    run.start(({ finished }) => finished && setQueue((q) => q.slice(1)));
    return () => run.stop();
  }, [current, anim]);

  if (!current) return null;
  const a = current.achievement;
  const text = achievementText(a, t, catalog);

  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', left: spacing.md, right: spacing.md, bottom: insets.bottom + spacing.md }}>
      <Animated.View
        style={{
          opacity: anim,
          transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        }}
      >
        <Pressable
          onPress={() => {
            setQueue((q) => q.slice(1));
            router.push('/succes');
          }}
          accessibilityRole="button"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${a.category === 'secret' ? t.achievements.toastSecret : t.achievements.toast} : ${text.title}`}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            padding: spacing.sm + 4,
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: a.category === 'secret' ? colors.danger : colors.accent,
          }}
        >
          <AchievementBadge category={a.category} glyph={a.glyph} rank={a.category === 'rank' ? (a.ref as never) : undefined} unlocked size={48} />
          <View style={{ flex: 1 }}>
            <AppText variant="overline" color={a.category === 'secret' ? colors.dangerInk : colors.accentInk}>
              {a.category === 'secret' ? t.achievements.toastSecret : t.achievements.toast}
            </AppText>
            <AppText variant="heading" numberOfLines={1}>
              {text.title}
            </AppText>
            {current.extra > 0 && (
              <AppText variant="caption" muted>
                {t.achievements.andMore(current.extra)}
              </AppText>
            )}
          </View>
        </Pressable>
      </Animated.View>
    </View>
  );
}
