import { SPEED_OF_LIGHT } from '@/constants'
import { GigaParsec3, KilometerPerSecondPerMegaParsec } from '@/types'
import { getDCMRIntegral } from './utils'
import { getOmegaK } from './omegas'

/**
 * Comoving volume
 * @param {number} omegaK Omega Curvature (= 1 - Omega Total)
 * @param {number} DCMR
 * @returns {GigaParsec3}
 * @memberof module:Cosmology
 */
export function getComovingVolume (omegaK: number, DCMR: number): GigaParsec3 {
  const x = Math.sqrt(Math.abs(omegaK)) * DCMR
  if (x > 0.1) {
    const ratio = (omegaK > 0) ? (0.125 * (Math.exp(2 * x) - Math.exp(-2 * x)) - x / 2) / (x * x * x / 3) :
      (x / 2 - Math.sin(2 * x) / 4) / (x * x * x / 3)
    return ratio * DCMR * DCMR * DCMR / 3
  }
  
  let y = x * x
  // statement below fixed 13-Aug-03 to correct sign error in expansion
  if (omegaK < 0) {
    y = -y
  }
  const ratio = 1 + y / 5 + (2 / 105) * y * y
  return ratio * DCMR * DCMR * DCMR / 3
}

/**
 *
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GigaParsec3}
 * @memberof module:Cosmology
 */
export function getComovingVolumeWithinRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GigaParsec3 {
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => 1 / (a * adot))
  const VCM = getComovingVolume(omegaK, DCMR)
  // Gpc^3
  return 4 * Math.PI * Math.pow(0.001 * SPEED_OF_LIGHT / H0, 3) * VCM
}
