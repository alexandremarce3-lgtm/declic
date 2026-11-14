/**
 * Paliers pédagogiques et règles de déverrouillage.
 *
 *   Fondamental : ouvert dès le départ.
 *   Avancé      : rang B, OU toutes les fiches fondamentales lues, OU test Fondamental réussi.
 *   Expert      : rang A (ou S), OU test Avancé réussi.
 *
 * Le test d'un palier (QUIZ_LENGTH questions, seuil QUIZ_PASS) « valide les acquis » de ce palier :
 * ses fiches et défis non faits sont crédités en XP, et le palier suivant s'ouvre.
 * Les textes (noms, conditions) sont dans les dictionnaires i18n (`t.tiers`).
 */

import type { Challenge, QuizQuestion, Sheet, TierId } from '@/content/types';

export const TIERS: TierId[] = ['fondamental', 'avance', 'expert'];

export const QUIZ_LENGTH = 15;
/** Part de bonnes réponses exigée (80 % → 12 / 15) */
export const QUIZ_PASS = 0.8;
export const passMark = () => Math.ceil(QUIZ_LENGTH * QUIZ_PASS);

/** Palier débloqué par le test d'un palier donné */
export const nextTier = (tier: TierId): TierId | null => TIERS[TIERS.indexOf(tier) + 1] ?? null;

export type TierInputs = {
  rankIndex: number;
  /** Fiches lues pour de vrai (pas créditées par test) */
  sheetsRead: Record<string, unknown>;
  quizPassed: Partial<Record<TierId, unknown>>;
  sheets: Sheet[];
};

export type UnlockReason = 'start' | 'rank' | 'sheets' | 'quiz';

/** Raison du déverrouillage, ou null si le palier est verrouillé */
export function tierUnlockReason(tier: TierId, i: TierInputs): UnlockReason | null {
  if (tier === 'fondamental') return 'start';
  if (tier === 'avance') {
    if (i.quizPassed.fondamental) return 'quiz';
    if (i.rankIndex >= 1) return 'rank';
    // Les fiches « Présence et pose » (parcours Modèle) ne conditionnent pas l'ouverture du niveau Avancé
    const base = i.sheets.filter((s) => s.tier === 'fondamental' && s.section !== 'presence');
    if (base.length && base.every((s) => i.sheetsRead[s.id])) return 'sheets';
    return null;
  }
  // expert
  if (i.quizPassed.avance) return 'quiz';
  if (i.rankIndex >= 2) return 'rank';
  return null;
}

/** Tire `QUIZ_LENGTH` questions d'un palier, et mélange leurs propositions. */
export function drawQuiz(bank: QuizQuestion[], tier: TierId, random = Math.random) {
  const pool = shuffle(bank.filter((q) => q.tier === tier), random).slice(0, QUIZ_LENGTH);
  return pool.map((q) => {
    const order = shuffle([0, 1, 2, 3], random);
    return { ...q, order, correct: order.indexOf(q.answer) };
  });
}

export type DrawnQuestion = ReturnType<typeof drawQuiz>[number];

function shuffle<T>(list: T[], random: () => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Éléments d'un palier qu'un test réussi créditerait (ceux pas encore faits ni crédités) */
export function creditableItems(
  tier: TierId,
  sheets: Sheet[],
  challenges: Challenge[],
  already: { sheets: Record<string, unknown>; challenges: Record<string, unknown>; credited: Record<string, unknown> },
) {
  return {
    sheets: sheets.filter((s) => s.tier === tier && !already.sheets[s.id] && !already.credited[`sheet:${s.id}`]).map((s) => s.id),
    challenges: challenges
      .filter((c) => c.tier === tier && !already.challenges[c.id] && !already.credited[`challenge:${c.id}`])
      .map((c) => c.id),
  };
}
