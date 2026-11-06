<script setup lang="ts">
const { t } = useContent()
</script>

<template>
  <section id="research" class="section">
    <div class="container layout">
      <SectionHeading :eyebrow="t.research.eyebrow" :title="t.research.title" :lead="t.research.lead" />
      <PhospheneSim />
    </div>
  </section>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 40px;
  align-items: center;
}

@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 0;
  }
}
</style>
