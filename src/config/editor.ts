/**
 * Informations sur l'éditeur, reprises dans les mentions légales et la politique de confidentialité.
 * ⚠️ À COMPLÉTER avant toute diffusion publique : les mentions légales sont obligatoires (LCEN, art. 6).
 * Un particulier non professionnel peut garder l'anonymat du public en indiquant les coordonnées
 * de son hébergeur ou distributeur, à condition de les avoir communiquées à celui-ci.
 */
export const EDITOR = {
  name: '[Nom et prénom, ou raison sociale]',
  status: '[Particulier / micro-entreprise / société — SIRET le cas échéant]',
  address: '[Adresse postale]',
  email: '[adresse e-mail de contact]',
  publicationDirector: '[Nom du directeur ou de la directrice de la publication]',
  distribution: 'Expo Application Services (EAS) pour les versions de test ; Google Play / App Store pour les versions publiques',
  lastUpdate: '15 novembre 2026',
} as const;

/** true tant que les champs ci-dessus contiennent des crochets à remplir */
export const EDITOR_INCOMPLETE = Object.values(EDITOR).some((v) => v.includes('['));
