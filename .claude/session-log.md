# Journal de sessions — Portfolio « Le Circuit »

## Session du 2026-07-10 (3)

### Accompli
- **7e resync du design** (commit `ddb6705`) : moteur strictement identique (diff
  normalisé) ; changements = chaînes i18n seules — entrée Allianz retirée de la
  timeline, intitulés réels (UHDP Développeur web, SocGen Ingénieur logiciel,
  BNP AM Ingénieur DevOps), « early experience », « 3 ans + / 3+ years »
- **Audit mobile complet** (émulation iframe same-origin 390×844 — la fenêtre
  Chrome refuse toujours le resize, même via l'outil dédié) : breakpoint 720px
  fonctionnel, parcours guidé et auto-power OK, datasheet/fiches/menu propres ;
  2 défauts réels trouvés dans la modale, tracés jusqu'au design canonique
- **4 fixes mobile** (commit `913ac81`), appliqués au design canonique (3 pushes
  DesignSync du `.dc.html`) ET à `src/styles/app.css` (aucun TSX) :
  1. tag de modale protégé du bouton fermer (`padding-right: 130px`)
  2. flux en conteneur `overflow-x: auto` propre + `flex-shrink: 0` ;
     modale en scroll vertical seul
  3. dégradé de fond du topbar (lisibilité au scroll)
  4. menu en items de largeur uniforme `min(540px, 88vw)`, alignés à gauche
- Vérifications desktop + mobile sur build de prod à chaque étape ; tout poussé
  (= déployé Vercel)

### Partiel
- Rien en cours — working tree propre hors journal

### Décisions
- **Les fixes de design se font dans le canon** (DesignSync write_files) et en
  local simultanément → divergence zéro, le prochain resync diffe contre la
  référence `circuit.dc.v8.html` (scratchpad session 2ef205eb)
- Émulation mobile via **iframe same-origin 390×844** injectée dans la page :
  vrai viewport pour matchMedia/moteur ; limite : `pointer: coarse` non émulable
- Menu : largeur 540px (le 480px du plan était trop juste) + `text-align: left`

### Problèmes
- **Piège flexbox** : un flex item qui devient scroll-container perd son
  `min-height: auto` → `.flow` écrasé à 0 dans la colonne flex de la modale ;
  corrigé par `flex-shrink: 0` (consigné dans tasks/lessons.md)
- `resize_window` répond « success » mais la fenêtre reste 1920×911 (ancrage OS)
  — toujours vérifier `window.innerWidth` après resize

### Reporté
- Test tactile réel sur téléphone (tap pulse, charge au doigt, hold-surge —
  `pointer: coarse` non émulable) ; le site est en prod, testable via l'URL Vercel
- Vérification de l'URL Vercel de prod et du domaine `yannickyanat.com`
- Contrôle visuel du pane Claude Design après les 3 pushes (à faire par Yannick)
- Nouveau design « Le Réseau - Yannick Yanat » apparu dans le projet distant
  (+ network-engine.js) — hors périmètre, à traiter si demandé
- `CLAUDE.md` référence toujours `@AGENTS.md` inexistant
- `logo-yy.svg` (version complète) toujours inutilisé

### Prochaine session
- [ ] Test mobile réel via l'URL de prod (priorité haute — dernier maillon non vérifié)
- [ ] Vérifier l'URL Vercel + domaine `yannickyanat.com`
- [ ] Confirmer le rendu du design v8 dans le pane claude.ai (fixes survivants)
- [ ] Décider du sort de « Le Réseau » (nouveau design dans le projet distant)
- [ ] Créer `AGENTS.md` ou retirer la référence dans `CLAUDE.md`
- [ ] Resync éventuel : diffé HTML **et** moteur contre `circuit.dc.v8.html`
      (refaire un fetch de référence si le scratchpad a été purgé)

---

## Session du 2026-07-10 (2)

### Accompli
- **6e resync du design** (commit `1e73bc2`) : second bouton accentué « ▤ datasheet —
  lecture directe » sous le hero, toggle datasheet/circuit du topbar en bouton encadré,
  breakpoint mobile 720px (matchMedia + listener : marque, contact et aides masqués),
  `coreInstruction` → « system online » quand le cœur est alimenté. Moteur inchangé (vérifié).
- **Correctif local du beat b4 retiré** au profit de la version canonique du design
  (qui intègre désormais la demande de Yannick de la veille via `coreInstruction`)
- **Déploiement documenté** : automatique via **Vercel** à chaque push sur `main`
  (info Yannick) — README, session-log et mémoire persistante mis à jour (`c8c2764`)
- `session-log.md` et `tasks/lessons.md` désormais versionnés (partis avec `1e73bc2`)

### Partiel
- Rien en cours — working tree propre, tout est poussé (et donc déployé via Vercel)

### Décisions
- Quand le design absorbe un correctif local (ici le b4), on **revient à la version
  canonique du design** plutôt que de garder deux mécanismes parallèles
- Tout push sur `main` = mise en production → toujours builder localement avant de pousser

### Problèmes
- Rendu mobile (< 720px) non vérifiable à l'exécution : la fenêtre Chrome pilotée refuse
  le redimensionnement horizontal (ancrage OS, 2 tentatives). Logique validée par revue +
  typage ; à confirmer lors du test tactile réel.

### Reporté
- Test du parcours tactile/mobile réel (dont le rendu < 720px)
- Vérification du domaine `yannickyanat.com` côté Vercel
- `CLAUDE.md` référence toujours `@AGENTS.md` inexistant
- `logo-yy.svg` (version complète) toujours inutilisé

### Prochaine session
- [ ] Récupérer l'URL Vercel et vérifier le site déployé en production (priorité haute)
- [ ] Confirmer le branchement du domaine `yannickyanat.com`
- [ ] Tester le parcours mobile/tactile réel (breakpoint 720px, tap pulse, charge au doigt)
- [ ] Créer `AGENTS.md` ou retirer la référence dans `CLAUDE.md`
- [ ] Resync design éventuel (diffé HTML **et** moteur ; référence scratchpad : `circuit.dc.v6.html`)

---

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
- [x] Déploiement : réglé — **automatique via Vercel** à chaque push sur `main` (info Yannick, 2026-07-10)
- [ ] Vérifier le branchement du domaine `yannickyanat.com` sur le projet Vercel
- [ ] Créer `AGENTS.md` ou retirer la référence dans `CLAUDE.md`
- [ ] Tester le parcours mobile/tactile réel (instructions touch, tap pulse, charge au doigt)
- [ ] Éventuel resync design si le projet Claude Design évolue encore
      (vérifier HTML **et** moteur ; diff contre `circuit.dc.v5.html` du scratchpad — refaire un fetch de référence si absent)

---
