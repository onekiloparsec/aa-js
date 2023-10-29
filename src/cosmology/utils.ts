import Decimal from 'decimal.js'
import { KilometerPerSecondPerMegaParsec } from '@/types'
import { HALF, ONE } from '@/constants'
import { getOmegaK, getOmegaR } from './omegas'

export const INTEGRAL_POINTS_NUMBER = 2000
export const Tyr = new Decimal(977.8) // coefficient for converting 1/H into Gyr

export function getADot (a: Decimal, omegaK: Decimal, omegaMat: Decimal | number, omegaR: Decimal, omegaVac: Decimal | number): Decimal {
  return Decimal.sqrt(
    omegaK
      .plus(new Decimal(omegaMat).dividedBy(a))
      .plus(omegaR.dividedBy(a.pow(2)))
      .plus(new Decimal(omegaVac).mul(a.pow(2)))
  )
}

export type AccumulatorFunction = (a: Decimal, adot: Decimal) => Decimal

export function getDCMRIntegral (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number, accumulator: AccumulatorFunction): Decimal {
  const az = ONE.dividedBy(ONE.plus(z))
  const omegaR = getOmegaR(H0)
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)

  let value = new Decimal(0.0)
  // do integral over a=1/(1+z) from az to 1 in n steps, midpoint rule
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az.plus(
      (ONE.minus(az))
        .mul(HALF.plus(i))
        .dividedBy(INTEGRAL_POINTS_NUMBER)
    )

    const adot = Decimal.sqrt(
      omegaK
        .plus(new Decimal(omegaMat).dividedBy(a))
        .plus(omegaR.dividedBy(a.pow(2)))
        .plus(new Decimal(omegaVac).mul(a.pow(2)))
    )

    value = value.plus(accumulator(a, adot))
  }

  value = (ONE.minus(az)).mul(value).dividedBy(INTEGRAL_POINTS_NUMBER)
  return value
}
