# design-sync notes — fire-platform

This repo is a **Next.js app used as the design system** (no separate library `dist/`),
so the converter runs in **synth-entry mode** from `src/components`.

## Required setup before every sync (converter v2.1.195+)

1. **Regenerate the compiled Tailwind CSS** (it is NOT committed and is the configured `cssEntry`):
   ```sh
   npx tailwindcss -i src/app/globals.css -o ds-tailwind-compiled.css --minify
   ```

2. **Create a fake package dir at `node_modules/fire-platform/`** so the converter's
   `PKG_DIR` resolution works. v2.1.195 sets `PKG_DIR = node_modules/<pkg>` when no
   `--entry` is given, then resolves `cfg.*` paths (and a render of `src/`) relative to it.
   The repo's own package never self-installs, so build it by hand:
   ```sh
   mkdir -p node_modules/fire-platform
   cp package.json node_modules/fire-platform/package.json
   ln -sfn "$(pwd)/src" node_modules/fire-platform/src                       # symlink OK for srcDir
   cp ds-tailwind-compiled.css node_modules/fire-platform/ds-tailwind-compiled.css  # MUST be a copy
   ```
   - `cssEntry` must be a **real copy inside** the fake pkg dir — a symlink is rejected by an
     "resolves outside the package — skipped" guard (then `[CSS_RUNTIME]` fires and every
     preview renders unstyled).
   - `src` may be a symlink (the outside-package guard does not apply to `srcDir`).
   - Do NOT symlink the whole repo to `node_modules/fire-platform` — the recursive
     `node_modules/fire-platform/node_modules/...` loop makes ts-morph crash `ENAMETOOLONG`.
   - This dir is gitignored (`node_modules`); recreate it each sync. Remove it after if it
     confuses other tooling.

3. Playwright/Chromium for the render check: `cd .ds-sync && npm i playwright && npx playwright install chromium`
   (the browser download needs network — run it unsandboxed).

## Re-sync risks / watch-list

- **Converter discovery breadth changed between versions.** The June-2025 sync curated to
  ~42 components; v2.1.195 discovers ~62 from the same `src` — it now picks up many existing
  app feature/dialog components (NotificationsSection, ImageUpload, InterestsDialog,
  ClubFormDialog, CompetitionFormDialog, UserEditDialog, ClubMembersDialog, TeammatesPanel,
  ParticipationSection, NotificationsBell, DownloadResumeButton, BrandLoader, RouteLoader,
  LandingExperience). Revisit `componentSrcMap` exclusions on every version bump.
- **Infra exports that are NOT design-system components** (exclude via `componentSrcMap: null`):
  `Component` (lab.tsx default — raw WebGL canvas), `SuccessParticles` (button particle effect),
  `HideOnAuthRoutes` (auth-route chrome gate). `RouteLoader` is a loading overlay (borderline).
- `ds-tailwind-compiled.css` is regenerated, not committed — its content (and thus `styleSha`)
  changes if `globals.css`/`tailwind.config.ts` change; expect a styling re-verify then.
- Genuinely new DS components this session: `ParticleButton`, `ShaderBackground`, plus the
  `Button` particle burst (Button render changed).
