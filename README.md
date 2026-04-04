# ZAF BAT OS — V1

V1 simple de l'OS interne **ZAF BAT** pour une cible **HNWI au Maroc & MRE**.

## Objectif de cette V1
Poser une base cohérente et minimaliste autour de 5 modules prioritaires :
1. Leads
2. Qualification
3. Projets
4. Reporting hebdomadaire
5. Génération de documents

## Architecture proposée (minimaliste, extensible)
Architecture modulaire orientée domaines :

- `src/` : interface V1 (écrans Leads + Projets)
- `docs/architecture.md` : vision projet, modules et flux
- `docs/data-model.md` : modèle de données de référence (MVP)

Voir le détail dans `docs/architecture.md`.

## Modèle de données
Le modèle couvre les entités métier clés :
- `lead`
- `qualification`
- `project`
- `weekly_report`
- `generated_document`

Voir `docs/data-model.md`.

## Fichiers créés et rôle
- `README.md` : cadrage global de la V1 + index documentaire.
- `docs/architecture.md` : architecture cible et découpage des modules prioritaires.
- `docs/data-model.md` : schéma logique MVP, relations et statuts.
- `src/index.html` : premier écran applicatif (navigation + pages Leads/Projets).
- `src/styles.css` : design sobre/premium (couleurs, grille, cartes, tableaux).
- `src/app.js` : données mock, rendu des tableaux et interactions simples (filtres/onglets).

## Lancement local (sans dépendances)
Ouvrir simplement `src/index.html` dans un navigateur.
