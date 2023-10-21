import { Degree, JulianDay, Magnitude } from '@/types'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getRadiusVector } from './coordinates'
import { getGeocentricDistance } from './elliptical'

/**
 * Phase angle (angle Sun-planet-Earth).
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPhaseAngle (jd: JulianDay): Degree {
  const r = getRadiusVector(jd)
  const R = Earth.getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  return fmod360(RAD2DEG * (Math.acos((r * r + Delta * Delta - R * R) / (2 * r * Delta))))
}

/**
 * Illuminated fraction of the planet as seen from the Earth. Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 */
export function getIlluminatedFraction (jd: JulianDay): number {
  const phaseAngle = getPhaseAngle(jd) * DEG2RAD
  return (1 + Math.cos(phaseAngle)) / 2
}

/**
 * Magnitude of the planet, which depends on the planet's distance to the
 * Earth, its distance to the Sun and the phase angle i (Sun-planet-Earth).
 * Implementation return the modern American Astronomical Almanac value
 * instead of Mueller's.
 * @param {JulianDay} jd The julian day
 * @returns {Magnitude}
 */
export function getMagnitude (jd: JulianDay): Magnitude {
  const r = getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  return -7.19 + 5 * Math.log10(r * Delta)
}

/**
 * Equatorial semi diameter of the planet. Note that values of the
 * Astronomical Almanac of 1984 are returned. There are also older values
 * (1980) named "A" values. In the case of Venus, the "B" value refers to the
 * planet's crust, while the "A" value refers to the top of the cloud level.
 * The latter is more relevant for astronomical phenomena such as transits and
 * occultations.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEquatorialSemiDiameter (jd: JulianDay): Degree {
  const Delta = getGeocentricDistance(jd)
  return 35.02 / Delta
}

/**
 * Polar semi diameter of the planet. See `equatorialSemiDiameter` about "A"
 * et "B" values. Note that for all planets but Jupiter and Saturn, the
 * polarSemiDiameter is identical to the equatorial one.
 * @see getEquatorialSemiDiameter
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getPolarSemiDiameter (jd: JulianDay): Degree {
  return getEquatorialSemiDiameter(jd)
}
