<script setup lang="ts">
// Isometric art for projects without a public screenshot: three layers floating apart in real CSS 3D, which spread
// further on hover. Each drawing is a schematic of what the project does, with no invented data.
import type { ProjectArt } from '~/data/content'

defineProps<{ kind: ProjectArt }>()

const deadlines = new Set([2, 12, 22])
const toppings = [[70, 92], [128, 116], [96, 142], [58, 118], [136, 84], [118, 160], [84, 58]]
</script>

<template>
  <div class="art" aria-hidden="true">
    <div class="plate">
      <!-- Base layer: a shared grid, except the pizza, which brings its own crust -->
      <svg v-if="kind !== 'pizza'" class="layer base" viewBox="0 0 200 200">
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
          <circle cx="56" cy="44" r="7" class="pin" />
          <circle cx="172" cy="80" r="7" class="pin" />
          <circle cx="114" cy="152" r="7" class="pin" />
        </svg>
        <!-- Stands upright on the calendar: it undoes the plate's rotation, so it faces the viewer -->
        <svg class="layer owl" viewBox="0 0 200 220">
          <path d="M70 196Q62 206 52 204M72 198Q70 208 62 210M130 196Q138 206 148 204M128 198Q130 208 138 210" class="talons" />
          <path d="M100 40C60 40 38 62 36 104C34 150 58 200 100 200S166 150 164 104C162 62 140 40 100 40Z" class="owl-body" />
          <path d="M44 74L34 26L78 50ZM156 74L166 26L122 50Z" class="owl-body" />
          <path d="M100 112C70 112 58 140 64 166C70 188 86 196 100 196S130 188 136 166C142 140 130 112 100 112Z" class="owl-belly" />
          <path d="M82 140Q88 148 94 140M106 140Q112 148 118 140M72 158Q78 166 84 158M94 158Q100 166 106 158M116 158Q122 166 128 158M84 176Q90 184 96 176M104 176Q110 184 116 176" class="feathers" />
          <path d="M38 110C26 132 32 170 56 186C48 160 48 134 54 112Z" class="owl-wing" />
          <path d="M162 110C174 132 168 170 144 186C152 160 152 134 146 112Z" class="owl-wing" />
          <g class="eyes">
            <circle cx="72" cy="88" r="27" class="eye" />
            <circle cx="128" cy="88" r="27" class="eye" />
            <circle cx="74" cy="88" r="14" class="pupil" />
            <circle cx="126" cy="88" r="14" class="pupil" />
            <circle cx="79" cy="82" r="5" class="glint" />
            <circle cx="131" cy="82" r="5" class="glint" />
          </g>
          <path d="M100 100L90 112L100 126L110 112Z" class="beak" />
        </svg>
      </template>

      <template v-else-if="kind === 'pizza'">
        <svg class="layer base" viewBox="0 0 200 200">
          <circle cx="100" cy="100" r="96" class="crust" />
          <circle cx="100" cy="100" r="84" class="sauce" />
        </svg>
        <svg class="layer mid" viewBox="0 0 200 200">
          <path d="M100 100L155 45A78 78 0 1 1 100 22Z" class="cheese" />
          <path d="M100 100L178 100M100 100L155 155M100 100L100 178M100 100L45 155M100 100L22 100M100 100L45 45" class="cuts" />
        </svg>
        <svg class="layer top" viewBox="0 0 200 200">
          <circle v-for="([x, y], i) in toppings" :key="i" :cx="x" :cy="y" r="10" class="pepperoni" />
          <ellipse cx="146" cy="128" rx="8" ry="4" class="basil" transform="rotate(-30 146 128)" />
          <ellipse cx="60" cy="136" rx="8" ry="4" class="basil" transform="rotate(40 60 136)" />
          <ellipse cx="62" cy="62" rx="8" ry="4" class="basil" transform="rotate(-50 62 62)" />
        </svg>
        <svg class="layer lift" viewBox="0 0 200 200">
          <path d="M100 100L100 6A94 94 0 0 1 166 34Z" class="crust" />
          <path d="M100 100L100 22A78 78 0 0 1 155 45Z" class="cheese" />
          <circle cx="116" cy="56" r="9" class="pepperoni" />
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

/* Room above the calendar for the owl's head */
.art:has(.owl) .plate {
  margin-top: 9%;
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

.lift {
  transform: translateZ(84px);
}

:global(.card:hover) .lift {
  transform: translateZ(130px);
}

.owl {
  inset: auto 30% 46%;
  width: 40%;
  height: auto;
  aspect-ratio: 200 / 220;
  transform: translateZ(14px) rotateZ(38deg) rotateX(-56deg);
  transform-origin: 50% 100%;
}

:global(.card:hover) .owl {
  transform: translateZ(24px) rotateZ(38deg) rotateX(-56deg);
}

.owl-body {
  fill: #8a6242;
}

.owl-wing {
  fill: #6d4a30;
}

.owl-belly {
  fill: #e9d3ae;
}

.feathers,
.talons {
  fill: none;
  stroke-width: 3.5;
  stroke-linecap: round;
}

.feathers {
  stroke: #b8926a;
}

.talons {
  stroke: #f2b632;
  stroke-width: 6;
}

.eye {
  fill: #fff7e6;
  stroke: #5a3b24;
  stroke-width: 5;
}

.pupil {
  fill: #1c1410;
}

.glint {
  fill: #fff;
}

.beak {
  fill: #f2b632;
}

.eyes {
  transform-origin: 100px 88px;
  animation: blink 5s ease-in-out infinite;
}

@keyframes blink {
  0%, 94%, 100% {
    transform: scaleY(1);
  }

  97% {
    transform: scaleY(0.08);
  }
}

.crust {
  fill: #d99a4e;
  stroke: #a86a28;
  stroke-width: 1.5;
}

.sauce {
  fill: #b5341a;
}

.cheese {
  fill: #f6c445;
}

.cuts {
  fill: none;
  stroke: #d99a2e;
  stroke-width: 1.5;
}

.pepperoni {
  fill: #b5281c;
  stroke: #7f1d12;
  stroke-width: 1.5;
}

.basil {
  fill: #2f9e6e;
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

.tile.hot {
  fill: color-mix(in srgb, var(--accent) 70%, transparent);
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
  .plate,
  .eyes {
    animation: none;
  }

  .layer {
    transition: none;
  }
}
</style>
