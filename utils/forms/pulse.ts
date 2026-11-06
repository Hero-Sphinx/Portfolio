import type { FormPoint, Rand } from '../shapes'

/** One beat of an ECG trace, x from 0 to 1: P wave, QRS spike, T wave. */
export function ecg(x: number): number {
  const bump = (centre: number, width: number, height: number) => height * Math.exp(-(((x - centre) / width) ** 2))
  return bump(0.2, 0.05, 0.16) + bump(0.4, 0.012, -0.2) + bump(0.44, 0.014, 1.2) + bump(0.48, 0.014, -0.36) + bump(0.68, 0.07, 0.3)
}

/** Samples three beats by arc length; sampling by x would leave the near-vertical spike almost empty. */
export function pulseSampler(): (rand: Rand) => FormPoint {
  const steps = 2400
  const beats = 3
  const width = 6.4
  const xs: number[] = []
  const ys: number[] = []
  const lengths: number[] = [0]
  for (let i = 0; i <= steps; i++) {
    const u = i / steps
    xs.push((u - 0.5) * width)
    ys.push(ecg((u * beats) % 1) * 1.05 - 0.2)
    if (i > 0) lengths.push(lengths[i - 1]! + Math.hypot(xs[i]! - xs[i - 1]!, ys[i]! - ys[i - 1]!))
  }
  const total = lengths[steps]!
  return (rand) => {
    const target = rand() * total
    let lo = 0
    let hi = steps
    while (lo < hi) {
      const mid = (lo + hi) >> 1
      if (lengths[mid]! < target) lo = mid + 1
      else hi = mid
    }
    const jitter = () => (rand() - 0.5) * 0.05
    const y = ys[lo]!
    return { p: [xs[lo]! + jitter(), y + jitter(), jitter() * 2], tone: Math.abs(y) > 0.5 ? 0.9 : rand() * 0.2 }
  }
}
