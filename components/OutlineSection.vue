<script setup lang="ts">
const { t } = useContent()
</script>

<template>
  <section id="outline" class="section">
    <div class="container">
      <SectionHeading :eyebrow="t.outline.eyebrow" :title="t.outline.title" :lead="t.outline.lead" />
      <OutlineDemo />
    </div>
  </section>
</template>
