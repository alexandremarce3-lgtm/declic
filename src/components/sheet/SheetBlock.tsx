import type { Block } from '@/content';
import { useI18n } from '@/i18n';
import { AppText } from '../AppText';
import { Callout } from '../Callout';
import { ExposureSimulator } from '../simulator/ExposureSimulator';
import { MeteringDemo } from '../simulator/MeteringDemo';
import { ThirdsViewfinder } from '../simulator/ThirdsViewfinder';
import { RelatedLinks } from './RelatedLinks';
import { SettingsCard } from './SettingsCard';
import { Analogy, Compare, OneLiner } from './SimpleBlocks';
import { StepsList } from './StepsList';

/**
 * Aiguillage « type de bloc → composant ».
 * Le `switch` est exhaustif : un nouveau type de bloc oublié ici ne compile pas.
 */
export function SheetBlock({ block }: { block: Block }) {
  const { t } = useI18n();
  switch (block.kind) {
    case 'text':
      return <AppText>{block.body}</AppText>;
    case 'tip':
      return <Callout label={block.label ?? t.sheet.tip} body={block.body} />;
    case 'simulator':
      return <ExposureSimulator focus={block.focus} preset={block.preset} light={block.light} />;
    case 'oneLiner':
      return <OneLiner body={block.body} />;
    case 'analogy':
      return <Analogy icon={block.icon} body={block.body} />;
    case 'compare':
      return <Compare title={block.title} items={block.items} />;
    case 'metering':
      return <MeteringDemo />;
    case 'thirds':
      return <ThirdsViewfinder />;
    case 'settings':
      return <SettingsCard title={block.title} items={block.items} />;
    case 'steps':
      return <StepsList title={block.title} items={block.items} ordered={block.ordered} />;
    case 'related':
      return <RelatedLinks sheets={block.sheets} challenges={block.challenges} />;
    case 'comingSoon':
      return <Callout label={t.sheet.soon} body={block.label} dashed />;
    default: {
      const unreachable: never = block;
      return unreachable;
    }
  }
}
