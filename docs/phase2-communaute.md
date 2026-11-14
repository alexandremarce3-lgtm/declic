# Déclic — Phase 2 : l'espace communautaire

> Document de conception. Rien de ce qui suit n'est codé : la phase 1 (actuelle) fonctionne
> **sans serveur**. Ce document liste ce qu'il faudra construire, et surtout les décisions
> à prendre avant d'écrire une ligne de code. Les points juridiques sont à faire valider
> par un ou une juriste (droit du numérique + RGPD).

## 1. Ce qui existe déjà (phase 1, locale)

| Besoin du cahier des charges | État |
| --- | --- |
| Choix du profil Photographe / Modèle | ✅ accueil (`/bienvenue`), modifiable depuis le profil |
| Déclaration de majorité sur l'honneur | ✅ accueil + porte d'entrée `AdultGate` sur tout l'espace collaborations |
| Politique de confidentialité, conditions, mentions légales | ✅ brouillons dans `content/locales/fr/collab.ts`, infos éditeur à compléter dans `config/editor.ts` |
| Effacement total en un geste | ✅ Profil > « Effacer toutes mes données » (progression, identité, avatar, photos, accords) |
| Signaler un abus | ✅ e-mail à l'éditeur (pas de contenu partagé entre utilisateurs pour l'instant) |
| FAQ TFP interactive + bonus d'XP | ✅ `/collab/faq` (+30 XP une fois) |
| Contrat-Minute + double signature + récapitulatif partagé | ✅ sur **un seul téléphone** (les deux personnes ensemble), PDF partageable, +40 XP |
| Parcours Modèle (moodboard, charte, accord, quiz lumière, fiches présence) | ✅ `/modele`, badges dans les succès |

Ce qui manque et **exige un serveur** : comptes, profils publics, galeries/portfolios partagés,
mise en relation, signature à distance, signalement de contenus publiés.

## 2. Principe directeur : « l'éditeur ne voit pas les photos »

### Architecture proposée : chiffrement de bout en bout (E2EE)

- Chaque compte possède une **paire de clés** générée sur le téléphone (bibliothèque éprouvée :
  libsodium). La clé privée ne quitte jamais l'appareil (stockée dans le trousseau sécurisé,
  `expo-secure-store`), avec une **phrase de récupération** affichée une fois à l'utilisateur.
- Chaque galerie a sa propre **clé de contenu**. Les photos sont chiffrées sur le téléphone
  avant envoi ; le serveur ne stocke que des fichiers illisibles.
- Partager une galerie = chiffrer sa clé de contenu pour la clé publique du destinataire.
  Retirer l'accès = changer de clé et rechiffrer les nouvelles photos.
- Le serveur ne connaît que des **métadonnées minimales** : identifiant de compte, pseudonyme,
  qui partage avec qui, dates. À documenter dans le registre des traitements.

> « Pair-à-pair » au sens strict (sans serveur relais) n'est pas réaliste sur mobile : les
> téléphones sont rarement joignables en même temps. Le chiffrement de bout en bout avec un
> serveur « aveugle » donne la même garantie de confidentialité, de façon fiable.

### Le point dur : signalement ↔ chiffrement

La loi impose de pouvoir **retirer promptement un contenu manifestement illicite signalé**.
Avec l'E2EE, l'éditeur ne peut pas regarder un contenu… sauf si on le lui montre.
Solution retenue par les messageries chiffrées :

1. La personne qui signale **a déjà accès** au contenu (elle a la clé).
2. Son signalement joint le contenu déchiffré (ou la clé du seul élément signalé).
3. Seul ce contenu devient visible pour la modération, jamais le reste de la galerie.

**Décision à prendre :** la détection proactive d'images d'abus sur mineurs (empreintes de type
PhotoDNA) est incompatible avec l'E2EE côté serveur. À arbitrer avec un juriste avant le lancement.

## 3. Cadre juridique (à valider)

- **Statut d'hébergeur** (LCEN, art. 6, et **DSA**, règlement européen sur les services numériques) :
  responsabilité limitée à condition d'agir promptement après signalement. Obligations DSA à prévoir :
  mécanisme de notification simple sur chaque contenu, accusé de réception, **décision motivée**
  envoyée à l'auteur du contenu, possibilité de contester, point de contact unique, rapport de
  transparence (allégé pour les petites structures).
- **Âge** : la déclaration sur l'honneur suffit pour du contenu artistique non pornographique.
  Si un contenu pouvait être qualifié de pornographique, une **vérification d'âge réelle** (référentiel
  Arcom) deviendrait obligatoire. Le nu artistique doit rester clairement hors de ce champ
  (modération + conditions d'utilisation).
- **RGPD** : hébergement dans l'Union européenne, contrat de sous-traitance avec l'hébergeur,
  registre des traitements, et très probablement une **analyse d'impact (AIPD)** : photos
  intimes, possible déduction d'informations sensibles.
- **Droit à l'image et droits d'auteur** : le Contrat-Minute couvre déjà l'essentiel ;
  à faire relire, en particulier la clause de retrait à la demande.
- **Stores** : Google Play et l'App Store limitent fortement la nudité, même artistique, et
  exigent pour tout contenu publié par les utilisateurs : signalement, blocage d'un utilisateur,
  filtrage et réponse rapide. **Risque réel de refus** si des photos de nu sont visibles dans l'app :
  envisager de garder les galeries sensibles hors de l'app publique (lien web privé) ou floutées
  par défaut.

## 4. Signature à distance du Contrat-Minute

1. Le photographe (ou le modèle) remplit l'accord et l'envoie par un lien d'invitation.
2. L'autre personne l'ouvre, le relit, peut proposer des modifications (nouvelle version).
3. Chacun signe sur son propre téléphone ; le serveur horodate et calcule une **empreinte**
   (SHA-256) du texte exact signé, jointe au PDF final.
4. Option « preuve renforcée » : passer par un prestataire de signature électronique avancée
   (règlement eIDAS) pour les séances sensibles.

## 5. Briques techniques suggérées

| Brique | Proposition | Pourquoi |
| --- | --- | --- |
| Back-end | Supabase (région UE) ou serveur Node + PostgreSQL | auth, base, stockage de fichiers, règles d'accès |
| Chiffrement | libsodium (`react-native-libsodium`) | primitives auditées ; ne pas inventer sa crypto |
| Clés | `expo-secure-store` | trousseau iOS / Keystore Android |
| Notifications | Expo Notifications | invitations à signer, demandes de retrait |
| Modération | file de signalements + tableau de bord minimal | obligations LCEN / DSA |

## 6. Ordre de construction conseillé

1. Comptes pseudonymes + suppression de compte serveur (effacement réel côté serveur, sous 30 jours max).
2. Signature à distance du Contrat-Minute (pas de photo sur le serveur : faible risque).
3. Signalement, blocage, modération : **avant** toute galerie.
4. Galeries chiffrées privées (partage à une personne précise).
5. Profils publics et mise en relation, en dernier.

## 7. Questions ouvertes pour l'éditeur

- Statut juridique de l'éditeur (particulier, micro-entreprise, association) ?
- Budget hébergement et temps de modération disponible ?
- Les photos de nu doivent-elles être partageables dans l'app, ou seulement les accords ?
- Public visé : France uniquement, ou Union européenne ?
