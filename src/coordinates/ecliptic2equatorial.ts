/**
 @module Coordinates
 */
import { Degree, EclipticCoordinates, EquatorialCoordinates } from '@/types'
import { DEG2RAD, ECLIPTIC_OBLIQUITY_J2000_0 } from '@/constants'
import { fmod360, fmod90 } from '@/utils'

/**
 * Equatorial right ascension from ecliptic coordinates
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Degree} Degree (v3.2+), not HOURS (< v3.2)
 */
export function getRightAscensionFromEcliptic (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const rcoords = {
    longitude: coords.longitude * DEG2RAD,
    latitude: coords.latitude * DEG2RAD
  }
  const repsilon = epsilon * DEG2RAD
  const value = Math.atan2(
    Math.sin(rcoords.longitude) * Math.cos(repsilon) - Math.tan(rcoords.latitude) * Math.sin(repsilon),
    Math.cos(rcoords.longitude)
  )
  return fmod360(value / DEG2RAD)
}

/**
 * Equatorial declination from ecliptic coordinates
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const rcoords = {
    longitude: coords.longitude * DEG2RAD,
    latitude: coords.latitude * DEG2RAD
  }
  const repsilon = epsilon * DEG2RAD
  const value = Math.asin(
    Math.sin(rcoords.latitude) * Math.cos(repsilon)
    + Math.cos(rcoords.latitude) * Math.sin(repsilon) * Math.sin(rcoords.longitude)
  )
  return fmod90(value / DEG2RAD)
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @returns {EquatorialCoordinates}
 */
export function transformEclipticToEquatorial (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromEcliptic(coords, epsilon),
    declination: getDeclinationFromEcliptic(coords, epsilon)
  }
}
