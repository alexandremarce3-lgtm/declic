import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AdultGate } from '@/components/collab/AdultGate';
import { Button, ChoiceCard } from '@/components/ui/Button';
import { charter } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';

/** Charte de collaboration : engagements à lire et accepter (quête + badge « Charte TFP »). */
export default function CharterScreen() {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const { completeQuest, isQuestDone } = useProgress();
  const insets = useSafeAreaInsets();
  const already = isQuestDone('charte-tfp');
  const [checked, setChecked] = useState(already);

  return (
    <AdultGate>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
        <AppText muted>{c.charterIntro}</AppText>
        {charter.map((item, i) => (
          <View key={item.title} style={{ flexDirection: 'row', gap: spacing.md }}>
            <AppText variant="title" color={colors.primaryInk} style={{ width: 28 }}>
              {i + 1}
            </AppText>
            <View style={{ flex: 1, gap: 2 }}>
              <AppText variant="heading">{item.title}</AppText>
              <AppText muted>{item.body}</AppText>
            </View>
          </View>
        ))}
        {already ? (
          <AppText variant="heading" color={colors.success} style={{ textAlign: 'center' }}>
            ✓ {c.charterAccepted}
          </AppText>
        ) : (
          <View style={{ gap: spacing.md, marginTop: spacing.sm }}>
            <ChoiceCard role="checkbox" title={c.charterCheck} selected={checked} onPress={() => setChecked((v) => !v)} />
            <Button
              label={c.charterAccept}
              disabled={!checked}
              onPress={() => {
                completeQuest('charte-tfp');
                router.back();
              }}
            />
          </View>
        )}
      </ScrollView>
    </AdultGate>
  );
}
