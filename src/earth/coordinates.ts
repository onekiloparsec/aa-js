import { AstronomicalUnit, Degree, EclipticCoordinates, JulianDay, Meter, Radian } from '@/types'
import { MapTo0To360Range, MapToMinus90To90Range } from '@/utils'
import { getJulianCentury, getJulianMillenium } from '@/juliandays'
import { getMeanAnomaly as getSunMeanAnomaly } from '@/sun'
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

/**
 * Heliocentric coordinates longitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)
  const tau2 = tau * tau
  const tau3 = tau2 * tau
  const tau4 = tau3 * tau
  const tau5 = tau4 * tau

  // AA p.218: Values A are expressed in 10^-8 radians, while B and C values are in radians.

  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L1 = gL1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L2 = gL2EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L3 = gL3EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L4 = gL4EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L5 = gL5EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)

  const value = (L0 + L1 * tau + L2 * tau2 + L3 * tau3 + L4 * tau4 + L5 * tau5) / 1e8

  return MapTo0To360Range(value * RAD2DEG)
}

/**
 * Heliocentric coordinates latitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const B1 = gB1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)

  const value = (B0 + B1 * tau) / 100000000

  return MapToMinus90To90Range(value * RAD2DEG)
}

/**
 * Heliocentric coordinates, see AA p.218, 219
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
 * Radius vector (distance from the Sun)
 * Corresponds to AA+ CAAEarth::RadiusVector
 * @param {JulianDay} jd The julian day
 * @returns {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const tau = getJulianMillenium(jd)
  const tau2 = tau * tau
  const tau3 = tau2 * tau
  const tau4 = tau3 * tau

  const R0 = gR0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const R1 = gR1EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const R2 = gR2EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const R3 = gR3EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const R4 = gR4EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)

  return (R0 + R1 * tau + R2 * tau2 + R3 * tau3 + R4 * tau4) / 100000000
}

/**
 * Heliocentric coordinates longitude for the equinox J2000, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitudeJ2000 (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)
  const tau2 = tau * tau
  const tau3 = tau2 * tau
  const tau4 = tau3 * tau

  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L1 = gL1EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L2 = gL2EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L3 = gL3EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const L4 = gL4EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)

  const value = (L0 + L1 * tau + L2 * tau2 + L3 * tau3 + L4 * tau4) / 100000000

  return MapTo0To360Range(value * RAD2DEG)
}

/**
 * Heliocentric coordinates latitude for the equinox J2000, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLatitudeJ2000 (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)
  const tau2 = tau * tau
  const tau3 = tau2 * tau
  const tau4 = tau3 * tau

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const B1 = gB1EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const B2 = gB2EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const B3 = gB3EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)
  const B4 = gB4EarthCoefficientsJ2000.reduce((sum, val) => sum + val.A * Math.cos(val.B + val.C * tau), 0)

  const value = (B0 + B1 * tau + B2 * tau2 + B3 * tau3 + B4 * tau4) / 100000000

  return MapToMinus90To90Range(value * RAD2DEG)
}

/**
 * Mean anomaly, see AA p194
 * The mean anomaly is the angular distance from perihelion which the planet
 * would have if it moved around the Sun with a constant angular velocity.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  return getSunMeanAnomaly(jd)
}

/**
 * Eccentricity of the orbit
 * @param  {JulianDay} jd The julian day
 * @returns {Number} The eccentricity (comprise between 0==circular, and 1).
 */
export function getEccentricity (jd: JulianDay): number {
  const T = getJulianCentury(jd)
  return 1 - 0.002516 * T - 0.0000074 * T * T
}
