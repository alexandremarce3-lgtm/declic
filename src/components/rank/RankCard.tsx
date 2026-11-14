import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { Avatar } from '../avatar/Avatar';
import { AnimatedNumber } from './AnimatedNumber';
import { RankBadge } from './RankBadge';
import { XpBar } from './XpBar';

/** Encart de rang de l'accueil : insigne, intitulé, jauge vers le rang suivant. Ouvre le profil. */
export function RankCard() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { xp, rank, stored } = useProgress();
  const title = t.ranks.titles[rank.rank];
  const next = rank.nextMin === null ? null : (['C', 'B', 'A', 'S'] as const)[rank.index + 1];

  return (
    <Pressable
      onPress={() => router.push('/profil')}
      accessibilityRole="button"
      accessibilityLabel={`${t.ranks.a11y(rank.rank, title, xp)}. ${t.profile.homeA11y}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      {/* Avatar compagnon, insigne de rang en médaillon */}
      <View style={{ width: 70, height: 78 }}>
        <Avatar look={stored.look} size={70} />
        <View style={{ position: 'absolute', right: -8, bottom: -6 }}>
          <RankBadge rank={rank.rank} size={34} />
        </View>
      </View>
      <View style={{ flex: 1, gap: spacing.xs }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.sm }}>
          <AppText variant="overline" color={colors.accentInk}>
            {t.ranks.badge(rank.rank).toUpperCase()}
          </AppText>
          <AnimatedNumber value={xp} format={t.ranks.xp} variant="mono" />
        </View>
        <AppText variant="heading" numberOfLines={1}>
          {title}
        </AppText>
        <XpBar progress={rank.progress} />
        <AppText variant="caption" muted>
          {next && rank.nextMin !== null ? t.ranks.toNext(rank.nextMin - xp, next) : t.ranks.max}
        </AppText>
      </View>
    </Pressable>
  );
}
