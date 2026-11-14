import { router, type Href } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { QUEST_XP } from '@/lib/xp';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Quest = { key: string; title: string; lead: string; href: Href; done: boolean; xp: number; adultOnly?: boolean };

/** Parcours Modèle : quêtes d'accueil (moodboard, charte, premier accord) puis de compétence (lumière, présence). */
export default function ModelPath() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const m = t.model;
  const { isQuestDone, isSheetRead, stored } = useProgress();
  const insets = useSafeAreaInsets();
  const adult = stored.profile.adult === true;
  const presence = catalog.sheets.filter((s) => s.section === 'presence');

  const onboarding: Quest[] = [
    { key: 'moodboard', title: m.quests.moodboard, lead: m.quests.moodboardLead, href: '/modele/moodboard', done: isQuestDone('moodboard'), xp: QUEST_XP.moodboard },
    { key: 'charte-tfp', title: m.quests.charter, lead: m.quests.charterLead, href: '/collab/charte', done: isQuestDone('charte-tfp'), xp: QUEST_XP['charte-tfp'], adultOnly: true },
    { key: 'premier-accord', title: m.quests.agreement, lead: m.quests.agreementLead, href: '/collab/accord', done: isQuestDone('premier-accord'), xp: QUEST_XP['premier-accord'], adultOnly: true },
  ];
  const skills: Quest[] = [
    { key: 'quiz', title: m.quests.lightQuiz, lead: m.quests.lightQuizLead, href: '/modele/quiz', done: isQuestDone('quiz-lumiere-modele'), xp: QUEST_XP['quiz-lumiere-modele'] },
    ...presence.map((s) => ({ key: s.id, title: s.title, lead: s.summary, href: { pathname: '/fiche/[id]', params: { id: s.id } } as Href, done: isSheetRead(s.id), xp: 10 })),
  ];
  const all = [...onboarding, ...skills];
  const done = all.filter((q) => q.done).length;

  const Row = ({ q }: { q: Quest }) => {
    const locked = q.adultOnly && !adult;
    return (
      <Pressable
        onPress={() => router.push(q.href)}
        accessibilityRole="button"
        accessibilityLabel={`${q.title}. ${q.lead}${q.done ? `. ${m.done}` : ''}`}
        style={({ pressed }) => ({
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.md,
          minHeight: HIT + spacing.md,
          padding: spacing.md,
          borderRadius: radius.lg,
          backgroundColor: colors.surface,
          borderWidth: 1,
          borderColor: q.done ? colors.success : colors.border,
          opacity: pressed ? 0.7 : locked ? 0.6 : 1,
        })}
      >
        <AppText variant="heading" color={q.done ? colors.success : colors.textMuted} style={{ width: 24, textAlign: 'center' }}>
          {q.done ? '✓' : locked ? '🔞' : '○'}
        </AppText>
        <View style={{ flex: 1 }}>
          <AppText variant="heading">{q.title}</AppText>
          <AppText variant="caption" muted>
            {q.lead}
          </AppText>
        </View>
        <AppText variant="mono" color={q.done ? colors.success : colors.accentInk}>
          {q.done ? '✓' : t.xp.gain(q.xp)}
        </AppText>
      </Pressable>
    );
  };

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
      <AppText muted>{m.intro}</AppText>
      <AppText variant="display" color={colors.accentInk}>
        {done}
        <AppText variant="title" muted>
          {' '}/ {all.length}
        </AppText>
      </AppText>

      <AppText variant="overline" muted accessibilityRole="header">
        {m.onboardingTitle}
      </AppText>
      {onboarding.map((q) => (
        <Row key={q.key} q={q} />
      ))}

      <AppText variant="overline" muted accessibilityRole="header" style={{ marginTop: spacing.md }}>
        {m.skillsTitle}
      </AppText>
      {skills.map((q) => (
        <Row key={q.key} q={q} />
      ))}

      <AppText variant="caption" muted style={{ marginTop: spacing.md }}>
        {m.badgesNote}
      </AppText>
    </ScrollView>
  );
}
