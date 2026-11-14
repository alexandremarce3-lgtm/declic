/**
 * Modèle (indépendant de la langue) de l'espace « Collaborer en confiance ».
 * Les textes sont dans `content/locales/<langue>/collab.ts`, obtenus via `useCollab()`.
 */

export type ProjectType = 'portrait' | 'mode' | 'lingerie' | 'nu' | 'autre';
export type Allowance = 'habille' | 'stylisme' | 'maillot' | 'lingerie' | 'implicite' | 'nu';
export type Diffusion = 'book' | 'socialPhotographer' | 'socialModel' | 'contests' | 'exhibition';
export type MoodStyle = 'naturel' | 'noir-blanc' | 'mode' | 'studio' | 'exterieur' | 'urbain' | 'fine-art' | 'boudoir';

export const PROJECT_IDS: ProjectType[] = ['portrait', 'mode', 'lingerie', 'nu', 'autre'];
export const ALLOWANCE_IDS: Allowance[] = ['habille', 'stylisme', 'maillot', 'lingerie', 'implicite', 'nu'];
export const DIFFUSION_IDS: Diffusion[] = ['book', 'socialPhotographer', 'socialModel', 'contests', 'exhibition'];
export const MOOD_STYLE_IDS: MoodStyle[] = ['naturel', 'noir-blanc', 'mode', 'studio', 'exterieur', 'urbain', 'fine-art', 'boudoir'];

/** Réservés aux personnes majeures, avec avertissement dans l'accord */
export const SENSITIVE_PROJECTS: ProjectType[] = ['lingerie', 'nu'];
export const SENSITIVE_ALLOWANCES: Allowance[] = ['lingerie', 'implicite', 'nu'];

export type Signature = { name: string; paths: string[]; at: string; adultDeclared: boolean };

export type Agreement = {
  id: string;
  createdAt: string;
  projectType: ProjectType;
  projectOther: string;
  date: string;
  place: string;
  photographer: string;
  model: string;
  allowed: Allowance[];
  forbidden: string;
  deliveryCount: number;
  deliveryDays: number;
  diffusion: Diffusion[];
  credit: boolean;
  durationYears: number;
  signatures: { photographer?: Signature; model?: Signature };
};

export const isSensitive = (a: Pick<Agreement, 'projectType' | 'allowed'>) =>
  SENSITIVE_PROJECTS.includes(a.projectType) || a.allowed.some((x) => SENSITIVE_ALLOWANCES.includes(x));

export type FaqItem = { id: string; icon: string; question: string; short: string; body: string[]; links?: { label: string; url: string }[] };

export type LegalDoc = { id: 'mentions' | 'confidentialite' | 'conditions'; title: string; sections: { title: string; body: string }[] };

export type LightQuestion = {
  scene: 'face-front' | 'face-side' | 'face-top' | 'face-back' | 'face-below' | 'face-soft';
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

/** Tous les textes de l'espace collaborations, pour une langue */
export type CollabContent = {
  faq: FaqItem[];
  charter: { title: string; body: string }[];
  projectTypes: Record<ProjectType, string>;
  allowances: Record<Allowance, string>;
  diffusions: Record<Diffusion, string>;
  moodStyles: Record<MoodStyle, string>;
  agreementSections: (a: Agreement) => { title: string; body: string }[];
  disclaimer: string;
  pdf: { lang: string; kicker: string; title: string; created: (date: string, ref: string) => string; photographer: string; model: string; notSigned: string; mention: string };
  legalDocs: LegalDoc[];
  lightQuiz: LightQuestion[];
};

/**
 * Les premières versions enregistraient le moodboard avec des libellés français.
 * On les convertit en identifiants, valables dans toutes les langues.
 */
const LEGACY: Record<string, MoodStyle | Allowance> = {
  'Portrait naturel': 'naturel',
  'Noir & blanc': 'noir-blanc',
  Mode: 'mode',
  Studio: 'studio',
  Extérieur: 'exterieur',
  Urbain: 'urbain',
  'Fine art': 'fine-art',
  Boudoir: 'boudoir',
  Habillé: 'habille',
  Stylisme: 'stylisme',
  'Maillot de bain': 'maillot',
  Lingerie: 'lingerie',
  'Nu implicite': 'implicite',
  'Nu artistique': 'nu',
};

export const toMoodStyle = (v: string): MoodStyle | null =>
  (MOOD_STYLE_IDS as string[]).includes(v) ? (v as MoodStyle) : (MOOD_STYLE_IDS as string[]).includes(LEGACY[v] ?? '') ? (LEGACY[v] as MoodStyle) : null;

export const toAllowance = (v: string): Allowance | null =>
  (ALLOWANCE_IDS as string[]).includes(v) ? (v as Allowance) : (ALLOWANCE_IDS as string[]).includes(LEGACY[v] ?? '') ? (LEGACY[v] as Allowance) : null;
