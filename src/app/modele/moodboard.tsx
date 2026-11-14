import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { ALLOWANCE_IDS, MOOD_STYLE_IDS, SENSITIVE_ALLOWANCES, toAllowance, toMoodStyle } from '@/content/collabModel';
import { useCollab } from '@/hooks/useCollab';
import { useI18n } from '@/i18n';
import { useProgress, type Moodboard } from '@/storage/progress';
import { HIT, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/**
 * Quête « Mon moodboard » : styles aimés, ce que j'accepte et ce que je refuse. Préremplit le Contrat-Minute.
 * Enregistré sous forme d'identifiants (valables dans toutes les langues). Les niveaux sensibles
 * ne s'affichent qu'aux personnes ayant déclaré leur majorité.
 */
export default function MoodboardScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const m = t.model;
  const L = useCollab();
  const { stored, setMoodboard, completeQuest } = useProgress();
  const insets = useSafeAreaInsets();
  const adult = stored.profile.adult === true;

  // Conversion des anciennes versions (libellés français) en identifiants
  const [mb, setMb] = useState<Moodboard>(() => ({
    ...stored.moodboard,
    styles: stored.moodboard.styles.map(toMoodStyle).filter((x): x is NonNullable<typeof x> => x !== null),
    accepts: stored.moodboard.accepts.map(toAllowance).filter((x): x is NonNullable<typeof x> => x !== null),
  }));
  const levels = ALLOWANCE_IDS.filter((id) => adult || !SENSITIVE_ALLOWANCES.includes(id));

  const toggle = (k: 'styles' | 'accepts', v: string) =>
    setMb((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));

  const Chip = ({ label, on, onPress, danger }: { label: string; on: boolean; onPress: () => void; danger?: boolean }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: on }}
      style={{ minHeight: HIT - 8, paddingHorizontal: spacing.md, borderRadius: radius.pill, justifyContent: 'center', backgroundColor: on ? (danger ? colors.danger : colors.primary) : colors.surfaceAlt }}
    >
      <AppText variant="caption" color={on ? (danger ? colors.onDanger : colors.onPrimary) : colors.text}>
        {on ? '✓ ' : ''}
        {label}
      </AppText>
    </Pressable>
  );

  const canSave = mb.styles.length > 0 && mb.accepts.length > 0;

  return (
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
      <AppText muted>{m.moodboardIntro}</AppText>

      <AppText variant="overline" muted>
        {m.stylesTitle}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {MOOD_STYLE_IDS.map((s) => (
          <Chip key={s} label={L.moodStyles[s]} on={mb.styles.includes(s)} onPress={() => toggle('styles', s)} />
        ))}
      </View>

      <AppText variant="overline" muted>
        {m.acceptsTitle}
      </AppText>
      <AppText variant="caption" muted>
        {m.acceptsLead}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {levels.map((id) => (
          <Chip key={id} label={L.allowances[id]} danger={SENSITIVE_ALLOWANCES.includes(id)} on={mb.accepts.includes(id)} onPress={() => toggle('accepts', id)} />
        ))}
      </View>

      <AppText variant="overline" muted>
        {m.notesTitle}
      </AppText>
      <TextInput
        value={mb.notes}
        onChangeText={(v) => setMb((x) => ({ ...x, notes: v }))}
        placeholder={m.notesPlaceholder}
        placeholderTextColor={colors.textMuted}
        multiline
        maxLength={400}
        style={[type.body, { minHeight: 90, padding: spacing.md, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, color: colors.text, textAlignVertical: 'top' }]}
      />

      <Button
        label={m.saveMoodboard}
        disabled={!canSave}
        onPress={() => {
          // Tout ce qui n'est pas accepté est explicitement refusé (repris dans l'accord)
          const refuses = ALLOWANCE_IDS.filter((id) => !mb.accepts.includes(id));
          setMoodboard({ ...mb, refuses });
          completeQuest('moodboard');
          router.back();
        }}
      />
      <AppText variant="caption" muted style={{ textAlign: 'center' }}>
        {m.moodboardNote}
      </AppText>
    </ScrollView>
  );
}
