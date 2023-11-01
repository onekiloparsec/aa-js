import Decimal from '@/decimal'
import { MINUSONE, ONE, PI, SPEED_OF_LIGHT } from '@/constants'
import { GigaParsec3, KilometerPerSecondPerMegaParsec } from '@/types'
import { getDCMRIntegral } from './utils'
import { getOmegaK } from './omegas'

/**
 * Comoving volume
 * @param {number} omegaK Omega Curvature (= 1 - Omega Total)
 * @param {number} DCMR
 * @returns {GigaParsec3}
 */
export function getComovingVolume (omegaK: Decimal | number, DCMR: Decimal | number): GigaParsec3 {
  const x = Decimal.sqrt(Decimal.abs(omegaK)).mul(DCMR)
  if (x.greaterThan(0.1)) {
    const ratio = (new Decimal(omegaK).greaterThan(0)) ?
      (new Decimal(0.125).mul(Decimal.exp(x.mul(2)).minus(Decimal.exp(x.mul(-2)))).minus(x.dividedBy(2))).dividedBy(x.pow(3).dividedBy(3)) :
      (x.dividedBy(2).minus(Decimal.sin(x.mul(2)).dividedBy(4))).dividedBy(x.pow(3).dividedBy(3))
    return ratio.mul(new Decimal(DCMR).pow(3)).dividedBy(3)
  } else {
    let y = x.pow(2)
    // statement below fixed 13-Aug-03 to correct sign error in expansion
    if (new Decimal(omegaK).lessThan(0)) {
      y = MINUSONE.mul(y)
    }
    const ratio = ONE.plus(y.dividedBy(5)).plus(new Decimal(2 / 105).mul(y.pow(2)))
    return ratio.mul(new Decimal(DCMR).pow(3)).dividedBy(3)
  }
}

/**
 *
 * @param {KilometerPerSecondPerMegaParsec} H0 The Hubble constant
 * @param {number} omegaMat Omega Matter
 * @param {number} omegaVac Omega Vacuum
 * @param {number} z The redshift
 * @returns {GigaParsec3}
 */
export function getComovingVolumeWithinRedshift (H0: KilometerPerSecondPerMegaParsec, omegaMat: number, omegaVac: number, z: number): GigaParsec3 {
  const omegaK = getOmegaK(H0, omegaMat, omegaVac)
  const DCMR = getDCMRIntegral(H0, omegaMat, omegaVac, z, (a, adot) => ONE.dividedBy(a.mul(adot)))
  const VCM = getComovingVolume(omegaK, DCMR)

  // Gpc^3
  return new Decimal(4)
    .mul(PI)
    .mul(Decimal.pow(new Decimal(0.001).mul(SPEED_OF_LIGHT).dividedBy(H0), 3))
    .mul(VCM)
}
