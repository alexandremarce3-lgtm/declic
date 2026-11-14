import type { Section } from '@/content/types';

/**
 * Ordre d'affichage des sections À L'INTÉRIEUR de chaque palier
 * (une section sans fiche dans un palier n'y est pas affichée).
 */
export const sections: Section[] = [
  {
    id: 'fondamentaux',
    title: 'Comment ça marche',
    lead: 'La technique, réglage par réglage.',
    layout: 'list',
  },
  {
    id: 'composition',
    title: 'Composition',
    lead: "Où placer le sujet dans l'image.",
    layout: 'list',
  },
  {
    id: 'situations',
    title: 'Situations',
    lead: 'Quoi régler, sur le terrain.',
    layout: 'grid',
  },
  {
    id: 'presence',
    title: 'Présence et pose',
    lead: 'Pour les modèles, et les photographes qui les dirigent.',
    layout: 'list',
  },
  {
    id: 'techniques',
    title: 'Techniques',
    lead: 'Les outils des photographes confirmés.',
    layout: 'list',
  },
];
