'use strict'

import { DEG2RAD, J2000, SUN_EVENTS_ALTITUDES, SUN_EXTENDED_EVENTS_ALTITUDES } from './constants'
import coordinates from './coordinates'
import earth from './earth'
import fk5 from './fk5'
import nutation from './nutation'
import sexagesimal from './sexagesimal'
import utils from './utils'

function getGeometricEclipticLongitude (JD) {
  return utils.MapTo0To360Range(earth.getEclipticLongitude(JD) + 180)
}

function getGeometricEclipticLatitude (JD) {
  return -earth.getEclipticLatitude(JD)
}

function getGeometricEclipticLongitudeJ2000 (JD) {
  return utils.MapTo0To360Range(earth.getEclipticLongitudeJ2000(JD) + 180)
}

function getGeometricEclipticLatitudeJ2000 (JD) {
  return -earth.getEclipticLatitudeJ2000(JD)
}

function getGeometricFK5EclipticLongitude (JD) {
  // Convert to the FK5 stystem
  let Longitude = getGeometricEclipticLongitude(JD)
  const Latitude = getGeometricEclipticLatitude(JD)
  Longitude += fk5.getCorrectionInLongitude(Longitude, Latitude, JD)
  return Longitude
}

function getGeometricFK5EclipticLatitude (JD) {
  // Convert to the FK5 stystem
  const Longitude = getGeometricEclipticLongitude(JD)
  let Latitude = getGeometricEclipticLatitude(JD)
  Latitude += fk5.getCorrectionInLatitude(Longitude, JD)
  return Latitude
}

function getApparentEclipticLongitude (JD) {
  let Longitude = getGeometricFK5EclipticLongitude(JD)

  // Apply the correction in longitude due to nutation
  Longitude += sexagesimal.getDecimal(0, 0, nutation.getNutationInLongitude(JD))

  // Apply the correction in longitude due to aberration
  const R = earth.getRadiusVector(JD)
  Longitude -= sexagesimal.getDecimal(0, 0, 20.4898 / R)

  return Longitude
}

function getApparentEclipticLatitude (JD) {
  return getGeometricFK5EclipticLatitude(JD)
}

function getVariationGeometricEclipticLongitude (JD) {
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

function getEclipticCoordinates (JD) {
  return {
    longitude: getGeometricEclipticLongitude(JD),
    latitude: getGeometricEclipticLatitude(JD)
  }
}

function getEclipticCoordinatesJ2000 (JD) {
  return {
    longitude: getGeometricEclipticLongitudeJ2000(JD),
    latitude: getGeometricEclipticLatitudeJ2000(JD)
  }
}

function getApparentEclipticCoordinates (JD) {
  return {
    longitude: getApparentEclipticLongitude(JD),
    latitude: getApparentEclipticLatitude(JD)
  }
}

function getEquatorialCoordinates (JD) {
  return coordinates.transformEclipticToEquatorial({
    Lambda: getGeometricEclipticLongitude(JD),
    Beta: getGeometricEclipticLatitude(JD),
    Epsilon: nutation.getMeanObliquityOfEcliptic(JD)
  })
}

function getEquatorialCoordinatesJ2000 (JD) {
  return coordinates.transformEclipticToEquatorial(
    getGeometricEclipticLongitudeJ2000(JD),
    getGeometricEclipticLatitudeJ2000(JD),
    nutation.getMeanObliquityOfEcliptic(JD)
  )
}

function getApparentEquatorialCoordinates (JD) {
  return coordinates.transformEclipticToEquatorial(
    getApparentEclipticLongitude(JD),
    getApparentEclipticLatitude(JD),
    nutation.getTrueObliquityOfEcliptic(JD)
  )
}
}

export default {
  getGeometricEclipticLongitude,
  getGeometricEclipticLatitude,
  getGeometricEclipticLongitudeJ2000,
  getGeometricEclipticLatitudeJ2000,
  getGeometricFK5EclipticLongitude,
  getGeometricFK5EclipticLatitude,
  getApparentEclipticLongitude,
  getApparentEclipticLatitude,
  getVariationGeometricEclipticLongitude,
  getEclipticCoordinates,
  getEclipticCoordinatesJ2000,
  getApparentEclipticCoordinates,
  getEquatorialCoordinates,
  getEquatorialCoordinatesJ2000,
  getApparentEquatorialCoordinates
}
