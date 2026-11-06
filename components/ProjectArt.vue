<script setup lang="ts">
// Isometric art for projects without a public screenshot: three layers floating apart in real CSS 3D, which spread
// further on hover. Each drawing is a schematic of what the project does, with no invented data.
import type { ProjectArt } from '~/data/content'

defineProps<{ kind: ProjectArt }>()

const deadlines = new Set([5, 10, 17])
</script>

<template>
  <div class="art" aria-hidden="true">
    <div class="plate">
      <!-- Base layer: a shared grid -->
      <svg class="layer base" viewBox="0 0 200 200">
        <rect x="2" y="2" width="196" height="196" rx="14" class="panel" />
        <path d="M2 52H198M2 102H198M2 152H198M52 2V198M102 2V198M152 2V198" class="grid" />
      </svg>

      <template v-if="kind === 'calendar'">
        <svg class="layer mid" viewBox="0 0 200 200">
          <rect
            v-for="i in 24"
            :key="i"
            :x="16 + ((i - 1) % 6) * 29"
            :y="30 + Math.floor((i - 1) / 6) * 36"
            width="23"
            height="29"
            rx="4"
            class="tile"
            :class="{ hot: deadlines.has(i) }"
          />
        </svg>
        <svg class="layer top" viewBox="0 0 200 200">
          <circle cx="119" cy="44" r="7" class="pin" />
          <circle cx="61" cy="80" r="7" class="pin" />
          <circle cx="90" cy="116" r="7" class="pin" />
        </svg>
      </template>

      <template v-else-if="kind === 'tickets'">
        <svg class="layer mid" viewBox="0 0 200 200">
          <g v-for="c in 3" :key="c">
            <rect :x="14 + (c - 1) * 60" y="22" width="52" height="156" rx="7" class="tile" />
          </g>
        </svg>
        <svg class="layer top" viewBox="0 0 200 200">
          <rect x="20" y="34" width="40" height="46" rx="5" class="ticket" />
          <rect x="20" y="88" width="40" height="46" rx="5" class="ticket" />
          <rect x="80" y="34" width="40" height="46" rx="5" class="ticket hot" />
          <rect x="140" y="34" width="40" height="46" rx="5" class="ticket" />
          <path d="M26 48H52M26 58H44M26 102H52M26 112H44M86 48H112M86 58H104M146 48H172M146 58H164" class="lines" />
        </svg>
      </template>

      <template v-else-if="kind === 'routes'">
        <svg class="layer mid" viewBox="0 0 200 200">
          <path d="M20 160C60 160 50 90 100 90S140 30 182 34" class="route" />
          <path d="M24 40C70 60 80 150 176 164" class="route dim" />
        </svg>
        <svg class="layer top" viewBox="0 0 200 200">
          <circle cx="20" cy="160" r="6" class="pin" />
          <circle cx="100" cy="90" r="8" class="pin" />
          <circle cx="182" cy="34" r="6" class="pin" />
          <circle r="6" class="mover">
            <animateMotion dur="7s" repeatCount="indefinite" path="M20 160C60 160 50 90 100 90S140 30 182 34" />
          </circle>
        </svg>
      </template>

      <template v-else>
        <svg class="layer mid" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="84" class="route dim" />
          <ellipse cx="100" cy="100" rx="84" ry="32" class="route dim" />
          <ellipse cx="100" cy="100" rx="32" ry="84" class="route dim" />
        </svg>
        <svg class="layer top" viewBox="0 0 200 200">
          <path d="M34 142Q100 10 168 70" class="route" />
          <circle cx="34" cy="142" r="6" class="pin" />
          <circle cx="168" cy="70" r="6" class="pin" />
          <circle r="5" class="mover">
            <animateMotion dur="6s" repeatCount="indefinite" path="M34 142Q100 10 168 70" />
          </circle>
        </svg>
      </template>
    </div>
  </div>
</template>

<style scoped>
.art {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  perspective: 900px;
  overflow: hidden;
  background:
    radial-gradient(circle at 30% 20%, color-mix(in srgb, var(--accent) 34%, transparent), transparent 60%),
    radial-gradient(circle at 80% 90%, color-mix(in srgb, var(--accent) 18%, transparent), transparent 55%),
    var(--bg-2);
}

.plate {
  position: relative;
  width: min(62%, 240px);
  aspect-ratio: 1;
  transform: rotateX(56deg) rotateZ(-38deg);
  transform-style: preserve-3d;
  animation: bob 7s ease-in-out infinite;
}

.layer {
  position: absolute;
  inset: 0;
  overflow: visible;
  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.mid {
  transform: translateZ(26px);
}

.top {
  transform: translateZ(52px);
}

:global(.card:hover) .mid {
  transform: translateZ(44px);
}

:global(.card:hover) .top {
  transform: translateZ(88px);
}

.panel {
  fill: color-mix(in srgb, var(--accent) 12%, var(--bg));
  stroke: color-mix(in srgb, var(--accent) 55%, transparent);
  stroke-width: 1.5;
}

.grid {
  fill: none;
  stroke: color-mix(in srgb, var(--accent) 22%, transparent);
}

.tile {
  fill: color-mix(in srgb, var(--accent) 16%, transparent);
  stroke: color-mix(in srgb, var(--accent) 50%, transparent);
}

.tile.hot,
.ticket.hot {
  fill: color-mix(in srgb, var(--accent) 70%, transparent);
}

.ticket {
  fill: color-mix(in srgb, var(--accent) 30%, var(--bg));
  stroke: var(--accent);
}

.lines {
  fill: none;
  stroke: var(--text);
  stroke-width: 2.5;
  stroke-linecap: round;
  opacity: 0.7;
}

.route {
  fill: none;
  stroke: var(--accent);
  stroke-width: 4;
  stroke-linecap: round;
}

.route.dim {
  stroke-width: 2;
  opacity: 0.45;
}

.pin {
  fill: var(--accent);
  stroke: var(--bg);
  stroke-width: 2;
}

.mover {
  fill: var(--gold);
}

@keyframes bob {
  50% {
    translate: 0 -8px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .plate {
    animation: none;
  }

  .layer {
    transition: none;
  }
}
</style>
