import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { en, links, projectMeta } from '~/data/content'
import { fr } from '~/data/content.fr'

/** Walks two values together and reports any place where their shape differs. */
function shapeDifferences(a: unknown, b: unknown, path = ''): string[] {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return [`${path}: ${a.length} vs ${b.length} items`]
    return a.flatMap((item, i) => shapeDifferences(item, b[i], `${path}[${i}]`))
  }
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)])
    return [...keys].flatMap((k) =>
      shapeDifferences((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k], `${path}.${k}`),
    )
  }
  return typeof a === typeof b ? [] : [`${path}: ${typeof a} vs ${typeof b}`]
}

describe('site content', () => {
  it('keeps French and English the same shape', () => {
    expect(shapeDifferences(en, fr)).toEqual([])
  })

  it('has copy for every project in both languages', () => {
    for (const { id } of projectMeta) {
      expect(en.projectText).toHaveProperty(id)
      expect(fr.projectText).toHaveProperty(id)
    }
  })

  it('has unique project ids and https links', () => {
    expect(new Set(projectMeta.map((p) => p.id)).size).toBe(projectMeta.length)
    const urls = [...Object.values(links), ...projectMeta.flatMap((p) => [p.repo, p.live ?? p.repo])]
    for (const url of urls) expect(url).toMatch(/^https:\/\//)
  })

  it('gives every project a real screenshot or art, and the file exists', () => {
    for (const p of projectMeta) {
      expect(Boolean(p.shot) || Boolean(p.art)).toBe(true)
      if (p.shot) expect(existsSync(join('public', p.shot))).toBe(true)
    }
  })
})
