# Portfolio: instructions for AI agents

Static Nuxt 3 site (Vue 3, three.js). Read the house rules in `README.md` and follow them.

- **Git:** the owner commits and pushes. Never do it for them. Work in small verified steps and hand over `git add` and
  `git commit` lines, one per step. PowerShell 5.1 has no `&&`, so use separate lines.
- **Facts:** all copy lives in `data/`. Never add a number, claim, employer or date that can't be traced to the README,
  the CV or the owner. Keep `content.fr.ts` in step with `content.ts`.
- **Privacy:** no phone number or personal email on the site. Contact goes through LinkedIn.
- **`.client.vue` gotcha:** `onMounted` fires on a placeholder, so `await nextTick()` before touching template refs.
- **3D:** keep shape maths in `utils/` as pure, tested functions. Text must stay readable over the scene, so check
  `WIDE_POSES` and `NARROW_POSES` in `utils/stage.ts` against real screenshots.
- **Before handing over:** `npm run typecheck`, `npm run lint`, `npm test`, `npm run generate`, then check desktop and a
  phone-sized screen in a browser.
