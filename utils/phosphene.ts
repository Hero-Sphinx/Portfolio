// Simplified prosthetic-vision maths: sample a picture at each electrode and show it as a soft dot of light.

export interface Electrode {
  /** Position in the visual field, from -1 to 1. */
  x: number
  y: number
  /** Dot radius in the same units. Larger away from the centre, as in the visual field's mapping onto V1. */
  radius: number
}

/**
 * Lays electrodes out on a sunflower spiral, crowded towards the centre of vision. The visual cortex gives far more
 * area to the centre of what we see, so a cortical implant samples the centre more finely than the edges.
 */
export function electrodeLayout(count: number): Electrode[] {
  const golden = Math.PI * (3 - Math.sqrt(5))
  const base = 1.1 / Math.sqrt(count)
  return Array.from({ length: count }, (_, i) => {
    const eccentricity = ((i + 0.5) / count) ** 0.72
    const angle = i * golden
    return {
      x: Math.cos(angle) * eccentricity,
      y: Math.sin(angle) * eccentricity,
      radius: base * (0.55 + eccentricity * 0.9),
    }
  })
}

/** Average brightness (0 to 1) of a greyscale image around a point. Pixels are RGBA, as canvas getImageData returns them. */
export function sampleBrightness(pixels: Uint8ClampedArray, size: number, x: number, y: number, radius: number): number {
  const cx = ((x + 1) / 2) * size
  const cy = ((y + 1) / 2) * size
  const r = Math.max(1, (radius / 2) * size)
  let total = 0
  let samples = 0
  for (let py = Math.floor(cy - r); py <= cy + r; py += 2) {
    for (let px = Math.floor(cx - r); px <= cx + r; px += 2) {
      if (px < 0 || py < 0 || px >= size || py >= size) continue
      total += pixels[(py * size + px) * 4]! / 255
      samples++
    }
  }
  return samples ? total / samples : 0
}

/** A stimulated electrode gives only a few distinguishable brightness levels. */
export function quantise(value: number, levels = 4): number {
  return Math.round(Math.min(1, Math.max(0, value)) * (levels - 1)) / (levels - 1)
}
