@AGENTS.md

# CLAUDE.md

> Rules that correct real, recurring failure modes. Keep only what measurably
> reduces mistakes on this repo. Delete anything Claude already does by default.

## Diagnose Before Acting

**Never rush a fix. Observe, confirm, then act.**

1. **Observe** — Read ALL error messages. Understand every failing component before touching code.
2. **Confirm assumptions** — Run isolated minimal tests, OR search the web (GitHub issues, docs) first.
3. **Map full scope** — Find ALL related issues, not just the first visible one.
4. **Know "working"** — Check main branch, old code, or docs to define the correct behavior.
5. **Verify the API exists** — Read the installed third-party source to confirm methods/signatures. Never call an API from memory or docs alone.
6. **Then act** — Propose one coherent fix that covers the full scope.

**If a fix introduces a new error: STOP.** Do not patch on top. Return to step 1 and re-observe.

**Search before blind testing.** When multiple hypotheses exist (especially for third-party libs), search the web first to save tokens and time. Test in isolation only when search gives no clear answer.

## Plan Before Building

- Enter plan mode for any non-trivial task (3+ steps or an architectural decision).
- Write detailed specs upfront. Ambiguity produces messy output.
- If something goes sideways mid-build, re-plan immediately instead of pushing forward.

## Subagent Strategy

- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- One task per subagent for focused execution.
- For complex problems, add compute by spinning up more subagents.

## Verify Before Done

- Never mark a task complete without proving it works.
- Run tests, check logs, demonstrate correctness.
- Diff behavior between main and your changes when relevant.
- Challenge your own work before presenting it.

## Autonomous Bug Fixing

- Given a bug report, fix it. No hand-holding.
- Point at logs, errors, and failing tests, then resolve them.
- Fix failing CI without being told how.

## Task Management

1. **Plan first** — Write the plan to `tasks/todo.md` with checkable items.
2. **Verify plan** — Check in before implementing.
3. **Track progress** — Mark items complete as you go.
4. **Summarize** — Give a high-level summary at each step.
5. **Document** — Add a review section to `tasks/todo.md` when done.
6. **Capture lessons** — After any correction, record the pattern in `tasks/lessons.md`, then review it at session start.

## Core Principles

- **Simplicity first** — Make every change as simple as possible. Touch minimal code.
- **Root causes only** — No temporary patches. Find and fix the real cause.
- **Minimal impact** — Only touch what is necessary. No side effects, no new bugs.
