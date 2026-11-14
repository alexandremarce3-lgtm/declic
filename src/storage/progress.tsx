import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_LOOK, normalizeLook, type Slot } from '@/lib/avatar';
import type { TierId } from '@/content/types';
import { rankFor, type RankId, type RankInfo } from '@/lib/ranks';
import { mergeProgress } from '@/lib/backup';
import { xpOf } from '@/lib/xp';

/**
 * Progression 100 % locale : aucune donnée ne quitte le téléphone.
 * On stocke CE QUI a été fait (avec la date) ; l'XP en est déduite.
 * Avantages : pas de triche par double comptage, et un barème modifiable sans migration.
 */
const KEY = '@declic/progress/v2';
const LEGACY_KEY = '@declic/challenges-done/v1';

type DoneMap = Record<string, string>;

export type Identity = {
  firstName: string;
  lastName: string;
  nickname: string;
  /** Ce qui s'affiche dans l'app */
  display: 'nickname' | 'firstName' | 'fullName';
};

export const EMPTY_IDENTITY: Identity = { firstName: '', lastName: '', nickname: '', display: 'nickname' };

/** Nom à afficher selon la préférence, avec repli sur ce qui est rempli */
export function displayName(i: Identity): string {
  const full = [i.firstName, i.lastName].filter(Boolean).join(' ');
  const pick = i.display === 'nickname' ? i.nickname : i.display === 'firstName' ? i.firstName : full;
  return (pick || i.nickname || i.firstName || full).trim();
}

/** Profil d'usage, choisi à l'accueil */
export type Role = 'photographe' | 'modele' | 'both';

export type Profile = {
  role: Role | null;
  /** Déclaration sur l'honneur de majorité : true = 18 ans ou plus, false = mineur, null = pas encore répondu */
  adult: boolean | null;
  adultDeclaredAt?: string;
  /** Accueil terminé */
  onboardedAt?: string;
};

export const EMPTY_PROFILE: Profile = { role: null, adult: null };

/** Moodboard et limites personnelles (parcours Modèle), réutilisés pour préremplir le Contrat-Minute */
export type Moodboard = { styles: string[]; accepts: string[]; refuses: string[]; notes: string };

export const EMPTY_MOODBOARD: Moodboard = { styles: [], accepts: [], refuses: [], notes: '' };

export type Stored = {
  sheets: DoneMap;
  challenges: DoneMap;
  /** Clé : `<problème>/<cause>` */
  sos: DoneMap;
  /** Compteurs d'actions (taps sur l'accueil, réglages du simulateur…) pour les succès */
  counters: Record<string, number>;
  /** Succès débloqués (définitivement, même si la condition cesse d'être vraie) */
  achievements: DoneMap;
  /** Tenue de l'avatar : emplacement → pièce */
  look: Record<Slot, string | null>;
  /** XP créditée par un test réussi : sheet:<id> / challenge:<id> → date */
  credited: DoneMap;
  /** Version des fiches débutant affichée par défaut */
  readingMode?: 'simple' | 'full';
  /** Identité affichée (facultative, reste sur le téléphone) */
  identity: Identity;
  /** Tests réussis par palier */
  quizPassed: Partial<Record<TierId, { date: string; score: number; total: number }>>;
  profile: Profile;
  /** Quêtes accomplies (FAQ TFP, charte, premier accord, moodboard…) */
  quests: DoneMap;
  moodboard: Moodboard;
};

const EMPTY: Stored = { sheets: {}, challenges: {}, sos: {}, counters: {}, achievements: {}, look: DEFAULT_LOOK, credited: {}, quizPassed: {}, identity: EMPTY_IDENTITY, profile: EMPTY_PROFILE, quests: {}, moodboard: EMPTY_MOODBOARD };

export { xpOf };

/** Dernier gain, pour le toast « +10 XP » (seq change à chaque gain) */
export type Gain = { amount: number; seq: number };
export type RankUp = { from: RankId; to: RankId };

type ProgressValue = {
  ready: boolean;
  stored: Stored;
  xp: number;
  rank: RankInfo;
  isDone: (challengeId: string) => boolean;
  isSheetRead: (sheetId: string) => boolean;
  toggle: (challengeId: string) => void;
  /** Valide un défi (sans effet s'il l'est déjà) — utilisé par le carnet photo */
  complete: (challengeId: string) => void;
  markSheetRead: (sheetId: string) => void;
  markSosViewed: (key: string) => void;
  /** Incrémente un compteur d'action (succès cachés) */
  bump: (counter: string, by?: number) => void;
  /** Enregistre des succès comme débloqués ; renvoie ceux qui sont nouveaux */
  unlockAchievements: (ids: string[]) => string[];
  equip: (slot: Slot, itemId: string | null) => void;
  /** Test réussi : enregistre le score et crédite les fiches / défis sautés */
  passQuiz: (tier: TierId, score: number, total: number, credit: { sheets: string[]; challenges: string[] }) => void;
  /** Élément crédité par un test (et non fait pour de vrai) */
  isCredited: (kind: 'sheet' | 'challenge', id: string) => boolean;
  setIdentity: (identity: Identity) => void;
  setReadingMode: (mode: 'simple' | 'full') => void;
  /** Fusionne une progression importée (sauvegarde) */
  restore: (incoming: Partial<Stored>) => void;
  setProfile: (patch: Partial<Profile>) => void;
  /** Quête accomplie (une seule fois) */
  completeQuest: (id: string) => void;
  isQuestDone: (id: string) => boolean;
  setMoodboard: (m: Moodboard) => void;
  /** Efface ABSOLUMENT TOUT (progression, identité, avatar, profil) — droit à l'effacement */
  wipe: () => void;
  reset: () => void;
  lastGain: Gain | null;
  rankUp: RankUp | null;
  dismissRankUp: () => void;
};

const ProgressContext = createContext<ProgressValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useState<Stored>(EMPTY);
  const [ready, setReady] = useState(false);
  const [lastGain, setLastGain] = useState<Gain | null>(null);
  const [rankUp, setRankUp] = useState<RankUp | null>(null);
  const seq = useRef(0);
  const storedRef = useRef<Stored>(EMPTY);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const load = (s: Stored) => {
    storedRef.current = s;
    setStored(s);
  };

  // Chargement + migration depuis la v1 (défis seulement)
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY);
        if (raw) {
          const saved = JSON.parse(raw) as Partial<Stored>;
          load({ ...EMPTY, ...saved, look: normalizeLook(saved.look), identity: { ...EMPTY_IDENTITY, ...saved.identity }, profile: { ...EMPTY_PROFILE, ...saved.profile }, moodboard: { ...EMPTY_MOODBOARD, ...saved.moodboard } });
        } else {
          const legacy = await AsyncStorage.getItem(LEGACY_KEY);
          if (legacy) load({ ...EMPTY, challenges: JSON.parse(legacy) as DoneMap });
        }
      } catch {
        /* stockage illisible : on repart de zéro */
      } finally {
        setReady(true);
      }
    })();
  }, []);

  /** Applique une modification, sauvegarde, et déclenche toast / passage de rang. */
  //   (calculé hors du setState : les effets ne doivent jamais se rejouer)
  const update = useCallback((fn: (s: Stored) => Stored | null) => {
    const prev = storedRef.current;
    const next = fn(prev);
    if (!next) return;
    storedRef.current = next;
    setStored(next);
    // Écriture regroupée : les compteurs peuvent bouger plusieurs fois par seconde
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      AsyncStorage.setItem(KEY, JSON.stringify(storedRef.current)).catch(() => {});
    }, 300);

    const before = xpOf(prev);
    const after = xpOf(next);
    if (after > before) {
      seq.current += 1;
      setLastGain({ amount: after - before, seq: seq.current });
      const from = rankFor(before);
      const to = rankFor(after);
      if (to.index > from.index) {
        setRankUp({ from: from.rank, to: to.rank });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      }
    }
  }, []);

  const toggle = useCallback(
    (id: string) =>
      update((s) => {
        const challenges = { ...s.challenges };
        if (challenges[id]) delete challenges[id];
        else challenges[id] = new Date().toISOString();
        return { ...s, challenges };
      }),
    [update],
  );

  const markOnce = useCallback(
    (bucket: 'sheets' | 'sos', id: string) =>
      update((s) => (s[bucket][id] ? null : { ...s, [bucket]: { ...s[bucket], [id]: new Date().toISOString() } })),
    [update],
  );

  const markSheetRead = useCallback((id: string) => ready && markOnce('sheets', id), [markOnce, ready]);
  const markSosViewed = useCallback((key: string) => ready && markOnce('sos', key), [markOnce, ready]);

  const complete = useCallback(
    (id: string) =>
      update((s) => (s.challenges[id] ? null : { ...s, challenges: { ...s.challenges, [id]: new Date().toISOString() } })),
    [update],
  );

  const bump = useCallback(
    (counter: string, by = 1) =>
      ready && update((s) => ({ ...s, counters: { ...s.counters, [counter]: (s.counters[counter] ?? 0) + by } })),
    [update, ready],
  );

  const unlockAchievements = useCallback(
    (ids: string[]) => {
      const fresh = ids.filter((id) => !storedRef.current.achievements[id]);
      if (fresh.length) {
        const now = new Date().toISOString();
        update((s) => ({ ...s, achievements: { ...s.achievements, ...Object.fromEntries(fresh.map((id) => [id, now])) } }));
      }
      return fresh;
    },
    [update],
  );

  const equip = useCallback(
    (slot: Slot, itemId: string | null) => update((s) => ({ ...s, look: { ...s.look, [slot]: itemId } })),
    [update],
  );

  const passQuiz = useCallback(
    (tier: TierId, score: number, total: number, credit: { sheets: string[]; challenges: string[] }) =>
      update((s) => {
        const now = new Date().toISOString();
        const credited = { ...s.credited };
        credit.sheets.forEach((id) => (credited[`sheet:${id}`] = now));
        credit.challenges.forEach((id) => (credited[`challenge:${id}`] = now));
        return { ...s, credited, quizPassed: { ...s.quizPassed, [tier]: { date: now, score, total } } };
      }),
    [update],
  );

  const setIdentity = useCallback(
    (identity: Identity) => update((s) => ({ ...s, identity: { ...identity, firstName: identity.firstName.trim(), lastName: identity.lastName.trim(), nickname: identity.nickname.trim() } })),
    [update],
  );

  const setReadingMode = useCallback((mode: 'simple' | 'full') => update((s) => (s.readingMode === mode ? null : { ...s, readingMode: mode })), [update]);

  const restore = useCallback((incoming: Partial<Stored>) => update((s) => mergeProgress(s, incoming)), [update]);

  const setProfile = useCallback((patch: Partial<Profile>) => update((s) => ({ ...s, profile: { ...s.profile, ...patch } })), [update]);

  const completeQuest = useCallback(
    (id: string) => update((s) => (s.quests[id] ? null : { ...s, quests: { ...s.quests, [id]: new Date().toISOString() } })),
    [update],
  );

  const setMoodboard = useCallback((m: Moodboard) => update((s) => ({ ...s, moodboard: m })), [update]);

  const wipe = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    load(EMPTY);
    setLastGain(null);
    setRankUp(null);
    AsyncStorage.multiRemove([KEY, LEGACY_KEY]).catch(() => {});
  }, []);

  const reset = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    // On efface la progression, pas l'identité ni l'apparence de l'avatar
    const kept: Stored = { ...EMPTY, identity: storedRef.current.identity, look: storedRef.current.look, profile: storedRef.current.profile };
    load(kept);
    setLastGain(null);
    AsyncStorage.removeItem(LEGACY_KEY).catch(() => {});
    AsyncStorage.setItem(KEY, JSON.stringify(kept)).catch(() => {});
  }, []);

  const value = useMemo<ProgressValue>(() => {
    const xp = xpOf(stored);
    return {
      ready,
      stored,
      xp,
      rank: rankFor(xp),
      isDone: (id) => Boolean(stored.challenges[id]),
      isSheetRead: (id) => Boolean(stored.sheets[id]),
      toggle,
      complete,
      markSheetRead,
      markSosViewed,
      bump,
      unlockAchievements,
      equip,
      passQuiz,
      setIdentity,
      setReadingMode,
      restore,
      isCredited: (kind, id) => Boolean(stored.credited[`${kind}:${id}`]),
      setProfile,
      completeQuest,
      isQuestDone: (id) => Boolean(stored.quests[id]),
      setMoodboard,
      wipe,
      reset,
      lastGain,
      rankUp,
      dismissRankUp: () => setRankUp(null),
    };
  }, [ready, stored, toggle, complete, markSheetRead, markSosViewed, bump, unlockAchievements, equip, passQuiz, setIdentity, setReadingMode, restore, setProfile, completeQuest, setMoodboard, wipe, reset, lastGain, rankUp]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress doit être utilisé dans <ProgressProvider>');
  return ctx;
}
