import { describe, expect, it } from 'vitest'
import { electrodeLayout, quantise, sampleBrightness } from '~/utils/phosphene'
import { DEMO_LIMITS, isCritical } from '~/utils/triage'

describe('electrodeLayout', () => {
  it('returns the requested count inside the visual field', () => {
    const layout = electrodeLayout(500)
    expect(layout).toHaveLength(500)
    for (const e of layout) expect(Math.hypot(e.x, e.y)).toBeLessThanOrEqual(1)
  })

  it('samples the centre of vision more densely than the edge', () => {
    const layout = electrodeLayout(1000)
    const centre = layout.filter((e) => Math.hypot(e.x, e.y) < 0.5).length
    const centreArea = 0.25 // of the disc
    expect(centre / 1000).toBeGreaterThan(centreArea)
  })

  it('makes each dot smaller as electrodes increase', () => {
    expect(electrodeLayout(1000)[0]!.radius).toBeLessThan(electrodeLayout(60)[0]!.radius)
  })
})

describe('sampleBrightness', () => {
  const size = 16
  const pixels = new Uint8ClampedArray(size * size * 4)
  for (let y = 0; y < size; y++) {
    for (let x = size / 2; x < size; x++) pixels[(y * size + x) * 4] = 255 // right half white
  }

  it('reads bright and dark regions', () => {
    expect(sampleBrightness(pixels, size, 0.6, 0, 0.2)).toBe(1)
    expect(sampleBrightness(pixels, size, -0.6, 0, 0.2)).toBe(0)
  })

  it('returns 0 outside the image', () => {
    expect(sampleBrightness(pixels, size, 5, 5, 0.1)).toBe(0)
  })
})

describe('quantise', () => {
  it('snaps to a few levels and clamps', () => {
    expect(quantise(0.1)).toBe(0)
    expect(quantise(0.4)).toBeCloseTo(1 / 3)
    expect(quantise(2)).toBe(1)
    expect(quantise(-1)).toBe(0)
  })
})

describe('isCritical', () => {
  it('leaves normal vitals on the normal route', () => {
    expect(isCritical({ heartRate: 78, oxygen: 98 })).toBe(false)
  })

  it('flags each limit, including exact boundaries', () => {
    expect(isCritical({ heartRate: DEMO_LIMITS.heartRateHigh, oxygen: 98 })).toBe(true)
    expect(isCritical({ heartRate: DEMO_LIMITS.heartRateHigh - 1, oxygen: 98 })).toBe(false)
    expect(isCritical({ heartRate: DEMO_LIMITS.heartRateLow, oxygen: 98 })).toBe(true)
    expect(isCritical({ heartRate: 78, oxygen: DEMO_LIMITS.oxygenLow - 1 })).toBe(true)
    expect(isCritical({ heartRate: 78, oxygen: DEMO_LIMITS.oxygenLow })).toBe(false)
  })
})
