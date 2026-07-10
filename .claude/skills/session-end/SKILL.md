---
name: session-end
description: Clôture la session de travail. Génère un bilan de ce qui a été fait et enregistre les objectifs de la prochaine session dans .claude/session-log.md.
disable-model-invocation: true
allowed-tools: Read Write Edit Glob
---

La session se termine. Effectue ces étapes dans l'ordre :

## 1. Bilan de la session

Génère un résumé structuré :

- **Accompli** : tâches terminées et validées
- **Partiel** : travail en cours, fichiers modifiés non finalisés
- **Décisions** : choix techniques, conventions adoptées, raisons
- **Problèmes** : bugs, blocages, workarounds appliqués
- **Reporté** : tâches prévues non faites

## 2. Objectifs de la prochaine session

Liste priorisée des prochaines étapes :
- [ ] Tâche 1 (priorité haute)
- [ ] Tâche 2
- [ ] Tâche 3

## 3. Enregistrement

Crée ou mets à jour `.claude/session-log.md`.
Si le fichier existe déjà, ajoute la nouvelle entrée **en haut** (la plus récente en premier).

Format de l'entrée :

```markdown
## Session du {{date du jour}}

### Accompli
- ...

### Partiel
- ...

### Décisions
- ...

### Reporté
- ...

### Prochaine session
- [ ] ...
- [ ] ...

---
```

## 4. Confirmation

Affiche : "Session enregistrée dans `.claude/session-log.md`. À bientôt !"
