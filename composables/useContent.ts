import { computed } from 'vue'
import { en, projectMeta, type Content, type ProjectMeta } from '~/data/content'
import { fr } from '~/data/content.fr'

export type Locale = 'en' | 'fr'
export type ProjectView = ProjectMeta & Content['projectText']['robodoc']

const STORAGE_KEY = 'locale'
const copy: Record<Locale, Content> = { en, fr }

/**
 * The active language and its copy. The server always renders English, so hydration matches; a saved preference is
 * applied by `plugins/locale.client.ts` after the page has mounted.
 */
export function useContent() {
  const locale = useState<Locale>('locale', () => 'en')
  const t = computed(() => copy[locale.value])

  const projects = computed<ProjectView[]>(() =>
    projectMeta.map((meta) => ({ ...meta, ...t.value.projectText[meta.id as keyof Content['projectText']] })),
  )

  function setLocale(next: Locale) {
    locale.value = next
    document.documentElement.lang = next
    localStorage.setItem(STORAGE_KEY, next)
  }

  return { locale, t, projects, setLocale }
}

export function savedLocale(): Locale | null {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved === 'en' || saved === 'fr' ? saved : null
}
