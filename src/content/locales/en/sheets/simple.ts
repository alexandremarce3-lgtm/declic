import type { Block } from '@/content/types';

/** "Simple" versions of beginner lessons: everyday words and illustrated before/after examples. */
export const simpleVersions: Record<string, Block[]> = {
  'triangle-exposition': [
    { kind: 'oneLiner', body: 'A photo is made of light. Three settings decide how much gets in.' },
    {
      kind: 'analogy',
      icon: '🚰',
      body: 'Imagine filling a glass of water. You can open the tap wider, let it run longer, or use a smaller glass. Same result: a full glass.',
    },
    {
      kind: 'compare',
      title: 'Too little, just right, too much',
      items: [
        { scene: 'exposure-dark', label: 'Too dark', caption: 'Not enough light. You can barely see anything.' },
        { scene: 'exposure-good', label: 'Just right', caption: 'The right amount. You see everything, colours look great.' },
        { scene: 'exposure-bright', label: 'Too bright', caption: 'Too much light. The sky is all white, colours are gone.' },
      ],
    },
    {
      kind: 'steps',
      title: 'The three settings',
      items: ['Aperture: the size of the hole that lets light in.', 'Shutter speed: how long the hole stays open.', 'ISO: how much the camera “turns up the volume” of the light.'],
    },
    { kind: 'tip', label: 'What I do', body: 'Photo too dark? I change ONE setting at a time and watch what happens. Each of the next lessons explains one setting.' },
    { kind: 'tip', label: 'On my phone', body: 'It does it all by itself. But if I tap the screen and slide the little sun, I decide whether the photo is brighter or darker.' },
  ],

  ouverture: [
    { kind: 'oneLiner', body: 'Aperture is the size of the hole that light comes through. It also decides whether the background is blurry.' },
    { kind: 'analogy', icon: '👁️', body: 'It’s like the pupil of your eye: in the dark, it opens wider to catch more light.' },
    {
      kind: 'compare',
      title: 'Same person, two settings',
      items: [
        { scene: 'portrait-bokeh', label: 'Big hole', caption: 'The background melts into blur. The person stands out.' },
        { scene: 'portrait-sharp', label: 'Small hole', caption: 'Everything is sharp: the person, the trees, the house.' },
      ],
    },
    { kind: 'tip', label: 'The trap', body: 'Aperture is written with a number, like f/2 or f/16. And it’s backwards: small number = big hole = blurry background.' },
    { kind: 'tip', label: 'What I do', body: 'For a portrait: the smallest number possible. For a landscape: around f/8.' },
    { kind: 'tip', label: 'On my phone', body: '“Portrait” mode blurs the background for me.' },
  ],

  vitesse: [
    { kind: 'oneLiner', body: 'Shutter speed is how long the camera looks at the scene.' },
    { kind: 'analogy', icon: '😉', body: 'Like a blink: very quick, you see a frozen instant. Eyes open for a long time, anything moving leaves a trail.' },
    {
      kind: 'compare',
      title: 'A child running',
      items: [
        { scene: 'runner-frozen', label: 'Fast', caption: 'The child is sharp, frozen mid-jump.' },
        { scene: 'runner-blur', label: 'Slow', caption: 'The child leaves a blurry trail behind.' },
      ],
    },
    {
      kind: 'compare',
      title: 'A fountain',
      items: [
        { scene: 'water-frozen', label: 'Fast', caption: 'You can see every drop of water.' },
        { scene: 'water-silky', label: 'Slow', caption: 'The water becomes a soft veil.' },
      ],
    },
    { kind: 'tip', label: 'What I do', body: 'Something moving? I choose a fast speed. I want a motion effect? I rest the camera on something and choose slow.' },
    { kind: 'tip', label: 'On my phone', body: 'I hold the phone with both hands and stay still while taking the photo.' },
  ],

  iso: [
    { kind: 'oneLiner', body: 'ISO brightens the photo when it’s dark. But the higher it goes, the more grain you get.' },
    { kind: 'analogy', icon: '📻', body: 'Like the volume on an old radio: turn it up and you hear better… but it crackles too.' },
    {
      kind: 'compare',
      title: 'The same street at night',
      items: [
        { scene: 'night-clean', label: 'Low ISO', caption: 'Clean, smooth image. But it needs lots of light, or a camera resting on something.' },
        { scene: 'night-grainy', label: 'High ISO', caption: 'You can see in the dark, but the image is full of little dots: “grain”.' },
      ],
    },
    { kind: 'tip', label: 'What I do', body: 'In daylight: the lowest ISO (100). When it gets dark: I raise it bit by bit. A little grain beats a blurry photo.' },
    { kind: 'tip', label: 'On my phone', body: 'It raises ISO by itself at night. For less grain, I move closer to a light.' },
  ],

  // ——— Advanced level ———

  'mesure-lumiere': [
    { kind: 'oneLiner', body: 'The camera wants everything to be “average”. In front of something very bright or very dark, it gets it wrong.' },
    {
      kind: 'analogy',
      icon: '🎚️',
      body: 'It’s a friend who always sets the volume “in the middle”. Too loud for a lullaby, too quiet for a concert. Sometimes you have to tell them: more, or less.',
    },
    {
      kind: 'compare',
      title: 'A snowy landscape',
      items: [
        { scene: 'snow-grey', label: 'What the camera does', caption: 'The snow turns grey and dull. It tried to make it “average”.' },
        { scene: 'snow-white', label: 'After a + correction', caption: 'The snow is white again, just like in real life.' },
      ],
    },
    {
      kind: 'steps',
      title: 'The rule to remember',
      items: ['Lots of white (snow, beach): I correct towards +.', 'Lots of black (concert, night): I correct towards −.', 'The rest of the time: I don’t touch anything.'],
    },
    { kind: 'tip', label: 'On my phone', body: 'I tap the screen, then slide the little sun up (+) or down (−).' },
  ],

  histogramme: [
    { kind: 'oneLiner', body: 'The histogram is a little mountain that tells you if the photo is too dark or too bright.' },
    { kind: 'analogy', icon: '⛰️', body: 'Black is on the left, white on the right. The mountain shows where most of your photo’s dots are.' },
    {
      kind: 'compare',
      title: 'Three mountains, three photos',
      items: [
        { scene: 'histogram-left', label: 'Stuck to the left', caption: 'Too dark: areas that are all black, with no detail.' },
        { scene: 'histogram-center', label: 'In the middle', caption: 'Balanced: neither too black nor too white.' },
        { scene: 'histogram-right', label: 'Stuck to the right', caption: 'Too bright: areas that are all white, lost.' },
      ],
    },
    { kind: 'tip', label: 'What I do', body: 'If the mountain touches the right edge, I correct towards −. The left edge, towards +.' },
    { kind: 'tip', label: 'Why it helps', body: 'In bright sun the screen is hard to read. The mountain never lies.' },
  ],

  'lumiere-naturelle': [
    { kind: 'oneLiner', body: 'The same thing, photographed at another time of day, gives a completely different photo.' },
    {
      kind: 'compare',
      title: 'The same tree, three lights',
      items: [
        { scene: 'light-noon', label: 'At midday', caption: 'Hard light, a small very black shadow. Not flattering.' },
        { scene: 'light-golden', label: 'Late in the day', caption: 'Golden light, long shadows: the “golden hour”.' },
        { scene: 'light-overcast', label: 'Cloudy sky', caption: 'Soft light, no hard shadows. Perfect for faces.' },
      ],
    },
    {
      kind: 'compare',
      title: 'The sun behind the person',
      items: [
        { scene: 'light-backlit', label: 'Backlight', caption: 'The person becomes a black silhouette surrounded by light.' },
        { scene: 'portrait-soft', label: 'Side sun or clouds', caption: 'You can see the face clearly.' },
      ],
    },
    { kind: 'tip', label: 'What I do', body: 'Before taking the photo, I look at where the shadow goes. If it’s in the way, I walk around the subject.' },
  ],

  'regle-des-tiers': [
    { kind: 'oneLiner', body: 'Don’t always put the subject in the middle: slightly to the side is often more beautiful.' },
    { kind: 'analogy', icon: '#️⃣', body: 'Imagine a “#” on your screen. Put the subject on one of the lines, or where they cross.' },
    {
      kind: 'compare',
      title: 'The same boat',
      items: [
        { scene: 'thirds-centered', label: 'Right in the middle', caption: 'The boat and the horizon cut the image in two. It feels frozen.' },
        { scene: 'thirds-offset', label: 'On the lines', caption: 'Horizon low, boat on a crossing: the image breathes.' },
      ],
    },
    { kind: 'tip', label: 'On my phone', body: 'In the camera settings, turn on the “grid”. The “#” appears on the screen.' },
  ],

  portrait: [
    { kind: 'oneLiner', body: 'A beautiful portrait is mostly soft light and a background that doesn’t get in the way.' },
    {
      kind: 'compare',
      title: 'The same person',
      items: [
        { scene: 'portrait-harsh', label: 'Midday sun', caption: 'Black shadows under the eyes, the person squints.' },
        { scene: 'portrait-soft', label: 'In the shade', caption: 'Soft light, a readable and natural face.' },
      ],
    },
    {
      kind: 'compare',
      title: 'And the background?',
      items: [
        { scene: 'portrait-sharp', label: 'Sharp background', caption: 'Everything catches the eye: trees, house… the person gets lost.' },
        { scene: 'portrait-bokeh', label: 'Blurry background', caption: 'The person stands out. You only look at them.' },
      ],
    },
    {
      kind: 'steps',
      title: 'What I do',
      ordered: true,
      items: ['I put the person in the shade.', 'I move them away from the wall or the trees behind them.', 'I focus on their eyes.'],
    },
    { kind: 'tip', label: 'On my phone', body: 'Portrait mode, and I tap the face on the screen before taking the photo.' },
  ],

  rue: [
    { kind: 'oneLiner', body: 'In the street everything moves fast: you need a fast shutter speed to avoid blur.' },
    {
      kind: 'compare',
      title: 'A passer-by in a hurry',
      items: [
        { scene: 'street-frozen', label: 'Fast speed', caption: 'The passer-by is sharp, frozen mid-step.' },
        { scene: 'street-blur', label: 'Slow speed', caption: 'The passer-by is blurry. A miss… unless it’s intended.' },
      ],
    },
    {
      kind: 'steps',
      title: 'What I do',
      items: ['I find a nice setting and wait for someone to walk into it.', 'I stay discreet: a small camera or my phone.', 'I respect people: if someone doesn’t want it, I don’t keep the photo.'],
    },
    { kind: 'tip', label: 'On my phone', body: 'I hold the button down to take a burst, then keep the best one.' },
  ],

  paysage: [
    { kind: 'oneLiner', body: 'A beautiful landscape has something in front: a rock, flowers, a path.' },
    {
      kind: 'compare',
      title: 'The same landscape',
      items: [
        { scene: 'landscape-flat', label: 'Nothing in front', caption: 'It looks flat and far away. The horizon cuts the image in two.' },
        { scene: 'landscape-depth', label: 'A foreground', caption: 'The rock and the path add depth. You want to step inside.' },
      ],
    },
    {
      kind: 'steps',
      title: 'What I do',
      items: ['I lower the camera to see something in front.', 'I put the horizon low or high, never in the middle.', 'I go out early in the morning or late in the day.'],
    },
    { kind: 'tip', label: 'On my phone', body: 'I hold the phone straight: a tilted horizon shows right away.' },
  ],

  nuit: [
    { kind: 'oneLiner', body: 'At night, the camera needs time. The slightest movement makes the photo blurry.' },
    { kind: 'analogy', icon: '🫙', body: 'Like filling a jar drop by drop: you have to wait a long time… without knocking the jar over.' },
    {
      kind: 'compare',
      title: 'The same street at night',
      items: [
        { scene: 'night-handheld', label: 'Handheld', caption: 'Everything is doubled and blurry: my hands moved.' },
        { scene: 'night-tripod', label: 'Camera resting', caption: 'Everything is sharp, and the street lights turn into stars.' },
      ],
    },
    {
      kind: 'steps',
      title: 'What I do',
      ordered: true,
      items: ['I rest the camera: tripod, low wall, bench.', 'I use the self-timer so pressing the button doesn’t shake it.', 'I don’t touch anything during the photo.'],
    },
    { kind: 'tip', label: 'On my phone', body: 'Night mode turns on by itself. I brace the phone against something and stay still.' },
  ],
};
