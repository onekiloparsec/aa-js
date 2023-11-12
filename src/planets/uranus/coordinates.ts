import Decimal from '@/decimal'
import {
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  EquatorialCoordinatesH,
  JulianDay,
  Obliquity
} from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianMillenium } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'
import {
  g_B0UranusCoefficients,
  g_B1UranusCoefficients,
  g_B2UranusCoefficients,
  g_B3UranusCoefficients,
  g_B4UranusCoefficients,
  g_L0UranusCoefficients,
  g_L1UranusCoefficients,
  g_L2UranusCoefficients,
  g_L3UranusCoefficients,
  g_L4UranusCoefficients,
  g_R0UranusCoefficients,
  g_R1UranusCoefficients,
  g_R2UranusCoefficients,
  g_R3UranusCoefficients,
  g_R4UranusCoefficients
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Uranus
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const L0 = g_L0UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L1 = g_L1UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L2 = g_L2UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L3 = g_L3UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L4 = g_L4UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  const value = (L0
      .plus(L1.mul(rho))
      .plus(L2.mul(rho.pow(2)))
      .plus(L3.mul(rho.pow(3)))
      .plus(L4.mul(rho.pow(4)))
  )
    .dividedBy(1e8)

  return fmod360(value.radiansToDegrees())
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Uranus
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const B0 = g_B0UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B1 = g_B1UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B2 = g_B2UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B3 = g_B3UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B4 = g_B4UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

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
 * @memberof module:Uranus
 */
export function getRadiusVector (jd: JulianDay | number) {
  const rho = getJulianMillenium(jd)

  const R0 = g_R0UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R1 = g_R1UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R2 = g_R2UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R3 = g_R3UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R4 = g_R4UranusCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  return (R0
      .plus(R1.mul(rho))
      .plus(R2.mul(rho.pow(2)))
      .plus(R3.mul(rho.pow(3)))
      .plus(R4.mul(rho.pow(4)))
  )
    .dividedBy(1e8)
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Uranus
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
 * @returns {EquatorialCoordinates}
 * @memberof module:Uranus
 */
export function getEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}
