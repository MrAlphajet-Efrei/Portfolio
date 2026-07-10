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

## Resync du 2026-07-10 (4e import) — monogramme YY sur le core

HTML inchangé, mais le moteur a évolué (leçon : toujours vérifier les deux
fichiers, un changement moteur peut arriver sans changement HTML) :

- Nouvelle méthode `_drawLogo` : monogramme YY dessiné dans le vocabulaire
  du circuit (Y arrière écho cuivre, Y avant sérigraphié + halo qui chauffe
  avec la charge, vias aux extrémités, pad carré au pied)
- La gravure du chipset remplace le texte « Y.YANAT » (coreName) par le
  monogramme ; le sous-titre AI-CORE descend à ch.side * 0.235
- Resynchronisé verbatim, vérifié dans Chrome au niveau du core

## Resync du 2026-07-10 (5e import) — guidage & accessibilité

Grosse évolution du design (+10 Ko HTML, 253 lignes de diff) axée guidage
du visiteur :

- **Plongée raccourcie** : spacer 800vh → 320vh
- **Navigation guidée** : boutons « ▼ » encadrés (hero → layer 01, core →
  fiche technique) et liens « layer suivant » dans chaque carte (b1→b2→b3→core)
- **Nouveau beat b4** « core approach » (annonce à d 3.36–3.52)
- **Écran core = overlay fixe** (b5) : fondu piloté par la profondeur
  (entrée d>3.56, sortie sur overscroll vers la datasheet) ; la section
  #lc-core en flux ne contient plus que les fiches identité/specs/contact
- **Auto-power sur inactivité** : 2,2 s immobile au cœur (charge <3 %)
  → powerCoreAnim automatique
- **Boot cliquable** (skip) + hint « cliquer pour passer »
- **Topbar** : boutons datasheet/circuit (toggle read) et contact
  (powerCore + jump core, ou bas de page en mode lecture)
- **user-select none** global, réactivé sur datasheet/fiches/modales
  (.selectable) ; scrollbar cuivre ; instruction fine/touch ; compteurs
  « 0X/04 » dans le HUD ; hero signé « — Nom · Titre — »
- **Moteur** : anneau-balise pulsant autour des composants majeurs
  (signale le cliquable) — seul hunk moteur

Vérifié dans Chrome : skip boot au clic, hero + bouton plonger, liens next
dans les cartes, beacon sur EU-CORE, écran core en fondu, **auto-power déclenché
sans action → SYSTEM ONLINE**, bouton fiche technique. Build strict + lint OK.

## Resync du 2026-07-10 (7e import) — contenu timeline & intitulés

Moteur strictement identique (diff normalisé wrapper/indentation : aucun écart).
Diff HTML limité aux chaînes i18n (`src/i18n/strings.ts`) :

- **Timeline early** : entrée Allianz 2018 supprimée ; les « Stage »/« Internship »
  deviennent des intitulés réels — UHDP « Développeur web / Web Developer »,
  Société Générale « Ingénieur logiciel / Software Engineer »,
  BNP Paribas AM « Ingénieur DevOps / DevOps Engineer »
- **b1.tag** : « early training » → « early experience » (FR+EN) ;
  b1.body : « les stages posent » → « les premières expériences posent » (idem EN)
- **id.sub** : « 3 ans d'expérience » → « 3 ans + d'expérience » / « 3+ years »
- Le label moteur `ALLIANZ` (layer 01) reste : inchangé dans le design distant
- Note : le `.dc.html` distant référence désormais `support.js` = runtime dc généré
  (harnais claude.ai), rien à porter ; nouveau design « Le Réseau » apparu dans le
  projet distant, hors périmètre de ce resync

Vérifié dans Chrome (build de prod, FR et EN) : datasheet affiche la nouvelle
timeline et les nouveaux sous-titres. Build strict + lint OK.

## Resync du 2026-07-10 (6e import) — accès datasheet & responsive mobile

HTML seul (moteur inchangé, vérifié) :

- **Hero** : deuxième bouton « ▤ datasheet — lecture directe » (accentué) à côté
  de « ▼ scrollez pour plonger » ; rangée flex-wrap, max-width 94vw
- **Topbar** : le toggle datasheet/circuit devient un bouton encadré accentué ;
  breakpoint mobile 720px (matchMedia + listener) → texte de marque, bouton
  contact et aides bas-droite masqués sur mobile
- **coreInstruction** : devient t.core.online quand le système est online — le
  design intègre officiellement la correction du beat d'annonce ; notre
  customisation locale du b4 a été retirée au profit de la version canonique

Vérifié dans Chrome (desktop) : double bouton hero, topbar accentué.
Non vérifié à l'exécution : le rendu mobile (< 720px) — la fenêtre Chrome
pilotée refuse le redimensionnement horizontal (ancrage OS) ; logique validée
par revue + typage (rendu conditionnel simple sur matchMedia). À contrôler
lors du test tactile réel prévu.
