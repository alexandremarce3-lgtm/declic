import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

const H = 150;
/** Largeur de référence : les traits sont enregistrés dans un repère fixe 360 × 150, quelle que soit la taille de l'écran */
const W = 360;

/**
 * Zone de signature au doigt. Les traits sont gardés en chemins SVG (texte),
 * réutilisés tels quels dans le PDF de l'accord.
 * `onDrawing` permet au parent de bloquer le défilement pendant qu'on signe.
 */
export function SignaturePad({
  onChange,
  onDrawing,
  clearLabel,
  placeholder,
}: {
  onChange: (paths: string[]) => void;
  onDrawing?: (drawing: boolean) => void;
  clearLabel: string;
  placeholder: string;
}) {
  const { colors, spacing, radius } = useTheme();
  const [paths, setPaths] = useState<string[]>([]);
  const current = useRef('');
  const width = useRef(W);
  const pt = (x: number, y: number) => `${((x * W) / width.current).toFixed(1)} ${y.toFixed(1)}`;
  const [live, setLive] = useState('');

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (e) => {
          onDrawing?.(true);
          const { locationX: x, locationY: y } = e.nativeEvent;
          current.current = `M${pt(x, y)}`;
          setLive(current.current);
        },
        onPanResponderMove: (e) => {
          const { locationX: x, locationY: y } = e.nativeEvent;
          current.current += ` L${pt(x, y)}`;
          setLive(current.current);
        },
        onPanResponderRelease: () => {
          onDrawing?.(false);
          const stroke = current.current;
          current.current = '';
          setLive('');
          setPaths((p) => {
            const next = [...p, stroke];
            onChange(next);
            return next;
          });
        },
      }),
    [onChange, onDrawing],
  );

  return (
    <View style={{ gap: spacing.xs }}>
      <View
        {...pan.panHandlers}
        onLayout={(e) => (width.current = e.nativeEvent.layout.width || W)}
        accessible
        accessibilityLabel={placeholder}
        style={{ height: H, borderRadius: radius.md, borderWidth: 1.5, borderStyle: 'dashed', borderColor: colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}
      >
        {paths.length === 0 && !live && (
          <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
            <AppText variant="caption" muted>
              {placeholder}
            </AppText>
          </View>
        )}
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" pointerEvents="none">
          {[...paths, live].filter(Boolean).map((d, i) => (
            <Path key={i} d={d} stroke={colors.text} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          ))}
        </Svg>
        <View pointerEvents="none" style={{ position: 'absolute', left: spacing.md, right: spacing.md, bottom: 28, height: 1, backgroundColor: colors.border }} />
      </View>
      {paths.length > 0 && (
        <Pressable
          onPress={() => {
            setPaths([]);
            onChange([]);
          }}
          accessibilityRole="button"
          hitSlop={8}
          style={{ alignSelf: 'flex-end' }}
        >
          <AppText variant="caption" color={colors.accentInk}>
            {clearLabel}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

export const SIGNATURE_HEIGHT = H;
