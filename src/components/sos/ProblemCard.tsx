import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { LayoutAnimation, Pressable, View } from 'react-native';
import type { Cause, Problem } from '@/content';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { StepsList } from '../sheet/StepsList';

function CauseDetail({ cause }: { cause: Cause }) {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const sheet = cause.sheetId ? catalog.getSheet(cause.sheetId) : undefined;
  return (
    <View style={{ gap: spacing.md }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="heading">{cause.title}</AppText>
        <AppText muted>{cause.recognize}</AppText>
      </View>

      <View
        style={{
          alignSelf: 'flex-start',
          backgroundColor: colors.danger,
          borderRadius: radius.pill,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.xs + 2,
        }}
        accessible
        accessibilityLabel={t.sos.quickA11y(cause.quick)}
      >
        <AppText variant="caption" color={colors.onDanger}>
          ⚡ {cause.quick}
        </AppText>
      </View>

      <StepsList title={t.sos.solutions} items={cause.fixes} ordered />

      {cause.smartphone && (
        <AppText variant="caption" muted>
          {t.sos.smartphone(cause.smartphone)}
        </AppText>
      )}
      {sheet && (
        <Pressable
          onPress={() => router.push({ pathname: '/fiche/[id]', params: { id: sheet.id } })}
          accessibilityRole="link"
          hitSlop={8}
        >
          <AppText variant="caption" color={colors.dangerInk}>
            {t.sos.understand(sheet.title)}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

/** Carte de diagnostic : se déplie sur place pour donner la solution sans changer d'écran. */
export function ProblemCard({ problem, initiallyOpen }: { problem: Problem; initiallyOpen?: boolean }) {
  const { colors, spacing, radius } = useTheme();
  const [open, setOpen] = useState(Boolean(initiallyOpen));
  const [causeIdx, setCauseIdx] = useState<number | null>(problem.causes.length === 1 ? 0 : null);

  const animate = () => LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const cause = causeIdx === null ? undefined : problem.causes[causeIdx];
  const { markSosViewed } = useProgress();

  // +15 XP la première fois qu'une solution est affichée
  const visibleKey = open && cause ? `${problem.id}/${cause.id}` : null;
  useEffect(() => {
    if (visibleKey) markSosViewed(visibleKey);
  }, [visibleKey, markSosViewed]);

  return (
    <View
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: open ? colors.danger : colors.border,
        overflow: 'hidden',
      }}
    >
      <Pressable
        onPress={() => {
          animate();
          setOpen((v) => !v);
        }}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${problem.title}. ${problem.symptom}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          padding: spacing.md,
          minHeight: HIT + spacing.md,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: radius.md,
            backgroundColor: colors.surfaceAlt,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <AppText variant="title" color={colors.dangerInk}>
            {problem.glyph}
          </AppText>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <AppText variant="heading">{problem.title}</AppText>
          <AppText variant="caption" muted>
            {problem.symptom}
          </AppText>
        </View>
        <AppText variant="heading" muted style={{ transform: [{ rotate: open ? '90deg' : '0deg' }] }}>
          ›
        </AppText>
      </Pressable>

      {open && (
        <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.md }}>
          {problem.question && (
            <View style={{ gap: spacing.sm }}>
              <AppText>{problem.question}</AppText>
              <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup">
                {problem.causes.map((c, i) => {
                  const active = i === causeIdx;
                  return (
                    <Pressable
                      key={c.id}
                      onPress={() => {
                        animate();
                        setCauseIdx(i);
                      }}
                      accessibilityRole="radio"
                      accessibilityState={{ checked: active }}
                      style={{
                        minHeight: HIT,
                        paddingHorizontal: spacing.md,
                        borderRadius: radius.md,
                        justifyContent: 'center',
                        backgroundColor: active ? colors.danger : colors.surfaceAlt,
                      }}
                    >
                      <AppText color={active ? colors.onDanger : colors.text}>{c.label}</AppText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
          {cause && <CauseDetail cause={cause} />}
        </View>
      )}
    </View>
  );
}
