import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { EDITOR_INCOMPLETE } from '@/config/editor';
import { useCollab } from '@/hooks/useCollab';
import { useI18n } from '@/i18n';
import { useTheme } from '@/theme/useTheme';

/** Mentions légales, politique de confidentialité, conditions d'utilisation. */
export default function LegalScreen() {
  const { doc } = useLocalSearchParams<{ doc: string }>();
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const insets = useSafeAreaInsets();
  const { legalDocs } = useCollab();
  const d = legalDocs.find((x) => x.id === doc) ?? legalDocs[0];

  return (
    <>
      <Stack.Screen options={{ title: d.title }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
        <AppText variant="title" accessibilityRole="header">
          {d.title}
        </AppText>
        {EDITOR_INCOMPLETE && d.id !== 'conditions' && (
          <View style={{ padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.danger }}>
            <AppText variant="caption" color={colors.dangerInk}>
              {t.legal.draft}
            </AppText>
          </View>
        )}
        {d.sections.map((s) => (
          <View key={s.title} style={{ gap: spacing.xs }}>
            <AppText variant="overline" color={colors.accentInk} accessibilityRole="header">
              {s.title.toUpperCase()}
            </AppText>
            <AppText>{s.body}</AppText>
          </View>
        ))}
      </ScrollView>
    </>
  );
}
