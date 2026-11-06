<script setup lang="ts">
const { t } = useContent()
</script>

<template>
  <section id="skills" class="section">
    <div class="container">
      <SectionHeading :eyebrow="t.skills.eyebrow" :title="t.skills.title" :lead="t.skills.lead" />

      <div class="groups">
        <TiltCard v-for="(g, i) in t.skills.groups" :key="i" v-reveal="(i % 3) * 90" class="group" :max="6">
          <h3>{{ g.name }}</h3>
          <div class="chips">
            <span v-for="s in g.items" :key="s" class="chip">{{ s }}</span>
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
  background: var(--card);
  border: 1px solid var(--border);
}

/* A last group left alone on its row stretches across it */
.group:last-child:nth-child(3n + 1) {
  grid-column: 1 / -1;
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

  .group:last-child:nth-child(3n + 1) {
    grid-column: auto;
  }

  .group:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .groups {
    grid-template-columns: 1fr;
  }
}
</style>
