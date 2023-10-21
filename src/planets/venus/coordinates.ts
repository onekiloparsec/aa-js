import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Obliquity } from '@/types'
import { getMeanObliquityOfEcliptic, getTrueObliquityOfEcliptic } from '@/nutation'
import { transformEclipticToEquatorial } from '@/coordinates'
import { fmod360, fmod90 } from '@/utils'
import { RAD2DEG } from '@/constants'
import {
  g_B0VenusCoefficients,
  g_B1VenusCoefficients,
  g_B2VenusCoefficients,
  g_B3VenusCoefficients,
  g_B4VenusCoefficients,
  g_L0VenusCoefficients,
  g_L1VenusCoefficients,
  g_L2VenusCoefficients,
  g_L3VenusCoefficients,
  g_L4VenusCoefficients,
  g_L5VenusCoefficients,
  g_R0VenusCoefficients,
  g_R1VenusCoefficients,
  g_R2VenusCoefficients,
  g_R3VenusCoefficients
} from './coefficients'

const cos = Math.cos
const sin = Math.sin

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const rho = (jd - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho
  const rho5 = rho4 * rho

  //Calculate L0
  let L0 = 0
  for (let i = 0; i < g_L0VenusCoefficients.length; i++) {
    L0 += g_L0VenusCoefficients[i].A * cos(g_L0VenusCoefficients[i].B + g_L0VenusCoefficients[i].C * rho)
  }
  //Calculate L1
  let L1 = 0
  for (let i = 0; i < g_L1VenusCoefficients.length; i++) {
    L1 += g_L1VenusCoefficients[i].A * cos(g_L1VenusCoefficients[i].B + g_L1VenusCoefficients[i].C * rho)
  }
  //Calculate L2
  let L2 = 0
  for (let i = 0; i < g_L2VenusCoefficients.length; i++) {
    L2 += g_L2VenusCoefficients[i].A * cos(g_L2VenusCoefficients[i].B + g_L2VenusCoefficients[i].C * rho)
  }
  //Calculate L3
  let L3 = 0
  for (let i = 0; i < g_L3VenusCoefficients.length; i++) {
    L3 += g_L3VenusCoefficients[i].A * cos(g_L3VenusCoefficients[i].B + g_L3VenusCoefficients[i].C * rho)
  }
  //Calculate L4
  let L4 = 0
  for (let i = 0; i < g_L4VenusCoefficients.length; i++) {
    L4 += g_L4VenusCoefficients[i].A * cos(g_L4VenusCoefficients[i].B + g_L4VenusCoefficients[i].C * rho)
  }
  //Calculate L5
  let L5 = 0
  for (let i = 0; i < g_L5VenusCoefficients.length; i++) {
    L5 += g_L5VenusCoefficients[i].A * cos(g_L5VenusCoefficients[i].B + g_L5VenusCoefficients[i].C * rho)
  }

  let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4 + L5 * rho5) / 100000000

  return fmod360(RAD2DEG * value)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  let rho = (jd - 2451545) / 365250
  let rhosquared = rho * rho
  let rhocubed = rhosquared * rho
  let rho4 = rhocubed * rho

  //Calculate B0
  let B0 = 0
  for (let i = 0; i < g_B0VenusCoefficients.length; i++) {
    B0 += g_B0VenusCoefficients[i].A * cos(g_B0VenusCoefficients[i].B + g_B0VenusCoefficients[i].C * rho)
  }

  let B1 = 0
  for (let i = 0; i < g_B1VenusCoefficients.length; i++) {
    B1 += g_B1VenusCoefficients[i].A * cos(g_B1VenusCoefficients[i].B + g_B1VenusCoefficients[i].C * rho)
  }

  //Calculate B2
  let B2 = 0
  for (let i = 0; i < g_B2VenusCoefficients.length; i++) {
    B2 += g_B2VenusCoefficients[i].A * cos(g_B2VenusCoefficients[i].B + g_B2VenusCoefficients[i].C * rho)
  }

  //Calculate B3
  let B3 = 0
  for (let i = 0; i < g_B3VenusCoefficients.length; i++) {
    B3 += g_B3VenusCoefficients[i].A * cos(g_B3VenusCoefficients[i].B + g_B3VenusCoefficients[i].C * rho)
  }

  let B4 = 0
  for (let i = 0; i < g_B4VenusCoefficients.length; i++) {
    B4 += g_B4VenusCoefficients[i].A * cos(g_B4VenusCoefficients[i].B + g_B4VenusCoefficients[i].C * rho)
  }

  let value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4) / 100000000

  return fmod90(RAD2DEG * value)
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  let rho = (jd - 2451545) / 365250
  let rhosquared = rho * rho
  let rhocubed = rhosquared * rho

  //Calculate R0
  let R0 = 0
  for (let i = 0; i < g_R0VenusCoefficients.length; i++) {
    R0 += g_R0VenusCoefficients[i].A * cos(g_R0VenusCoefficients[i].B + g_R0VenusCoefficients[i].C * rho)
  }

  //Calculate R1
  let R1 = 0
  for (let i = 0; i < g_R1VenusCoefficients.length; i++) {
    R1 += g_R1VenusCoefficients[i].A * cos(g_R1VenusCoefficients[i].B + g_R1VenusCoefficients[i].C * rho)
  }

  //Calculate R2
  let R2 = 0
  for (let i = 0; i < g_R2VenusCoefficients.length; i++) {
    R2 += g_R2VenusCoefficients[i].A * cos(g_R2VenusCoefficients[i].B + g_R2VenusCoefficients[i].C * rho)
  }

  //Calculate R3
  let R3 = 0
  for (let i = 0; i < g_R3VenusCoefficients.length; i++) {
    R3 += g_R3VenusCoefficients[i].A * cos(g_R3VenusCoefficients[i].B + g_R3VenusCoefficients[i].C * rho)
  }

  return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed) / 100000000
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

/**
 * Heliocentric equatorial coordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} obliquity Obliquity of the Ecliptic. Either 'Mean' or 'True'.
 * @returns {EquatorialCoordinates}
 */
export function getEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    (obliquity == Obliquity.Mean) ? getMeanObliquityOfEcliptic(jd) : getTrueObliquityOfEcliptic(jd)
  )
}
