import { RAD2DEG } from '@/constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay } from '@/types'
import { fmod360, fmod90 } from '@/utils'
import { transformEclipticToEquatorial } from '@/coordinates'
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

const cos = Math.cos

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

  //Calculate L0
  let L0 = 0
  for (let i = 0; i < g_L0NeptuneCoefficients.length; i++) {
    L0 += g_L0NeptuneCoefficients[i].A * cos(g_L0NeptuneCoefficients[i].B + g_L0NeptuneCoefficients[i].C * rho)
  }
  //Calculate L1
  let L1 = 0
  for (let i = 0; i < g_L1NeptuneCoefficients.length; i++) {
    L1 += g_L1NeptuneCoefficients[i].A * cos(g_L1NeptuneCoefficients[i].B + g_L1NeptuneCoefficients[i].C * rho)
  }
  //Calculate L2
  let L2 = 0
  for (let i = 0; i < g_L2NeptuneCoefficients.length; i++) {
    L2 += g_L2NeptuneCoefficients[i].A * cos(g_L2NeptuneCoefficients[i].B + g_L2NeptuneCoefficients[i].C * rho)
  }
  //Calculate L3
  let L3 = 0
  for (let i = 0; i < g_L3NeptuneCoefficients.length; i++) {
    L3 += g_L3NeptuneCoefficients[i].A * cos(g_L3NeptuneCoefficients[i].B + g_L3NeptuneCoefficients[i].C * rho)
  }
  //Calculate L4
  let L4 = 0
  for (let i = 0; i < g_L4NeptuneCoefficients.length; i++) {
    L4 += g_L4NeptuneCoefficients[i].A * cos(g_L4NeptuneCoefficients[i].B + g_L4NeptuneCoefficients[i].C * rho)
  }

  let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4) / 100000000

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
  for (let i = 0; i < g_B0NeptuneCoefficients.length; i++) {
    B0 += g_B0NeptuneCoefficients[i].A * cos(g_B0NeptuneCoefficients[i].B + g_B0NeptuneCoefficients[i].C * rho)
  }

  let B1 = 0
  for (let i = 0; i < g_B1NeptuneCoefficients.length; i++) {
    B1 += g_B1NeptuneCoefficients[i].A * cos(g_B1NeptuneCoefficients[i].B + g_B1NeptuneCoefficients[i].C * rho)
  }

  //Calculate B2
  let B2 = 0
  for (let i = 0; i < g_B2NeptuneCoefficients.length; i++) {
    B2 += g_B2NeptuneCoefficients[i].A * cos(g_B2NeptuneCoefficients[i].B + g_B2NeptuneCoefficients[i].C * rho)
  }

  //Calculate B3
  let B3 = 0
  for (let i = 0; i < g_B3NeptuneCoefficients.length; i++) {
    B3 += g_B3NeptuneCoefficients[i].A * cos(g_B3NeptuneCoefficients[i].B + g_B3NeptuneCoefficients[i].C * rho)
  }

  let B4 = 0
  for (let i = 0; i < g_B4NeptuneCoefficients.length; i++) {
    B4 += g_B4NeptuneCoefficients[i].A * cos(g_B4NeptuneCoefficients[i].B + g_B4NeptuneCoefficients[i].C * rho)
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
  for (let i = 0; i < g_R0NeptuneCoefficients.length; i++) {
    R0 += g_R0NeptuneCoefficients[i].A * cos(g_R0NeptuneCoefficients[i].B + g_R0NeptuneCoefficients[i].C * rho)
  }

  //Calculate R1
  let R1 = 0
  for (let i = 0; i < g_R1NeptuneCoefficients.length; i++) {
    R1 += g_R1NeptuneCoefficients[i].A * cos(g_R1NeptuneCoefficients[i].B + g_R1NeptuneCoefficients[i].C * rho)
  }

  //Calculate R2
  let R2 = 0
  for (let i = 0; i < g_R2NeptuneCoefficients.length; i++) {
    R2 += g_R2NeptuneCoefficients[i].A * cos(g_R2NeptuneCoefficients[i].B + g_R2NeptuneCoefficients[i].C * rho)
  }

  //Calculate R3
  let R3 = 0
  for (let i = 0; i < g_R3NeptuneCoefficients.length; i++) {
    R3 += g_R3NeptuneCoefficients[i].A * cos(g_R3NeptuneCoefficients[i].B + g_R3NeptuneCoefficients[i].C * rho)
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
 * Equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
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
export function getApparentEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}
