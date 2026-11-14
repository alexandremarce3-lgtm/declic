/** Liens publics du projet et licences des briques open source embarquées (affichés dans « À propos »). */

export const PROJECT = {
  repository: 'https://github.com/alexandremarce3-lgtm/declic',
  releases: 'https://github.com/alexandremarce3-lgtm/declic/releases',
  privacyOnline: 'https://github.com/alexandremarce3-lgtm/declic/blob/main/docs/confidentialite.md',
  license: 'MIT',
} as const;

/** Principales dépendances et leur licence (à tenir à jour lors d'un ajout). */
export const THIRD_PARTY: { name: string; license: string; url: string }[] = [
  { name: 'Expo', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'React Native', license: 'MIT', url: 'https://github.com/facebook/react-native' },
  { name: 'React', license: 'MIT', url: 'https://github.com/facebook/react' },
  { name: 'Expo Router', license: 'MIT', url: 'https://github.com/expo/expo' },
  { name: 'react-native-svg', license: 'MIT', url: 'https://github.com/software-mansion/react-native-svg' },
  { name: 'AsyncStorage', license: 'MIT', url: 'https://github.com/react-native-async-storage/async-storage' },
  { name: '@react-native-community/slider', license: 'MIT', url: 'https://github.com/callstack/react-native-slider' },
  { name: 'Playfair Display (police)', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/specimen/Playfair+Display' },
  { name: 'Inter (police)', license: 'SIL Open Font License 1.1', url: 'https://fonts.google.com/specimen/Inter' },
];
