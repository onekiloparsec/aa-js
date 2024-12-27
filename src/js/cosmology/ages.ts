import { GYr, KilometerPerSecondPerMegaParsec } from '@/js/types'
import { getDCMRIntegral, INTEGRAL_POINTS_NUMBER, Tyr } from './utils'
import { getOmegaK, getOmegaR } from './omegas'


/**
 * The age of the universe
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat
 * @param {number} omegaVac
 * @returns {GYr}
 * @memberof module:Cosmology
 */
export function getUniverseAge (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number): GYr {
  let az = 1.0
  let omegaR = getOmegaR(H0)
  let omegaK = getOmegaK(H0, omegaMat, omegaVac)
  
  let age = 0
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = Math.sqrt(omegaK + (omegaMat / a) + (omegaR / (a * a)) + (omegaVac * a * a))
    age = age + 1 / adot
  }
  age = age / INTEGRAL_POINTS_NUMBER
  
  return age * (Tyr / H0)
}

/**
 * The age of the universe at a given redshift
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 * @memberof module:Cosmology
 */
export function getUniverseAgeAtRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  let az = 1.0 / (1 + z)
  let WR = getOmegaR(H0)
  let WK = getOmegaK(H0, omegaMat, omegaVac)
  
  let age = 0
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az * (i + 0.5) / INTEGRAL_POINTS_NUMBER
    const adot = Math.sqrt(WK + (omegaMat / a) + (WR / (a * a)) + (omegaVac * a * a))
    age = age + 1 / adot
  }
  
  let zage = az * age / INTEGRAL_POINTS_NUMBER
  
  // correction for annihilations of particles not present now like e+/e-
  // added 13-Aug-03 based on T_vs_t.f
  var lpz = Math.log((1 + z)) / Math.log(10.0)
  var dzage = 0
  if (lpz > 7.500) dzage = 0.002 * (lpz - 7.500)
  if (lpz > 8.000) dzage = 0.014 * (lpz - 8.000) + 0.001
  if (lpz > 8.500) dzage = 0.040 * (lpz - 8.500) + 0.008
  if (lpz > 9.000) dzage = 0.020 * (lpz - 9.000) + 0.028
  if (lpz > 9.500) dzage = 0.019 * (lpz - 9.500) + 0.039
  if (lpz > 10.000) dzage = 0.048
  if (lpz > 10.775) dzage = 0.035 * (lpz - 10.775) + 0.048
  if (lpz > 11.851) dzage = 0.069 * (lpz - 11.851) + 0.086
  if (lpz > 12.258) dzage = 0.461 * (lpz - 12.258) + 0.114
  if (lpz > 12.382) dzage = 0.024 * (lpz - 12.382) + 0.171
  if (lpz > 13.055) dzage = 0.013 * (lpz - 13.055) + 0.188
  if (lpz > 14.081) dzage = 0.013 * (lpz - 14.081) + 0.201
  if (lpz > 15.107) dzage = 0.214
  
  // Gyr
  return (Tyr / H0) * zage * Math.pow(10.0, dzage)
}

/**
 * The light travel time
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 * @memberof module:Cosmology
 */
export function getLightTravelTime (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  // Different func, ignoring a!
  const DTT = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => 1 / adot)
  return (Tyr / H0) * DTT
}
