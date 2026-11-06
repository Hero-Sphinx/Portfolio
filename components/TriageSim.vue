<script setup lang="ts">
import { ecg } from '~/utils/forms/pulse'
import { isCritical } from '~/utils/triage'

const { t } = useContent()

const heartRate = ref(78)
const oxygen = ref(98)
const critical = computed(() => isCritical({ heartRate: heartRate.value, oxygen: oxygen.value }))

const monitor = ref<HTMLCanvasElement | null>(null)
let frame = 0
let phase = 0
let last = 0
let visible = true
let observer: IntersectionObserver | null = null

// A rolling three-second trace. It redraws only while on screen.
function draw(now: number) {
  const canvas = monitor.value
  const ctx = canvas?.getContext('2d')
  if (!canvas || !ctx) return
  const dt = Math.min((now - last) / 1000, 0.05)
  last = now
  const beatsPerSecond = heartRate.value / 60
  phase += dt * beatsPerSecond

  const { width: w, height: h } = canvas
  const style = getComputedStyle(canvas)
  ctx.clearRect(0, 0, w, h)
  ctx.lineWidth = 2 * (window.devicePixelRatio > 1 ? 1.5 : 1)
  ctx.lineJoin = 'round'
  ctx.strokeStyle = style.getPropertyValue(critical.value ? '--alert' : '--emerald')
  ctx.beginPath()
  for (let x = 0; x <= w; x += 2) {
    const at = phase - ((w - x) / w) * 3 * beatsPerSecond
    const beat = ((at % 1) + 1) % 1
    const y = h * 0.68 - ecg(beat) * h * 0.5
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.stroke()
}

function loop(now: number) {
  frame = requestAnimationFrame(loop)
  if (visible && !document.hidden) draw(now)
}

onMounted(() => {
  const canvas = monitor.value
  if (!canvas) return
  const scale = Math.min(window.devicePixelRatio, 2)
  canvas.width = canvas.clientWidth * scale
  canvas.height = canvas.clientHeight * scale
  last = performance.now()
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    draw(last)
    watch([heartRate, oxygen], () => draw(performance.now()))
    return
  }
  observer = new IntersectionObserver(([entry]) => (visible = entry?.isIntersecting ?? true))
  observer.observe(canvas)
  frame = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>

<template>
  <div v-reveal class="sim" :class="{ critical }">
    <div class="panel">
      <div class="readout">
        <span class="status" aria-live="polite">{{ critical ? t.triage.status.critical : t.triage.status.stable }}</span>
        <span class="bpm">{{ heartRate }} <small>{{ t.triage.bpm }}</small></span>
      </div>
      <canvas ref="monitor" class="monitor" aria-hidden="true" />
      <label>
        <span class="row"><span>{{ t.triage.heartRate }}</span><output>{{ heartRate }} {{ t.triage.bpm }}</output></span>
        <input v-model.number="heartRate" type="range" min="35" max="180" />
      </label>
      <label>
        <span class="row"><span>{{ t.triage.oxygen }}</span><output>{{ oxygen }}%</output></span>
        <input v-model.number="oxygen" type="range" min="80" max="100" />
      </label>
    </div>

    <div class="flow">
      <p class="step lit">{{ t.triage.steps.intake }}</p>
      <p class="step lit">{{ t.triage.steps.check }}</p>
      <div class="routes">
        <div class="route" :class="{ active: !critical }">
          <h3>{{ t.triage.routes.normal }}</h3>
          <p class="step">{{ t.triage.steps.accepted }}</p>
          <p class="step">{{ t.triage.steps.ai }}</p>
        </div>
        <div class="route urgent" :class="{ active: critical }">
          <h3>{{ t.triage.routes.urgent }}</h3>
          <p class="step">{{ t.triage.steps.sms }}</p>
          <p class="step">{{ t.triage.steps.live }}</p>
        </div>
      </div>
    </div>

    <p class="note">{{ t.triage.disclaimer }}</p>
    <NuxtLink to="/projects/robodoc" class="more">{{ t.triage.caseStudy }}</NuxtLink>
  </div>
</template>

<style scoped>
.sim {
  --alert: #f87171;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
  transition: border-color 0.3s ease;
}

.sim.critical {
  border-color: var(--alert);
}

.panel {
  display: grid;
  gap: 14px;
  align-content: start;
}

.readout {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.status {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--emerald);
}

.critical .status {
  color: var(--alert);
}

.bpm {
  font-family: var(--font-display);
  font-size: 1.6rem;
  font-weight: 700;
}

.bpm small {
  font-size: 0.8rem;
  color: var(--muted);
}

.monitor {
  width: 100%;
  height: 130px;
  display: block;
  border-radius: 12px;
  background: color-mix(in srgb, var(--bg) 70%, transparent);
  border: 1px solid var(--border);
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 4px;
}

output {
  color: var(--gold);
  font-weight: 600;
}

input[type='range'] {
  width: 100%;
  height: 28px;
  margin: 0;
  accent-color: var(--emerald);
  cursor: pointer;
}

.flow {
  display: grid;
  gap: 10px;
  align-content: start;
}

.step {
  margin: 0;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 0.88rem;
  background: var(--surface-2);
  border: 1px solid var(--border);
}

.step.lit {
  border-color: color-mix(in srgb, var(--emerald) 50%, transparent);
}

.routes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.route {
  display: grid;
  gap: 8px;
  align-content: start;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid var(--border);
  opacity: 0.45;
  transition: opacity 0.3s ease, border-color 0.3s ease;
}

.route h3 {
  font-size: 0.86rem;
}

.route.active {
  opacity: 1;
  border-color: var(--emerald);
}

.route.urgent.active {
  border-color: var(--alert);
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
}

@media (max-width: 420px) {
  .routes {
    grid-template-columns: 1fr;
  }
}
</style>
