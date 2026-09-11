# Déclaration d'Usage de l'Intelligence Artificielle

Ce document liste l'utilisation des outils génératifs (IA) pour ce projet.

## Outils Utilisés
- Antigravity (Gemini 3.6 Pro) : Pour l'aide à la conception architecturale, à la génération de tests unitaires et à l'intégration du DSFR.

## Trois cas où l'assistant s'est trompé (Mathéo)

1. **Rendu d'icône DSFR défectueux (carré bleu au lieu d'une flèche de pagination)** :
   
   - **Erreur de l'IA** : L'assistant a configuré `iconId="fr-icon-arrow-line"` sur le bouton *Précédent*, ce qui produisait un carré bleu plein au lieu de l'icône de flèche en raison d'un problème d'extraction des icônes DSFR.
   
   - **Correction apportée par l'utilisateur** : Lecture de la documentation du DSFR notemment des symboles et icônes, utilisation du composant `Pagination` et correction du code.


2. **Affichage prématuré du message "Aucun service public" pendant le chargement** :
   - **Erreur de l'IA** : L'assistant initialisait le tableau de résultats à `[]` avant la fin des requêtes asynchrones, affichant brièvement à tort le message *"Aucun service public trouvé pour cette commune"* pour une fraction de seconde avant l'arrivée des données.
   
   - **Correction apportée par l'utilisateur** : Réutilisation du composant `Spinner` DSFR pendant le chargement des données, afin d'éviter l'affichage prématuré du message d'absence de données.

3. **Écran blanc sans loader et écrasement du conteneur en simulation 3G lente** :

   - **Erreur de l'IA** : L'assistant liait le loader uniquement à un booléen `loading`. En 3G lente, ce booléen repassait à `false` avant que les données `summary` ne soient prêtes, laissant une zone centrale totalement blanche et écrasant le footer directement sous le header.

   - **Correction apportée par l'utilisateur** : Test en mode 3G lente dans DevTools, correction du code : fixer une hauteur minimale (`min-height: 60vh`) ainsi qu'un spinner persistant tant qu'aucune donnée ou erreur n'est affichée.


## Code écrit sans assistance 

EmptyState.tsx
ErroState.tsx
InitialState.tsx 

## Trois cas où l'assistant s'est trompé (Nicolas)

1. 

Erreur de l'IA : L'ia ne gérait pas le cas où la requête échouait (ex: coupure réseau ou erreur serveur API) et laissait l'application bloquée dans un état de chargement infini sans réinitialiser les compteurs.

Correction apportée : Ajout d'un bloc .catch() réinitialisant proprement le tableau à [] et le compteur totalServices à 0, associé à un bloc .finally() garantissant le passage de loadingServices à false

2. 

Erreur de l'IA : L'ia s'appuyait sur des classes CSS natives du DSFR mal configurées, ce qui faisait que le Spinner ne s'affichait simplement pas à l'écran.

Correction apportée : Implémentation d'un cercle SVG autonome avec une animation @keyframes spin-dsfr intégrée trouver sur google

3. 

Erreur de l'IA : l'ia tentait de lire directement les champs adresse et id_service_local comme de simples chaînes de caractères, provoquant le plantage de l'application (JSON.parse non sécurisé) ou l'affichage de chaînes brutes qui était non formatées (ex:"type_adresse":"Adresse").

Correction apportée : Ajout d'un bloc try / catch sécurisé dans formatAdresse pour extraire dynamiquement les clés du JSON (numero_voie, code_postal, nom_commune), et implémentation du parsing de id_service_local pour récupérer les détails de l'administration via une seconde requête d'enrichissement (adminUrl)

## Code écrit sans assistance 

Partie Render(render.yaml, interface a paramétrés)
Implémentation de la balise spinner dans différents fichiers(DetailSheet.tsx, annuaireSearch.tsx, ect.)
Typage des données reçu par l'api avec Typescript(annuaire.ts)



## Trois cas où l'assistant s'est trompé (Léo)

1. 

Erreur de l'IA : L'ia pensait qu'on faisait la recherche par code postal et non par code insee (c'est ma faute j'ai mal contextualisé), elle m'a donc perdu dans un long truc inutile

Correction apportée : J'ai tout supprimé, pris la base de nicolas pour l'api et on est reparti de 0

2. 

Erreur de l'IA : L'ia n'avait pas prévu de potentiels non retour d'api commme des code postaux non renseignés 

Correction apportée : Il a fallut créer un filtrage avec des donnés ajustés si jamais es cas se manifestait

3. 

Erreur de l'IA : l'ia tentait de lire directement les champs adresse et id_service_local comme de simples chaînes de caractères, provoquant le plantage de l'application (JSON.parse non sécurisé) ou l'affichage de chaînes brutes qui était non formatées (ex:"type_adresse":"Adresse").

Correction apportée : Ajout d'un bloc try / catch sécurisé dans formatAdresse pour extraire dynamiquement les clés du JSON (numero_voie, code_postal, nom_commune), et implémentation du parsing de id_service_local pour récupérer les détails de l'administration via une seconde requête d'enrichissement (adminUrl)


## Code écrit sans assistance 

Les bases de mes fichiers. L'ia a été utilisée par dessus pour de potentiels oublis ou pour gérer des erreurs que je ne comprenais pas