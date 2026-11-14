import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AdultGate } from '@/components/collab/AdultGate';
import { Button } from '@/components/ui/Button';
import { useCollab } from '@/hooks/useCollab';
import { useI18n } from '@/i18n';
import { QUEST_XP } from '@/lib/xp';
import { isSigned, useAgreements } from '@/storage/agreements';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** « Collaborer en confiance » : les règles (FAQ, charte) puis les accords (Contrat-Minute). */
export default function CollabHub() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const { isQuestDone } = useProgress();
  const { agreements } = useAgreements();
  const { projectTypes } = useCollab();
  const insets = useSafeAreaInsets();

  const Step = ({ n, title, lead, quest, href }: { n: number; title: string; lead: string; quest: string; href: Href }) => {
    const done = isQuestDone(quest);
    return (
      <Pressable
        onPress={() => router.push(href)}
        accessibilityRole="button"
        accessibilityLabel={`${title}. ${lead}${done ? `. ${c.done}` : ''}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          minHeight: HIT + spacing.lg,
          padding: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: done ? colors.success : colors.border,
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? colors.primary : colors.surfaceAlt }}>
          <AppText variant="heading" color={done ? colors.onPrimary : colors.text}>
            {done ? '✓' : n}
          </AppText>
        </View>
        <View style={{ flex: 1 }}>
          <AppText variant="heading">{title}</AppText>
          <AppText variant="caption" muted>
            {lead}
          </AppText>
        </View>
        <AppText variant="mono" color={done ? colors.success : colors.accentInk}>
          {done ? '✓' : t.xp.gain(QUEST_XP[quest] ?? 0)}
        </AppText>
      </Pressable>
    );
  };

  return (
    <AdultGate>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
        <AppText muted>{c.hubLead}</AppText>

        <AppText variant="overline" muted accessibilityRole="header">
          {c.rulesTitle}
        </AppText>
        <Step n={1} title={c.faqTitle} lead={c.faqLead} quest="faq-tfp" href="/collab/faq" />
        <Step n={2} title={c.charterTitle} lead={c.charterLead} quest="charte-tfp" href="/collab/charte" />

        <AppText variant="overline" muted accessibilityRole="header" style={{ marginTop: spacing.md }}>
          {c.agreementsTitle}
        </AppText>
        <Button label={`＋ ${c.newAgreement}`} onPress={() => router.push('/collab/accord')} />
        {!isQuestDone('premier-accord') && (
          <AppText variant="caption" muted style={{ textAlign: 'center' }}>
            {c.firstAgreementXp(QUEST_XP['premier-accord'])}
          </AppText>
        )}

        {agreements.length === 0 ? (
          <AppText muted style={{ textAlign: 'center', marginTop: spacing.sm }}>
            {c.noAgreements}
          </AppText>
        ) : (
          agreements.map((a) => {
            const signed = isSigned(a);
            return (
              <Pressable
                key={a.id}
                onPress={() => router.push(signed ? { pathname: '/collab/signer', params: { id: a.id } } : { pathname: '/collab/accord', params: { id: a.id } })}
                accessibilityRole="button"
                style={({ pressed }) => ({
                  padding: spacing.md,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  gap: 2,
                  opacity: pressed ? 0.7 : 1,
                })}
              >
                <AppText variant="overline" color={signed ? colors.success : colors.accentInk}>
                  {signed ? c.signed : c.draft}
                </AppText>
                <AppText variant="heading">
                  {projectTypes[a.projectType]} · {a.model || '…'} & {a.photographer || '…'}
                </AppText>
                <AppText variant="caption" muted>
                  {[a.date, a.place].filter(Boolean).join(' · ')}
                </AppText>
              </Pressable>
            );
          })
        )}

        <AppText variant="caption" muted style={{ marginTop: spacing.md }}>
          🔒 {c.localNote}
        </AppText>
      </ScrollView>
    </AdultGate>
  );
}
