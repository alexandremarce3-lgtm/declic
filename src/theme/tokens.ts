/**
 * Design tokens — identité éditoriale « argentique ».
 *   Sombre : « Chambre Noire »  · Clair : « Papier Studio »
 *   Olive  : structure (boutons, pastilles, progression)
 *   Ambre  : accents (valeurs, mises en avant, XP)
 *   Brique : SOS photo
 *
 * Chaque couleur de marque existe en deux usages :
 *   - `xxx`     : couleur de REMPLISSAGE (fond de bouton, pastille), avec `onXxx` pour le texte posé dessus ;
 *   - `xxxInk`  : variante lisible en TEXTE sur le fond de l'écran (contraste ≥ 4,5:1).
 * Toute couleur de l'app passe par ici : jamais de couleur en dur dans un écran.
 */

export type Palette = {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  onPrimary: string;
  primaryInk: string;
  accent: string;
  onAccent: string;
  accentInk: string;
  danger: string;
  onDanger: string;
  dangerInk: string;
  /** Validation (défi fait, bonne exposition) */
  success: string;
};

const BRAND = { olive: '#3B5249', amber: '#E5B239', brick: '#C2593F' } as const;

export const palettes: Record<'light' | 'dark', Palette> = {
  // « Papier Studio »
  light: {
    bg: '#F4F4F2',
    surface: '#FBFBF9',
    surfaceAlt: '#EAEAE5',
    border: '#DCDCD5',
    text: '#1B1D1B',
    textMuted: '#5D615D',
    primary: BRAND.olive,
    onPrimary: '#F4F4F2',
    primaryInk: BRAND.olive,
    accent: BRAND.amber,
    onAccent: '#1B1D1B',
    accentInk: '#86620F', // ambre assombri : lisible sur papier
    danger: BRAND.brick,
    onDanger: '#FFFFFF',
    dangerInk: '#A6432B',
    success: BRAND.olive,
  },
  // « Chambre Noire »
  dark: {
    bg: '#0A0C10',
    surface: '#161A20', // gris ardoise mat
    surfaceAlt: '#1F242C',
    border: '#2A3039',
    text: '#ECEAE4',
    textMuted: '#9BA1A8',
    primary: BRAND.olive,
    onPrimary: '#ECEAE4',
    primaryInk: '#93B3A4', // olive éclairci : lisible sur fond noir
    accent: BRAND.amber,
    onAccent: '#0A0C10',
    accentInk: BRAND.amber,
    danger: BRAND.brick,
    onDanger: '#FFFFFF',
    dangerInk: '#E07A60',
    success: '#93B3A4',
  },
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 6, md: 10, lg: 16, pill: 999 } as const;

/** Polices chargées dans `app/_layout.tsx` (expo-google-fonts) */
export const fonts = {
  serif: 'PlayfairDisplay_700Bold',
  serifSemi: 'PlayfairDisplay_600SemiBold',
  serifItalic: 'PlayfairDisplay_700Bold_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemi: 'Inter_600SemiBold',
} as const;

/**
 * Titres en serif (esprit magazine photo), textes techniques en sans-serif.
 * Pas de `fontWeight` : chaque graisse est une police à part entière (sinon Android simule le gras).
 */
export const type = {
  display: { fontFamily: fonts.serif, fontSize: 38, lineHeight: 44, letterSpacing: -0.5 },
  title: { fontFamily: fonts.serif, fontSize: 25, lineHeight: 31, letterSpacing: -0.2 },
  heading: { fontFamily: fonts.serifSemi, fontSize: 18, lineHeight: 24 },
  body: { fontFamily: fonts.sans, fontSize: 16, lineHeight: 25 },
  caption: { fontFamily: fonts.sansMedium, fontSize: 13, lineHeight: 18, letterSpacing: 0.3 },
  /** Petites capitales d'en-tête (« CHAPITRE 2 ») */
  overline: { fontFamily: fonts.sansSemi, fontSize: 11, lineHeight: 14, letterSpacing: 1.6 },
  mono: { fontFamily: fonts.sansSemi, fontSize: 15, lineHeight: 20, fontVariant: ['tabular-nums'] },
} as const;

/** Zone tactile minimale (Apple HIG / Material) */
export const HIT = 48;
