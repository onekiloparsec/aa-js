import { KilometerPerSecondPerMegaParsec } from '@/types'


/**
 * Omega R (radiation), the ratio of the density of the Universe to the critical density.
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @returns {number}
 * @memberof module:Cosmology
 */
export function getOmegaR (H0: KilometerPerSecondPerMegaParsec): number {
  const h = H0 / 100
  return 4.165E-5 / (h * h)	// includes 3 massless neutrino species, T0 = 2.72528
}

/**
 * Omega K (curvature) = 1-Omega(total)
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega M (matter)
 * @param {number} omegaVac Omega Vac (vacuum)
 * @returns {number}
 * @memberof module:Cosmology
 */
export function getOmegaK (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number): number {
  const omegaR = getOmegaR(H0)
  return 1 - omegaMat - omegaR - omegaVac
}
