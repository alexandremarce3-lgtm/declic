/**
 * Informations sur l'éditeur, reprises dans les mentions légales et la politique de confidentialité.
 *
 * Éditeur non professionnel : la loi (LCEN, art. 6, III-2) lui permet de ne pas afficher
 * son identité complète au public, à condition de l'avoir communiquée à son hébergeur
 * (ici GitHub, qui héberge le code et les fichiers d'installation). À faire valider par un juriste.
 */
export const EDITOR = {
  name: 'alexandremarce3',
  status: 'Éditeur non professionnel (particulier)',
  address: 'Non publiée : éditeur non professionnel, identité communiquée à l’hébergeur (LCEN, art. 6, III-2)',
  email: 'contact@lenspicture.com',
  publicationDirector: 'alexandremarce3',
  hosting: 'GitHub, Inc. — 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis (code source et fichiers d’installation)',
  distribution: 'Fichiers d’installation publiés sur GitHub ; compilation par Expo Application Services (EAS)',
  lastUpdate: '14 novembre 2026',
} as const;

/** true tant qu'un champ contient des crochets à remplir */
export const EDITOR_INCOMPLETE = Object.values(EDITOR).some((v) => v.includes('['));
