<script setup lang="ts">
const { t } = useContent()
</script>

<template>
  <section class="motto" aria-labelledby="motto-line">
    <div class="container">
      <p id="motto-line" v-reveal class="line">{{ t.motto.line }}</p>
      <p v-reveal class="driven">{{ t.motto.driven }} <strong>HHPP</strong></p>
      <ul v-reveal class="values">
        <li v-for="word in t.motto.words" :key="word">
          <span class="initial" aria-hidden="true">{{ word[0] }}</span>
          <span class="word">{{ word }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.motto {
  position: relative;
  padding: 72px 0 24px;
  text-align: center;
}

.line {
  margin: 0 auto;
  max-width: 820px;
  font-family: var(--font-display);
  font-size: clamp(1.7rem, 4.4vw, 2.9rem);
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  text-shadow: 0 0 14px var(--bg);
}

.driven {
  margin: 20px 0 28px;
  font-size: 1.1rem;
  color: var(--muted);
  text-shadow: 0 0 12px var(--bg);
}

.driven strong {
  color: var(--gold);
  letter-spacing: 0.08em;
}

.values {
  list-style: none;
  margin: 0 auto;
  padding: 0;
  max-width: 720px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.values li {
  display: grid;
  justify-items: center;
  gap: 2px;
  padding: 16px 8px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
}

.initial {
  font-family: var(--font-display);
  font-size: 2.2rem;
  font-weight: 700;
  line-height: 1;
  color: var(--gold);
}

.word {
  font-size: 0.92rem;
  font-weight: 500;
}

@media (max-width: 520px) {
  .values {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
