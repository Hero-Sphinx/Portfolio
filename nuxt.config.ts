// Static site: `npm run generate` writes plain HTML to .output/public, which Vercel serves as-is.
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      title: 'Abdullahi — Full-Stack Developer',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'Full-stack developer building fast, tested software in TypeScript and Java, with a focus on MedTech, AI and neurotechnology.',
        },
        { name: 'theme-color', content: '#06110d' },
        { property: 'og:title', content: 'Abdullahi — Full-Stack Developer' },
        { property: 'og:description', content: 'MedTech & AI · Aspiring neurotechnologist · Live demos inside.' },
        { property: 'og:image', content: '/shots/seebawayh.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap',
        },
      ],
    },
  },
})
