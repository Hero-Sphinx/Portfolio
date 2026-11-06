// A small browser version of OutlineOwl's idea: find dated items in the text of a course outline.
// Handles "October 15", "Oct 15th", "15 octobre" and an optional year. It reads text only, unlike the real app, and
// finds the Area of Concentration from words like "covers" or "topics:", where the real app asks AI.

export interface Deadline {
  title: string
  /** What the item covers: where to concentrate. Empty when the line doesn't say. */
  focus: string
  year: number
  /** 0 to 11 */
  month: number
  day: number
}

const MONTH_WORDS: [string, number][] = [
  ['january', 0], ['janvier', 0], ['jan', 0],
  ['february', 1], ['février', 1], ['fevrier', 1], ['feb', 1], ['fév', 1], ['fev', 1],
  ['march', 2], ['mars', 2], ['mar', 2],
  ['april', 3], ['avril', 3], ['apr', 3], ['avr', 3],
  ['may', 4], ['mai', 4],
  ['june', 5], ['juin', 5], ['jun', 5],
  ['july', 6], ['juillet', 6], ['jul', 6],
  ['august', 7], ['août', 7], ['aout', 7], ['aug', 7],
  ['september', 8], ['septembre', 8], ['sept', 8], ['sep', 8],
  ['october', 9], ['octobre', 9], ['oct', 9],
  ['november', 10], ['novembre', 10], ['nov', 10],
  ['december', 11], ['décembre', 11], ['decembre', 11], ['dec', 11], ['déc', 11],
]

const MONTHS = new Map(MONTH_WORDS)
const NAMES = MONTH_WORDS.map(([word]) => word).join('|')
const MONTH_FIRST = new RegExp(`(?<!\\p{L})(${NAMES})\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?!\\d)(?:,?\\s+(\\d{4}))?`, 'iu')
const DAY_FIRST = new RegExp(`(?<![\\p{L}\\d])(\\d{1,2})(?:er|st|nd|rd|th)?\\s+(${NAMES})(?!\\p{L})\\.?(?:,?\\s+(\\d{4}))?`, 'iu')
const FOCUS = /\(?\s*(?<!\p{L})(?:covers?|covering|topics?|focus(?:es)? on|porte sur|portant sur|sujets?|thèmes?)(?!\p{L})\s*:?\s*([^()]+)\)?/iu
const TRAILING = /\s*(?:due(?:\s+(?:on|by))?|on|by|à remettre le|le|[:,–—-])\s*$/iu

function isRealDate(year: number, month: number, day: number): boolean {
  const date = new Date(year, month, day)
  return date.getMonth() === month && date.getDate() === day
}

function cleanTitle(text: string): string {
  let title = text.trim()
  let previous = ''
  while (title !== previous) {
    previous = title
    title = title.replace(TRAILING, '').replace(/^[:,–—-]\s*/, '').trim()
  }
  return title
}

function readLine(line: string, defaultYear: number): Deadline | null {
  const first = MONTH_FIRST.exec(line)
  const second = DAY_FIRST.exec(line)
  const match = first && (!second || first.index <= second.index) ? first : second
  if (!match) return null

  const monthFirst = match === first
  const monthWord = (monthFirst ? match[1] : match[2])!.toLowerCase()
  const day = Number(monthFirst ? match[2] : match[1])
  const year = match[3] ? Number(match[3]) : defaultYear
  const month = MONTHS.get(monthWord)
  if (month === undefined || !isRealDate(year, month, day)) return null

  const rest = `${line.slice(0, match.index)} ${line.slice(match.index + match[0].length)}`
  const covered = FOCUS.exec(rest)
  const focus = covered ? covered[1]!.trim().replace(/[.;,]$/, '') : ''
  const title = cleanTitle(covered ? rest.replace(covered[0], ' ') : rest)
  return { title, focus, year, month, day }
}

/** Every dated line, soonest first, with exact repeats removed. */
export function extractDeadlines(text: string, defaultYear: number): Deadline[] {
  const seen = new Set<string>()
  const found: Deadline[] = []
  for (const line of text.split(/\r?\n/).slice(0, 200)) {
    const deadline = readLine(line, defaultYear)
    if (!deadline) continue
    const key = `${deadline.year}-${deadline.month}-${deadline.day}-${deadline.title.toLowerCase()}`
    if (seen.has(key)) continue
    seen.add(key)
    found.push(deadline)
  }
  return found.sort((a, b) => a.year - b.year || a.month - b.month || a.day - b.day)
}

export interface MonthView {
  year: number
  month: number
  /** Blank cells before the 1st, for a week starting on Sunday. */
  offset: number
  days: number
  marked: Set<number>
}

/** One calendar per month that has a deadline, in order. */
export function monthViews(deadlines: Deadline[]): MonthView[] {
  const views = new Map<string, MonthView>()
  for (const { year, month, day } of deadlines) {
    const key = `${year}-${month}`
    const view = views.get(key) ?? {
      year,
      month,
      offset: new Date(year, month, 1).getDay(),
      days: new Date(year, month + 1, 0).getDate(),
      marked: new Set<number>(),
    }
    view.marked.add(day)
    views.set(key, view)
  }
  return [...views.values()]
}
