# Décisions Techniques

Ce fichier trace les choix architecturaux et technologiques majeurs pris durant le projet.

## 1. Plan d'action et gestion de projet

Initialisation du trello pour la gestion du projet.
Dans un premier temps, on a listé les fonctionnalités nécessaires (voir "Backlog"). On a commencé par gerer les 3 Apis séparément
(GeoAPI, GreenData, Georisques) pour isoler les problématiques et s'assurer de la cohérence des données. Dans le même temps on a travaillé sur l'interface utilisateur, l'affiche des données et la gestion des erreurs.

## 2. Choix de la Stack Technique

- **React 19 + TypeScript + Vite** : Choix d'un tooling moderne et performant pour le développement d'une Single Page Application (SPA). Le typage strict TypeScript garantit la sécurité des données échangées entre les API et l'interface.
- **DSFR (`@codegouvfr/react-dsfr`)** : Intégration du Système de Design de l'État pour assurer une identité visuelle conforme aux normes gouvernementales françaises et respecter les standards d'accessibilité (RGAA).
- **React Router (v7)** : Navigation côté client avec gestion des routes principales (`/`, `/info/:codeInsee`, `/risques`, `404`).

## 3. Architecture des API et Croisement des Données

Le cœur de l'application repose sur le chaînage et l'enrichissement de 3 API publiques :
1. **API Geo (`geo.api.gouv.fr`)** : Recherche et autocomplétion des communes par nom, code postal ou code INSEE avec tri par population.
2. **API Géorisques (GASPAR)** : Récupération et synthèse des risques naturels et technologiques par code INSEE.
3. **API Annuaire Service Public** : 
   - Exploitation du jeu de données de *compétence géographique* pour obtenir la liste des services qui couvrent le territoire sélectionné.
   - **Enrichissement synchrone** via le jeu de données d'administration locale pour extraire le nom officiel de la structure et l'adresse physique complète (parsing JSON sécurisé).

## 4. Normalisation du Domaine et Résilience des Données (US C2)

Afin d'éviter tout crash applicatif (`TypeError`) en cas de données partielles ou indisponibles côté API :
- **Couche Domaine (`src/domain/`)** : Implémentation de fonctions de normalisation dédiées (`CommuneData`, `normalizeServicePublic`, `normalizeRiskSummary`).
- **Fallbacks explicites** : Lorsqu'une information est absente (ex: adresse manquante), une mention claire est affichée à l'usager (*"Adresse non renseignée"*) au lieu d'une valeur brute `undefined` ou `null`.
- **Tests unitaires (Vitest)** : Validation par des tests automatisés couvrant les cas limites d'objets `null`, `undefined` ou incomplets.

## 5. Gestion des États d'Interface et UX (US B1 à B5)

L'interface gère explicitement 5 états visuels pour chaque interaction usager :
- **État Initial (`InitialState`)** : Invite à la recherche et à l'exploration.
- **État de Chargement (`Spinner`)** : Indicateur visuel immédiat enrichi avec des attributs d'accessibilité ARIA (`role="status"`, `aria-live="polite"`), un loader HTML natif pour la 3G lente et une hauteur minimale (`min-height: 60vh`) pour éviter les décalages de mise en page (CLS).
- **État Vide (`EmptyState`)** : Message pédagogique proposant des actions concrètes lorsque aucun résultat n'est trouvé.
- **État d'Erreur (`ErrorState`)** : Message honnête sans code HTTP brut ni trace technique, accompagné d'un bouton de réessai.
- **État Succès / Fiche Détaillée (`DetailSheet`)** : Vue complète combinant l'identité de la commune, la liste des risques et les cartes de services publics paginées (10, 20, 50 par page).

## 6. Stratégie de Déploiement

- **Render.com** : Déploiement continu configuré via `render.yaml`.
- **Pipeline de Build** : Automatisation de l'optimisation des CSS du DSFR (`react-dsfr optimize-css`) suivie de la compilation TypeScript et du bundler Vite (`tsc -b && vite build`).
