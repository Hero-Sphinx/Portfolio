<script setup lang="ts">
// `title` is [before, highlighted, after], which lets each language put the highlight where it reads best.
defineProps<{ eyebrow: string; title: string[]; lead?: string }>()
</script>

<template>
  <div>
    <p v-reveal class="eyebrow">{{ eyebrow }}</p>
    <h2 v-reveal class="section-title">{{ title[0] }}<span class="gradient-text">{{ title[1] }}</span>{{ title[2] }}</h2>
    <p v-if="lead" v-reveal class="section-lead">{{ lead }}</p>
  </div>
</template>
