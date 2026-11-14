import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import { router, useLocalSearchParams } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { useState } from 'react';
import { Alert, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AdultGate } from '@/components/collab/AdultGate';
import { SignaturePad } from '@/components/collab/SignaturePad';
import { Button, ChoiceCard } from '@/components/ui/Button';
import { AGREEMENT_DISCLAIMER, agreementSections, isSensitive, type Signature } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import { agreementHtml } from '@/lib/agreementPdf';
import { isSigned, useAgreements } from '@/storage/agreements';
import { useProgress } from '@/storage/progress';
import { HIT, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Party = 'photographer' | 'model';

/**
 * Contrat-Minute, étape 2 : relecture puis double signature sur le même téléphone
 * (les deux personnes sont ensemble au moment de la séance). Signé : PDF à partager.
 */
export default function SignScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const { get, save, remove } = useAgreements();
  const { completeQuest } = useProgress();
  const insets = useSafeAreaInsets();
  const agreement = get(id);
  const [scroll, setScroll] = useState(true);
  const [busy, setBusy] = useState(false);

  if (!agreement) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <AppText>{c.notFound}</AppText>
      </View>
    );
  }

  const signed = isSigned(agreement);
  const sensitive = isSensitive(agreement);

  const sign = (party: Party, s: Signature) => {
    const next = { ...agreement, signatures: { ...agreement.signatures, [party]: s } };
    save(next);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    if (isSigned(next)) completeQuest('premier-accord');
  };

  const sharePdf = async () => {
    setBusy(true);
    try {
      const { uri } = await Print.printToFileAsync({ html: agreementHtml(agreement, t.journal.date) });
      await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf', dialogTitle: c.sharePdf });
    } catch {
      Alert.alert(c.sharePdf, c.pdfError);
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = () =>
    Alert.alert(c.deleteTitle, c.deleteBody, [
      { text: c.cancel, style: 'cancel' },
      {
        text: c.deleteOk,
        style: 'destructive',
        onPress: () => {
          remove(agreement.id);
          router.back();
        },
      },
    ]);

  return (
    <AdultGate>
      <ScrollView scrollEnabled={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
        <AppText variant="overline" color={signed ? colors.success : colors.accentInk}>
          {signed ? `✓ ${c.signed}` : c.reviewKicker}
        </AppText>
        <AppText variant="title">{c.agreementTitle}</AppText>
        {!signed && <AppText muted>{c.reviewLead}</AppText>}

        <View style={{ padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: spacing.md }}>
          {agreementSections(agreement).map((s) => (
            <View key={s.title} style={{ gap: 2 }}>
              <AppText variant="overline" color={colors.primaryInk}>
                {s.title.toUpperCase()}
              </AppText>
              <AppText>{s.body}</AppText>
            </View>
          ))}
        </View>

        {!signed && (
          <Button kind="ghost" label={c.edit} onPress={() => router.replace({ pathname: '/collab/accord', params: { id: agreement.id } })} />
        )}

        {(['photographer', 'model'] as Party[]).map((p) => (
          <SignatureSlot
            key={p}
            title={p === 'photographer' ? c.signPhotographer : c.signModel}
            defaultName={p === 'photographer' ? agreement.photographer : agreement.model}
            existing={agreement.signatures[p]}
            sensitive={sensitive}
            onDrawing={(d) => setScroll(!d)}
            onSign={(s) => sign(p, s)}
          />
        ))}

        {signed && (
          <View style={{ gap: spacing.sm }}>
            <Button label={c.sharePdf} onPress={sharePdf} busy={busy} />
            <AppText variant="caption" muted style={{ textAlign: 'center' }}>
              {c.sharePdfLead}
            </AppText>
          </View>
        )}

        <AppText variant="caption" muted>
          {AGREEMENT_DISCLAIMER}
        </AppText>
        <Button kind="ghost" label={c.deleteAgreement} onPress={confirmDelete} />
      </ScrollView>
    </AdultGate>
  );
}

/** Bloc de signature d'une partie : nom, déclaration de majorité, tracé, validation. */
function SignatureSlot({
  title,
  defaultName,
  existing,
  sensitive,
  onDrawing,
  onSign,
}: {
  title: string;
  defaultName: string;
  existing?: Signature;
  sensitive: boolean;
  onDrawing: (drawing: boolean) => void;
  onSign: (s: Signature) => void;
}) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const [name, setName] = useState(defaultName);
  const [adult, setAdult] = useState(false);
  const [read, setRead] = useState(false);
  const [paths, setPaths] = useState<string[]>([]);

  if (existing) {
    return (
      <View style={{ padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.success, gap: 4 }}>
        <AppText variant="overline" color={colors.success}>
          ✓ {title}
        </AppText>
        <AppText variant="heading">{existing.name}</AppText>
        <AppText variant="caption" muted>
          {c.signedOn(t.journal.date(existing.at))}
        </AppText>
      </View>
    );
  }

  const canSign = name.trim() && adult && read && paths.length > 0;

  return (
    <View style={{ padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, gap: spacing.sm }}>
      <AppText variant="overline" color={colors.accentInk}>
        {title}
      </AppText>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={c.signName}
        placeholderTextColor={colors.textMuted}
        maxLength={60}
        style={[type.body, { minHeight: HIT, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, color: colors.text }]}
      />
      <ChoiceCard role="checkbox" title={c.declareAdult} body={sensitive ? c.declareAdultSensitive : undefined} selected={adult} onPress={() => setAdult((v) => !v)} />
      <ChoiceCard role="checkbox" title={c.declareRead} selected={read} onPress={() => setRead((v) => !v)} />
      <SignaturePad onChange={setPaths} onDrawing={onDrawing} clearLabel={c.clearSignature} placeholder={c.signHere} />
      <Button
        label={c.signCta}
        disabled={!canSign}
        onPress={() => onSign({ name: name.trim(), paths, at: new Date().toISOString(), adultDeclared: true })}
      />
    </View>
  );
}
