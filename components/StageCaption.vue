<script setup lang="ts">
// Names the form the 3D scene is showing, like a figure label in a paper. Decorative, and hidden on narrow screens.
const { t } = useContent()
const figure = useState('stage-figure', () => 0)
const current = computed(() => t.value.figures[figure.value] ?? t.value.figures[0]!)
</script>

<template>
  <p class="caption" aria-hidden="true">
    <Transition name="fade" mode="out-in">
      <span :key="current.note">Fig. 0{{ figure + 1 }} — {{ current.title }} · {{ current.note }}</span>
    </Transition>
  </p>
</template>

<style scoped>
.caption {
  position: fixed;
  right: 18px;
  bottom: 24px;
  z-index: 2;
  margin: 0;
  writing-mode: vertical-rl;
  rotate: 180deg;
  font-family: var(--font-display);
  font-size: 0.72rem;
  letter-spacing: 0.14em;
  color: var(--muted);
  pointer-events: none;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 1239px) {
  .caption {
    display: none;
  }
}
</style>
