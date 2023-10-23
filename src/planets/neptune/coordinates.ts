import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay } from '@/types'
import { RAD2DEG } from '@/constants'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianMillenium } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { getMeanObliquityOfEcliptic, getTrueObliquityOfEcliptic } from '@/earth/nutation'
import {
  g_B0NeptuneCoefficients,
  g_B1NeptuneCoefficients,
  g_B2NeptuneCoefficients,
  g_B3NeptuneCoefficients,
  g_B4NeptuneCoefficients,
  g_L0NeptuneCoefficients,
  g_L1NeptuneCoefficients,
  g_L2NeptuneCoefficients,
  g_L3NeptuneCoefficients,
  g_L4NeptuneCoefficients,
  g_R0NeptuneCoefficients,
  g_R1NeptuneCoefficients,
  g_R2NeptuneCoefficients,
  g_R3NeptuneCoefficients
} from './coefficients'
import Decimal from 'decimal.js'


/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const L0 = g_L0NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L1 = g_L1NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L2 = g_L2NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L3 = g_L3NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const L4 = g_L4NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  const value = (L0
      .plus(L1.mul(rho))
      .plus(L2.mul(rho.pow(2)))
      .plus(L3.mul(rho.pow(3)))
      .plus(L4.mul(rho.pow(4)))
  )
    .dividedBy(1e8)

  return fmod360(value.mul(RAD2DEG))
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const rho = getJulianMillenium(jd)

  const B0 = g_B0NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B1 = g_B1NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B2 = g_B2NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B3 = g_B3NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const B4 = g_B4NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  const value = (B0
      .plus(B1.mul(rho))
      .plus(B2.mul(rho.pow(2)))
      .plus(B3.mul(rho.pow(3)))
      .plus(B4.mul(rho.pow(4)))
  )
    .dividedBy(1e8)

  return fmod90(value.mul(RAD2DEG))
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay | number) {
  const rho = getJulianMillenium(jd)

  const R0 = g_R0NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R1 = g_R1NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R2 = g_R2NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))
  const R3 = g_R3NeptuneCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(rho))))), new Decimal(0))

  return (R0
      .plus(R1.mul(rho))
      .plus(R2.mul(rho.pow(2)))
      .plus(R3.mul(rho.pow(3)))
  )
    .dividedBy(1e8)
}

/**
 * Ecliptic coordinates
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
 * Equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getMeanObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent equatorial coordinates
 * @see getEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getApparentEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}
