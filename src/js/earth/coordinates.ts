/**
 @module Earth
 */
import {
  AstronomicalUnit,
  Degree,
  EclipticCoordinates,
  Equinox,
  JulianDay,
  Meter,
  PlanetCoefficient,
  Radian
} from '@/js/types'
import { DEG2RAD, EARTH_EQUATORIAL_RADIUS, EARTH_RADIUS_FLATTENING_FACTOR, RAD2DEG } from '@/js/constants'
import { getJulianCentury, getJulianMillenium } from '@/js/juliandays'
import { fmod360, fmod90 } from '@/js/utils'
import { Sun } from '@/js/sun'
import {
  getCoefficientsB0,
  getCoefficientsB1,
  getCoefficientsB1J2000,
  getCoefficientsB2J2000,
  getCoefficientsB3J2000,
  getCoefficientsB4J2000,
  getCoefficientsL0,
  getCoefficientsL1,
  getCoefficientsL1J2000,
  getCoefficientsL2,
  getCoefficientsL2J2000,
  getCoefficientsL3,
  getCoefficientsL3J2000,
  getCoefficientsL4,
  getCoefficientsL4J2000,
  getCoefficientsL5,
  getCoefficientsR0,
  getCoefficientsR1,
  getCoefficientsR2,
  getCoefficientsR3,
  getCoefficientsR4,
} from './coefficients'

/** @private */
function getEclipticLongitudeValue (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL0() : getCoefficientsL0()
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL1() : getCoefficientsL1J2000()
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL2() : getCoefficientsL2J2000()
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL3() : getCoefficientsL3J2000()
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL4() : getCoefficientsL4J2000()
  const coeffs5 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL5() : []
  
  const L0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const L5 = (coeffs5 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = L0 + L1 * tau + L2 * Math.pow(tau, 2) + L3 * Math.pow(tau, 3) + L4 * Math.pow(tau, 4) + L5 * Math.pow(tau, 5)
  
  return value / 1e8 * RAD2DEG
}

/**
 * Heliocentric coordinates longitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLongitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return fmod360(getEclipticLongitudeValue(jd, equinox))
}

/**
 * Heliocentric coordinates longitudinal rotation between two dates.
 * @param jdStart {JulianDay} The starting julian day.
 * @param jdEnd {JulianDay} The ending julian day.
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLongitudinalRotation (jdStart: JulianDay, jdEnd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return getEclipticLongitudeValue(jdEnd, equinox) - getEclipticLongitudeValue(jdStart, equinox)
}

/**
 * Heliocentric coordinates latitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLatitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsB0() : getCoefficientsB0()
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsB1() : getCoefficientsB1J2000()
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB2J2000()
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB3J2000()
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB4J2000()
  
  const B0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const B4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = B0 + B1 * tau + B2 * Math.pow(tau, 2) + B3 * Math.pow(tau, 3) + B4 * Math.pow(tau, 4)
  
  return fmod90(value / 1e8 * RAD2DEG)
}

/**
 * Heliocentric coordinates, see AA p.218, 219
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {EclipticCoordinates}
 * @memberof module:Earth
 */
export function getEclipticCoordinates (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd, equinox),
    latitude: getEclipticLatitude(jd, equinox)
  }
}

/**
 * Radius vector (distance from the Sun)
 * Corresponds to AA+ CAAEarth::RadiusVector
 * @param {JulianDay} jd The julian day
 * @returns {AstronomicalUnit}
 * @memberof module:Earth
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const tau = getJulianMillenium(jd)
  
  const coeffs0 = getCoefficientsR0()
  const coeffs1 = getCoefficientsR1()
  const coeffs2 = getCoefficientsR2()
  const coeffs3 = getCoefficientsR3()
  const coeffs4 = getCoefficientsR4()
  
  const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const R4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * tau)), 0)
  const value = R0 + R1 * tau + R2 * Math.pow(tau, 2) + R3 * Math.pow(tau, 3) + R4 * Math.pow(tau, 4)
  
  return value / 1e8
}

/**
 * Mean anomaly, see AA p194
 * The mean anomaly is the angular distance from perihelion which the planet
 * would have if it moved around the Sun with a constant angular velocity.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  return Sun.getMeanAnomaly(jd)
}

/**
 * Eccentricity of the orbit
 * See AA p.163 (and AA p.151)
 * @param  {JulianDay} jd The julian day
 * @memberof module:Earth
 */
export function getEccentricity (jd: JulianDay): number {
  const T = getJulianCentury(jd)
  return 0.016_708_634 - T * 0.000_042_037 - T * T * 0.000_000_1267
}

/**
 * Longitude of perihelion
 * See AA p.151
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The longitude of perihelion
 * @memberof module:Earth
 */
export function getLongitudeOfPerihelion (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return 102.937_35 + T * 1.719_46 + T * T * 0.000_46
}

/**
 * Computes the "rho*sin(phi')" and "rho*cos(phi')" quantities, due to Earth flattening.
 * See AA p 82
 * @param  {Meter} height The observer heights above Earth surface.
 * @param {Degree} lat The observer's geographic latitude
 * @returns {Number} The quantities
 * @memberof module:Earth
 */
export function getFlatteningCorrections (height: Meter, lat: Degree) {
  const earthRadius: Meter = EARTH_EQUATORIAL_RADIUS * 1000
  const b_a = 1 - EARTH_RADIUS_FLATTENING_FACTOR
  const radLat: Radian = lat * DEG2RAD
  const u: Radian = Math.atan(b_a * Math.tan(radLat)) // Radians
  const h = height / earthRadius
  return {
    rhosinphi: b_a * Math.sin(u) + h * Math.sin(radLat),
    rhocosphi: Math.cos(u) + h * Math.cos(radLat)
  }
}
