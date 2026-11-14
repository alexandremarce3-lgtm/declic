/**
 * Espace « Collaborer en confiance » (photographes & modèles) : FAQ TFP, charte, Contrat-Minute,
 * parcours Modèle et textes juridiques.
 *
 * ⚠️ Ces textes sont des modèles rédigés avec prudence, PAS un avis juridique.
 * Faites-les relire par un ou une juriste avant une diffusion publique.
 */

import { EDITOR } from '@/config/editor';

// ——— FAQ TFP ———

export type FaqItem = { id: string; icon: string; question: string; short: string; body: string[]; links?: { label: string; url: string }[] };

export const faq: FaqItem[] = [
  {
    id: 'vrai-tfp',
    icon: '🤝',
    question: 'C’est quoi, le vrai TFP ?',
    short: '100 % gratuit, 100 % artistique.',
    body: [
      'TFP veut dire « Time For Prints » : un échange. Le modèle offre son temps, le photographe offre son temps, son matériel et ses retouches. Personne ne paie personne.',
      'C’est ouvert à tous, amateurs comme professionnels.',
      'Entre particuliers, pour un projet ponctuel et sans aucune contrepartie financière, aucun statut particulier n’est demandé.',
      'Dès qu’il y a de l’argent, un cadeau de valeur, une commande ou une exploitation commerciale des photos, ce n’est plus du TFP : voyez « Le cadre légal ».',
    ],
  },
  {
    id: 'regle-commande',
    icon: '🧾',
    question: 'Qui paie qui ?',
    short: 'Celui qui commande paie l’autre.',
    body: [
      'Le modèle commande un projet sur mesure (un book, des photos pour son usage) : c’est une prestation du photographe, donc payante.',
      'Le photographe a une idée, une direction artistique, et cherche un modèle : c’est soit une collaboration gratuite des deux côtés (TFP), soit un travail rémunéré pour le modèle, dans un cadre professionnel.',
      'Dans le doute, posez la question avant la séance et écrivez la réponse dans l’accord.',
    ],
  },
  {
    id: 'ecrit',
    icon: '✍️',
    question: 'Un accord écrit, même gratuit ?',
    short: 'Oui. Toujours. Même entre amis.',
    body: [
      'Un accord écrit fixe les limites avant la séance : le style, les tenues (habillé, lingerie, nu), le lieu, le nombre de photos, le délai, et où les photos pourront être publiées.',
      'Il protège tout le monde : contre les malentendus, les dérapages pendant la séance, et les regrets après.',
      'Le droit à l’image : on ne peut pas diffuser l’image d’une personne sans son accord. Et les droits d’auteur du photographe ne se cèdent que par écrit, usage par usage.',
      'Le Contrat-Minute de Déclic vous aide à le faire en quelques minutes.',
    ],
  },
  {
    id: 'cadre-legal',
    icon: '⚖️',
    question: 'Et si je veux être payé·e ?',
    short: 'Zéro zone grise : on déclare.',
    body: [
      'Faire payer des séances, même de temps en temps, c’est une activité à déclarer (par exemple en micro-entreprise). Le travail non déclaré est interdit.',
      'Côté modèle : en France, une personne payée pour poser est en principe considérée comme salariée. Renseignez-vous avant d’accepter ou de proposer une rémunération.',
      'Les sites officiels expliquent les démarches pas à pas.',
    ],
    links: [
      { label: 'Service-Public.fr', url: 'https://www.service-public.fr' },
      { label: 'URSSAF', url: 'https://www.urssaf.fr' },
    ],
  },
];

// ——— Charte ———

export const charter: { title: string; body: string }[] = [
  { title: 'Consentement', body: 'Rien ne se fait sans accord clair. Chacun peut dire stop à tout moment, sans se justifier.' },
  { title: 'Majorité', body: 'Lingerie et nu artistique : uniquement entre personnes majeures. Aucune exception.' },
  { title: 'L’écrit d’abord', body: 'Un accord avant chaque séance, même entre amis.' },
  { title: 'Pas d’argent caché', body: 'Un TFP reste gratuit des deux côtés. Sinon, c’est un cadre professionnel.' },
  { title: 'Diffusion respectueuse', body: 'Uniquement là où c’est prévu. Jamais de vente, jamais de site pour adultes.' },
  { title: 'Sécurité', body: 'Un proche sait où et quand a lieu la séance. Venir accompagné·e est toujours accepté.' },
  { title: 'Parole tenue', body: 'Les photos promises sont livrées, dans le délai promis.' },
];

// ——— Contrat-Minute ———

export type ProjectType = 'portrait' | 'mode' | 'lingerie' | 'nu' | 'autre';
export type Allowance = 'habille' | 'stylisme' | 'maillot' | 'lingerie' | 'implicite' | 'nu';
export type Diffusion = 'book' | 'socialPhotographer' | 'socialModel' | 'contests' | 'exhibition';

export const PROJECT_TYPES: { id: ProjectType; label: string; sensitive?: boolean }[] = [
  { id: 'portrait', label: 'Portrait' },
  { id: 'mode', label: 'Mode / stylisme' },
  { id: 'lingerie', label: 'Lingerie', sensitive: true },
  { id: 'nu', label: 'Nu artistique', sensitive: true },
  { id: 'autre', label: 'Autre' },
];

export const ALLOWANCES: { id: Allowance; label: string; sensitive?: boolean }[] = [
  { id: 'habille', label: 'Habillé·e' },
  { id: 'stylisme', label: 'Tenues de stylisme' },
  { id: 'maillot', label: 'Maillot de bain' },
  { id: 'lingerie', label: 'Lingerie', sensitive: true },
  { id: 'implicite', label: 'Nu implicite (rien de visible)', sensitive: true },
  { id: 'nu', label: 'Nu artistique', sensitive: true },
];

export const DIFFUSIONS: { id: Diffusion; label: string }[] = [
  { id: 'book', label: 'Book / portfolio personnel (site, PDF, papier)' },
  { id: 'socialPhotographer', label: 'Réseaux sociaux du photographe' },
  { id: 'socialModel', label: 'Réseaux sociaux du modèle' },
  { id: 'contests', label: 'Concours photo (non commerciaux)' },
  { id: 'exhibition', label: 'Exposition non commerciale' },
];

export type Signature = { name: string; paths: string[]; at: string; adultDeclared: boolean };

export type Agreement = {
  id: string;
  createdAt: string;
  projectType: ProjectType;
  projectOther: string;
  date: string;
  place: string;
  photographer: string;
  model: string;
  allowed: Allowance[];
  forbidden: string;
  deliveryCount: number;
  deliveryDays: number;
  diffusion: Diffusion[];
  credit: boolean;
  durationYears: number;
  signatures: { photographer?: Signature; model?: Signature };
};

export const isSensitive = (a: Pick<Agreement, 'projectType' | 'allowed'>) =>
  PROJECT_TYPES.find((p) => p.id === a.projectType)?.sensitive || a.allowed.some((x) => ALLOWANCES.find((y) => y.id === x)?.sensitive);

const list = (items: string[]) => (items.length ? items.map((i) => `• ${i}`).join('\n') : '• (aucun)');

/** Texte de l'accord, article par article. Sert à l'écran ET au PDF. */
export function agreementSections(a: Agreement): { title: string; body: string }[] {
  const type = a.projectType === 'autre' ? a.projectOther || 'Autre' : PROJECT_TYPES.find((p) => p.id === a.projectType)?.label;
  const allowed = a.allowed.map((x) => ALLOWANCES.find((y) => y.id === x)?.label ?? x);
  const diffusion = a.diffusion.map((x) => DIFFUSIONS.find((y) => y.id === x)?.label ?? x);
  return [
    {
      title: '1. Les parties',
      body: `Photographe : ${a.photographer || '…'}\nModèle : ${a.model || '…'}\nLes deux parties déclarent sur l’honneur être majeures et agir librement.`,
    },
    {
      title: '2. Le projet',
      body: `Séance de type « ${type} », le ${a.date || '…'}, lieu : ${a.place || '…'}.\nIl s’agit d’une collaboration gratuite (TFP) : aucune rémunération ni contrepartie financière, d’un côté comme de l’autre.`,
    },
    {
      title: '3. Les limites',
      body: `Tenues et niveau de dévoilement acceptés :\n${list(allowed)}\n\nInterdits précisés : ${a.forbidden.trim() || 'aucun en plus de ce qui précède.'}\n\nTout ce qui n’est pas listé ci-dessus est refusé par défaut. Chacun peut arrêter la séance à tout moment, sans avoir à se justifier.`,
    },
    {
      title: '4. La livraison',
      body: `Le photographe remet au modèle au moins ${a.deliveryCount} photo(s) retouchée(s), dans un délai de ${a.deliveryDays} jour(s) après la séance.`,
    },
    {
      title: '5. La diffusion autorisée',
      body: `${list(diffusion)}\n${a.credit ? 'Chaque publication mentionne le nom ou pseudonyme de l’autre partie.\n' : ''}\nSont formellement interdits, pour les deux parties :\n• toute vente, tout usage commercial ou publicitaire ;\n• toute diffusion sur un site ou un service à caractère pornographique ou réservé aux adultes ;\n• toute modification qui dénature l’image (montage, intelligence artificielle…) sans nouvel accord écrit.`,
    },
    {
      title: '6. Les droits',
      body: `Le modèle autorise l’utilisation de son image uniquement pour les usages listés à l’article 5, pendant ${a.durationYears} an(s), sur internet et sur les supports cités.\nLe photographe autorise le modèle à utiliser les photos livrées pour ces mêmes usages, sans les modifier ni retirer le crédit.\nTout autre usage nécessite un nouvel accord écrit.`,
    },
    {
      title: '7. Le droit au retrait',
      body: 'Si le modèle le demande, le photographe retire de ses publications une photo dans un délai de 7 jours, sans avoir à en discuter. La même règle s’applique dans l’autre sens.',
    },
    {
      title: '8. La conservation',
      body: 'Cet accord est créé sur un téléphone et n’est envoyé nulle part par Déclic. Chaque partie en garde une copie (PDF).',
    },
  ];
}

export const AGREEMENT_DISCLAIMER =
  'Modèle d’accord simplifié, fourni à titre indicatif par Déclic. Il ne remplace pas un conseil juridique. La signature tracée à l’écran est une signature électronique simple : elle témoigne de l’accord, sans la force d’une signature certifiée.';

// ——— Textes juridiques ———

export type LegalDoc = { id: 'mentions' | 'confidentialite' | 'conditions'; title: string; sections: { title: string; body: string }[] };

export const legalDocs: LegalDoc[] = [
  {
    id: 'mentions',
    title: 'Mentions légales',
    sections: [
      { title: 'Éditeur', body: `${EDITOR.name}\n${EDITOR.status}\n${EDITOR.address}\nContact : ${EDITOR.email}` },
      { title: 'Directeur ou directrice de la publication', body: EDITOR.publicationDirector },
      { title: 'Hébergeur', body: EDITOR.hosting },
      { title: 'Distribution', body: EDITOR.distribution },
      {
        title: 'Hébergement des données',
        body: 'Déclic ne fait héberger aucune donnée de ses utilisateurs : progression, photos, accords et profil restent enregistrés sur le téléphone de chacun. L’éditeur n’y a pas accès.',
      },
      {
        title: 'Propriété intellectuelle',
        body: 'Les textes, dessins et le code de Déclic sont la propriété de l’éditeur, sauf mention contraire. Les photos prises par les utilisateurs restent leur propriété exclusive.',
      },
      { title: 'Mise à jour', body: EDITOR.lastUpdate },
    ],
  },
  {
    id: 'confidentialite',
    title: 'Politique de confidentialité',
    sections: [
      {
        title: 'En résumé',
        body: 'Vos données restent sur votre téléphone. Nous ne les recevons pas, nous ne les voyons pas, nous ne les vendons pas. Pas de compte, pas de publicité, pas de traceur, pas de mesure d’audience.',
      },
      { title: 'Responsable', body: `${EDITOR.name} — ${EDITOR.email}` },
      {
        title: 'Données concernées',
        body: '• Votre profil d’usage (photographe / modèle) et votre déclaration de majorité ;\n• votre identité si vous la renseignez (pseudonyme, prénom, nom — tout est facultatif) ;\n• votre progression (fiches, défis, XP, succès, avatar) ;\n• les photos que vous ajoutez au carnet ;\n• vos accords de collaboration (Contrat-Minute) et votre moodboard.',
      },
      {
        title: 'Où sont-elles ?',
        body: 'Uniquement dans la mémoire privée de l’application, sur votre téléphone. Aucune n’est transmise à l’éditeur ni à un tiers. Les photos du carnet sont copiées dans un dossier réservé à l’app, inaccessible aux autres applications. La sauvegarde automatique d’Android (vers Google Drive) est désactivée pour Déclic : seule la sauvegarde que vous exportez vous-même permet de retrouver vos données.',
      },
      {
        title: 'À quoi servent-elles ?',
        body: 'Seulement au fonctionnement de l’application : afficher vos contenus, calculer votre XP et vos rangs, préremplir vos accords. Aucune autre utilisation.',
      },
      {
        title: 'Autorisations du téléphone',
        body: 'L’appareil photo n’est demandé qu’au moment où vous prenez une photo pour le carnet. Pour la galerie, Déclic utilise le sélecteur de photos du téléphone : l’app ne reçoit que les photos que vous choisissez, jamais l’accès à toute votre photothèque. Le micro n’est jamais utilisé.',
      },
      {
        title: 'Partage',
        body: 'Rien n’est partagé automatiquement. Quand vous exportez une sauvegarde ou un accord en PDF, c’est vous qui choisissez où l’envoyer.',
      },
      {
        title: 'Durée de conservation',
        body: 'Tant que l’application est installée, ou jusqu’à ce que vous effaciez vos données. Désinstaller l’app efface tout.',
      },
      {
        title: 'Vos droits',
        body: '• Effacement : Profil > « Effacer toutes mes données », en un geste, définitif.\n• Portabilité : Profil > Sauvegarde > Exporter.\n• Accès et rectification : tout est visible et modifiable dans l’app.\nPour toute question, écrivez à l’adresse ci-dessus. Vous pouvez aussi saisir la CNIL (cnil.fr).',
      },
      { title: 'Mise à jour', body: EDITOR.lastUpdate },
    ],
  },
  {
    id: 'conditions',
    title: 'Conditions d’utilisation',
    sections: [
      {
        title: 'Objet',
        body: 'Déclic est une application gratuite d’apprentissage de la photographie, avec un espace d’aide aux collaborations entre photographes et modèles.',
      },
      {
        title: 'Âge',
        body: 'Les fiches et défis sont ouverts à tous. L’espace « Collaborer en confiance » est réservé aux personnes majeures : l’accès suppose une déclaration sur l’honneur d’avoir 18 ans ou plus. Toute fausse déclaration engage la responsabilité de son auteur.',
      },
      {
        title: 'Usage responsable',
        body: 'Le Contrat-Minute est un modèle indicatif. Chaque utilisateur reste seul responsable des séances qu’il organise, des accords qu’il signe et des photos qu’il diffuse. Il s’engage à respecter le droit à l’image, le consentement de chacun et la loi.',
      },
      {
        title: 'Contenus interdits',
        body: 'Il est strictement interdit d’utiliser Déclic pour organiser ou documenter une séance impliquant une personne mineure dans un contexte de lingerie ou de nudité, ou une personne qui n’a pas donné son accord.',
      },
      {
        title: 'Signaler un abus',
        body: 'Vous pouvez signaler à l’éditeur tout usage abusif ou non consenti lié à Déclic depuis Profil > « Signaler un abus ». Aujourd’hui, l’application ne publie aucun contenu entre utilisateurs. Si une fonction communautaire est ajoutée, un bouton de signalement sera présent sur chaque contenu, avec retrait rapide des contenus manifestement illicites, comme le prévoit la loi.',
      },
      {
        title: 'Responsabilité',
        body: 'L’éditeur fournit l’application en l’état, sans garantie. Il ne peut être tenu responsable de l’usage fait des accords générés ni des relations entre utilisateurs.',
      },
      { title: 'Mise à jour', body: EDITOR.lastUpdate },
    ],
  },
];

// ——— Parcours Modèle ———

export type ModelQuest = { id: string; kind: 'onboarding' | 'skill'; title: string; body: string; route: string; xp: number };

export const MOODBOARD_STYLES = ['Portrait naturel', 'Noir & blanc', 'Mode', 'Studio', 'Extérieur', 'Urbain', 'Fine art', 'Boudoir'];

export type LightQuestion = {
  scene: 'face-front' | 'face-side' | 'face-top' | 'face-back' | 'face-below' | 'face-soft';
  choices: [string, string, string, string];
  answer: 0 | 1 | 2 | 3;
  explain: string;
};

/** Quiz visuel : d'où vient la lumière, et que fait-elle aux volumes du visage ? */
export const lightQuiz: LightQuestion[] = [
  { scene: 'face-front', choices: ['De face', 'De côté', 'Du dessus', 'De dos'], answer: 0, explain: 'Lumière de face : peu d’ombres, le visage paraît plus plat mais très lisible. Flatteur pour la peau.' },
  { scene: 'face-side', choices: ['De côté', 'De face', 'D’en bas', 'De dos'], answer: 0, explain: 'Lumière de côté : une moitié dans l’ombre. Elle sculpte les volumes, les pommettes, la mâchoire. Très dramatique.' },
  { scene: 'face-top', choices: ['Du dessus', 'De côté', 'De face', 'D’en bas'], answer: 0, explain: 'Lumière du dessus (soleil de midi) : yeux dans l’ombre, ombre sous le nez. Levez un peu le menton ou cherchez l’ombre.' },
  { scene: 'face-back', choices: ['De dos (contre-jour)', 'De face', 'Du dessus', 'De côté'], answer: 0, explain: 'Contre-jour : un liseré lumineux dessine la silhouette et les cheveux. Le visage est sombre, sauf si le photographe compense.' },
  { scene: 'face-below', choices: ['D’en bas', 'Du dessus', 'De face', 'De dos'], answer: 0, explain: 'Lumière d’en bas : les ombres montent, effet « lampe de poche sous le menton ». Rarement flatteur… sauf pour un effet voulu.' },
  { scene: 'face-soft', choices: ['Douce et diffuse', 'Dure et directe', 'De dos', 'D’en bas'], answer: 0, explain: 'Lumière douce (ciel couvert, fenêtre, grand diffuseur) : ombres légères et progressives. La plus simple pour poser.' },
];
