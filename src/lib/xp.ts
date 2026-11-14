/**
 * Calcul de l'XP à partir de ce qui a été fait. Aucune XP n'est stockée telle quelle :
 * on recompte à chaque fois, ce qui empêche tout double comptage.
 *
 *   fiche lue ou créditée par test      +10
 *   défi réussi ou crédité par test      +20
 *   solution SOS consultée               +15
 *   jalon (succès visible)               +15
 *   succès secret                        +10
 *
 * Les badges de défi et de rang ne rapportent rien : ils récompensent une XP déjà comptée.
 */

import { XP } from './ranks';

/** Bonus d'XP des succès hors défis et rangs */
export const ACHIEVEMENT_XP: Record<string, number> = {
  'premier-cliche': 15,
  'carnet-complet': 15,
  'rat-de-bibliotheque': 15,
  'tous-les-defis': 15,
  curieux: 10,
  noctambule: 10,
  'heure-bleue': 10,
  rafale: 10,
  'oeil-de-cellule': 10,
  'habitue-sos': 10,
  pellicule: 10,
};

/** XP des quêtes (une seule fois chacune) */
export const QUEST_XP: Record<string, number> = {
  'faq-tfp': 30, // FAQ TFP lue en entier
  'charte-tfp': 20, // charte de collaboration acceptée
  'premier-accord': 40, // premier Contrat-Minute signé à deux
  moodboard: 20, // moodboard et limites définis
  'quiz-lumiere-modele': 25, // quiz visuel lumière réussi
};

type XpSource = {
  sheets: Record<string, unknown>;
  challenges: Record<string, unknown>;
  sos: Record<string, unknown>;
  achievements: Record<string, unknown>;
  /** `sheet:<id>` ou `challenge:<id>` crédités par un test réussi */
  credited: Record<string, unknown>;
  quests?: Record<string, unknown>;
};

export function xpOf(s: XpSource): number {
  const sheets = new Set(Object.keys(s.sheets));
  const challenges = new Set(Object.keys(s.challenges));
  for (const key of Object.keys(s.credited)) {
    const [kind, id] = key.split(':');
    if (kind === 'sheet') sheets.add(id);
    else if (kind === 'challenge') challenges.add(id);
  }
  const bonus =
    Object.keys(s.achievements).reduce((n, id) => n + (ACHIEVEMENT_XP[id] ?? 0), 0) +
    Object.keys(s.quests ?? {}).reduce((n, id) => n + (QUEST_XP[id] ?? 0), 0);
  return sheets.size * XP.sheetRead + challenges.size * XP.challengeDone + Object.keys(s.sos).length * XP.sosViewed + bonus;
}
