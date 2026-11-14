import { View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

type Item = { label: string; value: string; note?: string };

/** Tableau « réglage → valeur », lisible d'un coup d'œil sur le terrain. */
export function SettingsCard({ title, items }: { title?: string; items: Item[] }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View
      style={{
        borderRadius: radius.lg,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
      }}
    >
      {title && (
        <AppText variant="overline" muted style={{ padding: spacing.md, paddingBottom: spacing.sm }}>
          {title.toUpperCase()}
        </AppText>
      )}
      {items.map((it, i) => (
        <View
          key={it.label}
          accessible
          accessibilityLabel={`${it.label} : ${it.value}${it.note ? `. ${it.note}` : ''}`}
          style={{
            flexDirection: 'row',
            gap: spacing.md,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm + 2,
            borderTopWidth: i === 0 && !title ? 0 : 1,
            borderTopColor: colors.border,
          }}
        >
          <AppText variant="caption" muted style={{ width: '38%' }}>
            {it.label}
          </AppText>
          <View style={{ flex: 1 }}>
            <AppText variant="heading" style={{ fontSize: 16 }}>
              {it.value}
            </AppText>
            {it.note && (
              <AppText variant="caption" muted>
                {it.note}
              </AppText>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}
