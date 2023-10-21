import { DEG2RAD } from '@/constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay } from '@/types'
import { fmod360, fmod90 } from '@/utils'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getMeanObliquityOfEcliptic, getTrueObliquityOfEcliptic } from '@/nutation'
import { g_PlutoArgumentCoefficients, g_PlutoLatitudeCoefficients, g_PlutoLongitudeCoefficients, g_PlutoRadiusCoefficients } from './coefficients'

const cos = Math.cos
const sin = Math.sin

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  let L = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    L += ((g_PlutoLongitudeCoefficients[i].A * sin(Alpha)) + (g_PlutoLongitudeCoefficients[i].B * cos(Alpha)))
  }
  L = L / 1000000
  L += (238.958116 + 144.96 * T)
  L = fmod360(L)

  return L
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  //Calculate Latitude
  let L = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    L += ((g_PlutoLatitudeCoefficients[i].A * sin(Alpha)) + (g_PlutoLatitudeCoefficients[i].B * cos(Alpha)))
  }
  L = L / 1000000
  L += -3.908239

  return fmod90(L)
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  //Calculate Radius
  let R = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    R += ((g_PlutoRadiusCoefficients[i].A * sin(Alpha)) + (g_PlutoRadiusCoefficients[i].B * cos(Alpha)))
  }

  R = R / 10000000
  R += 40.7241346
  return R
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
