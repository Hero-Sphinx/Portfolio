<script setup lang="ts">
import { links } from '~/data/content'

const sections = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]

const scrolled = ref(false)
const open = ref(false)

const onScroll = () => (scrolled.value = window.scrollY > 24)
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header class="nav" :class="{ scrolled, open }">
    <div class="container bar">
      <a href="#top" class="logo" @click="open = false">
        <img src="/favicon.svg" alt="" width="28" height="28" />
        <span>Abdullahi</span>
      </a>

      <button
        class="menu-btn"
        :aria-expanded="open"
        aria-controls="nav-links"
        aria-label="Menu"
        @click="open = !open"
      >
        <span /><span />
      </button>

      <nav id="nav-links" class="links">
        <a v-for="s in sections" :key="s.id" :href="`#${s.id}`" @click="open = false">{{ s.label }}</a>
        <a :href="links.github" target="_blank" rel="noopener" class="btn">GitHub</a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  transition: background 0.3s ease, border-color 0.3s ease;
  border-bottom: 1px solid transparent;
}

.nav.scrolled,
.nav.open {
  background: color-mix(in srgb, var(--bg) 82%, transparent);
  backdrop-filter: blur(14px);
  border-color: var(--border);
}

.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 68px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
}

.links {
  display: flex;
  align-items: center;
  gap: 28px;
  font-size: 0.95rem;
  color: var(--muted);
}

.links a:not(.btn):hover {
  color: var(--text);
}

.links .btn {
  padding: 8px 18px;
  color: var(--text);
}

.menu-btn {
  display: none;
  background: none;
  border: 0;
  padding: 10px;
  cursor: pointer;
}

.menu-btn span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--text);
  margin: 5px 0;
  transition: transform 0.25s ease;
}

.open .menu-btn span:first-child {
  transform: translateY(3.5px) rotate(45deg);
}

.open .menu-btn span:last-child {
  transform: translateY(-3.5px) rotate(-45deg);
}

@media (max-width: 760px) {
  .menu-btn {
    display: block;
  }

  .links {
    position: absolute;
    top: 68px;
    left: 0;
    right: 0;
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
    padding: 12px 16px 20px;
    background: var(--bg);
    border-bottom: 1px solid var(--border);
    display: none;
  }

  .open .links {
    display: flex;
  }

  .links a {
    padding: 10px 0;
    width: 100%;
  }

  .links .btn {
    width: auto;
    margin-top: 8px;
  }
}
</style>
