<script setup lang="ts">
import { links } from '~/data/content'

const { t } = useContent()
const year = new Date().getFullYear()
</script>

<template>
  <section id="contact" class="section">
    <div class="container">
      <div v-reveal class="panel">
        <p class="eyebrow">{{ t.contact.eyebrow }}</p>
        <h2 class="section-title">{{ t.contact.title[0] }}<span class="gradient-text">{{ t.contact.title[1] }}</span>{{ t.contact.title[2] }}</h2>
        <p class="lead">{{ t.contact.lead }}</p>
        <div class="actions">
          <a :href="`mailto:${links.email}`" class="btn btn-primary">{{ links.email }}</a>
          <a :href="links.linkedin" target="_blank" rel="noopener" class="btn">{{ t.contact.linkedin }}</a>
          <a :href="links.github" target="_blank" rel="noopener" class="btn">GitHub</a>
        </div>
      </div>
    </div>
    <footer class="container footer">
      <span>© {{ year }} Abdullahi</span>
      <span>{{ t.contact.builtWith }}</span>
    </footer>
  </section>
</template>

<style scoped>
.panel {
  position: relative;
  overflow: hidden;
  text-align: center;
  padding: 64px 28px;
  border-radius: 28px;
  border: 1px solid var(--border);
  background:
    radial-gradient(circle at 20% 0%, color-mix(in srgb, var(--emerald) 22%, transparent), transparent 60%),
    radial-gradient(circle at 90% 100%, color-mix(in srgb, var(--gold) 16%, transparent), transparent 55%),
    var(--card);
}

.lead {
  color: var(--muted);
  max-width: 560px;
  margin: 0 auto 32px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
}

.footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px;
  margin-top: 56px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-size: 0.85rem;
}
</style>
