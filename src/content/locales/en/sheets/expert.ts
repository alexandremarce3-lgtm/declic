import type { Sheet } from '@/content/types';

/** Expert-level techniques. */
export const expert: Sheet[] = [
  {
    id: 'hyperfocale',
    tier: 'expert',
    section: 'techniques',
    title: 'Hyperfocal distance',
    summary: 'Sharp from a few steps to infinity, in a single setting.',
    glyph: '∞',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'If you focus at the hyperfocal distance, everything is sharp from half that distance to infinity. It is the maximum depth of field possible for a given focal length and aperture.',
      },
      {
        kind: 'settings',
        title: 'Rules of thumb (full frame)',
        items: [
          { label: '16 mm at f/8', value: '≈ 1.1 m', note: 'Sharp from 0.55 m to infinity' },
          { label: '24 mm at f/8', value: '≈ 2.4 m', note: 'Sharp from 1.2 m to infinity' },
          { label: '35 mm at f/11', value: '≈ 3.7 m', note: 'Sharp from 1.9 m to infinity' },
        ],
      },
      {
        kind: 'text',
        body: 'Formula: H ≈ focal length² ÷ (aperture × 0.03 mm). The shorter the focal length and the smaller the aperture, the closer the hyperfocal distance.',
      },
      {
        kind: 'tip',
        label: 'Zone focusing',
        body: 'In street photography, set manual focus to 3 m and close down to f/8 with a 28 or 35 mm lens: anything passing between about 2 and 5 m will be sharp, without waiting for autofocus.',
      },
      { kind: 'related', sheets: ['paysage', 'rue'], challenges: ['zone-focusing'] },
    ],
  },
  {
    id: 'filtres-nd',
    tier: 'expert',
    section: 'techniques',
    title: 'Long exposure with an ND filter',
    summary: 'Slowing down time in broad daylight.',
    glyph: '◧',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'An ND (neutral density) filter is a grey glass that removes light without changing colours. It allows slow shutter speeds in full sun: water like a veil, racing clouds, a crowd that disappears.',
      },
      {
        kind: 'settings',
        title: 'Common densities',
        items: [
          { label: 'ND8', value: '3 stops', note: '1/125 s becomes 1/15 s' },
          { label: 'ND64', value: '6 stops', note: '1/125 s becomes 1/2 s' },
          { label: 'ND1000', value: '10 stops', note: '1/125 s becomes about 8 s' },
        ],
      },
      {
        kind: 'steps',
        title: 'The method',
        ordered: true,
        items: [
          'Tripod, framing and focus without the filter.',
          'Switch focus to manual so it doesn’t move.',
          'Note the correct shutter speed, then screw on the filter.',
          'Multiply the duration: ×2 per stop (about ×1000 for an ND1000).',
          'M mode or bulb, self-timer, and cover the viewfinder of a DSLR.',
        ],
      },
      { kind: 'related', sheets: ['vitesse'], challenges: ['cascade-nd', 'light-painting'] },
    ],
  },
  {
    id: 'flash-appoint',
    tier: 'expert',
    section: 'techniques',
    title: 'Fill flash',
    summary: 'Opening up shadows without it showing.',
    glyph: 'ϟ',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'Flash isn’t only for night. In daylight, a small burst lifts a backlit face or one under a cap, while keeping the natural light.',
      },
      {
        kind: 'settings',
        title: 'Starting settings',
        items: [
          { label: 'Flash compensation', value: '−1 to −2', note: 'The effect must stay subtle' },
          { label: 'Shutter speed', value: '≤ sync speed', note: 'Often 1/200 – 1/250 s' },
          { label: 'Beyond that', value: 'HSS mode', note: 'High-speed sync, if the flash supports it' },
          { label: 'Indoors', value: 'Flash pointed at the ceiling', note: 'Bounced light, much softer' },
        ],
      },
      { kind: 'tip', body: 'Shutter speed controls the ambient light, flash power controls the subject: two exposures in one image.' },
      { kind: 'related', sheets: ['portrait', 'lumiere-naturelle'], challenges: ['flash-plein-jour'] },
    ],
  },
  {
    id: 'bracketing-hdr',
    tier: 'expert',
    section: 'techniques',
    title: 'Bracketing and HDR',
    summary: 'When the scene exceeds what the sensor can see.',
    glyph: '⧉',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'A room with a window in full sun: impossible to expose both the room and the outside. Bracketing takes several shots at different exposures, which are then merged (HDR).',
      },
      {
        kind: 'settings',
        title: 'Starting settings',
        items: [
          { label: 'Series', value: '3 shots: −2 / 0 / +2' },
          { label: 'Mode', value: 'A / Av', note: 'Aperture stays fixed, only the shutter speed changes' },
          { label: 'Support', value: 'Tripod', note: 'The shots must line up' },
          { label: 'Release', value: 'Burst or self-timer' },
        ],
      },
      { kind: 'tip', label: 'Smartphone', body: 'Automatic HDR mode does exactly this in a fraction of a second. Keep the phone still while it shoots.' },
      { kind: 'related', sheets: ['histogramme'], challenges: ['hdr-fenetre'] },
    ],
  },
  {
    id: 'mise-au-point-avancee',
    tier: 'expert',
    section: 'techniques',
    title: 'Mastering autofocus',
    summary: 'Modes, areas and tracking: never miss focus again.',
    glyph: '⌖',
    minutes: 4,
    blocks: [
      {
        kind: 'settings',
        title: 'The modes',
        items: [
          { label: 'AF-S / One Shot', value: 'Still subject', note: 'Focus locks at half-press' },
          { label: 'AF-C / AI Servo', value: 'Moving subject', note: 'Focus follows continuously' },
          { label: 'MF + focus peaking', value: 'Macro, night, video', note: 'Sharp areas are highlighted' },
        ],
      },
      {
        kind: 'text',
        body: 'The “focus and recompose” trap: at f/1.8, focusing in the centre then shifting the frame moves the sharp zone by a few centimetres. Choose the focus point on the eye instead.',
      },
      {
        kind: 'tip',
        label: 'Back-button focus',
        body: 'Assign autofocus to a button on the back (AF-ON) and leave the shutter button for taking the picture only. You keep focus as long as you like, without changing modes.',
      },
      { kind: 'related', sheets: ['portrait', 'rue'], challenges: ['file-panoramique'] },
    ],
  },
];
