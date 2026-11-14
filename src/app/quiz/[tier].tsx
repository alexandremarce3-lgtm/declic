import * as Haptics from 'expo-haptics';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { XpBar } from '@/components/rank/XpBar';
import type { TierId } from '@/content';
import { useTiers } from '@/hooks/useTiers';
import { useI18n } from '@/i18n';
import { QUIZ_LENGTH, TIERS, creditableItems, drawQuiz, passMark, type DrawnQuestion } from '@/lib/tiers';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

type Phase = 'intro' | 'question' | 'result';

/**
 * Test « Valider ses acquis » d'un palier : 15 questions tirées au hasard, réponse commentée,
 * 80 % pour réussir. Réussite → palier suivant ouvert + XP des fiches et défis sautés.
 */
export default function QuizScreen() {
  const params = useLocalSearchParams<{ tier: string }>();
  const tier = (TIERS.includes(params.tier as TierId) ? params.tier : 'fondamental') as TierId;
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { stored, passQuiz } = useProgress();
  const { byId } = useTiers();
  const insets = useSafeAreaInsets();

  const status = byId[tier];
  const nextName = status.next ? t.tiers.names[status.next] : '';
  const [phase, setPhase] = useState<Phase>('intro');
  const [questions, setQuestions] = useState<DrawnQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [earned, setEarned] = useState(0);

  const start = () => {
    setQuestions(drawQuiz(catalog.quiz, tier));
    setIndex(0);
    setPicked(null);
    setAnswers([]);
    setPhase('question');
  };

  const q = questions[index];
  const score = answers.filter(Boolean).length;
  const passed = score >= passMark();

  const choose = (i: number) => {
    if (picked !== null || !q) return;
    const ok = i === q.correct;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
    setPicked(i);
    setAnswers((a) => [...a, ok]);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }
    // Fin du test
    const finalScore = answers.filter(Boolean).length;
    if (finalScore >= passMark() && !stored.quizPassed[tier]) {
      const credit = creditableItems(tier, catalog.sheets, catalog.challenges, stored);
      setEarned(status.quizReward);
      passQuiz(tier, finalScore, questions.length, credit);
    } else setEarned(0);
    setPhase('result');
  };

  const Button = ({ label, onPress, primary = true }: { label: string; onPress: () => void; primary?: boolean }) => (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => ({
        minHeight: HIT,
        paddingHorizontal: spacing.lg,
        borderRadius: radius.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primary ? colors.accent : 'transparent',
        borderWidth: primary ? 0 : 1,
        borderColor: colors.border,
        opacity: pressed ? 0.8 : 1,
      })}
    >
      <AppText variant="mono" color={primary ? colors.onAccent : colors.text}>
        {label}
      </AppText>
    </Pressable>
  );

  const body = (() => {
    if (phase === 'intro')
      return (
        <View style={{ gap: spacing.lg }}>
          <AppText variant="overline" color={colors.accentInk}>
            {t.tiers.levels[tier]}
          </AppText>
          <AppText variant="display">{t.quiz.title(t.tiers.names[tier])}</AppText>
          <AppText>{t.quiz.intro(QUIZ_LENGTH, passMark())}</AppText>
          {stored.quizPassed[tier] ? (
            <AppText color={colors.success}>✓ {t.quiz.alreadyPassed}</AppText>
          ) : (
            <View style={{ padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surfaceAlt, borderLeftWidth: 3, borderLeftColor: colors.accent }}>
              <AppText>{status.quizReward > 0 ? t.quiz.reward(status.quizReward, nextName) : t.quiz.rewardNoXp(nextName)}</AppText>
            </View>
          )}
          <Button label={t.quiz.start} onPress={start} />
        </View>
      );

    if (phase === 'question' && q) {
      const answered = picked !== null;
      return (
        <View style={{ gap: spacing.lg }}>
          <View style={{ gap: spacing.xs }}>
            <AppText variant="overline" muted>
              {t.quiz.progress(index + 1, questions.length)}
            </AppText>
            <XpBar progress={(index + (answered ? 1 : 0)) / questions.length} height={4} />
          </View>
          <AppText variant="title" accessibilityRole="header" accessibilityLiveRegion="polite">
            {q.question}
          </AppText>
          <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup">
            {q.order.map((orig, i) => {
              const isRight = i === q.correct;
              const isPicked = i === picked;
              const bg = !answered ? colors.surface : isRight ? colors.primary : isPicked ? colors.danger : colors.surface;
              const fg = answered && (isRight || isPicked) ? (isRight ? colors.onPrimary : colors.onDanger) : colors.text;
              return (
                <Pressable
                  key={orig}
                  onPress={() => choose(i)}
                  disabled={answered}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isPicked, disabled: answered }}
                  accessibilityLabel={t.quiz.choiceA11y(i + 1, q.choices[orig])}
                  style={({ pressed }) => ({
                    minHeight: HIT + 4,
                    padding: spacing.md,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: answered && isRight ? colors.primary : colors.border,
                    backgroundColor: bg,
                    justifyContent: 'center',
                    opacity: answered && !isRight && !isPicked ? 0.5 : pressed ? 0.7 : 1,
                  })}
                >
                  <AppText color={fg}>
                    {answered && isRight ? '✓ ' : answered && isPicked ? '✕ ' : ''}
                    {q.choices[orig]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
          {answered && (
            <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
              <AppText variant="heading" color={picked === q.correct ? colors.success : colors.dangerInk}>
                {picked === q.correct ? t.quiz.right : t.quiz.wrong}
              </AppText>
              <AppText muted>{q.explain}</AppText>
              <Button label={index + 1 < questions.length ? t.quiz.next : t.quiz.finish} onPress={next} />
            </View>
          )}
        </View>
      );
    }

    // Résultat
    const missed = questions.filter((_, i) => !answers[i]);
    return (
      <View style={{ gap: spacing.lg, alignItems: 'stretch' }}>
        <AppText variant="overline" color={passed ? colors.success : colors.dangerInk}>
          {t.tiers.names[tier].toUpperCase()}
        </AppText>
        <AppText variant="display">{passed ? t.quiz.passedTitle : t.quiz.failedTitle}</AppText>
        <AppText variant="display" color={passed ? colors.accentInk : colors.textMuted} style={{ fontSize: 56, lineHeight: 62 }}>
          {t.quiz.score(score, questions.length)}
        </AppText>
        <AppText>{passed ? t.quiz.passedBody(nextName) : t.quiz.failedBody(passMark())}</AppText>
        {passed && earned > 0 && (
          <AppText variant="title" color={colors.accentInk}>
            {t.xp.gain(earned)}
          </AppText>
        )}
        {missed.length > 0 && (
          <View style={{ gap: spacing.sm }}>
            <AppText variant="overline" muted>
              {t.quiz.review}
            </AppText>
            {missed.map((m) => (
              <View key={m.id} style={{ padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: 4 }}>
                <AppText variant="heading" style={{ fontSize: 15 }}>
                  {m.question}
                </AppText>
                <AppText variant="caption" color={colors.success}>
                  ✓ {m.choices[m.answer]}
                </AppText>
                <AppText variant="caption" muted>
                  {m.explain}
                </AppText>
              </View>
            ))}
          </View>
        )}
        {!passed && <Button label={t.quiz.retry} onPress={start} />}
        <Button label={t.quiz.done} onPress={() => router.navigate('/')} primary={passed} />
      </View>
    );
  })();

  return (
    <>
      <Stack.Screen options={{ title: t.nav.quiz }} />
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl }}>{body}</ScrollView>
    </>
  );
}
