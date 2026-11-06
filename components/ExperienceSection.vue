<script setup lang="ts">
import { experience } from '~/data/content'
</script>

<template>
  <section id="experience" class="section">
    <div class="container">
      <p v-reveal class="eyebrow">Experience</p>
      <h2 v-reveal class="section-title">Building since <span class="gradient-text">2020</span>.</h2>
      <p v-reveal class="section-lead">From client websites to leading a team, plus support roles that taught me to debug under pressure.</p>

      <ol class="timeline">
        <li v-for="(r, i) in experience" :key="r.company" v-reveal="i * 70" class="item">
          <span class="dot" aria-hidden="true" />
          <div class="card">
            <div class="head">
              <h3>{{ r.title }}</h3>
              <span class="dates">{{ r.dates }}</span>
            </div>
            <p class="company">{{ r.company }}</p>
            <p class="text">{{ r.text }}</p>
          </div>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.timeline {
  list-style: none;
  margin: 0;
  padding: 0 0 0 28px;
  position: relative;
  display: grid;
  gap: 18px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: linear-gradient(var(--emerald), var(--gold), transparent);
}

.item {
  position: relative;
}

.dot {
  position: absolute;
  left: -28px;
  top: 26px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--bg);
  border: 3px solid var(--emerald);
  box-shadow: 0 0 14px color-mix(in srgb, var(--emerald) 60%, transparent);
}

.card {
  padding: 22px 24px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  transition: border-color 0.25s ease, transform 0.25s ease;
}

.card:hover {
  border-color: color-mix(in srgb, var(--emerald) 45%, transparent);
  transform: translateX(4px);
}

.head {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 4px 16px;
}

h3 {
  font-size: 1.15rem;
}

.dates {
  color: var(--gold);
  font-size: 0.88rem;
  font-weight: 500;
}

.company {
  margin: 4px 0 10px;
  color: var(--emerald);
  font-weight: 500;
  font-size: 0.95rem;
}

.text {
  margin: 0;
  color: var(--muted);
  font-size: 0.94rem;
}
</style>
