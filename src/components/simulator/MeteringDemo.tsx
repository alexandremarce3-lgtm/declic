import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '@/i18n';
import type { UiStrings } from '@/i18n/fr';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { ExposureScale } from '../ExposureScale';
import { StopSlider } from './StopSlider';

/**
 * Démo de la cellule : l'appareil ramène toute scène au gris moyen (18 %).
 * Couleurs en réflectance linéaire (0–1). Rendu = réflectance × 2^(biais + correction),
 * où biais = log2(0.18 / réflectance moyenne de la scène).
 */

type RGB = [number, number, number];

type Scene = {
  id: keyof UiStrings['metering']['scenes'];
  /** Réflectance moyenne : ce que « voit » la cellule */
  average: number;
  sky: RGB;
  ground: RGB;
  tree: RGB;
  subject: RGB;
};

const SCENES: Scene[] = [
  {
    id: 'neige',
    average: 0.5,
    sky: [0.55, 0.66, 0.82],
    ground: [0.86, 0.88, 0.9],
    tree: [0.04, 0.06, 0.05],
    subject: [0.45, 0.08, 0.06],
  },
  {
    id: 'parc',
    average: 0.18,
    sky: [0.35, 0.5, 0.75],
    ground: [0.12, 0.28, 0.08],
    tree: [0.05, 0.13, 0.04],
    subject: [0.5, 0.25, 0.12],
  },
  {
    id: 'sceneNoire',
    average: 0.06,
    sky: [0.015, 0.015, 0.02],
    ground: [0.03, 0.025, 0.03],
    tree: [0.01, 0.01, 0.01],
    subject: [0.55, 0.32, 0.2],
  },
];

/** Corrections au tiers de stop, comme sur un appareil */
const STEPS = Array.from({ length: 19 }, (_, i) => Math.round(((i - 9) / 3) * 100) / 100);

const toCss = (c: RGB, gain: number) => {
  const ch = (v: number) => Math.round(255 * Math.min(1, v * gain) ** (1 / 2.2));
  return `rgb(${ch(c[0])}, ${ch(c[1])}, ${ch(c[2])})`;
};

export function MeteringDemo() {
  const { colors, spacing, radius } = useTheme();
  const [sceneIdx, setSceneIdx] = useState(0);
  const [stepIdx, setStepIdx] = useState(9); // 0 EV
  const scene = SCENES[sceneIdx];
  const comp = STEPS[stepIdx];
  const bias = Math.log2(0.18 / scene.average);
  const ideal = -bias;
  const gain = 2 ** (bias + comp);
  const ok = Math.abs(comp - ideal) < 0.5;
  const { t } = useI18n();
  const m = t.metering;
  const sceneText = m.scenes[scene.id];

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
      }}
    >
      <AppText variant="overline" muted>
        {m.title}
      </AppText>

      {/* Choix de la scène */}
      <View style={{ flexDirection: 'row', gap: spacing.sm }} accessibilityRole="tablist">
        {SCENES.map((s, i) => {
          const active = i === sceneIdx;
          return (
            <Pressable
              key={s.id}
              onPress={() => {
                setSceneIdx(i);
                setStepIdx(9);
              }}
              accessibilityRole="tab"
              accessibilityState={{ selected: active }}
              style={{
                flex: 1,
                minHeight: HIT - 8,
                borderRadius: radius.pill,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? colors.primary : colors.surfaceAlt,
              }}
            >
              <AppText variant="caption" color={active ? colors.onPrimary : colors.text}>
                {m.scenes[s.id].label}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      {/* Scène rendue */}
      <View
        style={styles.frame}
        accessible
        accessibilityLabel={m.a11y(sceneText.label, t.format.ev(comp), ok)}
      >
        <View style={[StyleSheet.absoluteFill, { backgroundColor: toCss(scene.sky, gain) }]} />
        <View style={[styles.ground, { backgroundColor: toCss(scene.ground, gain) }]} />
        <View style={[styles.treeTop, { backgroundColor: toCss(scene.tree, gain) }]} />
        <View style={[styles.treeTrunk, { backgroundColor: toCss(scene.tree, gain) }]} />
        <View style={[styles.head, { backgroundColor: toCss(scene.subject, gain) }]} />
        <View style={[styles.body, { backgroundColor: toCss(scene.subject, gain) }]} />
      </View>

      <AppText variant="heading" accessibilityLiveRegion="polite">
        {ok ? m.good : comp < ideal ? m.tooDark : m.tooBright}
      </AppText>
      <AppText muted>{sceneText.advice}</AppText>

      <ExposureScale value={comp} target={ideal} />

      <StopSlider
        label={m.slider}
        hintLeft={m.darken}
        hintRight={m.brighten}
        count={STEPS.length}
        index={stepIdx}
        valueLabel={`${t.format.ev(comp)} EV`}
        onChange={setStepIdx}
        emphasized
      />
    </View>
  );
}

const H = 190;
const styles = StyleSheet.create({
  frame: { height: H, borderRadius: 18, overflow: 'hidden' },
  ground: { position: 'absolute', left: 0, right: 0, bottom: 0, height: H * 0.42 },
  treeTop: { position: 'absolute', left: '62%', top: H * 0.12, width: 70, height: 90, borderRadius: 35 },
  treeTrunk: { position: 'absolute', left: '62%', marginLeft: 30, top: H * 0.5, width: 10, height: H * 0.2 },
  head: { position: 'absolute', left: '24%', top: H * 0.34, width: 28, height: 28, borderRadius: 14 },
  body: {
    position: 'absolute',
    left: '24%',
    marginLeft: -2,
    top: H * 0.34 + 31,
    width: 32,
    height: H,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});
