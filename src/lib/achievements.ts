/**
 * Succès (badges).
 *  - un badge par défi réussi et par rang atteint (générés automatiquement) ;
 *  - des jalons visibles ;
 *  - des succès SECRETS, déclenchés par des actions insolites ou répétées.
 * Les textes sont dans les dictionnaires i18n (`t.achievements.items[id]`),
 * sauf les badges de défi qui reprennent le titre du défi.
 * Un succès débloqué le reste, même si sa condition cesse d'être vraie.
 */

import type { Stored } from '@/storage/progress';
import { RANKS, rankFor, type RankId } from './ranks';
import { xpOf } from './xp';

/** Compteurs d'actions utilisés par les succès secrets */
export const COUNTERS = {
  homeTaps: 'homeTaps', // taps sur le titre « Déclic » de l'accueil
  nightVisits: 'nightVisits', // ouverture de l'app entre minuit et 5 h
  dawnVisits: 'dawnVisits', // ouverture entre 5 h et 7 h
  sliderMoves: 'sliderMoves', // crans de curseur déplacés dans les simulateurs
  perfectExposures: 'perfectExposures', // retour à une exposition correcte dans le simulateur
  sosVisits: 'sosVisits', // ouvertures de l'écran SOS
} as const;

export type AchievementCategory = 'challenge' | 'rank' | 'milestone' | 'secret';

export type EvalContext = {
  stored: Stored;
  photoCount: number;
  /** Défis ayant au moins une photo dans le carnet */
  photographedChallenges: number;
  challengeIds: string[];
  sheetCount: number;
};

export type Achievement = {
  id: string;
  category: AchievementCategory;
  glyph: string;
  /** Défi ou rang concerné (badges générés) */
  ref?: string;
  check: (c: EvalContext) => boolean;
};

const n = (c: EvalContext, k: keyof typeof COUNTERS) => c.stored.counters[COUNTERS[k]] ?? 0;

/** Jalons visibles et succès secrets (définis à la main) */
const CRAFTED: Achievement[] = [
  { id: 'premier-cliche', category: 'milestone', glyph: '◎', check: (c) => c.photoCount >= 1 },
  { id: 'carnet-complet', category: 'milestone', glyph: '▦', check: (c) => c.photographedChallenges >= c.challengeIds.length },
  { id: 'rat-de-bibliotheque', category: 'milestone', glyph: '❡', check: (c) => Object.keys(c.stored.sheets).length >= c.sheetCount },
  { id: 'tous-les-defis', category: 'milestone', glyph: '✶', check: (c) => c.challengeIds.every((id) => c.stored.challenges[id]) },

  // Collaborations sécurisées (badges de profil ; l'XP vient déjà des quêtes)
  { id: 'moodboard-pret', category: 'milestone', glyph: '▧', check: (c) => Boolean(c.stored.quests?.moodboard) },
  { id: 'charte-signee', category: 'milestone', glyph: '§', check: (c) => Boolean(c.stored.quests?.['charte-tfp']) },
  { id: 'collaborateur-sur', category: 'milestone', glyph: '✍', check: (c) => Boolean(c.stored.quests?.['premier-accord']) },
  { id: 'oeil-lumiere', category: 'milestone', glyph: '☼', check: (c) => Boolean(c.stored.quests?.['quiz-lumiere-modele']) },

  { id: 'curieux', category: 'secret', glyph: '?', check: (c) => n(c, 'homeTaps') >= 10 },
  { id: 'noctambule', category: 'secret', glyph: '☾', check: (c) => n(c, 'nightVisits') >= 1 },
  { id: 'heure-bleue', category: 'secret', glyph: '◒', check: (c) => n(c, 'dawnVisits') >= 1 },
  { id: 'rafale', category: 'secret', glyph: '⋯', check: (c) => n(c, 'sliderMoves') >= 100 },
  { id: 'oeil-de-cellule', category: 'secret', glyph: '◉', check: (c) => n(c, 'perfectExposures') >= 5 },
  { id: 'habitue-sos', category: 'secret', glyph: '✚', check: (c) => n(c, 'sosVisits') >= 5 },
  { id: 'pellicule', category: 'secret', glyph: '▤', check: (c) => c.photoCount >= 12 },
];

/** Catalogue complet, pour une liste de défis donnée */
export function buildAchievements(challengeIds: string[]): Achievement[] {
  const challengeBadges: Achievement[] = challengeIds.map((id, i) => ({
    id: `defi:${id}`,
    category: 'challenge',
    glyph: String(i + 1).padStart(2, '0'),
    ref: id,
    check: (c) => Boolean(c.stored.challenges[id]),
  }));
  const rankBadges: Achievement[] = RANKS.map((r) => ({
    id: `rang:${r.id}`,
    category: 'rank',
    glyph: r.id,
    ref: r.id,
    check: (c) => rankFor(xpOf(c.stored)).index >= RANKS.findIndex((x) => x.id === (r.id as RankId)),
  }));
  return [...challengeBadges, ...rankBadges, ...CRAFTED];
}
