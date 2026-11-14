import { Text, type TextProps } from 'react-native';
import { type } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Variant = keyof typeof type;

type Props = TextProps & {
  variant?: Variant;
  muted?: boolean;
  color?: string;
};

/** Texte du design system : une seule source pour tailles, graisses et couleurs. */
export function AppText({ variant = 'body', muted, color, style, ...rest }: Props) {
  const { colors } = useTheme();
  return (
    <Text
      {...rest}
      style={[type[variant], { color: color ?? (muted ? colors.textMuted : colors.text) }, style]}
    />
  );
}
