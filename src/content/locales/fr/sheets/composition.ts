import type { Sheet } from '@/content/types';

export const composition: Sheet[] = [
  {
    id: 'regle-des-tiers',
    tier: 'avance',
    section: 'composition',
    title: 'Règle des tiers',
    summary: 'Décentrer le sujet pour une image plus vivante.',
    glyph: '#',
    minutes: 2,
    blocks: [
      {
        kind: 'text',
        body:
          "Imaginez deux lignes horizontales et deux verticales qui découpent l'image en neuf. Placez le sujet sur une ligne ou une intersection plutôt qu'au centre, et l'horizon sur le tiers du haut ou du bas.",
      },
      {
        kind: 'text',
        body:
          "Laissez de l'espace devant un sujet qui regarde ou qui avance : l'œil a besoin de « place » pour suivre le mouvement.",
      },
      {
        kind: 'tip',
        body: "Activez la grille dans les réglages de l'appareil photo de votre téléphone : c'est exactement ce quadrillage.",
      },
      { kind: 'thirds' },
      { kind: 'related', sheets: ['paysage'], challenges: ['minimalisme'] },
    ],
  },
];
