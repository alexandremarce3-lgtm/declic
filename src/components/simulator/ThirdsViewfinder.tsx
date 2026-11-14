import * as Haptics from 'expo-haptics';
import { useMemo, useRef, useState } from 'react';
import { PanResponder, Pressable, StyleSheet, View } from 'react-native';
import { useI18n } from '@/i18n';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/**
 * Viseur à grille : faites glisser le sujet (un arbre) dans le cadre,
 * l'app indique s'il tombe sur une intersection, une ligne ou au centre.
 * Positions en fractions du cadre (0–1). Aucune dépendance : PanResponder natif.
 */

const H = 220;
const SUBJECT = 44;
const TOLERANCE = 0.06; // distance « aimantée » à une ligne

type Verdict = 'strong' | 'center' | 'line' | 'off';
const GOOD: Record<Verdict, boolean> = { strong: true, line: true, center: false, off: false };

function judge(x: number, y: number): Verdict {
  const nearX = [1 / 3, 2 / 3].some((l) => Math.abs(x - l) < TOLERANCE);
  const nearY = [1 / 3, 2 / 3].some((l) => Math.abs(y - l) < TOLERANCE);
  const centered = Math.abs(x - 0.5) < 0.08 && Math.abs(y - 0.5) < 0.08;
  if (nearX && nearY) return 'strong';
  if (centered) return 'center';
  if (nearX || nearY) return 'line';
  return 'off';
}

export function ThirdsViewfinder() {
  const { colors, spacing, radius } = useTheme();
  const [width, setWidth] = useState(0);
  const [pos, setPos] = useState({ x: 0.5, y: 0.5 });
  const [grid, setGrid] = useState(true);
  const start = useRef(pos);
  const current = useRef(pos);
  current.current = pos;
  const last = useRef<boolean>(false);
  const size = useRef({ w: 1 });
  size.current.w = Math.max(1, width);

  const { t } = useI18n();
  const v = t.thirds;
  const verdictKey = judge(pos.x, pos.y);
  const verdict = { ...v.verdicts[verdictKey], good: GOOD[verdictKey] };

  const pan = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false, // garde le geste face au ScrollView
        onPanResponderGrant: () => {
          start.current = current.current;
        },
        onPanResponderMove: (_, g) => {
          const x = Math.min(0.95, Math.max(0.05, start.current.x + g.dx / size.current.w));
          const y = Math.min(0.92, Math.max(0.08, start.current.y + g.dy / H));
          const good = judge(x, y) === 'strong';
          if (good && !last.current) Haptics.selectionAsync().catch(() => {});
          last.current = good;
          setPos({ x, y });
        },
      }),
    [],
  );

  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: radius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: spacing.md,
        gap: spacing.md,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <AppText variant="overline" muted>
          {v.title}
        </AppText>
        <Pressable
          onPress={() => setGrid((g) => !g)}
          accessibilityRole="switch"
          accessibilityState={{ checked: grid }}
          hitSlop={12}
        >
          <AppText variant="caption" color={colors.accentInk}>
            {grid ? v.hideGrid : v.showGrid}
          </AppText>
        </Pressable>
      </View>

      <View
        onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
        style={styles.frame}
        accessible
        accessibilityLabel={v.a11y(verdict.title)}
        accessibilityHint={v.hint}
      >
        {/* Paysage minimaliste */}
        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#BFD7EA' }]} />
        <View style={[styles.sea, { top: H * 0.62 }]} />
        <View style={[styles.sand, { top: H * 0.8 }]} />

        {/* Grille des tiers */}
        {grid &&
          [1, 2].map((n) => (
            <View key={`v${n}`} pointerEvents="none" style={[styles.lineV, { left: `${(n / 3) * 100}%` }]} />
          ))}
        {grid &&
          [1, 2].map((n) => (
            <View key={`h${n}`} pointerEvents="none" style={[styles.lineH, { top: (n / 3) * H }]} />
          ))}

        {/* Sujet déplaçable */}
        {width > 0 && (
          <View
            {...pan.panHandlers}
            style={[
              styles.subject,
              {
                left: pos.x * width - SUBJECT / 2,
                top: pos.y * H - SUBJECT / 2,
                borderColor: verdict.good ? colors.success : 'transparent',
              },
            ]}
          >
            <View style={styles.crown} />
            <View style={styles.trunk} />
          </View>
        )}
      </View>

      <View style={{ gap: spacing.xs }} accessibilityLiveRegion="polite">
        <AppText variant="heading" color={verdict.good ? colors.success : colors.text}>
          {verdict.good ? '✓ ' : ''}
          {verdict.title}
        </AppText>
        <AppText muted>{verdict.detail}</AppText>
      </View>

      <Pressable
        onPress={() => setPos({ x: 0.5, y: 0.5 })}
        accessibilityRole="button"
        style={({ pressed }) => ({ minHeight: HIT, justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}
      >
        <AppText variant="caption" color={colors.accentInk}>
          {v.recenter}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { height: H, borderRadius: 18, overflow: 'hidden' },
  sea: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#5B8DB8' },
  sand: { position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: '#E9D8A6' },
  lineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(255,255,255,0.85)' },
  lineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(255,255,255,0.85)' },
  subject: {
    position: 'absolute',
    width: SUBJECT,
    height: SUBJECT,
    borderRadius: SUBJECT / 2,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crown: { width: 26, height: 26, borderRadius: 13, backgroundColor: '#2D6A4F' },
  trunk: { width: 5, height: 10, backgroundColor: '#5C4033' },
});
