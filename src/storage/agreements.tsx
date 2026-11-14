import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { Agreement } from '@/content/locales/fr/collab';

/**
 * Accords de collaboration (Contrat-Minute), enregistrés uniquement sur ce téléphone.
 * Un accord signé n'est plus modifiable : on en crée un nouveau.
 */
const KEY = '@declic/agreements/v1';

type Value = {
  ready: boolean;
  agreements: Agreement[];
  get: (id: string) => Agreement | undefined;
  save: (a: Agreement) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<Value | null>(null);

export const isSigned = (a: Agreement) => Boolean(a.signatures.photographer && a.signatures.model);

export function AgreementsProvider({ children }: { children: ReactNode }) {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [ready, setReady] = useState(false);
  const ref = useRef<Agreement[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          ref.current = JSON.parse(raw) as Agreement[];
          setAgreements(ref.current);
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  const commit = useCallback((next: Agreement[]) => {
    ref.current = next;
    setAgreements(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next)).catch(() => {});
  }, []);

  const save = useCallback(
    (a: Agreement) => {
      const exists = ref.current.some((x) => x.id === a.id);
      commit(exists ? ref.current.map((x) => (x.id === a.id ? a : x)) : [a, ...ref.current]);
    },
    [commit],
  );

  const remove = useCallback((id: string) => commit(ref.current.filter((x) => x.id !== id)), [commit]);

  const clear = useCallback(() => {
    ref.current = [];
    setAgreements([]);
    AsyncStorage.removeItem(KEY).catch(() => {});
  }, []);

  const value = useMemo<Value>(
    () => ({ ready, agreements, get: (id) => agreements.find((a) => a.id === id), save, remove, clear }),
    [ready, agreements, save, remove, clear],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAgreements() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAgreements doit être utilisé dans <AgreementsProvider>');
  return ctx;
}
