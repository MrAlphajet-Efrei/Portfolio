---
name: session-start
description: Recharge le contexte du projet en début de session. Lis la mémoire, résume l'état du projet, la dernière session et les objectifs du jour.
disable-model-invocation: true
allowed-tools: Read Glob Grep
---

Tu démarres une nouvelle session de travail. Effectue ces étapes dans l'ordre :

## 1. Lecture de la mémoire

Cherche et lis ces fichiers s'ils existent :
- `CLAUDE.md`
- `.claude/session-log.md`
- `.claude/todo.md`

## 2. Résumé structuré

Présente un résumé court sous cette forme exacte :

### Projet
- Nom, objectif principal, stack technique
- État d'avancement global

### Dernière session
- Ce qui a été accompli
- Décisions prises ou problèmes rencontrés
- Là où on s'est arrêté

### Objectifs du jour
- Tâches prévues (issues en attente, next steps depuis le log)

### Points d'attention
- Blocages connus, dettes techniques, questions ouvertes

## 3. Confirmation

Termine avec : "Prêt à continuer. Souhaites-tu ajuster les objectifs ?"
