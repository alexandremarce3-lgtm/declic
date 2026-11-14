import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { RankCard } from '@/components/rank/RankCard';
import { CollabShortcuts } from '@/components/collab/CollabShortcuts';
import { SosShortcut } from '@/components/sos/SosShortcut';
import { TierBlock } from '@/components/tiers/TierBlock';
import { WorkshopRow } from '@/components/WorkshopRow';
import { useTiers } from '@/hooks/useTiers';
import { COUNTERS } from '@/lib/achievements';
import { useI18n } from '@/i18n';
import { displayName, useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Sommaire : rang, atelier, SOS, puis les trois paliers et les défis. */
export default function Home() {
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { isDone, bump, stored } = useProgress();
  const name = displayName(stored.identity);
  const { t, catalog } = useI18n();
  const { challenges } = catalog;
  const { tiers } = useTiers();
  const doneCount = challenges.filter((c) => isDone(c.id)).length;

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + spacing.xl,
        paddingBottom: insets.bottom + spacing.xl,
        paddingHorizontal: spacing.md,
        gap: spacing.md,
      }}
    >
      {/* Une de magazine */}
      <View style={{ gap: spacing.xs }}>
        <AppText variant="overline" color={colors.primaryInk}>
          {t.home.masthead}
        </AppText>
        {/* Le titre compte les taps : succès secret « Curieux impénitent » */}
        <Pressable onPress={() => bump(COUNTERS.homeTaps)} accessible={false} style={{ alignSelf: 'flex-start' }}>
          <AppText variant="display" style={{ fontSize: 46, lineHeight: 52 }}>
            Déclic
          </AppText>
        </Pressable>
        <View style={{ height: 2, width: 48, backgroundColor: colors.accent, marginVertical: spacing.xs }} />
        {name ? (
          <AppText variant="heading" color={colors.accentInk}>
            {t.identity.hello(name)}
          </AppText>
        ) : null}
        <AppText muted>{t.home.tagline}</AppText>
      </View>

      <RankCard />
      <WorkshopRow />
      <SosShortcut />
      <CollabShortcuts />

      {tiers.map((status) => (
        <TierBlock key={status.id} status={status} />
      ))}

      <View style={{ marginTop: spacing.lg, gap: 2 }}>
        <AppText variant="title" accessibilityRole="header">
          {t.home.actionTitle}
        </AppText>
        <AppText muted>{t.home.actionLead}</AppText>
      </View>
      <Pressable
        onPress={() => router.push('/defis')}
        accessibilityRole="button"
        accessibilityLabel={t.home.challengesA11y(doneCount, challenges.length)}
        style={({ pressed }) => ({
          minHeight: HIT,
          padding: spacing.lg,
          borderRadius: radius.lg,
          backgroundColor: colors.primary,
          gap: spacing.sm,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <AppText variant="title" color={colors.onPrimary}>
          {t.home.challengesCard}
        </AppText>
        <AppText color={colors.onPrimary}>{t.home.challengesProgress(doneCount, challenges.length)}</AppText>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.onPrimary + '33', overflow: 'hidden' }}>
          <View
            style={{
              width: `${(doneCount / challenges.length) * 100}%`,
              height: 6,
              borderRadius: 3,
              backgroundColor: colors.accent,
            }}
          />
        </View>
      </Pressable>
    </ScrollView>
  );
}
