import { Degree, JulianDay } from '@/types'
import { DEG2RAD, H2RAD, ONE_UA_IN_KILOMETERS, RAD2DEG } from '@/constants'
import { getEquatorialCoordinates as getSunEquatorialCoordinates } from '@/sun'
import { getRadiusVector as getEarthRadiusVector } from '@/earth/coordinates'
import { getEquatorialCoordinates, getRadiusVector } from './coordinates'


/**
 * The phase angle (angle Sun-Moon-Earth)
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPhaseAngle (jd: JulianDay): Degree {
  // Geocentric
  const sunCoords = getSunEquatorialCoordinates(jd)
  // Geocentric
  const moonCoords = getEquatorialCoordinates(jd)

  const alpha0 = sunCoords.rightAscension * H2RAD
  const alpha = moonCoords.rightAscension * H2RAD
  const delta0 = sunCoords.declination * DEG2RAD
  const delta = moonCoords.declination * DEG2RAD

  // Geocentric elongation Psi of the Moon from the Sun
  // See AA p.345
  const cospsi = Math.sin(delta0) * Math.sin(delta) + Math.cos(delta0) * Math.cos(delta) * Math.cos(alpha0 - alpha)
  const psi = Math.acos(cospsi) * RAD2DEG

  // Distance Earth-Moon
  const Delta = getRadiusVector(jd) // kilometer
  const R = getEarthRadiusVector(jd) * ONE_UA_IN_KILOMETERS

  return Math.atan2(R * Math.sin(psi * DEG2RAD), Delta - R * Math.cos(psi * DEG2RAD)) * RAD2DEG
}

/**
 * The illuminated fraction of the Moon as seen from the Earth.
 * Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 */
export function getIlluminatedFraction (jd: JulianDay): number {
  const phaseAngle = getPhaseAngle(jd) * DEG2RAD
  return (1 + Math.cos(phaseAngle)) / 2
}

/**
 * Equatorial horizontal parallax
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEquatorialHorizontalParallax (jd: JulianDay): Degree {
  return Math.asin(6378.14 / getRadiusVector(jd)) * RAD2DEG
}
