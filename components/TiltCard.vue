<script setup lang="ts">
// Wraps any content in a card that tilts in 3D towards the pointer, with a soft glare. Off on touch and reduced motion.
const props = withDefaults(defineProps<{ max?: number }>(), { max: 10 })

const card = ref<HTMLElement | null>(null)
const style = ref<Record<string, string>>({})
let enabled = false

onMounted(() => {
  enabled =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

function onMove(e: PointerEvent) {
  if (!enabled || !card.value) return
  const r = card.value.getBoundingClientRect()
  const px = (e.clientX - r.left) / r.width
  const py = (e.clientY - r.top) / r.height
  style.value = {
    transform: `perspective(900px) rotateX(${(0.5 - py) * props.max}deg) rotateY(${(px - 0.5) * props.max}deg) translateZ(0)`,
    '--gx': `${px * 100}%`,
    '--gy': `${py * 100}%`,
    '--glare': '1',
  }
}

function onLeave() {
  style.value = {}
}
</script>

<template>
  <div ref="card" class="tilt" :style="style" @pointermove="onMove" @pointerleave="onLeave">
    <slot />
    <span class="glare" aria-hidden="true" />
  </div>
</template>

<style scoped>
.tilt {
  position: relative;
  transform-style: preserve-3d;
  /* opacity is listed too, so the v-reveal fade-in still animates on tilt cards */
  transition: transform 0.25s ease-out, opacity 0.7s ease;
  will-change: transform;
}

.glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: var(--glare, 0);
  transition: opacity 0.3s ease;
  background: radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255, 255, 255, 0.12), transparent 55%);
}
</style>
