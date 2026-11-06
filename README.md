# Portfolio

My personal site, built with Vue 3, Nuxt and three.js. One particle cloud sits behind the whole page and morphs as you
scroll: brain, eye, heartbeat, DNA helix, network globe, then back to the brain.

## What's inside

- **3D scene:** about 11,000 particles morphing on the GPU, with neurons that fire around your cursor or finger
- **Phosphene simulator:** shows how electrode count changes simulated prosthetic vision (a simplified illustration, not a clinical model)
- **Triage demo:** RoboDoc's routing idea in miniature, where critical vitals bypass the AI
- **Case studies:** a page per project
- **English and French**, light and dark themes, reduced-motion support, and a complete page without WebGL or JavaScript

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

## Checks

The same checks run in CI on every push:

```bash
npm run typecheck
npm run lint
npm test
npm run generate   # static site in .output/public
```

## Project layout

| Path | What lives there |
| --- | --- |
| `data/` | All site copy: `content.ts` (English) and `content.fr.ts` (French) |
| `utils/forms/` | The maths for each 3D form |
| `utils/stage.ts` | How scrolling maps to the scene |
| `components/NeuralStage.client.vue` | The three.js scene and its shaders |
| `tests/architecture/` | Security and privacy rules, enforced in CI |

## House rules

These are enforced by `tests/architecture/rules.test.ts`. Fix the code rather than adding an exception.

- No raw HTML rendering, `eval` or `new Function`
- External links use `rel="noopener"`
- No secrets, env files, phone numbers or personal email in the repo
- All copy lives in `data/`, and every claim must be true and backed up by my CV or projects
- Both languages keep the same shape, which `tests/unit/content.test.ts` checks

## Deploying

Vercel builds it with `vercel.json` (`npm run generate`, output in `.output/public`). Turn on Deployment Checks with the
"App checks" job marked Blocking, so production only moves after CI passes.
