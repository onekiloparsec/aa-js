import { DEG2RAD, J2000, SUN_EVENTS_ALTITUDES, SUN_EXTENDED_EVENTS_ALTITUDES } from './constants'
import coordinates from './coordinates'
import earth from './earth'
import fk5 from './fk5'
import nutation from './nutation'
import sexagesimal from './sexagesimal'
import utils from './utils'

function geometricEclipticLongitude (JD) {
  return utils.MapTo0To360Range(earth.eclipticLongitude(JD) + 180)
}

function geometricEclipticLatitude (JD) {
  return -earth.eclipticLatitude(JD)
}

function geometricEclipticLongitudeJ2000 (JD) {
  return utils.MapTo0To360Range(earth.eclipticLongitudeJ2000(JD) + 180)
}

function geometricEclipticLatitudeJ2000 (JD) {
  return -earth.eclipticLatitudeJ2000(JD)
}

function geometricFK5EclipticLongitude (JD) {
  // Convert to the FK5 stystem
  let Longitude = geometricEclipticLongitude(JD)
  const Latitude = geometricEclipticLatitude(JD)
  Longitude += fk5.getCorrectionInLongitude(Longitude, Latitude, JD)
  return Longitude
}

function geometricFK5EclipticLatitude (JD) {
  // Convert to the FK5 stystem
  const Longitude = geometricEclipticLongitude(JD)
  let Latitude = geometricEclipticLatitude(JD)
  Latitude += fk5.getCorrectionInLatitude(Longitude, JD)
  return Latitude
}

function apparentEclipticLongitude (JD) {
  let Longitude = geometricFK5EclipticLongitude(JD)

  // Apply the correction in longitude due to nutation
  Longitude += sexagesimal.decimal(0, 0, nutation.nutationInLongitude(JD))

  // Apply the correction in longitude due to aberration
  const R = earth.radiusVector(JD)
  Longitude -= sexagesimal.decimal(0, 0, 20.4898 / R)

  return Longitude
}

function apparentEclipticLatitude (JD) {
  return geometricFK5EclipticLatitude(JD)
}

function variationGeometricEclipticLongitude (JD) {
  // D is the number of days since the epoch
  const D = JD - 2451545.00
  const tau = (D / 365250)
  const tau2 = tau * tau
  const tau3 = tau2 * tau

  const deltaLambda = 3548.193 +
    118.568 * Math.sin(DEG2RAD(87.5287 + 359993.7286 * tau)) +
    2.476 * Math.sin(DEG2RAD(85.0561 + 719987.4571 * tau)) +
    1.376 * Math.sin(DEG2RAD(27.8502 + 4452671.1152 * tau)) +
    0.119 * Math.sin(DEG2RAD(73.1375 + 450368.8564 * tau)) +
    0.114 * Math.sin(DEG2RAD(337.2264 + 329644.6718 * tau)) +
    0.086 * Math.sin(DEG2RAD(222.5400 + 659289.3436 * tau)) +
    0.078 * Math.sin(DEG2RAD(162.8136 + 9224659.7915 * tau)) +
    0.054 * Math.sin(DEG2RAD(82.5823 + 1079981.1857 * tau)) +
    0.052 * Math.sin(DEG2RAD(171.5189 + 225184.4282 * tau)) +
    0.034 * Math.sin(DEG2RAD(30.3214 + 4092677.3866 * tau)) +
    0.033 * Math.sin(DEG2RAD(119.8105 + 337181.4711 * tau)) +
    0.023 * Math.sin(DEG2RAD(247.5418 + 299295.6151 * tau)) +
    0.023 * Math.sin(DEG2RAD(325.1526 + 315559.5560 * tau)) +
    0.021 * Math.sin(DEG2RAD(155.1241 + 675553.2846 * tau)) +
    7.311 * tau * Math.sin(DEG2RAD(333.4515 + 359993.7286 * tau)) +
    0.305 * tau * Math.sin(DEG2RAD(330.9814 + 719987.4571 * tau)) +
    0.010 * tau * Math.sin(DEG2RAD(328.5170 + 1079981.1857 * tau)) +
    0.309 * tau2 * Math.sin(DEG2RAD(241.4518 + 359993.7286 * tau)) +
    0.021 * tau2 * Math.sin(DEG2RAD(205.0482 + 719987.4571 * tau)) +
    0.004 * tau2 * Math.sin(DEG2RAD(297.8610 + 4452671.1152 * tau)) +
    0.010 * tau3 * Math.sin(DEG2RAD(154.7066 + 359993.7286 * tau))

  return deltaLambda
}

function eclipticCoordinates (JD) {
  return {
    longitude: geometricEclipticLongitude(JD),
    latitude: geometricEclipticLatitude(JD)
  }
}

function eclipticCoordinatesJ2000 (JD) {
  return {
    longitude: geometricEclipticLongitudeJ2000(JD),
    latitude: geometricEclipticLatitudeJ2000(JD)
  }
}

function apparentEclipticCoordinates (JD) {
  return {
    longitude: apparentEclipticLongitude(JD),
    latitude: apparentEclipticLatitude(JD)
  }
}

function equatorialCoordinates (JD) {
  return coordinates.transformEclipticToEquatorial({
    Lambda: geometricEclipticLongitude(JD),
    Beta: geometricEclipticLatitude(JD),
    Epsilon: nutation.meanObliquityOfEcliptic(JD)
  })
}

function equatorialCoordinatesJ2000 (JD) {
  return coordinates.transformEclipticToEquatorial(
    geometricEclipticLongitudeJ2000(JD),
    geometricEclipticLatitudeJ2000(JD),
    nutation.meanObliquityOfEcliptic(JD)
  )
}

function apparentEquatorialCoordinates (JD) {
  return coordinates.transformEclipticToEquatorial(
    apparentEclipticLongitude(JD),
    apparentEclipticLatitude(JD),
    nutation.trueObliquityOfEcliptic(JD)
  )
}

// low-accuracy implementation inspired from SunCalc
function eventJulianDays (jd, lat, lng, condensed = true) {
  var J0 = 0.0009

  function julianCycle (d, lw) {
    return Math.round(d - J0 - lw / (2 * Math.PI))
  }

  function approxTransit (Ht, lw, n) {
    return J0 + (Ht + lw) / (2 * Math.PI) + n
  }

  function solarTransitJD (ds, M, L) {
    return J2000 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L)
  }

  function hourAngle (h, phi, d) {
    return Math.acos((Math.sin(h) - Math.sin(phi) * Math.sin(d)) / (Math.cos(phi) * Math.cos(d)))
  }

// returns set time for the given sun altitude
  function setJD (h, lw, phi, dec, n, M, L) {
    const w = hourAngle(h, phi, dec)
    const a = approxTransit(w, lw, n)
    return solarTransitJD(a, M, L)
  }

  const lw = DEG2RAD * -lng
  const phi = DEG2RAD * lat

  const d = jd - J2000
  const n = julianCycle(d, lw)
  const ds = approxTransit(0, lw, n)

  const M = earth.sunMeanAnomaly(ds)
  const L = apparentEclipticLongitude(M)
  const jdNoon = solarTransitJD(ds, M, L)

  const dec = coordinates.declinationFromEcliptic(L, 0, nutation.trueObliquityOfEcliptic(jdNoon))

  const riseEvents = [], setEvents = []
  riseEvents.push(jdNoon)
  setEvents.push(jdNoon + 0.5)

  const altitudes = (condensed) ? SUN_EVENTS_ALTITUDES : SUN_EXTENDED_EVENTS_ALTITUDES
  for (let i = 0; i < altitudes; i += 1) {
    const alt = altitudes[i]

    let jdSet = setJD(alt * DEG2RAD, lw, phi, dec, n, M, L)
    let jdRise = jdNoon - (jdSet - jdNoon)

    riseEvents.push(jdRise)
    setEvents.unshift(jdSet)
  }

  return [...riseEvents, ...setEvents]
}

export default {
  geometricEclipticLongitude,
  geometricEclipticLatitude,
  geometricEclipticLongitudeJ2000,
  geometricEclipticLatitudeJ2000,
  geometricFK5EclipticLongitude,
  geometricFK5EclipticLatitude,
  apparentEclipticLongitude,
  apparentEclipticLatitude,
  variationGeometricEclipticLongitude,
  eclipticCoordinates,
  eclipticCoordinatesJ2000,
  apparentEclipticCoordinates,
  equatorialCoordinates,
  equatorialCoordinatesJ2000,
  apparentEquatorialCoordinates,
  eventJulianDays
}
