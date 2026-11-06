// Point clouds for the 3D scene. Pure maths with a seeded random generator, so every visit draws the same shape and
// the code can be unit tested without a browser.

type Rand = () => number
type Point = [number, number, number]

// mulberry32: small, fast and deterministic.
export function seededRandom(seed: number): Rand {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function onSphere(rand: Rand): Point {
  const u = rand() * 2 - 1
  const theta = rand() * Math.PI * 2
  const s = Math.sqrt(1 - u * u)
  return [s * Math.cos(theta), u, s * Math.sin(theta)]
}

// Near zero along the grooves of the cortex. Warping one sine with another gives the winding folds of real gyri.
function fold(x: number, y: number, z: number): number {
  const a = Math.sin(x * 5.5 + 2.1 * Math.sin(z * 4 + y * 3))
  const b = Math.sin(z * 6.5 + 2.4 * Math.sin(y * 5 - x * 2))
  return Math.abs(a + b) / 2
}

function cerebrum(rand: Rand): Point {
  for (;;) {
    const [sx, sy, sz] = onSphere(rand)
    const side = rand() < 0.5 ? -1 : 1
    const surface = rand() < 0.94
    const depth = surface ? 1 : 0.55 + rand() * 0.4
    let y = sy * 0.8 * depth
    const z = sz * 1.16 * depth
    if (y < 0) y *= 0.74 // flatter underside
    y += 0.1 * (1 - (z / 1.16) ** 2) // higher crown
    const x = side * (Math.abs(sx) * 0.8 * depth + 0.05) // the gap between the hemispheres
    if (surface && fold(x, y, z) < 0.36 && rand() < 0.96) continue // leave the grooves dark
    return [x, y, z]
  }
}

function cerebellum(rand: Rand): Point {
  for (;;) {
    const [sx, sy, sz] = onSphere(rand)
    const y = -0.56 + sy * 0.26
    if (Math.sin(y * 62) < -0.25 && rand() < 0.85) continue // the fine horizontal ridges
    return [sx * 0.5, y, -0.74 + sz * 0.36]
  }
}

function brainStem(rand: Rand): Point {
  const t = rand()
  const a = rand() * Math.PI * 2
  const r = 0.14 - t * 0.04
  return [Math.cos(a) * r, -0.42 - t * 0.72, -0.36 - t * 0.2 + Math.sin(a) * r]
}

/** A brain seen with +z as the front: folded cerebrum, ridged cerebellum and brain stem. */
export function brainPoints(count: number, seed = 7): Point[] {
  const rand = seededRandom(seed)
  return Array.from({ length: count }, () => {
    const pick = rand()
    if (pick < 0.83) return cerebrum(rand)
    return pick < 0.95 ? cerebellum(rand) : brainStem(rand)
  })
}
