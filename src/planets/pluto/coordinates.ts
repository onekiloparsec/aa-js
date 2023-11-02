import Decimal from '@/decimal'
import { DEG2RAD } from '@/constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'
import {
  g_PlutoArgumentCoefficients,
  g_PlutoLatitudeCoefficients,
  g_PlutoLongitudeCoefficients,
  g_PlutoRadiusCoefficients
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  const J = new Decimal(34.35).plus(new Decimal(3034.9057).mul(T))
  const S = new Decimal(50.08).plus(new Decimal(1222.1138).mul(T))
  const P = new Decimal(238.96).plus(new Decimal(144.9600).mul(T))

  const L = g_PlutoArgumentCoefficients.reduce((sum, value, index) => {
    const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
    return sum
      .plus(g_PlutoLongitudeCoefficients[index].A.mul(alpha.sin()))
      .plus(g_PlutoLongitudeCoefficients[index].B.mul(alpha.cos()))
  }, new Decimal(0))

  return fmod360(L.dividedBy(1e8).plus(new Decimal(238.958116).plus(new Decimal(144.96).mul(T))))
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  const J = new Decimal(34.35).plus(new Decimal(3034.9057).mul(T))
  const S = new Decimal(50.08).plus(new Decimal(1222.1138).mul(T))
  const P = new Decimal(238.96).plus(new Decimal(144.9600).mul(T))

  const B = g_PlutoArgumentCoefficients.reduce((sum, value, index) => {
    const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
    return sum
      .plus(g_PlutoLatitudeCoefficients[index].A.mul(alpha.sin()))
      .plus(g_PlutoLatitudeCoefficients[index].B.mul(alpha.cos()))
  }, new Decimal(0))

  return fmod90(B.dividedBy(1e8).plus(new Decimal(-3.908239)))
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay | number): AstronomicalUnit {
  const T = getJulianCentury(jd)
  const J = new Decimal(34.35).plus(new Decimal(3034.9057).mul(T))
  const S = new Decimal(50.08).plus(new Decimal(1222.1138).mul(T))
  const P = new Decimal(238.96).plus(new Decimal(144.9600).mul(T))

  const R = g_PlutoArgumentCoefficients.reduce((sum, value, index) => {
    const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
    return sum
      .plus(g_PlutoRadiusCoefficients[index].A.mul(alpha.sin()))
      .plus(g_PlutoRadiusCoefficients[index].B.mul(alpha.cos()))
  }, new Decimal(0))

  return fmod90(R.dividedBy(1e8).plus(new Decimal(40.7241346)))
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
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
 */
export function getEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}
