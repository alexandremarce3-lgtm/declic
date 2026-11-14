import type { ContentPack } from '@/content/types';
import { challenges } from './challenges';
import { quiz } from './quiz';
import { sections } from './sections';
import { advanced } from './sheets/advanced';
import { composition } from './sheets/composition';
import { expert } from './sheets/expert';
import { fundamentals } from './sheets/fundamentals';
import { presence } from './sheets/presence';
import { simpleVersions } from './sheets/simple';
import { situations } from './sheets/situations';
import { problems } from './troubleshooting';

/** English content: translation of the French pack, with exactly the same ids. */
export const enContent: ContentPack = {
  sections,
  sheets: [...fundamentals, ...advanced, ...composition, ...situations, ...presence, ...expert].map((s) =>
    simpleVersions[s.id] ? { ...s, simpleBlocks: simpleVersions[s.id] } : s,
  ),
  challenges,
  problems,
  quiz,
};
