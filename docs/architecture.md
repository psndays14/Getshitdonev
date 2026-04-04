# Architecture projet — ZAF BAT OS (V1)

## 1) Principes
- **Simple d'abord** : monorepo léger, front statique, données mockées.
- **Modulaire** : séparation par domaine métier.
- **Évolutif** : migration facile vers API + DB sans refaire l'UI.

## 2) Découpage des modules

### A. Leads
- Capture des prospects HNWI/MRE
- Vue pipeline: `Nouveau`, `Contacté`, `Rendez-vous`, `Converti`
- Champs de base: source, budget estimé, zone d'intérêt, owner

### B. Qualification
- Scoring (budget, intention, horizon, solvabilité)
- Segment: `HNWI Maroc`, `MRE Europe`, `MRE GCC`, etc.
- Décision: `A traiter`, `A nurturer`, `Non prioritaire`

### C. Projets
- Suivi des dossiers/projets actifs
- Statut: `Planification`, `En cours`, `Bloqué`, `Livré`
- Jalons, responsables, valeur estimée

### D. Reporting hebdomadaire
- KPI commerciaux et opérationnels par semaine
- Conversion leads → projets
- État des projets critiques

### E. Génération de documents
- Templates (proposition, compte-rendu, fiche projet)
- Génération PDF/Word (phase suivante)

## 3) Couches techniques (cible)
- **UI (actuelle)** : HTML/CSS/JS vanilla pour validation rapide.
- **Application (future)** : API Node/Nest ou Django/FastAPI.
- **Data (future)** : PostgreSQL + stockage document.
- **Automation (future)** : jobs hebdo reporting + templates documents.

## 4) Flux métier principal
1. Création Lead
2. Qualification (score + segment)
3. Conversion en Projet
4. Suivi de delivery
5. Consolidation en reporting hebdo
6. Génération de documents clients/interne
