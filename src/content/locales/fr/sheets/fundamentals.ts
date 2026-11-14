import type { Sheet } from '@/content/types';

export const fundamentals: Sheet[] = [
  {
    id: 'triangle-exposition',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: "Le triangle d'exposition",
    summary: 'Trois réglages, une seule quantité de lumière.',
    glyph: '△',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Une photo bien exposée, c'est la bonne quantité de lumière sur le capteur. Trois réglages la contrôlent : l'ouverture (la taille du trou), la vitesse (la durée) et l'ISO (l'amplification).",
      },
      {
        kind: 'text',
        body:
          "On les compte en « stops ». Un stop, c'est deux fois plus ou deux fois moins de lumière. Si vous perdez un stop d'un côté, regagnez-le de l'autre : l'exposition reste identique, seul le rendu change.",
      },
      { kind: 'simulator', focus: 'all', preset: { aperture: 2.8, shutter: 1 / 500, iso: 400 } },
      {
        kind: 'settings',
        title: 'Chaque réglage a un prix',
        items: [
          { label: 'Ouverture', value: 'Profondeur de champ', note: 'Ouvrir floute le fond.' },
          { label: 'Vitesse', value: 'Mouvement', note: 'Ralentir crée du flou de bougé.' },
          { label: 'ISO', value: 'Bruit', note: 'Monter ajoute du grain.' },
        ],
      },
      {
        kind: 'tip',
        body:
          "Essayez dans le simulateur : passez de f/2.8 à f/5.6 (−2 stops), puis compensez avec la vitesse. L'image retrouve sa luminosité, mais la balle commence à filer.",
      },
      { kind: 'related', sheets: ['ouverture', 'vitesse', 'iso'] },
    ],
  },
  {
    id: 'ouverture',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'Ouverture du diaphragme',
    summary: 'La lumière… et le flou d’arrière-plan.',
    glyph: 'f/',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Dans l'objectif, un iris de lamelles s'ouvre ou se ferme. On note l'ouverture « f/ » suivi d'un nombre. Piège classique : plus le nombre est petit, plus le trou est grand. f/1.8 est très ouvert, f/16 est très fermé.",
      },
      { kind: 'simulator', focus: 'aperture' },
      {
        kind: 'text',
        body:
          "L'ouverture décide aussi de la profondeur de champ, la tranche de la scène qui paraît nette. Grande ouverture : un fond fondu, le « bokeh », qui isole le sujet. Petite ouverture : tout est net, du premier plan à l'horizon.",
      },
      {
        kind: 'settings',
        title: 'Repères',
        items: [
          { label: 'f/1.8 – f/2.8', value: 'Portrait, sujet isolé' },
          { label: 'f/4 – f/5.6', value: 'Petit groupe, détail' },
          { label: 'f/8 – f/11', value: 'Paysage, architecture' },
        ],
      },
      {
        kind: 'tip',
        body:
          "Le flou ne dépend pas que de l'ouverture : rapprochez-vous du sujet et éloignez-le du fond pour l'accentuer. Sur smartphone, le mode « Portrait » imite une grande ouverture par logiciel.",
      },
      { kind: 'related', sheets: ['portrait'], challenges: ['fond-flou'] },
    ],
  },
  {
    id: 'vitesse',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: "Vitesse d'obturation",
    summary: 'Figer le mouvement ou le laisser filer.',
    glyph: '1/',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body:
          "La vitesse, c'est la durée pendant laquelle l'obturateur reste ouvert. 1/1000 s fige une goutte d'eau. 1/15 s transforme un passant en traînée. Plusieurs secondes lissent l'eau et effacent la foule : c'est la pose longue.",
      },
      { kind: 'simulator', focus: 'shutter' },
      {
        kind: 'settings',
        title: 'Repères',
        items: [
          { label: '1/1000 s et plus', value: 'Sport, eau, animaux' },
          { label: '1/250 – 1/500 s', value: 'Rue, enfants qui bougent' },
          { label: '1/60 s', value: 'Limite à main levée' },
          { label: '1/4 s et plus', value: 'Pose longue : trépied' },
        ],
      },
      {
        kind: 'tip',
        body:
          "Le flou de bougé vient de vos mains, le flou de mouvement vient du sujet. La stabilisation corrige le premier, jamais le second.",
      },
      { kind: 'related', sheets: ['rue', 'nuit'], challenges: ['mouvement-fige', 'pose-longue-jour'] },
    ],
  },
  {
    id: 'iso',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'Sensibilité ISO',
    summary: 'Amplifier la lumière, au prix du bruit.',
    glyph: 'ISO',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body:
          "L'ISO amplifie le signal du capteur. Doubler l'ISO éclaircit l'image d'un stop, mais fait apparaître du grain : le bruit numérique, surtout visible dans les ombres.",
      },
      { kind: 'simulator', focus: 'iso', preset: { iso: 3200, shutter: 1 / 1000 } },
      {
        kind: 'text',
        body:
          "L'ISO est votre variable d'ajustement : choisissez d'abord l'ouverture et la vitesse dont l'image a besoin, puis montez l'ISO juste assez.",
      },
      {
        kind: 'tip',
        label: 'ISO auto',
        body:
          "Sur la plupart des appareils, l'ISO auto avec un plafond (par exemple 3200) est un excellent réglage par défaut. Une photo un peu bruitée vaut mieux qu'une photo floue.",
      },
      { kind: 'related', sheets: ['nuit'] },
    ],
  },
  {
    id: 'mesure-lumiere',
    tier: 'avance',
    section: 'fondamentaux',
    title: "Mesure et correction d'exposition",
    summary: 'Pourquoi la neige sort grise, et comment l’éviter.',
    glyph: '±',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "La cellule de l'appareil mesure la lumière renvoyée par la scène, puis choisit des réglages pour qu'elle paraisse… gris moyen. Pour une scène ordinaire, c'est parfait.",
      },
      {
        kind: 'text',
        body:
          "Mais face à une scène très claire (neige, plage), l'appareil assombrit tout. Face à une scène très sombre (concert, fond noir), il éclaircit tout. Le barème « +/− » sert à le corriger.",
      },
      { kind: 'metering' },
      {
        kind: 'settings',
        title: 'Corrections courantes',
        items: [
          { label: 'Neige, plage, ciel blanc', value: '+1 à +2' },
          { label: 'Contre-jour sur un visage', value: '+1' },
          { label: 'Sujet éclairé sur fond noir', value: '−1 à −2' },
        ],
      },
      {
        kind: 'steps',
        title: 'Les modes de mesure',
        items: [
          'Matricielle (ou évaluative) : toute l’image est analysée. Le bon choix par défaut.',
          'Pondérée centrale : priorité au centre du cadre.',
          'Spot : seule une petite zone compte. Idéale pour un visage en contre-jour.',
        ],
      },
      {
        kind: 'tip',
        body:
          "Sur smartphone, touchez l'écran sur le sujet puis faites glisser le petit soleil vers le haut ou le bas : c'est la correction d'exposition.",
      },
    ],
  },
];
