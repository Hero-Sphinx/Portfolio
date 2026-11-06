import { onSphere, type FormPoint, type Point, type Rand } from '../shapes'

const RADIUS = 1.42
const NODES = 96

/** A globe of connected nodes: particles gather at each node and run along the links to its nearest neighbours. */
export function latticeSampler(setup: Rand): (rand: Rand) => FormPoint {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const nodes: Point[] = Array.from({ length: NODES }, (_, i) => {
    const y = 1 - ((i + 0.5) / NODES) * 2
    const r = Math.sqrt(1 - y * y)
    return [Math.cos(golden * i) * r * RADIUS, y * RADIUS, Math.sin(golden * i) * r * RADIUS]
  })
  const links: [Point, Point][] = []
  for (const n of nodes) {
    const nearest = nodes
      .filter((m) => m !== n)
      .map((m) => ({ m, d: Math.hypot(n[0] - m[0], n[1] - m[1], n[2] - m[2]) }))
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
    for (const { m } of nearest) links.push([n, m])
  }
  const hubs = new Set(nodes.filter(() => setup() < 0.16))

  return (rand) => {
    if (rand() < 0.26) {
      const n = nodes[Math.floor(rand() * nodes.length)]!
      const [sx, sy, sz] = onSphere(rand)
      const k = 0.05 * rand()
      return { p: [n[0] + sx * k, n[1] + sy * k, n[2] + sz * k], tone: hubs.has(n) ? 1 : 0.1 }
    }
    const [a, b] = links[Math.floor(rand() * links.length)]!
    const t = rand()
    return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t], tone: rand() * 0.14 }
  }
}
