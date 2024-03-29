import Decimal from '@/decimal'
import { ArcSecond, Degree, JulianDay, Magnitude } from '@/types'
import { FIVE, ONE, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getRingSystemDetails } from './ringSystem'
import { getRadiusVector } from './coordinates'
import { getGeocentricDistance } from './elliptical'

/**
 * Phase angle (angle Sun-planet-Earth).
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Saturn
 */
export function getPhaseAngle (jd: JulianDay | number): Degree {
  const r = getRadiusVector(jd)
  const R = Earth.getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)
  return fmod360(
    Decimal.acos((r.pow(2).plus(Delta.pow(2)).minus(R.pow(2)))
      .dividedBy(TWO.mul(r).mul(Delta))).radiansToDegrees()
  )
}

/**
 * Illuminated fraction of the planet as seen from the Earth. Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 * @memberof module:Saturn
 */
export function getIlluminatedFraction (jd: JulianDay | number): Decimal {
  const i = getPhaseAngle(jd).degreesToRadians()
  return (ONE.plus(Decimal.cos(i))).dividedBy(2)
}

/**
 * Magnitude of the planet, which depends on the planet's distance to the
 * Earth, its distance to the Sun and the phase angle i (Sun-planet-Earth).
 * Implementation return the modern American Astronomical Almanac value
 * instead of Mueller's. Includes the contribution from the ring.
 * @param {JulianDay} jd The julian day
 * @returns {Magnitude}
 * @memberof module:Saturn
 */
export function getMagnitude (jd: JulianDay | number): Magnitude {
  const r = getRadiusVector(jd)
  const Delta = getGeocentricDistance(jd)

  const ringSystem = getRingSystemDetails(jd)
  const B = ringSystem.earthCoordinates.latitude.degreesToRadians()
  const sinB = Decimal.sin(B)
  const DeltaU = ringSystem.saturnicentricSunEarthLongitudesDifference

  return new Decimal('-8.88')
    .plus(FIVE.mul(Decimal.log10(r.mul(Delta))))
    .plus(new Decimal('0.044').mul(DeltaU.abs()))
    .minus(new Decimal('2.60').mul(B.abs().sin()))
    .plus(new Decimal('1.25').mul(sinB.pow(2)))
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
 * @memberof module:Saturn
 */
export function getEquatorialSemiDiameter (jd: JulianDay | number): ArcSecond {
  const Delta = getGeocentricDistance(jd)
  return new Decimal('8.34').dividedBy(Delta)
}

/**
 * Polar semi diameter of the planet. See `equatorialSemiDiameter` about "A"
 * et "B" values. Note that for all planets but Jupiter and Saturn, the
 * polarSemiDiameter is identical to the equatorial one.
 * @see getEquatorialSemiDiameter
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Saturn
 */
export function getPolarSemiDiameter (jd: JulianDay | number): ArcSecond {
  return getEquatorialSemiDiameter(jd)
}
