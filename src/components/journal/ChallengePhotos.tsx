import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, Pressable, ScrollView, View } from 'react-native';
import { useI18n } from '@/i18n';
import { useJournal, type JournalEntry, type PickSource } from '@/storage/journal';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';
import { PhotoViewer } from './PhotoViewer';

/** Pellicule d'un défi : vignettes + bouton « Ajouter une photo » qui valide le défi. */
export function ChallengePhotos({ challengeId }: { challengeId: string }) {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const { entriesFor, uriOf, addPhoto } = useJournal();
  const { complete } = useProgress();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<JournalEntry | null>(null);
  const photos = entriesFor(challengeId);

  const pick = async (source: PickSource) => {
    setBusy(true);
    const res = await addPhoto(challengeId, source);
    setBusy(false);
    if (res.ok) complete(challengeId);
    else if (res.reason === 'denied') Alert.alert(t.journal.chooseTitle, t.journal.denied);
    else if (res.reason === 'error') Alert.alert(t.journal.chooseTitle, t.journal.error);
  };

  const choose = () =>
    Alert.alert(t.journal.chooseTitle, t.journal.validates, [
      { text: t.journal.camera, onPress: () => pick('camera') },
      { text: t.journal.library, onPress: () => pick('library') },
      { text: t.journal.cancel, style: 'cancel' },
    ]);

  return (
    <View style={{ gap: spacing.sm }}>
      {photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing.sm }}>
          {photos.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => setOpen(p)}
              accessibilityRole="imagebutton"
              accessibilityLabel={t.journal.date(p.createdAt)}
            >
              <Image source={{ uri: uriOf(p) }} style={{ width: 64, height: 64, borderRadius: radius.sm, backgroundColor: colors.surfaceAlt }} />
            </Pressable>
          ))}
        </ScrollView>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm }}>
        <Pressable
          onPress={choose}
          disabled={busy}
          accessibilityRole="button"
          accessibilityHint={t.journal.validates}
          style={({ pressed }) => ({
            minHeight: HIT - 4,
            paddingHorizontal: spacing.md,
            borderRadius: radius.pill,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            backgroundColor: colors.primary,
            opacity: pressed || busy ? 0.7 : 1,
          })}
        >
          {busy ? <ActivityIndicator color={colors.onPrimary} /> : null}
          <AppText variant="caption" color={colors.onPrimary}>
            ◎ {t.journal.addPhoto}
          </AppText>
        </Pressable>
        {photos.length > 0 && (
          <Pressable onPress={() => router.push('/carnet')} accessibilityRole="link" hitSlop={8}>
            <AppText variant="caption" color={colors.accentInk}>
              {t.journal.photosFor(photos.length)}
            </AppText>
          </Pressable>
        )}
      </View>
      <PhotoViewer entry={open} onClose={() => setOpen(null)} />
    </View>
  );
}
