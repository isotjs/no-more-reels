# Git Commit Notes

This document replaces the old one-time commit preparation summary with reusable commit guidance for this project.

## Current Repository Snapshot

- Default branch: `master`
- Latest tag in repository history: `v3.1.0`
- Project type: Firefox-first WebExtension

## Suggested Commit Style

Use short, imperative commit messages with a scope when useful:

- `feat: add selector for new Instagram nav variant`
- `fix: preserve debug state during popup toggle updates`
- `docs: update manifest documentation for version change`
- `chore: align locale message keys across languages`

## Before Committing

1. Verify extension still loads in `about:debugging`.
2. Test popup controls against at least one Instagram tab.
3. Check that docs are updated when behavior/permissions change.
4. Ensure `Docs/CHANGELOG.md` is updated for user-visible changes.

## Commit Content Checklist

- Keep unrelated refactors out of feature/fix commits.
- Avoid committing temporary debugging edits.
- Do not commit secrets, tokens, or private keys.
- Keep manifest version and changelog aligned when releasing.

## Release-Oriented Commits

For release preparation, prefer a single focused commit including:

- `manifest.json` version bump
- `Docs/CHANGELOG.md` entry
- README/docs updates if behavior changed

Then create/tag release using repository conventions.
