import type { Sheet } from '@/content/types';

export const situations: Sheet[] = [
  {
    id: 'portrait',
    tier: 'avance',
    section: 'situations',
    title: 'Portrait en extérieur',
    summary: 'Un visage net, un fond qui s’efface.',
    glyph: '◉',
    minutes: 3,
    keySettings: 'A/Av · f/2.8 · œil',
    blocks: [
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Mode', value: 'Priorité ouverture (A / Av)' },
          { label: 'Ouverture', value: 'f/2.8', note: 'f/1.8 – f/4 selon l’objectif' },
          { label: 'Vitesse', value: '1/250 s mini', note: 'Surveillez-la, l’appareil la choisit' },
          { label: 'ISO', value: 'Auto, 100 – 800' },
          { label: 'Mise au point', value: 'Sur l’œil le plus proche', note: 'AF œil si disponible' },
        ],
      },
      { kind: 'simulator', focus: 'aperture', preset: { aperture: 2.8, shutter: 1 / 500, iso: 400 } },
      {
        kind: 'steps',
        title: 'Sur le terrain',
        ordered: true,
        items: [
          'Placez la personne à l’ombre, ou dos au soleil en fin de journée.',
          'Éloignez-la du fond : plusieurs mètres, c’est l’idéal.',
          'Cadrez à hauteur des yeux, puis faites la mise au point sur l’œil.',
          'Déclenchez en rafale courte pour saisir une expression naturelle.',
        ],
      },
      {
        kind: 'tip',
        label: 'À éviter',
        body: 'Le soleil de midi en plein visage : ombres dures et yeux plissés.',
      },
      { kind: 'related', sheets: ['ouverture'], challenges: ['fond-flou'] },
    ],
  },
  {
    id: 'rue',
    tier: 'avance',
    section: 'situations',
    title: 'Photographie de rue',
    summary: 'Saisir l’instant, sans se faire remarquer.',
    glyph: '⌁',
    minutes: 3,
    keySettings: 'S/Tv · 1/500 s · ISO auto',
    blocks: [
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Mode', value: 'Priorité vitesse (S / Tv)' },
          { label: 'Vitesse', value: '1/500 s minimum', note: 'Les passants bougent vite' },
          { label: 'ISO', value: 'Auto', note: 'Plafond conseillé : 3200 – 6400' },
          { label: 'Mise au point', value: 'Continue (AF-C)' },
        ],
      },
      { kind: 'simulator', focus: 'shutter', preset: { shutter: 1 / 500, iso: 800, aperture: 4 } },
      {
        kind: 'steps',
        title: 'Sur le terrain',
        items: [
          'Un petit appareil ou un smartphone attire moins l’attention.',
          'Trouvez un beau décor (lumière, mur, ombre) et attendez qu’un passant y entre.',
          'Restez au même endroit : les gens finissent par vous oublier.',
        ],
      },
      {
        kind: 'tip',
        label: 'Droit à l’image',
        body:
          'Photographier dans la rue est permis, mais publier le portrait reconnaissable d’une personne demande en principe son accord. En cas de doute, demandez, ou montrez la photo.',
      },
      { kind: 'related', sheets: ['vitesse'], challenges: ['mouvement-fige'] },
    ],
  },
  {
    id: 'paysage',
    tier: 'avance',
    section: 'situations',
    title: 'Paysage',
    summary: 'Net de près comme de loin.',
    glyph: '⛰',
    minutes: 3,
    keySettings: 'Trépied · f/8 – f/11',
    blocks: [
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Mode', value: 'Priorité ouverture (A / Av)' },
          { label: 'Ouverture', value: 'f/8 – f/11', note: 'Le meilleur piqué de la plupart des objectifs' },
          { label: 'ISO', value: '100' },
          { label: 'Support', value: 'Trépied', note: 'La vitesse peut alors descendre sans risque' },
          { label: 'Mise au point', value: 'Au premier tiers de la scène' },
        ],
      },
      { kind: 'simulator', focus: 'aperture', preset: { aperture: 11, iso: 100, shutter: 1 / 8 } },
      {
        kind: 'steps',
        title: 'Composer',
        items: [
          'Cherchez un avant-plan (rocher, fleur, chemin) : il donne de la profondeur.',
          'Placez l’horizon sur un tiers, et gardez-le droit.',
          'Sortez tôt le matin ou en fin de journée : la lumière rasante sculpte le relief.',
        ],
      },
      {
        kind: 'tip',
        body: 'Au-delà de f/16, l’image perd un peu de netteté (la diffraction). Restez vers f/8 – f/11.',
      },
      { kind: 'related', sheets: ['regle-des-tiers'], challenges: ['minimalisme', 'tout-net'] },
    ],
  },
  {
    id: 'nuit',
    tier: 'avance',
    section: 'situations',
    title: 'Basse lumière et nuit',
    summary: 'Poser longtemps, sans bouger d’un millimètre.',
    glyph: '☾',
    minutes: 4,
    keySettings: 'M · trépied · retardateur 2 s',
    blocks: [
      {
        kind: 'settings',
        title: 'Réglages de départ',
        items: [
          { label: 'Mode', value: 'Manuel (M)' },
          { label: 'Ouverture', value: 'f/8', note: 'Les lampadaires deviennent des étoiles' },
          { label: 'ISO', value: '100 – 400', note: 'Sur trépied, inutile de monter' },
          { label: 'Vitesse', value: '2 à 30 s', note: 'Ajustez avec le barème d’exposition' },
          { label: 'Déclenchement', value: 'Retardateur 2 s', note: 'Évite de faire bouger l’appareil' },
          { label: 'Mise au point', value: 'Manuelle', note: 'L’autofocus peine dans le noir' },
        ],
      },
      { kind: 'simulator', focus: 'all', light: -3, preset: { aperture: 8, shutter: 1 / 2, iso: 100 } },
      {
        kind: 'steps',
        title: 'Sur le terrain',
        ordered: true,
        items: [
          'Installez le trépied et coupez la stabilisation.',
          'Faites la mise au point en zoomant sur une lumière à l’écran.',
          'Déclenchez au retardateur, vérifiez l’écran, ajustez la vitesse.',
        ],
      },
      {
        kind: 'tip',
        label: 'Smartphone',
        body: 'Le mode « Nuit » combine plusieurs images. Calez le téléphone contre un mur ou un banc pendant la prise.',
      },
      { kind: 'related', sheets: ['iso', 'vitesse'], challenges: ['nuit-sans-flash'] },
    ],
  },
];
