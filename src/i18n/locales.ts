import { en } from './en';
import { fr, type UiStrings } from './fr';

/** Langues dont l'interface est traduite */
export const uiStrings = { fr, en } satisfies Record<string, UiStrings>;

export type Locale = keyof typeof uiStrings;

export const DEFAULT_LOCALE: Locale = 'fr';
