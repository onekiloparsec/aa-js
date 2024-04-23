import { SPEED_OF_LIGHT } from '@/constants'
import { KilometerPerSecondPerMegaParsec, KiloparsecPerArcsecond, MegaParsec } from '@/types'
import { getDCMRIntegral } from './utils'
import { getOmegaK } from './omegas'

/**
 * Comoving radial distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 * @memberof module:Cosmology
 */
export function getComovingRadialDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => 1 / (a * adot))
  return (SPEED_OF_LIGHT / H0) * DCMR
}

/**
 * Tangential comoving distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number}
 * @memberof module:Cosmology
 */
export function getTangentialComovingDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): number {
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => 1 / (a * adot))
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)
  const x = Math.sqrt(Math.abs(omegaK)) * DCMR
  
  if (x > 0.1) {
    const ratio = (omegaK > 0) ? 0.5 * (Math.exp(x) - Math.exp(-x)) / x : Math.sin(x) / x
    return ratio * DCMR
  }
  
  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (omegaK < 0) {
    y = -y
  }
  const ratio = 1 + y / 6 + y * y / 120
  return ratio * DCMR
  
}

/**
 * Angular size distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 * @memberof module:Cosmology
 */
export function getAngularSizeDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  const az = 1 / (1 + z)
  const DA = az * getTangentialComovingDistance(H0, omegaMat, omegaVac, z)
  return (SPEED_OF_LIGHT / H0) * DA
}

/**
 * Angular size scale
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number} Megaparsec / arcsecond
 * @memberof module:Cosmology
 */
export function getAngularSizeScale (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): KiloparsecPerArcsecond {
  const DA_Mpc = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  return DA_Mpc / 206.264806 // to get kpc instead of MPC
}

/**
 * Luminosity distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 * @memberof module:Cosmology
 */
export function getLuminosityDistance (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): MegaParsec {
  const az = 1 / (1 + z)
  const DA = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  return DA / (az * az)
}
