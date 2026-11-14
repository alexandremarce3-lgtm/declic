import Constants from 'expo-constants';
import { Alert, Image, Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PROJECT, THIRD_PARTY } from '@/config/about';
import { EDITOR, EDITOR_INCOMPLETE } from '@/config/editor';
import { useI18n } from '@/i18n';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const icon = require('../../assets/icon.png');

/** À propos : version, code source, contact, licences open source. */
export default function About() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const a = t.about;
  const insets = useSafeAreaInsets();
  const version = Constants.expoConfig?.version ?? '—';

  const open = (url: string) => Linking.openURL(url).catch(() => Alert.alert(a.title, url));
  const contact = () => (EDITOR_INCOMPLETE ? Alert.alert(a.contact, t.legal.reportNotConfigured) : open(`mailto:${EDITOR.email}`));

  const Link = ({ label, onPress, sub }: { label: string; onPress: () => void; sub?: string }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      style={({ pressed }) => ({ minHeight: HIT, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
    >
      <AppText color={colors.accentInk}>{label} ↗</AppText>
      {sub ? (
        <AppText variant="caption" muted>
          {sub}
        </AppText>
      ) : null}
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
      <View style={{ alignItems: 'center', gap: spacing.sm }}>
        <Image source={icon} style={{ width: 96, height: 96, borderRadius: 22 }} accessibilityIgnoresInvertColors accessible={false} />
        <AppText variant="display">Déclic</AppText>
        <AppText variant="mono" color={colors.textMuted}>
          {a.version(version)}
        </AppText>
        <AppText muted style={{ textAlign: 'center' }}>
          {a.tagline}
        </AppText>
      </View>

      <View style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}>
        <Link label={a.source} sub={a.sourceLead(PROJECT.license)} onPress={() => open(PROJECT.repository)} />
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Link label={a.updates} sub={a.updatesLead} onPress={() => open(PROJECT.releases)} />
        <View style={{ height: 1, backgroundColor: colors.border }} />
        <Link label={a.contact} sub={EDITOR_INCOMPLETE ? undefined : EDITOR.email} onPress={contact} />
      </View>

      <View style={{ gap: spacing.sm }}>
        <AppText variant="overline" muted accessibilityRole="header">
          {a.licensesTitle}
        </AppText>
        <AppText variant="caption" muted>
          {a.licensesLead}
        </AppText>
        {THIRD_PARTY.map((d) => (
          <Pressable
            key={d.name}
            onPress={() => open(d.url)}
            accessibilityRole="link"
            accessibilityLabel={`${d.name}, ${d.license}`}
            style={({ pressed }) => ({ flexDirection: 'row', justifyContent: 'space-between', gap: spacing.md, paddingVertical: spacing.xs, opacity: pressed ? 0.6 : 1 })}
          >
            <AppText style={{ flex: 1 }}>{d.name}</AppText>
            <AppText variant="caption" muted>
              {d.license}
            </AppText>
          </Pressable>
        ))}
      </View>

      <AppText variant="caption" muted style={{ textAlign: 'center' }}>
        {a.footer}
      </AppText>
    </ScrollView>
  );
}
