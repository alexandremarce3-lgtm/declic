import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button, ChoiceCard } from '@/components/ui/Button';
import { useI18n } from '@/i18n';
import { useProgress, type Role } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';

type Step = 'role' | 'age' | 'privacy';

/**
 * Accueil au premier lancement : profil (photographe / modèle), déclaration de majorité
 * sur l'honneur, puis résumé de confidentialité. Rien n'est envoyé : tout reste sur le téléphone.
 */
export default function Welcome() {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const o = t.onboarding;
  const { stored, setProfile } = useProgress();
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('role');
  const [role, setRole] = useState<Role | null>(stored.profile.role);
  const [adult, setAdult] = useState<boolean | null>(stored.profile.adult);
  const [certified, setCertified] = useState(stored.profile.adult === true);

  const steps: Step[] = ['role', 'age', 'privacy'];
  const index = steps.indexOf(step);

  const finish = () => {
    setProfile({
      role,
      adult,
      adultDeclaredAt: adult ? new Date().toISOString() : undefined,
      onboardedAt: new Date().toISOString(),
    });
    router.replace('/');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
      <AppText variant="overline" color={colors.primaryInk}>
        {o.stepOf(index + 1, steps.length)}
      </AppText>

      {step === 'role' && (
        <View style={{ gap: spacing.md }}>
          <AppText variant="display">{o.roleTitle}</AppText>
          <AppText muted>{o.roleLead}</AppText>
          {(['photographe', 'modele', 'both'] as Role[]).map((r) => (
            <ChoiceCard
              key={r}
              title={o.roles[r].title}
              body={o.roles[r].body}
              icon={<AppText variant="title">{o.roles[r].icon}</AppText>}
              selected={role === r}
              onPress={() => setRole(r)}
            />
          ))}
          <Button label={o.next} onPress={() => setStep('age')} disabled={!role} />
        </View>
      )}

      {step === 'age' && (
        <View style={{ gap: spacing.md }}>
          <AppText variant="display">{o.ageTitle}</AppText>
          <AppText muted>{o.ageLead}</AppText>
          <ChoiceCard title={o.adult} selected={adult === true} onPress={() => setAdult(true)} />
          <ChoiceCard title={o.minor} body={o.minorBody} selected={adult === false} onPress={() => setAdult(false)} />
          {adult === true && (
            <ChoiceCard role="checkbox" title={o.certify} body={o.certifyBody} selected={certified} onPress={() => setCertified((c) => !c)} />
          )}
          <Button label={o.next} onPress={() => setStep('privacy')} disabled={adult === null || (adult && !certified)} />
          <Button kind="ghost" label={o.back} onPress={() => setStep('role')} />
        </View>
      )}

      {step === 'privacy' && (
        <View style={{ gap: spacing.md }}>
          <AppText variant="display">{o.privacyTitle}</AppText>
          {o.privacyPoints.map((p) => (
            <View key={p} style={{ flexDirection: 'row', gap: spacing.sm }}>
              <AppText color={colors.success}>✓</AppText>
              <AppText style={{ flex: 1 }}>{p}</AppText>
            </View>
          ))}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>
            {(['confidentialite', 'conditions', 'mentions'] as const).map((d) => (
              <Pressable key={d} onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: d } })} accessibilityRole="link" hitSlop={8}>
                <AppText variant="caption" color={colors.accentInk}>
                  {t.legal.links[d]} ›
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText variant="caption" muted>
            {o.acceptNote}
          </AppText>
          <Button label={o.start} onPress={finish} />
          <Button kind="ghost" label={o.back} onPress={() => setStep('age')} />
        </View>
      )}
    </ScrollView>
  );
}
