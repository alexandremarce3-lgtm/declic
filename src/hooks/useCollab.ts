import type { CollabContent } from '@/content/collabModel';
import { enCollab } from '@/content/locales/en/collab';
import { frCollab } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import type { Locale } from '@/i18n/locales';

const packs: Record<Locale, CollabContent> = { fr: frCollab, en: enCollab };

/** Textes de l'espace collaborations dans la langue de l'app (repli : français). */
export function useCollab(): CollabContent {
  const { locale } = useI18n();
  return packs[locale] ?? frCollab;
}
