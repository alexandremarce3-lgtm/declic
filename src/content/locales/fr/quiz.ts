import type { QuizQuestion } from '@/content/types';

/**
 * Banque du test « Valider ses acquis ».
 * Chaque palier tire QUIZ_LENGTH questions au hasard dans sa banque (voir `lib/tiers.ts`) :
 * garder au moins 20 questions par palier pour que deux tentatives se ressemblent peu.
 * `answer` = index de la bonne réponse ; l'ordre des choix est mélangé à l'affichage.
 */
export const quiz: QuizQuestion[] = [
  // ——— Fondamental : valide les bases, débloque le niveau Avancé ———
  {
    id: 'f01', tier: 'fondamental', topic: 'reglages',
    question: 'Quelle ouverture laisse entrer le plus de lumière ?',
    choices: ['f/2', 'f/8', 'f/16', 'f/22'], answer: 0,
    explain: 'Plus le nombre f/ est petit, plus le diaphragme est ouvert.',
  },
  {
    id: 'f02', tier: 'fondamental', topic: 'reglages',
    question: 'Passer de f/4 à f/5.6, c’est…',
    choices: ['Perdre 1 stop de lumière', 'Gagner 1 stop de lumière', 'Perdre 2 stops', 'Ne rien changer'], answer: 0,
    explain: 'f/4 → f/5.6 est un cran entier : deux fois moins de lumière.',
  },
  {
    id: 'f03', tier: 'fondamental', topic: 'reglages',
    question: 'Quelle vitesse pour figer un enfant qui court ?',
    choices: ['1/500 s', '1/30 s', '1/8 s', '1 s'], answer: 0,
    explain: 'Un sujet rapide demande 1/500 s ou plus.',
  },
  {
    id: 'f04', tier: 'fondamental', topic: 'reglages',
    question: 'Passer de ISO 200 à ISO 400…',
    choices: ['Éclaircit l’image d’un stop', 'Assombrit l’image d’un stop', 'Éclaircit de deux stops', 'Ne change que les couleurs'], answer: 0,
    explain: 'Doubler l’ISO double l’amplification : +1 stop.',
  },
  {
    id: 'f05', tier: 'fondamental', topic: 'reglages',
    question: 'Quel est le principal défaut d’un ISO très élevé ?',
    choices: ['Le bruit numérique', 'Le flou de bougé', 'Un fond plus flou', 'Une image plus sombre'], answer: 0,
    explain: 'L’amplification fait ressortir le grain, surtout dans les ombres.',
  },
  {
    id: 'f06', tier: 'fondamental', topic: 'reglages',
    question: 'Pour un portrait avec le fond très flou, vous choisissez…',
    choices: ['Une grande ouverture (f/1.8)', 'f/16', 'Une vitesse lente', 'ISO 100'], answer: 0,
    explain: 'La grande ouverture réduit la profondeur de champ.',
  },
  {
    id: 'f07', tier: 'fondamental', topic: 'reglages',
    question: 'À main levée, sous quelle vitesse le flou de bougé devient-il probable ?',
    choices: ['1/60 s', '1/1000 s', '1/500 s', '1/250 s'], answer: 0,
    explain: '1/60 s est le repère courant (il dépend aussi de la focale).',
  },
  {
    id: 'f08', tier: 'fondamental', topic: 'lumiere',
    question: 'En photo, un « stop » correspond à…',
    choices: ['Deux fois plus ou moins de lumière', '10 % de lumière en plus', 'Un cran de zoom', 'Une seconde de pose'], answer: 0,
    explain: 'Toutes les échelles (ouverture, vitesse, ISO) se comptent en stops.',
  },
  {
    id: 'f09', tier: 'fondamental', topic: 'lumiere',
    question: '1/125 s à f/8 donne la même exposition que…',
    choices: ['1/250 s à f/5.6', '1/250 s à f/8', '1/60 s à f/5.6', '1/500 s à f/8'], answer: 0,
    explain: 'Vitesse deux fois plus courte (−1 stop), ouverture plus grande (+1 stop) : équivalent.',
  },
  {
    id: 'f10', tier: 'fondamental', topic: 'reglages',
    question: 'Pour un paysage net du premier plan à l’horizon :',
    choices: ['f/11', 'f/1.8', 'f/2.8', 'f/1.4'], answer: 0,
    explain: 'Une petite ouverture (f/8 – f/11) étend la profondeur de champ.',
  },
  {
    id: 'f11', tier: 'fondamental', topic: 'composition',
    question: 'Avec la règle des tiers, où placer l’horizon ?',
    choices: ['Sur la ligne du tiers haut ou bas', 'Exactement au centre', 'Collé au bord du cadre', 'En diagonale'], answer: 0,
    explain: 'Un horizon décentré donne plus de place au ciel ou au sol.',
  },
  {
    id: 'f12', tier: 'fondamental', topic: 'reglages',
    question: 'Une pose de plusieurs secondes rend une rivière…',
    choices: ['Soyeuse, comme un voile', 'Figée en gouttelettes', 'Plus sombre', 'Granuleuse'], answer: 0,
    explain: 'Le mouvement de l’eau s’accumule pendant la pose.',
  },
  {
    id: 'f13', tier: 'fondamental', topic: 'reglages',
    question: 'En mode A (ou Av)…',
    choices: ['Vous choisissez l’ouverture, l’appareil la vitesse', 'Vous choisissez la vitesse, l’appareil l’ouverture', 'Vous réglez tout', 'L’appareil règle tout'], answer: 0,
    explain: 'A = priorité ouverture.',
  },
  {
    id: 'f14', tier: 'fondamental', topic: 'reglages',
    question: 'En mode S (ou Tv)…',
    choices: ['Vous choisissez la vitesse', 'Vous choisissez l’ouverture', 'Vous choisissez l’ISO', 'Le flash est forcé'], answer: 0,
    explain: 'S / Tv = priorité vitesse.',
  },
  {
    id: 'f15', tier: 'fondamental', topic: 'composition',
    question: 'Qu’est-ce qui réduit la profondeur de champ ?',
    choices: ['Se rapprocher du sujet', 'S’éloigner du sujet', 'Fermer à f/16', 'Monter l’ISO'], answer: 0,
    explain: 'Plus le sujet est proche, plus la zone nette est fine.',
  },
  {
    id: 'f16', tier: 'fondamental', topic: 'reglages',
    question: 'La stabilisation d’image corrige…',
    choices: ['Le tremblement de vos mains', 'Le mouvement du sujet', 'Le bruit', 'La surexposition'], answer: 0,
    explain: 'Elle compense vos mouvements, jamais ceux du sujet.',
  },
  {
    id: 'f17', tier: 'fondamental', topic: 'reglages',
    question: 'Le mode « Portrait » d’un smartphone imite…',
    choices: ['Une grande ouverture', 'Une vitesse rapide', 'Un ISO bas', 'Un téléobjectif'], answer: 0,
    explain: 'Il floute le fond par calcul, comme un objectif très ouvert.',
  },
  {
    id: 'f18', tier: 'fondamental', topic: 'lumiere',
    question: 'Le soleil de midi sur un visage donne…',
    choices: ['Des ombres dures sous les yeux', 'Une lumière douce', 'Une lumière bleutée', 'Aucune ombre'], answer: 0,
    explain: 'Lumière verticale et ponctuelle : ombres noires et marquées.',
  },
  {
    id: 'f19', tier: 'fondamental', topic: 'lumiere',
    question: 'Entre f/1.4 et f/2.8, f/1.4 laisse passer…',
    choices: ['4 fois plus de lumière', '2 fois plus de lumière', 'Autant', 'Moins de lumière'], answer: 0,
    explain: 'f/1.4 → f/2 → f/2.8 : deux stops, soit ×4.',
  },
  {
    id: 'f20', tier: 'fondamental', topic: 'reglages',
    question: 'Scène sombre, pas de trépied : que faire en priorité ?',
    choices: ['Monter l’ISO', 'Ralentir à 1 s', 'Fermer à f/16', 'Baisser l’ISO'], answer: 0,
    explain: 'Une photo un peu bruitée vaut mieux qu’une photo floue.',
  },

  // ——— Avancé : valide la mesure, la lumière et la composition, débloque le niveau Expert ———
  {
    id: 'a01', tier: 'avance', topic: 'mesure',
    question: 'La cellule de l’appareil cherche à rendre la scène…',
    choices: ['Gris moyen (18 %)', 'Blanche', 'Noire', 'La plus saturée possible'], answer: 0,
    explain: 'C’est pourquoi neige et fonds noirs sont mal exposés par défaut.',
  },
  {
    id: 'a02', tier: 'avance', topic: 'mesure',
    question: 'Paysage enneigé : quelle correction d’exposition ?',
    choices: ['+1 à +2', '−1 à −2', '0', '−3'], answer: 0,
    explain: 'La cellule assombrit la neige vers le gris ; on corrige vers le +.',
  },
  {
    id: 'a03', tier: 'avance', topic: 'mesure',
    question: 'Un musicien éclairé sur une scène noire : quelle correction ?',
    choices: ['Vers le −', 'Vers le +', 'Aucune', 'Monter l’ISO uniquement'], answer: 0,
    explain: 'Le fond noir pousse la cellule à surexposer le sujet.',
  },
  {
    id: 'a04', tier: 'avance', topic: 'mesure',
    question: 'La mesure spot est idéale pour…',
    choices: ['Un visage en contre-jour', 'Un paysage uniforme', 'Une photo de groupe', 'Une vidéo'], answer: 0,
    explain: 'Elle ne mesure qu’une petite zone : celle qui compte.',
  },
  {
    id: 'a05', tier: 'avance', topic: 'mesure',
    question: 'Un histogramme collé au bord droit signifie…',
    choices: ['Des blancs cramés', 'Des noirs bouchés', 'Du bruit', 'Du flou'], answer: 0,
    explain: 'La droite représente les tons les plus clairs.',
  },
  {
    id: 'a06', tier: 'avance', topic: 'mesure',
    question: 'Un histogramme collé au bord gauche signifie…',
    choices: ['Des ombres bouchées', 'Des blancs cramés', 'Une image floue', 'Une balance des blancs fausse'], answer: 0,
    explain: 'La gauche représente les noirs.',
  },
  {
    id: 'a07', tier: 'avance', topic: 'mesure',
    question: 'Le mode de mesure matricielle (évaluative)…',
    choices: ['Analyse toute l’image', 'Mesure seulement le centre', 'Mesure un point', 'Désactive la cellule'], answer: 0,
    explain: 'C’est le meilleur réglage par défaut.',
  },
  {
    id: 'a08', tier: 'avance', topic: 'mesure',
    question: 'En mode M, l’indicateur d’exposition sur 0 veut dire…',
    choices: ['Exposition conforme à la cellule', 'Image surexposée', 'Image sous-exposée', 'Flash nécessaire'], answer: 0,
    explain: 'Le barème montre l’écart entre vos réglages et la mesure.',
  },
  {
    id: 'a09', tier: 'avance', topic: 'lumiere',
    question: 'L’heure dorée, c’est…',
    choices: ['Peu après le lever et avant le coucher du soleil', 'Midi', 'Le milieu de la nuit', 'Toute journée nuageuse'], answer: 0,
    explain: 'Soleil bas : lumière chaude, rasante et flatteuse.',
  },
  {
    id: 'a10', tier: 'avance', topic: 'lumiere',
    question: 'Un ciel couvert donne une lumière…',
    choices: ['Douce, idéale pour le portrait', 'Dure et contrastée', 'Très chaude', 'Inutilisable'], answer: 0,
    explain: 'Les nuages diffusent la lumière comme une immense boîte à lumière.',
  },
  {
    id: 'a11', tier: 'avance', topic: 'lumiere',
    question: 'Une lumière latérale (de côté)…',
    choices: ['Souligne les textures et le relief', 'Aplatit le sujet', 'Supprime les ombres', 'Rend l’image bleue'], answer: 0,
    explain: 'Les ombres portées révèlent les volumes.',
  },
  {
    id: 'a12', tier: 'avance', topic: 'lumiere',
    question: 'Pour une silhouette noire sur un coucher de soleil :',
    choices: ['Exposer pour le ciel (correction −)', 'Correction +2', 'Flash au maximum', 'ISO 6400'], answer: 0,
    explain: 'Le ciel bien exposé laisse le sujet dans le noir.',
  },
  {
    id: 'a13', tier: 'avance', topic: 'lumiere',
    question: 'Contre-jour, visage lisible sans flash :',
    choices: ['Correction +1 ou mesure spot sur le visage', 'Correction −2', 'Fermer à f/16', 'Vitesse 1/4000 s'], answer: 0,
    explain: 'On sacrifie un peu le ciel pour exposer le visage.',
  },
  {
    id: 'a14', tier: 'avance', topic: 'composition',
    question: 'Portrait : où faire la mise au point ?',
    choices: ['Sur l’œil le plus proche', 'Sur le nez', 'Sur l’arrière-plan', 'Sur l’épaule'], answer: 0,
    explain: 'Un œil net suffit à rendre un portrait « net ».',
  },
  {
    id: 'a15', tier: 'avance', topic: 'composition',
    question: 'Pourquoi laisser de l’espace devant un sujet qui avance ?',
    choices: ['Pour que l’œil suive son mouvement', 'Pour équilibrer l’exposition', 'Pour réduire le bruit', 'Pour éviter la diffraction'], answer: 0,
    explain: 'Le regard « anticipe » la direction du sujet.',
  },
  {
    id: 'a16', tier: 'avance', topic: 'composition',
    question: 'Une composition minimaliste repose sur…',
    choices: ['Un sujet unique et beaucoup d’espace vide', 'Le plus d’éléments possible', 'Un sujet toujours centré', 'Un fond très chargé'], answer: 0,
    explain: 'L’espace négatif met le sujet en valeur.',
  },
  {
    id: 'a17', tier: 'avance', topic: 'reglages',
    question: 'Au-delà de f/16, un paysage perd en netteté à cause…',
    choices: ['De la diffraction', 'Du bruit', 'Du vignettage', 'De la balance des blancs'], answer: 0,
    explain: 'Un trou très petit disperse la lumière : restez vers f/8 – f/11.',
  },
  {
    id: 'a18', tier: 'avance', topic: 'reglages',
    question: 'Sur trépied, le retardateur 2 s sert à…',
    choices: ['Éviter les vibrations du déclenchement', 'Faire la mise au point', 'Réduire le bruit', 'Mesurer la lumière'], answer: 0,
    explain: 'Appuyer sur le déclencheur fait bouger l’appareil.',
  },
  {
    id: 'a19', tier: 'avance', topic: 'lumiere',
    question: 'Pour transformer les lampadaires en étoiles la nuit :',
    choices: ['Fermer le diaphragme (f/8 – f/16)', 'Ouvrir à f/1.8', 'Monter à ISO 6400', 'Vitesse 1/1000 s'], answer: 0,
    explain: 'Les lamelles du diaphragme fermé créent des branches de lumière.',
  },
  {
    id: 'a20', tier: 'avance', topic: 'reglages',
    question: 'En photo de rue, quelle vitesse minimale viser ?',
    choices: ['1/500 s', '1/30 s', '1/8 s', '2 s'], answer: 0,
    explain: 'Les passants bougent vite : 1/500 s les fige.',
  },
];
