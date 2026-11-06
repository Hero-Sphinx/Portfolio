import type { FormPoint, Rand } from '../shapes'

const HEIGHT = 3.6
const TURNS = 9.5
const RADIUS = 0.68
const RUNGS = 34

/** A DNA double helix: two emerald strands joined by gold base pairs. */
export function helixPoint(rand: Rand): FormPoint {
  if (rand() < 0.7) {
    const t = rand()
    const a = t * TURNS + (rand() < 0.5 ? 0 : Math.PI)
    const jitter = () => (rand() - 0.5) * 0.06
    return { p: [Math.cos(a) * RADIUS + jitter(), (t - 0.5) * HEIGHT + jitter(), Math.sin(a) * RADIUS + jitter()], tone: rand() * 0.2 }
  }
  const t = (Math.floor(rand() * RUNGS) + 0.5) / RUNGS
  const a = t * TURNS
  const s = rand() * 2 - 1
  return { p: [Math.cos(a) * RADIUS * s, (t - 0.5) * HEIGHT, Math.sin(a) * RADIUS * s], tone: 0.7 + rand() * 0.3 }
}
