import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/avatar/Avatar';
import { WorkshopRow } from '@/components/WorkshopRow';
import { DataSection } from '@/components/profile/DataSection';
import { AnimatedNumber } from '@/components/rank/AnimatedNumber';
import { RankBadge, rankStyle } from '@/components/rank/RankBadge';
import { XpBar } from '@/components/rank/XpBar';
import { useI18n } from '@/i18n';
import { RANKS, XP } from '@/lib/ranks';
import { useTiers } from '@/hooks/useTiers';
import { displayName, useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function Stat({ label, value, total, tab }: { label: string; value: number; total: number; tab: 'sheets' | 'challenges' | 'sos' }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/parcours', params: { tab } })}
      accessibilityRole="button"
      accessibilityLabel={`${label} : ${value} / ${total}. ${t.journey.seeAll}`}
      style={({ pressed }) => ({ flex: 1, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 2, opacity: pressed ? 0.7 : 1 })}
    >
      <AppText variant="title">
        {value}
        <AppText variant="caption" muted>
          {' '}/ {total}
        </AppText>
      </AppText>
      <AppText variant="caption" muted>
        {label}
      </AppText>
      <AppText variant="overline" color={colors.accentInk} style={{ marginTop: 4 }}>
        {t.journey.seeAll}
      </AppText>
    </Pressable>
  );
}

/** Profil : rang actuel, XP, parcours et échelle des rangs. */
export default function Profile() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { xp, rank, stored, reset } = useProgress();
  const insets = useSafeAreaInsets();
  const title = t.ranks.titles[rank.rank];
  const sosTotal = catalog.problems.reduce((n, p) => n + p.causes.length, 0);
  const next = RANKS[rank.index + 1];
  const { tiers } = useTiers();
  const hasName = Boolean(displayName(stored.identity));
  const name = displayName(stored.identity) || t.identity.anonymous;

  const confirmReset = () =>
    Alert.alert(t.profile.resetConfirmTitle, t.profile.resetConfirmBody, [
      { text: t.profile.resetCancel, style: 'cancel' },
      { text: t.profile.resetOk, style: 'destructive', onPress: reset },
    ]);

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
      {/* Carte d'identité du photographe */}
      <View
        style={{ alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.lg, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border }}
      >
        <Pressable
          onPress={() => router.push('/identite')}
          accessibilityRole="button"
          accessibilityLabel={`${name}. ${t.identity.edit}`}
          hitSlop={8}
          style={{ alignSelf: 'stretch', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md }}
        >
          <AppText variant="heading" numberOfLines={1} style={{ flex: 1 }} color={hasName ? colors.text : colors.textMuted}>
            {name}
          </AppText>
          <AppText variant="caption" color={colors.accentInk}>
            ✎ {t.identity.edit}
          </AppText>
        </Pressable>
        <Pressable onPress={() => router.push('/avatar')} accessibilityRole="button" accessibilityLabel={t.nav.avatar}>
          <Avatar look={stored.look} size={150} />
          <View style={{ position: 'absolute', right: -16, bottom: -4 }}>
            <RankBadge rank={rank.rank} size={64} />
          </View>
        </Pressable>
        <AppText variant="overline" color={colors.accentInk} style={{ marginTop: spacing.sm }}>
          {t.ranks.badge(rank.rank).toUpperCase()}
        </AppText>
        <AppText variant="title" style={{ textAlign: 'center' }}>
          {title}
        </AppText>
        <AnimatedNumber value={xp} format={t.ranks.xp} variant="display" color={colors.accentInk} />
        <View style={{ alignSelf: 'stretch', paddingHorizontal: spacing.lg, gap: spacing.xs }}>
          <XpBar progress={rank.progress} height={8} />
          <AppText variant="caption" muted style={{ textAlign: 'center' }}>
            {next ? t.ranks.toNext(next.min - xp, next.id) : t.ranks.max}
          </AppText>
        </View>
      </View>

      <WorkshopRow />

      {/* Parcours */}
      <View style={{ gap: spacing.sm }}>
        <AppText variant="overline" muted accessibilityRole="header">
          {t.profile.statsTitle}
        </AppText>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <Stat tab="sheets" label={t.profile.sheets} value={tiers.reduce((n, x) => n + x.sheetsDone, 0)} total={catalog.sheets.length} />
          <Stat tab="challenges" label={t.profile.challenges} value={tiers.reduce((n, x) => n + x.challengesDone, 0)} total={catalog.challenges.length} />
          <Stat tab="sos" label={t.profile.sos} value={Object.keys(stored.sos).length} total={sosTotal} />
        </View>
      </View>

      {/* Échelle des rangs */}
      <View style={{ gap: spacing.sm }}>
        <AppText variant="overline" muted accessibilityRole="header">
          {t.profile.ranksTitle}
        </AppText>
        {RANKS.map((r, i) => {
          const reached = i <= rank.index;
          const current = i === rank.index;
          const max = RANKS[i + 1] ? RANKS[i + 1].min - 1 : null;
          return (
            <View
              key={r.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: spacing.md,
                padding: spacing.sm + 4,
                borderRadius: radius.md,
                backgroundColor: current ? colors.surface : 'transparent',
                borderWidth: 1,
                borderColor: current ? rankStyle(r.id, colors).ring : colors.border,
                opacity: reached ? 1 : 0.5,
              }}
              accessible
              accessibilityLabel={`${t.ranks.badge(r.id)}, ${t.ranks.titles[r.id]}, ${t.ranks.range(r.min, max)}`}
            >
              <RankBadge rank={r.id} size={44} />
              <View style={{ flex: 1 }}>
                <AppText variant="heading" style={{ fontSize: 16 }}>
                  {t.ranks.titles[r.id]}
                </AppText>
                <AppText variant="caption" muted>
                  {t.ranks.range(r.min, max)}
                </AppText>
              </View>
              {reached && (
                <AppText variant="heading" color={current ? colors.accentInk : colors.success}>
                  {current ? '◆' : '✓'}
                </AppText>
              )}
            </View>
          );
        })}
      </View>

      {/* Barème */}
      <View style={{ gap: spacing.sm }}>
        <AppText variant="overline" muted accessibilityRole="header">
          {t.profile.earnTitle}
        </AppText>
        {[
          [t.profile.earnSheet, XP.sheetRead],
          [t.profile.earnChallenge, XP.challengeDone],
          [t.profile.earnSos, XP.sosViewed],
        ].map(([label, n]) => (
          <View key={String(label)} style={{ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md }}>
            <AppText style={{ flex: 1 }}>{label}</AppText>
            <AppText variant="mono" color={colors.accentInk}>
              {t.xp.gain(Number(n))}
            </AppText>
          </View>
        ))}
        <AppText variant="caption" muted>
          {t.profile.earnNote}
        </AppText>
      </View>

      {/* Sauvegarde */}
      <Pressable
        onPress={() => router.push('/sauvegarde')}
        accessibilityRole="button"
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          minHeight: HIT + spacing.md,
          padding: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: colors.primary,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <AppText variant="title" color={colors.primaryInk}>
          ⇩
        </AppText>
        <View style={{ flex: 1 }}>
          <AppText variant="heading">{t.backup.link}</AppText>
          <AppText variant="caption" muted>
            {t.backup.linkLead}
          </AppText>
        </View>
        <AppText variant="heading" muted>
          ›
        </AppText>
      </Pressable>

      <DataSection />

      <Pressable onPress={() => router.push('/bienvenue')} accessibilityRole="button" style={{ minHeight: HIT, justifyContent: 'center', alignItems: 'center' }}>
        <AppText variant="caption" color={colors.accentInk}>
          {t.legal.changeRole}
        </AppText>
      </Pressable>

      <Pressable
        onPress={confirmReset}
        accessibilityRole="button"
        style={({ pressed }) => ({ minHeight: HIT, justifyContent: 'center', alignItems: 'center', opacity: pressed ? 0.6 : 1 })}
      >
        <AppText variant="caption" color={colors.dangerInk}>
          {t.profile.reset}
        </AppText>
      </Pressable>
    </ScrollView>
  );
}
