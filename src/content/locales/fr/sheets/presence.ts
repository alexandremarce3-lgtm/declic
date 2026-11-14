import type { Sheet } from '@/content/types';

/**
 * Fiches « Présence et pose » : pensées pour les modèles (et utiles aux photographes qui dirigent).
 * Écrites directement en langage simple. Exclues de la règle « toutes les fiches fondamentales lues ».
 */
export const presence: Sheet[] = [
  {
    id: 'poser-sans-se-figer',
    tier: 'fondamental',
    section: 'presence',
    title: 'Poser sans se figer',
    summary: 'Une bonne pose est un mouvement arrêté au bon moment.',
    glyph: '〰',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'Une bonne pose, ce n’est pas une statue : c’est un mouvement qu’on arrête au bon moment.' },
      { kind: 'analogy', icon: '🌊', body: 'Pensez à une vague : elle bouge tout le temps, et chaque photo en attrape un instant différent.' },
      {
        kind: 'steps',
        title: 'Ce que je fais',
        ordered: true,
        items: [
          'Je respire. J’expire doucement juste avant le déclic : le visage se détend.',
          'Je bouge un tout petit peu entre chaque photo : la tête, une main, le regard.',
          'Je mets mon poids sur une jambe : le corps prend une jolie courbe.',
          'Je tourne légèrement les épaules : face à l’objectif, on paraît plus large et figé.',
          'J’occupe mes mains : une poche, une manche, les cheveux, un objet.',
        ],
      },
      { kind: 'tip', label: 'Le bon réflexe', body: 'Si je me sens raide, je secoue les bras, je souffle, et on reprend. Ça arrive à tout le monde.' },
    ],
  },
  {
    id: 'regard-et-mains',
    tier: 'fondamental',
    section: 'presence',
    title: 'Le regard et les mains',
    summary: 'Les deux détails qui changent tout.',
    glyph: '◉',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'Le regard raconte, les mains trahissent : ce sont eux qu’on remarque en premier.' },
      {
        kind: 'steps',
        title: 'Le regard',
        items: [
          'Je regarde « à travers » l’objectif, comme si quelqu’un se tenait derrière.',
          'Je plisse très légèrement les paupières du bas : le regard devient plus intense, moins surpris.',
          'J’avance un peu le menton et je le baisse à peine : la mâchoire se dessine.',
          'Regard hors cadre : je choisis un point précis au loin, je ne le fixe pas dans le vide.',
        ],
      },
      {
        kind: 'steps',
        title: 'Les mains',
        items: [
          'Je touche, je n’attrape pas : les doigts se posent comme une plume.',
          'Je montre la tranche de la main plutôt que la paume ou le dos à plat.',
          'Je garde un peu d’espace entre le bras et le corps : la silhouette respire.',
        ],
      },
      { kind: 'tip', label: 'Pour s’entraîner', body: 'Devant un miroir ou avec la caméra frontale : 5 minutes par jour suffisent pour trouver vos meilleurs angles.' },
    ],
  },
  {
    id: 'communiquer-seance',
    tier: 'fondamental',
    section: 'presence',
    title: 'Communiquer pendant la séance',
    summary: 'Dire, montrer, et savoir dire stop.',
    glyph: '💬',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'Une belle séance, c’est une conversation : avant, pendant et après.' },
      {
        kind: 'steps',
        title: 'Avant',
        items: ['On partage un moodboard pour parler du même résultat.', 'On écrit les limites dans un accord (Contrat-Minute).', 'Je dis à un proche où et quand a lieu la séance.'],
      },
      {
        kind: 'steps',
        title: 'Pendant',
        items: [
          'On choisit un mot ou un geste « stop » : il arrête tout, sans discussion.',
          'Je demande à voir quelques photos à l’écran : ça aide à ajuster la pose.',
          'Je dis tout de suite si une pose, une tenue ou une demande me met mal à l’aise.',
          'On fait des pauses : eau, chaleur, musique.',
        ],
      },
      {
        kind: 'steps',
        title: 'Le langage du corps',
        items: [
          'Bras croisés, épaules remontées, sourire figé : souvent le signe d’un inconfort. On en parle.',
          'Un photographe respectueux demande avant de toucher, et préfère montrer le geste lui-même.',
        ],
      },
      { kind: 'tip', label: 'Après', body: 'On se met d’accord sur le choix des photos et le délai de livraison prévu dans l’accord.' },
      { kind: 'related', sheets: ['poser-sans-se-figer', 'regard-et-mains'] },
    ],
  },
];
