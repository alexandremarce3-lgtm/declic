import { memo, useId, type ReactNode } from 'react';
import Svg, { Circle, ClipPath, Defs, Ellipse, G, Line, Path, Rect } from 'react-native-svg';
import { DEFAULT_LOOK, itemById, type Look } from '@/lib/avatar';

/**
 * Avatar compagnon, dessiné en SVG par calques :
 * tenue → cheveux arrière → cou et tête → visage → barbe → cheveux avant → accessoires.
 * Repère : viewBox 200 × 220, tête centrée en (100, 96), rayon 42.
 * Les couleurs des pièces viennent de `lib/avatar.ts`.
 */

const INK = '#1B1D1B';
const LIP = '#5A2A22';
const col = (id: string | null, i = 0, fallback = '#888') => itemById(id)?.colors[i] ?? fallback;

/** Demi-largeur d'épaules selon la silhouette */
const SHOULDER: Record<string, number> = { 'body-m': 70, 'body-n': 64, 'body-f': 55 };
const NECK: Record<string, number> = { 'body-m': 24, 'body-n': 22, 'body-f': 18 };

// ——— Tenue (découpée à la forme du buste) ———

function Outfit({ id, sw, clip }: { id: string | null; sw: number; clip: string }) {
  const l = 100 - sw;
  const r = 100 + sw;
  const d = `M${l} 222 C${l} 174 ${l + 30} 152 100 152 C${r - 30} 152 ${r} 174 ${r} 222 Z`;
  const clipped = (children: ReactNode) => <G clipPath={`url(#${clip})`}>{children}</G>;
  const defs = (
    <Defs>
      <ClipPath id={clip}>
        <Path d={d} />
      </ClipPath>
    </Defs>
  );
  switch (id) {
    case 'outfit-vest':
      return (
        <G>
          {defs}
          <Path d={d} fill="#E9E4D8" />
          {clipped(
            <G>
              <Rect x={0} y={140} width={93} height={90} fill={col(id, 0)} />
              <Rect x={107} y={140} width={93} height={90} fill={col(id, 0)} />
              <Rect x={l + 16} y={186} width={20} height={15} rx={2} fill={col(id, 1)} />
              <Rect x={r - 36} y={186} width={20} height={15} rx={2} fill={col(id, 1)} />
            </G>,
          )}
        </G>
      );
    case 'outfit-trench':
      return (
        <G>
          {defs}
          <Path d={d} fill={col(id, 0)} />
          {clipped(
            <G>
              <Path d="M86 150 L100 190 L70 166 Z" fill={col(id, 1)} />
              <Path d="M114 150 L100 190 L130 166 Z" fill={col(id, 1)} />
              <Rect x={0} y={202} width={200} height={7} fill={col(id, 1)} />
              <Circle cx={92} cy={196} r={2.5} fill={INK} />
              <Circle cx={108} cy={196} r={2.5} fill={INK} />
            </G>,
          )}
        </G>
      );
    case 'outfit-hunter':
      return (
        <G>
          {defs}
          <Path d={d} fill={col(id, 0)} />
          {clipped(
            <G stroke={col(id, 1)} strokeWidth={2} fill="none">
              <Line x1={100} y1={160} x2={100} y2={222} />
              <Path d={`M${l + 10} 222 C${l + 12} 192 ${l + 26} 172 82 164`} />
              <Path d={`M${r - 10} 222 C${r - 12} 192 ${r - 26} 172 118 164`} />
            </G>,
          )}
          <Path d="M78 148 L100 162 L122 148 L124 134 L100 146 L76 134 Z" fill={col(id, 0)} stroke={col(id, 1)} strokeWidth={2} />
        </G>
      );
    default:
      return (
        <G>
          <Path d={d} fill={col(id, 0, '#5C6670')} />
          <Path d="M87 153 Q100 172 113 153" fill="none" stroke="#00000033" strokeWidth={3} />
        </G>
      );
  }
}

// ——— Cheveux ———

const CAP = 'M57 94 C55 56 80 44 100 44 C126 44 145 58 143 92 C134 76 118 69 100 71 C82 71 66 79 57 94 Z';
const FRINGE = 'M56 96 C56 54 82 46 100 46 C122 46 144 56 144 96 C130 80 112 74 100 74 C86 74 68 82 56 96 Z';

function HairBack({ id, color }: { id: string | null; color: string }) {
  switch (id) {
    case 'hair-bob':
      return <Path d="M54 96 C54 50 146 50 146 96 L146 132 C140 137 130 137 126 132 L126 92 L74 92 L74 132 C70 137 60 137 54 132 Z" fill={color} />;
    case 'hair-long':
      return <Path d="M54 96 C54 48 146 48 146 96 L152 172 C142 180 128 180 122 170 L122 96 L78 96 L78 170 C72 180 58 180 48 172 Z" fill={color} />;
    case 'hair-ponytail':
      return <Path d="M130 66 C164 74 166 132 148 156 C152 124 146 98 126 84 Z" fill={color} />;
    case 'hair-curly':
      return (
        <G fill={color}>
          <Circle cx={58} cy={104} r={11} />
          <Circle cx={142} cy={104} r={11} />
        </G>
      );
    default:
      return null;
  }
}

function HairFront({ id, color }: { id: string | null; color: string }) {
  switch (id) {
    case 'hair-bald':
    case null:
      return null;
    case 'hair-buzz':
      return <Path d="M59 90 C59 58 80 52 100 52 C122 52 141 60 141 90 C131 77 116 72 100 72 C84 72 69 77 59 90 Z" fill={color} opacity={0.75} />;
    case 'hair-bob':
    case 'hair-long':
      return <Path d={FRINGE} fill={color} />;
    case 'hair-curly':
      return (
        <G fill={color}>
          {[
            [62, 84, 13],
            [72, 66, 15],
            [90, 55, 16],
            [110, 55, 16],
            [128, 66, 15],
            [138, 84, 13],
            [100, 64, 14],
          ].map(([x, y, r], i) => (
            <Circle key={i} cx={x} cy={y} r={r} />
          ))}
        </G>
      );
    case 'hair-bun':
      return (
        <G fill={color}>
          <Circle cx={100} cy={42} r={14} />
          <Path d={CAP} />
        </G>
      );
    default:
      return <Path d={CAP} fill={color} />; // court, queue-de-cheval
  }
}

// ——— Visage ———

function Eyes({ id }: { id: string | null }) {
  const both = (draw: (x: number, flip: 1 | -1) => ReactNode) => (
    <G>
      {draw(84, 1)}
      {draw(116, -1)}
    </G>
  );
  switch (id) {
    case 'eyes-round':
      return both((x) => (
        <G key={x}>
          <Circle cx={x} cy={100} r={6.5} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
          <Circle cx={x} cy={101} r={3.4} fill={INK} />
          <Circle cx={x + 1.2} cy={99.6} r={1} fill="#FFFFFF" />
        </G>
      ));
    case 'eyes-lashes':
      return both((x, f) => (
        <G key={x}>
          <Circle cx={x} cy={100} r={4} fill={INK} />
          <Path d={`M${x - 3 * f} 97 L${x - 6 * f} 93 M${x - 0.5 * f} 96 L${x - 1.5 * f} 91.5`} stroke={INK} strokeWidth={1.6} strokeLinecap="round" />
        </G>
      ));
    case 'eyes-smile':
      return both((x) => <Path key={x} d={`M${x - 6} 102 Q${x} 95 ${x + 6} 102`} stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />);
    case 'eyes-sleepy':
      return both((x) => (
        <G key={x}>
          <Path d={`M${x - 6} 99 L${x + 6} 99`} stroke={INK} strokeWidth={2} strokeLinecap="round" />
          <Path d={`M${x - 5} 99 A5 4 0 0 0 ${x + 5} 99 Z`} fill={INK} />
        </G>
      ));
    case 'eyes-wink':
      return (
        <G>
          <Circle cx={84} cy={100} r={4} fill={INK} />
          <Path d="M110 101 Q116 96 122 101" stroke={INK} strokeWidth={2.6} fill="none" strokeLinecap="round" />
        </G>
      );
    default:
      return both((x) => <Circle key={x} cx={x} cy={100} r={4} fill={INK} />);
  }
}

function Brows({ id, color }: { id: string | null; color: string }) {
  const p = { stroke: color, fill: 'none', strokeLinecap: 'round' as const };
  switch (id) {
    case 'brows-thin':
      return (
        <G>
          <Path d="M77 89 Q84 85 91 88" strokeWidth={2} {...p} />
          <Path d="M109 88 Q116 85 123 89" strokeWidth={2} {...p} />
        </G>
      );
    case 'brows-thick':
      return (
        <G>
          <Path d="M77 89 L91 87" strokeWidth={4.5} {...p} />
          <Path d="M109 87 L123 89" strokeWidth={4.5} {...p} />
        </G>
      );
    case 'brows-arched':
      return (
        <G>
          <Path d="M76 90 Q83 81 92 88" strokeWidth={2.6} {...p} />
          <Path d="M108 88 Q117 81 124 90" strokeWidth={2.6} {...p} />
        </G>
      );
    default:
      return null;
  }
}

function Mouth({ id }: { id: string | null }) {
  switch (id) {
    case 'mouth-grin':
      return (
        <G>
          <Path d="M88 113 Q100 129 112 113 Z" fill={LIP} />
          <Path d="M90 114 L110 114 Q100 118 90 114 Z" fill="#FFFFFF" />
        </G>
      );
    case 'mouth-neutral':
      return <Path d="M92 117 L108 117" stroke={INK} strokeWidth={2.5} strokeLinecap="round" />;
    case 'mouth-smirk':
      return <Path d="M91 117 Q102 121 110 112" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />;
    case 'mouth-o':
      return <Ellipse cx={100} cy={118} rx={4} ry={5} fill={LIP} />;
    default:
      return <Path d="M90 115 Q100 123 110 115" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />;
  }
}

function Beard({ id, color }: { id: string | null; color: string }) {
  const jaw = 'M60 102 C60 152 140 152 140 102 C136 128 120 142 100 142 C80 142 64 128 60 102 Z';
  switch (id) {
    case 'beard-stubble':
      return <Path d={jaw} fill={color} opacity={0.22} />;
    case 'beard-full':
      return (
        <G>
          <Path d={jaw} fill={color} />
          <Path d="M86 110 Q100 104 114 110 Q114 126 100 128 Q86 126 86 110 Z" fill={color} />
        </G>
      );
    case 'beard-goatee':
      return (
        <G fill={color}>
          <Path d="M88 110 Q100 105 112 110 Q106 113 100 111 Q94 113 88 110 Z" />
          <Path d="M93 122 Q100 128 107 122 L105 132 Q100 140 95 132 Z" />
        </G>
      );
    case 'beard-mustache':
      return <Path d="M86 111 Q100 103 114 111 Q107 115 100 112 Q93 115 86 111 Z" fill={color} />;
    default:
      return null;
  }
}

function Cheeks({ id }: { id: string | null }) {
  if (id === 'cheeks-blush')
    return (
      <G fill={col(id)} opacity={0.35}>
        <Circle cx={75} cy={112} r={5.5} />
        <Circle cx={125} cy={112} r={5.5} />
      </G>
    );
  if (id === 'cheeks-freckles')
    return (
      <G fill={col(id)} opacity={0.7}>
        {[
          [72, 108],
          [77, 112],
          [71, 114],
          [79, 107],
          [128, 108],
          [123, 112],
          [129, 114],
          [121, 107],
        ].map(([x, y], i) => (
          <Circle key={i} cx={x} cy={y} r={1.2} />
        ))}
      </G>
    );
  return null;
}

// ——— Accessoires ———

function Neck({ id }: { id: string | null }) {
  if (!id) return null;
  if (id === 'neck-scarf')
    return (
      <G>
        <Path d="M78 146 Q100 166 122 146 L124 158 Q100 178 76 158 Z" fill={col(id)} />
        <Path d="M108 164 L118 200 L106 202 L100 168 Z" fill={col(id)} />
      </G>
    );
  const strap = (
    <G stroke={INK} strokeWidth={2} fill="none">
      <Path d="M82 150 L88 180" />
      <Path d="M118 150 L112 180" />
    </G>
  );
  if (id === 'neck-reflex')
    return (
      <G>
        {strap}
        <Path d="M90 176 L94 168 L106 168 L110 176 Z" fill={col(id, 0)} />
        <Rect x={74} y={176} width={52} height={32} rx={5} fill={col(id, 0)} />
        <Circle cx={100} cy={193} r={12} fill={col(id, 1)} />
        <Circle cx={100} cy={193} r={6} fill={INK} />
        <Rect x={78} y={179} width={8} height={4} rx={1} fill="#C2593F" />
      </G>
    );
  if (id === 'neck-medium')
    return (
      <G>
        {strap}
        <Rect x={82} y={170} width={36} height={44} rx={3} fill={col(id, 0)} />
        <Circle cx={100} cy={182} r={6} fill={INK} stroke={col(id, 1)} strokeWidth={2} />
        <Circle cx={100} cy={201} r={8} fill={INK} stroke={col(id, 1)} strokeWidth={2} />
      </G>
    );
  return (
    <G>
      {strap}
      <Rect x={80} y={178} width={40} height={26} rx={4} fill={col(id, 0)} />
      <Circle cx={100} cy={191} r={8} fill={col(id, 1)} />
      <Circle cx={100} cy={191} r={4} fill={INK} />
    </G>
  );
}

function Glasses({ id }: { id: string | null }) {
  if (id === 'face-round')
    return (
      <G stroke={col(id)} strokeWidth={2.5} fill="none">
        <Circle cx={84} cy={99} r={11} />
        <Circle cx={116} cy={99} r={11} />
        <Line x1={95} y1={98} x2={105} y2={98} />
      </G>
    );
  if (id === 'face-shades')
    return (
      <G>
        <Rect x={70} y={91} width={27} height={15} rx={6} fill={col(id)} />
        <Rect x={103} y={91} width={27} height={15} rx={6} fill={col(id)} />
        <Line x1={97} y1={96} x2={103} y2={96} stroke={col(id)} strokeWidth={3} />
        <Line x1={74} y1={95} x2={82} y2={95} stroke="#FFFFFF55" strokeWidth={2} />
      </G>
    );
  if (id === 'face-loupe')
    return (
      <G fill="none">
        <Circle cx={116} cy={99} r={12} stroke={col(id)} strokeWidth={3} />
        <Path d="M127 104 Q140 130 128 150" stroke={col(id)} strokeWidth={1.5} />
      </G>
    );
  return null;
}

function Hat({ id }: { id: string | null }) {
  switch (id) {
    case 'head-beret':
      return (
        <G>
          <Ellipse cx={94} cy={56} rx={48} ry={17} fill={col(id)} transform="rotate(-8 94 56)" />
          <Rect x={96} y={34} width={4} height={8} rx={2} fill={col(id)} />
        </G>
      );
    case 'head-cap':
      return (
        <G>
          <Path d="M56 74 C56 40 144 40 144 74 Z" fill={col(id)} />
          <Path d="M100 72 L160 76 Q160 84 100 80 Z" fill={col(id)} />
        </G>
      );
    case 'head-bucket':
      return (
        <G>
          <Path d="M66 70 L74 38 L126 38 L134 70 Z" fill={col(id)} />
          <Ellipse cx={100} cy={70} rx={52} ry={9} fill={col(id)} />
        </G>
      );
    case 'head-headphones':
      return (
        <G>
          <Path d="M56 96 C56 40 144 40 144 96" stroke={col(id, 0)} strokeWidth={7} fill="none" />
          <Rect x={46} y={86} width={16} height={28} rx={7} fill={col(id, 1)} />
          <Rect x={138} y={86} width={16} height={28} rx={7} fill={col(id, 1)} />
        </G>
      );
    default:
      return null;
  }
}

type Props = {
  look: Partial<Look>;
  /** Largeur en points (la hauteur suit le cadrage) */
  size?: number;
  /** Gros plan sur le visage (aperçus du vestiaire) */
  crop?: boolean;
};

function AvatarBase({ look: partial, size = 120, crop }: Props) {
  const look = { ...DEFAULT_LOOK, ...partial };
  const clip = `torso${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const body = look.body ?? 'body-n';
  const sw = SHOULDER[body] ?? 64;
  const nw = NECK[body] ?? 22;
  const skin = col(look.skin, 0, '#D9A57E');
  const hair = col(look.hairColor, 0, '#3A2A1E');
  const [vx, vy, vw, vh] = crop ? [46, 28, 108, 120] : [0, 0, 200, 220];

  return (
    <Svg
      width={size}
      height={(size * vh) / vw}
      viewBox={`${vx} ${vy} ${vw} ${vh}`}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Outfit id={look.outfit} sw={sw} clip={clip} />
      <HairBack id={look.hair} color={hair} />
      <Rect x={100 - nw / 2} y={126} width={nw} height={30} rx={8} fill={skin} />
      <Circle cx={58} cy={100} r={8} fill={skin} />
      <Circle cx={142} cy={100} r={8} fill={skin} />
      <Circle cx={100} cy={96} r={42} fill={skin} />
      <Cheeks id={look.cheeks} />
      <Beard id={look.beard} color={hair} />
      <Eyes id={look.eyes} />
      <Brows id={look.brows} color={hair} />
      <Mouth id={look.mouth} />
      <HairFront id={look.hair} color={hair} />
      <Neck id={look.neck} />
      <Glasses id={look.face} />
      <Hat id={look.head} />
    </Svg>
  );
}

export const Avatar = memo(AvatarBase);
