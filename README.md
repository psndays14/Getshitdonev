# ZAF BAT OS — V1 (Local-first MVP)

## ⚠️ Important: GitHub repo page vs app
Si tu ouvres le repo sur `github.com`, tu verras le README (normal).
Pour voir le produit, il faut ouvrir l'URL GitHub Pages du repo:

`https://<USERNAME>.github.io/<REPO>/`

Exemple pour ce repo si owner = `<USERNAME>`:
`https://<USERNAME>.github.io/Getshitdonev/`

Le workflow `.github/workflows/deploy-pages.yml` publie automatiquement le site sur Pages.


V1 utilisable localement pour l'OS interne ZAF BAT, ciblant les workflows **HNWI Maroc** et **MRE**.

## Démarrage
Aucune dépendance.

1. Ouvrir `src/index.html` dans un navigateur.
2. Utiliser les modules via la navigation latérale.
3. Les données sont persistées dans `localStorage` (clé: `zaf_bat_os_v1`).

## Modules implémentés
- Leads (CRUD + recherche + filtre)
- Qualification (scoring, priorité, décision)
- Projets (CRUD + conversion lead qualifié → projet)
- Reporting hebdomadaire (lié à des projets)
- Génération de documents imprimables:
  - compte-rendu de visite
  - proposition premium
  - reporting hebdo
- Import/Export JSON (backup local)

## Fichiers modifiés
- `src/index.html`
  - Structure de l'app (navigation + écrans Dashboard, Leads, Qualification, Projets, Reporting, Documents, Backup)
  - Formulaires opérationnels et tables de données
- `src/styles.css`
  - Système visuel premium/sobre (palette, cartes KPI, tableaux, badges de statut)
  - Composants formulaire/actions lisibles pour un usage exécutif
- `src/app.js`
  - Modèle d'état local-first
  - Seed de données réaliste
  - Persistance `localStorage`
  - CRUD complet sur leads, qualifications, projets, reports
  - Conversion lead qualifié vers projet
  - Génération de vues imprimables
  - Import/Export JSON
- `README.md`
  - Guide d'utilisation et portée fonctionnelle réelle de la V1

## Limites explicites (non implémenté)
- Pas d'authentification / rôles utilisateurs
- Pas de backend / API
- Pas d'envoi email / PDF serveur (impression navigateur uniquement)


## Version courante UI
- Build: `v1.0.2`
- Updated: `2026-04-04`


## GitHub Pages
- Si Pages est configuré sur la racine: ouvrir `/` (redirection automatique vers `src/index.html`).
- Si Pages est configuré sur `/docs`: ouvrir `/docs/` (redirection vers `src/index.html`).
