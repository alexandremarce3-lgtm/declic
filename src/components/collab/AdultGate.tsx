import type { ReactNode } from 'react';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { Button, ChoiceCard } from '../ui/Button';

/**
 * Réserve un écran aux personnes ayant déclaré sur l'honneur être majeures.
 * Mineur déclaré : accès refusé. Pas encore répondu : on propose la déclaration.
 */
export function AdultGate({ children }: { children: ReactNode }) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  const o = t.onboarding;
  const { stored, setProfile } = useProgress();
  const [certified, setCertified] = useState(false);

  if (stored.profile.adult === true) return <>{children}</>;

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.md }}>
      <AppText variant="display">🔞</AppText>
      <AppText variant="title">{t.collab.gateTitle}</AppText>
      {stored.profile.adult === false ? (
        <AppText muted>{t.collab.gateMinor}</AppText>
      ) : (
        <View style={{ gap: spacing.md }}>
          <AppText muted>{t.collab.gateLead}</AppText>
          <ChoiceCard role="checkbox" title={o.certify} body={o.certifyBody} selected={certified} onPress={() => setCertified((c) => !c)} />
          <Button
            label={t.collab.gateConfirm}
            disabled={!certified}
            onPress={() => setProfile({ adult: true, adultDeclaredAt: new Date().toISOString() })}
          />
          <AppText variant="caption" color={colors.textMuted}>
            {t.collab.gateNote}
          </AppText>
        </View>
      )}
    </ScrollView>
  );
}
