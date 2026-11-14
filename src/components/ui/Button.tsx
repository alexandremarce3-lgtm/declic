import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

type Kind = 'primary' | 'secondary' | 'danger' | 'ghost';

/** Bouton du design system : ambre (principal), contour (secondaire), brique (danger), texte (ghost). */
export function Button({
  label,
  onPress,
  kind = 'primary',
  disabled,
  busy,
  hint,
}: {
  label: string;
  onPress: () => void;
  kind?: Kind;
  disabled?: boolean;
  busy?: boolean;
  hint?: string;
}) {
  const { colors, spacing, radius } = useTheme();
  const bg = { primary: colors.accent, secondary: 'transparent', danger: colors.danger, ghost: 'transparent' }[kind];
  const fg = { primary: colors.onAccent, secondary: colors.text, danger: colors.onDanger, ghost: colors.accentInk }[kind];
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || busy}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy, busy }}
      accessibilityHint={hint}
      style={({ pressed }) => ({
        minHeight: HIT,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.pill,
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
        borderWidth: kind === 'secondary' ? 1.5 : 0,
        borderColor: colors.text,
        opacity: disabled ? 0.4 : pressed ? 0.75 : 1,
      })}
    >
      {busy && <ActivityIndicator color={fg} />}
      <AppText variant="mono" color={fg}>
        {label}
      </AppText>
    </Pressable>
  );
}

/** Grande carte sélectionnable (choix de profil, réponse…). */
export function ChoiceCard({
  title,
  body,
  icon,
  selected,
  onPress,
  role = 'radio',
}: {
  title: string;
  body?: string;
  icon?: ReactNode;
  selected: boolean;
  onPress: () => void;
  role?: 'radio' | 'checkbox';
}) {
  const { colors, spacing, radius } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={body ? `${title}. ${body}` : title}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: HIT + spacing.sm,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: selected ? colors.surface : 'transparent',
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.accent : colors.border,
        opacity: pressed ? 0.75 : 1,
      })}
    >
      {icon ? <View style={{ width: 40, alignItems: 'center' }}>{icon}</View> : null}
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="heading">{title}</AppText>
        {body ? (
          <AppText variant="caption" muted>
            {body}
          </AppText>
        ) : null}
      </View>
      <AppText variant="heading" color={selected ? colors.accentInk : colors.border}>
        {selected ? (role === 'checkbox' ? '☑' : '◉') : role === 'checkbox' ? '☐' : '○'}
      </AppText>
    </Pressable>
  );
}
