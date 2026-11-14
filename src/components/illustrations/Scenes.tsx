import { memo, useMemo } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';

/**
 * Petites « photos » dessinées pour les exemples avant / après des fiches débutant.
 * Chaque scène montre UN effet, de façon exagérée, pour être comprise d'un coup d'œil.
 * Repère : viewBox 160 × 120. Couleurs fixes : ce sont des images, pas l'interface.
 */

import type { SceneId } from '@/content/types';

export type { SceneId };

const SKIN = '#E0A97F';
const INK = '#1B1D1B';

function seeded(seed: number) {
  let s = seed;
  return () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
}

// ——— Briques ———

/** Personne vue en buste, nette (le sujet) */
function Person({ x = 80 }: { x?: number }) {
  return (
    <G>
      <Path d={`M${x - 26} 120 C${x - 26} 96 ${x - 14} 86 ${x} 86 C${x + 14} 86 ${x + 26} 96 ${x + 26} 120 Z`} fill="#C2593F" />
      <Circle cx={x} cy={68} r={17} fill={SKIN} />
      <Path d={`M${x - 17} 66 C${x - 17} 46 ${x + 17} 46 ${x + 17} 66 C${x + 10} 58 ${x - 10} 58 ${x - 17} 66 Z`} fill="#3A2A1E" />
      <Circle cx={x - 6} cy={70} r={1.8} fill={INK} />
      <Circle cx={x + 6} cy={70} r={1.8} fill={INK} />
      <Path d={`M${x - 5} 77 Q${x} 81 ${x + 5} 77`} stroke={INK} strokeWidth={1.5} fill="none" strokeLinecap="round" />
    </G>
  );
}

/** Arbres et maison nets (arrière-plan lisible) */
function SharpBackground() {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#BFD7EA" />
      <Rect x={0} y={78} width={160} height={42} fill="#7FA36B" />
      {[18, 132].map((x) => (
        <G key={x}>
          <Rect x={x - 2} y={60} width={4} height={22} fill="#5C4033" />
          <Polygon points={`${x},22 ${x - 14},64 ${x + 14},64`} fill="#2D6A4F" />
        </G>
      ))}
      <Rect x={104} y={50} width={22} height={30} fill="#E9D8A6" />
      <Polygon points="102,50 115,38 128,50" fill="#A6432B" />
      <Rect x={111} y={64} width={7} height={16} fill="#5C4033" />
      <Rect x={36} y={48} width={14} height={10} fill="#FFFFFF" opacity={0.9} />
    </G>
  );
}

/** Même arrière-plan, mais fondu : des taches douces (bokeh) */
function BlurredBackground() {
  const blobs: [number, number, number, string][] = [
    [18, 44, 26, '#2D6A4F'],
    [132, 44, 26, '#2D6A4F'],
    [115, 60, 22, '#E9D8A6'],
    [114, 44, 14, '#A6432B'],
    [42, 54, 14, '#FFFFFF'],
    [150, 20, 10, '#FFF3BF'],
    [60, 18, 8, '#FFF3BF'],
  ];
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#BFD7EA" />
      <Rect x={0} y={74} width={160} height={46} fill="#8FB07C" opacity={0.9} />
      {blobs.map(([x, y, r, c], i) => (
        <G key={i}>
          <Circle cx={x} cy={y} r={r * 1.35} fill={c} opacity={0.18} />
          <Circle cx={x} cy={y} r={r} fill={c} opacity={0.35} />
        </G>
      ))}
    </G>
  );
}

/** Enfant qui court (silhouette simple) */
function Runner({ x, opacity = 1 }: { x: number; opacity?: number }) {
  return (
    <G opacity={opacity} stroke="#C2593F" strokeWidth={7} strokeLinecap="round" fill="none">
      <Circle cx={x + 4} cy={40} r={8} fill={SKIN} stroke="none" />
      <Line x1={x} y1={52} x2={x - 4} y2={76} />
      <Path d={`M${x - 4} 76 L${x - 18} 92 L${x - 26} 90`} />
      <Path d={`M${x - 4} 76 L${x + 10} 90 L${x + 6} 104`} />
      <Path d={`M${x} 56 L${x - 14} 66`} />
      <Path d={`M${x} 56 L${x + 14} 62 L${x + 20} 52`} />
    </G>
  );
}

function Park() {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#CFE3F0" />
      <Rect x={0} y={100} width={160} height={20} fill="#7FA36B" />
      <Circle cx={136} cy={22} r={10} fill="#FFE066" />
    </G>
  );
}

function Fountain({ silky }: { silky: boolean }) {
  const rnd = seeded(7);
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#3E5C76" />
      <Rect x={0} y={96} width={160} height={24} fill="#2C4A5E" />
      <Rect x={60} y={18} width={40} height={10} rx={3} fill="#8C9AA6" />
      <Rect x={74} y={8} width={12} height={12} fill="#8C9AA6" />
      {silky ? (
        <G>
          <Path d="M66 28 C60 60 58 80 52 98 L108 98 C102 80 100 60 94 28 Z" fill="#FFFFFF" opacity={0.55} />
          <Path d="M72 28 C68 60 68 80 64 98 L96 98 C92 80 92 60 88 28 Z" fill="#FFFFFF" opacity={0.75} />
          <Path d="M30 104 Q80 96 130 104" stroke="#FFFFFF" strokeWidth={6} opacity={0.4} fill="none" />
        </G>
      ) : (
        <G fill="#FFFFFF">
          {Array.from({ length: 34 }, (_, i) => {
            const y = 30 + rnd() * 66;
            const spread = ((y - 28) / 70) * 22;
            return <Circle key={i} cx={80 + (rnd() - 0.5) * 2 * spread} cy={y} r={1.2 + rnd() * 2} opacity={0.9} />;
          })}
          {Array.from({ length: 10 }, (_, i) => (
            <Circle key={`s${i}`} cx={40 + rnd() * 80} cy={96 + rnd() * 8} r={1.5} opacity={0.8} />
          ))}
        </G>
      )}
    </G>
  );
}

function NightStreet({ grain }: { grain: boolean }) {
  const dots = useMemo(() => {
    const rnd = seeded(31);
    return Array.from({ length: 420 }, () => ({ x: rnd() * 160, y: rnd() * 120, c: ['#FFFFFF', '#FF6B6B', '#6BCBFF', '#000000'][Math.floor(rnd() * 4)] }));
  }, []);
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#141B2D" />
      <Circle cx={128} cy={22} r={9} fill="#F2EFD9" />
      {[
        [8, 46, 34, 74],
        [46, 30, 30, 90],
        [80, 52, 40, 68],
      ].map(([x, y, w, h], i) => (
        <G key={i}>
          <Rect x={x} y={y} width={w} height={h} fill="#232C42" />
          {Array.from({ length: 6 }, (_, j) => (
            <Rect key={j} x={x + 5 + (j % 2) * (w / 2)} y={y + 8 + Math.floor(j / 2) * 16} width={6} height={7} fill={j % 3 ? '#FFD27A' : '#3A4560'} />
          ))}
        </G>
      ))}
      <Rect x={136} y={56} width={3} height={64} fill="#5C6670" />
      <Circle cx={137} cy={56} r={6} fill="#FFE8A3" />
      <Circle cx={137} cy={56} r={16} fill="#FFE8A3" opacity={0.15} />
      {grain &&
        dots.map((d, i) => <Rect key={i} x={d.x} y={d.y} width={1.6} height={1.6} fill={d.c} opacity={0.55} />)}
    </G>
  );
}

function Landscape({ overlay }: { overlay?: { color: string; opacity: number } }) {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#9CC5E3" />
      <Circle cx={118} cy={30} r={12} fill="#FFE066" />
      <Path d="M0 82 Q40 56 80 78 T160 70 L160 120 L0 120 Z" fill="#6E9A5B" />
      <Path d="M0 98 Q50 80 100 96 T160 92 L160 120 L0 120 Z" fill="#4F7A43" />
      <Rect x={34} y={70} width={3} height={12} fill="#5C4033" />
      <Circle cx={35.5} cy={66} r={8} fill="#2D6A4F" />
      {overlay && <Rect x={0} y={0} width={160} height={120} fill={overlay.color} opacity={overlay.opacity} />}
    </G>
  );
}

// ——— Niveau Avancé ———

function Snow({ white }: { white: boolean }) {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill={white ? '#A9CDEB' : '#7E8C99'} />
      <Path d="M0 70 Q50 58 90 68 T160 62 L160 120 L0 120 Z" fill={white ? '#F7F9FB' : '#9A9EA3'} />
      <Path d="M0 92 Q60 82 160 94 L160 120 L0 120 Z" fill={white ? '#EAF0F5' : '#8E9297'} />
      <Polygon points="126,30 112,72 140,72" fill={white ? '#2D6A4F' : '#2C3B34'} />
      <Rect x={124} y={72} width={4} height={8} fill="#5C4033" />
      <Circle cx={60} cy={60} r={7} fill={SKIN} />
      <Path d="M50 100 C50 80 70 80 70 100 Z" fill={white ? '#C2593F' : '#7A3D2C'} />
    </G>
  );
}

/** Histogramme stylisé : pic à gauche (sombre), au centre ou à droite (clair) */
function Histogram({ peak }: { peak: 'left' | 'center' | 'right' }) {
  const center = { left: 0.12, center: 0.5, right: 0.88 }[peak];
  const bars = Array.from({ length: 32 }, (_, i) => {
    const x = i / 31;
    let h = Math.exp(-((x - center) ** 2) / 0.02) * 70 + 4;
    if ((peak === 'left' && i === 0) || (peak === 'right' && i === 31)) h = 88; // collé au bord
    return h;
  });
  const color = { left: '#C2593F', center: '#93B3A4', right: '#C2593F' }[peak];
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#161A20" />
      <Rect x={10} y={8} width={140} height={98} fill="#1F242C" />
      {[0.25, 0.5, 0.75].map((f) => (
        <Line key={f} x1={10 + 140 * f} y1={8} x2={10 + 140 * f} y2={106} stroke="#2A3039" strokeWidth={1} />
      ))}
      {bars.map((h, i) => (
        <Rect key={i} x={10 + i * (140 / 32)} y={106 - h} width={140 / 32 - 0.6} height={h} fill={color} />
      ))}
      {/* Échelle des tons sous le graphique : du noir au blanc */}
      <Rect x={10} y={110} width={140} height={5} fill="#000000" />
      <Rect x={115} y={110} width={35} height={5} fill="#FFFFFF" />
      <Rect x={80} y={110} width={35} height={5} fill="#9BA1A8" />
      <Rect x={45} y={110} width={35} height={5} fill="#5C6670" />
    </G>
  );
}

/** Arbre et son ombre, selon la lumière du moment */
function LightScene({ kind }: { kind: 'noon' | 'golden' | 'overcast' }) {
  const p = {
    noon: { sky: '#E4F0F8', ground: '#A9C48F', sun: [80, 12], sunC: '#FFFFFF', shadow: 'M66 92 L94 92 L90 98 L70 98 Z', shadowO: 0.6 },
    golden: { sky: '#F6C77E', ground: '#C49A55', sun: [16, 58], sunC: '#FFB347', shadow: 'M80 94 L160 104 L160 112 L80 98 Z', shadowO: 0.35 },
    overcast: { sky: '#C9CED3', ground: '#8FA58A', sun: [0, 0], sunC: 'none', shadow: '', shadowO: 0 },
  }[kind];
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill={p.sky} />
      {kind === 'overcast' ? (
        <G fill="#DDE1E5">
          <Circle cx={40} cy={26} r={14} />
          <Circle cx={58} cy={22} r={18} />
          <Circle cx={112} cy={30} r={16} />
          <Circle cx={130} cy={26} r={12} />
        </G>
      ) : (
        <Circle cx={p.sun[0]} cy={p.sun[1]} r={kind === 'noon' ? 10 : 12} fill={p.sunC} />
      )}
      <Rect x={0} y={88} width={160} height={32} fill={p.ground} />
      {p.shadow ? <Path d={p.shadow} fill="#000000" opacity={p.shadowO} /> : null}
      <Rect x={77} y={58} width={6} height={36} fill="#5C4033" />
      <Circle cx={80} cy={50} r={20} fill={kind === 'golden' ? '#6E7F2E' : kind === 'noon' ? '#3F7A4A' : '#4F6B55'} />
      {kind === 'noon' && <Circle cx={74} cy={44} r={6} fill="#FFFFFF" opacity={0.35} />}
    </G>
  );
}

function Backlit() {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#F4C97A" />
      <Circle cx={80} cy={56} r={40} fill="#FFE3A3" />
      <Circle cx={80} cy={56} r={22} fill="#FFF6DA" />
      <Rect x={0} y={96} width={160} height={24} fill="#3B2A1E" />
      <G fill="#1B1D1B">
        <Path d="M54 120 C54 96 66 86 80 86 C94 86 106 96 106 120 Z" />
        <Circle cx={80} cy={68} r={17} />
      </G>
      <Circle cx={80} cy={68} r={18} fill="none" stroke="#FFF6DA" strokeWidth={1.5} opacity={0.9} />
    </G>
  );
}

function Sea({ offset }: { offset: boolean }) {
  const horizon = offset ? 80 : 60;
  const boat = offset ? [107, horizon] : [80, horizon];
  return (
    <G>
      <Rect x={0} y={0} width={160} height={horizon} fill="#F2C9A0" />
      <Rect x={0} y={horizon} width={160} height={120 - horizon} fill="#4F7FA6" />
      <Circle cx={offset ? 53 : 80} cy={offset ? 40 : 30} r={9} fill="#FFE8A3" />
      <G>
        <Path d={`M${boat[0] - 12} ${boat[1] - 2} L${boat[0] + 12} ${boat[1] - 2} L${boat[0] + 8} ${boat[1] + 4} L${boat[0] - 8} ${boat[1] + 4} Z`} fill="#1B1D1B" />
        <Polygon points={`${boat[0]},${boat[1] - 26} ${boat[0]},${boat[1] - 4} ${boat[0] + 12},${boat[1] - 4}`} fill="#FBFBF9" />
        <Line x1={boat[0]} y1={boat[1] - 26} x2={boat[0]} y2={boat[1] - 2} stroke="#1B1D1B" strokeWidth={1.5} />
      </G>
      <G stroke="#FFFFFF" strokeWidth={0.8} opacity={0.6}>
        <Line x1={53.3} y1={0} x2={53.3} y2={120} />
        <Line x1={106.7} y1={0} x2={106.7} y2={120} />
        <Line x1={0} y1={40} x2={160} y2={40} />
        <Line x1={0} y1={80} x2={160} y2={80} />
      </G>
    </G>
  );
}

function PortraitLight({ harsh }: { harsh: boolean }) {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill={harsh ? '#FFF4D6' : '#A9B9A8'} />
      {!harsh && <Rect x={0} y={0} width={160} height={120} fill="#3B5249" opacity={0.25} />}
      <Person />
      {harsh && (
        <G fill="#000000" opacity={0.35}>
          <Path d="M66 70 Q74 76 80 72 Q86 76 94 70 L94 74 Q86 80 80 76 Q74 80 66 74 Z" />
          <Path d="M72 82 Q80 88 88 82 L88 86 Q80 92 72 86 Z" />
          <Path d="M63 66 C63 52 97 52 97 66 C90 62 70 62 63 66 Z" />
        </G>
      )}
      {harsh && <Circle cx={80} cy={8} r={8} fill="#FFFFFF" />}
    </G>
  );
}

function Street({ blur }: { blur: boolean }) {
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill="#D8CFC2" />
      <Rect x={0} y={0} width={60} height={100} fill="#B9A792" />
      <Rect x={110} y={10} width={50} height={90} fill="#C9B9A5" />
      {[14, 34].map((x) => (
        <Rect key={x} x={x} y={20} width={12} height={18} fill="#5C6670" />
      ))}
      <Rect x={122} y={28} width={12} height={18} fill="#5C6670" />
      <Rect x={0} y={100} width={160} height={20} fill="#8C8279" />
      {blur ? (
        <G>
          {[-24, -16, -8].map((dx, i) => (
            <Runner key={dx} x={84 + dx} opacity={0.12 + i * 0.1} />
          ))}
          <Runner x={84} opacity={0.5} />
        </G>
      ) : (
        <Runner x={84} />
      )}
    </G>
  );
}

function LandscapeDepth({ depth }: { depth: boolean }) {
  const horizon = depth ? 78 : 60;
  return (
    <G>
      <Rect x={0} y={0} width={160} height={horizon} fill="#A9CDEB" />
      <Path d={`M0 ${horizon} L30 ${horizon - 16} L58 ${horizon - 4} L90 ${horizon - 22} L124 ${horizon - 6} L160 ${horizon - 14} L160 ${horizon} Z`} fill="#7D8C9A" />
      <Rect x={0} y={horizon} width={160} height={120 - horizon} fill="#7FA36B" />
      {depth && (
        <G>
          <Path d="M70 120 Q84 100 82 78" stroke="#D8C9A8" strokeWidth={10} fill="none" />
          <Path d="M0 120 L0 96 Q18 84 40 92 Q52 98 50 120 Z" fill="#7A746C" />
          <Path d="M8 98 Q20 90 34 95" stroke="#9A948B" strokeWidth={3} fill="none" />
          {[
            [112, 108],
            [124, 112],
            [136, 104],
            [146, 112],
          ].map(([x, y]) => (
            <G key={x}>
              <Line x1={x} y1={y} x2={x} y2={y + 10} stroke="#3F7A4A" strokeWidth={1.5} />
              <Circle cx={x} cy={y} r={4} fill="#E5B239" />
            </G>
          ))}
        </G>
      )}
    </G>
  );
}

function NightShot({ tripod }: { tripod: boolean }) {
  if (!tripod)
    return (
      <G>
        <NightStreet grain={false} />
        <G opacity={0.5} transform="translate(5 3)">
          <NightStreet grain={false} />
        </G>
      </G>
    );
  return (
    <G>
      <NightStreet grain={false} />
      <G stroke="#FFF3C4" strokeWidth={1.2} opacity={0.9}>
        <Line x1={137} y1={40} x2={137} y2={72} />
        <Line x1={121} y1={56} x2={153} y2={56} />
        <Line x1={126} y1={45} x2={148} y2={67} />
        <Line x1={148} y1={45} x2={126} y2={67} />
      </G>
    </G>
  );
}

// ——— Parcours Modèle : la lumière sur un visage ———

type FaceLight = 'front' | 'side' | 'top' | 'back' | 'below' | 'soft';

/** Visage en gros plan, éclairé selon `light` : la lumière modèle les volumes. */
function LitFace({ light }: { light: FaceLight }) {
  const FACE = 'M80 24 C102 24 110 44 110 62 C110 84 96 100 80 100 C64 100 50 84 50 62 C50 44 58 24 80 24 Z';
  const bg = light === 'back' ? '#F6E2B0' : light === 'soft' ? '#7D8A86' : '#2E333B';
  return (
    <G>
      <Rect x={0} y={0} width={160} height={120} fill={bg} />
      {light === 'back' && <Circle cx={80} cy={56} r={54} fill="#FFF6DA" />}
      {/* Cou et épaules */}
      <Rect x={70} y={92} width={20} height={20} fill={SKIN} />
      <Path d="M36 120 C40 104 60 100 80 100 C100 100 120 104 124 120 Z" fill="#3B5249" />
      <Path d={FACE} fill={SKIN} />
      <Path d="M50 58 C48 30 112 30 110 58 C104 40 92 34 80 34 C66 34 56 40 50 58 Z" fill="#3A2A1E" />
      {/* Traits */}
      <Ellipse cx={69} cy={62} rx={4} ry={2.6} fill={INK} />
      <Ellipse cx={91} cy={62} rx={4} ry={2.6} fill={INK} />
      <Path d="M80 64 L77 76 L82 77" stroke="#9A6A4A" strokeWidth={1.6} fill="none" strokeLinecap="round" />
      <Path d="M72 85 Q80 89 88 85" stroke="#8C4A3A" strokeWidth={2} fill="none" strokeLinecap="round" />

      {light === 'front' && <Path d="M66 98 Q80 104 94 98 L94 104 L66 104 Z" fill="#000000" opacity={0.2} />}
      {light === 'side' && (
        <G>
          <Path d="M80 24 C64 24 50 44 50 62 C50 84 64 100 80 100 Z" fill="#000000" opacity={0.6} />
          <Rect x={70} y={92} width={10} height={20} fill="#000000" opacity={0.6} />
        </G>
      )}
      {light === 'top' && (
        <G fill="#000000">
          <Ellipse cx={69} cy={61} rx={9} ry={6} opacity={0.45} />
          <Ellipse cx={91} cy={61} rx={9} ry={6} opacity={0.45} />
          <Path d="M76 76 L84 76 L82 82 L78 82 Z" opacity={0.45} />
          <Path d="M70 90 Q80 96 90 90 L90 94 Q80 100 70 94 Z" opacity={0.35} />
          <Rect x={70} y={98} width={20} height={14} opacity={0.5} />
          <Ellipse cx={80} cy={40} rx={18} ry={6} fill="#FFFFFF" opacity={0.35} />
        </G>
      )}
      {light === 'back' && (
        <G>
          <Path d={FACE} fill="#000000" opacity={0.5} />
          <Path d={FACE} fill="none" stroke="#FFF6DA" strokeWidth={3} />
        </G>
      )}
      {light === 'below' && (
        <G fill="#000000">
          <Path d="M52 56 C52 34 108 34 108 56 L108 60 L52 60 Z" opacity={0.5} />
          <Ellipse cx={69} cy={56} rx={8} ry={4} opacity={0.45} />
          <Ellipse cx={91} cy={56} rx={8} ry={4} opacity={0.45} />
          <Path d="M77 62 L83 62 L82 56 L78 56 Z" opacity={0.45} />
          <Ellipse cx={80} cy={96} rx={16} ry={5} fill="#FFFFFF" opacity={0.35} />
        </G>
      )}
      {light === 'soft' && <Path d="M80 24 C64 24 50 44 50 62 C50 84 64 100 80 100 Z" fill="#000000" opacity={0.12} />}
    </G>
  );
}

// ——— Scène ———

function SceneBase({ id, width }: { id: SceneId; width: number }) {
  const content = (() => {
    switch (id) {
      case 'portrait-bokeh':
        return (
          <G>
            <BlurredBackground />
            <Person />
          </G>
        );
      case 'portrait-sharp':
        return (
          <G>
            <SharpBackground />
            <Person />
          </G>
        );
      case 'runner-frozen':
        return (
          <G>
            <Park />
            <Runner x={80} />
          </G>
        );
      case 'runner-blur':
        return (
          <G>
            <Park />
            {[-30, -20, -10].map((dx, i) => (
              <Runner key={dx} x={80 + dx} opacity={0.12 + i * 0.1} />
            ))}
            <Runner x={80} opacity={0.55} />
            <G stroke="#FFFFFF" strokeWidth={2} opacity={0.8}>
              <Line x1={20} y1={50} x2={46} y2={50} />
              <Line x1={14} y1={66} x2={40} y2={66} />
              <Line x1={22} y1={82} x2={44} y2={82} />
            </G>
          </G>
        );
      case 'water-frozen':
        return <Fountain silky={false} />;
      case 'water-silky':
        return <Fountain silky />;
      case 'night-clean':
        return <NightStreet grain={false} />;
      case 'night-grainy':
        return <NightStreet grain />;
      case 'exposure-dark':
        return <Landscape overlay={{ color: '#000000', opacity: 0.62 }} />;
      case 'exposure-bright':
        return <Landscape overlay={{ color: '#FFFFFF', opacity: 0.66 }} />;
      case 'snow-grey':
        return <Snow white={false} />;
      case 'snow-white':
        return <Snow white />;
      case 'histogram-left':
        return <Histogram peak="left" />;
      case 'histogram-center':
        return <Histogram peak="center" />;
      case 'histogram-right':
        return <Histogram peak="right" />;
      case 'light-noon':
        return <LightScene kind="noon" />;
      case 'light-golden':
        return <LightScene kind="golden" />;
      case 'light-overcast':
        return <LightScene kind="overcast" />;
      case 'light-backlit':
        return <Backlit />;
      case 'thirds-centered':
        return <Sea offset={false} />;
      case 'thirds-offset':
        return <Sea offset />;
      case 'portrait-harsh':
        return <PortraitLight harsh />;
      case 'portrait-soft':
        return <PortraitLight harsh={false} />;
      case 'street-frozen':
        return <Street blur={false} />;
      case 'street-blur':
        return <Street blur />;
      case 'landscape-flat':
        return <LandscapeDepth depth={false} />;
      case 'landscape-depth':
        return <LandscapeDepth depth />;
      case 'night-handheld':
        return <NightShot tripod={false} />;
      case 'night-tripod':
        return <NightShot tripod />;
      case 'face-front':
        return <LitFace light="front" />;
      case 'face-side':
        return <LitFace light="side" />;
      case 'face-top':
        return <LitFace light="top" />;
      case 'face-back':
        return <LitFace light="back" />;
      case 'face-below':
        return <LitFace light="below" />;
      case 'face-soft':
        return <LitFace light="soft" />;
      default:
        return <Landscape />;
    }
  })();

  return (
    <Svg width={width} height={(width * 120) / 160} viewBox="0 0 160 120" accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {content}
    </Svg>
  );
}

export const Scene = memo(SceneBase);
