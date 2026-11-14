/**
 * Catalogue de l'avatar compagnon : des pièces modulaires, chacune dans un emplacement.
 * Les noms affichés sont dans les dictionnaires i18n (`t.avatar.items[id]`).
 *
 * Deux familles d'emplacements :
 *  - le PERSONNAGE (silhouette, teint, visage, cheveux) : tout est libre, c'est l'identité ;
 *  - le STYLE (tenue, chapeau, lunettes, appareil) : se débloque en progressant.
 *
 * Pourquoi « débloquer » et non « acheter » : dépenser de l'XP ferait redescendre de rang.
 * Les pièces se gagnent donc par paliers (rang, défis, fiches, SOS, succès) et restent acquises.
 */

import type { RankId } from './ranks';

export type Slot =
  | 'body'
  | 'skin'
  | 'hair'
  | 'hairColor'
  | 'eyes'
  | 'brows'
  | 'mouth'
  | 'beard'
  | 'cheeks'
  | 'outfit'
  | 'head'
  | 'face'
  | 'neck';

/** Onglets du vestiaire, regroupés */
export const SLOT_GROUPS: { id: 'character' | 'face' | 'style'; slots: Slot[] }[] = [
  { id: 'character', slots: ['body', 'skin', 'hair', 'hairColor'] },
  { id: 'face', slots: ['eyes', 'brows', 'mouth', 'beard', 'cheeks'] },
  { id: 'style', slots: ['outfit', 'head', 'face', 'neck'] },
];

export const SLOTS: Slot[] = SLOT_GROUPS.flatMap((g) => g.slots);

/** Emplacements qu'on peut laisser vides */
export const OPTIONAL_SLOTS: Slot[] = ['brows', 'beard', 'cheeks', 'head', 'face', 'neck'];

/** Emplacements dont l'aperçu est un gros plan sur le visage */
export const FACE_SLOTS: Slot[] = ['skin', 'hair', 'hairColor', 'eyes', 'brows', 'mouth', 'beard', 'cheeks', 'face', 'head'];

export type Unlock =
  | { kind: 'free' }
  | { kind: 'rank'; rank: RankId }
  | { kind: 'challenges'; count: number }
  | { kind: 'sheets'; count: number }
  | { kind: 'sos'; count: number }
  | { kind: 'photos'; count: number }
  | { kind: 'achievement'; id: string };

export type AvatarItem = {
  id: string;
  slot: Slot;
  unlock: Unlock;
  /** Couleurs de la pièce (le dessin est dans `components/avatar/Avatar.tsx`) */
  colors: string[];
};

const free = { kind: 'free' } as const;

export const AVATAR_ITEMS: AvatarItem[] = [
  // Silhouette
  { id: 'body-n', slot: 'body', unlock: free, colors: [] },
  { id: 'body-f', slot: 'body', unlock: free, colors: [] },
  { id: 'body-m', slot: 'body', unlock: free, colors: [] },

  // Teint
  { id: 'skin-1', slot: 'skin', unlock: free, colors: ['#F2D3B8'] },
  { id: 'skin-2', slot: 'skin', unlock: free, colors: ['#D9A57E'] },
  { id: 'skin-3', slot: 'skin', unlock: free, colors: ['#A86F4C'] },
  { id: 'skin-4', slot: 'skin', unlock: free, colors: ['#6E4630'] },
  { id: 'skin-5', slot: 'skin', unlock: free, colors: ['#4A2E22'] },

  // Coiffures (la couleur vient de `hairColor`)
  { id: 'hair-short', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-buzz', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-bob', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-long', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-curly', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-bun', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-ponytail', slot: 'hair', unlock: free, colors: [] },
  { id: 'hair-bald', slot: 'hair', unlock: free, colors: [] },

  // Couleurs de cheveux (et de barbe)
  { id: 'haircolor-black', slot: 'hairColor', unlock: free, colors: ['#1E1B1A'] },
  { id: 'haircolor-brown', slot: 'hairColor', unlock: free, colors: ['#3A2A1E'] },
  { id: 'haircolor-chestnut', slot: 'hairColor', unlock: free, colors: ['#6B4A2F'] },
  { id: 'haircolor-red', slot: 'hairColor', unlock: free, colors: ['#A9542D'] },
  { id: 'haircolor-blond', slot: 'hairColor', unlock: free, colors: ['#D4B06A'] },
  { id: 'hair-silver', slot: 'hairColor', unlock: { kind: 'rank', rank: 'A' }, colors: ['#C9CCD1'] },
  { id: 'haircolor-blue', slot: 'hairColor', unlock: { kind: 'achievement', id: 'heure-bleue' }, colors: ['#3E5C8F'] },

  // Yeux
  { id: 'eyes-dot', slot: 'eyes', unlock: free, colors: [] },
  { id: 'eyes-round', slot: 'eyes', unlock: free, colors: [] },
  { id: 'eyes-lashes', slot: 'eyes', unlock: free, colors: [] },
  { id: 'eyes-smile', slot: 'eyes', unlock: free, colors: [] },
  { id: 'eyes-sleepy', slot: 'eyes', unlock: free, colors: [] },
  { id: 'eyes-wink', slot: 'eyes', unlock: { kind: 'achievement', id: 'curieux' }, colors: [] },

  // Sourcils
  { id: 'brows-thin', slot: 'brows', unlock: free, colors: [] },
  { id: 'brows-thick', slot: 'brows', unlock: free, colors: [] },
  { id: 'brows-arched', slot: 'brows', unlock: free, colors: [] },

  // Bouche
  { id: 'mouth-smile', slot: 'mouth', unlock: free, colors: [] },
  { id: 'mouth-grin', slot: 'mouth', unlock: free, colors: [] },
  { id: 'mouth-neutral', slot: 'mouth', unlock: free, colors: [] },
  { id: 'mouth-smirk', slot: 'mouth', unlock: free, colors: [] },
  { id: 'mouth-o', slot: 'mouth', unlock: free, colors: [] },

  // Barbe (couleur des cheveux)
  { id: 'beard-stubble', slot: 'beard', unlock: free, colors: [] },
  { id: 'beard-mustache', slot: 'beard', unlock: free, colors: [] },
  { id: 'beard-goatee', slot: 'beard', unlock: free, colors: [] },
  { id: 'beard-full', slot: 'beard', unlock: free, colors: [] },

  // Joues
  { id: 'cheeks-blush', slot: 'cheeks', unlock: free, colors: ['#E8907A'] },
  { id: 'cheeks-freckles', slot: 'cheeks', unlock: free, colors: ['#8C5A3C'] },

  // Tenues
  { id: 'outfit-tee', slot: 'outfit', unlock: free, colors: ['#5C6670'] },
  { id: 'outfit-vest', slot: 'outfit', unlock: { kind: 'rank', rank: 'B' }, colors: ['#3B5249', '#2C3E37'] },
  { id: 'outfit-trench', slot: 'outfit', unlock: { kind: 'challenges', count: 4 }, colors: ['#B08D57', '#8C6E41'] },
  { id: 'outfit-hunter', slot: 'outfit', unlock: { kind: 'rank', rank: 'S' }, colors: ['#14171C', '#E5B239'] },

  // Couvre-chefs
  { id: 'head-beret', slot: 'head', unlock: { kind: 'challenges', count: 1 }, colors: ['#C2593F'] },
  { id: 'head-cap', slot: 'head', unlock: { kind: 'sheets', count: 3 }, colors: ['#3B5249'] },
  { id: 'head-bucket', slot: 'head', unlock: { kind: 'sos', count: 3 }, colors: ['#E5B239'] },
  { id: 'head-headphones', slot: 'head', unlock: { kind: 'achievement', id: 'noctambule' }, colors: ['#2A3039', '#C2593F'] },

  // Lunettes
  { id: 'face-round', slot: 'face', unlock: { kind: 'sheets', count: 5 }, colors: ['#1B1D1B'] },
  { id: 'face-shades', slot: 'face', unlock: { kind: 'achievement', id: 'curieux' }, colors: ['#1B1D1B'] },
  { id: 'face-loupe', slot: 'face', unlock: { kind: 'rank', rank: 'A' }, colors: ['#E5B239'] },

  // Autour du cou
  { id: 'neck-compact', slot: 'neck', unlock: free, colors: ['#2A3039', '#9BA1A8'] },
  { id: 'neck-reflex', slot: 'neck', unlock: { kind: 'photos', count: 3 }, colors: ['#14171C', '#5C6670'] },
  { id: 'neck-medium', slot: 'neck', unlock: { kind: 'achievement', id: 'pellicule' }, colors: ['#3B5249', '#E5B239'] },
  { id: 'neck-scarf', slot: 'neck', unlock: { kind: 'challenges', count: 2 }, colors: ['#C2593F'] },
];

export type Look = Record<Slot, string | null>;

/** Tenue de départ */
export const DEFAULT_LOOK: Look = {
  body: 'body-n',
  skin: 'skin-2',
  hair: 'hair-short',
  hairColor: 'haircolor-brown',
  eyes: 'eyes-dot',
  brows: 'brows-thin',
  mouth: 'mouth-smile',
  beard: null,
  cheeks: 'cheeks-blush',
  outfit: 'outfit-tee',
  head: null,
  face: null,
  neck: 'neck-compact',
};

export const itemById = (id: string | null) => (id ? AVATAR_ITEMS.find((i) => i.id === id) : undefined);

/**
 * Remet d'aplomb une tenue enregistrée par une ancienne version :
 * emplacements manquants, pièces disparues ou rangées ailleurs (ex. « argenté » devenu une couleur).
 */
export function normalizeLook(saved: Partial<Record<string, string | null>> | undefined): Look {
  const look: Look = { ...DEFAULT_LOOK };
  if (!saved) return look;
  for (const slot of SLOTS) {
    const id = saved[slot];
    if (id === null && OPTIONAL_SLOTS.includes(slot)) look[slot] = null;
    else if (id && itemById(id)?.slot === slot) look[slot] = id;
  }
  if (saved.hair === 'hair-silver') look.hairColor = 'hair-silver'; // v1 : coiffure argentée
  return look;
}

export type UnlockContext = {
  rankIndex: number;
  challenges: number;
  sheets: number;
  sos: number;
  photos: number;
  achievements: Record<string, string>;
};

const RANK_ORDER: RankId[] = ['C', 'B', 'A', 'S'];

export function isUnlocked(unlock: Unlock, c: UnlockContext): boolean {
  switch (unlock.kind) {
    case 'free':
      return true;
    case 'rank':
      return c.rankIndex >= RANK_ORDER.indexOf(unlock.rank);
    case 'challenges':
      return c.challenges >= unlock.count;
    case 'sheets':
      return c.sheets >= unlock.count;
    case 'sos':
      return c.sos >= unlock.count;
    case 'photos':
      return c.photos >= unlock.count;
    case 'achievement':
      return Boolean(c.achievements[unlock.id]);
  }
}
