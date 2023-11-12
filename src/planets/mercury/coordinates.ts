import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinatesH, JulianDay, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianMillenium } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'
import {
  g_B0MercuryCoefficients,
  g_B1MercuryCoefficients,
  g_B2MercuryCoefficients,
  g_B3MercuryCoefficients,
  g_B4MercuryCoefficients,
  g_L0MercuryCoefficients,
  g_L1MercuryCoefficients,
  g_L2MercuryCoefficients,
  g_L3MercuryCoefficients,
  g_L4MercuryCoefficients,
  g_L5MercuryCoefficients,
  g_R0MercuryCoefficients,
  g_R1MercuryCoefficients,
  g_R2MercuryCoefficients,
  g_R3MercuryCoefficients
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Mercury
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const L0 = g_L0MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L1 = g_L1MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L2 = g_L2MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L3 = g_L3MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L4 = g_L4MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L5 = g_L5MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  const value = (L0
      .plus(L1.mul(rho))
      .plus(L2.mul(rho.pow(2)))
      .plus(L3.mul(rho.pow(3)))
      .plus(L4.mul(rho.pow(4)))
      .plus(L5.mul(rho.pow(5)))
  )
    .dividedBy(1e8)

  return fmod360(value.radiansToDegrees())
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Mercury
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const B0 = g_B0MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B1 = g_B1MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B2 = g_B2MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B3 = g_B3MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B4 = g_B4MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  const value = (B0
      .plus(B1.mul(rho))
      .plus(B2.mul(rho.pow(2)))
      .plus(B3.mul(rho.pow(3)))
      .plus(B4.mul(rho.pow(4)))
  )
    .dividedBy(1e8)

  return fmod90(value.radiansToDegrees())
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 * @memberof module:Mercury
 */
export function getRadiusVector (jd: JulianDay | number): AstronomicalUnit {
  const rho = getJulianMillenium(jd)

  const R0 = g_R0MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R1 = g_R1MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R2 = g_R2MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R3 = g_R3MercuryCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  return (R0
      .plus(R1.mul(rho))
      .plus(R2.mul(rho.pow(2)))
      .plus(R3.mul(rho.pow(3)))
  )
    .dividedBy(1e8)
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Mercury
 */
export function getEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

/**
 * Heliocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @returns {EquatorialCoordinatesH}
 * @memberof module:Mercury
 */
export function getEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinatesH {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}

