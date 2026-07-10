# Le Circuit — Portfolio de Yannick Yanat

Portfolio interactif : une plongée continue dans un monde-circuit en canvas 2D.
Chaque strate du circuit est une époque du parcours, chaque composant une expérience,
et au cœur, le processeur à mettre sous tension.

Design conçu sur [Claude Design](https://claude.ai/design) (projet « Site premium prompt »,
fichier `Le Circuit - Yannick Yanat.dc.html`), implémenté en application autonome.

## Stack

- [Vite](https://vite.dev) + [React 19](https://react.dev) + TypeScript (strict)
- Moteur d'animation canvas 2D vanilla (`src/engine/circuit-engine.js`), sans dépendance
- i18n FR/EN typé (`src/i18n/strings.ts`)

## Déploiement

Automatique via **Vercel** : chaque push sur `main` déclenche un build et une mise en production.

## Scripts

| Commande          | Effet                                        |
| ----------------- | -------------------------------------------- |
| `npm run dev`     | Serveur de développement                     |
| `npm run build`   | Typecheck strict + build de production       |
| `npm run preview` | Sert le build de production en local         |
| `npm run lint`    | ESLint (typescript-eslint + react-hooks)     |

## Structure

```
src/
  main.tsx               Point d'entrée
  App.tsx                Orchestration : état, moteur, boot, clavier, curseur
  engine/
    circuit-engine.js    Moteur canvas (porté verbatim du design, export ES module)
    circuit-engine.d.ts  Typage du moteur
  i18n/
    strings.ts           Contenus FR/EN + liens de contact
  components/            BootScreen, TopBar, Hud, StoryBeats, CoreSection,
                         Datasheet, MenuOverlay, InspectModal, CustomCursor
  styles/
    global.css           Tokens, base, keyframes
    app.css              Classes composants (valeurs du design)
```

## Interactions

- **Scroll** : plongée à travers les strates du circuit
- **Tirer une piste** : déformation physique des traces (pointeur fin)
- **Maintenir** : onde de surge
- **Clic sur EU-CORE / LLM-ENGINE** : fiche d'expérience détaillée
- **Au cœur** : maintenir (ou auto-power) pour mettre le système en ligne
- **Menu** : saut direct vers une strate, ou mode datasheet (lecture directe, accessible)
- FR/EN, `prefers-reduced-motion` et pointeurs tactiles pris en charge
