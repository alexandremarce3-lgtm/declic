/**
 * Modèle de données du contenu pédagogique.
 *
 * Tout le contenu est décrit en TypeScript (et non en JSON) : le compilateur
 * vérifie chaque fiche, et l'autocomplétion guide les contributeurs.
 * Le jour où il faudra traduire, ces objets s'exportent tels quels en JSON.
 */

import type { ExposureSettings } from '@/lib/exposure';

export type ExposureParam = 'aperture' | 'shutter' | 'iso';

/** Scènes dessinées disponibles pour les exemples (voir `components/illustrations/Scenes.tsx`) */
export type SceneId =
  | 'portrait-bokeh'
  | 'portrait-sharp'
  | 'runner-frozen'
  | 'runner-blur'
  | 'water-frozen'
  | 'water-silky'
  | 'night-clean'
  | 'night-grainy'
  | 'exposure-dark'
  | 'exposure-good'
  | 'exposure-bright'
  // Niveau Avancé
  | 'snow-grey'
  | 'snow-white'
  | 'histogram-left'
  | 'histogram-center'
  | 'histogram-right'
  | 'light-noon'
  | 'light-golden'
  | 'light-overcast'
  | 'light-backlit'
  | 'thirds-centered'
  | 'thirds-offset'
  | 'portrait-harsh'
  | 'portrait-soft'
  | 'street-frozen'
  | 'street-blur'
  | 'landscape-flat'
  | 'landscape-depth'
  | 'night-handheld'
  | 'night-tripod'
  // Parcours Modèle (quiz lumière)
  | 'face-front'
  | 'face-side'
  | 'face-top'
  | 'face-back'
  | 'face-below'
  | 'face-soft';

export type SectionId = 'fondamentaux' | 'composition' | 'situations' | 'techniques' | 'presence';

/**
 * Paliers pédagogiques, du plus accessible au plus pointu.
 * Règles de déverrouillage : voir lib/tiers.ts.
 */
export type TierId = 'fondamental' | 'avance' | 'expert';

export type Section = {
  id: SectionId;
  title: string;
  /** Sous-titre d'une ligne sous l'en-tête de section */
  lead: string;
  /** Style d'affichage dans le sommaire */
  layout: 'list' | 'grid';
};

/** Briques d'une fiche. Ajouter un type ici = l'ajouter dans `SheetBlock.tsx`. */
export type Block =
  | { kind: 'text'; body: string }
  | { kind: 'tip'; body: string; label?: string }
  | {
      kind: 'simulator';
      focus: ExposureParam | 'all';
      /** Réglages de départ (valeurs présentes dans les crans du simulateur) */
      preset?: Partial<ExposureSettings>;
      /** Lumière de la scène en stops par rapport au plein jour (−3 = nuit urbaine) */
      light?: number;
    }
  // — Blocs de la version « Simple » (débutants) —
  /** L'idée en une phrase, en gros */
  | { kind: 'oneLiner'; body: string }
  /** Une image de la vie de tous les jours */
  | { kind: 'analogy'; icon: string; body: string }
  /** 2 ou 3 exemples dessinés côte à côte, avec ce qui change */
  | { kind: 'compare'; title?: string; items: { scene: SceneId; label: string; caption: string }[] }
  | { kind: 'metering' }
  | { kind: 'thirds' }
  | { kind: 'settings'; title?: string; items: { label: string; value: string; note?: string }[] }
  | { kind: 'steps'; title: string; items: string[]; ordered?: boolean }
  | { kind: 'related'; sheets?: string[]; challenges?: string[] }
  | { kind: 'comingSoon'; label: string };

export type Sheet = {
  /** Identifiant stable, utilisé dans l'URL : ne pas le renommer après publication */
  id: string;
  section: SectionId;
  tier: TierId;
  title: string;
  summary: string;
  /** Symbole court affiché dans la pastille */
  glyph: string;
  minutes: number;
  /** Réglages clés résumés, affichés sur la carte (fiches « situations ») */
  keySettings?: string;
  blocks: Block[];
  /**
   * Version « Simple » (facultative) : mots du quotidien et exemples dessinés.
   * Si elle existe, la fiche s'ouvre dessus et propose de basculer vers la version complète.
   */
  simpleBlocks?: Block[];
};

/**
 * SOS Photo ratée.
 * Un problème = un symptôme visible ; une cause = une explication + des solutions immédiates.
 * Un problème à plusieurs causes affiche d'abord `question` pour les départager.
 */
export type Cause = {
  id: string;
  /** Libellé court du choix (ex. « Tout est flou ») */
  label: string;
  title: string;
  /** Comment reconnaître cette cause sur l'image */
  recognize: string;
  /** Solutions, de la plus rapide à la plus technique */
  fixes: string[];
  /** Réglage express à retenir, affiché en badge */
  quick: string;
  smartphone?: string;
  /** Fiche à revoir */
  sheetId?: string;
};

export type Problem = {
  id: string;
  title: string;
  /** Libellé très court pour les boutons de l'accueil (« floue ») */
  short: string;
  symptom: string;
  glyph: string;
  question?: string;
  causes: Cause[];
};

/** Tout le contenu d'une langue */
export type ContentPack = {
  sections: Section[];
  sheets: Sheet[];
  challenges: Challenge[];
  problems: Problem[];
  quiz: QuizQuestion[];
};

/** Question du test « Valider ses acquis » */
export type QuizQuestion = {
  id: string;
  /** Palier dont la question valide les acquis */
  tier: TierId;
  topic: 'lumiere' | 'mesure' | 'composition' | 'reglages';
  question: string;
  /** 4 propositions ; l'ordre est mélangé à l'affichage */
  choices: [string, string, string, string];
  /** Index de la bonne réponse dans choices */
  answer: 0 | 1 | 2 | 3;
  /** Explication affichée après la réponse */
  explain: string;
};

export type Challenge = {
  /** Identifiant stable : c'est la clé de la progression enregistrée */
  id: string;
  tier: TierId;
  title: string;
  brief: string;
  /** Réglages conseillés, affichés en badge */
  settings: string;
  level: 1 | 2 | 3;
  /** Fiche à revoir avant de se lancer */
  sheetId: string;
  steps: string[];
  /** Variante pour smartphone, sans réglages manuels */
  smartphone?: string;
};
