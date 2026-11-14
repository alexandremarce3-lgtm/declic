import type { Sheet } from '@/content/types';

export const fundamentals: Sheet[] = [
  {
    id: 'triangle-exposition',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'The exposure triangle',
    summary: 'Three settings, one amount of light.',
    glyph: '△',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          'A well-exposed photo means the right amount of light on the sensor. Three settings control it: the aperture (the size of the hole), the shutter speed (the duration) and ISO (the amplification).',
      },
      {
        kind: 'text',
        body:
          'They are counted in “stops”. One stop means twice as much or half as much light. If you lose a stop on one side, win it back on another: the exposure stays the same, only the look changes.',
      },
      { kind: 'simulator', focus: 'all', preset: { aperture: 2.8, shutter: 1 / 500, iso: 400 } },
      {
        kind: 'settings',
        title: 'Every setting has a price',
        items: [
          { label: 'Aperture', value: 'Depth of field', note: 'Opening up blurs the background.' },
          { label: 'Shutter speed', value: 'Motion', note: 'Slowing down creates motion blur.' },
          { label: 'ISO', value: 'Noise', note: 'Raising it adds grain.' },
        ],
      },
      {
        kind: 'tip',
        body: 'Try it in the simulator: go from f/2.8 to f/5.6 (−2 stops), then compensate with the shutter speed. The image gets its brightness back, but the ball starts to streak.',
      },
      { kind: 'related', sheets: ['ouverture', 'vitesse', 'iso'] },
    ],
  },
  {
    id: 'ouverture',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'Aperture',
    summary: 'Light… and background blur.',
    glyph: 'f/',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body:
          'Inside the lens, an iris of blades opens or closes. Aperture is written “f/” followed by a number. Classic trap: the smaller the number, the bigger the hole. f/1.8 is wide open, f/16 is nearly closed.',
      },
      { kind: 'simulator', focus: 'aperture' },
      {
        kind: 'text',
        body:
          'Aperture also decides the depth of field, the slice of the scene that looks sharp. Wide aperture: a melted background, the “bokeh”, that isolates the subject. Narrow aperture: everything is sharp, from the foreground to the horizon.',
      },
      {
        kind: 'settings',
        title: 'Rules of thumb',
        items: [
          { label: 'f/1.8 – f/2.8', value: 'Portrait, isolated subject' },
          { label: 'f/4 – f/5.6', value: 'Small group, details' },
          { label: 'f/8 – f/11', value: 'Landscape, architecture' },
        ],
      },
      {
        kind: 'tip',
        body: 'Blur doesn’t depend on aperture alone: get closer to the subject and move it away from the background to strengthen it. On a smartphone, “Portrait” mode imitates a wide aperture in software.',
      },
      { kind: 'related', sheets: ['portrait'], challenges: ['fond-flou'] },
    ],
  },
  {
    id: 'vitesse',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'Shutter speed',
    summary: 'Freeze motion, or let it flow.',
    glyph: '1/',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body:
          'Shutter speed is how long the shutter stays open. 1/1000 s freezes a drop of water. 1/15 s turns a passer-by into a streak. Several seconds smooth out water and make crowds disappear: that’s a long exposure.',
      },
      { kind: 'simulator', focus: 'shutter' },
      {
        kind: 'settings',
        title: 'Rules of thumb',
        items: [
          { label: '1/1000 s and faster', value: 'Sport, water, animals' },
          { label: '1/250 – 1/500 s', value: 'Street, children on the move' },
          { label: '1/60 s', value: 'Handheld limit' },
          { label: '1/4 s and slower', value: 'Long exposure: tripod' },
        ],
      },
      { kind: 'tip', body: 'Camera shake comes from your hands; motion blur comes from the subject. Stabilisation fixes the first, never the second.' },
      { kind: 'related', sheets: ['rue', 'nuit'], challenges: ['mouvement-fige', 'pose-longue-jour'] },
    ],
  },
  {
    id: 'iso',
    tier: 'fondamental',
    section: 'fondamentaux',
    title: 'ISO sensitivity',
    summary: 'Amplifying light, at the cost of noise.',
    glyph: 'ISO',
    minutes: 3,
    blocks: [
      {
        kind: 'text',
        body: 'ISO amplifies the sensor’s signal. Doubling ISO brightens the image by one stop, but brings out grain: digital noise, most visible in the shadows.',
      },
      { kind: 'simulator', focus: 'iso', preset: { iso: 3200, shutter: 1 / 1000 } },
      {
        kind: 'text',
        body: 'ISO is your adjustment variable: first choose the aperture and shutter speed the image needs, then raise ISO just enough.',
      },
      {
        kind: 'tip',
        label: 'Auto ISO',
        body: 'On most cameras, auto ISO with a ceiling (for example 3200) is an excellent default. A slightly noisy photo beats a blurry one.',
      },
      { kind: 'related', sheets: ['nuit'] },
    ],
  },
  {
    id: 'mesure-lumiere',
    tier: 'avance',
    section: 'fondamentaux',
    title: 'Metering and exposure compensation',
    summary: 'Why snow comes out grey, and how to avoid it.',
    glyph: '±',
    minutes: 4,
    blocks: [
      {
        kind: 'text',
        body: 'The camera’s light meter measures the light reflected by the scene, then picks settings so that it looks… mid-grey. For an ordinary scene, that’s perfect.',
      },
      {
        kind: 'text',
        body: 'But faced with a very bright scene (snow, beach), the camera darkens everything. Faced with a very dark scene (concert, black background), it brightens everything. The “+/−” scale is there to correct it.',
      },
      { kind: 'metering' },
      {
        kind: 'settings',
        title: 'Common corrections',
        items: [
          { label: 'Snow, beach, white sky', value: '+1 to +2' },
          { label: 'Backlit face', value: '+1' },
          { label: 'Lit subject on a black background', value: '−1 to −2' },
        ],
      },
      {
        kind: 'steps',
        title: 'Metering modes',
        items: [
          'Matrix (or evaluative): the whole frame is analysed. The right default.',
          'Centre-weighted: the centre of the frame matters most.',
          'Spot: only a small area counts. Ideal for a backlit face.',
        ],
      },
      { kind: 'tip', body: 'On a smartphone, tap the screen on the subject, then slide the little sun up or down: that’s exposure compensation.' },
    ],
  },
];
