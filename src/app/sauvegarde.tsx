import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useEffect, useState, type ReactNode } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Switch, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from '@/components/AppText';
import { useI18n } from '@/i18n';
import { buildBackup, formatBytes, parseBackup } from '@/lib/backup';
import { useJournal } from '@/storage/journal';
import { useProgress } from '@/storage/progress';
import { HIT } from '@/theme/tokens';
import { useTheme } from '@/theme/useTheme';

const LAST_KEY = '@declic/last-backup';

/**
 * Sauvegarde : exporter la progression (et le carnet) dans un fichier JSON à garder où l'on veut,
 * puis l'importer sur ce téléphone ou un autre. Aucun compte, aucun serveur.
 */
export default function BackupScreen() {
  const { colors, spacing, radius } = useTheme();
  const { t } = useI18n();
  const b = t.backup;
  const { stored, restore } = useProgress();
  const journal = useJournal();
  const insets = useSafeAreaInsets();
  const [withPhotos, setWithPhotos] = useState(true);
  const [busy, setBusy] = useState<'export' | 'import' | null>(null);
  const [last, setLast] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_KEY).then(setLast).catch(() => {});
  }, []);

  const photoBytes = journal.photosSize();
  const units: [string, string, string] = [b.units.b, b.units.kb, b.units.mb];

  const doExport = async () => {
    setBusy('export');
    try {
      const backup = buildBackup(stored, await journal.exportEntries(withPhotos));
      const day = backup.exportedAt.slice(0, 10);
      const file = new File(Paths.cache, `declic-sauvegarde-${day}.json`);
      file.create({ overwrite: true });
      await file.write(JSON.stringify(backup));
      if (!(await Sharing.isAvailableAsync())) throw new Error('sharing');
      await Sharing.shareAsync(file.uri, { mimeType: 'application/json', UTI: 'public.json', dialogTitle: b.shareTitle });
      await AsyncStorage.setItem(LAST_KEY, backup.exportedAt);
      setLast(backup.exportedAt);
    } catch {
      Alert.alert(b.exportTitle, b.exportError);
    } finally {
      setBusy(null);
    }
  };

  const doImport = async () => {
    setBusy('import');
    try {
      const picked = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
      if (picked.canceled || !picked.assets?.length) return;
      const parsed = parseBackup(await new File(picked.assets[0].uri).text());
      if (!parsed.ok) {
        Alert.alert(b.importTitle, b.errors[parsed.error]);
        return;
      }
      const { backup } = parsed;
      const p = backup.progress;
      const summary = b.summary(
        t.journal.date(backup.exportedAt),
        Object.keys(p.sheets ?? {}).length,
        Object.keys(p.challenges ?? {}).length,
        backup.journal.filter((e) => e.data).length,
      );
      Alert.alert(b.importTitle, `${summary}\n\n${b.mergeNote}`, [
        { text: b.cancel, style: 'cancel' },
        {
          text: b.importOk,
          onPress: async () => {
            restore(p);
            const photos = await journal.importEntries(backup.journal);
            Alert.alert(b.importTitle, b.importDone(photos));
          },
        },
      ]);
    } catch {
      Alert.alert(b.importTitle, b.errors.notJson);
    } finally {
      setBusy(null);
    }
  };

  const Card = ({ children }: { children: ReactNode }) => (
    <View style={{ padding: spacing.md, borderRadius: radius.lg, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, gap: spacing.md }}>
      {children}
    </View>
  );

  const Action = ({ label, onPress, kind, primary }: { label: string; onPress: () => void; kind: 'export' | 'import'; primary?: boolean }) => (
    <Pressable
      onPress={onPress}
      disabled={busy !== null}
      accessibilityRole="button"
      accessibilityState={{ busy: busy === kind, disabled: busy !== null }}
      style={({ pressed }) => ({
        minHeight: HIT,
        borderRadius: radius.pill,
        flexDirection: 'row',
        gap: spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: primary ? colors.accent : 'transparent',
        borderWidth: primary ? 0 : 1.5,
        borderColor: colors.text,
        opacity: pressed || (busy && busy !== kind) ? 0.6 : 1,
      })}
    >
      {busy === kind && <ActivityIndicator color={primary ? colors.onAccent : colors.text} />}
      <AppText variant="mono" color={primary ? colors.onAccent : colors.text}>
        {label}
      </AppText>
    </Pressable>
  );

  return (
    <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: insets.bottom + spacing.xl, gap: spacing.lg }}>
      <AppText muted>{b.intro}</AppText>

      <Card>
        <AppText variant="overline" color={colors.accentInk}>
          {b.exportTitle.toUpperCase()}
        </AppText>
        <AppText>{b.exportBody}</AppText>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ flex: 1 }}>
            <AppText>{b.withPhotos(journal.entries.length)}</AppText>
            <AppText variant="caption" muted>
              {journal.entries.length ? b.photosWeight(formatBytes(photoBytes, t.format.decimal, units)) : b.noPhotos}
            </AppText>
          </View>
          <Switch
            value={withPhotos}
            onValueChange={setWithPhotos}
            disabled={!journal.entries.length}
            trackColor={{ true: colors.primary, false: colors.surfaceAlt }}
            accessibilityLabel={b.withPhotos(journal.entries.length)}
          />
        </View>
        <Action label={b.exportCta} onPress={doExport} kind="export" primary />
        <AppText variant="caption" muted>
          {last ? b.lastExport(t.journal.date(last)) : b.neverExported}
        </AppText>
      </Card>

      <Card>
        <AppText variant="overline" color={colors.accentInk}>
          {b.importTitle.toUpperCase()}
        </AppText>
        <AppText>{b.importBody}</AppText>
        <Action label={b.importCta} onPress={doImport} kind="import" />
      </Card>

      <AppText variant="caption" muted>
        🔒 {b.privacy}
      </AppText>
    </ScrollView>
  );
}
