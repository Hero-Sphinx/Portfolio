<script setup lang="ts">
import { skills } from '~/data/content'

const groups = Object.entries(skills)
</script>

<template>
  <section id="skills" class="section">
    <div class="container">
      <p v-reveal class="eyebrow">Toolbox</p>
      <h2 v-reveal class="section-title">What I <span class="gradient-text">build with</span>.</h2>
      <p v-reveal class="section-lead">
        This site itself is built with Vue 3, Nuxt and three.js. The rest is what my projects run on.
      </p>

      <div class="groups">
        <TiltCard v-for="([name, items], i) in groups" :key="name" v-reveal="(i % 3) * 90" class="group" :max="6">
          <h3>{{ name }}</h3>
          <div class="chips">
            <span v-for="s in items" :key="s" class="chip">{{ s }}</span>
          </div>
        </TiltCard>
      </div>
    </div>
  </section>
</template>

<style scoped>
.groups {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
}

.group {
  padding: 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
}

h3 {
  font-size: 1rem;
  color: var(--gold);
  margin-bottom: 14px;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  transition: border-color 0.2s ease, color 0.2s ease;
}

.chip:hover {
  border-color: var(--emerald);
  color: var(--emerald);
}

@media (max-width: 900px) {
  .groups {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .groups {
    grid-template-columns: 1fr;
  }
}
</style>
