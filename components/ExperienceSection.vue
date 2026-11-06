<script setup lang="ts">
const { t } = useContent()

// An axon runs down the timeline: a gold signal follows your scroll and lights each role as it passes.
const list = ref<HTMLElement | null>(null)
const progress = ref(1)
const lit = ref(99)

function update() {
  const el = list.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const reach = window.innerHeight * 0.65 - rect.top
  progress.value = Math.min(1, Math.max(0, reach / rect.height))
  lit.value = [...el.children].filter((item) => item.getBoundingClientRect().top < window.innerHeight * 0.65).length
}

let ticking = false
function onScroll() {
  if (ticking) return
  ticking = true
  requestAnimationFrame(() => {
    ticking = false
    update()
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  update()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onScroll, { passive: true })
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onScroll)
})
</script>

<template>
  <section id="experience" class="section">
    <div class="container">
      <SectionHeading :eyebrow="t.experience.eyebrow" :title="t.experience.title" :lead="t.experience.lead" />

      <div class="timeline" :style="{ '--progress': progress }">
        <span class="axon" aria-hidden="true" />
        <ol ref="list">
          <li v-for="(r, i) in t.experience.roles" :key="r.company" v-reveal="i * 70" class="item" :class="{ lit: i < lit }">
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
    </div>
  </section>
</template>

<style scoped>
.timeline {
  position: relative;
  padding-left: 28px;
}

.timeline::before,
.axon {
  content: '';
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
}

.timeline::before {
  background: var(--border);
}

.axon {
  background: linear-gradient(var(--emerald), var(--gold));
  transform: scaleY(var(--progress, 1));
  transform-origin: top;
  box-shadow: 0 0 10px color-mix(in srgb, var(--gold) 60%, transparent);
}

ol {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 18px;
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
  border: 3px solid var(--border);
  transition: border-color 0.4s ease, box-shadow 0.4s ease;
}

.lit .dot {
  border-color: var(--emerald);
  box-shadow: 0 0 14px color-mix(in srgb, var(--emerald) 60%, transparent);
}

.card {
  padding: 22px 24px;
  border-radius: var(--radius);
  background: var(--card);
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
