// v-reveal: fades an element in the first time it scrolls into view. `v-reveal="150"` adds a 150 ms delay.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive<HTMLElement, number | undefined>('reveal', {
    // The server adds the class so nothing flashes before hydration; the attribute tells Vue that difference is intended.
    getSSRProps: () => ({ class: 'reveal', 'data-allow-mismatch': 'class' }),
    mounted(el, binding) {
      el.classList.add('reveal')
      if (binding.value) el.style.transitionDelay = `${binding.value}ms`
      if (!('IntersectionObserver' in window)) {
        el.classList.add('is-visible')
        return
      }
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              el.classList.add('is-visible')
              observer.disconnect()
            }
          }
        },
        { threshold: 0.15 },
      )
      observer.observe(el)
    },
  })
})
