import { Alert, Image, Modal, Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useI18n } from '@/i18n';
import { useJournal, type JournalEntry } from '@/storage/journal';
import { HIT, palettes } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';
import { AppText } from '../AppText';

/** Visionneuse plein écran d'une photo du carnet (toujours sur fond « chambre noire »). */
export function PhotoViewer({ entry, onClose }: { entry: JournalEntry | null; onClose: () => void }) {
  const { colors, spacing, radius } = useTheme();
  const { t, catalog } = useI18n();
  const { uriOf, remove } = useJournal();
  const insets = useSafeAreaInsets();
  const dark = palettes.dark;

  if (!entry) return null;
  const challenge = catalog.getChallenge(entry.challengeId);
  const ratio = entry.width && entry.height ? entry.width / entry.height : 1;

  const confirmDelete = () =>
    Alert.alert(t.journal.deleteTitle, t.journal.deleteBody, [
      { text: t.journal.cancel, style: 'cancel' },
      {
        text: t.journal.deleteOk,
        style: 'destructive',
        onPress: () => {
          remove(entry.id);
          onClose();
        },
      },
    ]);

  return (
    <Modal visible animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View style={{ flex: 1, backgroundColor: dark.bg, paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.md }}>
        <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: spacing.md }}>
          <Image
            source={{ uri: uriOf(entry) }}
            style={{ width: '100%', aspectRatio: ratio, maxHeight: '100%', borderRadius: radius.sm }}
            resizeMode="contain"
            accessibilityLabel={t.journal.photoA11y(challenge?.title ?? '', t.journal.date(entry.createdAt))}
          />
        </View>
        <View style={{ paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.xs }}>
          <AppText variant="overline" color={dark.accentInk}>
            {t.journal.date(entry.createdAt).toUpperCase()}
          </AppText>
          <AppText variant="title" color={dark.text}>
            {challenge?.title}
          </AppText>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.sm }}>
            <Pressable onPress={confirmDelete} accessibilityRole="button" style={{ minHeight: HIT, justifyContent: 'center' }}>
              <AppText variant="caption" color={dark.dangerInk}>
                {t.journal.delete}
              </AppText>
            </Pressable>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              style={({ pressed }) => ({
                minHeight: HIT,
                paddingHorizontal: spacing.lg,
                borderRadius: radius.pill,
                justifyContent: 'center',
                backgroundColor: colors.accent,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <AppText variant="mono" color={colors.onAccent}>
                {t.journal.close}
              </AppText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
