/**
 * Rangs de photographe, façon grades de chasseurs.
 * Les intitulés sont dans les dictionnaires i18n (`t.ranks.titles[id]`).
 */

export type RankId = 'C' | 'B' | 'A' | 'S';

export const RANKS: { id: RankId; min: number }[] = [
  { id: 'C', min: 0 },
  { id: 'B', min: 100 },
  { id: 'A', min: 300 },
  { id: 'S', min: 600 },
];

/** Barème d'XP — chaque élément ne rapporte qu'une seule fois. */
export const XP = {
  sheetRead: 10,
  challengeDone: 20,
  sosViewed: 15,
} as const;

export type RankInfo = {
  rank: RankId;
  index: number;
  /** Seuil du rang suivant, ou null au rang S */
  nextMin: number | null;
  /** Avancement vers le rang suivant, 0 à 1 (1 au rang S) */
  progress: number;
};

export function rankFor(xp: number): RankInfo {
  let index = 0;
  RANKS.forEach((r, i) => {
    if (xp >= r.min) index = i;
  });
  const current = RANKS[index];
  const next = RANKS[index + 1];
  return {
    rank: current.id,
    index,
    nextMin: next?.min ?? null,
    progress: next ? (xp - current.min) / (next.min - current.min) : 1,
  };
}
