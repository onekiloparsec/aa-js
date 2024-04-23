import { KilometerPerSecondPerMegaParsec } from '@/types'
import { getOmegaK, getOmegaR } from './omegas'

export const INTEGRAL_POINTS_NUMBER = 2000
export const Tyr = 977.8 // coefficient for converting 1/H into Gyr

export function getADot (a: number, omegaK: number, omegaMat: number, omegaR: number, omegaVac: number): number {
  return Math.sqrt(omegaK + omegaMat / a + omegaR / (a * a) + omegaVac / (a * a))
}

export type AccumulatorFunction = (a: number, adot: number) => number

export function getDCMRIntegral (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number, accumulator: AccumulatorFunction): number {
  const az = 1 / (1 + z)
  const omegaR = getOmegaR(H0)
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)
  
  let value = 0
  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az + (1 - az) * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = getADot(a, omegaK, omegaMat, omegaR, omegaVac)
    value += accumulator(a, adot)
  }
  
  value = (1 - az) * value / INTEGRAL_POINTS_NUMBER
  return value
}
