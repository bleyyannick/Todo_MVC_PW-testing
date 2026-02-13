# TodoMVC Playwright Tests

Petit projet de formation pour pratiquer les bonnes pratiques de test avec Playwright sur l'app TodoMVC.

## Objectif

- Ecrire des tests lisibles et maintenables
- Appliquer le pattern Page Object
- Verifier le comportement utilisateur (ajout, edition, suppression, filtres)

## Prerequis

- Node.js 18+
- npm

## Installation

```bash
npm install
npx playwright install
```

## Lancer les tests

```bash
npx playwright test
```

## Ouvrir le rapport HTML

```bash
npx playwright show-report
```

## Structure du projet

- tests/: suites de tests
- tests/PageObjects/: page objects
- tests/fixtures/: fixtures Playwright
- playwright.config.ts: configuration Playwright

## Notes

Les tests utilisent la base URL `https://demo.playwright.dev` configuree dans Playwright.
