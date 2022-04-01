import { RAD2DEG } from '../constants'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, EllipticalGeocentricDetails, JulianDay } from '../types'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { transformEclipticToEquatorial } from "../coordinates";
import { getTrueObliquityOfEcliptic } from "../nutation";
import { getEllipticalDetails } from '../elliptical'

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

const cos = Math.cos

export function getEclipticLongitude (jd: JulianDay): Degree {
  const rho = (jd - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho
  const rho5 = rho4 * rho

  //Calculate L0
  let L0 = 0
  for (let i = 0; i < g_L0MercuryCoefficients.length; i++) {
    L0 += g_L0MercuryCoefficients[i].A * cos(g_L0MercuryCoefficients[i].B + g_L0MercuryCoefficients[i].C * rho)
  }
  //Calculate L1
  let L1 = 0
  for (let i = 0; i < g_L1MercuryCoefficients.length; i++) {
    L1 += g_L1MercuryCoefficients[i].A * cos(g_L1MercuryCoefficients[i].B + g_L1MercuryCoefficients[i].C * rho)
  }
  //Calculate L2
  let L2 = 0
  for (let i = 0; i < g_L2MercuryCoefficients.length; i++) {
    L2 += g_L2MercuryCoefficients[i].A * cos(g_L2MercuryCoefficients[i].B + g_L2MercuryCoefficients[i].C * rho)
  }
  //Calculate L3
  let L3 = 0
  for (let i = 0; i < g_L3MercuryCoefficients.length; i++) {
    L3 += g_L3MercuryCoefficients[i].A * cos(g_L3MercuryCoefficients[i].B + g_L3MercuryCoefficients[i].C * rho)
  }
  //Calculate L4
  let L4 = 0
  for (let i = 0; i < g_L4MercuryCoefficients.length; i++) {
    L4 += g_L4MercuryCoefficients[i].A * cos(g_L4MercuryCoefficients[i].B + g_L4MercuryCoefficients[i].C * rho)
  }
  //Calculate L5
  let L5 = 0
  for (let i = 0; i < g_L5MercuryCoefficients.length; i++) {
    L5 += g_L5MercuryCoefficients[i].A * cos(g_L5MercuryCoefficients[i].B + g_L5MercuryCoefficients[i].C * rho)
  }

  let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4 + L5 * rho5) / 100000000

  return MapTo0To360Range(RAD2DEG * value)
}

export function getEclipticLatitude (jd: JulianDay): Degree {
  let rho = (jd - 2451545) / 365250
  let rhosquared = rho * rho
  let rhocubed = rhosquared * rho
  let rho4 = rhocubed * rho

  //Calculate B0
  let B0 = 0
  for (let i = 0; i < g_B0MercuryCoefficients.length; i++) {
    B0 += g_B0MercuryCoefficients[i].A * cos(g_B0MercuryCoefficients[i].B + g_B0MercuryCoefficients[i].C * rho)
  }

  let B1 = 0
  for (let i = 0; i < g_B1MercuryCoefficients.length; i++) {
    B1 += g_B1MercuryCoefficients[i].A * cos(g_B1MercuryCoefficients[i].B + g_B1MercuryCoefficients[i].C * rho)
  }

  //Calculate B2
  let B2 = 0
  for (let i = 0; i < g_B2MercuryCoefficients.length; i++) {
    B2 += g_B2MercuryCoefficients[i].A * cos(g_B2MercuryCoefficients[i].B + g_B2MercuryCoefficients[i].C * rho)
  }

  //Calculate B3
  let B3 = 0
  for (let i = 0; i < g_B3MercuryCoefficients.length; i++) {
    B3 += g_B3MercuryCoefficients[i].A * cos(g_B3MercuryCoefficients[i].B + g_B3MercuryCoefficients[i].C * rho)
  }

  let B4 = 0
  for (let i = 0; i < g_B4MercuryCoefficients.length; i++) {
    B4 += g_B4MercuryCoefficients[i].A * cos(g_B4MercuryCoefficients[i].B + g_B4MercuryCoefficients[i].C * rho)
  }

  let value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4) / 100000000

  return MapToMinus90To90Range(RAD2DEG * value)
}

export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  let rho = (jd - 2451545) / 365250
  let rhosquared = rho * rho
  let rhocubed = rhosquared * rho

  //Calculate R0
  let R0 = 0
  for (let i = 0; i < g_R0MercuryCoefficients.length; i++) {
    R0 += g_R0MercuryCoefficients[i].A * cos(g_R0MercuryCoefficients[i].B + g_R0MercuryCoefficients[i].C * rho)
  }

  //Calculate R1
  let R1 = 0
  for (let i = 0; i < g_R1MercuryCoefficients.length; i++) {
    R1 += g_R1MercuryCoefficients[i].A * cos(g_R1MercuryCoefficients[i].B + g_R1MercuryCoefficients[i].C * rho)
  }

  //Calculate R2
  let R2 = 0
  for (let i = 0; i < g_R2MercuryCoefficients.length; i++) {
    R2 += g_R2MercuryCoefficients[i].A * cos(g_R2MercuryCoefficients[i].B + g_R2MercuryCoefficients[i].C * rho)
  }

  //Calculate R3
  let R3 = 0
  for (let i = 0; i < g_R3MercuryCoefficients.length; i++) {
    R3 += g_R3MercuryCoefficients[i].A * cos(g_R3MercuryCoefficients[i].B + g_R3MercuryCoefficients[i].C * rho)
  }

  return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed) / 100000000
}

export function getEclipticCoordinates (JD: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(JD),
    latitude: getEclipticLatitude(JD)
  }
}

export function getEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}

export function getEllipticalGeocentricDetails (jd: JulianDay): EllipticalGeocentricDetails {
  return getEllipticalDetails(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}
