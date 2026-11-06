// Restores the visitor's language after hydration: the first browser render must match the English HTML from the server.
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    const saved = savedLocale()
    if (saved && saved !== 'en') useContent().setLocale(saved)
  })
})
