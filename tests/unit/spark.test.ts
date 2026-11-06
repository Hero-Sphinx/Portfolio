import { describe, expect, it } from 'vitest'
import { forkFrom, jaggedPath } from '~/utils/spark'
import { seededRandom } from '~/utils/shapes'

describe('jaggedPath', () => {
  const from = { x: 0, y: 0 }
  const to = { x: 100, y: 0 }

  it('starts and ends exactly on the cursor positions', () => {
    const path = jaggedPath(from, to, seededRandom(1))
    expect(path[0]).toEqual(from)
    expect(path.at(-1)).toEqual(to)
    expect(path).toHaveLength(5)
  })

  it('bends sideways, but stays within its spread', () => {
    const path = jaggedPath(from, to, seededRandom(2))
    const middle = path.slice(1, -1)
    expect(middle.some((p) => Math.abs(p.y) > 1)).toBe(true)
    for (const p of middle) expect(Math.abs(p.y)).toBeLessThanOrEqual(32)
  })

  it('survives a cursor that has not moved', () => {
    const path = jaggedPath(from, from, seededRandom(3))
    for (const p of path) {
      expect(Number.isFinite(p.x)).toBe(true)
      expect(Number.isFinite(p.y)).toBe(true)
    }
  })
})

describe('forkFrom', () => {
  it('leaves the given point and stays short', () => {
    const start = { x: 50, y: 50 }
    const fork = forkFrom(start, seededRandom(4))
    expect(fork[0]).toEqual(start)
    const end = fork.at(-1)!
    expect(Math.hypot(end.x - start.x, end.y - start.y)).toBeCloseTo(26)
  })
})
