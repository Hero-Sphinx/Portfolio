<script setup lang="ts">
const props = defineProps<{ project: ProjectView; featured?: boolean }>()

const { t } = useContent()
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
        <img :src="project.shot" :alt="`${t.projects.screenshot} ${project.name}`" loading="lazy" width="1440" height="900" />
      </template>
      <ProjectArt v-else-if="project.art" :kind="project.art" />
    </div>

    <div class="body">
      <div class="title-row">
        <h3>{{ project.name }}</h3>
        <span v-if="project.live" class="live"><span class="pulse" />{{ t.projects.live }}</span>
      </div>
      <p class="blurb">{{ project.blurb }}</p>
      <ul class="highlights">
        <li v-for="h in project.highlights" :key="h">{{ h }}</li>
      </ul>
      <div class="stack">
        <span v-for="s in project.stack" :key="s" class="chip">{{ s }}</span>
      </div>
      <div class="actions">
        <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn btn-primary">{{ t.projects.liveDemo }}</a>
        <NuxtLink :to="`/projects/${project.id}`" class="btn">{{ t.projects.caseStudy }}</NuxtLink>
        <a :href="project.repo" target="_blank" rel="noopener" class="btn">{{ t.projects.source }}</a>
      </div>
    </div>
  </TiltCard>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
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
  border-radius: var(--radius) var(--radius) 0 0;
  transform: translateZ(26px); /* floats above the card when it tilts */
}

.featured .preview {
  aspect-ratio: auto;
  min-height: 100%;
  border-radius: var(--radius) 0 0 var(--radius);
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

.body {
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 24px;
  flex: 1;
  transform: translateZ(14px);
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
    min-height: 0;
    border-radius: var(--radius) var(--radius) 0 0;
  }

  .featured .body {
    padding: 24px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pulse {
    animation: none;
  }
}
</style>
