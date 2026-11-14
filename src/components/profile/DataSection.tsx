import { router } from 'expo-router';
import { Alert, Linking, Pressable, View } from 'react-native';
import { EDITOR, EDITOR_INCOMPLETE } from '@/config/editor';
import { useWipeAll } from '@/hooks/useWipeAll';
import { useI18n } from '@/i18n';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/** « Mes données et mentions » du profil : textes juridiques, signalement, effacement total. */
export function DataSection() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const l = t.legal;
  const wipeAll = useWipeAll();

  const report = () => {
    if (EDITOR_INCOMPLETE) {
      Alert.alert(l.report, l.reportNotConfigured);
      return;
    }
    const subject = encodeURIComponent(l.reportSubject);
    Linking.openURL(`mailto:${EDITOR.email}?subject=${subject}`).catch(() => Alert.alert(l.report, l.reportFallback(EDITOR.email)));
  };

  const confirmWipe = () =>
    Alert.alert(l.wipeTitle, l.wipeBody, [
      { text: l.cancel, style: 'cancel' },
      { text: l.wipeOk, style: 'destructive', onPress: wipeAll },
    ]);

  const Row = ({ label, onPress, danger }: { label: string; onPress: () => void; danger?: boolean }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({ minHeight: HIT, paddingHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', opacity: pressed ? 0.6 : 1 })}
    >
      <AppText color={danger ? colors.dangerInk : colors.text}>{label}</AppText>
      <AppText variant="heading" muted>
        ›
      </AppText>
    </Pressable>
  );

  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="overline" muted accessibilityRole="header">
        {l.sectionTitle}
      </AppText>
      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}>
        {(['confidentialite', 'conditions', 'mentions'] as const).map((d) => (
          <View key={d} style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
            <Row label={l.links[d]} onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: d } })} />
          </View>
        ))}
        <View style={{ borderBottomWidth: 1, borderBottomColor: colors.border }}>
          <Row label={l.report} onPress={report} />
        </View>
        <Row label={l.wipe} onPress={confirmWipe} danger />
      </View>
      <AppText variant="caption" muted>
        {l.wipeLead}
      </AppText>
    </View>
  );
}
