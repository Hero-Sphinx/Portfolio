<script setup lang="ts">
import type { Project } from '~/data/content'

const props = defineProps<{ project: Project; featured?: boolean }>()

// Projects without a live screenshot get generated art from their initials and accent colour.
const initials = computed(() =>
  props.project.name
    .split(/[\s-]+/)
    .filter((w) => /^[A-Za-z0-9]/.test(w))
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase(),
)
const host = computed(() => (props.project.live ? new URL(props.project.live).host : ''))
</script>

<template>
  <TiltCard class="card" :class="{ featured }" :style="{ '--accent': project.accent }" :max="featured ? 6 : 9">
    <div class="preview">
      <template v-if="project.shot">
        <div class="browser">
          <span class="dots" aria-hidden="true"><i /><i /><i /></span>
          <span class="url">{{ host }}</span>
        </div>
        <img :src="project.shot" :alt="`Screenshot of ${project.name}`" loading="lazy" width="1440" height="900" />
      </template>
      <div v-else class="art" aria-hidden="true">
        <span class="initials">{{ initials }}</span>
        <span class="orbit" />
      </div>
    </div>

    <div class="body">
      <div class="title-row">
        <h3>{{ project.name }}</h3>
        <span v-if="project.live" class="live"><span class="pulse" />Live</span>
      </div>
      <p class="blurb">{{ project.blurb }}</p>
      <ul class="highlights">
        <li v-for="h in project.highlights" :key="h">{{ h }}</li>
      </ul>
      <div class="stack">
        <span v-for="s in project.stack" :key="s" class="chip">{{ s }}</span>
      </div>
      <div class="actions">
        <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn btn-primary">Live demo ↗</a>
        <a :href="project.repo" target="_blank" rel="noopener" class="btn">Source code</a>
      </div>
    </div>
  </TiltCard>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.card:hover {
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
}

.featured {
  display: grid;
  grid-template-columns: 1.25fr 1fr;
}

.preview {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--bg-2);
  overflow: hidden;
}

.featured .preview {
  aspect-ratio: auto;
  min-height: 100%;
}

.browser {
  position: absolute;
  inset: 0 0 auto;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 30px;
  padding: 0 12px;
  background: color-mix(in srgb, var(--bg) 88%, transparent);
  border-bottom: 1px solid var(--border);
}

.dots {
  display: flex;
  gap: 6px;
}

.dots i {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: var(--border);
}

.dots i:first-child {
  background: #f87171;
}

.dots i:nth-child(2) {
  background: var(--gold);
}

.dots i:last-child {
  background: var(--emerald);
}

.url {
  font-size: 0.75rem;
  color: var(--muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.preview img {
  position: absolute;
  inset: 30px 0 0;
  width: 100%;
  height: calc(100% - 30px);
  object-fit: cover;
  object-position: top;
  transition: transform 0.6s ease;
}

.card:hover .preview img {
  transform: scale(1.04);
}

.art {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 45%, transparent), transparent 60%),
    radial-gradient(circle at 80% 90%, color-mix(in srgb, var(--accent) 25%, transparent), transparent 55%),
    var(--bg-2);
}

.initials {
  font-family: var(--font-display);
  font-size: 4.5rem;
  font-weight: 700;
  color: var(--accent);
  transform: translateZ(40px);
}

.orbit {
  position: absolute;
  width: 62%;
  aspect-ratio: 1;
  border: 1px dashed color-mix(in srgb, var(--accent) 50%, transparent);
  border-radius: 50%;
  animation: spin 24s linear infinite;
}

.orbit::after {
  content: '';
  position: absolute;
  top: -5px;
  left: 50%;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 16px var(--accent);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  flex: 1;
}

.featured .body {
  padding: 32px;
}

.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

h3 {
  font-size: 1.35rem;
}

.featured h3 {
  font-size: 1.7rem;
}

.live {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--emerald);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.pulse {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--emerald);
  box-shadow: 0 0 0 0 var(--emerald);
  animation: ping 2s infinite;
}

@keyframes ping {
  70% {
    box-shadow: 0 0 0 8px transparent;
  }
  100% {
    box-shadow: 0 0 0 0 transparent;
  }
}

.blurb {
  margin: 0;
  color: var(--text);
  font-weight: 500;
}

.highlights {
  margin: 0;
  padding-left: 18px;
  color: var(--muted);
  font-size: 0.92rem;
  display: grid;
  gap: 6px;
}

.highlights li::marker {
  color: var(--accent);
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: auto;
  padding-top: 6px;
}

.actions .btn {
  padding: 10px 18px;
  font-size: 0.88rem;
}

@media (max-width: 860px) {
  .featured {
    display: flex;
  }

  .featured .preview {
    aspect-ratio: 16 / 10;
  }

  .featured .body {
    padding: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .orbit,
  .pulse {
    animation: none;
  }
}
</style>
