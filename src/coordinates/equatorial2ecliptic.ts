import { Degree, EclipticCoordinates, EquatorialCoordinates } from '@/types'
import { DEG2RAD, ECLIPTIC_OBLIQUITY_J2000_0, RAD2DEG } from '@/constants'
import { fmod360, fmod90 } from '@/utils'


/**
 * Ecliptic longitude from equatorial coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @returns {Degree}
 */
export function getEclipticLongitudeFromEquatorial (coords: EquatorialCoordinates, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const rcoords = {
    rightAscension: coords.rightAscension * DEG2RAD,
    declination: coords.declination * DEG2RAD
  }
  const depsilon = epsilon * DEG2RAD
  const value = Math.atan2(
    Math.sin(rcoords.rightAscension) * Math.cos(depsilon) + Math.tan(rcoords.declination) * Math.sin(depsilon),
    Math.cos(rcoords.rightAscension)
  )
  return fmod360(value * RAD2DEG)
}

/**
 * Ecliptic latitude from equatorial coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function getEclipticLatitudeFromEquatorial (coords: EquatorialCoordinates, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const rcoords = {
    rightAscension: coords.rightAscension * DEG2RAD,
    declination: coords.declination * DEG2RAD
  }
  const depsilon = epsilon * DEG2RAD
  
  const value = Math.asin(
    Math.sin(rcoords.declination) * Math.cos(depsilon)
    - Math.cos(rcoords.declination) * Math.sin(depsilon) * Math.sin(rcoords.rightAscension)
  )
  
  return fmod90(value * RAD2DEG)
}

/**
 * Transform equatorial coordinates to ecliptic coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function transformEquatorialToEcliptic (coords: EquatorialCoordinates, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): EclipticCoordinates {
  return {
    longitude: getEclipticLongitudeFromEquatorial(coords, epsilon),
    latitude: getEclipticLatitudeFromEquatorial(coords, epsilon)
  }
}
