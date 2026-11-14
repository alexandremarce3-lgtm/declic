/** Photo SOS: quick diagnosis (same ids as the French version). */

import type { Problem } from '@/content/types';

export const problems: Problem[] = [
  {
    id: 'floue',
    title: 'My photo is blurry',
    short: 'blurry',
    symptom: 'Nothing is really sharp, or not where it should be.',
    glyph: '≋',
    question: 'Look at the image full size. What is blurry?',
    causes: [
      {
        id: 'bouge',
        label: 'Everything is blurry',
        title: 'Camera shake',
        recognize:
          'The whole image is blurry, with doubled edges or streaks in the same direction. The shutter speed was too slow for your hands, or for a moving subject.',
        fixes: [
          'Raise the shutter speed: 1/125 s minimum handheld, 1/500 s for a moving subject.',
          'Not enough light? Open the aperture or raise ISO to compensate.',
          'Brace yourself: elbows in, lean on a wall, or use a tripod.',
          'Press the shutter gently, or use the 2 s self-timer.',
        ],
        quick: '1/125 s min · auto ISO',
        smartphone: 'Hold the phone with both hands and turn on Night mode in low light.',
        sheetId: 'vitesse',
      },
      {
        id: 'mise-au-point',
        label: 'The background is sharp, not the subject',
        title: 'Missed focus',
        recognize:
          'Part of the image is sharp (the background, an object nearby), but not your subject. The focus point, the little focusing square, was in the wrong place.',
        fixes: [
          'Put the focus point exactly on the subject, on the eye for a portrait.',
          'Half-press the shutter, wait for confirmation, then take the shot.',
          'Subject too close? Step back: every lens has a minimum distance.',
          'For a moving subject, switch to continuous autofocus (AF-C).',
        ],
        quick: 'Focus point on the subject',
        smartphone: 'Tap the subject on the screen before taking the photo.',
        sheetId: 'portrait',
      },
    ],
  },
  {
    id: 'sombre',
    title: 'My photo is too dark',
    short: 'too dark',
    symptom: 'Black image, crushed shadows with no detail.',
    glyph: '◐',
    causes: [
      {
        id: 'sous-exposition',
        label: 'Underexposed',
        title: 'Underexposure',
        recognize: 'Not enough light reached the sensor. Common with a very bright scene (snow, sky) that the camera tried to bring back to grey.',
        fixes: [
          'Open the aperture: a smaller f-number.',
          'Lower the shutter speed, without going below 1/60 s handheld.',
          'Raise ISO as a last resort.',
          'In auto or A / S mode, use exposure compensation towards +.',
        ],
        quick: 'Compensation +1 · smaller f-number',
        smartphone: 'Tap the subject, then slide the little sun up.',
        sheetId: 'mesure-lumiere',
      },
    ],
  },
  {
    id: 'claire',
    title: 'My photo is too bright',
    short: 'too bright',
    symptom: 'White sky with no detail, “blown-out” areas.',
    glyph: '☀',
    causes: [
      {
        id: 'surexposition',
        label: 'Overexposed',
        title: 'Overexposure',
        recognize: 'Too much light: bright areas turn pure white and their details are lost for good. Common with a dark subject or in full sun.',
        fixes: ['Close the aperture: a bigger f-number.', 'Raise the shutter speed.', 'Lower ISO to the minimum (100).', 'Use exposure compensation towards −.'],
        quick: 'ISO 100 · compensation −1',
        smartphone: 'Tap the brightest area, then slide the little sun down.',
        sheetId: 'mesure-lumiere',
      },
    ],
  },
  {
    id: 'bruitee',
    title: 'My photo is grainy',
    short: 'grainy',
    symptom: '“Snow” effect or coloured grain, especially in the shadows.',
    glyph: '⁘',
    causes: [
      {
        id: 'bruit',
        label: 'Noisy',
        title: 'Digital noise',
        recognize: 'ISO was too high: the sensor amplified the signal… and the noise with it. Grain is most visible in dark areas.',
        fixes: [
          'Lower ISO as far as possible.',
          'Compensate by opening the aperture or slowing down (on a support or tripod).',
          'Look for natural light: near a window, outdoors.',
          'Expose well when shooting: brightening a dark photo afterwards brings out the grain.',
        ],
        quick: 'Minimum ISO · more light',
        smartphone: 'Avoid digital zoom and move closer to a window.',
        sheetId: 'iso',
      },
    ],
  },
];
