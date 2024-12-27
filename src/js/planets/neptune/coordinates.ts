import {
  AstronomicalUnit,
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  JulianDay,
  Obliquity,
  PlanetCoefficient
} from '@/js/types'
import { fmod360, fmod90 } from '@/js/utils'
import { transformEclipticToEquatorial } from '@/js/coordinates'
import { getJulianMillenium } from '@/js/juliandays'
import { Earth } from '@/js/earth'
import { RAD2DEG } from '@/js/constants'
import {
  getCoefficientsB0,
  getCoefficientsB1,
  getCoefficientsB2,
  getCoefficientsB3,
  getCoefficientsB4,
  getCoefficientsL0,
  getCoefficientsL1,
  getCoefficientsL2,
  getCoefficientsL3,
  getCoefficientsL4,
  getCoefficientsR0,
  getCoefficientsR1,
  getCoefficientsR2,
  getCoefficientsR3,
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Neptune
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = getCoefficientsL0()
  const coeffs1 = getCoefficientsL1()
  const coeffs2 = getCoefficientsL2()
  const coeffs3 = getCoefficientsL3()
  const coeffs4 = getCoefficientsL4()
  
  const L0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = L0 + L1 * tau + L2 * Math.pow(tau, 2) + L3 * Math.pow(tau, 3) + L4 * Math.pow(tau, 4)
  
  return fmod360(value / 1e8 * RAD2DEG)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Neptune
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = getCoefficientsB0()
  const coeffs1 = getCoefficientsB1()
  const coeffs2 = getCoefficientsB2()
  const coeffs3 = getCoefficientsB3()
  const coeffs4 = getCoefficientsB4()
  
  const B0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = B0 + B1 * tau + B2 * Math.pow(tau, 2) + B3 * Math.pow(tau, 3) + B4 * Math.pow(tau, 4)
  
  return fmod90(value / 1e8 * RAD2DEG)
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 * @memberof module:Neptune
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = getCoefficientsR0()
  const coeffs1 = getCoefficientsR1()
  const coeffs2 = getCoefficientsR2()
  const coeffs3 = getCoefficientsR3()
  
  const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = R0 + R1 * tau + R2 * Math.pow(tau, 2) + R3 * Math.pow(tau, 3)
  
  return value / 1e8
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Neptune
 */
export function getEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
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
 * @memberof module:Neptune
 */
export function getEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}
