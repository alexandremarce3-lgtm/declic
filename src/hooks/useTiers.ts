import { useMemo } from 'react';
import type { TierId } from '@/content/types';
import { useI18n } from '@/i18n';
import { XP } from '@/lib/ranks';
import { TIERS, creditableItems, nextTier, tierUnlockReason, type UnlockReason } from '@/lib/tiers';
import { useProgress } from '@/storage/progress';

export type TierStatus = {
  id: TierId;
  unlocked: boolean;
  reason: UnlockReason | null;
  sheetsTotal: number;
  sheetsDone: number;
  challengesTotal: number;
  challengesDone: number;
  /** Test de ce palier : réussi ? proposé ? */
  quizPassed: boolean;
  /** Le test n'a d'intérêt que si le palier suivant est encore fermé */
  quizUseful: boolean;
  /** XP que rapporterait un test réussi maintenant */
  quizReward: number;
  next: TierId | null;
};

/** État de chaque palier (verrouillage, avancement, intérêt du test). */
export function useTiers() {
  const { stored, rank } = useProgress();
  const { catalog } = useI18n();

  return useMemo(() => {
    const inputs = { rankIndex: rank.index, sheetsRead: stored.sheets, quizPassed: stored.quizPassed, sheets: catalog.sheets };
    const done = (kind: 'sheet' | 'challenge', id: string) =>
      Boolean((kind === 'sheet' ? stored.sheets : stored.challenges)[id] || stored.credited[`${kind}:${id}`]);

    const list: TierStatus[] = TIERS.map((id) => {
      const reason = tierUnlockReason(id, inputs);
      const sheets = catalog.sheets.filter((s) => s.tier === id);
      const challenges = catalog.challenges.filter((c) => c.tier === id);
      const credit = creditableItems(id, catalog.sheets, catalog.challenges, stored);
      const next = nextTier(id);
      const nextOpen = next ? tierUnlockReason(next, inputs) !== null : true;
      return {
        id,
        unlocked: reason !== null,
        reason,
        sheetsTotal: sheets.length,
        sheetsDone: sheets.filter((s) => done('sheet', s.id)).length,
        challengesTotal: challenges.length,
        challengesDone: challenges.filter((c) => done('challenge', c.id)).length,
        quizPassed: Boolean(stored.quizPassed[id]),
        quizUseful: reason !== null && !nextOpen && catalog.quiz.some((q) => q.tier === id),
        quizReward: credit.sheets.length * XP.sheetRead + credit.challenges.length * XP.challengeDone,
        next,
      };
    });

    const byId = Object.fromEntries(list.map((s) => [s.id, s])) as Record<TierId, TierStatus>;
    return { tiers: list, byId, isOpen: (tier: TierId) => byId[tier].unlocked };
  }, [stored, rank.index, catalog]);
}
