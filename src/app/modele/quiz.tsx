import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { Scene } from '@/components/illustrations/Scenes';
import { XpBar } from '@/components/rank/XpBar';
import { Button } from '@/components/ui/Button';
import type { LightQuestion } from '@/content/collabModel';
import { useCollab } from '@/hooks/useCollab';
import { useI18n } from '@/i18n';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const PASS = 5;

function shuffled<T>(list: T[]) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Drawn = LightQuestion & { order: number[] };
const draw = (bank: LightQuestion[]): Drawn[] => shuffled(bank).map((q) => ({ ...q, order: shuffled([0, 1, 2, 3]) }));

/** Quiz visuel « La lumière sur un visage » : d'où vient la lumière, et ce qu'elle fait aux volumes. */
export default function LightQuiz() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const m = t.model;
  const { completeQuest } = useProgress();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { lightQuiz } = useCollab();
  const [questions, setQuestions] = useState<Drawn[]>(() => draw(lightQuiz));
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = questions[index];

  const choose = (orig: number) => {
    if (picked !== null) return;
    const ok = orig === q.answer;
    Haptics.notificationAsync(ok ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error).catch(() => {});
    setPicked(orig);
    if (ok) setScore((s) => s + 1);
  };

  const next = () => {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
    } else {
      setFinished(true);
      if (score >= PASS) completeQuest('quiz-lumiere-modele');
    }
  };

  const restart = () => {
    setQuestions(draw(lightQuiz));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  };

  if (finished) {
    const passed = score >= PASS;
    return (
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <AppText variant="display">{passed ? m.quizPassed : m.quizFailed}</AppText>
        <AppText variant="display" color={passed ? colors.accentInk : colors.textMuted} style={{ fontSize: 56, lineHeight: 62 }}>
          {score} / {questions.length}
        </AppText>
        <AppText>{passed ? m.quizPassedBody : m.quizFailedBody(PASS)}</AppText>
        {!passed && <Button label={m.retry} onPress={restart} />}
        <Button kind={passed ? 'primary' : 'secondary'} label={m.backToPath} onPress={() => router.back()} />
      </ScrollView>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
      <View style={{ gap: 4 }}>
        <AppText variant="overline" muted>
          {t.quiz.progress(index + 1, questions.length)}
        </AppText>
        <XpBar progress={(index + (picked !== null ? 1 : 0)) / questions.length} height={4} />
      </View>
      <AppText variant="title">{q.scene === 'face-soft' ? m.quizQuestionSoft : m.quizQuestion}</AppText>
      <View style={{ borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }} accessible accessibilityRole="image" accessibilityLabel={m.quizImageA11y}>
        <Scene id={q.scene} width={width - spacing.md * 2} />
      </View>
      <View style={{ gap: spacing.sm }} accessibilityRole="radiogroup">
        {q.order.map((orig) => {
          const answered = picked !== null;
          const right = orig === q.answer;
          const mine = orig === picked;
          return (
            <Pressable
              key={orig}
              onPress={() => choose(orig)}
              disabled={answered}
              accessibilityRole="radio"
              accessibilityState={{ checked: mine, disabled: answered }}
              style={{
                minHeight: HIT,
                padding: spacing.md,
                borderRadius: radius.md,
                justifyContent: 'center',
                borderWidth: 1,
                borderColor: answered && right ? colors.primary : colors.border,
                backgroundColor: answered && right ? colors.primary : answered && mine ? colors.danger : colors.surface,
                opacity: answered && !right && !mine ? 0.5 : 1,
              }}
            >
              <AppText color={answered && (right || mine) ? (right ? colors.onPrimary : colors.onDanger) : colors.text}>
                {answered && right ? '✓ ' : answered && mine ? '✕ ' : ''}
                {q.choices[orig]}
              </AppText>
            </Pressable>
          );
        })}
      </View>
      {picked !== null && (
        <View style={{ gap: spacing.sm }} accessibilityLiveRegion="polite">
          <AppText variant="heading" color={picked === q.answer ? colors.success : colors.dangerInk}>
            {picked === q.answer ? t.quiz.right : t.quiz.wrong}
          </AppText>
          <AppText muted>{q.explain}</AppText>
          <Button label={index + 1 < questions.length ? t.quiz.next : t.quiz.finish} onPress={next} />
        </View>
      )}
    </ScrollView>
  );
}
