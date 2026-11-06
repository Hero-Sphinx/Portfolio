// The jagged shape of the gold spark that follows the cursor. Pure maths, so it can be tested without a browser.

export interface SparkPoint {
  x: number
  y: number
}

/** Bends a straight line into a lightning shape: each middle point is pushed sideways, ending exactly where it should. */
export function jaggedPath(from: SparkPoint, to: SparkPoint, rand: () => number, steps = 4, spread = 0.32): SparkPoint[] {
  const dx = to.x - from.x
  const dy = to.y - from.y
  const length = Math.hypot(dx, dy) || 1
  const normal = { x: -dy / length, y: dx / length }
  const path: SparkPoint[] = [from]
  for (let i = 1; i < steps; i++) {
    const t = i / steps
    const push = (rand() - 0.5) * 2 * length * spread
    path.push({ x: from.x + dx * t + normal.x * push, y: from.y + dy * t + normal.y * push })
  }
  path.push(to)
  return path
}

/** A short fork leaving a point at a random angle, like a small branch off the main bolt. */
export function forkFrom(start: SparkPoint, rand: () => number, reach = 26): SparkPoint[] {
  const angle = rand() * Math.PI * 2
  const end = { x: start.x + Math.cos(angle) * reach, y: start.y + Math.sin(angle) * reach }
  return jaggedPath(start, end, rand, 3)
}
