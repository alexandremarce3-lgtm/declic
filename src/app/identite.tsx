import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Avatar } from '@/components/avatar/Avatar';
import { useI18n } from '@/i18n';
import { displayName, useProgress, type Identity } from '@/storage/progress';
import { HIT, type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const MAX = 30;

/** Édition de l'identité : prénom, nom, pseudonyme, et ce qui s'affiche dans l'app. */
export default function IdentityScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { stored, setIdentity } = useProgress();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState<Identity>(stored.identity);
  const set = (k: keyof Identity) => (v: string) => setDraft((d) => ({ ...d, [k]: v }));

  const field = (k: 'nickname' | 'firstName' | 'lastName', autoComplete: 'nickname' | 'given-name' | 'family-name') => (
    <View style={{ gap: spacing.xs }}>
      <AppText variant="overline" muted nativeID={`label-${k}`}>
        {t.identity.fields[k]}
      </AppText>
      <TextInput
        value={draft[k]}
        onChangeText={set(k)}
        maxLength={MAX}
        autoComplete={autoComplete}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        placeholder={t.identity.placeholders[k]}
        placeholderTextColor={colors.textMuted}
        accessibilityLabelledBy={`label-${k}`}
        style={[
          type.body,
          {
            minHeight: HIT,
            paddingHorizontal: spacing.md,
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.surface,
            color: colors.text,
          },
        ]}
      />
    </View>
  );

  const preview = displayName(draft) || t.identity.anonymous;
  const options: Identity['display'][] = ['nickname', 'firstName', 'fullName'];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
        <View style={{ alignItems: 'center', gap: spacing.sm }}>
          <Avatar look={stored.look} size={110} />
          <AppText variant="title" style={{ textAlign: 'center' }}>
            {preview}
          </AppText>
        </View>

        {field('nickname', 'nickname')}
        {field('firstName', 'given-name')}
        {field('lastName', 'family-name')}

        <View style={{ gap: spacing.sm }}>
          <AppText variant="overline" muted>
            {t.identity.displayTitle}
          </AppText>
          <View style={{ flexDirection: 'row', gap: spacing.sm }} accessibilityRole="radiogroup">
            {options.map((o) => {
              const active = draft.display === o;
              return (
                <Pressable
                  key={o}
                  onPress={() => setDraft((d) => ({ ...d, display: o }))}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  style={{
                    flex: 1,
                    minHeight: HIT - 4,
                    borderRadius: radius.pill,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: active ? colors.primary : colors.surfaceAlt,
                  }}
                >
                  <AppText variant="caption" color={active ? colors.onPrimary : colors.text}>
                    {t.identity.display[o]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <AppText variant="caption" muted>
          🔒 {t.identity.privacy}
        </AppText>

        <Pressable
          onPress={() => {
            setIdentity(draft);
            router.back();
          }}
          accessibilityRole="button"
          style={({ pressed }) => ({
            minHeight: HIT,
            borderRadius: radius.pill,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.accent,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <AppText variant="mono" color={colors.onAccent}>
            {t.identity.save}
          </AppText>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
