/**
 * Catalogue de contenu, par langue.
 * Les écrans y accèdent via `useI18n().catalog`, jamais en important les fichiers de fiches.
 *
 * Ajouter une langue : créer `locales/<code>/` sur le modèle de `locales/fr/`
 * (mêmes identifiants !), puis l'enregistrer dans `contentPacks` ci-dessous.
 */

import type { Locale } from '@/i18n/locales';
import { QUIZ_LENGTH } from '@/lib/tiers';
import { frContent } from './locales/fr';
import type { ContentPack, SectionId, Sheet } from './types';

export type * from './types';

export const contentPacks: Partial<Record<Locale, ContentPack>> = {
  fr: frContent,
};

export type Catalog = ContentPack & {
  getSheet: (id: string) => Sheet | undefined;
  getChallenge: (id: string) => ContentPack['challenges'][number] | undefined;
  sheetsOf: (section: SectionId) => Sheet[];
  /** Fiche suivante dans la même section (lecture enchaînée) */
  nextSheet: (sheet: Sheet) => Sheet | undefined;
  /** Numéro de la fiche dans sa section (1, 2, 3…) */
  sheetNumber: (sheet: Sheet) => number;
};

export function createCatalog(pack: ContentPack): Catalog {
  const sheetById = new Map(pack.sheets.map((s) => [s.id, s]));
  const challengeById = new Map(pack.challenges.map((c) => [c.id, c]));
  const sheetsOf = (section: SectionId) => pack.sheets.filter((s) => s.section === section);
  return {
    ...pack,
    getSheet: (id) => sheetById.get(id),
    getChallenge: (id) => challengeById.get(id),
    sheetsOf,
    // Lecture enchaînée et numérotation : même section ET même palier
    nextSheet: (sheet) => {
      const list = sheetsOf(sheet.section).filter((s) => s.tier === sheet.tier);
      return list[list.indexOf(sheet) + 1];
    },
    sheetNumber: (sheet) => sheetsOf(sheet.section).filter((s) => s.tier === sheet.tier).indexOf(sheet) + 1,
  };
}

const ids = (pack: ContentPack) => ({
  sheets: pack.sheets.map((s) => s.id),
  challenges: pack.challenges.map((c) => c.id),
  problems: pack.problems.map((p) => p.id),
});

/** Liens cassés, doublons, et écarts d'identifiants avec le français. Vide = catalogue sain. */
export function validatePack(pack: ContentPack, reference: ContentPack = frContent): string[] {
  const errors: string[] = [];
  const own = ids(pack);
  const sheetIds = new Set(own.sheets);
  const challengeIds = new Set(own.challenges);

  const dup = (list: string[], label: string) =>
    list.filter((id, i) => list.indexOf(id) !== i).forEach((id) => errors.push(`${label} en double : ${id}`));
  dup(own.sheets, 'Fiche');
  dup(own.challenges, 'Défi');
  dup(own.problems, 'Problème SOS');
  dup(pack.quiz.map((q) => q.id), 'Question');

  // Chaque palier testable doit avoir assez de questions
  (['fondamental', 'avance'] as const).forEach((tier) => {
    const n = pack.quiz.filter((q) => q.tier === tier).length;
    if (n < QUIZ_LENGTH) errors.push(`Quiz ${tier} : ${n} questions, il en faut au moins ${QUIZ_LENGTH}`);
  });
  // Un défi ne doit pas renvoyer vers une fiche d'un palier supérieur
  const order = ['fondamental', 'avance', 'expert'];
  for (const c of pack.challenges) {
    const s = pack.sheets.find((x) => x.id === c.sheetId);
    if (s && order.indexOf(s.tier) > order.indexOf(c.tier)) errors.push(`Défi ${c.id} (${c.tier}) → fiche ${s.id} d'un palier supérieur`);
  }

  for (const s of pack.sheets) {
    for (const b of s.blocks) {
      if (b.kind !== 'related') continue;
      b.sheets?.forEach((id) => !sheetIds.has(id) && errors.push(`${s.id} → fiche inconnue « ${id} »`));
      b.challenges?.forEach((id) => !challengeIds.has(id) && errors.push(`${s.id} → défi inconnu « ${id} »`));
    }
  }
  for (const c of pack.challenges) {
    if (!sheetIds.has(c.sheetId)) errors.push(`Défi ${c.id} → fiche inconnue « ${c.sheetId} »`);
  }
  for (const p of pack.problems) {
    if (p.causes.length > 1 && !p.question) errors.push(`SOS ${p.id} : plusieurs causes sans question`);
    for (const c of p.causes) {
      if (c.sheetId && !sheetIds.has(c.sheetId)) errors.push(`SOS ${p.id}/${c.id} → fiche inconnue « ${c.sheetId} »`);
    }
  }

  // Une traduction doit garder exactement les mêmes identifiants (URL, progression enregistrée).
  if (pack !== reference) {
    const ref = ids(reference);
    (['sheets', 'challenges', 'problems'] as const).forEach((k) => {
      ref[k].filter((id) => !own[k].includes(id)).forEach((id) => errors.push(`${k} : « ${id} » manque dans la traduction`));
      own[k].filter((id) => !ref[k].includes(id)).forEach((id) => errors.push(`${k} : « ${id} » absent du français`));
    });
  }
  return errors;
}

if (__DEV__) {
  for (const [locale, pack] of Object.entries(contentPacks)) {
    const errors = pack ? validatePack(pack) : [];
    if (errors.length) console.warn(`Contenu « ${locale} » :\n- ${errors.join('\n- ')}`);
  }
}
