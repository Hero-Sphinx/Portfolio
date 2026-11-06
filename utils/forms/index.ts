import { brainPoint, seededRandom, type FormPoint, type Rand } from '../shapes'
import { eyePoint } from './eye'
import { helixPoint } from './helix'
import { latticeSampler } from './lattice'
import { pulseSampler } from './pulse'

export interface Forms {
  /** One xyz array per form, all the same length: brain, eye, pulse, helix, lattice. */
  positions: Float32Array[]
  /** One value per particle per form: 0 is emerald, 1 is gold. */
  tones: Float32Array[]
}

/** Particle `i` has a place in every form, which is what lets the cloud morph from one to the next. */
export function buildForms(count: number, seed = 7): Forms {
  const rand = seededRandom(seed)
  const samplers: ((r: Rand) => FormPoint)[] = [brainPoint, eyePoint, pulseSampler(), helixPoint, latticeSampler(rand)]
  const positions = samplers.map(() => new Float32Array(count * 3))
  const tones = samplers.map(() => new Float32Array(count))
  samplers.forEach((sample, s) => {
    for (let i = 0; i < count; i++) {
      const { p, tone } = sample(rand)
      positions[s]!.set(p, i * 3)
      tones[s]![i] = tone
    }
  })
  return { positions, tones }
}
