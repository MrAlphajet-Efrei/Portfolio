# Leçons — Portfolio « Le Circuit »

## 2026-07-10 — Resync Claude Design : vérifier tous les fichiers du projet
Le 4e import ne changeait pas le HTML mais le moteur `circuit-engine.js` avait
évolué (monogramme YY). Un « fichier principal identique » ne signifie pas
« rien à synchroniser » : diffé systématiquement le `.dc.html` ET les JS associés.

## 2026-07-10 — Tests navigateur : fenêtre occultée = rAF gelé
Chrome throttle drastiquement requestAnimationFrame quand la fenêtre de test est
recouverte : animations de scroll smooth figées, charge du core au ralenti,
probes CDP renvoyant un état périmé. Diagnostiquer avec un `scrollTo` instantané
et des captures d'écran avant de suspecter le code — ne pas « corriger » un bug
qui n'existe qu'en environnement throttlé.

## 2026-07-10 — Publication d'un repo : auditer aussi les métadonnées git
L'audit de contenu (secrets, PII) ne suffit pas : l'email d'auteur des commits
(`git log --format='%ae'`) devient public aussi. Ici l'email pro Amaris a été
réécrit en email EFREI avant le passage en public.
