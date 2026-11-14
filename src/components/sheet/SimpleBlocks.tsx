import { useState } from 'react';
import { View } from 'react-native';
import type { SceneId } from '@/content/types';
import { useI18n } from '@/i18n';
import { fonts } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { Scene } from '../illustrations/Scenes';

/** L'idée de la fiche en une phrase, en grand, façon citation de magazine. */
export function OneLiner({ body }: { body: string }) {
  const { colors, spacing } = useTheme();
  const { t } = useI18n();
  return (
    <View style={{ gap: spacing.xs, paddingLeft: spacing.md, borderLeftWidth: 3, borderLeftColor: colors.accent }}>
      <AppText variant="overline" color={colors.accentInk}>
        {t.simple.oneLiner}
      </AppText>
      <AppText style={{ fontFamily: fonts.serif, fontSize: 24, lineHeight: 32 }} accessibilityRole="header">
        {body}
      </AppText>
    </View>
  );
}

/** Une comparaison avec la vie de tous les jours. */
export function Analogy({ icon, body }: { icon: string; body: string }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  return (
    <View style={{ flexDirection: 'row', gap: spacing.md, padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surfaceAlt, alignItems: 'center' }}>
      <AppText style={{ fontSize: 34, lineHeight: 40 }} accessible={false}>
        {icon}
      </AppText>
      <View style={{ flex: 1, gap: 2 }}>
        <AppText variant="overline" color={colors.primaryInk}>
          {t.simple.analogy}
        </AppText>
        <AppText>{body}</AppText>
      </View>
    </View>
  );
}

/**
 * Exemples dessinés côte à côte (2 ou 3), chacun avec son réglage et ce qu'on voit.
 * À 3 images, elles passent l'une sous l'autre pour rester grandes sur téléphone.
 */
export function Compare({ title, items }: { title?: string; items: { scene: SceneId; label: string; caption: string }[] }) {
  const { colors, spacing, radius } = useTheme();
  const [width, setWidth] = useState(0);
  const stacked = items.length > 2;
  const gap = spacing.sm;
  const w = stacked ? width : (width - gap) / 2;

  return (
    <View style={{ gap: spacing.sm }} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
      {title && (
        <AppText variant="overline" muted accessibilityRole="header">
          {title.toUpperCase()}
        </AppText>
      )}
      {width > 0 && (
        <View style={{ flexDirection: stacked ? 'column' : 'row', gap }}>
          {items.map((it) => (
            <View
              key={it.scene + it.label}
              style={{ width: w, gap: spacing.xs }}
              accessible
              accessibilityRole="image"
              accessibilityLabel={`${it.label}. ${it.caption}`}
            >
              <View style={{ borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
                <Scene id={it.scene} width={w} />
              </View>
              <AppText variant="heading" style={{ fontSize: 16, lineHeight: 21 }}>
                {it.label}
              </AppText>
              <AppText variant="caption" muted>
                {it.caption}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
