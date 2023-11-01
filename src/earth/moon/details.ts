import Decimal from '@/decimal'
import { Sun } from '@/sun'
import { ONE_UA_IN_KILOMETERS } from '@/constants'
import { Degree, JulianDay, Kilometer, Radian } from '@/types'
import { getRadiusVector as getEarthRadiusVector } from '@/earth/coordinates'
import { getGeocentricEquatorialCoordinates, getRadiusVectorInKilometer } from './coordinates'

export function getGeocentricElongation (jd: JulianDay | number): Degree {
  const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd)
  const moonCoords = getGeocentricEquatorialCoordinates(jd)

  const decRadSun = sunCoords.declination.degreesToRadians()
  const decRadMoon = moonCoords.declination.degreesToRadians()
  const sins = decRadSun.sin().mul(decRadMoon.sin())

  const raRadSun = sunCoords.rightAscension.hoursToRadians()
  const raRadMoon = moonCoords.rightAscension.hoursToRadians()
  const coss = decRadSun.cos().mul(decRadMoon.cos()).mul(Decimal.cos(raRadSun.minus(raRadMoon)))

  // See first equation 48.2 of AA, p. 345.
  return Decimal.acos(sins.plus(coss)).radiansToDegrees()
}

/**
 * The phase angle (angle Sun-Moon-Earth)
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPhaseAngle (jd: JulianDay | number): Degree {
  // Geocentric elongation of the Moon from the Sun
  const psi: Radian = getGeocentricElongation(jd).degreesToRadians()
  // Distance Earth-Moon
  const Delta: Kilometer = getRadiusVectorInKilometer(jd) // kilometer!!!
  // Distance Earth-Sun
  const R: Kilometer = getEarthRadiusVector(jd).mul(ONE_UA_IN_KILOMETERS)
  return Decimal.atan2(R.mul(psi.sin()), Delta.minus(R.mul(psi.cos()))).radiansToDegrees()
}

/**
 * The position angle of the bright limb.
 * The position angle of the Moon's bright limb is the position angle of the midpoint of the illuminated limb of
 * the Moon, reckoned eastward from the North Point of the disk (not from the axis of rotation of the lunar globe).
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPositionAngleOfTheBrightLimb (jd: JulianDay | number): Degree {
  const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd)
  const moonCoords = getGeocentricEquatorialCoordinates(jd)

  const alpha0 = sunCoords.rightAscension.hoursToRadians()
  const alpha = moonCoords.rightAscension.hoursToRadians()
  const delta0 = sunCoords.declination.degreesToRadians()
  const delta = moonCoords.declination.degreesToRadians()

  const y = delta0.cos().mul((alpha0.minus(alpha)).sin())

  const x = delta0.sin().mul(delta.cos())
    .minus(delta0.cos().mul(delta.sin()).mul((alpha0.minus(alpha)).cos()))

  return Decimal.atan2(y, x).radiansToDegrees()
}

/**
 * The illuminated fraction of the Moon as seen from the Earth.
 * Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 */
export function getIlluminatedFraction (jd: JulianDay | number): Decimal {
  const phaseAngle = getPhaseAngle(jd).degreesToRadians()
  return (new Decimal(1).plus(Decimal.cos(phaseAngle))).dividedBy(2)
}

/**
 * Equatorial horizontal parallax
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEquatorialHorizontalParallax (jd: JulianDay | number): Degree {
  return Decimal.asin(new Decimal('6378.14').dividedBy(getRadiusVectorInKilometer(jd))).radiansToDegrees()
}
