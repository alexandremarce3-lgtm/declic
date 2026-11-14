import type { Sheet } from '@/content/types';

/** Techniques du niveau Expert. */
export const expert: Sheet[] = [
  {
    id: 'hyperfocale',
    tier: 'expert',
    section: 'techniques',
    title: 'Distance hyperfocale',
    summary: 'Tout net, de quelques pas à l’infini, en un seul réglage.',
    glyph: '∞',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Si vous faites la mise au point à la distance hyperfocale, tout est net de la moitié de cette distance jusqu'à l'infini. C'est la profondeur de champ maximale possible pour une focale et une ouverture données.",
      },
      {
        kind: 'settings',
        title: 'Repères (capteur 24 × 36)',
        items: [
          { label: '16 mm à f/8', value: '≈ 1,1 m', note: 'Net de 0,55 m à l’infini' },
          { label: '24 mm à f/8', value: '≈ 2,4 m', note: 'Net de 1,2 m à l’infini' },
          { label: '35 mm à f/11', value: '≈ 3,7 m', note: 'Net de 1,9 m à l’infini' },
        ],
      },
      {
        kind: 'text',
        body:
          "Formule : H ≈ focale² ÷ (ouverture × 0,03 mm). Plus la focale est courte et l'ouverture petite, plus l'hyperfocale est proche.",
      },
      {
        kind: 'tip',
        label: 'Zone focusing',
        body:
          "En photo de rue, réglez la mise au point en manuel à 3 m et fermez à f/8 avec un 28 ou 35 mm : tout ce qui passe entre 2 et 5 m environ sera net, sans attendre l'autofocus.",
      },
      { kind: 'related', sheets: ['paysage', 'rue'], challenges: ['zone-focusing'] },
    ],
  },
  {
    id: 'filtres-nd',
    tier: 'expert',
    section: 'techniques',
    title: 'Pose longue au filtre ND',
    summary: 'Ralentir le temps en plein jour.',
    glyph: '◧',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Un filtre ND (densité neutre) est un verre gris qui retire de la lumière sans changer les couleurs. Il permet des vitesses lentes en plein soleil : eau en voile, nuages qui filent, foule qui disparaît.",
      },
      {
        kind: 'settings',
        title: 'Densités courantes',
        items: [
          { label: 'ND8', value: '3 stops', note: '1/125 s devient 1/15 s' },
          { label: 'ND64', value: '6 stops', note: '1/125 s devient 1/2 s' },
          { label: 'ND1000', value: '10 stops', note: '1/125 s devient environ 8 s' },
        ],
      },
      {
        kind: 'steps',
        title: 'La méthode',
        ordered: true,
        items: [
          'Trépied, cadrage et mise au point sans le filtre.',
          'Passez la mise au point en manuel pour qu’elle ne bouge plus.',
          'Notez la vitesse correcte, puis vissez le filtre.',
          'Multipliez la durée : ×2 par stop (×1000 environ pour un ND1000).',
          'Mode M ou pose B, retardateur, et masquez le viseur d’un reflex.',
        ],
      },
      { kind: 'related', sheets: ['vitesse'], challenges: ['cascade-nd', 'light-painting'] },
    ],
  },
  {
    id: 'flash-appoint',
    tier: 'expert',
    section: 'techniques',
    title: 'Flash d’appoint',
    summary: 'Déboucher les ombres sans que ça se voie.',
    glyph: 'ϟ',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          "Le flash ne sert pas qu'à la nuit. En plein jour, un petit éclair « débouche » un visage à contre-jour ou sous une casquette, tout en gardant la lumière naturelle.",
      },
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Correction flash', value: '−1 à −2', note: 'L’effet doit rester discret' },
          { label: 'Vitesse', value: '≤ vitesse de synchro', note: 'Souvent 1/200 – 1/250 s' },
          { label: 'Au-delà', value: 'Mode HSS', note: 'Synchro haute vitesse, si le flash le permet' },
          { label: 'En intérieur', value: 'Flash orienté au plafond', note: 'Lumière rebondie, bien plus douce' },
        ],
      },
      {
        kind: 'tip',
        body: "La vitesse règle la lumière ambiante, la puissance du flash règle le sujet : deux expositions en une seule image.",
      },
      { kind: 'related', sheets: ['portrait', 'lumiere-naturelle'], challenges: ['flash-plein-jour'] },
    ],
  },
  {
    id: 'bracketing-hdr',
    tier: 'expert',
    section: 'techniques',
    title: 'Bracketing et HDR',
    summary: 'Quand la scène dépasse ce que voit le capteur.',
    glyph: '⧉',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body:
          "Un intérieur avec une fenêtre en plein soleil : impossible d'exposer à la fois la pièce et l'extérieur. Le bracketing prend plusieurs vues à des expositions différentes, que l'on fusionne ensuite (HDR).",
      },
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Série', value: '3 vues : −2 / 0 / +2' },
          { label: 'Mode', value: 'A / Av', note: 'L’ouverture reste fixe, seule la vitesse change' },
          { label: 'Support', value: 'Trépied', note: 'Les vues doivent se superposer' },
          { label: 'Déclenchement', value: 'Rafale ou retardateur' },
        ],
      },
      {
        kind: 'tip',
        label: 'Smartphone',
        body: "Le mode HDR automatique fait exactement cela en une fraction de seconde. Gardez le téléphone immobile pendant la prise.",
      },
      { kind: 'related', sheets: ['histogramme'], challenges: ['hdr-fenetre'] },
    ],
  },
  {
    id: 'mise-au-point-avancee',
    tier: 'expert',
    section: 'techniques',
    title: 'Maîtriser l’autofocus',
    summary: 'Modes, zones et suivi : ne plus rater la netteté.',
    glyph: '⌖',
    minutes: 4,
    blocks: [
      {
        kind: 'settings',
        title: 'Les modes',
        items: [
          { label: 'AF-S / One Shot', value: 'Sujet immobile', note: 'Le point se fige à mi-course' },
          { label: 'AF-C / AI Servo', value: 'Sujet en mouvement', note: 'Le point suit en continu' },
          { label: 'MF + focus peaking', value: 'Macro, nuit, vidéo', note: 'Les zones nettes sont surlignées' },
        ],
      },
      {
        kind: 'text',
        body:
          "Le piège du « point puis recadrage » : à f/1.8, faire le point au centre puis décaler le cadre déplace la zone nette de quelques centimètres. Choisissez plutôt le collimateur sur l'œil.",
      },
      {
        kind: 'tip',
        label: 'Déclenchement arrière',
        body:
          "Confiez l'autofocus à un bouton à l'arrière (AF-ON) et le déclencheur à la seule prise de vue. Vous gardez le point aussi longtemps que vous voulez, sans changer de mode.",
      },
      { kind: 'related', sheets: ['portrait', 'rue'], challenges: ['file-panoramique'] },
    ],
  },
];
