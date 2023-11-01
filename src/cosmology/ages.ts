import Decimal from '@/decimal'
import { HALF, ONE } from '@/constants'
import { GYr, KilometerPerSecondPerMegaParsec } from '@/types'
import { getADot, getDCMRIntegral, INTEGRAL_POINTS_NUMBER, Tyr } from './utils'
import { getOmegaK, getOmegaR } from './omegas'


/**
 * The age of the universe
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat
 * @param {number} omegaVac
 * @returns {GYr}
 */
export function getUniverseAge (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number): GYr {
  const az = new Decimal(1.0)
  const omegaR = getOmegaR(H0)
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)

  let age = new Decimal(0)
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az.mul(HALF.plus(i)).dividedBy(INTEGRAL_POINTS_NUMBER)
    const adot = getADot(a, omegaK, omegaMat, omegaR, omegaVac)
    age = age.plus(ONE.dividedBy(adot))
  }
  age = age.dividedBy(INTEGRAL_POINTS_NUMBER)
  return age.mul(Tyr.dividedBy(H0))
}

/**
 * The age of the universe at a given redshift
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 */
export function getUniverseAgeAtRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  const az = ONE.dividedBy(ONE.plus(z))
  const omegaR = getOmegaR(H0)
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)

  let age = new Decimal(0)
  for (let i = 0; i < INTEGRAL_POINTS_NUMBER; i++) {
    const a = az.mul(HALF.plus(i)).dividedBy(INTEGRAL_POINTS_NUMBER)
    const adot = getADot(a, omegaK, omegaMat, omegaR, omegaVac)
    age = age.plus(ONE.dividedBy(adot))
  }

  const zage = az.mul(age).dividedBy(INTEGRAL_POINTS_NUMBER)

  // correction for annihilations of particles not present now like e+/e-
  // added 13-Aug-03 based on T_vs_t.f
  const lpz = Decimal.log(ONE.plus(z)).dividedBy(Decimal.log(10.0))
  let dzage = new Decimal(0)
  if (lpz.greaterThan(7.500)) dzage = new Decimal(0.002).mul(lpz.minus(7.500))
  if (lpz.greaterThan(8.000)) dzage = new Decimal(0.014).mul(lpz.minus(8.000)).plus(0.001)
  if (lpz.greaterThan(8.500)) dzage = new Decimal(0.040).mul(lpz.minus(8.500)).plus(0.008)
  if (lpz.greaterThan(9.000)) dzage = new Decimal(0.020).mul(lpz.minus(9.000)).plus(0.028)
  if (lpz.greaterThan(9.500)) dzage = new Decimal(0.019).mul(lpz.minus(9.500)).plus(0.039)
  if (lpz.greaterThan(10.000)) dzage = new Decimal(0.048)
  if (lpz.greaterThan(10.775)) dzage = new Decimal(0.035).mul(lpz.minus(10.775)).plus(0.048)
  if (lpz.greaterThan(11.851)) dzage = new Decimal(0.069).mul(lpz.minus(11.851)).plus(0.086)
  if (lpz.greaterThan(12.258)) dzage = new Decimal(0.461).mul(lpz.minus(12.258)).plus(0.114)
  if (lpz.greaterThan(12.382)) dzage = new Decimal(0.024).mul(lpz.minus(12.382)).plus(0.171)
  if (lpz.greaterThan(13.055)) dzage = new Decimal(0.013).mul(lpz.minus(13.055)).plus(0.188)
  if (lpz.greaterThan(14.081)) dzage = new Decimal(0.013).mul(lpz.minus(14.081)).plus(0.201)
  if (lpz.greaterThan(15.107)) dzage = new Decimal(0.214)

  return Tyr.dividedBy(H0).mul(zage).mul(Decimal.pow(10.0, dzage))
}

/**
 * The light travel time
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GYr}
 */
export function getLightTravelTime (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GYr {
  // Different func, ignoring a!
  const DTT = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => ONE.dividedBy(adot))
  return Tyr.dividedBy(H0).mul(DTT)
}
