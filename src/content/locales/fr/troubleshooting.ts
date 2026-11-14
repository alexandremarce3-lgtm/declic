/** SOS Photo ratée : diagnostic rapide (structure décrite dans `content/types.ts`). */

import type { Problem } from '@/content/types';

export const problems: Problem[] = [
  {
    id: 'floue',
    title: 'Ma photo est floue',
    short: 'floue',
    symptom: 'Rien n’est vraiment net, ou pas là où il faut.',
    glyph: '≋',
    question: 'Regardez l’image en grand. Qu’est-ce qui est flou ?',
    causes: [
      {
        id: 'bouge',
        label: 'Tout est flou',
        title: 'Flou de bougé',
        recognize:
          'Toute l’image est floue, avec des contours doublés ou des traînées dans la même direction. La vitesse était trop lente pour vos mains, ou pour un sujet en mouvement.',
        fixes: [
          'Augmentez la vitesse : 1/125 s minimum à main levée, 1/500 s pour un sujet qui bouge.',
          'Pas assez de lumière ? Ouvrez le diaphragme ou montez les ISO pour compenser.',
          'Calez-vous : coudes au corps, appui sur un mur, ou trépied.',
          'Déclenchez en douceur, ou au retardateur 2 s.',
        ],
        quick: '1/125 s mini · ISO auto',
        smartphone: 'Tenez le téléphone à deux mains et activez le mode Nuit en basse lumière.',
        sheetId: 'vitesse',
      },
      {
        id: 'mise-au-point',
        label: 'Le fond est net, pas le sujet',
        title: 'Flou de mise au point',
        recognize:
          'Une partie de l’image est nette (le fond, un objet à côté), mais pas votre sujet. Le collimateur, le petit carré de mise au point, était placé au mauvais endroit.',
        fixes: [
          'Placez le collimateur exactement sur le sujet, sur l’œil pour un portrait.',
          'Enfoncez le déclencheur à mi-course, attendez la confirmation, puis déclenchez.',
          'Sujet trop proche ? Reculez : chaque objectif a une distance minimale.',
          'Pour un sujet qui bouge, passez en autofocus continu (AF-C).',
        ],
        quick: 'Collimateur sur le sujet',
        smartphone: 'Touchez l’écran sur le sujet avant de déclencher.',
        sheetId: 'portrait',
      },
    ],
  },
  {
    id: 'sombre',
    title: 'Ma photo est trop sombre',
    short: 'trop sombre',
    symptom: 'Image noire, ombres bouchées sans détail.',
    glyph: '◐',
    causes: [
      {
        id: 'sous-exposition',
        label: 'Sous-exposée',
        title: 'Sous-exposition',
        recognize:
          'Pas assez de lumière n’a atteint le capteur. Fréquent face à une scène très claire (neige, ciel) que l’appareil a voulu ramener au gris.',
        fixes: [
          'Ouvrez le diaphragme : un nombre f/ plus petit.',
          'Baissez la vitesse, sans descendre sous 1/60 s à main levée.',
          'Montez les ISO en dernier recours.',
          'En mode auto ou A / S, utilisez la correction d’exposition vers le +.',
        ],
        quick: 'Correction +1 · f/ plus petit',
        smartphone: 'Touchez le sujet, puis faites glisser le petit soleil vers le haut.',
        sheetId: 'mesure-lumiere',
      },
    ],
  },
  {
    id: 'claire',
    title: 'Ma photo est trop claire',
    short: 'trop claire',
    symptom: 'Ciel blanc sans détail, zones « cramées ».',
    glyph: '☀',
    causes: [
      {
        id: 'surexposition',
        label: 'Surexposée',
        title: 'Surexposition',
        recognize:
          'Trop de lumière : les zones claires deviennent blanc pur et leurs détails sont perdus pour de bon. Fréquent face à un sujet sombre ou en plein soleil.',
        fixes: [
          'Fermez le diaphragme : un nombre f/ plus grand.',
          'Augmentez la vitesse.',
          'Baissez les ISO au minimum (100).',
          'Utilisez la correction d’exposition vers le −.',
        ],
        quick: 'ISO 100 · correction −1',
        smartphone: 'Touchez la zone la plus claire, puis faites glisser le petit soleil vers le bas.',
        sheetId: 'mesure-lumiere',
      },
    ],
  },
  {
    id: 'bruitee',
    title: 'Ma photo est granuleuse',
    short: 'granuleuse',
    symptom: 'Effet « neige » ou grain coloré, surtout dans les ombres.',
    glyph: '⁘',
    causes: [
      {
        id: 'bruit',
        label: 'Bruitée',
        title: 'Bruit numérique',
        recognize:
          'Les ISO étaient trop élevés : le capteur a amplifié le signal… et le bruit avec. Le grain est plus visible dans les zones sombres.',
        fixes: [
          'Baissez les ISO au minimum possible.',
          'Compensez en ouvrant le diaphragme ou en ralentissant (sur appui ou trépied).',
          'Cherchez une source de lumière naturelle : près d’une fenêtre, dehors.',
          'Exposez bien dès la prise : éclaircir une photo sombre après coup fait ressortir le grain.',
        ],
        quick: 'ISO au minimum · plus de lumière',
        smartphone: 'Évitez le zoom numérique et rapprochez-vous d’une fenêtre.',
        sheetId: 'iso',
      },
    ],
  },
];
