import type { Sheet } from '@/content/types';

/** "How it works" lessons of the Advanced level. */
export const advanced: Sheet[] = [
  {
    id: 'histogramme',
    tier: 'avance',
    section: 'fondamentaux',
    title: 'Reading the histogram',
    summary: 'The true judge of exposure, more reliable than the screen.',
    glyph: '▁▃▅',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'The histogram is a graph: blacks on the left, mid-tones in the middle, whites on the right. The height shows how many pixels have that brightness.',
      },
      {
        kind: 'text',
        body: 'The camera screen often lies: too bright indoors, unreadable in the sun. The histogram doesn’t depend on the light around you.',
      },
      {
        kind: 'settings',
        title: 'Rules of thumb',
        items: [
          { label: 'Stuck to the right', value: 'Blown highlights', note: 'Details lost for good: compensate towards −' },
          { label: 'Stuck to the left', value: 'Crushed blacks', note: 'Compensate towards +, or accept deep shadows' },
          { label: 'Hump in the middle', value: 'Average scene', note: 'What the meter aims for' },
          { label: 'Two humps at the edges', value: 'High contrast', note: 'Backlight: you’ll have to choose' },
        ],
      },
      {
        kind: 'tip',
        body: 'There is no “good” histogram: a snow scene naturally sits to the right, a night scene to the left. What matters is not touching the edge on what you care about.',
      },
      { kind: 'related', sheets: ['mesure-lumiere', 'bracketing-hdr'], challenges: ['contre-jour'] },
    ],
  },
  {
    id: 'lumiere-naturelle',
    tier: 'avance',
    section: 'fondamentaux',
    title: 'Reading natural light',
    summary: 'Time, direction, softness: light makes the photo.',
    glyph: '☼',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The same scene changes completely with the time of day. Light is described by three qualities: its colour (warm or cool), its direction, and its hardness.',
      },
      {
        kind: 'settings',
        title: 'Times of day',
        items: [
          { label: 'Golden hour', value: 'Warm and low', note: 'The hour after sunrise and before sunset' },
          { label: 'Blue hour', value: 'Cool and soft', note: 'Just before sunrise, just after sunset' },
          { label: 'Midday', value: 'Hard and vertical', note: 'Short, black shadows' },
          { label: 'Overcast sky', value: 'Soft and even', note: 'A giant diffuser, ideal for portraits' },
        ],
      },
      {
        kind: 'steps',
        title: 'Direction',
        items: [
          'From the front: few shadows, a flat but readable image.',
          'From the side: relief, textures, volumes. The sculptor’s light.',
          'From behind (backlight): silhouettes, glowing hair. Exposure needs correcting.',
        ],
      },
      { kind: 'tip', body: 'Before shooting, look at where the shadows fall. If they get in the way, walk around the subject instead of changing settings.' },
      { kind: 'related', sheets: ['portrait', 'paysage'], challenges: ['heure-doree', 'contre-jour'] },
    ],
  },
];
