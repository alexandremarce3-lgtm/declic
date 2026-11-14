import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { ChallengePhotos } from '@/components/journal/ChallengePhotos';
import { StepsList } from '@/components/sheet/StepsList';
import type { Challenge, TierId } from '@/content';
import { useTiers } from '@/hooks/useTiers';
import { TIERS } from '@/lib/tiers';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

function ChallengeCard({ item, expanded, onToggleExpand }: { item: Challenge; expanded: boolean; onToggleExpand: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { getSheet } = catalog;
  const { isDone, toggle, isCredited } = useProgress();
  const done = isDone(item.id);
  const credited = !done && isCredited('challenge', item.id);
  const sheet = getSheet(item.sheetId);

  return (
    <View
      style={{
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: done ? colors.success : colors.border,
        gap: spacing.sm,
      }}
    >
      <Pressable
        onPress={onToggleExpand}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityHint={t.challenges.expandHint}
        style={{ gap: spacing.sm }}
      >
        <AppText variant="caption" muted>
          {'●'.repeat(item.level)}
          {'○'.repeat(3 - item.level)} {t.challenges.levels[item.level]}
          {credited ? ` · ◇ ${t.tiers.credited}` : ''}
        </AppText>
        <AppText variant="heading">{item.title}</AppText>
        <AppText muted>{item.brief}</AppText>
      </Pressable>

      {expanded && (
        <View style={{ gap: spacing.md, paddingTop: spacing.xs }}>
          <StepsList title={t.challenges.howTo} items={item.steps} ordered />
          {item.smartphone && (
            <AppText variant="caption" muted>
              {t.challenges.smartphone(item.smartphone)}
            </AppText>
          )}
          {sheet && (
            <Pressable
              onPress={() => router.push({ pathname: '/fiche/[id]', params: { id: sheet.id } })}
              accessibilityRole="link"
              hitSlop={8}
            >
              <AppText variant="caption" color={colors.accentInk}>
                {t.challenges.review(sheet.title)}
              </AppText>
            </Pressable>
          )}
        </View>
      )}

      <ChallengePhotos challengeId={item.id} />

      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
        <View
          style={{
            backgroundColor: colors.surfaceAlt,
            borderRadius: radius.pill,
            paddingHorizontal: spacing.sm + 2,
            paddingVertical: spacing.xs,
            flexShrink: 1,
          }}
        >
          <AppText variant="caption">{item.settings}</AppText>
        </View>
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(
              done ? Haptics.NotificationFeedbackType.Warning : Haptics.NotificationFeedbackType.Success,
            ).catch(() => {});
            toggle(item.id);
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: done }}
          accessibilityLabel={t.challenges.markA11y(item.title)}
          style={({ pressed }) => ({
            minHeight: HIT,
            minWidth: 112,
            paddingHorizontal: spacing.md,
            borderRadius: radius.pill,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: done ? colors.success : 'transparent',
            borderWidth: done ? 0 : 1.5,
            borderColor: colors.text,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <AppText variant="caption" color={done ? colors.bg : colors.text}>
            {done ? t.challenges.done : t.challenges.markDone}
          </AppText>
        </Pressable>
      </View>
    </View>
  );
}

/** Défis pratiques, validés localement (AsyncStorage). `?focus=<id>` ouvre un défi précis. */
type Row = { kind: 'tier'; tier: TierId } | { kind: 'challenge'; item: Challenge; locked: boolean };

function TierHeader({ tier, locked }: { tier: TierId; locked: boolean }) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  return (
    <View style={{ marginTop: spacing.md, gap: 2 }}>
      <AppText variant="overline" color={locked ? colors.dangerInk : colors.primaryInk}>
        {locked ? `🔒 ${t.tiers.levels[tier]}` : t.tiers.levels[tier]}
      </AppText>
      <AppText variant="title" accessibilityRole="header" color={locked ? colors.textMuted : colors.text}>
        {t.tiers.names[tier]}
      </AppText>
      {locked && tier !== 'fondamental' && (
        <AppText variant="caption" muted>
          {t.tiers.conditions[tier]}
        </AppText>
      )}
    </View>
  );
}

function LockedChallenge({ item }: { item: Challenge }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  return (
    <View
      accessible
      accessibilityLabel={t.tiers.lockedA11y(item.title)}
      style={{ padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, gap: spacing.xs, opacity: 0.55 }}
    >
      <AppText variant="heading">🔒 {item.title}</AppText>
      <AppText variant="caption" muted numberOfLines={2}>
        {item.brief}
      </AppText>
    </View>
  );
}

/** Défis pratiques par palier, validés localement. `?focus=<id>` ouvre un défi précis. */
export default function Challenges() {
  const { focus } = useLocalSearchParams<{ focus?: string }>();
  const { spacing } = useTheme();
  const { t, catalog } = useI18n();
  const { isOpen } = useTiers();
  const insets = useSafeAreaInsets();
  const [expanded, setExpanded] = useState<string | undefined>(focus);
  const list = useRef<FlatList<Row>>(null);

  const rows: Row[] = TIERS.flatMap((tier) => {
    const items = catalog.challenges.filter((c) => c.tier === tier);
    if (!items.length) return [];
    const locked = !isOpen(tier);
    return [{ kind: 'tier', tier } as Row, ...items.map((item) => ({ kind: 'challenge', item, locked }) as Row)];
  });

  useEffect(() => {
    const index = rows.findIndex((r) => r.kind === 'challenge' && r.item.id === focus);
    if (index > 0) {
      const timer = setTimeout(() => list.current?.scrollToIndex({ index, viewOffset: spacing.md }), 250);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus]);

  return (
    <FlatList
      ref={list}
      data={rows}
      keyExtractor={(r) => (r.kind === 'tier' ? `tier-${r.tier}` : r.item.id)}
      onScrollToIndexFailed={() => {}}
      contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}
      ListHeaderComponent={<AppText muted>{t.challenges.intro}</AppText>}
      renderItem={({ item: row }) =>
        row.kind === 'tier' ? (
          <TierHeader tier={row.tier} locked={!isOpen(row.tier)} />
        ) : row.locked ? (
          <LockedChallenge item={row.item} />
        ) : (
          <ChallengeCard
            item={row.item}
            expanded={expanded === row.item.id}
            onToggleExpand={() => setExpanded((cur) => (cur === row.item.id ? undefined : row.item.id))}
          />
        )
      }
    />
  );
}