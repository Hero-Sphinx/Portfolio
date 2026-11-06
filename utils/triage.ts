// The routing idea behind RoboDoc, in miniature. These thresholds exist for this demo only: they are not medical advice
// and are not RoboDoc's clinical rules.

export interface Vitals {
  heartRate: number
  oxygen: number
}

export const DEMO_LIMITS = { heartRateLow: 45, heartRateHigh: 130, oxygenLow: 90 }

/** Critical vitals take the urgent route, which never touches the AI. */
export function isCritical({ heartRate, oxygen }: Vitals): boolean {
  return heartRate <= DEMO_LIMITS.heartRateLow || heartRate >= DEMO_LIMITS.heartRateHigh || oxygen < DEMO_LIMITS.oxygenLow
}
