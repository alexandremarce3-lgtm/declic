import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { COUNTERS } from '@/lib/achievements';
import { useProgress } from '@/storage/progress';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { ProblemCard } from '@/components/sos/ProblemCard';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

/** SOS Photo ratée. `?probleme=<id>` ouvre directement une carte. */
export default function Sos() {
  const { probleme } = useLocalSearchParams<{ probleme?: string }>();
  const { t, catalog } = useI18n();
  const { problems } = catalog;
  const { bump } = useProgress();
  useEffect(() => {
    bump(COUNTERS.sosVisits); // succès secret « Habitué des urgences »
  }, [bump]);
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}
    >
      <AppText muted>{t.sos.intro}</AppText>
      {problems.map((p) => (
        <ProblemCard key={p.id} problem={p} initiallyOpen={p.id === probleme} />
      ))}
    </ScrollView>
  );
}
