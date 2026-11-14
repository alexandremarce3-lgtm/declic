import { View } from 'react-native';
import Svg, { Circle, G, Rect } from 'react-native-svg';
import type { AchievementCategory } from '@/lib/achievements';
import type { RankId } from '@/lib/ranks';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { rankStyle } from '../rank/RankBadge';

/**
 * Médaille de succès : un disque cerclé de perforations de pellicule.
 * Olive pour les défis, couleur du rang pour les rangs, ambre pour les jalons, brique pour les secrets.
 * Verrouillé : gris ; secret verrouillé : « ? ».
 */
export function AchievementBadge({
  category,
  glyph,
  rank,
  unlocked,
  size = 64,
}: {
  category: AchievementCategory;
  glyph: string;
  rank?: RankId;
  unlocked: boolean;
  size?: number;
}) {
  const { colors } = useTheme();
  const palette = {
    challenge: { fill: colors.primary, ink: colors.onPrimary, ring: colors.primaryInk },
    milestone: { fill: colors.accent, ink: colors.onAccent, ring: colors.accentInk },
    secret: { fill: colors.danger, ink: colors.onDanger, ring: colors.dangerInk },
    rank: rank ? rankStyle(rank, colors) : { fill: colors.surfaceAlt, ink: colors.text, ring: colors.textMuted },
  }[category];
  const p = unlocked ? palette : { fill: colors.surfaceAlt, ink: colors.textMuted, ring: colors.border };
  const label = !unlocked && category === 'secret' ? '?' : glyph;
  const holes = 16;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 100 100" style={{ position: 'absolute' }}>
        <Circle cx={50} cy={50} r={48} fill={p.ring} />
        <Circle cx={50} cy={50} r={41} fill={p.fill} />
        {/* Perforations de pellicule */}
        <G>
          {Array.from({ length: holes }, (_, i) => {
            const a = (i / holes) * Math.PI * 2;
            const x = 50 + Math.cos(a) * 44.5;
            const y = 50 + Math.sin(a) * 44.5;
            return (
              <Rect
                key={i}
                x={x - 2}
                y={y - 2.6}
                width={4}
                height={5.2}
                rx={1}
                fill={p.fill}
                transform={`rotate(${(a * 180) / Math.PI} ${x} ${y})`}
              />
            );
          })}
        </G>
        <Circle cx={50} cy={50} r={33} fill="none" stroke={p.ink} strokeOpacity={0.25} strokeWidth={1} />
      </Svg>
      <AppText
        style={{
          fontFamily: category === 'challenge' ? fonts.sansSemi : fonts.serifItalic,
          fontSize: size * (label.length > 1 ? 0.3 : 0.38),
          lineHeight: size * 0.46,
          color: p.ink,
        }}
      >
        {label}
      </AppText>
    </View>
  );
}
