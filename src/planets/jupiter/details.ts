import Decimal from 'decimal.js'
import { Degree, JulianDay, Magnitude } from '@/types'
import { DEG2RAD, ONE, RAD2DEG, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getRadiusVector } from './coordinates'
import { getGeocentricDistance } from './elliptical'

/**
 * Phase angle (angle Sun-planet-Earth).
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPhaseAngle (jd: JulianDay | number): Degree {
  const r = getRadiusVector(jd)
  const R = Earth.getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  return fmod360(
    (
      Decimal.acos(r.pow(2).plus(Delta.pow(2)).minus(R.pow(2))
        .dividedBy(TWO.mul(r).mul(Delta)))
    ).mul(RAD2DEG)
  )
}

/**
 * Illuminated fraction of the planet as seen from the Earth. Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 */
export function getIlluminatedFraction (jd: JulianDay | number): Decimal {
  const i = getPhaseAngle(jd).mul(DEG2RAD)
  return (ONE.plus(Decimal.cos(i))).dividedBy(2)
}

/**
 * Magnitude of the planet, which depends on the planet's distance to the
 * Earth, its distance to the Sun and the phase angle i (Sun-planet-Earth).
 * Implementation return the modern American Astronomical Almanac value
 * instead of Mueller's
 * @param {JulianDay} jd The julian day
 * @returns {Magnitude}
 */
export function getMagnitude (jd: JulianDay | number): Magnitude {
  const r = getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  const i = getPhaseAngle(jd).mul(DEG2RAD)
  return new Decimal(-9.40)
    .plus(new Decimal(5).mul(Decimal.log10(r.mul(Delta))))
    .plus(new Decimal(0.005).mul(i))
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
export function getEquatorialSemiDiameter (jd: JulianDay | number): Degree {
  const Delta = getGeocentricDistance(jd)
  return new Decimal(98.47).dividedBy(Delta)
}

/**
 * Polar semi diameter of the planet. See `equatorialSemiDiameter` about "A"
 * et "B" values. Note that for all planets but Jupiter and Saturn, the
 * polarSemiDiameter is identical to the equatorial one.
 * @see getEquatorialSemiDiameter
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getPolarSemiDiameter (jd: JulianDay | number): Degree {
  const Delta = getGeocentricDistance(jd)
  return new Decimal(91.91).dividedBy(Delta)
}
