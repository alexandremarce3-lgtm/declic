import type { Sheet } from '@/content/types';

export const composition: Sheet[] = [
  {
    id: 'regle-des-tiers',
    tier: 'avance',
    section: 'composition',
    title: 'Rule of thirds',
    summary: 'Off-centre the subject for a livelier image.',
    glyph: '#',
    minutes: 2,
    blocks: [
      {
        kind: 'text',
        body: 'Imagine two horizontal and two vertical lines cutting the image into nine. Place the subject on a line or an intersection rather than in the centre, and the horizon on the upper or lower third.',
      },
      {
        kind: 'text',
        body: 'Leave space in front of a subject that is looking or moving: the eye needs “room” to follow the movement.',
      },
      { kind: 'tip', body: 'Turn on the grid in your phone’s camera settings: it’s exactly this grid.' },
      { kind: 'thirds' },
      { kind: 'related', sheets: ['paysage'], challenges: ['minimalisme'] },
    ],
  },
];
