import { useState } from 'react';
import { FlatList, Image, Pressable, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { PhotoViewer } from '@/components/journal/PhotoViewer';
import { useI18n } from '@/i18n';
import { useJournal, type JournalEntry } from '@/storage/journal';
import { useTheme } from '@/theme/useTheme';

const COLUMNS = 3;

/** Galerie de progression : toutes les photos de défis, la plus récente en premier. */
export default function Journal() {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { entries, uriOf } = useJournal();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [open, setOpen] = useState<JournalEntry | null>(null);

  const gap = spacing.sm;
  const tile = (width - spacing.md * 2 - gap * (COLUMNS - 1)) / COLUMNS;

  return (
    <>
      <FlatList
        data={entries}
        keyExtractor={(e) => e.id}
        numColumns={COLUMNS}
        columnWrapperStyle={{ gap }}
        contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap }}
        ListHeaderComponent={
          <AppText muted style={{ marginBottom: spacing.sm }}>
            {entries.length ? t.journal.intro : t.journal.empty}
          </AppText>
        }
        renderItem={({ item, index }) => {
          const challenge = catalog.getChallenge(item.challengeId);
          const date = t.journal.date(item.createdAt);
          return (
            <Pressable
              onPress={() => setOpen(item)}
              accessibilityRole="imagebutton"
              accessibilityLabel={t.journal.photoA11y(challenge?.title ?? '', date)}
              style={({ pressed }) => ({ width: tile, opacity: pressed ? 0.75 : 1, gap: 4 })}
            >
              <View style={{ borderRadius: radius.sm, overflow: 'hidden', backgroundColor: colors.surfaceAlt }}>
                <Image source={{ uri: uriOf(item) }} style={{ width: tile, height: tile }} />
                {/* Numéro de vue, comme sur une planche-contact */}
                <View style={{ position: 'absolute', left: 4, bottom: 4, paddingHorizontal: 4, borderRadius: 3, backgroundColor: colors.bg + 'CC' }}>
                  <AppText variant="overline" style={{ fontSize: 9 }} color={colors.accentInk}>
                    {String(entries.length - index).padStart(2, '0')}
                  </AppText>
                </View>
              </View>
              <AppText variant="caption" muted numberOfLines={1}>
                {challenge?.title}
              </AppText>
            </Pressable>
          );
        }}
      />
      <PhotoViewer entry={open} onClose={() => setOpen(null)} />
    </>
  );
}
