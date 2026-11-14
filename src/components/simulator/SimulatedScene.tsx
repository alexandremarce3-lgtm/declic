import { memo, useEffect, useMemo, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { exposureOffset, type ExposureSettings } from '@/lib/exposure';

/**
 * « Photo » simulée, dessinée uniquement avec des View (aucune dépendance native) :
 *  - ouverture → flou des lumières d'arrière-plan (copies décalées = faux bokeh)
 *  - vitesse   → traînée de la balle en mouvement
 *  - ISO       → grain numérique
 *  - les trois → luminosité globale
 * Les couleurs de la scène sont fixes : c'est une photo, pas l'interface.
 */

const HEIGHT = 230;

const LIGHTS = [
  { x: 0.08, y: 0.22, s: 14, c: '#FFD8A8' },
  { x: 0.24, y: 0.12, s: 10, c: '#FFE066' },
  { x: 0.42, y: 0.28, s: 16, c: '#FFC9C9' },
  { x: 0.6, y: 0.1, s: 12, c: '#FFD8A8' },
  { x: 0.78, y: 0.24, s: 18, c: '#D0EBFF' },
  { x: 0.92, y: 0.14, s: 11, c: '#FFE066' },
  { x: 0.52, y: 0.42, s: 9, c: '#FFF3BF' },
  { x: 0.16, y: 0.44, s: 12, c: '#FFE8CC' },
];

/** Générateur pseudo-aléatoire déterministe : le grain ne « saute » pas à chaque rendu */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const RING = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2;
  return { dx: Math.cos(a), dy: Math.sin(a) };
});

function Light({ x, y, s, c, blur, width }: { x: number; y: number; s: number; c: string; blur: number; width: number }) {
  const size = s + blur * 1.6;
  const left = x * width - size / 2;
  const top = y * HEIGHT - size / 2;
  if (blur < 1.5) {
    return <View style={[styles.dot, { left, top, width: size, height: size, backgroundColor: c }]} />;
  }
  const r = blur * 0.45;
  return (
    <>
      {RING.map(({ dx, dy }, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { left: left + dx * r, top: top + dy * r, width: size, height: size, backgroundColor: c, opacity: 0.22 },
          ]}
        />
      ))}
      <View style={[styles.dot, { left, top, width: size, height: size, backgroundColor: c, opacity: 0.35 }]} />
    </>
  );
}

function SceneBase({ settings, width, light = 0 }: { settings: ExposureSettings; width: number; light?: number }) {
  const { aperture, shutter, iso } = settings;

  // Ouverture → flou d'arrière-plan (px). f/1.4 ≈ 26 px, f/22 ≈ net.
  const blur = Math.max(0, 26 * (1.4 / aperture) - 1);

  // Vitesse → longueur de la traînée (px). 1/2000 ≈ 0, 1/8 ≈ 110.
  const streak = Math.min(150, shutter * 900);

  // ISO → densité et contraste du grain.
  const isoLevel = Math.max(0, Math.log2(iso / 100) / 6); // 0 à 1
  const grain = useMemo(() => {
    const rnd = seeded(42);
    return Array.from({ length: 260 }, () => ({ x: rnd(), y: rnd(), light: rnd() > 0.5 }));
  }, []);
  const grainCount = Math.round(grain.length * isoLevel);

  // Luminosité globale.
  const stops = exposureOffset(settings, light);
  const overlay =
    stops >= 0
      ? { backgroundColor: '#FFFFFF', opacity: Math.min(0.88, stops * 0.2) }
      : { backgroundColor: '#000000', opacity: Math.min(0.92, -stops * 0.22) };

  // Balle en mouvement continu (va-et-vient).
  const move = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(move, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(move, { toValue: 0, duration: 1800, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [move]);
  const translateX = move.interpolate({ inputRange: [0, 1], outputRange: [width * 0.52, width * 0.8] });

  const ghosts = streak < 2 ? [0] : Array.from({ length: 9 }, (_, i) => (i - 4) * (streak / 8));

  return (
    <View style={[styles.frame, { width, height: HEIGHT }]}>
      {/* Ciel du soir */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#2B2D42' }]} />
      <View style={[styles.band, { top: HEIGHT * 0.55, height: HEIGHT * 0.45, backgroundColor: '#3D405B' }]} />

      {/* Arrière-plan : lumières de la ville */}
      {LIGHTS.map((l, i) => (
        <Light key={i} {...l} blur={blur} width={width} />
      ))}

      {/* Sujet net (plan de mise au point) */}
      <View style={[styles.head, { left: width * 0.2 }]} />
      <View style={[styles.body, { left: width * 0.2 - 18 }]} />

      {/* Sujet en mouvement */}
      <Animated.View style={[styles.ballTrack, { transform: [{ translateX }] }]}>
        {ghosts.map((dx, i) => (
          <View
            key={i}
            style={[
              styles.ball,
              { transform: [{ translateX: dx }], opacity: ghosts.length === 1 ? 1 : 0.18 + (dx === 0 ? 0.3 : 0) },
            ]}
          />
        ))}
      </Animated.View>

      {/* Exposition */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, overlay]} />

      {/* Grain ISO (par-dessus l'exposition, comme un vrai bruit capteur) */}
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {grain.slice(0, grainCount).map((g, i) => (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: g.x * width,
              top: g.y * HEIGHT,
              width: 2,
              height: 2,
              backgroundColor: g.light ? '#FFFFFF' : '#000000',
              opacity: 0.25 + isoLevel * 0.5,
            }}
          />
        ))}
      </View>
    </View>
  );
}

export const SimulatedScene = memo(SceneBase);

const styles = StyleSheet.create({
  frame: { overflow: 'hidden', borderRadius: 18, backgroundColor: '#000' },
  band: { position: 'absolute', left: 0, right: 0 },
  dot: { position: 'absolute', borderRadius: 999 },
  head: {
    position: 'absolute',
    top: HEIGHT * 0.38,
    width: 34,
    height: 34,
    marginLeft: -17,
    borderRadius: 17,
    backgroundColor: '#F4A261',
  },
  body: {
    position: 'absolute',
    top: HEIGHT * 0.38 + 38,
    width: 36,
    height: HEIGHT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#E76F51',
  },
  ballTrack: { position: 'absolute', left: 0, top: HEIGHT * 0.66 },
  ball: { position: 'absolute', width: 26, height: 26, marginLeft: -13, borderRadius: 13, backgroundColor: '#E9F5DB' },
});
