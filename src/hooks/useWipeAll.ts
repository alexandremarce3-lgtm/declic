import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useCallback } from 'react';
import { useAgreements } from '@/storage/agreements';
import { useJournal } from '@/storage/journal';
import { useProgress } from '@/storage/progress';

/**
 * Droit à l'effacement (RGPD, art. 17), en un geste :
 * progression, identité, avatar, profil, photos du carnet, accords et préférences.
 * Après effacement, l'app repart sur l'écran d'accueil comme au premier jour.
 */
export function useWipeAll() {
  const { wipe } = useProgress();
  const journal = useJournal();
  const agreements = useAgreements();

  return useCallback(() => {
    wipe();
    journal.clear();
    agreements.clear();
    AsyncStorage.multiRemove(['@declic/last-backup']).catch(() => {});
    router.replace('/bienvenue');
  }, [wipe, journal, agreements]);
}
