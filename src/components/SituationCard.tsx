import { Pressable, View } from 'react-native';
import type { Sheet } from '@/content';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';

/** Carte compacte pour la grille « Situations » du sommaire. */
export function SituationCard({ sheet, onPress, locked }: { sheet: Sheet; onPress: () => void; locked?: boolean }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const read = useProgress().isSheetRead(sheet.id);
  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      accessibilityLabel={locked ? t.tiers.lockedA11y(sheet.title) : `${sheet.title}. ${sheet.keySettings ?? sheet.summary}`}
      style={({ pressed }) => ({
        flex: 1,
        minHeight: 150,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: locked ? 'transparent' : colors.surface,
        borderWidth: 1,
        borderColor: read ? colors.success : colors.border,
        borderStyle: locked ? 'dashed' : 'solid',
        justifyContent: 'space-between',
        gap: spacing.sm,
        opacity: locked ? 0.55 : pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.98 : 1 }],
      })}
    >
      <View
        style={{
          width: 40,
          height: 40,
          borderRadius: radius.sm + 4,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="heading" color={colors.primaryInk}>
          {locked ? '🔒' : sheet.glyph}
        </AppText>
      </View>
      <View style={{ gap: 2 }}>
        <AppText variant="heading" style={{ fontSize: 16, lineHeight: 21 }}>
          {sheet.title}
        </AppText>
        {sheet.keySettings && (
          <AppText variant="caption" muted numberOfLines={2}>
            {sheet.keySettings}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}
