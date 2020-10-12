import { DEG2RAD, J2000, SUN_EVENTS_ALTITUDES, SUN_EXTENDED_EVENTS_ALTITUDES } from './constants'
import * as coordinates from './coordinates'
import { EclipticCoordinates, EquatorialCoordinates } from './coordinates'
import * as earth from './earth'
import * as fk5 from './fk5'
import * as nutation from './nutation'
import { getDecimal } from './sexagesimal'
import { MapTo0To360Range } from './utils'

const sin = Math.sin
const cos = Math.cos
const acos = Math.acos
const asin = Math.asin

export function geometricEclipticLongitude(jd: number): number {
  return MapTo0To360Range(earth.eclipticLongitude(jd) + 180)
}

export function geometricEclipticLatitude(jd: number): number {
  return -earth.eclipticLatitude(jd)
}

export function geometricEclipticLongitudeJ2000(jd: number): number {
  return MapTo0To360Range(earth.eclipticLongitudeJ2000(jd) + 180)
}

export function geometricEclipticLatitudeJ2000(jd: number): number {
  return -earth.eclipticLatitudeJ2000(jd)
}

export function geometricFK5EclipticLongitude(jd: number): number {
  // Convert to the FK5 stystem
  let Longitude = geometricEclipticLongitude(jd)
  const Latitude = geometricEclipticLatitude(jd)
  Longitude += fk5.getCorrectionInLongitude(Longitude, Latitude, jd)
  return Longitude
}

export function geometricFK5EclipticLatitude(jd: number): number {
  // Convert to the FK5 stystem
  const Longitude = geometricEclipticLongitude(jd)
  let Latitude = geometricEclipticLatitude(jd)
  Latitude += fk5.getCorrectionInLatitude(jd, Longitude)
  return Latitude
}

export function apparentEclipticLongitude(jd: number): number {
  let Longitude = geometricFK5EclipticLongitude(jd)

  // Apply the correction in longitude due to nutation
  Longitude += getDecimal(0, 0, nutation.nutationInLongitude(jd))

  // Apply the correction in longitude due to aberration
  const R = earth.radiusVector(jd)
  Longitude -= getDecimal(0, 0, 20.4898 / R)

  return Longitude
}

export function apparentEclipticLatitude(jd: number): number {
  return geometricFK5EclipticLatitude(jd)
}

export function variationGeometricEclipticLongitude(jd: number): number {
  // D is the number of days since the epoch
  const D = jd - 2451545.00
  const tau = (D / 365250)
  const tau2 = tau * tau
  const tau3 = tau2 * tau

  const deltaLambda = 3548.193 +
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

  return deltaLambda
}

export function eclipticCoordinates(jd: number): EclipticCoordinates {
  return {
    longitude: geometricEclipticLongitude(jd),
    latitude: geometricEclipticLatitude(jd)
  }
}

export function eclipticCoordinatesJ2000(jd: number): EclipticCoordinates {
  return {
    longitude: geometricEclipticLongitudeJ2000(jd),
    latitude: geometricEclipticLatitudeJ2000(jd)
  }
}

export function apparentEclipticCoordinates(jd: number): EclipticCoordinates {
  return {
    longitude: apparentEclipticLongitude(jd),
    latitude: apparentEclipticLatitude(jd)
  }
}

export function equatorialCoordinates(jd: number): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    geometricEclipticLongitude(jd),
    geometricEclipticLatitude(jd),
    nutation.meanObliquityOfEcliptic(jd)
  )
}

export function equatorialCoordinatesJ2000(jd: number): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    geometricEclipticLongitudeJ2000(jd),
    geometricEclipticLatitudeJ2000(jd),
    nutation.meanObliquityOfEcliptic(jd)
  )
}

export function apparentEquatorialCoordinates(jd: number): EquatorialCoordinates {
  return coordinates.transformEclipticToEquatorial(
    apparentEclipticLongitude(jd),
    apparentEclipticLatitude(jd),
    nutation.trueObliquityOfEcliptic(jd)
  )
}

// low-accuracy implementation inspired from SunCalc
export function allEventJulianDays(jd: number, lat: number, lng: number, condensed: boolean = true) {
  const J0 = 0.0009
  var e = DEG2RAD * 23.4397 // obliquity of the Earth

  function julianCycle(d, lw) {
    return Math.round(d - J0 - lw / (2 * Math.PI))
  }

  function approxTransit(Ht, lw, n) {
    return J0 + (Ht + lw) / (2 * Math.PI) + n
  }

  function solarTransitJD(ds, M, L) {
    return J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L)
  }

  function hourAngle(h, phi, d) {
    return acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)))
  }

  function solarMeanAnomaly(d) {
    return DEG2RAD * (357.5291 + 0.98560028 * d)
  }

  function eclipticLongitude(M) {
    const C = DEG2RAD * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)) // equation of center
    const P = DEG2RAD * 102.9372 // perihelion of the Earth
    return M + C + P + Math.PI
  }

  function declination(l, b) {
    return asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l))
  }


// returns set time for the given sun altitude
  function setJD(h, lw, phi, dec, n, M, L) {
    const w = hourAngle(h, phi, dec)
    const a = approxTransit(w, lw, n)
    return solarTransitJD(a, M, L)
  }

  const lw = DEG2RAD * -lng
  const phi = DEG2RAD * lat

  const d = jd - J2000
  const n = julianCycle(d, lw)
  const ds = approxTransit(0, lw, n)

  const M = solarMeanAnomaly(ds)
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
