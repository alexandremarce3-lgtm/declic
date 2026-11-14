import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Button } from '@/components/ui/Button';
import { MOODBOARD_STYLES } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import { useProgress, type Moodboard } from '@/storage/progress';
import { HIT, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Tenues / niveaux possibles. Les deux derniers ne s'affichent qu'aux personnes ayant déclaré leur majorité. */
const LEVELS: { label: string; adultOnly?: boolean }[] = [
  { label: 'Habillé' },
  { label: 'Stylisme' },
  { label: 'Maillot de bain' },
  { label: 'Lingerie', adultOnly: true },
  { label: 'Nu implicite', adultOnly: true },
  { label: 'Nu artistique', adultOnly: true },
];

/** Quête « Mon moodboard » : styles aimés, ce que j'accepte et ce que je refuse. Préremplit le Contrat-Minute. */
export default function MoodboardScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const m = t.model;
  const { stored, setMoodboard, completeQuest } = useProgress();
  const insets = useSafeAreaInsets();
  const [mb, setMb] = useState<Moodboard>(stored.moodboard);
  const adult = stored.profile.adult === true;
  const levels = LEVELS.filter((l) => adult || !l.adultOnly);

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
        {MOODBOARD_STYLES.map((s) => (
          <Chip key={s} label={s} on={mb.styles.includes(s)} onPress={() => toggle('styles', s)} />
        ))}
      </View>

      <AppText variant="overline" muted>
        {m.acceptsTitle}
      </AppText>
      <AppText variant="caption" muted>
        {m.acceptsLead}
      </AppText>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {levels.map((l) => (
          <Chip key={l.label} label={l.label} danger={l.adultOnly} on={mb.accepts.includes(l.label)} onPress={() => toggle('accepts', l.label)} />
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
          const refuses = LEVELS.map((l) => l.label).filter((l) => !mb.accepts.includes(l));
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
