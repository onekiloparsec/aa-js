import { ArcSecond, Degree, JulianDay } from '@/types'
import { getDecimalValue } from '@/sexagesimal'
import { getJulianCentury } from '@/juliandays'
import { Moon } from '@/earth/moon'
import { Sun } from '@/sun'
import { getReducedValue } from './reducers'

/**
 * Nutation in longitude
 * @param {JulianDay} jd The julian day
 * @return {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInLongitude (jd: JulianDay): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd)
  const M = Sun.getMeanAnomaly(jd)
  const Mprime = Moon.getMeanAnomaly(jd)
  const F = Moon.getArgumentOfLatitude(jd)
  const omega = Moon.getMeanLongitudeAscendingNode(jd)
  return getReducedValue(T, D, M, Mprime, F, omega, 'sin}

/**
 * Nutation in obliquity
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInObliquity (jd: JulianDay): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd)
  const M = Sun.getMeanAnomaly(jd)
  const Mprime = Moon.getMeanAnomaly(jd)
  const F = Moon.getArgumentOfLatitude(jd)
  const omega = Moon.getMeanLongitudeAscendingNode(jd)
  return getReducedValue(T, D, M, Mprime, F, omega, 'cos}

/**
 * Mean obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The mean obliquity is NOT corrected for aberration and nutation of
 * the Earth.
 * @see getTrueObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanObliquityOfEcliptic (jd: JulianDay): Degree {
  const U = (jd - 2451545) / 3652500
  return getDecimalValue(23, 26, 21.448)
    - getDecimalValue(0, 0, 4680.93) * U
    - getDecimalValue(0, 0, 1.55) * Math.pow(U, 2)
    + getDecimalValue(0, 0, 1999.25) * Math.pow(U, 3)
    - getDecimalValue(0, 0, 51.38) * Math.pow(U, 4)
    - getDecimalValue(0, 0, 249.67) * Math.pow(U, 5)
    - getDecimalValue(0, 0, 39.05) * Math.pow(U, 6)
    + getDecimalValue(0, 0, 7.12) * Math.pow(U, 7)
    + getDecimalValue(0, 0, 27.87) * Math.pow(U, 8)
    + getDecimalValue(0, 0, 5.79) * Math.pow(U, 9)
    + getDecimalValue(0, 0, 2.45) * Math.pow(U, 10)
}

/**
 * True obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The true obliquity is equal to the mean obliquity corrected by
 * aberration and nutation of the Earth.
 * @see getMeanObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getTrueObliquityOfEcliptic (jd: JulianDay): Degree {
  return getMeanObliquityOfEcliptic(jd) + getNutationInObliquity(jd) / 3600
}

