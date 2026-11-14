import { View } from 'react-native';
import type { RankId } from '@/lib/ranks';
import { fonts } from '@/theme/tokens';
import { useTheme, type Theme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/** Habillage de chaque rang : du gris ardoise (C) à l'or sur noir (S). */
export function rankStyle(rank: RankId, colors: Theme['colors']) {
  switch (rank) {
    case 'C':
      return { fill: colors.surfaceAlt, ink: colors.text, ring: colors.textMuted };
    case 'B':
      return { fill: colors.primary, ink: colors.onPrimary, ring: colors.primaryInk };
    case 'A':
      return { fill: colors.accent, ink: colors.onAccent, ring: colors.accentInk };
    case 'S':
      return { fill: '#0A0C10', ink: colors.accent, ring: colors.accent };
  }
}

/**
 * Insigne de rang : losange à double filet, lettre en serif italique,
 * comme un grade de chasseur dans un webtoon.
 */
export function RankBadge({ rank, size = 56 }: { rank: RankId; size?: number }) {
  const { colors } = useTheme();
  const s = rankStyle(rank, colors);
  const side = size / Math.SQRT2; // le losange tourné tient dans `size`
  const gap = Math.max(2, size * 0.06);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }} accessible={false}>
      {/* Filet extérieur */}
      <View
        style={{
          position: 'absolute',
          width: side,
          height: side,
          borderWidth: Math.max(1, size * 0.025),
          borderColor: s.ring,
          transform: [{ rotate: '45deg' }],
        }}
      />
      {/* Plaque */}
      <View
        style={{
          position: 'absolute',
          width: side - gap * 2.6,
          height: side - gap * 2.6,
          backgroundColor: s.fill,
          borderWidth: rank === 'S' ? Math.max(1, size * 0.02) : 0,
          borderColor: s.ring,
          transform: [{ rotate: '45deg' }],
        }}
      />
      <AppText
        style={{
          fontFamily: fonts.serifItalic,
          fontSize: size * 0.46,
          lineHeight: size * 0.56,
          color: s.ink,
          marginTop: -size * 0.02,
        }}
      >
        {rank}
      </AppText>
    </View>
  );
}
