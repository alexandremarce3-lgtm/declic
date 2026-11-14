import { useEffect, useState } from 'react';
import { LayoutAnimation, Linking, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { AdultGate } from '@/components/collab/AdultGate';
import { XpBar } from '@/components/rank/XpBar';
import { Button } from '@/components/ui/Button';
import { faq } from '@/content/locales/fr/collab';
import { useI18n } from '@/i18n';
import { QUEST_XP } from '@/lib/xp';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** FAQ interactive du TFP : chaque carte se déplie, « J'ai compris » la valide ; toutes validées = bonus d'XP. */
export default function FaqScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const c = t.collab;
  const { completeQuest, isQuestDone } = useProgress();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState<string | null>(faq[0].id);
  const [understood, setUnderstood] = useState<string[]>(isQuestDone('faq-tfp') ? faq.map((f) => f.id) : []);

  const allDone = understood.length === faq.length;
  useEffect(() => {
    if (allDone) completeQuest('faq-tfp');
  }, [allDone, completeQuest]);

  return (
    <AdultGate>
      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.md }}>
        <AppText muted>{c.faqIntro(QUEST_XP['faq-tfp'])}</AppText>
        <View style={{ gap: 4 }}>
          <XpBar progress={understood.length / faq.length} />
          <AppText variant="caption" muted>
            {c.faqProgress(understood.length, faq.length)}
          </AppText>
        </View>

        {faq.map((f) => {
          const isOpen = open === f.id;
          const ok = understood.includes(f.id);
          return (
            <View key={f.id} style={{ borderRadius: radius.lg, borderWidth: 1, borderColor: ok ? colors.success : isOpen ? colors.accent : colors.border, backgroundColor: colors.surface, overflow: 'hidden' }}>
              <Pressable
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setOpen(isOpen ? null : f.id);
                }}
                accessibilityRole="button"
                accessibilityState={{ expanded: isOpen }}
                style={{ flexDirection: 'row', gap: spacing.md, alignItems: 'center', padding: spacing.md, minHeight: HIT }}
              >
                <AppText variant="title">{f.icon}</AppText>
                <View style={{ flex: 1 }}>
                  <AppText variant="heading">{f.question}</AppText>
                  <AppText variant="caption" color={colors.accentInk}>
                    {f.short}
                  </AppText>
                </View>
                <AppText variant="heading" color={ok ? colors.success : colors.textMuted}>
                  {ok ? '✓' : isOpen ? '−' : '+'}
                </AppText>
              </Pressable>
              {isOpen && (
                <View style={{ paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm }}>
                  {f.body.map((p) => (
                    <AppText key={p}>{p}</AppText>
                  ))}
                  {f.links?.map((l) => (
                    <Pressable key={l.url} onPress={() => Linking.openURL(l.url)} accessibilityRole="link" hitSlop={8}>
                      <AppText variant="caption" color={colors.accentInk}>
                        ↗ {l.label}
                      </AppText>
                    </Pressable>
                  ))}
                  {!ok && (
                    <Button
                      kind="secondary"
                      label={c.understood}
                      onPress={() => {
                        setUnderstood((u) => [...u, f.id]);
                        const next = faq.find((x) => x.id !== f.id && !understood.includes(x.id));
                        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                        setOpen(next?.id ?? null);
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          );
        })}

        {allDone && (
          <AppText variant="heading" color={colors.success} style={{ textAlign: 'center' }}>
            ✓ {c.faqDone}
          </AppText>
        )}
      </ScrollView>
    </AdultGate>
  );
}
