import { DEG2RAD, J2000, SUN_EVENTS_ALTITUDES, SUN_EXTENDED_EVENTS_ALTITUDES } from './constants'
import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianCentury, JulianDay } from "./types";
import * as coordinates from './coordinates'
import * as earth from './earth'
import * as fk5 from './fk5'
import * as nutation from './nutation'
import { getDecimal } from './sexagesimal'
import { MapTo0To360Range } from './utils'

const sin = Math.sin
const cos = Math.cos
const acos = Math.acos
const asin = Math.asin

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The sun mean anomaly
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  // In AA++ (C++) implementation, values differ a little bit. But we prefer textbook AA values to ensure tests validity
  // In AA++ : MapTo0To360Range(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000)
  return MapTo0To360Range(357.52911 + 35999.05029 * T - 0.0001537 * T2 + T3 / 24490000)
}

/**
 * Computes the Sun true anomaly
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The Sun true anomaly
 */
export function getTrueAnomaly (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const M = getMeanAnomaly(jd)
  const C = getSunEquationOfTheCenter(T, M)
  return MapTo0To360Range(M + C)
}

// See AA p 164
export function getSunEquationOfTheCenter (T: JulianCentury, M: Degree): Degree {
  return (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M * DEG2RAD) +
    (0.019993 - 0.000101 * T) * sin(2 * M * DEG2RAD) +
    0.000289 * sin(3 * M * DEG2RAD)
}

// See AA p 164
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury) {
  return MapTo0To360Range(280.46646 + 36000.76983 * T + 0.0003032 * T * T)
}

// --- "low" accuracy (approx 0.01 degree) true geoMETRIC longitude of the Sun referred to
// the mean equinox of the date. See AA pp 164. This longitude is the quantity required in the
// calculation of geocentric planetary position.
export function getGeometricEclipticLongitude (jd: JulianDay): Degree {
  const T = (jd - 2451545.0) / 36525.0
  const L0 = getMeanLongitudeReferredToMeanEquinoxOfDate(T)
  const M = getMeanAnomaly(jd)
  const C = getSunEquationOfTheCenter(T, M)
  return MapTo0To360Range(L0 + C)
}

// --- high accuracy geocentric longitude and latitude of the Sun. See AA pp 166.

export function getGeocentricEclipticLongitude (jd: JulianDay): Degree {
  return MapTo0To360Range(earth.getEclipticLongitude(jd) + 180)
}

export function getGeocentricEclipticLatitude (jd: JulianDay): Degree {
  return -earth.getEclipticLatitude(jd)
}

export function getGeocentricEclipticLongitudeJ2000 (jd: JulianDay): Degree {
  return MapTo0To360Range(earth.getEclipticLongitudeJ2000(jd) + 180)
}

export function getGeocentricEclipticLatitudeJ2000 (jd: JulianDay): Degree {
  return -earth.getEclipticLatitudeJ2000(jd)
}

// --- Conversion from high-accuracy geocentric coordinates of the Sun to the FK5 system. See AA p 166

// See AA+ CAASun::GeometricFK5EclipticLongitude
export function getGeometricFK5EclipticLongitude (jd: JulianDay): Degree {
  // Convert to the FK5 system
  let Longitude = getGeocentricEclipticLongitude(jd)
  const Latitude = getGeocentricEclipticLatitude(jd)
  Longitude += fk5.getCorrectionInLongitude(Longitude, Latitude, jd)
  return Longitude
}

// See AA+ CAASun::GeometricFK5EclipticLatitude
export function getGeometricFK5EclipticLatitude (jd: JulianDay): Degree {
  // Convert to the FK5 system
  const Longitude = getGeocentricEclipticLongitude(jd)
  let Latitude = getGeocentricEclipticLatitude(jd)
  Latitude += fk5.getCorrectionInLatitude(jd, Longitude)
  return Latitude
}

// ---|

// See AA+ CAASun::ApparentEclipticLongitude
export function getApparentEclipticLongitude (jd: JulianDay): Degree {
  let Longitude = getGeometricFK5EclipticLongitude(jd)

  // Apply the correction in longitude due to nutation
  Longitude += getDecimal(0, 0, nutation.getNutationInLongitude(jd))

  // Apply the correction in longitude due to aberration
  const R = earth.getRadiusVector(jd)
  Longitude -= getDecimal(0, 0, 20.4898 / R)

  return Longitude
}

// See AA+ CAASun::ApparentEclipticLatitude
export function getApparentEclipticLatitude (jd: JulianDay): Degree {
  return getGeometricFK5EclipticLatitude(jd)
}

// Wrapper
export function getApparentEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getApparentEclipticLongitude(jd),
    latitude: getApparentEclipticLatitude(jd)
  }
}

export function getApparentEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    getApparentEclipticLongitude(jd),
    getApparentEclipticLatitude(jd),
    nutation.getTrueObliquityOfEcliptic(jd)
  )
}

// ----------

export function getVariationGeometricEclipticLongitude (jd: JulianDay): Degree {
  // D is the number of days since the epoch
  const D = jd - 2451545.00
  const tau = (D / 365250)
  const tau2 = tau * tau
  const tau3 = tau2 * tau

  return 3548.193 +
    118.568 * sin(DEG2RAD * (87.5287 + 359993.7286 * tau)) +
    2.476 * sin(DEG2RAD * (85.0561 + 719987.4571 * tau)) +
    1.376 * sin(DEG2RAD * (27.8502 + 4452671.1152 * tau)) +
    0.119 * sin(DEG2RAD * (73.1375 + 450368.8564 * tau)) +
    0.114 * sin(DEG2RAD * (337.2264 + 329644.6718 * tau)) +
    0.086 * sin(DEG2RAD * (222.5400 + 659289.3436 * tau)) +
    0.078 * sin(DEG2RAD * (162.8136 + 9224659.7915 * tau)) +
    0.054 * sin(DEG2RAD * (82.5823 + 1079981.1857 * tau)) +
    0.052 * sin(DEG2RAD * (171.5189 + 225184.4282 * tau)) +
    0.034 * sin(DEG2RAD * (30.3214 + 4092677.3866 * tau)) +
    0.033 * sin(DEG2RAD * (119.8105 + 337181.4711 * tau)) +
    0.023 * sin(DEG2RAD * (247.5418 + 299295.6151 * tau)) +
    0.023 * sin(DEG2RAD * (325.1526 + 315559.5560 * tau)) +
    0.021 * sin(DEG2RAD * (155.1241 + 675553.2846 * tau)) +
    7.311 * tau * sin(DEG2RAD * (333.4515 + 359993.7286 * tau)) +
    0.305 * tau * sin(DEG2RAD * (330.9814 + 719987.4571 * tau)) +
    0.010 * tau * sin(DEG2RAD * (328.5170 + 1079981.1857 * tau)) +
    0.309 * tau2 * sin(DEG2RAD * (241.4518 + 359993.7286 * tau)) +
    0.021 * tau2 * sin(DEG2RAD * (205.0482 + 719987.4571 * tau)) +
    0.004 * tau2 * sin(DEG2RAD * (297.8610 + 4452671.1152 * tau)) +
    0.010 * tau3 * sin(DEG2RAD * (154.7066 + 359993.7286 * tau))
}

export function getEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd),
    latitude: getGeocentricEclipticLatitude(jd)
  }
}

export function getEclipticCoordinatesJ2000 (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitudeJ2000(jd),
    latitude: getGeocentricEclipticLatitudeJ2000(jd)
  }
}

export function getEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    getGeocentricEclipticLongitude(jd),
    getGeocentricEclipticLatitude(jd),
    nutation.getMeanObliquityOfEcliptic(jd)
  )
}

export function getEquatorialCoordinatesJ2000 (jd: JulianDay): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    getGeocentricEclipticLongitudeJ2000(jd),
    getGeocentricEclipticLatitudeJ2000(jd),
    nutation.getMeanObliquityOfEcliptic(jd)
  )
}

const J0 = 0.0009

function julianCycle (d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * Math.PI))
}

function approxTransit (Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * Math.PI) + n
}

function solarTransitJD (ds: number, M: number, L: number): number {
  return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L)
}

function hourAngle (h: number, phi: number, d: number): number {
  return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)))
}

function eclipticLongitude (M: number): number {
  const C = DEG2RAD * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)) // equation of center
  const P = DEG2RAD * 102.9372 // perihelion of the Earth
  return M + C + P + Math.PI
}

function declination (l: number, b: number): number {
  const e = DEG2RAD * 23.4397 // obliquity of the Earth
  return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l))
}

// returns set time for the given sun altitude
function setJD (h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number): number {
  const w = hourAngle(h, phi, dec)
  const a = approxTransit(w, lw, n)
  return solarTransitJD(a, M, L)
}

// low-accuracy implementation inspired from SunCalc
export function allEventJulianDays (jd: JulianDay, lng: Degree, lat: Degree, condensed: boolean = true): JulianDay[] {
  const lw = DEG2RAD * -lng
  const phi = DEG2RAD * lat

  const d = jd - J2000
  const n = julianCycle(d, lw)
  const ds = approxTransit(0, lw, n)

  const M = getMeanAnomaly(ds)
  const L = eclipticLongitude(M)
  let jdNoon = solarTransitJD(ds, M, L)

  const dec = declination(L, 0)

  const setEvents = [], riseEvents = []
  setEvents.push(jdNoon)
  riseEvents.push(jdNoon + 1)

  const altitudes = (condensed) ? SUN_EVENTS_ALTITUDES : SUN_EXTENDED_EVENTS_ALTITUDES
  for (let i = 0; i < altitudes.length; i += 1) {
    const alt = altitudes[i]

    let jdSet = setJD(alt * DEG2RAD, lw, phi, dec, n, M, L)
    let jdRise = jdNoon - (jdSet - jdNoon) + 1

    setEvents.push(jdSet)
    riseEvents.unshift(jdRise)
  }

  const results = [...setEvents, ...riseEvents]

  if (jdNoon > jd) {
    return results.map(jd => jd - 1)
  } else {
    return results
  }
}

// export function julianDaysOfRiseDayTransitSet(jd: JulianDay, lng: Degree, lat: Degree, alt: Degree): JulianDay[] {
//   const lw = DEG2RAD * -lng
//   const phi = DEG2RAD * lat
//
//   const d = jd - J2000
//   const n = julianCycle(d, lw)
//   const ds = approxTransit(0, lw, n)
//
//   const M = solarMeanAnomaly(ds)
//   const L = eclipticLongitude(M)
//   let jdNoon = solarTransitJD(ds, M, L)
//
//   const dec = declination(L, 0)
//
//   let jdSet = setJD(alt * DEG2RAD, lw, phi, dec, n, M, L)
//   let jdRise = jdNoon - (jdSet - jdNoon) + 1
//
//   // let cosH0 = (sinh0 - sinPhi * sinDelta) / (cosPhi * cosDelta)
//   // isCircumpolar = (abs(cosH0) > 1)
//
//   return [jdRise, jdNoon, jdSet]
// }
