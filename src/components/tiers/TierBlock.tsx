import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import type { Section, Sheet } from '@/content';
import type { TierStatus } from '@/hooks/useTiers';
import { useI18n } from '@/i18n';
import { QUIZ_LENGTH } from '@/lib/tiers';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { XpBar } from '../rank/XpBar';
import { SheetCard } from '../SheetCard';
import { SituationCard } from '../SituationCard';

const openSheet = (id: string) => router.push({ pathname: '/fiche/[id]', params: { id } });

/** Découpe une liste en lignes de n éléments (grille sans dépendance) */
const rows = <T,>(list: T[], n: number) =>
  Array.from({ length: Math.ceil(list.length / n) }, (_, i) => list.slice(i * n, i * n + n));

function SectionBody({ section, items, locked }: { section: Section; items: Sheet[]; locked: boolean }) {
  const { spacing } = useTheme();
  if (section.layout === 'grid') {
    return (
      <View style={{ gap: spacing.sm + 4 }}>
        {rows(items, 2).map((row, r) => (
          <View key={r} style={{ flexDirection: 'row', gap: spacing.sm + 4 }}>
            {row.map((s) => (
              <SituationCard key={s.id} sheet={s} locked={locked} onPress={() => openSheet(s.id)} />
            ))}
            {row.length === 1 && <View style={{ flex: 1 }} />}
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap: spacing.sm + 4 }}>
      {items.map((s, i) => (
        <SheetCard key={s.id} sheet={s} number={i + 1} locked={locked} onPress={() => openSheet(s.id)} />
      ))}
    </View>
  );
}

/**
 * Un palier du sommaire : en-tête (niveau, avancement, verrou), proposition de test,
 * puis ses fiches rangées par section.
 */
export function TierBlock({ status }: { status: TierStatus }) {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const locked = !status.unlocked;
  const name = t.tiers.names[status.id];
  const total = status.sheetsTotal + status.challengesTotal;
  const done = status.sheetsDone + status.challengesDone;
  const nextName = status.next ? t.tiers.names[status.next] : '';

  return (
    <View style={{ gap: spacing.md, marginTop: spacing.lg }}>
      {/* En-tête du palier, façon chapitre de magazine */}
      <View style={{ gap: spacing.xs, paddingTop: spacing.md, borderTopWidth: 2, borderTopColor: locked ? colors.border : colors.primary }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText variant="overline" color={locked ? colors.textMuted : colors.primaryInk}>
            {t.tiers.levels[status.id]}
          </AppText>
          <AppText variant="overline" color={locked ? colors.dangerInk : colors.textMuted}>
            {locked ? `🔒 ${t.tiers.locked}` : status.reason ? t.tiers.unlockedBy[status.reason].toUpperCase() : ''}
          </AppText>
        </View>
        <AppText variant="title" accessibilityRole="header" color={locked ? colors.textMuted : colors.text}>
          {name}
        </AppText>
        <AppText muted>{t.tiers.leads[status.id]}</AppText>
        {locked ? (
          <AppText variant="caption" color={colors.dangerInk}>
            {status.id !== 'fondamental' ? t.tiers.conditions[status.id] : ''}
          </AppText>
        ) : (
          <View style={{ gap: 4, marginTop: spacing.xs }}>
            <XpBar progress={total ? done / total : 0} height={4} color={colors.primaryInk} />
            <AppText variant="caption" muted>
              {t.tiers.progress(status.sheetsDone, status.sheetsTotal, status.challengesDone, status.challengesTotal)}
            </AppText>
          </View>
        )}
      </View>

      {/* Saut de palier */}
      {status.quizUseful && status.next && (
        <Pressable
          onPress={() => router.push({ pathname: '/quiz/[tier]', params: { tier: status.id } })}
          accessibilityRole="button"
          style={({ pressed }) => ({
            minHeight: HIT,
            padding: spacing.md,
            borderRadius: radius.lg,
            backgroundColor: colors.accent,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <AppText variant="title" color={colors.onAccent}>
            ⇪
          </AppText>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" color={colors.onAccent}>
              {t.quiz.cta}
            </AppText>
            <AppText variant="caption" color={colors.onAccent}>
              {t.quiz.ctaLead(QUIZ_LENGTH, nextName)}
            </AppText>
          </View>
          <AppText variant="heading" color={colors.onAccent}>
            ›
          </AppText>
        </Pressable>
      )}

      {catalog.sections.map((section) => {
        const items = catalog.sheets.filter((s) => s.tier === status.id && s.section === section.id);
        if (!items.length) return null;
        return (
          <View key={section.id} style={{ gap: spacing.sm + 4 }}>
            <View style={{ gap: 2 }}>
              <AppText variant="heading" color={locked ? colors.textMuted : colors.text}>
                {section.title}
              </AppText>
              <AppText variant="caption" muted>
                {section.lead}
              </AppText>
            </View>
            <SectionBody section={section} items={items} locked={locked} />
          </View>
        );
      })}
    </View>
  );
}
