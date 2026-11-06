<script setup lang="ts">
import { projects } from '~/data/content'

// The first project gets the wide spotlight card; the rest sit in a grid.
const [spotlight, ...rest] = projects
</script>

<template>
  <section id="projects" class="section">
    <div class="container">
      <p v-reveal class="eyebrow">Selected work</p>
      <h2 v-reveal class="section-title">Projects with <span class="gradient-text">live demos</span>.</h2>
      <p v-reveal class="section-lead">
        Real products, not tutorials: tested, deployed and built to solve a real problem. Click through and try them.
      </p>

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
