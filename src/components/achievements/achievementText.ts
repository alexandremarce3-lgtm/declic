import type { Catalog } from '@/content';
import type { UiStrings } from '@/i18n/fr';
import type { Achievement } from '@/lib/achievements';
import type { RankId } from '@/lib/ranks';

/** Titre et description affichables d'un succès, selon la langue. */
export function achievementText(a: Achievement, t: UiStrings, catalog: Catalog): { title: string; desc: string } {
  if (a.category === 'challenge') {
    const c = a.ref ? catalog.getChallenge(a.ref) : undefined;
    return { title: c?.title ?? a.id, desc: t.achievements.challengeDesc };
  }
  if (a.category === 'rank') {
    const r = a.ref as RankId;
    return { title: t.ranks.titles[r], desc: t.achievements.rankDesc(r) };
  }
  const item = t.achievements.items[a.id as keyof UiStrings['achievements']['items']];
  return item ?? { title: a.id, desc: '' };
}
