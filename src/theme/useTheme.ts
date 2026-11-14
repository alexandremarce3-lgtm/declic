import { useColorScheme } from 'react-native';
import { palettes, radius, spacing, type } from './tokens';

/** Thème clair/sombre automatique, calé sur le réglage du téléphone. */
export function useTheme() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  return { scheme, colors: palettes[scheme], spacing, radius, type } as const;
}

export type Theme = ReturnType<typeof useTheme>;
