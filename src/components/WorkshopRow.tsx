import { router, type Href } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';
import { useGameState } from '@/hooks/useGameState';
import { useI18n } from '@/i18n';
import { useJournal } from '@/storage/journal';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';
import { Avatar } from './avatar/Avatar';

/** « L'atelier » : accès rapide au carnet, à l'avatar et aux succès. */
export function WorkshopRow() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { stored } = useProgress();
  const { entries } = useJournal();
  const { achievements } = useGameState();

  const tiles: { href: Href; label: string; sub: string; icon: ReactNode }[] = [
    {
      href: '/carnet',
      label: t.workshop.journal,
      sub: t.workshop.journalCount(entries.length),
      icon: <AppText variant="title" color={colors.primaryInk}>▦</AppText>,
    },
    { href: '/avatar', label: t.workshop.avatar, sub: ' ', icon: <Avatar look={stored.look} size={34} /> },
    {
      href: '/succes',
      label: t.workshop.achievements,
      sub: t.workshop.achievementsCount(achievements.filter((a) => a.unlocked).length, achievements.length),
      icon: <AppText variant="title" color={colors.accentInk}>✶</AppText>,
    },
  ];

  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="overline" muted accessibilityRole="header">
        {t.workshop.title}
      </AppText>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {tiles.map((tile) => (
          <Pressable
            key={String(tile.href)}
            onPress={() => router.push(tile.href)}
            accessibilityRole="button"
            accessibilityLabel={`${tile.label}. ${tile.sub}`}
            style={({ pressed }) => ({
              flex: 1,
              minHeight: HIT * 2,
              padding: spacing.sm + 4,
              borderRadius: radius.md,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              justifyContent: 'space-between',
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View style={{ height: 38, justifyContent: 'center' }}>{tile.icon}</View>
            <View>
              <AppText variant="heading" style={{ fontSize: 15, lineHeight: 20 }}>
                {tile.label}
              </AppText>
              <AppText variant="caption" muted numberOfLines={1}>
                {tile.sub}
              </AppText>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
