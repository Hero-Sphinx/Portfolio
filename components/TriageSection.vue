<script setup lang="ts">
const { t } = useContent()
</script>

<template>
  <section id="triage" class="section">
    <div class="container">
      <SectionHeading :eyebrow="t.triage.eyebrow" :title="t.triage.title" :lead="t.triage.lead" />
      <TriageSim />
    </div>
  </section>
</template>
