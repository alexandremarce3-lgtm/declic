import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { XpBar } from '@/components/rank/XpBar';
import { useTiers } from '@/hooks/useTiers';
import { useI18n } from '@/i18n';
import { TIERS } from '@/lib/tiers';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Tab = 'sheets' | 'challenges' | 'sos';
type Status = 'done' | 'credited' | 'todo' | 'locked';
type Row = { key: string; title: string; status: Status; date?: string; href?: Href };

/** Checklist complète : fiches lues, défis réussis, solutions SOS consultées. */
export default function Journey() {
  const params = useLocalSearchParams<{ tab?: string }>();
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { stored } = useProgress();
  const { isOpen } = useTiers();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<Tab>((['sheets', 'challenges', 'sos'] as Tab[]).includes(params.tab as Tab) ? (params.tab as Tab) : 'sheets');

  const statusOf = (kind: 'sheet' | 'challenge', id: string, open: boolean): { status: Status; date?: string } => {
    const date = (kind === 'sheet' ? stored.sheets : stored.challenges)[id];
    if (date) return { status: 'done', date };
    if (stored.credited[`${kind}:${id}`]) return { status: 'credited' };
    return { status: open ? 'todo' : 'locked' };
  };

  // Groupes : par palier pour fiches et défis, par symptôme pour le SOS
  const groups: { key: string; title: string; rows: Row[] }[] =
    tab === 'sos'
      ? catalog.problems.map((p) => ({
          key: p.id,
          title: p.title,
          rows: p.causes.map((c) => {
            const date = stored.sos[`${p.id}/${c.id}`];
            return {
              key: `${p.id}/${c.id}`,
              title: c.title,
              status: date ? 'done' : 'todo',
              date,
              href: { pathname: '/sos', params: { probleme: p.id } },
            } as Row;
          }),
        }))
      : TIERS.map((tier) => {
          const open = isOpen(tier);
          const rows: Row[] =
            tab === 'sheets'
              ? catalog.sheets
                  .filter((s) => s.tier === tier)
                  .map((s) => ({ key: s.id, title: s.title, ...statusOf('sheet', s.id, open), href: { pathname: '/fiche/[id]', params: { id: s.id } } }))
              : catalog.challenges
                  .filter((c) => c.tier === tier)
                  .map((c) => ({ key: c.id, title: c.title, ...statusOf('challenge', c.id, open), href: { pathname: '/defis', params: { focus: c.id } } }));
          return { key: tier, title: t.tiers.names[tier], rows };
        });

  const all = groups.flatMap((g) => g.rows);
  const doneCount = all.filter((r) => r.status === 'done' || r.status === 'credited').length;

  const icon: Record<Status, { glyph: string; color: string; label: string }> = {
    done: { glyph: '✓', color: colors.success, label: '' },
    credited: { glyph: '◇', color: colors.accentInk, label: t.journey.credited },
    todo: { glyph: '○', color: colors.textMuted, label: t.journey.todo },
    locked: { glyph: '🔒', color: colors.textMuted, label: t.journey.locked },
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
      {/* Onglets */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }} accessibilityRole="tablist">
        {(['sheets', 'challenges', 'sos'] as Tab[]).map((k) => {
          const active = k === tab;
          return (
            <Pressable
              key={k}
              onPress={() => setTab(k)}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={{
                flex: 1,
                minHeight: HIT - 4,
                borderRadius: radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.primary : colors.surfaceAlt,
              }}
            >
              <AppText variant="caption" color={active ? colors.onPrimary : colors.text}>
                {t.journey.tabs[k]}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: spacing.xs }}>
        <AppText variant="display" color={colors.accentInk}>
          {doneCount}
          <AppText variant="title" muted>
            {' '}/ {all.length}
          </AppText>
        </AppText>
        <XpBar progress={all.length ? doneCount / all.length : 0} />
      </View>

      {groups.map((g) => {
        const groupDone = g.rows.filter((r) => r.status === 'done' || r.status === 'credited').length;
        return (
          <View key={g.key} style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
              <AppText variant="overline" muted accessibilityRole="header">
                {g.title.toUpperCase()}
              </AppText>
              <AppText variant="overline" muted>
                {t.journey.summary(groupDone, g.rows.length)}
              </AppText>
            </View>
            <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}>
              {g.rows.map((r, i) => {
                const s = icon[r.status];
                const sub = r.status === 'done' && r.date ? t.journey.done(t.journal.date(r.date)) : s.label;
                const disabled = r.status === 'locked' || !r.href;
                return (
                  <Pressable
                    key={r.key}
                    onPress={() => r.href && router.push(r.href)}
                    disabled={disabled}
                    accessibilityRole="button"
                    accessibilityState={{ disabled, checked: r.status === 'done' || r.status === 'credited' }}
                    accessibilityLabel={`${r.title}. ${sub}`}
                    style={({ pressed }) => ({
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: spacing.md,
                      minHeight: HIT + 4,
                      paddingHorizontal: spacing.md,
                      paddingVertical: spacing.sm,
                      borderTopWidth: i === 0 ? 0 : 1,
                      borderTopColor: colors.border,
                      opacity: r.status === 'locked' ? 0.5 : pressed ? 0.6 : 1,
                    })}
                  >
                    <AppText variant="heading" color={s.color} style={{ width: 24, textAlign: 'center' }}>
                      {s.glyph}
                    </AppText>
                    <View style={{ flex: 1 }}>
                      <AppText style={{ fontSize: 15, lineHeight: 21 }}>{r.title}</AppText>
                      {sub ? (
                        <AppText variant="caption" muted>
                          {sub}
                        </AppText>
                      ) : null}
                    </View>
                    {!disabled && (
                      <AppText variant="heading" muted>
                        ›
                      </AppText>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
