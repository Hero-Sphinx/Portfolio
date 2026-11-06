<script setup lang="ts">
const { t, projects } = useContent()

// The first project gets the wide spotlight card; the rest sit in a grid.
const spotlight = computed(() => projects.value[0]!)
const rest = computed(() => projects.value.slice(1))
</script>

<template>
  <section id="projects" class="section">
    <div class="container">
      <SectionHeading :eyebrow="t.projects.eyebrow" :title="t.projects.title" :lead="t.projects.lead" />

      <ProjectCard v-reveal :project="spotlight" featured class="spotlight" />

      <div class="grid">
        <ProjectCard v-for="(p, i) in rest" :key="p.id" v-reveal="(i % 2) * 120" :project="p" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.spotlight {
  margin-bottom: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 760px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
