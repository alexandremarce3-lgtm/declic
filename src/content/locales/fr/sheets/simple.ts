import type { Block } from '@/content/types';

/**
 * Versions « Simple » des fiches débutant, par identifiant de fiche.
 * Règles d'écriture :
 *   - des mots de tous les jours, des phrases courtes, aucun mot technique sans explication ;
 *   - une seule idée par fiche, montrée par des exemples dessinés avant / après ;
 *   - toujours finir par « ce que je fais » et « sur mon téléphone ».
 */
export const simpleVersions: Record<string, Block[]> = {
  'triangle-exposition': [
    { kind: 'oneLiner', body: 'Une photo, c’est de la lumière. Trois réglages décident de la quantité qui entre.' },
    {
      kind: 'analogy',
      icon: '🚰',
      body: 'Imaginez remplir un verre d’eau. Vous pouvez ouvrir plus le robinet, le laisser couler plus longtemps, ou prendre un plus petit verre. Le résultat est le même : un verre plein.',
    },
    {
      kind: 'compare',
      title: 'Trop peu, juste ce qu’il faut, trop',
      items: [
        { scene: 'exposure-dark', label: 'Trop sombre', caption: 'Pas assez de lumière. On ne voit presque rien.' },
        { scene: 'exposure-good', label: 'Juste bien', caption: 'La bonne quantité. On voit tout, les couleurs sont belles.' },
        { scene: 'exposure-bright', label: 'Trop claire', caption: 'Trop de lumière. Le ciel est tout blanc, les couleurs ont disparu.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Les trois réglages',
      items: [
        'L’ouverture : la taille du trou qui laisse entrer la lumière.',
        'La vitesse : combien de temps le trou reste ouvert.',
        'L’ISO : à quel point l’appareil « monte le son » de la lumière.',
      ],
    },
    {
      kind: 'tip',
      label: 'Ce que je fais',
      body: 'Ma photo est trop sombre ? Je change UN seul réglage à la fois, et je regarde ce qui se passe. Chaque fiche suivante explique un réglage.',
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Il fait tout seul. Mais si je touche l’écran puis glisse le petit soleil, je décide moi-même si la photo est plus claire ou plus sombre.' },
  ],

  ouverture: [
    { kind: 'oneLiner', body: 'L’ouverture, c’est la taille du trou par lequel la lumière entre. Elle décide aussi si le fond est flou.' },
    {
      kind: 'analogy',
      icon: '👁️',
      body: 'C’est comme la pupille de votre œil : dans le noir, elle s’agrandit pour voir plus de lumière.',
    },
    {
      kind: 'compare',
      title: 'Même personne, deux réglages',
      items: [
        { scene: 'portrait-bokeh', label: 'Grand trou', caption: 'Le fond devient tout flou. La personne ressort.' },
        { scene: 'portrait-sharp', label: 'Petit trou', caption: 'Tout est net : la personne, les arbres, la maison.' },
      ],
    },
    {
      kind: 'tip',
      label: 'Le piège à connaître',
      body: 'On écrit l’ouverture avec un chiffre, par exemple f/2 ou f/16. Et c’est à l’envers : petit chiffre = grand trou = fond flou.',
    },
    { kind: 'tip', label: 'Ce que je fais', body: 'Pour un portrait : le plus petit chiffre possible. Pour un paysage : autour de f/8.' },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Le mode « Portrait » fait le fond flou à ma place.' },
  ],

  vitesse: [
    { kind: 'oneLiner', body: 'La vitesse, c’est le temps pendant lequel l’appareil regarde la scène.' },
    {
      kind: 'analogy',
      icon: '😉',
      body: 'Comme un clin d’œil : très rapide, vous voyez un instant figé. Les yeux ouverts longtemps, tout ce qui bouge laisse une trace.',
    },
    {
      kind: 'compare',
      title: 'Un enfant qui court',
      items: [
        { scene: 'runner-frozen', label: 'Rapide', caption: 'L’enfant est net, comme arrêté en plein saut.' },
        { scene: 'runner-blur', label: 'Lent', caption: 'L’enfant laisse une traînée floue derrière lui.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Une fontaine',
      items: [
        { scene: 'water-frozen', label: 'Rapide', caption: 'On voit chaque goutte d’eau.' },
        { scene: 'water-silky', label: 'Lent', caption: 'L’eau devient un voile tout doux.' },
      ],
    },
    { kind: 'tip', label: 'Ce que je fais', body: 'Ça bouge ? Je choisis une vitesse rapide. Je veux un effet de mouvement ? Je pose l’appareil et je choisis lent.' },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Je tiens le téléphone à deux mains et je ne bouge plus au moment de prendre la photo.' },
  ],

  iso: [
    { kind: 'oneLiner', body: 'L’ISO éclaircit la photo quand il fait sombre. Mais plus on le monte, plus il y a de grain.' },
    {
      kind: 'analogy',
      icon: '📻',
      body: 'Comme le volume d’une vieille radio : plus vous montez le son, mieux vous entendez… mais ça grésille aussi.',
    },
    {
      kind: 'compare',
      title: 'La même rue, la nuit',
      items: [
        { scene: 'night-clean', label: 'ISO bas', caption: 'Image propre et lisse. Mais il faut beaucoup de lumière, ou un appareil bien posé.' },
        { scene: 'night-grainy', label: 'ISO haut', caption: 'On voit dans le noir, mais l’image est pleine de petits points : le « grain ».' },
      ],
    },
    { kind: 'tip', label: 'Ce que je fais', body: 'En plein jour : ISO le plus bas (100). Il fait sombre : je monte petit à petit. Un peu de grain vaut mieux qu’une photo floue.' },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Il monte l’ISO tout seul la nuit. Pour moins de grain, je me rapproche d’une lumière.' },
  ],

  // ——— Niveau Avancé ———

  'mesure-lumiere': [
    { kind: 'oneLiner', body: 'L’appareil veut que tout soit « moyen ». Devant du très clair ou du très sombre, il se trompe.' },
    {
      kind: 'analogy',
      icon: '🎚️',
      body: 'C’est un ami qui règle toujours le volume « au milieu ». Pour une berceuse c’est trop fort, pour un concert trop faible. Il faut parfois lui dire : plus, ou moins.',
    },
    {
      kind: 'compare',
      title: 'Un paysage de neige',
      items: [
        { scene: 'snow-grey', label: 'Ce que fait l’appareil', caption: 'La neige devient grise et triste. Il a voulu la rendre « moyenne ».' },
        { scene: 'snow-white', label: 'Après correction +', caption: 'La neige redevient blanche, comme dans la réalité.' },
      ],
    },
    {
      kind: 'steps',
      title: 'La règle à retenir',
      items: ['Beaucoup de blanc (neige, plage) : je corrige vers le +.', 'Beaucoup de noir (concert, nuit) : je corrige vers le −.', 'Le reste du temps : je ne touche à rien.'],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Je touche l’écran, puis je fais glisser le petit soleil vers le haut (+) ou vers le bas (−).' },
  ],

  histogramme: [
    { kind: 'oneLiner', body: 'L’histogramme est une petite montagne qui dit si la photo est trop sombre ou trop claire.' },
    {
      kind: 'analogy',
      icon: '⛰️',
      body: 'À gauche, il y a le noir. À droite, le blanc. La montagne montre où se trouvent la plupart des points de votre photo.',
    },
    {
      kind: 'compare',
      title: 'Trois montagnes, trois photos',
      items: [
        { scene: 'histogram-left', label: 'Collée à gauche', caption: 'Photo trop sombre : des zones toutes noires, sans détails.' },
        { scene: 'histogram-center', label: 'Au milieu', caption: 'Photo équilibrée : ni trop noire, ni trop blanche.' },
        { scene: 'histogram-right', label: 'Collée à droite', caption: 'Photo trop claire : des zones toutes blanches, perdues.' },
      ],
    },
    { kind: 'tip', label: 'Ce que je fais', body: 'Si la montagne touche le bord droit, je corrige vers le −. Le bord gauche, vers le +.' },
    { kind: 'tip', label: 'Pourquoi c’est utile', body: 'En plein soleil, l’écran est difficile à lire. La montagne, elle, ne ment jamais.' },
  ],

  'lumiere-naturelle': [
    { kind: 'oneLiner', body: 'La même chose, photographiée à une autre heure, donne une tout autre photo.' },
    {
      kind: 'compare',
      title: 'Le même arbre, trois lumières',
      items: [
        { scene: 'light-noon', label: 'À midi', caption: 'Lumière dure, ombre petite et très noire. Peu flatteur.' },
        { scene: 'light-golden', label: 'En fin de journée', caption: 'Lumière dorée, ombres longues : c’est « l’heure dorée ».' },
        { scene: 'light-overcast', label: 'Ciel nuageux', caption: 'Lumière douce, sans ombre dure. Parfait pour les visages.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Le soleil dans le dos de la personne',
      items: [{ scene: 'light-backlit', label: 'Contre-jour', caption: 'La personne devient une silhouette noire, entourée de lumière.' }, { scene: 'portrait-soft', label: 'Soleil de côté ou nuages', caption: 'On voit bien le visage.' }],
    },
    { kind: 'tip', label: 'Ce que je fais', body: 'Avant la photo, je regarde où va l’ombre. Si elle gêne, je tourne autour du sujet.' },
  ],

  'regle-des-tiers': [
    { kind: 'oneLiner', body: 'Ne mettez pas toujours le sujet au milieu : un peu sur le côté, c’est souvent plus beau.' },
    {
      kind: 'analogy',
      icon: '#️⃣',
      body: 'Imaginez un « # » sur votre écran. Placez le sujet sur une des lignes, ou là où elles se croisent.',
    },
    {
      kind: 'compare',
      title: 'Le même bateau',
      items: [
        { scene: 'thirds-centered', label: 'Tout au milieu', caption: 'Le bateau et l’horizon coupent l’image en deux. C’est figé.' },
        { scene: 'thirds-offset', label: 'Sur les lignes', caption: 'L’horizon en bas, le bateau sur un croisement : l’image respire.' },
      ],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Dans les réglages de l’appareil photo, activez la « grille ». Le « # » apparaît à l’écran.' },
  ],

  portrait: [
    { kind: 'oneLiner', body: 'Un beau portrait, c’est surtout une lumière douce et un fond qui ne dérange pas.' },
    {
      kind: 'compare',
      title: 'La même personne',
      items: [
        { scene: 'portrait-harsh', label: 'Soleil de midi', caption: 'Ombres noires sous les yeux, la personne plisse les yeux.' },
        { scene: 'portrait-soft', label: 'À l’ombre', caption: 'Lumière douce, visage lisible et naturel.' },
      ],
    },
    {
      kind: 'compare',
      title: 'Et le fond ?',
      items: [
        { scene: 'portrait-sharp', label: 'Fond net', caption: 'Tout attire l’œil : arbres, maison… la personne se perd.' },
        { scene: 'portrait-bokeh', label: 'Fond flou', caption: 'La personne ressort. On ne regarde qu’elle.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Ce que je fais',
      ordered: true,
      items: ['Je mets la personne à l’ombre.', 'Je l’éloigne du mur ou des arbres derrière elle.', 'Je fais la mise au point sur ses yeux.'],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Mode Portrait, et je touche le visage à l’écran avant de prendre la photo.' },
  ],

  rue: [
    { kind: 'oneLiner', body: 'Dans la rue, tout bouge vite : il faut une vitesse rapide pour ne pas avoir de flou.' },
    {
      kind: 'compare',
      title: 'Un passant pressé',
      items: [
        { scene: 'street-frozen', label: 'Vitesse rapide', caption: 'Le passant est net, figé en plein pas.' },
        { scene: 'street-blur', label: 'Vitesse lente', caption: 'Le passant est flou. C’est raté… sauf si c’est voulu.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Ce que je fais',
      items: ['Je trouve un joli décor, et j’attends que quelqu’un passe dedans.', 'Je reste discret : un petit appareil ou mon téléphone.', 'Je respecte les gens : si quelqu’un ne veut pas, je ne garde pas la photo.'],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'J’appuie longtemps sur le bouton pour prendre une rafale, puis je garde la meilleure.' },
  ],

  paysage: [
    { kind: 'oneLiner', body: 'Un beau paysage a quelque chose devant : une pierre, des fleurs, un chemin.' },
    {
      kind: 'compare',
      title: 'Le même paysage',
      items: [
        { scene: 'landscape-flat', label: 'Rien devant', caption: 'Ça paraît plat et lointain. L’horizon coupe l’image en deux.' },
        { scene: 'landscape-depth', label: 'Un premier plan', caption: 'Le rocher et le chemin donnent de la profondeur. On a envie d’y entrer.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Ce que je fais',
      items: ['Je baisse l’appareil pour voir quelque chose devant.', 'Je mets l’horizon en bas ou en haut, jamais au milieu.', 'Je sors tôt le matin ou en fin de journée.'],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Je tiens le téléphone bien droit : un horizon penché se remarque tout de suite.' },
  ],

  nuit: [
    { kind: 'oneLiner', body: 'La nuit, l’appareil a besoin de temps. Le moindre mouvement rend la photo floue.' },
    {
      kind: 'analogy',
      icon: '🫙',
      body: 'Comme remplir un bocal au goutte-à-goutte : il faut attendre longtemps… sans renverser le bocal.',
    },
    {
      kind: 'compare',
      title: 'La même rue, la nuit',
      items: [
        { scene: 'night-handheld', label: 'À la main', caption: 'Tout est doublé et flou : mes mains ont bougé.' },
        { scene: 'night-tripod', label: 'Appareil posé', caption: 'Tout est net, et les lampadaires deviennent des étoiles.' },
      ],
    },
    {
      kind: 'steps',
      title: 'Ce que je fais',
      ordered: true,
      items: ['Je pose l’appareil : trépied, muret, banc.', 'J’utilise le retardateur pour ne pas le faire bouger en appuyant.', 'Je ne touche plus à rien pendant la photo.'],
    },
    { kind: 'tip', label: 'Sur mon téléphone', body: 'Le mode Nuit s’active seul. Je cale le téléphone contre quelque chose et je ne bouge plus.' },
  ],
};
