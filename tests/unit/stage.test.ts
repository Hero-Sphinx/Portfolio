import { describe, expect, it } from 'vitest'
import { NARROW_POSES, STAGE_SECTIONS, WIDE_POSES, normaliseAnchors, poseAt, stageAt } from '~/utils/stage'

const anchors = [0, 1000, 2000, 3000, 4000, 5000]

describe('stageAt', () => {
  it('holds each form on whole numbers at its anchor', () => {
    anchors.forEach((y, i) => expect(stageAt(y, anchors)).toBe(i))
  })

  it('holds the form through the first half of the gap', () => {
    expect(stageAt(400, anchors)).toBe(0)
  })

  it('morphs through the second half and only ever moves forward', () => {
    expect(stageAt(750, anchors)).toBeCloseTo(0.5)
    let previous = 0
    for (let y = 0; y <= 5000; y += 25) {
      const stage = stageAt(y, anchors)
      expect(stage).toBeGreaterThanOrEqual(previous)
      previous = stage
    }
  })

  it('clamps beyond the ends', () => {
    expect(stageAt(-50, anchors)).toBe(0)
    expect(stageAt(9999, anchors)).toBe(5)
  })

  it('survives anchors that collapse onto one point', () => {
    expect(stageAt(100, [0, 0, 0, 0, 0, 0])).toBe(5)
  })
})

describe('normaliseAnchors', () => {
  it('keeps anchors rising and reachable', () => {
    expect(normaliseAnchors([0, 900, 700, 5000], 2000)).toEqual([0, 900, 900, 2000])
  })
})

describe('poseAt', () => {
  it('has a pose for every section on both layouts', () => {
    expect(WIDE_POSES).toHaveLength(STAGE_SECTIONS.length)
    expect(NARROW_POSES).toHaveLength(STAGE_SECTIONS.length)
  })

  it('returns exact poses at rest and blends between them', () => {
    expect(poseAt(WIDE_POSES, 1)).toEqual(WIDE_POSES[1])
    expect(poseAt(WIDE_POSES, 5)).toEqual(WIDE_POSES[5])
    const middle = poseAt(WIDE_POSES, 0.5)
    expect(middle.x).toBeCloseTo((WIDE_POSES[0]!.x + WIDE_POSES[1]!.x) / 2)
  })
})
