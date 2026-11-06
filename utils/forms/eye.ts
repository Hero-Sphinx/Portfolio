import { onSphere, type FormPoint, type Rand } from '../shapes'

const RADIUS = 1.25
const PUPIL = 0.36 * RADIUS * 0.72

/** An eye facing the camera: iris fibres, a gold rim around the pupil and a faint globe behind. */
export function eyePoint(rand: Rand): FormPoint {
  const pick = rand()
  if (pick < 0.62) {
    const angle = (Math.floor(rand() * 150) / 150) * Math.PI * 2 + (rand() - 0.5) * 0.012
    const t = rand()
    const r = PUPIL + 0.5 * t * RADIUS * 0.72
    const a = angle + 0.03 * Math.sin(angle * 9 + t * 7)
    return { p: [Math.cos(a) * r, Math.sin(a) * r, 0.86 - t * 0.14], tone: t < 0.3 ? 0.85 : t * 0.2 }
  }
  if (pick < 0.72) {
    const a = rand() * Math.PI * 2
    const r = PUPIL + (rand() - 0.5) * 0.02
    return { p: [Math.cos(a) * r, Math.sin(a) * r, 0.88], tone: 1 }
  }
  for (;;) {
    const [x, y, z] = onSphere(rand)
    if (z > 0.62) continue // leave the front open for the iris
    return { p: [x * RADIUS, y * RADIUS, z * RADIUS], tone: rand() * 0.15 }
  }
}
