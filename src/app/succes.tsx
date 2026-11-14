import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AchievementBadge } from '@/components/achievements/AchievementBadge';
import { achievementText } from '@/components/achievements/achievementText';
import { useGameState } from '@/hooks/useGameState';
import { useI18n } from '@/i18n';
import type { AchievementCategory } from '@/lib/achievements';
import type { RankId } from '@/lib/ranks';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';

const ORDER: AchievementCategory[] = ['challenge', 'rank', 'milestone', 'secret'];

/** Vitrine des succès : défis, rangs, jalons et secrets (masqués tant qu'ils ne sont pas trouvés). */
export default function Achievements() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { stored } = useProgress();
  const { achievements } = useGameState();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<string | null>(null);

  const total = achievements.length;
  const got = achievements.filter((a) => a.unlocked).length;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
      <View style={{ gap: spacing.xs }}>
        <AppText variant="display" color={colors.accentInk}>
          {got}
          <AppText variant="title" muted>
            {' '}/ {total}
          </AppText>
        </AppText>
        <AppText muted>{t.achievements.intro}</AppText>
      </View>

      {ORDER.map((cat) => {
        const list = achievements.filter((a) => a.category === cat);
        return (
          <View key={cat} style={{ gap: spacing.sm }}>
            <AppText variant="overline" muted accessibilityRole="header">
              {t.achievements.sections[cat]} · {list.filter((a) => a.unlocked).length}/{list.length}
            </AppText>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {list.map((a) => {
                const hidden = cat === 'secret' && !a.unlocked;
                const text = achievementText(a, t, catalog);
                const title = hidden ? t.achievements.hidden : text.title;
                const desc = hidden ? t.achievements.hiddenDesc : text.desc;
                const isOpen = selected === a.id;
                const date = stored.achievements[a.id];
                return (
                  <Pressable
                    key={a.id}
                    onPress={() => setSelected(isOpen ? null : a.id)}
                    accessibilityRole="button"
                    accessibilityState={{ expanded: isOpen }}
                    accessibilityLabel={`${title}. ${desc}`}
                    style={{
                      width: isOpen ? '100%' : '23%',
                      flexDirection: isOpen ? 'row' : 'column',
                      alignItems: 'center',
                      gap: spacing.sm,
                      padding: spacing.sm,
                      borderRadius: radius.md,
                      backgroundColor: isOpen ? colors.surface : 'transparent',
                      borderWidth: isOpen ? 1 : 0,
                      borderColor: colors.border,
                    }}
                  >
                    <AchievementBadge
                      category={a.category}
                      glyph={a.glyph}
                      rank={a.category === 'rank' ? (a.ref as RankId) : undefined}
                      unlocked={a.unlocked}
                      size={isOpen ? 64 : 56}
                    />
                    {isOpen ? (
                      <View style={{ flex: 1, gap: 2 }}>
                        <AppText variant="heading">{title}</AppText>
                        <AppText variant="caption" muted>
                          {desc}
                        </AppText>
                        {date && (
                          <AppText variant="overline" color={colors.accentInk}>
                            {t.achievements.unlockedOn(t.journal.date(date))}
                          </AppText>
                        )}
                      </View>
                    ) : (
                      <AppText variant="caption" muted={!a.unlocked} numberOfLines={2} style={{ textAlign: 'center', fontSize: 11, lineHeight: 14 }}>
                        {title}
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
