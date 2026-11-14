import Slider from '@react-native-community/slider';
import * as Haptics from 'expo-haptics';
import type { ReactNode } from 'react';
import { View } from 'react-native';
import { COUNTERS } from '@/lib/achievements';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

type Props = {
  label: string;
  hintLeft: string;
  hintRight: string;
  count: number;
  index: number;
  valueLabel: string;
  onChange: (index: number) => void;
  emphasized?: boolean;
  /** Petit schéma optionnel à côté de la valeur (ex. iris) */
  adornment?: ReactNode;
};

/** Curseur crantée par « stops » — un cran = une valeur réelle d'appareil. */
export function StopSlider({ label, hintLeft, hintRight, count, index, valueLabel, onChange, emphasized, adornment }: Props) {
  const { colors, spacing } = useTheme();
  const { bump } = useProgress();
  return (
    <View style={{ gap: spacing.xs, opacity: emphasized ? 1 : 0.8 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <AppText variant="overline" muted={!emphasized} color={emphasized ? colors.accentInk : undefined}>
          {label.toUpperCase()}
        </AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}>
          {adornment}
          <AppText variant="mono">{valueLabel}</AppText>
        </View>
      </View>
      <Slider
        accessibilityLabel={label}
        accessibilityValue={{ text: valueLabel }}
        minimumValue={0}
        maximumValue={count - 1}
        step={1}
        value={index}
        onValueChange={(v) => {
          const i = Math.round(v);
          if (i !== index) {
            Haptics.selectionAsync().catch(() => {});
            bump(COUNTERS.sliderMoves); // succès secret « Mode rafale »
            onChange(i);
          }
        }}
        minimumTrackTintColor={emphasized ? colors.accent : colors.textMuted}
        maximumTrackTintColor={colors.border}
        thumbTintColor={emphasized ? colors.accent : colors.text}
        style={{ height: 44 }}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <AppText variant="caption" muted>
          {hintLeft}
        </AppText>
        <AppText variant="caption" muted>
          {hintRight}
        </AppText>
      </View>
    </View>
  );
}
