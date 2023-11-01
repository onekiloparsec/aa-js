import Decimal from '@/decimal'
import { KilometerPerSecondPerMegaParsec } from '@/types'
import { ONE } from '@/constants'


/**
 * Omega R (radiation), the ratio of the density of the Universe to the critical density.
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @returns {number}
 */
export function getOmegaR (H0: KilometerPerSecondPerMegaParsec | number): Decimal {
  const h = new Decimal(H0).dividedBy(100)
  return new Decimal(4.165E-5).dividedBy(h.pow(2))	// includes 3 massless neutrino species, T0 = 2.72528
}

/**
 * Omega K (curvature) = 1-Omega(total)
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega M (matter)
 * @param {number} omegaVac Omega Vac (vacuum)
 * @returns {number}
 */
export function getOmegaK (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number): Decimal {
  const omegaR = getOmegaR(H0)
  return ONE.minus(omegaMat).minus(omegaR).minus(omegaVac)
}
