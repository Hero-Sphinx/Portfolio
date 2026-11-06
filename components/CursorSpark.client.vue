<script setup lang="ts">
// A soft gold spark that follows the cursor across the whole site, echoing the neurons firing on the brain.
// Mouse and trackpad only, off for reduced motion, and it stops drawing the moment the cursor rests.
import { forkFrom, jaggedPath, type SparkPoint } from '~/utils/spark'

const LIFE = 420 // how long a spark lasts, in ms
const STEP = 16 // minimum cursor travel between sparks, in px
const JUMP = 220 // anything further is the cursor re-entering the page, not a movement to trace
const MAX_BOLTS = 36

interface Bolt {
  paths: SparkPoint[][]
  born: number
}

const canvas = ref<HTMLCanvasElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(async () => {
  await nextTick()
  const el = canvas.value
  const ctx = el?.getContext('2d')
  const usable = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!el || !ctx || !usable || calm) return

  const light = window.matchMedia('(prefers-color-scheme: light)').matches
  const colour = light ? '183, 121, 31' : '251, 191, 36'

  const resize = () => {
    const scale = Math.min(window.devicePixelRatio, 2)
    el.width = window.innerWidth * scale
    el.height = window.innerHeight * scale
    ctx.setTransform(scale, 0, 0, scale, 0, 0)
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  const bolts: Bolt[] = []
  let last: SparkPoint | null = null
  let frame = 0

  const draw = (now: number) => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
    while (bolts[0] && now - bolts[0].born > LIFE) bolts.shift()
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = `rgba(${colour}, 0.5)`
    ctx.shadowBlur = 6
    for (const bolt of bolts) {
      const fade = 1 - (now - bolt.born) / LIFE
      bolt.paths.forEach((path, i) => {
        ctx.strokeStyle = `rgba(${colour}, ${(i === 0 ? 0.4 : 0.22) * fade})`
        ctx.lineWidth = i === 0 ? 1.1 : 0.7
        ctx.beginPath()
        path.forEach((p, k) => (k ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)))
        ctx.stroke()
      })
    }
    frame = bolts.length ? requestAnimationFrame(draw) : 0
  }

  const onMove = (e: PointerEvent) => {
    const here = { x: e.clientX, y: e.clientY }
    if (!last) last = here
    const travelled = Math.hypot(here.x - last.x, here.y - last.y)
    if (travelled < STEP) return
    if (travelled > JUMP) {
      last = here
      return
    }
    const paths = [jaggedPath(last, here, Math.random)]
    if (Math.random() < 0.3) paths.push(forkFrom(here, Math.random))
    bolts.push({ paths, born: performance.now() })
    if (bolts.length > MAX_BOLTS) bolts.shift()
    last = here
    if (!frame) frame = requestAnimationFrame(draw)
  }
  window.addEventListener('pointermove', onMove, { passive: true })

  cleanup = () => {
    cancelAnimationFrame(frame)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('resize', resize)
  }
})

onBeforeUnmount(() => cleanup?.())
</script>

<template>
  <canvas ref="canvas" class="spark" aria-hidden="true" />
</template>

<style scoped>
.spark {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 40;
  pointer-events: none;
}
</style>
