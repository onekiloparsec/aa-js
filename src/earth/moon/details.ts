import Decimal from '@/decimal'
import { Sun } from '@/sun'
import { ONE_UA_IN_KILOMETERS } from '@/constants'
import { ArcSecond, Degree, Equinox, JulianDay, Kilometer, Obliquity, Radian } from '@/types'
import { getRadiusVector as getEarthRadiusVector } from '@/earth/coordinates'
import { getGeocentricEquatorialCoordinates, getRadiusVectorInKilometer } from './coordinates'

/**
 * The geocentric elongation of the moon
 * @param {JulianDay | number} jd
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricElongation (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd, Equinox.MeanOfTheDate, highPrecision)
  const moonCoords = getGeocentricEquatorialCoordinates(jd, Obliquity.Mean, highPrecision)
  
  const decRadSun = sunCoords.declination.degreesToRadians()
  const decRadMoon = moonCoords.declination.degreesToRadians()
  
  const raRadSun = sunCoords.rightAscension.degreesToRadians()
  const raRadMoon = moonCoords.rightAscension.degreesToRadians()
  
  if (highPrecision) {
    const sins = decRadSun.sin().mul(decRadMoon.sin())
    const coss = decRadSun.cos().mul(decRadMoon.cos()).mul(Decimal.cos(raRadSun.minus(raRadMoon)))
    // See first equation 48.2 of AA, p. 345.
    return Decimal.acos(sins.plus(coss)).radiansToDegrees()
  } else {
    const sins = Math.sin(decRadSun.toNumber()) * Math.sin(decRadMoon.toNumber())
    const coss = Math.cos(decRadSun.toNumber()) * Math.cos(decRadMoon.toNumber()) * Math.cos(raRadSun.toNumber() - raRadMoon.toNumber())
    // See first equation 48.2 of AA, p. 345.
    return new Decimal(Math.acos(sins + coss)).radiansToDegrees()
  }
}

/**
 * The phase angle (angle Sun-Moon-Earth)
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Earth
 */
export function getPhaseAngle (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  // Geocentric elongation of the Moon from the Sun
  const psi: Radian = getGeocentricElongation(jd, highPrecision).degreesToRadians()
  // Distance Earth-Moon
  const Delta: Kilometer = getRadiusVectorInKilometer(jd, highPrecision) // kilometer!!!
  // Distance Earth-Sun
  const R: Kilometer = getEarthRadiusVector(jd, highPrecision).mul(ONE_UA_IN_KILOMETERS)
  return Decimal.atan2(R.mul(psi.sin()), Delta.minus(R.mul(psi.cos()))).radiansToDegrees()
}

/**
 * The position angle of the bright limb.
 * The position angle of the Moon's bright limb is the position angle of the midpoint of the illuminated limb of
 * the Moon, reckoned eastward from the North Point of the disk (not from the axis of rotation of the lunar globe).
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Earth
 */
export function getPositionAngleOfTheBrightLimb (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd, Equinox.MeanOfTheDate, highPrecision)
  const moonCoords = getGeocentricEquatorialCoordinates(jd, Obliquity.Mean, highPrecision)
  
  const alpha0 = (sunCoords.rightAscension as Degree).degreesToRadians()
  const alpha = (moonCoords.rightAscension as Degree).degreesToRadians()
  const delta0 = (sunCoords.declination as Degree).degreesToRadians()
  const delta = (moonCoords.declination as Degree).degreesToRadians()
  
  const y = delta0.cos().mul((alpha0.minus(alpha)).sin())
  
  const x = delta0.sin().mul(delta.cos())
    .minus(delta0.cos().mul(delta.sin()).mul((alpha0.minus(alpha)).cos()))
  
  return Decimal.atan2(y, x).radiansToDegrees()
}

/**
 * The illuminated fraction of the Moon as seen from the Earth.
 * Between 0 and 1.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {number}
 * @memberof module:Earth
 */
export function getIlluminatedFraction (jd: JulianDay | number, highPrecision: boolean = true): Decimal {
  const phaseAngle = getPhaseAngle(jd, highPrecision).degreesToRadians()
  return (new Decimal(1).plus(Decimal.cos(phaseAngle))).dividedBy(2)
}

/**
 * Equatorial horizontal parallax
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEquatorialHorizontalParallax (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  return Decimal.asin(new Decimal('6378.14').dividedBy(getRadiusVectorInKilometer(jd, highPrecision))).radiansToDegrees()
}

/**
 * Geocentric Moon semi-diameter.
 * Error is less than 0.0005 arcsecond (see AA p391).
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricSemiDiameter (jd: JulianDay | number, highPrecision: boolean = true): ArcSecond {
  return new Decimal('358_473_400').dividedBy(getRadiusVectorInKilometer(jd, highPrecision))
}
