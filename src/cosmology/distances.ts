import Decimal from 'decimal.js'
import { HALF, MINUSONE, ONE, SPEED_OF_LIGHT } from '@/constants'
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
 */
export function getComovingRadialDistance (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number): MegaParsec {
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => ONE.dividedBy(a.mul(adot)))
  return (SPEED_OF_LIGHT.dividedBy(H0)).mul(DCMR)
}

/**
 * Tangential comoving distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number}
 */
export function getTangentialComovingDistance (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number): Decimal {
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => ONE.dividedBy(a.mul(adot)))
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)
  const x = Decimal.sqrt(Decimal.abs(omegaK)).mul(DCMR)
  if (x.greaterThan(0.1)) {
    const ratio = (omegaK.greaterThan(0)) ?
      HALF.mul(Decimal.exp(x).minus(Decimal.exp(MINUSONE.mul(x)))).dividedBy(x) :
      Decimal.sin(x).dividedBy(x)
    return ratio.mul(DCMR)
  } else {
    let y = x.pow(2)
    // statement below fixed 13-Aug-03 to correct sign error in expansion
    if (omegaK.lessThan(0)) {
      y = MINUSONE.mul(y)
    }
    const ratio = ONE.plus(y.dividedBy(6)).plus(y.pow(2).dividedBy(120))
    return ratio.mul(DCMR)
  }
}

/**
 * Angular size distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 */
export function getAngularSizeDistance (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number): MegaParsec {
  const az = ONE.dividedBy(ONE.plus(z))
  const DA = az.mul(getTangentialComovingDistance(H0, omegaMat, omegaVac, z))
  return (SPEED_OF_LIGHT.dividedBy(H0)).mul(DA)
}

/**
 * Angular size scale
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {number} Megaparsec / arcsecond
 */
export function getAngularSizeScale (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number): KiloparsecPerArcsecond {
  const DA_Mpc = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  return DA_Mpc.dividedBy(206.264806) // to get kpc instead of MPC
}

/**
 * Luminosity distance
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {MegaParsec}
 */
export function getLuminosityDistance (H0: KilometerPerSecondPerMegaParsec | number, omegaMat: Decimal | number, omegaVac: Decimal | number, z: Decimal | number): MegaParsec {
  const az = ONE.dividedBy(ONE.plus(z))
  const DA = getAngularSizeDistance(H0, omegaMat, omegaVac, z)
  return DA.dividedBy(az.pow(2))
}
