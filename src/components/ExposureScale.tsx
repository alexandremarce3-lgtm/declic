import { View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';

/** Barème d'exposition −3 … +3, comme dans un viseur. */
export function ExposureScale({ value, target = 0 }: { value: number; target?: number }) {
  const { colors, spacing } = useTheme();
  const pos = (v: number) => `${((Math.max(-3, Math.min(3, v)) + 3) / 6) * 100}%` as const;
  const ok = Math.abs(value - target) < 0.5;

  return (
    <View style={{ gap: spacing.xs }} accessible={false}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        {[-3, -2, -1, 0, 1, 2, 3].map((n) => (
          <AppText key={n} variant="caption" muted style={{ width: 22, textAlign: 'center' }}>
            {n > 0 ? `+${n}` : n < 0 ? `−${-n}` : '0'}
          </AppText>
        ))}
      </View>
      <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.surfaceAlt, marginHorizontal: 11 }}>
        {target !== 0 && (
          <View
            style={{
              position: 'absolute',
              top: -4,
              left: pos(target),
              marginLeft: -1,
              width: 2,
              height: 14,
              backgroundColor: colors.textMuted,
            }}
          />
        )}
        <View
          style={{
            position: 'absolute',
            top: -5,
            left: pos(value),
            marginLeft: -8,
            width: 16,
            height: 16,
            borderRadius: 8,
            backgroundColor: ok ? colors.success : colors.accent,
          }}
        />
      </View>
    </View>
  );
}
