// House rules, enforced on every change. This is a static site with no API or database, so the rules that apply are
// about what ships to the browser. Each failure says how to fix it.
import { execFileSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { links } from '~/data/content'

const tracked = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean)

const SELF = 'tests/architecture/rules.test.ts'
const isText = (file: string) => /\.(vue|ts|mjs|json|ya?ml|md|css|svg)$/.test(file) && file !== 'package-lock.json'
const source = tracked.filter((file) => /\.(vue|ts)$/.test(file) && !file.startsWith('tests/'))
const read = (file: string) => readFileSync(file, 'utf8')

function offenders(files: string[], pattern: RegExp) {
  return files.filter((file) => pattern.test(read(file)))
}

describe('security rules', () => {
  it('never renders raw HTML', () => {
    expect(offenders(source, /v-html|innerHTML\s*=|insertAdjacentHTML/), 'Render text with {{ }} instead').toEqual([])
  })

  it('never evaluates strings as code', () => {
    expect(offenders(source, /\beval\(|new Function\(/), 'Remove eval / new Function').toEqual([])
  })

  it('opens external links safely', () => {
    const unsafe = source.filter((file) =>
      [...read(file).matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)].some(([tag]) => !tag.includes('rel="noopener"')),
    )
    expect(unsafe, 'Add rel="noopener" to target="_blank" links').toEqual([])
  })

  it('reads no secrets in browser code', () => {
    const browser = source.filter((file) => file !== 'nuxt.config.ts')
    expect(offenders(browser, /process\.env/), 'This is a static site: use public values in data/content.ts').toEqual([])
  })
})

describe('secret scan', () => {
  it('tracks no env files except the example', () => {
    expect(tracked.filter((f) => /(^|\/)\.env/.test(f) && !f.endsWith('.env.example')), 'Remove and rotate').toEqual([])
  })

  it('finds no provider keys in tracked files', () => {
    const keys = [
      /AIza[0-9A-Za-z_-]{30,}/,
      /npg_[0-9A-Za-z]{10,}/,
      /postgres(ql)?:\/\/[^\s:]+:[^\s@]+@/,
      /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
      /\bsk_(live|test)_[0-9A-Za-z]{10,}/,
      /\bre_[0-9A-Za-z]{20,}/,
    ]
    const files = tracked.filter((f) => isText(f) && f !== SELF)
    expect(files.filter((f) => keys.some((key) => key.test(read(f)))), 'Remove the key and rotate it').toEqual([])
  })
})

describe('privacy rules', () => {
  it('publishes no phone number, and no email except the public one in data/content.ts', () => {
    const files = tracked.filter((f) => isText(f) && f !== SELF && f !== 'package.json')
    const personal = /\+?1?[ (.-]*\d{3}[ ).-]+\d{3}[ .-]+\d{4}\b|[\w.+-]+@gmail\.com/
    const leaks = files.filter((f) => personal.test(read(f).replaceAll(links.email, '')))
    expect(leaks, 'Only links.email may be published').toEqual([])
  })
})
