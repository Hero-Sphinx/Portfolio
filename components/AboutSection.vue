<script setup lang="ts">
import { education, pillars, spokenLanguages } from '~/data/content'
</script>

<template>
  <section id="about" class="section">
    <div class="container">
      <p v-reveal class="eyebrow">About me</p>
      <h2 v-reveal class="section-title">Software that helps people <span class="gradient-text">heal and learn</span>.</h2>
      <p v-reveal class="section-lead">
        I'm a full-stack developer who doesn't stop until a problem is solved: research, questions, open source,
        whatever it takes. I've built for restaurants, clinics and learners, and I'm working toward neurotechnology,
        where software meets the brain.
      </p>

      <div class="pillars">
        <TiltCard v-for="(p, i) in pillars" :key="p.title" v-reveal="i * 90" class="pillar" :max="8">
          <span class="icon" aria-hidden="true">{{ p.icon }}</span>
          <h3>{{ p.title }}</h3>
          <p>{{ p.text }}</p>
        </TiltCard>
      </div>

      <div class="meta">
        <div v-reveal class="meta-block">
          <h3>Education</h3>
          <ul>
            <li v-for="e in education" :key="e.school">
              <strong>{{ e.school }}</strong>
              <span>{{ e.credential }} · {{ e.dates }}</span>
            </li>
          </ul>
        </div>
        <div v-reveal="120" class="meta-block">
          <h3>Languages I speak</h3>
          <div class="chips">
            <span v-for="l in spokenLanguages" :key="l" class="chip">{{ l }}</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pillars {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
}

.pillar {
  padding: 28px 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
}

.icon {
  font-size: 1.8rem;
  display: block;
  margin-bottom: 18px;
}

.pillar h3 {
  font-size: 1.15rem;
  margin-bottom: 10px;
}

.pillar p {
  margin: 0;
  color: var(--muted);
  font-size: 0.93rem;
}

.meta {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 18px;
  margin-top: 18px;
}

.meta-block {
  padding: 26px 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
}

.meta-block h3 {
  font-size: 1rem;
  color: var(--gold);
  margin-bottom: 14px;
}

.meta-block ul {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 12px;
}

.meta-block li {
  display: flex;
  flex-direction: column;
}

.meta-block li span {
  color: var(--muted);
  font-size: 0.9rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

@media (max-width: 960px) {
  .pillars {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .pillars,
  .meta {
    grid-template-columns: 1fr;
  }
}
</style>
