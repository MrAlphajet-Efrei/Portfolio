# Implémentation « Le Circuit » — portfolio Yannick Yanat

Source : projet Claude Design « Site premium prompt », fichier `Le Circuit - Yannick Yanat.dc.html`
(+ `circuit-engine.js`). Le format .dc.html est un composant React avec templating —
converti en application Vite + React + TypeScript autonome.

## Choix techniques

- **Vite + React 19 + TypeScript** : le composant source est déjà du React (class component
  DCLogic) ; porté en function components + hooks, sans dépendance au runtime dc.
- **Moteur canvas conservé verbatim** (`src/engine/circuit-engine.js`) : code vanilla JS
  autonome ; seule modification = wrapper IIFE → export ES module. Un `.d.ts`
  fournit le typage. (Règle : réutiliser, ne pas réécrire.)
- **Contenu i18n extrait** dans `src/i18n/strings.ts` (FR/EN typés).
- **Styles inline → CSS structuré** : tokens (custom properties) + classes BEM-ish,
  valeurs reprises à l'identique du design.

## Étapes

- [x] Récupérer les fichiers du projet design (DesignSync)
- [x] Scaffold Vite/React/TS (package.json, tsconfig, vite.config, eslint, index.html)
- [x] Porter `circuit-engine.js` en module ES + `circuit-engine.d.ts`
- [x] Extraire les chaînes FR/EN dans `src/i18n/strings.ts`
- [x] CSS : tokens + base + keyframes (`global.css`), composants (`app.css`)
- [x] Composants React : BootScreen, TopBar, Hud, StoryBeats, CoreSection,
      Datasheet, MenuOverlay, InspectModal, CustomCursor
- [x] App.tsx : état (lang, loading, menu, read, open, online), effets
      (moteur, boot, clavier, curseur custom), jump-to-layer
- [x] `npm install` + `npm run build` (tsc strict + vite) sans erreur
- [x] Vérification comportementale dans Chrome

## Review

Build : `tsc --noEmit` (strict) + `vite build` OK ; `eslint .` sans erreur ;
`node --check` OK sur le moteur.

Vérifié end-to-end dans Chrome (build de prod, `npm run preview`) :
- Boot sequence (progression, étapes POST, fondu de sortie)
- Surface : canvas circuit animé, hero, HUD power/layer, aides d'interaction
- Plongée : layers 01/02/03 avec composants nommés (EFREI, ALLIANZ…), story beats
  synchronisés à la profondeur, composants majeurs U-204 · EU-CORE et U-401 · LLM-ENGINE
- Modale EU-CORE (flux animé, réalisations, stats, stack) + fermeture Escape
- Menu overlay + saut « Core — le cœur » (scroll piloté)
- Charge du cœur : maintien pointeur ET bouton auto-power → SYSTEM ONLINE — CORE 100 %,
  flash, fiches identité/specs/contact
- Bascule FR/EN (menu, contenus, labels moteur)
- Mode datasheet (lecture directe, moteur en pause dimmed)
- Curseur custom (anneau + point) actif sur pointeur fin

Note environnement de test : le renderer Chrome était throttlé (fenêtre occultée),
d'où une charge lente pendant la vérification — comportement à 60 fps normal
en usage réel (rampe auto-power ≈ 1 s).

Pas de commit effectué (non demandé). Le repo n'a pas encore de commit initial.

## Resync du 2026-07-10 (2e import)

Le design avait été mis à jour côté claude.ai depuis le premier import. Diff complet
identifié puis reporté :

- **HTML** : `pointer-events: none` déplacé du spacer vers le conteneur de plongée
  (`.dive`) ; `jump()` sort désormais du mode datasheet (setState read=false puis
  saut différé de 120 ms) au lieu d'être inopérant en mode lecture.
- **Moteur** (`circuit-engine.js`, resynchronisé verbatim) :
  - nouveau `_majorAt(px, py)` : hit-test écran des composants majeurs au moment du
    tap (le tactile n'a pas de hover), zone étendue au caption « [ inspect ] »
  - `_onDown` : détection du major via `_majorAt` en priorité, `pointer.on = true`,
    drag/hold uniquement hors major
  - `_onUp` : clic major sans contrainte de durée < 450 ms (gardée pour tap pulse)
  - seuil de charge du core 3.42 → 3.3
  - fenêtre de hover major élargie (s 0.5–2.4, la > 0.2)

Vérifié : build strict + lint OK ; dans Chrome, datasheet → menu → « Layer 02 »
sort du mode lecture et replonge (le scroll smooth était gelé par le throttling
de la fenêtre occultée pendant le test — un scrollTo instantané atteint bien la
cible, comportement normal à 60 fps).

## Resync du 2026-07-10 (3e import) — nouveau logo

Design mis à jour : la marque du topbar devient le logo `logo-yy-mini.svg`
(24 px, drop-shadow cuivre) avec le texte « AI Software Engineer » à la place
de « Y.YANAT — AI CORE ». Fichiers fournis par Yannick à la racine de src/.

- Logos déplacés vers `src/assets/` (logo-yy.svg complet + logo-yy-mini.svg)
- TopBar : img importée via Vite, classe `.topbar__logo` (styles du design)
- Favicon : l'ancien data-URI remplacé par `logo-yy-mini.svg` (résolu/hashé
  par Vite depuis index.html)
- `src/vite-env.d.ts` ajouté pour le typage des imports d'assets
- logo-yy.svg (version complète) non utilisé pour l'instant — dispo pour
  usage futur (OG image, à-propos…)
- Vérifié dans Chrome : logo + halo rendus dans le topbar, favicon hashé
  dans dist/index.html
