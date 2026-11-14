import type { Sheet } from '@/content/types';

/** "Presence and posing" lessons: written for models (and useful to photographers who direct them). */
export const presence: Sheet[] = [
  {
    id: 'poser-sans-se-figer',
    tier: 'fondamental',
    section: 'presence',
    title: 'Posing without freezing',
    summary: 'A good pose is a movement stopped at the right moment.',
    glyph: '〰',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'A good pose isn’t a statue: it’s a movement stopped at the right moment.' },
      { kind: 'analogy', icon: '🌊', body: 'Think of a wave: it’s always moving, and each photo catches a different instant of it.' },
      {
        kind: 'steps',
        title: 'What I do',
        ordered: true,
        items: [
          'I breathe. I breathe out gently just before the click: the face relaxes.',
          'I move a tiny bit between each photo: the head, a hand, the gaze.',
          'I put my weight on one leg: the body takes a nice curve.',
          'I turn my shoulders slightly: square to the lens, you look wider and stiffer.',
          'I keep my hands busy: a pocket, a sleeve, my hair, an object.',
        ],
      },
      { kind: 'tip', label: 'Good reflex', body: 'If I feel stiff, I shake out my arms, breathe out, and we start again. It happens to everyone.' },
    ],
  },
  {
    id: 'regard-et-mains',
    tier: 'fondamental',
    section: 'presence',
    title: 'Eyes and hands',
    summary: 'The two details that change everything.',
    glyph: '◉',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'Eyes tell the story, hands give you away: they’re what people notice first.' },
      {
        kind: 'steps',
        title: 'The eyes',
        items: [
          'I look “through” the lens, as if someone were standing behind it.',
          'I very slightly narrow my lower eyelids: the gaze becomes more intense, less surprised.',
          'I push my chin forward a little and lower it slightly: the jawline appears.',
          'Looking out of frame: I pick a precise point in the distance, I don’t stare into space.',
        ],
      },
      {
        kind: 'steps',
        title: 'The hands',
        items: [
          'I touch, I don’t grab: fingers rest like a feather.',
          'I show the edge of the hand rather than a flat palm or back.',
          'I keep a little space between my arm and my body: the silhouette breathes.',
        ],
      },
      { kind: 'tip', label: 'Practice', body: 'In front of a mirror or with the front camera: 5 minutes a day is enough to find your best angles.' },
    ],
  },
  {
    id: 'communiquer-seance',
    tier: 'fondamental',
    section: 'presence',
    title: 'Communicating during the shoot',
    summary: 'Say it, show it, and know how to say stop.',
    glyph: '💬',
    minutes: 3,
    blocks: [
      { kind: 'oneLiner', body: 'A great shoot is a conversation: before, during and after.' },
      {
        kind: 'steps',
        title: 'Before',
        items: ['We share a moodboard so we’re talking about the same result.', 'We write the limits down in an agreement (Quick Agreement).', 'I tell someone close where and when the shoot takes place.'],
      },
      {
        kind: 'steps',
        title: 'During',
        items: [
          'We agree on a “stop” word or gesture: it stops everything, no discussion.',
          'I ask to see a few photos on the screen: it helps adjust the pose.',
          'I say straight away if a pose, an outfit or a request makes me uncomfortable.',
          'We take breaks: water, warmth, music.',
        ],
      },
      {
        kind: 'steps',
        title: 'Body language',
        items: [
          'Crossed arms, raised shoulders, a frozen smile: often a sign of discomfort. We talk about it.',
          'A respectful photographer asks before touching, and prefers to show the gesture themselves.',
        ],
      },
      { kind: 'tip', label: 'After', body: 'We agree on the choice of photos and the delivery deadline set in the agreement.' },
      { kind: 'related', sheets: ['poser-sans-se-figer', 'regard-et-mains'] },
    ],
  },
];
