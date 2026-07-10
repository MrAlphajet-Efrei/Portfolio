# Journal de sessions — Portfolio « Le Circuit »

## Session du 2026-07-10

### Accompli
- **Implémentation complète du portfolio « Le Circuit »** depuis le projet Claude Design
  « Site premium prompt » (`6be847fb-d38c-45ac-890e-1afc61a8e186`) : Vite + React 19 +
  TypeScript strict, moteur canvas 2D porté verbatim en module ES, i18n FR/EN typé,
  styles du design convertis en CSS structuré (tokens + BEM-ish)
- **5 resyncs successifs du design**, chacun vérifié dans Chrome puis commité :
  1. Import initial + implémentation (commit `b59f4a0`)
  2. `pointer-events` sur `.dive` + `jump()` qui sort du mode datasheet
  3. Logo YY : topbar + favicon (`813f701`) — fichiers fournis dans `src/`, rangés dans `src/assets/`
  4. Monogramme YY dessiné en canvas sur le core (`e5093b7`)
  5. Navigation guidée : boutons ▼, beat « core approach », écran core en overlay fixe,
     auto-power après 2,2 s d'inactivité, boot cliquable, scrollbar cuivre, topbar
     datasheet/contact (`7ba239a`)
- **Correction UX à la demande de Yannick** : le beat d'annonce n'affiche plus
  « alimenter le cœur » quand le système est déjà online → « system online — core 100% » (`ea27405`)
- **Repo GitHub créé et publié** : https://github.com/MrAlphajet-Efrei/Portfolio, branche
  `main`, passé en **public** après audit (aucun secret ; email pro Amaris réécrit en
  email EFREI dans les métadonnées du commit avant publication)
- **Node pinné** : `engines >=24` + `.nvmrc` (`3f16126`)

### Partiel
- Rien en cours — working tree propre à l'exception de ce journal

### Décisions
- **Moteur canvas conservé verbatim** (pas de réécriture TS) : seul le wrapper IIFE →
  export ES module ; typage via `circuit-engine.d.ts` (règle : réutiliser, ne pas réécrire)
- Mises à jour 60 fps (HUD, beats, écran core) via **refs DOM impératives** hors du
  cycle React ; miroir d'état `stateRef` pour les callbacks du moteur
- Email de commit **local au repo** : `yannick.yanat@efrei.net`
- `.claude/settings.local.json` gitignoré ; skills et `tasks/` versionnés
- Repo **public** ; visibilité modifiable via `gh repo edit`

### Problèmes
- **Chrome throttle le renderer quand la fenêtre est occultée** pendant les tests
  automatisés : rAF quasi gelé → charge du core très lente, scroll smooth figé,
  probes CDP parfois périmés. Ce n'est PAS un bug du site (comportement normal à
  60 fps). Vérifier avec `scrollTo` instantané + captures, et s'armer de patience.
- **Un resync design peut ne toucher QUE le moteur** (`circuit-engine.js`) sans changer
  le HTML : toujours vérifier les DEUX fichiers (leçon du 4e import)

### Reporté
- Déploiement du site (GitHub Pages / Vercel / Netlify) — proposé, non demandé
- Usage de `logo-yy.svg` (version complète) : disponible dans `src/assets/`, pas encore utilisé
- `CLAUDE.md` référence toujours `@AGENTS.md` qui n'existe pas

### Prochaine session
- [ ] Décider du déploiement (GitHub Pages via Actions ? Vercel ?) et brancher le domaine `yannickyanat.com`
- [ ] Créer `AGENTS.md` ou retirer la référence dans `CLAUDE.md`
- [ ] Tester le parcours mobile/tactile réel (instructions touch, tap pulse, charge au doigt)
- [ ] Éventuel resync design si le projet Claude Design évolue encore
      (vérifier HTML **et** moteur ; diff contre `circuit.dc.v5.html` du scratchpad — refaire un fetch de référence si absent)

---
