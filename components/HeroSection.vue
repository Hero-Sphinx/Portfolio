<script setup lang="ts">
import { hero, links, projects } from '~/data/content'

// Rotating role line: a ref, an interval and a computed — the Vue equivalent of useState + useEffect + useMemo.
const index = ref(0)
const role = computed(() => hero.roles[index.value])
let timer: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => (index.value = (index.value + 1) % hero.roles.length), 2600)
})
onBeforeUnmount(() => clearInterval(timer))

const liveCount = projects.filter((p) => p.live).length
</script>

<template>
  <section id="top" class="hero">
    <div class="glow glow-a" aria-hidden="true" />
    <div class="glow glow-b" aria-hidden="true" />

    <div class="container grid">
      <div class="copy">
        <p class="eyebrow">🩺 ⚕️ 💻 🧠 &nbsp;Hey, I'm</p>
        <h1 class="name">{{ hero.name }}</h1>
        <p class="role" aria-live="polite">
          <Transition name="swap" mode="out-in">
            <span :key="role" class="gradient-text">{{ role }}</span>
          </Transition>
        </p>
        <p class="tagline">{{ hero.tagline }}</p>

        <div class="actions">
          <a href="#projects" class="btn btn-primary">See my work →</a>
          <a :href="links.linkedin" target="_blank" rel="noopener" class="btn">LinkedIn</a>
          <a :href="links.github" target="_blank" rel="noopener" class="btn">GitHub</a>
        </div>

        <ul class="stats">
          <li><strong>{{ projects.length }}</strong><span>featured projects</span></li>
          <li><strong>{{ liveCount }}</strong><span>live demos</span></li>
          <li><strong>280+</strong><span>tests on one app</span></li>
        </ul>
      </div>

    </div>

    <a href="#about" class="scroll-hint" aria-label="Scroll to About"><span /></a>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: 110px 0 80px;
  overflow: hidden;
}

.glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  opacity: 0.35;
  pointer-events: none;
}

.glow-a {
  width: 520px;
  height: 520px;
  background: var(--emerald-deep);
  top: -160px;
  right: -120px;
}

.glow-b {
  width: 380px;
  height: 380px;
  background: var(--gold);
  bottom: -200px;
  left: -140px;
  opacity: 0.14;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 1fr;
  align-items: center;
  gap: 24px;
}

.copy {
  position: relative;
  z-index: 2;
}

.name {
  font-size: clamp(3.2rem, 9vw, 6.2rem);
  font-weight: 700;
}

.role {
  font-family: var(--font-display);
  font-size: clamp(1.3rem, 3vw, 1.9rem);
  font-weight: 600;
  min-height: 1.4em;
  margin: 10px 0 20px;
}

.tagline {
  color: var(--muted);
  font-size: 1.08rem;
  max-width: 520px;
  margin: 0 0 32px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.stats {
  list-style: none;
  padding: 0;
  margin: 44px 0 0;
  display: flex;
  gap: 36px;
}

.stats li {
  display: flex;
  flex-direction: column;
}

.stats strong {
  font-family: var(--font-display);
  font-size: 1.8rem;
  color: var(--gold);
}

.stats span {
  font-size: 0.85rem;
  color: var(--muted);
}

.swap-enter-active,
.swap-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}

.swap-enter-from {
  opacity: 0;
  transform: translateY(12px);
}

.swap-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}

.scroll-hint {
  position: absolute;
  bottom: 26px;
  left: 50%;
  translate: -50% 0;
  width: 26px;
  height: 42px;
  border: 2px solid var(--border);
  border-radius: 14px;
}

.scroll-hint span {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  border-radius: 2px;
  background: var(--emerald);
  animation: drop 1.8s ease-in-out infinite;
}

@keyframes drop {
  0% { transform: translateY(0); opacity: 1; }
  80% { transform: translateY(14px); opacity: 0; }
  100% { opacity: 0; }
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .stats {
    gap: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .scroll-hint span {
    animation: none;
  }
}
</style>
