import { RAD2DEG } from '../constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EllipticalGeocentricDetails, EquatorialCoordinates, JulianDay } from 'aa.js'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { getEllipticalDetails } from '../elliptical'
import { transformEclipticToEquatorial } from '../coordinates'
import { getMeanObliquityOfEcliptic, getTrueObliquityOfEcliptic } from '../nutation'
import {
  g_B0JupiterCoefficients,
  g_B1JupiterCoefficients,
  g_B2JupiterCoefficients,
  g_B3JupiterCoefficients,
  g_B4JupiterCoefficients,
  g_B5JupiterCoefficients,
  g_L0JupiterCoefficients,
  g_L1JupiterCoefficients,
  g_L2JupiterCoefficients,
  g_L3JupiterCoefficients,
  g_L4JupiterCoefficients,
  g_L5JupiterCoefficients,
  g_R0JupiterCoefficients,
  g_R1JupiterCoefficients,
  g_R2JupiterCoefficients,
  g_R3JupiterCoefficients,
  g_R4JupiterCoefficients,
  g_R5JupiterCoefficients
} from './coefficients'

const cos = Math.cos

export namespace Jupiter {
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
    for (let i = 0; i < g_L0JupiterCoefficients.length; i++) {
      L0 += g_L0JupiterCoefficients[i].A * cos(g_L0JupiterCoefficients[i].B + g_L0JupiterCoefficients[i].C * rho)
    }
    //Calculate L1
    let L1 = 0
    for (let i = 0; i < g_L1JupiterCoefficients.length; i++) {
      L1 += g_L1JupiterCoefficients[i].A * cos(g_L1JupiterCoefficients[i].B + g_L1JupiterCoefficients[i].C * rho)
    }
    //Calculate L2
    let L2 = 0
    for (let i = 0; i < g_L2JupiterCoefficients.length; i++) {
      L2 += g_L2JupiterCoefficients[i].A * cos(g_L2JupiterCoefficients[i].B + g_L2JupiterCoefficients[i].C * rho)
    }
    //Calculate L3
    let L3 = 0
    for (let i = 0; i < g_L3JupiterCoefficients.length; i++) {
      L3 += g_L3JupiterCoefficients[i].A * cos(g_L3JupiterCoefficients[i].B + g_L3JupiterCoefficients[i].C * rho)
    }
    //Calculate L4
    let L4 = 0
    for (let i = 0; i < g_L4JupiterCoefficients.length; i++) {
      L4 += g_L4JupiterCoefficients[i].A * cos(g_L4JupiterCoefficients[i].B + g_L4JupiterCoefficients[i].C * rho)
    }
    //Calculate L5
    let L5 = 0
    for (let i = 0; i < g_L5JupiterCoefficients.length; i++) {
      L5 += g_L5JupiterCoefficients[i].A * cos(g_L5JupiterCoefficients[i].B + g_L5JupiterCoefficients[i].C * rho)
    }

    let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4 + L5 * rho5) / 100000000

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
    let rho5 = rho4 * rho

    //Calculate B0
    let B0 = 0
    for (let i = 0; i < g_B0JupiterCoefficients.length; i++) {
      B0 += g_B0JupiterCoefficients[i].A * cos(g_B0JupiterCoefficients[i].B + g_B0JupiterCoefficients[i].C * rho)
    }

    let B1 = 0
    for (let i = 0; i < g_B1JupiterCoefficients.length; i++) {
      B1 += g_B1JupiterCoefficients[i].A * cos(g_B1JupiterCoefficients[i].B + g_B1JupiterCoefficients[i].C * rho)
    }

    //Calculate B2
    let B2 = 0
    for (let i = 0; i < g_B2JupiterCoefficients.length; i++) {
      B2 += g_B2JupiterCoefficients[i].A * cos(g_B2JupiterCoefficients[i].B + g_B2JupiterCoefficients[i].C * rho)
    }

    //Calculate B3
    let B3 = 0
    for (let i = 0; i < g_B3JupiterCoefficients.length; i++) {
      B3 += g_B3JupiterCoefficients[i].A * cos(g_B3JupiterCoefficients[i].B + g_B3JupiterCoefficients[i].C * rho)
    }

    let B4 = 0
    for (let i = 0; i < g_B4JupiterCoefficients.length; i++) {
      B4 += g_B4JupiterCoefficients[i].A * cos(g_B4JupiterCoefficients[i].B + g_B4JupiterCoefficients[i].C * rho)
    }

    let B5 = 0
    for (let i = 0; i < g_B5JupiterCoefficients.length; i++) {
      B5 += g_B5JupiterCoefficients[i].A * cos(g_B5JupiterCoefficients[i].B + g_B5JupiterCoefficients[i].C * rho)
    }

    let value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4 * B5 * rho5) / 100000000

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
    let rho5 = rho4 * rho

    //Calculate R0
    let R0 = 0
    for (let i = 0; i < g_R0JupiterCoefficients.length; i++) {
      R0 += g_R0JupiterCoefficients[i].A * cos(g_R0JupiterCoefficients[i].B + g_R0JupiterCoefficients[i].C * rho)
    }

    //Calculate R1
    let R1 = 0
    for (let i = 0; i < g_R1JupiterCoefficients.length; i++) {
      R1 += g_R1JupiterCoefficients[i].A * cos(g_R1JupiterCoefficients[i].B + g_R1JupiterCoefficients[i].C * rho)
    }

    //Calculate R2
    let R2 = 0
    for (let i = 0; i < g_R2JupiterCoefficients.length; i++) {
      R2 += g_R2JupiterCoefficients[i].A * cos(g_R2JupiterCoefficients[i].B + g_R2JupiterCoefficients[i].C * rho)
    }

    //Calculate R3
    let R3 = 0
    for (let i = 0; i < g_R3JupiterCoefficients.length; i++) {
      R3 += g_R3JupiterCoefficients[i].A * cos(g_R3JupiterCoefficients[i].B + g_R3JupiterCoefficients[i].C * rho)
    }

    let R4 = 0
    for (let i = 0; i < g_R4JupiterCoefficients.length; i++) {
      R4 += g_R4JupiterCoefficients[i].A * cos(g_R4JupiterCoefficients[i].B + g_R4JupiterCoefficients[i].C * rho)
    }

    let R5 = 0
    for (let i = 0; i < g_R5JupiterCoefficients.length; i++) {
      R5 += g_R5JupiterCoefficients[i].A * cos(g_R5JupiterCoefficients[i].B + g_R5JupiterCoefficients[i].C * rho)
    }

    return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed + R4 * rho4 + R5 * rho5) / 100000000
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
