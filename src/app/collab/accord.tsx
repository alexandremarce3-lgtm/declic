import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AdultGate } from '@/components/collab/AdultGate';
import { Button } from '@/components/ui/Button';
import { ALLOWANCES, DIFFUSIONS, PROJECT_TYPES, isSensitive, type Agreement, type Allowance, type Diffusion, type ProjectType } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import { useAgreements } from '@/storage/agreements';
import { displayName, useProgress } from '@/storage/progress';
import { HIT, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const newId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

/** Correspondance moodboard (parcours Modèle) → tenues autorisées */
const FROM_MOODBOARD: Record<string, Allowance> = {
  Habillé: 'habille',
  'Habillé·e': 'habille',
  Stylisme: 'stylisme',
  'Maillot de bain': 'maillot',
  Lingerie: 'lingerie',
  'Nu implicite': 'implicite',
  'Nu artistique': 'nu',
};

/** Contrat-Minute, étape 1 : remplir l'accord (brouillon modifiable jusqu'à la signature). */
export default function AgreementForm() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const { stored } = useProgress();
  const { get, save } = useAgreements();
  const insets = useSafeAreaInsets();

  const initial = useMemo<Agreement>(() => {
    const existing = id ? get(id) : undefined;
    if (existing) return existing;
    const me = displayName(stored.identity);
    const role = stored.profile.role;
    const accepted = stored.moodboard.accepts.map((a) => FROM_MOODBOARD[a]).filter(Boolean) as Allowance[];
    return {
      id: newId(),
      createdAt: new Date().toISOString(),
      projectType: 'portrait',
      projectOther: '',
      date: '',
      place: '',
      photographer: role === 'photographe' || role === 'both' ? me : '',
      model: role === 'modele' ? me : '',
      allowed: accepted.length ? accepted : ['habille'],
      forbidden: stored.moodboard.refuses.join(', '),
      deliveryCount: 10,
      deliveryDays: 30,
      diffusion: ['book', 'socialPhotographer', 'socialModel'],
      credit: true,
      durationYears: 5,
      signatures: {},
    };
  }, [id, get, stored]);

  const [a, setA] = useState<Agreement>(initial);
  const set = <K extends keyof Agreement>(k: K, v: Agreement[K]) => setA((x) => ({ ...x, [k]: v }));
  const toggle = <T extends string>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const inputStyle = [type.body, { minHeight: HIT, paddingHorizontal: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text }];

  const Label = ({ children }: { children: string }) => (
    <AppText variant="overline" muted style={{ marginTop: spacing.md }}>
      {children}
    </AppText>
  );

  const Chip = ({ label, on, onPress, sensitive }: { label: string; on: boolean; onPress: () => void; sensitive?: boolean }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      style={{
        minHeight: HIT - 8,
        paddingHorizontal: spacing.md,
        borderRadius: radius.pill,
        justifyContent: 'center',
        backgroundColor: on ? (sensitive ? colors.danger : colors.primary) : colors.surfaceAlt,
      }}
    >
      <AppText variant="caption" color={on ? (sensitive ? colors.onDanger : colors.onPrimary) : colors.text}>
        {on ? '✓ ' : ''}
        {label}
      </AppText>
    </Pressable>
  );

  const Stepper = ({ value, onChange, min, max, step = 1, suffix }: { value: number; onChange: (n: number) => void; min: number; max: number; step?: number; suffix: string }) => {
    const Btn = ({ d }: { d: number }) => (
      <Pressable
        onPress={() => onChange(Math.min(max, Math.max(min, value + d)))}
        accessibilityRole="button"
        accessibilityLabel={`${d > 0 ? '+' : '−'}${step} ${suffix}`}
        style={{ width: HIT, height: HIT, borderRadius: HIT / 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceAlt }}
      >
        <AppText variant="title">{d > 0 ? '+' : '−'}</AppText>
      </Pressable>
    );
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
        <Btn d={-step} />
        <AppText variant="heading" style={{ minWidth: 100, textAlign: 'center' }} accessibilityLiveRegion="polite">
          {value} {suffix}
        </AppText>
        <Btn d={step} />
      </View>
    );
  };

  const ready = a.photographer.trim() && a.model.trim() && a.date.trim() && a.place.trim() && a.allowed.length > 0;
  const sensitive = isSensitive(a);

  return (
    <AdultGate>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.sm }}>
        <AppText muted>{c.formIntro}</AppText>

        <Label>{c.fields.type}</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {PROJECT_TYPES.map((p) => (
            <Chip key={p.id} label={p.label} sensitive={p.sensitive} on={a.projectType === p.id} onPress={() => set('projectType', p.id as ProjectType)} />
          ))}
        </View>
        {a.projectType === 'autre' && <TextInput value={a.projectOther} onChangeText={(v) => set('projectOther', v)} placeholder={c.placeholders.other} placeholderTextColor={colors.textMuted} style={inputStyle} />}

        <Label>{c.fields.people}</Label>
        <TextInput value={a.photographer} onChangeText={(v) => set('photographer', v)} placeholder={c.placeholders.photographer} placeholderTextColor={colors.textMuted} style={inputStyle} maxLength={60} />
        <TextInput value={a.model} onChangeText={(v) => set('model', v)} placeholder={c.placeholders.model} placeholderTextColor={colors.textMuted} style={inputStyle} maxLength={60} />

        <Label>{c.fields.when}</Label>
        <TextInput value={a.date} onChangeText={(v) => set('date', v)} placeholder={c.placeholders.date} placeholderTextColor={colors.textMuted} style={inputStyle} maxLength={40} />
        <TextInput value={a.place} onChangeText={(v) => set('place', v)} placeholder={c.placeholders.place} placeholderTextColor={colors.textMuted} style={inputStyle} maxLength={80} />

        <Label>{c.fields.allowed}</Label>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
          {ALLOWANCES.map((x) => (
            <Chip key={x.id} label={x.label} sensitive={x.sensitive} on={a.allowed.includes(x.id)} onPress={() => set('allowed', toggle(a.allowed, x.id))} />
          ))}
        </View>
        {sensitive && (
          <View style={{ padding: spacing.md, borderRadius: radius.md, borderLeftWidth: 3, borderLeftColor: colors.danger, backgroundColor: colors.surfaceAlt }}>
            <AppText variant="caption">{c.sensitiveWarning}</AppText>
          </View>
        )}
        <TextInput
          value={a.forbidden}
          onChangeText={(v) => set('forbidden', v)}
          placeholder={c.placeholders.forbidden}
          placeholderTextColor={colors.textMuted}
          multiline
          style={[inputStyle, { minHeight: 80, paddingTop: spacing.sm, textAlignVertical: 'top' }]}
          maxLength={400}
        />

        <Label>{c.fields.delivery}</Label>
        <Stepper value={a.deliveryCount} onChange={(n) => set('deliveryCount', n)} min={1} max={100} suffix={c.units.photos} />
        <Stepper value={a.deliveryDays} onChange={(n) => set('deliveryDays', n)} min={7} max={180} step={7} suffix={c.units.days} />

        <Label>{c.fields.diffusion}</Label>
        <View style={{ gap: spacing.sm }}>
          {DIFFUSIONS.map((d) => (
            <Chip key={d.id} label={d.label} on={a.diffusion.includes(d.id)} onPress={() => set('diffusion', toggle(a.diffusion, d.id as Diffusion))} />
          ))}
          <Chip label={c.credit} on={a.credit} onPress={() => set('credit', !a.credit)} />
        </View>
        <View style={{ padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, gap: 4 }}>
          <AppText variant="overline" color={colors.dangerInk}>
            🔒 {c.alwaysForbidden}
          </AppText>
          {c.alwaysForbiddenItems.map((x) => (
            <AppText key={x} variant="caption">
              • {x}
            </AppText>
          ))}
        </View>

        <Label>{c.fields.duration}</Label>
        <Stepper value={a.durationYears} onChange={(n) => set('durationYears', n)} min={1} max={10} suffix={c.units.years} />

        <View style={{ gap: spacing.sm, marginTop: spacing.lg }}>
          <Button
            label={c.toSign}
            disabled={!ready}
            onPress={() => {
              save(a);
              router.replace({ pathname: '/collab/signer', params: { id: a.id } });
            }}
          />
          {!ready && (
            <AppText variant="caption" muted style={{ textAlign: 'center' }}>
              {c.missing}
            </AppText>
          )}
          <Button
            kind="ghost"
            label={c.saveDraft}
            onPress={() => {
              save(a);
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </AdultGate>
  );
}
