import { ArcSecond, Degree, JulianDay, Magnitude } from '@/types'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getRadiusVector } from './coordinates'
import { getGeocentricDistance } from './elliptical'

/**
 * Phase angle (angle Sun-planet-Earth).
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Mercury
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
 * @memberof module:Mercury
 */
export function getIlluminatedFraction (jd: JulianDay): number {
  const i = getPhaseAngle(jd) * DEG2RAD
  return (1 + Math.cos(i)) / 2
}

/**
 * Magnitude of the planet, which depends on the planet's distance to the
 * Earth, its distance to the Sun and the phase angle i (Sun-planet-Earth).
 * Implementation return the modern American Astronomical Almanac value
 * instead of Mueller's
 * @param {JulianDay} jd The julian day
 * @returns {Magnitude}
 * @memberof module:Mercury
 */
export function getMagnitude (jd: JulianDay): Magnitude {
  const r = getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  const i = getPhaseAngle(jd)
  return -0.42 + 5 * Math.log10(r * Delta) + +0.0380 * i - 0.000_273 * Math.pow(i, 2) + 0.000_002 * Math.pow(i, 3)
}

/**
 * Equatorial semi diameter of the planet. Note that values of the
 * Astronomical Almanac of 1984 are returned. There are also older values
 * (1980) named "A" values. In the case of Venus, the "B" value refers to the
 * planet's crust, while the "A" value refers to the top of the cloud level.
 * The latter is more relevant for astronomical phenomena such as transits and
 * occultations.
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Mercury
 */
export function getEquatorialSemiDiameter (jd: JulianDay): ArcSecond {
  const Delta = getGeocentricDistance(jd)
  return 3.36 / Delta
}

/**
 * Polar semi diameter of the planet. See `equatorialSemiDiameter` about "A"
 * et "B" values. Note that for all planets but Jupiter and Saturn, the
 * polarSemiDiameter is identical to the equatorial one.
 * @see getEquatorialSemiDiameter
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Mercury
 */
export function getPolarSemiDiameter (jd: JulianDay): ArcSecond {
  return getEquatorialSemiDiameter(jd)
}

