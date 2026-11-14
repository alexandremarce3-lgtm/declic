import type { Sheet } from '@/content/types';

/** Fiches « comment ça marche » du niveau Avancé. */
export const advanced: Sheet[] = [
  {
    id: 'histogramme',
    tier: 'avance',
    section: 'fondamentaux',
    title: 'Lire l’histogramme',
    summary: 'Le vrai juge de l’exposition, plus fiable que l’écran.',
    glyph: '▁▃▅',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body:
          "L'histogramme est un graphique : à gauche les noirs, au milieu les tons moyens, à droite les blancs. La hauteur indique combien de pixels ont cette luminosité.",
      },
      {
        kind: 'text',
        body:
          "L'écran de l'appareil ment souvent : trop lumineux en intérieur, illisible au soleil. L'histogramme, lui, ne dépend pas de l'éclairage autour de vous.",
      },
      {
        kind: 'settings',
        title: 'Repères',
        items: [
          { label: 'Collé à droite', value: 'Blancs cramés', note: 'Détails perdus pour de bon : corrigez vers le −' },
          { label: 'Collé à gauche', value: 'Noirs bouchés', note: 'Corrigez vers le +, ou acceptez des ombres profondes' },
          { label: 'Bosse au centre', value: 'Scène moyenne', note: 'Ce que vise la cellule' },
          { label: 'Deux bosses aux bords', value: 'Fort contraste', note: 'Contre-jour : il faudra choisir' },
        ],
      },
      {
        kind: 'tip',
        body:
          "Il n'existe pas de « bon » histogramme : une scène de neige est naturellement à droite, une nuit à gauche. Ce qui compte, c'est de ne pas toucher le bord sur ce qui vous importe.",
      },
      { kind: 'related', sheets: ['mesure-lumiere', 'bracketing-hdr'], challenges: ['contre-jour'] },
    ],
  },
  {
    id: 'lumiere-naturelle',
    tier: 'avance',
    section: 'fondamentaux',
    title: 'Lire la lumière naturelle',
    summary: 'Heure, direction, douceur : la lumière fait la photo.',
    glyph: '☼',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Une même scène change complètement selon l'heure. La lumière se décrit par trois qualités : sa couleur (chaude ou froide), sa direction, et sa dureté.",
      },
      {
        kind: 'settings',
        title: 'Les moments de la journée',
        items: [
          { label: 'Heure dorée', value: 'Chaude et rasante', note: 'L’heure après le lever et avant le coucher du soleil' },
          { label: 'Heure bleue', value: 'Froide et douce', note: 'Juste avant le lever, juste après le coucher' },
          { label: 'Midi', value: 'Dure et verticale', note: 'Ombres courtes et noires' },
          { label: 'Ciel couvert', value: 'Douce et uniforme', note: 'Un immense diffuseur, idéal pour le portrait' },
        ],
      },
      {
        kind: 'steps',
        title: 'La direction',
        items: [
          'De face : peu d’ombres, image plate mais lisible.',
          'De côté : relief, textures, volumes. La lumière des sculpteurs.',
          'De dos (contre-jour) : silhouettes, cheveux lumineux. Il faut corriger l’exposition.',
        ],
      },
      {
        kind: 'tip',
        body: "Avant de déclencher, regardez où tombent les ombres. Si elles vous gênent, tournez autour du sujet plutôt que de changer de réglages.",
      },
      { kind: 'related', sheets: ['portrait', 'paysage'], challenges: ['heure-doree', 'contre-jour'] },
    ],
  },
];
