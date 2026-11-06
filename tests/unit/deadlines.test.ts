import { describe, expect, it } from 'vitest'
import { en } from '~/data/content'
import { fr } from '~/data/content.fr'
import { extractDeadlines, monthViews } from '~/utils/deadlines'

const YEAR = 2026

describe('extractDeadlines', () => {
  it('reads the formats outlines really use', () => {
    const text = ['Essay due October 15', 'Quiz: Oct 3rd', 'Lab report due Nov. 2', 'Exam on Dec 5, 2027', 'Devoir à remettre le 14 novembre', 'Examen : 1er décembre'].join('\n')
    expect(extractDeadlines(text, YEAR).map((d) => [d.title, d.year, d.month, d.day])).toEqual([
      ['Quiz', 2026, 9, 3],
      ['Essay', 2026, 9, 15],
      ['Lab report', 2026, 10, 2],
      ['Devoir', 2026, 10, 14],
      ['Examen', 2026, 11, 1],
      ['Exam', 2027, 11, 5],
    ])
  })

  it('ignores lines with no date, and numbers that are not dates', () => {
    expect(extractDeadlines('Week 3 reading\nWorth 20% of your grade\nRoom 305', YEAR)).toEqual([])
  })

  it('rejects dates that do not exist', () => {
    expect(extractDeadlines('Paper due February 30\nTest on April 31', YEAR)).toEqual([])
  })

  it('does not mistake a longer word for a month', () => {
    expect(extractDeadlines('Marketing 12 slides\nDecide 5 topics', YEAR)).toEqual([])
  })

  it('removes exact repeats but keeps different items on one day', () => {
    const found = extractDeadlines('Quiz: May 4\nQuiz: May 4\nLab: May 4', YEAR)
    expect(found.map((d) => d.title)).toEqual(['Quiz', 'Lab'])
  })

  it('handles a line that is only a date', () => {
    expect(extractDeadlines('October 15', YEAR)[0]).toMatchObject({ title: '', month: 9, day: 15 })
  })

  it('finds all six deadlines in both sample outlines', () => {
    expect(extractDeadlines(en.outline.sample, YEAR)).toHaveLength(6)
    expect(extractDeadlines(fr.outline.sample, YEAR)).toHaveLength(6)
  })
})

describe('monthViews', () => {
  it('groups by month in order and lays each month out correctly', () => {
    const views = monthViews(extractDeadlines('A: Feb 3\nB: Feb 20\nC: Mar 1', YEAR))
    expect(views).toHaveLength(2)
    expect(views[0]).toMatchObject({ month: 1, days: 28, offset: 0 }) // Feb 1, 2026 is a Sunday
    expect([...views[0]!.marked]).toEqual([3, 20])
    expect(views[1]).toMatchObject({ month: 2, days: 31 })
  })

  it('knows about leap years', () => {
    expect(monthViews(extractDeadlines('A: Feb 29, 2028', YEAR))[0]!.days).toBe(29)
  })
})
