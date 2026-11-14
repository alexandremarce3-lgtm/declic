import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/i18n';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/** Accès rapide au diagnostic depuis l'accueil : un bouton par symptôme. */
export function SosShortcut() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { problems } = catalog;
  const open = (id?: string) => router.push(id ? { pathname: '/sos', params: { probleme: id } } : '/sos');

  return (
    <View
      style={{
        padding: spacing.md,
        borderRadius: radius.lg,
        borderWidth: 1.5,
        borderColor: colors.danger,
        gap: spacing.sm + 4,
      }}
    >
      <Pressable
        onPress={() => open()}
        accessibilityRole="button"
        accessibilityLabel={t.sos.shortcutA11y}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          opacity: pressed ? 0.6 : 1,
        })}
      >
        <View style={{ gap: 2, flex: 1 }}>
          <AppText variant="heading" color={colors.dangerInk}>{t.sos.shortcutTitle}</AppText>
          <AppText variant="caption" muted>
            {t.sos.shortcutLead}
          </AppText>
        </View>
        <AppText variant="heading" muted>
          ›
        </AppText>
      </Pressable>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {problems.map((p) => (
          <Pressable
            key={p.id}
            onPress={() => open(p.id)}
            accessibilityRole="button"
            accessibilityLabel={p.title}
            style={({ pressed }) => ({
              minHeight: HIT - 8,
              paddingHorizontal: spacing.md,
              borderRadius: radius.pill,
              backgroundColor: colors.surfaceAlt,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.xs + 2,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppText variant="caption" color={colors.dangerInk}>
              {p.glyph}
            </AppText>
            <AppText variant="caption">{p.short}</AppText>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
