<script setup lang="ts">
import type { Locale } from '~/composables/useContent'
import { extractDeadlines, monthViews, type Deadline } from '~/utils/deadlines'

const { t, locale } = useContent()

const text = ref(t.value.outline.sample)
const results = ref<Deadline[] | null>(null)
const months = computed(() => monthViews(results.value ?? []))

function findDeadlines() {
  results.value = extractDeadlines(text.value, new Date().getFullYear())
}

function formatDate({ month, day }: Deadline) {
  const name = t.value.outline.months[month]
  return locale.value === 'fr' ? `${day} ${name?.toLowerCase()}` : `${name} ${day}`
}

// Switching language swaps the sample, but never throws away what a visitor typed
watch(locale, (next: Locale, previous: Locale) => {
  if (text.value === copyFor(previous).outline.sample) {
    text.value = copyFor(next).outline.sample
    results.value = null
  }
})
</script>

<template>
  <div v-reveal class="sim">
    <div class="input">
      <label for="outline-text">{{ t.outline.inputLabel }}</label>
      <textarea id="outline-text" v-model="text" rows="9" maxlength="4000" spellcheck="false" />
      <button type="button" class="btn btn-primary" @click="findDeadlines">{{ t.outline.action }}</button>
    </div>

    <div class="output" aria-live="polite">
      <p v-if="results === null" class="hint">{{ t.outline.hint }}</p>
      <p v-else-if="results.length === 0" class="hint">{{ t.outline.empty }}</p>
      <template v-else>
        <p class="count">{{ t.outline.found }} <strong>{{ results.length }}</strong></p>
        <div class="calendars">
          <div v-for="m in months" :key="`${m.year}-${m.month}`" class="month">
            <h3>{{ t.outline.months[m.month] }}</h3>
            <div class="grid" aria-hidden="true">
              <span v-for="(w, i) in t.outline.weekdays" :key="i" class="weekday">{{ w }}</span>
              <span v-for="n in m.offset" :key="`blank-${n}`" />
              <span v-for="d in m.days" :key="d" class="day" :class="{ hot: m.marked.has(d) }" :style="{ '--d': `${d * 12}ms` }">{{ d }}</span>
            </div>
          </div>
        </div>
        <ol class="list">
          <li v-for="(r, i) in results" :key="i">
            <span class="date">{{ formatDate(r) }}</span>
            <span>{{ r.title || t.outline.untitled }}</span>
          </li>
        </ol>
      </template>
    </div>

    <p class="note">{{ t.outline.disclaimer }}</p>
    <NuxtLink to="/projects/outlineowl" class="more">{{ t.outline.caseStudy }}</NuxtLink>
  </div>
</template>

<style scoped>
.sim {
  --accent: #a78bfa;
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 24px;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
}

.input {
  display: grid;
  gap: 10px;
  align-content: start;
}

label {
  font-size: 0.9rem;
  font-weight: 500;
}

textarea {
  width: 100%;
  resize: vertical;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  color: var(--text);
  font: 0.86rem/1.6 ui-monospace, Consolas, monospace;
}

.input .btn {
  justify-self: start;
  cursor: pointer;
}

.output {
  min-height: 260px;
}

.hint {
  display: grid;
  place-items: center;
  height: 100%;
  margin: 0;
  padding: 24px;
  text-align: center;
  color: var(--muted);
  border: 1px dashed var(--border);
  border-radius: 12px;
}

.count {
  margin: 0 0 12px;
  font-size: 0.9rem;
}

.count strong {
  font-family: var(--font-display);
  font-size: 1.1rem;
  color: var(--gold);
}

.calendars {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}

.month {
  padding: 10px;
  border-radius: 12px;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.month h3 {
  font-size: 0.82rem;
  margin-bottom: 6px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
  font-size: 0.66rem;
  text-align: center;
  color: var(--muted);
}

.weekday {
  font-weight: 700;
}

.day {
  border-radius: 5px;
  line-height: 1.6;
}

.day.hot {
  background: var(--accent);
  color: #120a24;
  font-weight: 700;
  animation: land 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.4) both;
  animation-delay: var(--d);
}

@keyframes land {
  from {
    opacity: 0;
    transform: scale(2.2);
  }
}

.list {
  list-style: none;
  margin: 14px 0 0;
  padding: 0;
  display: grid;
  gap: 6px;
  font-size: 0.88rem;
}

.list li {
  display: grid;
  grid-template-columns: 110px 1fr;
  gap: 10px;
}

.date {
  color: var(--gold);
  font-weight: 600;
}

.note,
.more {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 0.85rem;
}

.note {
  color: var(--muted);
}

.more {
  color: var(--emerald);
  font-weight: 600;
  margin-top: -12px;
}

@media (max-width: 820px) {
  .sim {
    grid-template-columns: 1fr;
  }

  .output {
    min-height: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .day.hot {
    animation: none;
  }
}
</style>
