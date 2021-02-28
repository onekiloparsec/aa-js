import { EclipticCoordinates, EquatorialCoordinates, transformEclipticToEquatorial } from '../coordinates'
import * as nutation from '../nutation'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { Degree, JulianDay, RAD2DEG } from '../constants'
import {
  gB0EarthCoefficients,
  gB1EarthCoefficients,
  gB1EarthCoefficientsJ2000,
  gB2EarthCoefficientsJ2000,
  gB3EarthCoefficientsJ2000,
  gB4EarthCoefficientsJ2000,
  gL0EarthCoefficients,
  gL1EarthCoefficients,
  gL1EarthCoefficientsJ2000,
  gL2EarthCoefficients,
  gL2EarthCoefficientsJ2000,
  gL3EarthCoefficients,
  gL3EarthCoefficientsJ2000,
  gL4EarthCoefficients,
  gL4EarthCoefficientsJ2000,
  gL5EarthCoefficients,
  gR0EarthCoefficients,
  gR1EarthCoefficients,
  gR2EarthCoefficients,
  gR3EarthCoefficients,
  gR4EarthCoefficients
} from './coefficients'


export function eclipticLongitude(JD: JulianDay): Degree {
  const rho = (JD - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho
  const rho5 = rho4 * rho

  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L1 = gL1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L2 = gL2EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L3 = gL3EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L4 = gL4EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L5 = gL5EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)

  const value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4 + L5 * rho5) / 100000000

  return MapTo0To360Range(value * RAD2DEG)
}

export function eclipticLatitude(JD: JulianDay): Degree {
  const rho = (JD - 2451545) / 365250

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const B1 = gB1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)

  const value = (B0 + B1 * rho) / 100000000

  return MapToMinus90To90Range(value * RAD2DEG)
}

export function radiusVector(JD: JulianDay): Degree {
  const rho = (JD - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho

  const R0 = gR0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const R1 = gR1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const R2 = gR2EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const R3 = gR3EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const R4 = gR4EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)

  return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed + R4 * rho4) / 100000000
}

export function eclipticLongitudeJ2000(JD: JulianDay): Degree {
  const rho = (JD - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho

  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L1 = gL1EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L2 = gL2EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L3 = gL3EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const L4 = gL4EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)

  const value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4) / 100000000

  return MapTo0To360Range(value * RAD2DEG)
}

export function eclipticLatitudeJ2000(JD: JulianDay): Degree {
  const rho = (JD - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const B1 = gB1EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const B2 = gB2EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const B3 = gB3EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)
  const B4 = gB4EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * rho), 0)

  const value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4) / 100000000

  return MapToMinus90To90Range(value * RAD2DEG)
}

/**
 * Computes the eccentricity of the orbit
 * @param  {Number} JD The julian day
 * @returns {Number} The eccentricity (comprise between 0==circular, and 1).
 */
export function sunMeanAnomaly(JD: JulianDay): Degree {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  return MapTo0To360Range(357.5291092 + 35999.0502909 * T - 0.0001536 * Tsquared + Tcubed / 24490000)
}

/**
 * Computes the eccentricity of the orbit
 * @param  {Number} JD The julian day
 * @returns {Number} The eccentricity (comprise between 0==circular, and 1).
 */
export function eccentricity(JD: JulianDay): number {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  return 1 - 0.002516 * T - 0.0000074 * Tsquared
}

export function eclipticCoordinates(JD: JulianDay): EclipticCoordinates {
  return {
    longitude: eclipticLongitude(JD),
    latitude: eclipticLatitude(JD)
  }
}

export function eclipticCoordinatesJ2000(JD: JulianDay): EclipticCoordinates {
  return {
    longitude: eclipticLongitudeJ2000(JD),
    latitude: eclipticLatitudeJ2000(JD)
  }
}

export function equatorialCoordinates(JD: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    eclipticLongitude(JD),
    eclipticLatitude(JD),
    nutation.meanObliquityOfEcliptic(JD)
  )
}

export function equatorialCoordinatesJ2000(JD: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    eclipticLongitudeJ2000(JD),
    eclipticLatitudeJ2000(JD),
    nutation.meanObliquityOfEcliptic(JD)
  )
}
