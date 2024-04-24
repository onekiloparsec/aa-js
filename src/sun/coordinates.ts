/**
 @module Sun
 */
import {
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  Equinox,
  GeographicCoordinates,
  JulianCentury,
  JulianDay,
  RiseTransitSet
} from '@/types'
import { getCorrectionInLatitude, getCorrectionInLongitude, transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury, getJulianDayMidnightDynamicalTime } from '@/juliandays'
import { DEG2RAD, STANDARD_ALTITUDE_SUN } from '@/constants'
import { getRiseTransitSetTimes } from '@/risetransitset'
import { getDecimalValue } from '@/sexagesimal'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getEquationOfTheCenter, getMeanAnomaly } from './sun'

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @return {Degree}
 */
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury): Degree {
  return fmod360(280.466_46 + 36_000.769_83 * T + 0.000_303_2 * T * T)
}

/**
 * Low accuracy Geometric Ecliptic Longitude
 * The "low" accuracy (approx 0.01 degree) true geoMETRIC longitude of the
 * Sun referred to the mean equinox of the date. See AA pp 164. This
 * longitude is the quantity required in the calculation of geocentric
 * planetary position.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getGeometricEclipticLongitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  const L0 = getMeanLongitudeReferredToMeanEquinoxOfDate(T)
  const M = getMeanAnomaly(jd)
  const C = getEquationOfTheCenter(T, M)
  return fmod360(L0 + C)
}

// --- high accuracy geocentric longitude and latitude of the Sun. See AA pp 166.

/**
 * Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getGeocentricEclipticLongitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return fmod360(Earth.getEclipticLongitude(jd, equinox) + 180)
}

/**
 * Geometric Ecliptic Latitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getGeocentricEclipticLatitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return -Earth.getEclipticLatitude(jd, equinox)
}

// --- Conversion from high-accuracy geocentric coordinates of the Sun to the FK5 system. See AA p 166

// See AA+ CAASun::GeometricFK5EclipticLongitude
export function getGeometricFK5EclipticLongitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  // Convert to the FK5 system
  let Longitude = getGeocentricEclipticLongitude(jd, equinox)
  const Latitude = getGeocentricEclipticLatitude(jd, equinox)
  Longitude = Longitude + getCorrectionInLongitude(jd, Longitude, Latitude)
  return Longitude
}

// See AA+ CAASun::GeometricFK5EclipticLatitude
export function getGeometricFK5EclipticLatitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  // Convert to the FK5 system
  const Longitude = getGeocentricEclipticLongitude(jd, equinox)
  let Latitude = getGeocentricEclipticLatitude(jd, equinox)
  Latitude = Latitude + getCorrectionInLatitude(jd, Longitude)
  return Latitude
}

// ---|

/**
 * Geocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns EclipticCoordinates
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd, equinox),
    latitude: getGeocentricEclipticLatitude(jd, equinox)
  }
}

/**
 * Geocentric equatorial coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns EquatorialCoordinates
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): EquatorialCoordinates {
  return transformEclipticToEquatorial(getGeocentricEclipticCoordinates(jd, equinox), Earth.getMeanObliquityOfEcliptic(jd))
}

/**
 * Apparent Ecliptic Longitude, that is, the geometric longitude of the Sun referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * See AA+ CAASun::ApparentEclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLongitude (jd: JulianDay): Degree {
  let Longitude = getGeometricFK5EclipticLongitude(jd, Equinox.MeanOfTheDate)
  
  // Apply the correction in longitude due to nutation
  Longitude = Longitude + getDecimalValue(0, 0, Earth.getNutationInLongitude(jd))
  
  // Apply the correction in longitude due to aberration. See AA p. 167 for an even higher accuracy.
  const R = Earth.getRadiusVector(jd)
  Longitude = Longitude - getDecimalValue(0, 0, 20.4898 / R)
  
  return Longitude
}

/**
 * Apparent Ecliptic Latitude, that is, the geometric latitude of the Sun referred to the mean equinox of the date.
 * See AA+ CAASun::ApparentEclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLatitude (jd: JulianDay): Degree {
  return getGeometricFK5EclipticLatitude(jd, Equinox.MeanOfTheDate)
}

/**
 * Apparent Ecliptic Coordinates, that is the geometric ecliptic coordinates, referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getApparentGeocentricEclipticLongitude(jd),
    latitude: getApparentGeocentricEclipticLatitude(jd)
  }
}

/**
 * Apparent Equatorial Coordinates, that is the geocentric ecliptic coordinates, referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(getApparentGeocentricEclipticCoordinates(jd), Earth.getTrueObliquityOfEcliptic(jd))
}


/**
 * Variation of the Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getVariationGeometricEclipticLongitude (jd: JulianDay): Degree {
  // D is the number of days since the epoch
  const D = jd - 2451545.00
  const tau = (D / 365250)
  const tau2 = tau * tau
  const tau3 = tau2 * tau
  
  return 3548.193 +
    118.568 * Math.sin(DEG2RAD * (87.5287 + 359993.7286 * tau)) +
    2.476 * Math.sin(DEG2RAD * (85.0561 + 719987.4571 * tau)) +
    1.376 * Math.sin(DEG2RAD * (27.8502 + 4452671.1152 * tau)) +
    0.119 * Math.sin(DEG2RAD * (73.1375 + 450368.8564 * tau)) +
    0.114 * Math.sin(DEG2RAD * (337.2264 + 329644.6718 * tau)) +
    0.086 * Math.sin(DEG2RAD * (222.5400 + 659289.3436 * tau)) +
    0.078 * Math.sin(DEG2RAD * (162.8136 + 9224659.7915 * tau)) +
    0.054 * Math.sin(DEG2RAD * (82.5823 + 1079981.1857 * tau)) +
    0.052 * Math.sin(DEG2RAD * (171.5189 + 225184.4282 * tau)) +
    0.034 * Math.sin(DEG2RAD * (30.3214 + 4092677.3866 * tau)) +
    0.033 * Math.sin(DEG2RAD * (119.8105 + 337181.4711 * tau)) +
    0.023 * Math.sin(DEG2RAD * (247.5418 + 299295.6151 * tau)) +
    0.023 * Math.sin(DEG2RAD * (325.1526 + 315559.5560 * tau)) +
    0.021 * Math.sin(DEG2RAD * (155.1241 + 675553.2846 * tau)) +
    7.311 * tau * Math.sin(DEG2RAD * (333.4515 + 359993.7286 * tau)) +
    0.305 * tau * Math.sin(DEG2RAD * (330.9814 + 719987.4571 * tau)) +
    0.010 * tau * Math.sin(DEG2RAD * (328.5170 + 1079981.1857 * tau)) +
    0.309 * tau2 * Math.sin(DEG2RAD * (241.4518 + 359993.7286 * tau)) +
    0.021 * tau2 * Math.sin(DEG2RAD * (205.0482 + 719987.4571 * tau)) +
    0.004 * tau2 * Math.sin(DEG2RAD * (297.8610 + 4452671.1152 * tau)) +
    0.010 * tau3 * Math.sin(DEG2RAD * (154.7066 + 359993.7286 * tau))
}


/**
 * The rise, transit and set times of the Sun for a given date. It uses the standard sun altitude, -0.833 degrees.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @returns {RiseTransitSet}
 */
export function getRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  const jd0 = getJulianDayMidnightDynamicalTime(jd)
  const sunCoords = getApparentGeocentricEquatorialCoordinates(jd0)
  return getRiseTransitSetTimes(jd, sunCoords, geoCoords, STANDARD_ALTITUDE_SUN)
}

