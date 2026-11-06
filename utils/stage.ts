// Maps scrolling to the 3D scene: which form the particles hold, and where that form sits on screen.

/** The section where each form is complete: brain, eye, pulse, helix, lattice, then the brain again. */
export const STAGE_SECTIONS = ['top', 'research', 'triage', 'experience', 'skills', 'contact'] as const

export interface Pose {
  /** Horizontal position as a fraction of the half screen width: -1 is the left edge, 1 the right. */
  x: number
  /** Vertical position as a fraction of the half screen height. */
  y: number
  scale: number
  opacity: number
  /** Resting rotation in radians. */
  rotY: number
  rotZ: number
  /** How far the form sways around its resting angle; 0 keeps it facing the viewer. */
  sway: number
}

const pose = (x: number, y: number, scale: number, opacity: number, rotY = 0, rotZ = 0, sway = 0): Pose => ({
  x, y, scale, opacity, rotY, rotZ, sway,
})

export const WIDE_POSES: Pose[] = [
  pose(0.46, 0, 1, 1, -1.25, 0, 0.5), // brain, beside the hero copy
  pose(-0.56, -0.16, 1.1, 0.38, 0.38, 0, 0.14), // eye, beside the simulator card
  pose(0, -0.1, 0.92, 0.26), // pulse, faint so it never fights the text
  pose(0.74, 0, 0.9, 0.55, 1.2, 0.32, 1.4), // helix
  pose(0.64, 0.42, 0.8, 0.5, 0.6, 0.2, 1), // lattice, in the open corner above the cards
  pose(0, 0, 1, 0.45, -1.25, 0, 0.5), // brain, behind the contact panel
]

export const NARROW_POSES: Pose[] = [
  pose(0, 0.3, 1, 0.5, -1.25, 0, 0.5),
  pose(0.15, 0.3, 0.8, 0.36, -0.38, 0, 0.14),
  pose(0, 0, 0.5, 0.2),
  pose(0.5, 0, 0.8, 0.32, 1.2, 0.32, 1.4),
  pose(0, 0, 0.8, 0.28, 0.6, 0.2, 1),
  pose(0, 0.2, 0.95, 0.38, -1.25, 0, 0.5),
]

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (t: number) => t * t * (3 - 2 * t)

/**
 * Turns scroll position into a stage number. `anchors` holds the scroll offset where each form is complete, and a
 * whole number means a form at rest. Each form holds for the first part of the gap, then morphs into the next.
 */
export function stageAt(scrollY: number, anchors: number[], hold = 0.5): number {
  const last = anchors.length - 1
  if (last < 1 || scrollY <= anchors[0]!) return 0
  if (scrollY >= anchors[last]!) return last
  let i = 0
  while (i < last - 1 && scrollY >= anchors[i + 1]!) i++
  const span = anchors[i + 1]! - anchors[i]!
  const local = span > 0 ? (scrollY - anchors[i]!) / span : 1
  return i + smooth(clamp01((local - hold) / (1 - hold)))
}

/** Anchors must rise and stay reachable, even when the last section is too short to scroll to mid-screen. */
export function normaliseAnchors(raw: number[], maxScroll: number): number[] {
  const out: number[] = []
  raw.forEach((value, i) => {
    out.push(Math.max(i === 0 ? 0 : out[i - 1]!, Math.min(value, maxScroll)))
  })
  return out
}

export function poseAt(poses: Pose[], stage: number): Pose {
  const i = Math.max(0, Math.min(poses.length - 2, Math.floor(stage)))
  const t = clamp01(stage - i)
  const a = poses[i]!
  const b = poses[i + 1]!
  const mix = (key: keyof Pose) => a[key] + (b[key] - a[key]) * t
  return {
    x: mix('x'), y: mix('y'), scale: mix('scale'), opacity: mix('opacity'),
    rotY: mix('rotY'), rotZ: mix('rotZ'), sway: mix('sway'),
  }
}
