import { View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';

/** Encadré « Astuce » ou « Bientôt » dans une fiche */
export function Callout({ label, body, dashed }: { label: string; body: string; dashed?: boolean }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        backgroundColor: dashed ? 'transparent' : colors.surfaceAlt,
        borderRadius: radius.md,
        borderWidth: dashed ? 1.5 : 0,
        borderStyle: dashed ? 'dashed' : 'solid',
        borderColor: colors.border,
        borderLeftWidth: dashed ? 1.5 : 3,
        borderLeftColor: dashed ? colors.border : colors.accent,
        padding: spacing.md,
        gap: spacing.xs,
      }}
    >
      <AppText variant="overline" color={dashed ? colors.textMuted : colors.accentInk}>
        {label.toUpperCase()}
      </AppText>
      <AppText muted={dashed}>{body}</AppText>
    </View>
  );
}
