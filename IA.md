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
