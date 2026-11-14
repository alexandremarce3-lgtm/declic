import type { Section } from '@/content/types';

/** Display order of sections INSIDE each level (same ids as the French version). */
export const sections: Section[] = [
  { id: 'fondamentaux', title: 'How it works', lead: 'The technique, setting by setting.', layout: 'list' },
  { id: 'composition', title: 'Composition', lead: 'Where to place the subject in the frame.', layout: 'list' },
  { id: 'situations', title: 'Situations', lead: 'What to set, out in the field.', layout: 'grid' },
  { id: 'presence', title: 'Presence and posing', lead: 'For models, and the photographers who direct them.', layout: 'list' },
  { id: 'techniques', title: 'Techniques', lead: 'The tools of seasoned photographers.', layout: 'list' },
];
