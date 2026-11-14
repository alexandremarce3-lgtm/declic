import { router, type Href } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/**
 * Accès de l'accueil à l'espace collaborations (masqué pour une personne déclarée mineure)
 * et au parcours Modèle (profil modèle ou les deux).
 */
export function CollabShortcuts() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { stored } = useProgress();
  const { role, adult } = stored.profile;

  const cards: { key: string; href: Href; title: string; lead: string; icon: string }[] = [];
  if (role === 'modele' || role === 'both') cards.push({ key: 'model', href: '/modele', title: t.model.homeTitle, lead: t.model.homeLead, icon: '✨' });
  if (adult !== false) cards.push({ key: 'collab', href: '/collab', title: t.collab.homeTitle, lead: t.collab.homeLead, icon: '🤝' });
  if (!cards.length) return null;

  return (
    <View style={{ gap: spacing.sm }}>
      {cards.map((c) => (
        <Pressable
          key={c.key}
          onPress={() => router.push(c.href)}
          accessibilityRole="button"
          accessibilityLabel={`${c.title}. ${c.lead}`}
          style={({ pressed }) => ({
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            minHeight: HIT + spacing.md,
            padding: spacing.md,
            borderRadius: radius.lg,
            backgroundColor: colors.surface,
            borderWidth: 1.5,
            borderColor: colors.primary,
            opacity: pressed ? 0.7 : 1,
          })}
        >
          <AppText variant="title">{c.icon}</AppText>
          <View style={{ flex: 1 }}>
            <AppText variant="heading">{c.title}</AppText>
            <AppText variant="caption" muted>
              {c.lead}
            </AppText>
          </View>
          <AppText variant="heading" muted>
            ›
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}
