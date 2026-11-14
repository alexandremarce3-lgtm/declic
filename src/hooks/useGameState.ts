import { useMemo } from 'react';
import { useI18n } from '@/i18n';
import { buildAchievements, type EvalContext } from '@/lib/achievements';
import { AVATAR_ITEMS, isUnlocked, type UnlockContext } from '@/lib/avatar';
import { useJournal } from '@/storage/journal';
import { useProgress } from '@/storage/progress';

/** Vue d'ensemble « jeu » : succès et pièces d'avatar, avec leur état de déblocage. */
export function useGameState() {
  const { stored, rank } = useProgress();
  const { entries } = useJournal();
  const { catalog } = useI18n();

  return useMemo(() => {
    const challengeIds = catalog.challenges.map((c) => c.id);
    const evalCtx: EvalContext = {
      stored,
      photoCount: entries.length,
      photographedChallenges: new Set(entries.map((e) => e.challengeId)).size,
      challengeIds,
      sheetCount: catalog.sheets.length,
    };
    const achievements = buildAchievements(challengeIds).map((a) => ({
      ...a,
      unlocked: Boolean(stored.achievements[a.id]),
      /** Condition remplie (même si pas encore enregistrée) */
      earned: a.check(evalCtx),
    }));

    const unlockCtx: UnlockContext = {
      rankIndex: rank.index,
      challenges: Object.keys(stored.challenges).length,
      sheets: Object.keys(stored.sheets).length,
      sos: Object.keys(stored.sos).length,
      photos: entries.length,
      achievements: stored.achievements,
    };
    const items = AVATAR_ITEMS.map((i) => ({ ...i, unlocked: isUnlocked(i.unlock, unlockCtx) }));

    return { evalCtx, achievements, unlockCtx, items };
  }, [stored, rank.index, entries, catalog]);
}
