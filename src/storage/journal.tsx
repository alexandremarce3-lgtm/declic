import AsyncStorage from '@react-native-async-storage/async-storage';
import { Directory, File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import type { BackupPhoto } from '@/lib/backup';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

/**
 * Carnet de bord : les photos des défis, copiées dans le dossier privé de l'app.
 * Rien n'est envoyé en ligne ; supprimer l'app supprime le carnet.
 * Index des entrées dans AsyncStorage, fichiers dans `<documents>/carnet/`.
 */
const KEY = '@declic/journal/v1';
const DIR = 'carnet';

export type JournalEntry = {
  id: string;
  challengeId: string;
  /** Nom du fichier dans le dossier du carnet (l'URI absolue peut changer d'une installation à l'autre) */
  file: string;
  createdAt: string;
  width?: number;
  height?: number;
};

export type PickSource = 'camera' | 'library';
export type PickResult = { ok: true; entry: JournalEntry } | { ok: false; reason: 'canceled' | 'denied' | 'error' };

type JournalValue = {
  ready: boolean;
  entries: JournalEntry[];
  entriesFor: (challengeId: string) => JournalEntry[];
  uriOf: (entry: JournalEntry) => string;
  addPhoto: (challengeId: string, source: PickSource) => Promise<PickResult>;
  remove: (id: string) => void;
  clear: () => void;
  /** Entrées à sauvegarder, avec les photos en base64 si demandé */
  exportEntries: (withPhotos: boolean) => Promise<BackupPhoto[]>;
  /** Ajoute les entrées d'une sauvegarde absentes du téléphone ; renvoie le nombre de photos restaurées */
  importEntries: (entries: BackupPhoto[]) => Promise<number>;
  /** Poids total des photos du carnet, en octets */
  photosSize: () => number;
};

const JournalContext = createContext<JournalValue | null>(null);

const folder = () => {
  const dir = new Directory(Paths.document, DIR);
  dir.create({ idempotent: true, intermediates: true });
  return dir;
};

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [ready, setReady] = useState(false);
  const ref = useRef<JournalEntry[]>([]);

  const commit = useCallback((next: JournalEntry[]) => {
    ref.current = next;
    setEntries(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const dir = folder();
        // On écarte les entrées dont le fichier a disparu
        const list = (JSON.parse(raw) as JournalEntry[]).filter((e) => new File(dir, e.file).exists);
        ref.current = list;
        setEntries(list);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const addPhoto = useCallback(
    async (challengeId: string, source: PickSource): Promise<PickResult> => {
      try {
        // La galerie passe par le sélecteur de photos du système : aucune autorisation à demander
        // (et aucun accès à toute la photothèque). Seul l'appareil photo demande l'accord.
        if (source === 'camera') {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) return { ok: false, reason: 'denied' };
        }

        const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.8, exif: false };
        const result =
          source === 'camera'
            ? await ImagePicker.launchCameraAsync(options)
            : await ImagePicker.launchImageLibraryAsync(options);
        if (result.canceled || !result.assets?.length) return { ok: false, reason: 'canceled' };

        const asset = result.assets[0];
        const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
        const ext = (asset.uri.split('.').pop() ?? 'jpg').split('?')[0].toLowerCase();
        const name = `${challengeId}-${id}.${ext.length <= 4 ? ext : 'jpg'}`;
        await new File(asset.uri).copy(new File(folder(), name));

        const entry: JournalEntry = {
          id,
          challengeId,
          file: name,
          createdAt: new Date().toISOString(),
          width: asset.width,
          height: asset.height,
        };
        commit([entry, ...ref.current]);
        return { ok: true, entry };
      } catch {
        return { ok: false, reason: 'error' };
      }
    },
    [commit],
  );

  const remove = useCallback(
    (id: string) => {
      const entry = ref.current.find((e) => e.id === id);
      if (entry) {
        try {
          const f = new File(folder(), entry.file);
          if (f.exists) f.delete();
        } catch {
          /* fichier déjà absent */
        }
      }
      commit(ref.current.filter((e) => e.id !== id));
    },
    [commit],
  );

  const clear = useCallback(() => {
    try {
      const dir = new Directory(Paths.document, DIR);
      if (dir.exists) dir.delete();
    } catch {
      /* rien à effacer */
    }
    commit([]);
  }, [commit]);

  const exportEntries = useCallback(async (withPhotos: boolean): Promise<BackupPhoto[]> => {
    const dir = folder();
    const out: BackupPhoto[] = [];
    for (const e of ref.current) {
      if (!withPhotos) {
        out.push(e);
        continue;
      }
      try {
        out.push({ ...e, data: await new File(dir, e.file).base64() });
      } catch {
        out.push(e); // photo illisible : on garde au moins l'entrée
      }
    }
    return out;
  }, []);

  const importEntries = useCallback(
    async (incoming: BackupPhoto[]) => {
      const dir = folder();
      const known = new Set(ref.current.map((e) => e.id));
      const added: JournalEntry[] = [];
      for (const { data, ...e } of incoming) {
        if (!e.id || !e.challengeId || known.has(e.id)) continue;
        // Un fichier de sauvegarde vient de l'extérieur : nom de fichier simple uniquement (pas de « ../ »)
        if (typeof e.file !== 'string' || !/^[\w-]+\.[a-z0-9]{2,4}$/i.test(e.file)) continue;
        const target = new File(dir, e.file);
        try {
          if (data && !target.exists) {
            target.create({ overwrite: true });
            await target.write(data, { encoding: 'base64' });
          }
          if (target.exists) added.push(e);
        } catch {
          /* photo non restaurable : ignorée */
        }
      }
      if (added.length) {
        const merged = [...ref.current, ...added].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        commit(merged);
      }
      return added.length;
    },
    [commit],
  );

  const photosSize = useCallback(() => {
    const dir = folder();
    return ref.current.reduce((n, e) => n + new File(dir, e.file).size, 0);
  }, []);

  const value = useMemo<JournalValue>(
    () => ({
      ready,
      entries,
      entriesFor: (cid) => entries.filter((e) => e.challengeId === cid),
      uriOf: (e) => new File(Paths.document, DIR, e.file).uri,
      addPhoto,
      remove,
      clear,
      exportEntries,
      importEntries,
      photosSize,
    }),
    [ready, entries, addPhoto, remove, clear, exportEntries, importEntries, photosSize],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error('useJournal doit être utilisé dans <JournalProvider>');
  return ctx;
}
