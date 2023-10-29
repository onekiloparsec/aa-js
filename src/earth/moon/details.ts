import Decimal from 'decimal.js'
import { Degree, JulianDay } from '@/types'
import { DEG2RAD, H2RAD, ONE_UA_IN_KILOMETERS, RAD2DEG } from '@/constants'
import { getRadiusVector as getEarthRadiusVector } from '@/earth/coordinates'
import { Sun } from '@/sun'
import { getGeocentricEquatorialCoordinates, getRadiusVector } from './coordinates'

export function getGeocentricElongation (jd: JulianDay | number): Degree {
  const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd)
  const moonCoords = getGeocentricEquatorialCoordinates(jd)

  const decRadSun = sunCoords.declination.mul(DEG2RAD)
  const decRadMoon = moonCoords.declination.mul(DEG2RAD)
  const sins = decRadSun.sin().mul(decRadMoon.sin())

  const raRadSun = sunCoords.rightAscension.mul(H2RAD)
  const raRadMoon = moonCoords.rightAscension.mul(H2RAD)
  const coss = decRadSun.cos().mul(decRadMoon.cos()).mul((raRadSun.minus(raRadMoon)).cos())

  return Decimal.acos(sins.plus(coss)).mul(RAD2DEG)
}

/**
 * The phase angle (angle Sun-Moon-Earth)
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getPhaseAngle (jd: JulianDay | number): Degree {
  const psi = getGeocentricElongation(jd).mul(DEG2RAD)
  // Distance Earth-Moon
  const Delta = getRadiusVector(jd) // kilometer
  // Distance Earth-Sun
  const R = getEarthRadiusVector(jd).mul(ONE_UA_IN_KILOMETERS) // -> kilometer
  return Decimal.atan2(R.mul(psi.sin()), Delta.minus(R.mul(psi.cos()))).mul(RAD2DEG)
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

  const alpha0 = sunCoords.rightAscension.mul(H2RAD)
  const alpha = moonCoords.rightAscension.mul(H2RAD)
  const delta0 = sunCoords.declination.mul(DEG2RAD)
  const delta = moonCoords.declination.mul(DEG2RAD)

  const y = delta0.cos().mul((alpha0.minus(alpha)).sin())

  const x = delta0.sin().mul(delta.cos())
    .minus(delta0.cos().mul(delta.sin()).mul((alpha0.minus(alpha)).cos()))

  return Decimal.atan2(y, x).mul(RAD2DEG)
}

/**
 * The illuminated fraction of the Moon as seen from the Earth.
 * Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @returns {number}
 */
export function getIlluminatedFraction (jd: JulianDay | number): Decimal {
  const phaseAngle = getPhaseAngle(jd).mul(DEG2RAD)
  return (new Decimal(1).plus(Decimal.cos(phaseAngle))).dividedBy(2)
}

/**
 * Equatorial horizontal parallax
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEquatorialHorizontalParallax (jd: JulianDay | number): Degree {
  return Decimal.asin(new Decimal(6378.14).dividedBy(getRadiusVector(jd))).mul(RAD2DEG)
}
