import { View } from 'react-native';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

export function StepsList({ title, items, ordered }: { title: string; items: string[]; ordered?: boolean }) {
  const { colors, spacing, radius } = useTheme();
  return (
    <View style={{ gap: spacing.sm }}>
      <AppText variant="overline" muted accessibilityRole="header">
        {title.toUpperCase()}
      </AppText>
      {items.map((item, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: spacing.sm + 4, alignItems: 'flex-start' }}>
          <View
            style={{
              width: 26,
              height: 26,
              marginTop: 1,
              borderRadius: radius.pill,
              backgroundColor: ordered ? colors.primary : colors.surfaceAlt,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AppText variant="caption" color={ordered ? colors.onPrimary : colors.accentInk}>
              {ordered ? i + 1 : '•'}
            </AppText>
          </View>
          <AppText style={{ flex: 1 }}>{item}</AppText>
        </View>
      ))}
    </View>
  );
}
