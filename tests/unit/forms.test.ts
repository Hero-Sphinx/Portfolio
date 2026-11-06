import { describe, expect, it } from 'vitest'
import { buildForms } from '~/utils/forms'
import { ecg } from '~/utils/forms/pulse'
import { seededRandom } from '~/utils/shapes'

describe('seededRandom', () => {
  it('repeats for the same seed and stays in range', () => {
    const a = seededRandom(1)
    const b = seededRandom(1)
    for (let i = 0; i < 100; i++) {
      const value = a()
      expect(value).toBe(b())
      expect(value).toBeGreaterThanOrEqual(0)
      expect(value).toBeLessThan(1)
    }
  })
})

describe('buildForms', () => {
  const count = 3000
  const { positions, tones } = buildForms(count)

  it('gives every particle a place in all five forms', () => {
    expect(positions).toHaveLength(5)
    expect(tones).toHaveLength(5)
    for (const p of positions) expect(p).toHaveLength(count * 3)
    for (const t of tones) expect(t).toHaveLength(count)
  })

  it('produces only finite positions and tones between 0 and 1', () => {
    for (const p of positions) expect(p.every(Number.isFinite)).toBe(true)
    for (const t of tones) expect(t.every((v) => v >= 0 && v <= 1)).toBe(true)
  })

  it('keeps every form inside the camera view', () => {
    for (const p of positions) expect(Math.max(...p.map(Math.abs))).toBeLessThan(3.4)
  })

  it('is deterministic, so every visitor sees the same scene', () => {
    expect(buildForms(50, 3).positions[0]).toEqual(buildForms(50, 3).positions[0])
  })

  it('keeps a gap between the two brain hemispheres', () => {
    const brain = positions[0]!
    let onMidline = 0
    for (let i = 0; i < count; i++) {
      const inCortex = brain[i * 3 + 1]! > 0.1
      if (inCortex && Math.abs(brain[i * 3]!) < 0.04) onMidline++
    }
    expect(onMidline).toBe(0)
  })
})

describe('ecg', () => {
  it('peaks at the QRS spike', () => {
    expect(ecg(0.44)).toBeGreaterThan(1)
    expect(ecg(0.9)).toBeLessThan(0.05)
  })
})
