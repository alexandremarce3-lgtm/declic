import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useTiers } from '@/hooks/useTiers';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

type Link = { key: string; isChallenge: boolean; title: string; done?: boolean; locked: boolean; onPress: () => void };

/** « Pour aller plus loin » : fiches liées et défis à tenter. */
export function RelatedLinks({ sheets = [], challenges = [] }: { sheets?: string[]; challenges?: string[] }) {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { isDone } = useProgress();
  const { isOpen } = useTiers();

  const links: Link[] = [
    ...sheets.flatMap((id) => {
      const s = catalog.getSheet(id);
      return s
        ? [{ key: `s-${id}`, isChallenge: false, title: s.title, locked: !isOpen(s.tier), onPress: () => router.push({ pathname: '/fiche/[id]', params: { id } }) }]
        : [];
    }),
    ...challenges.flatMap((id) => {
      const c = catalog.getChallenge(id);
      return c
        ? [{ key: `c-${id}`, isChallenge: true, title: c.title, done: isDone(id), locked: !isOpen(c.tier), onPress: () => router.push({ pathname: '/defis', params: { focus: id } }) }]
        : [];
    }),
  ];
  if (!links.length) return null;

  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="overline" muted accessibilityRole="header">
        {t.sheet.related}
      </AppText>
      {links.map((l) => (
        <Pressable
          key={l.key}
          onPress={l.onPress}
          disabled={l.locked}
          accessibilityRole="link"
          accessibilityState={{ disabled: l.locked }}
          accessibilityLabel={l.locked ? t.tiers.lockedA11y(l.title) : t.sheet.relatedA11y(l.isChallenge, l.title, Boolean(l.done))}
          style={({ pressed }) => ({
            minHeight: HIT,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            opacity: l.locked ? 0.5 : pressed ? 0.6 : 1,
          })}
        >
          <View style={{ flex: 1 }}>
            <AppText variant="overline" color={l.isChallenge ? colors.accentInk : colors.textMuted}>
              {l.isChallenge ? t.sheet.kindChallenge : t.sheet.kindSheet}
            </AppText>
            <AppText variant="heading" style={{ fontSize: 16 }}>
              {l.title}
            </AppText>
          </View>
          <AppText variant="heading" color={l.done ? colors.success : colors.textMuted}>
            {l.locked ? '🔒' : l.done ? '✓' : '›'}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
