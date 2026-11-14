import { Pressable, View } from 'react-native';
import type { Sheet } from '@/content';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from './AppText';

/** Ligne du sommaire pour une fiche. Verrouillée : grisée et inactive. */
export function SheetCard({ sheet, number, onPress, locked }: { sheet: Sheet; number: number; onPress: () => void; locked?: boolean }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { isSheetRead, isCredited } = useProgress();
  const read = isSheetRead(sheet.id);
  const credited = !read && isCredited('sheet', sheet.id);

  return (
    <Pressable
      onPress={onPress}
      disabled={locked}
      accessibilityRole="button"
      accessibilityState={{ disabled: locked }}
      accessibilityLabel={locked ? t.tiers.lockedA11y(sheet.title) : `${sheet.title}. ${sheet.summary}`}
      style={({ pressed }) => ({
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
        minHeight: HIT + spacing.lg,
        padding: spacing.md,
        borderRadius: radius.lg,
        backgroundColor: locked ? 'transparent' : colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderStyle: locked ? 'dashed' : 'solid',
        opacity: locked ? 0.55 : pressed ? 0.7 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }],
      })}
    >
      <View
        style={{
          width: 52,
          height: 52,
          borderRadius: radius.md,
          backgroundColor: colors.surfaceAlt,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <AppText variant="heading" color={locked ? colors.textMuted : colors.primaryInk}>
          {locked ? '🔒' : sheet.glyph}
        </AppText>
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="caption" muted>
          {String(number).padStart(2, '0')} · {t.format.minutes(sheet.minutes)}
          {credited ? ` · ${t.tiers.credited}` : ''}
        </AppText>
        <AppText variant="heading">{sheet.title}</AppText>
        <AppText variant="caption" muted numberOfLines={2}>
          {sheet.summary}
        </AppText>
      </View>
      {!locked && (
        <AppText variant="heading" color={read || credited ? colors.success : colors.textMuted}>
          {read ? '✓' : credited ? '◇' : '›'}
        </AppText>
      )}
    </Pressable>
  );
}
