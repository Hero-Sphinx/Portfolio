<script setup lang="ts">
const route = useRoute()
const { t, projects } = useContent()

const index = computed(() => projects.value.findIndex((p) => p.id === route.params.id))
if (index.value < 0) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

const project = computed(() => projects.value[index.value]!)
const next = computed(() => projects.value[(index.value + 1) % projects.value.length]!)

useHead(() => ({ title: `${project.value.name} — Abdullahi` }))
useSeoMeta({ description: () => project.value.blurb })
</script>

<template>
  <main class="study" :style="{ '--accent': project.accent }">
    <div class="container">
      <NuxtLink to="/#projects" class="back">{{ t.caseStudy.back }}</NuxtLink>

      <header>
        <h1>{{ project.name }}</h1>
        <p class="blurb">{{ project.blurb }}</p>
        <div class="actions">
          <a v-if="project.live" :href="project.live" target="_blank" rel="noopener" class="btn btn-primary">{{ t.projects.liveDemo }}</a>
          <a :href="project.repo" target="_blank" rel="noopener" class="btn">{{ t.projects.source }}</a>
        </div>
      </header>

      <section>
        <h2>{{ t.caseStudy.problem }}</h2>
        <p class="lead">{{ project.problem }}</p>
      </section>

      <section>
        <h2>{{ t.caseStudy.flow }}</h2>
        <ol class="flow">
          <li v-for="step in project.flow" :key="step">{{ step }}</li>
        </ol>
      </section>

      <section>
        <h2>{{ t.caseStudy.decisions }}</h2>
        <div class="decisions">
          <article v-for="d in project.decisions" :key="d.title">
            <h3>{{ d.title }}</h3>
            <p>{{ d.text }}</p>
          </article>
        </div>
      </section>

      <section>
        <h2>{{ t.caseStudy.results }}</h2>
        <ul class="results">
          <li v-for="r in project.results" :key="r">{{ r }}</li>
        </ul>
      </section>

      <section>
        <h2>{{ t.caseStudy.stack }}</h2>
        <div class="stack"><span v-for="s in project.stack" :key="s" class="chip">{{ s }}</span></div>
      </section>

      <NuxtLink :to="`/projects/${next.id}`" class="next">
        <span>{{ t.caseStudy.next }}</span>
        <strong>{{ next.name }}</strong>
      </NuxtLink>
    </div>
  </main>
</template>

<style scoped>
.study {
  padding: 110px 0 72px;
}

.container {
  max-width: 820px;
}

.back {
  color: var(--muted);
  font-size: 0.9rem;
}

.back:hover {
  color: var(--text);
}

header {
  margin: 24px 0 48px;
}

h1 {
  font-size: clamp(2.3rem, 7vw, 3.6rem);
  overflow-wrap: anywhere;
}

.blurb {
  font-size: 1.15rem;
  color: var(--muted);
  margin: 12px 0 24px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

section {
  margin-bottom: 48px;
}

h2 {
  font-size: 0.8rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 16px;
}

.lead {
  font-size: 1.2rem;
  line-height: 1.55;
  margin: 0;
}

.flow {
  list-style: none;
  counter-reset: step;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.flow li {
  counter-increment: step;
  flex: 1 1 130px;
  padding: 14px;
  border-radius: 14px;
  background: var(--card);
  border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent);
  font-size: 0.92rem;
  font-weight: 500;
}

.flow li::before {
  content: counter(step, decimal-leading-zero);
  display: block;
  font-family: var(--font-display);
  font-size: 0.75rem;
  color: var(--accent);
  margin-bottom: 6px;
}

.decisions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

article {
  padding: 20px;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--border);
}

article h3 {
  font-size: 1.05rem;
  margin-bottom: 8px;
}

article p {
  margin: 0;
  font-size: 0.93rem;
  color: var(--muted);
}

.results {
  margin: 0;
  padding-left: 18px;
  display: grid;
  gap: 8px;
}

.results li::marker {
  color: var(--accent);
}

.stack {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.next {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 22px 24px;
  border-radius: 16px;
  background: var(--card);
  border: 1px solid var(--border);
  transition: border-color 0.2s ease;
}

.next:hover {
  border-color: var(--accent);
}

.next span {
  font-size: 0.85rem;
  color: var(--muted);
}

.next strong {
  font-family: var(--font-display);
  font-size: 1.3rem;
}

@media (max-width: 640px) {
  .decisions {
    grid-template-columns: 1fr;
  }
}
</style>
