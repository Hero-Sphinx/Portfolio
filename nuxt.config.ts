// Static site: `npm run generate` writes plain HTML to .output/public, which Vercel serves as-is.
// Social previews need an absolute image URL: Vercel provides the production domain at build time.
const domain = process.env.NUXT_PUBLIC_SITE_URL ?? process.env.VERCEL_PROJECT_PRODUCTION_URL
const siteUrl = domain ? (domain.startsWith('http') ? domain : `https://${domain}`) : ''

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxt/eslint'],
  nitro: {
    prerender: {
      routes: ['/projects/seebawayh', '/projects/robodoc', '/projects/outlineowl', '/projects/pizza', '/projects/ptfms', '/projects/flight'],
    },
  },
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
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: `${siteUrl}/og.png` },
        { name: 'twitter:card', content: 'summary_large_image' },
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
      // Without JavaScript nothing would reveal, so show everything
      noscript: [{ innerHTML: '<style>.reveal{opacity:1;transform:none}</style>' }],
    },
  },
})
