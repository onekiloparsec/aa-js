import { RAD2DEG } from '../constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EllipticalGeocentricDetails, EquatorialCoordinates, JulianDay } from 'aa.js'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { transformEclipticToEquatorial } from '../coordinates'
import { getMeanObliquityOfEcliptic, getTrueObliquityOfEcliptic } from '../nutation'

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

const cos = Math.cos

export namespace Uranus {
  export function getEclipticLongitude (jd: JulianDay): Degree {
    const rho = (jd - 2451545) / 365250
    const rhosquared = rho * rho
    const rhocubed = rhosquared * rho
    const rho4 = rhocubed * rho

    //Calculate L0
    let L0 = 0
    for (let i = 0; i < g_L0UranusCoefficients.length; i++) {
      L0 += g_L0UranusCoefficients[i].A * cos(g_L0UranusCoefficients[i].B + g_L0UranusCoefficients[i].C * rho)
    }
    //Calculate L1
    let L1 = 0
    for (let i = 0; i < g_L1UranusCoefficients.length; i++) {
      L1 += g_L1UranusCoefficients[i].A * cos(g_L1UranusCoefficients[i].B + g_L1UranusCoefficients[i].C * rho)
    }
    //Calculate L2
    let L2 = 0
    for (let i = 0; i < g_L2UranusCoefficients.length; i++) {
      L2 += g_L2UranusCoefficients[i].A * cos(g_L2UranusCoefficients[i].B + g_L2UranusCoefficients[i].C * rho)
    }
    //Calculate L3
    let L3 = 0
    for (let i = 0; i < g_L3UranusCoefficients.length; i++) {
      L3 += g_L3UranusCoefficients[i].A * cos(g_L3UranusCoefficients[i].B + g_L3UranusCoefficients[i].C * rho)
    }
    //Calculate L4
    let L4 = 0
    for (let i = 0; i < g_L4UranusCoefficients.length; i++) {
      L4 += g_L4UranusCoefficients[i].A * cos(g_L4UranusCoefficients[i].B + g_L4UranusCoefficients[i].C * rho)
    }

    let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4) / 100000000

    return MapTo0To360Range(RAD2DEG * value)
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
    for (let i = 0; i < g_B0UranusCoefficients.length; i++) {
      B0 += g_B0UranusCoefficients[i].A * cos(g_B0UranusCoefficients[i].B + g_B0UranusCoefficients[i].C * rho)
    }

    let B1 = 0
    for (let i = 0; i < g_B1UranusCoefficients.length; i++) {
      B1 += g_B1UranusCoefficients[i].A * cos(g_B1UranusCoefficients[i].B + g_B1UranusCoefficients[i].C * rho)
    }

    //Calculate B2
    let B2 = 0
    for (let i = 0; i < g_B2UranusCoefficients.length; i++) {
      B2 += g_B2UranusCoefficients[i].A * cos(g_B2UranusCoefficients[i].B + g_B2UranusCoefficients[i].C * rho)
    }

    //Calculate B3
    let B3 = 0
    for (let i = 0; i < g_B3UranusCoefficients.length; i++) {
      B3 += g_B3UranusCoefficients[i].A * cos(g_B3UranusCoefficients[i].B + g_B3UranusCoefficients[i].C * rho)
    }

    let B4 = 0
    for (let i = 0; i < g_B4UranusCoefficients.length; i++) {
      B4 += g_B4UranusCoefficients[i].A * cos(g_B4UranusCoefficients[i].B + g_B4UranusCoefficients[i].C * rho)
    }

    let value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4) / 100000000

    return MapToMinus90To90Range(RAD2DEG * value)
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
    let rho4 = rhocubed * rho

    //Calculate R0
    let R0 = 0
    for (let i = 0; i < g_R0UranusCoefficients.length; i++) {
      R0 += g_R0UranusCoefficients[i].A * cos(g_R0UranusCoefficients[i].B + g_R0UranusCoefficients[i].C * rho)
    }

    //Calculate R1
    let R1 = 0
    for (let i = 0; i < g_R1UranusCoefficients.length; i++) {
      R1 += g_R1UranusCoefficients[i].A * cos(g_R1UranusCoefficients[i].B + g_R1UranusCoefficients[i].C * rho)
    }

    //Calculate R2
    let R2 = 0
    for (let i = 0; i < g_R2UranusCoefficients.length; i++) {
      R2 += g_R2UranusCoefficients[i].A * cos(g_R2UranusCoefficients[i].B + g_R2UranusCoefficients[i].C * rho)
    }

    //Calculate R3
    let R3 = 0
    for (let i = 0; i < g_R3UranusCoefficients.length; i++) {
      R3 += g_R3UranusCoefficients[i].A * cos(g_R3UranusCoefficients[i].B + g_R3UranusCoefficients[i].C * rho)
    }

    let R4 = 0
    for (let i = 0; i < g_R4UranusCoefficients.length; i++) {
      R4 += g_R4UranusCoefficients[i].A * cos(g_R4UranusCoefficients[i].B + g_R4UranusCoefficients[i].C * rho)
    }

    return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed + R4 * rho4) / 100000000
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
}
