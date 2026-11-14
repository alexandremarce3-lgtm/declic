/**
 * Format de sauvegarde Déclic : un seul fichier JSON, lisible et versionné.
 *
 *   { app: 'declic', format: 1, exportedAt, progress: Stored, journal: [...] }
 *
 * Les photos du carnet sont incluses en base64 si on le demande (fichier plus lourd).
 * L'import FUSIONNE avec la progression du téléphone au lieu de l'écraser :
 * rien de ce qui a été fait sur l'un ou l'autre appareil n'est perdu.
 */

import type { JournalEntry } from '@/storage/journal';
import type { Stored } from '@/storage/progress';
import { DEFAULT_LOOK, normalizeLook } from './avatar';

export const BACKUP_FORMAT = 1;

export type BackupPhoto = JournalEntry & { data?: string };

export type Backup = {
  app: 'declic';
  format: number;
  exportedAt: string;
  progress: Stored;
  journal: BackupPhoto[];
};

export type BackupError = 'notJson' | 'notDeclic' | 'tooNew';

export function buildBackup(progress: Stored, journal: BackupPhoto[]): Backup {
  return { app: 'declic', format: BACKUP_FORMAT, exportedAt: new Date().toISOString(), progress, journal };
}

/** Lit et vérifie un fichier de sauvegarde. */
export function parseBackup(text: string): { ok: true; backup: Backup } | { ok: false; error: BackupError } {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: 'notJson' };
  }
  const b = raw as Partial<Backup>;
  if (!b || b.app !== 'declic' || typeof b.progress !== 'object' || !b.progress) return { ok: false, error: 'notDeclic' };
  if (typeof b.format !== 'number' || b.format > BACKUP_FORMAT) return { ok: false, error: 'tooNew' };
  return { ok: true, backup: { ...(b as Backup), journal: Array.isArray(b.journal) ? b.journal : [] } };
}

type DoneMap = Record<string, string>;

/** Union de deux maps « id → date » en gardant la date la plus ancienne */
const union = (a: DoneMap = {}, b: DoneMap = {}): DoneMap => {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) if (!out[k] || (typeof v === 'string' && v < out[k])) out[k] = v;
  return out;
};

const isDefaultLook = (l: Stored['look']) => JSON.stringify(normalizeLook(l)) === JSON.stringify(DEFAULT_LOOK);

/** Fusionne une progression importée dans celle du téléphone. */
export function mergeProgress(current: Stored, incoming: Partial<Stored>): Stored {
  const counters = { ...current.counters };
  for (const [k, v] of Object.entries(incoming.counters ?? {})) counters[k] = Math.max(counters[k] ?? 0, Number(v) || 0);

  const quizPassed = { ...current.quizPassed };
  for (const [tier, v] of Object.entries(incoming.quizPassed ?? {})) {
    const key = tier as keyof Stored['quizPassed'];
    if (v && !quizPassed[key]) quizPassed[key] = v;
  }

  const id = current.identity;
  const hasIdentity = Boolean(id.nickname || id.firstName || id.lastName);

  return {
    sheets: union(current.sheets, incoming.sheets),
    challenges: union(current.challenges, incoming.challenges),
    sos: union(current.sos, incoming.sos),
    achievements: union(current.achievements, incoming.achievements),
    credited: union(current.credited, incoming.credited),
    counters,
    quizPassed,
    // Apparence et identité : celles du téléphone, sauf s'il n'en a pas encore
    look: isDefaultLook(current.look) && incoming.look ? normalizeLook(incoming.look) : current.look,
    readingMode: current.readingMode,
    quests: union(current.quests, incoming.quests),
    profile: current.profile.role ? current.profile : { ...current.profile, ...incoming.profile },
    moodboard: current.moodboard.styles.length || !incoming.moodboard ? current.moodboard : incoming.moodboard,
    identity: !hasIdentity && incoming.identity ? { ...id, ...incoming.identity } : id,
  };
}

/** Taille lisible : 1,4 Mo */
export function formatBytes(bytes: number, decimal: (n: number) => string, units: [string, string, string]) {
  if (bytes < 1024) return `${bytes} ${units[0]}`;
  if (bytes < 1024 * 1024) return `${decimal(bytes / 1024)} ${units[1]}`;
  return `${decimal(bytes / (1024 * 1024))} ${units[2]}`;
}
