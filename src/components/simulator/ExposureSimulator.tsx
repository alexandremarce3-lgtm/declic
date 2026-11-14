import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { COUNTERS } from '@/lib/achievements';
import { useProgress } from '@/storage/progress';
import { Pressable, View } from 'react-native';
import type { ExposureParam } from '@/content/types';
import {
  APERTURES,
  ISOS,
  REFERENCE,
  EXPOSURE_TOLERANCE,
  SHUTTERS,
  exposureOffset,
  formatAperture,
  formatIso,
  formatShutter,
  nearestIndex,
  type ExposureSettings,
} from '@/lib/exposure';
import { useI18n } from '@/i18n';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { ExposureScale } from '../ExposureScale';
import { SimulatedScene } from './SimulatedScene';
import { StopSlider } from './StopSlider';

type Indices = Record<ExposureParam, number>;

const toIndices = (preset?: Partial<ExposureSettings>): Indices => ({
  aperture: nearestIndex(APERTURES, preset?.aperture ?? REFERENCE.aperture),
  shutter: nearestIndex(SHUTTERS, preset?.shutter ?? REFERENCE.shutter),
  iso: nearestIndex(ISOS, preset?.iso ?? REFERENCE.iso),
});

const ORDER: Record<ExposureParam | 'all', ExposureParam[]> = {
  all: ['aperture', 'shutter', 'iso'],
  aperture: ['aperture', 'shutter', 'iso'],
  shutter: ['shutter', 'aperture', 'iso'],
  iso: ['iso', 'aperture', 'shutter'],
};

/** Schéma d'iris : le trou grandit quand le nombre f/ diminue. */
function Iris({ aperture }: { aperture: number }) {
  const { colors } = useTheme();
  const d = 6 + 18 * (1.4 / aperture) ** 0.6;
  return (
    <View
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: colors.text,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <View style={{ width: d, height: d, borderRadius: d / 2, backgroundColor: colors.bg }} />
    </View>
  );
}

type Props = {
  /** Réglage mis en avant ; 'all' affiche les trois à égalité */
  focus: ExposureParam | 'all';
  preset?: Partial<ExposureSettings>;
  /** Lumière de la scène en stops (0 = plein jour) */
  light?: number;
};

export function ExposureSimulator({ focus, preset, light = 0 }: Props) {
  const { colors, spacing, radius } = useTheme();
  const initial = useMemo(() => toIndices(preset), [preset]);
  const [width, setWidth] = useState(0);
  const [idx, setIdx] = useState(initial);
  const [showOthers, setShowOthers] = useState(focus === 'all');

  const settings = { aperture: APERTURES[idx.aperture], shutter: SHUTTERS[idx.shutter], iso: ISOS[idx.iso] };
  const stops = exposureOffset(settings, light);
  const { t } = useI18n();
  const s = t.simulator;
  const verdict =
    Math.abs(stops) < EXPOSURE_TOLERANCE ? s.correct : stops > 0 ? s.over(stops) : s.under(-stops);

  // Retour à une exposition correcte après l'avoir quittée → succès secret « Œil de cellule »
  const correct = Math.abs(stops) < EXPOSURE_TOLERANCE;
  const wasOff = useRef(false);
  const { bump } = useProgress();
  useEffect(() => {
    if (!correct) wasOff.current = true;
    else if (wasOff.current) {
      wasOff.current = false;
      bump(COUNTERS.perfectExposures);
    }
  }, [correct, bump]);

  const set = (k: ExposureParam) => (i: number) => setIdx((p) => ({ ...p, [k]: i }));
  const emph = (k: ExposureParam) => focus === 'all' || focus === k;

  const sliders: Record<ExposureParam, ReactNode> = {
    aperture: (
      <StopSlider
        key="aperture"
        label={s.aperture.label}
        hintLeft={s.aperture.left}
        hintRight={s.aperture.right}
        count={APERTURES.length}
        index={idx.aperture}
        valueLabel={formatAperture(settings.aperture)}
        onChange={set('aperture')}
        emphasized={emph('aperture')}
        adornment={<Iris aperture={settings.aperture} />}
      />
    ),
    shutter: (
      <StopSlider
        key="shutter"
        label={s.shutter.label}
        hintLeft={s.shutter.left}
        hintRight={s.shutter.right}
        count={SHUTTERS.length}
        index={idx.shutter}
        valueLabel={formatShutter(settings.shutter)}
        onChange={set('shutter')}
        emphasized={emph('shutter')}
      />
    ),
    iso: (
      <StopSlider
        key="iso"
        label={s.iso.label}
        hintLeft={s.iso.left}
        hintRight={s.iso.right}
        count={ISOS.length}
        index={idx.iso}
        valueLabel={formatIso(settings.iso)}
        onChange={set('iso')}
        emphasized={emph('iso')}
      />
    ),
  };

  const [main, ...others] = ORDER[focus];

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width - spacing.md * 2)}
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="overline" muted>
          {light < 0 ? s.titleNight : s.title}
        </AppText>
        <Pressable
          onPress={() => setIdx(initial)}
          accessibilityRole="button"
          hitSlop={12}
          style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}
        >
          <AppText variant="caption" color={colors.accentInk}>
            {s.reset}
          </AppText>
        </Pressable>
      </View>

      {width > 0 && (
        <View accessible accessibilityLabel={s.sceneA11y(verdict)}>
          <SimulatedScene settings={settings} width={width} light={light} />
        </View>
      )}

      <AppText variant="heading" accessibilityLiveRegion="polite">
        {verdict}
      </AppText>
      <ExposureScale value={stops} />

      {sliders[main]}

      {focus !== 'all' && (
        <Pressable
          onPress={() => setShowOthers((v) => !v)}
          accessibilityRole="button"
          accessibilityState={{ expanded: showOthers }}
          style={({ pressed }) => ({ minHeight: HIT, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
        >
          <AppText variant="caption" color={colors.accentInk}>
            {showOthers ? s.hideOthers : s.showOthers}
          </AppText>
        </Pressable>
      )}
      {showOthers && others.map((k) => sliders[k])}
    </View>
  );
}
