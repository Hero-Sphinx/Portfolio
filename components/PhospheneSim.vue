<script setup lang="ts">
import { electrodeLayout, quantise, sampleBrightness } from '~/utils/phosphene'

type Scene = 'face' | 'door' | 'letter'

const { t } = useContent()
const SIZE = 256
const scenes: Scene[] = ['face', 'door', 'letter']

const scene = ref<Scene>('face')
const position = ref(52) // the slider is logarithmic: small counts matter most
const count = computed(() => Math.round(30 * 50 ** (position.value / 100)))

const original = ref<HTMLCanvasElement | null>(null)
const perceived = ref<HTMLCanvasElement | null>(null)
let glow: HTMLCanvasElement | null = null

// Plain high-contrast pictures, the kind of input a prosthesis's camera processing would pass on.
function paint(ctx: CanvasRenderingContext2D, kind: Scene) {
  const s = SIZE
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, s, s)
  ctx.fillStyle = '#fff'
  ctx.strokeStyle = '#fff'
  if (kind === 'face') {
    ctx.beginPath()
    ctx.ellipse(s / 2, s / 2, s * 0.3, s * 0.38, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#000'
    for (const side of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(s / 2 + side * s * 0.12, s * 0.42, s * 0.05, s * 0.035, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillRect(s * 0.48, s * 0.48, s * 0.04, s * 0.11)
    ctx.strokeStyle = '#000'
    ctx.lineWidth = s * 0.03
    ctx.beginPath()
    ctx.arc(s / 2, s * 0.58, s * 0.12, Math.PI * 0.2, Math.PI * 0.8)
    ctx.stroke()
  } else if (kind === 'door') {
    ctx.lineWidth = s * 0.05
    ctx.strokeRect(s * 0.28, s * 0.1, s * 0.44, s * 0.8)
    ctx.fillRect(s * 0.33, s * 0.15, s * 0.34, s * 0.7)
    ctx.fillStyle = '#000'
    ctx.beginPath()
    ctx.arc(s * 0.61, s * 0.52, s * 0.035, 0, Math.PI * 2)
    ctx.fill()
  } else {
    ctx.font = `700 ${s * 0.86}px Arial, sans-serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('A', s / 2, s * 0.54)
  }
}

// One soft dot, drawn once and stamped per electrode.
function makeGlow(): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 64
  const ctx = canvas.getContext('2d')!
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 244, 214, 1)')
  gradient.addColorStop(0.4, 'rgba(255, 226, 150, 0.55)')
  gradient.addColorStop(1, 'rgba(255, 210, 120, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  return canvas
}

function draw() {
  const from = original.value?.getContext('2d', { willReadFrequently: true })
  const to = perceived.value?.getContext('2d')
  if (!from || !to || !glow) return

  paint(from, scene.value)
  const pixels = from.getImageData(0, 0, SIZE, SIZE).data

  to.globalCompositeOperation = 'source-over'
  to.fillStyle = '#020604'
  to.fillRect(0, 0, SIZE, SIZE)
  to.globalCompositeOperation = 'lighter'
  for (const { x, y, radius } of electrodeLayout(count.value)) {
    const level = quantise(sampleBrightness(pixels, SIZE, x, y, radius))
    if (level === 0) continue
    const r = (radius / 2) * SIZE * 1.5
    to.globalAlpha = level
    to.drawImage(glow, ((x + 1) / 2) * SIZE - r, ((y + 1) / 2) * SIZE - r, r * 2, r * 2)
  }
  to.globalAlpha = 1
}

onMounted(() => {
  glow = makeGlow()
  draw()
})
watch([scene, count], draw)
</script>

<template>
  <div v-reveal class="sim">
    <div class="views">
      <figure>
        <canvas ref="original" :width="SIZE" :height="SIZE" role="img" :aria-label="t.research.original" />
        <figcaption>{{ t.research.original }}</figcaption>
      </figure>
      <figure>
        <canvas ref="perceived" :width="SIZE" :height="SIZE" role="img" :aria-label="t.research.perceived" />
        <figcaption>{{ t.research.perceived }}</figcaption>
      </figure>
    </div>

    <div class="controls">
      <label class="slider">
        <span class="row"><span>{{ t.research.electrodes }}</span><output>{{ count }}</output></span>
        <input v-model.number="position" type="range" min="0" max="100" :aria-valuetext="`${count} ${t.research.electrodes}`" />
      </label>
      <div class="scenes" role="group" :aria-label="t.research.sceneLabel">
        <button v-for="s in scenes" :key="s" type="button" class="btn" :aria-pressed="scene === s" @click="scene = s">
          {{ t.research.scenes[s] }}
        </button>
      </div>
    </div>
    <p class="note">{{ t.research.disclaimer }}</p>
  </div>
</template>

<style scoped>
.sim {
  padding: 24px;
  border-radius: var(--radius);
  background: var(--card);
  border: 1px solid var(--border);
}

.views {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

figure {
  margin: 0;
}

canvas {
  width: 100%;
  aspect-ratio: 1;
  display: block;
  border-radius: 14px;
  background: #020604;
}

figcaption {
  margin-top: 10px;
  font-size: 0.85rem;
  color: var(--muted);
}

.controls {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px 24px;
  margin-top: 20px;
}

.slider {
  flex: 1 1 260px;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  margin-bottom: 6px;
}

output {
  font-family: var(--font-display);
  font-weight: 700;
  color: var(--gold);
}

input[type='range'] {
  width: 100%;
  height: 28px;
  margin: 0;
  accent-color: var(--emerald);
  cursor: pointer;
}

.scenes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.scenes .btn {
  padding: 8px 16px;
  font-size: 0.85rem;
  color: var(--text);
  cursor: pointer;
}

.scenes .btn[aria-pressed='true'] {
  border-color: var(--emerald);
  color: var(--emerald);
}

.note {
  margin: 16px 0 0;
  font-size: 0.82rem;
  color: var(--muted);
}
</style>
