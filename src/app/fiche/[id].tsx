import { Stack, router, useLocalSearchParams } from 'expo-router';
import { useRef } from 'react';
import { Pressable, ScrollView, View, type NativeScrollEvent, type NativeSyntheticEvent } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { SheetBlock } from '@/components/sheet/SheetBlock';
import { useI18n } from '@/i18n';
import { useTiers } from '@/hooks/useTiers';
import { useProgress } from '@/storage/progress';

/** Distance au bas de la fiche (px) à partir de laquelle elle compte comme lue */
const END_MARGIN = 120;
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

/** Fiche générique : fondamentaux, composition et situations partagent ce même écran. */
export default function SheetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, catalog } = useI18n();
  const { getSheet, nextSheet, sections, sheetNumber } = catalog;
  const sheet = getSheet(id);
  const { colors, spacing, radius } = useTheme();
  const insets = useSafeAreaInsets();
  const { markSheetRead, stored, setReadingMode } = useProgress();
  const readingMode = stored.readingMode;
  const { isOpen } = useTiers();
  const viewport = useRef(0);

  // +10 XP quand on atteint la fin de la fiche (une seule fois par fiche)
  const reachedEnd = (offsetY: number, contentH: number) => {
    if (sheet && viewport.current > 0 && offsetY + viewport.current >= contentH - END_MARGIN) markSheetRead(sheet.id);
  };
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    reachedEnd(e.nativeEvent.contentOffset.y, e.nativeEvent.contentSize.height);

  if (!sheet) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg }}>
        <AppText>{t.sheet.notFound}</AppText>
      </View>
    );
  }

  // Accès direct (lien, « fiche suivante ») à une fiche d'un palier fermé
  if (!isOpen(sheet.tier)) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.md }}>
        <Stack.Screen options={{ title: '' }} />
        <AppText variant="display">🔒</AppText>
        <AppText variant="overline" color={colors.dangerInk}>
          {t.tiers.names[sheet.tier].toUpperCase()}
        </AppText>
        <AppText variant="title" style={{ textAlign: 'center' }}>
          {sheet.title}
        </AppText>
        <AppText muted style={{ textAlign: 'center' }}>
          {t.tiers.lockedSheet} {sheet.tier !== 'fondamental' ? t.tiers.conditions[sheet.tier] : ''}
        </AppText>
        <Pressable onPress={() => router.navigate('/')} accessibilityRole="button" style={{ minHeight: HIT, justifyContent: 'center' }}>
          <AppText variant="caption" color={colors.accentInk}>
            {t.tiers.back}
          </AppText>
        </Pressable>
      </View>
    );
  }

  const section = sections.find((s) => s.id === sheet.section);
  const hasSimple = Boolean(sheet.simpleBlocks?.length);
  const mode = hasSimple ? (readingMode ?? 'simple') : 'full';
  const blocks = mode === 'simple' && sheet.simpleBlocks ? sheet.simpleBlocks : sheet.blocks;
  const next = nextSheet(sheet);

  return (
    <>
      <Stack.Screen options={{ title: sheet.title }} />
      <ScrollView
        onLayout={(e) => (viewport.current = e.nativeEvent.layout.height)}
        onScroll={onScroll}
        scrollEventThrottle={250}
        onContentSizeChange={(_, h) => reachedEnd(0, h)} // fiche plus courte que l'écran
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: insets.bottom + spacing.xl,
          gap: spacing.lg,
        }}
      >
        <View style={{ gap: spacing.xs }}>
          <AppText variant="overline" color={colors.accentInk}>
            {section?.title.toUpperCase()} · {sheetNumber(sheet)} · {t.format.minutes(sheet.minutes)}
          </AppText>
          <AppText variant="title" accessibilityRole="header">
            {sheet.title}
          </AppText>
          <AppText muted>{sheet.summary}</AppText>
        </View>

        {/* Bascule Simple / Complet (fiches débutant) */}
        {hasSimple && (
          <View style={{ gap: spacing.xs }}>
            <View style={{ flexDirection: 'row', padding: 3, borderRadius: radius.pill, backgroundColor: colors.surfaceAlt }} accessibilityRole="tablist">
              {(['simple', 'full'] as const).map((m) => {
                const active = m === mode;
                return (
                  <Pressable
                    key={m}
                    onPress={() => setReadingMode(m)}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    style={{
                      flex: 1,
                      minHeight: HIT - 8,
                      borderRadius: radius.pill,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: active ? colors.primary : 'transparent',
                    }}
                  >
                    <AppText variant="caption" color={active ? colors.onPrimary : colors.text}>
                      {m === 'simple' ? t.simple.modeSimple : t.simple.modeFull}
                    </AppText>
                  </Pressable>
                );
              })}
            </View>
            <AppText variant="caption" muted style={{ textAlign: 'center' }}>
              {mode === 'simple' ? t.simple.modeSimpleLead : t.simple.modeFullLead}
            </AppText>
          </View>
        )}

        {blocks.map((b, i) => (
          <SheetBlock key={`${sheet.id}-${mode}-${i}`} block={b} />
        ))}

        {hasSimple && mode === 'simple' && (
          <Pressable
            onPress={() => setReadingMode('full')}
            accessibilityRole="button"
            style={({ pressed }) => ({
              minHeight: HIT,
              padding: spacing.md,
              borderRadius: radius.md,
              borderWidth: 1,
              borderColor: colors.primary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: spacing.md,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <AppText variant="title" color={colors.primaryInk}>
              ⊕
            </AppText>
            <View style={{ flex: 1 }}>
              <AppText variant="heading">{t.simple.goFurther}</AppText>
              <AppText variant="caption" muted>
                {t.simple.goFurtherLead}
              </AppText>
            </View>
          </Pressable>
        )}

        {next && (
          <Pressable
            onPress={() => router.replace({ pathname: '/fiche/[id]', params: { id: next.id } })}
            accessibilityRole="button"
            style={({ pressed }) => ({
              minHeight: HIT,
              padding: spacing.md,
              borderRadius: radius.md,
              backgroundColor: colors.surfaceAlt,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <View style={{ flex: 1 }}>
              <AppText variant="overline" muted>
                {t.sheet.next}
              </AppText>
              <AppText variant="heading">{next.title}</AppText>
            </View>
            <AppText variant="heading" muted>
              ›
            </AppText>
          </Pressable>
        )}
      </ScrollView>
    </>
  );
}
