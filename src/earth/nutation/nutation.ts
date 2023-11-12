import Decimal from '@/decimal'
import { ArcSecond, Degree, JulianDay } from '@/types'
import { getDecimalValue } from '@/sexagesimal'
import { getJulianCentury } from '@/juliandays'
import { Moon } from '@/earth/moon'
import { Sun } from '@/sun'
import { getReducedValue } from './reducers'

/**
 * Nutation in longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInLongitude (jd: JulianDay | number, highPrecision: boolean = true): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd, highPrecision)
  const M = Sun.getMeanAnomaly(jd, highPrecision)
  const Mprime = Moon.getMeanAnomaly(jd, highPrecision)
  const F = Moon.getArgumentOfLatitude(jd, highPrecision)
  const omega = Moon.getMeanLongitudeAscendingNode(jd, highPrecision)
  return getReducedValue(T, D, M, Mprime, F, omega, 'sin', highPrecision)
}

/**
 * Nutation in obliquity
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInObliquity (jd: JulianDay | number, highPrecision: boolean = true): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd, highPrecision)
  const M = Sun.getMeanAnomaly(jd, highPrecision)
  const Mprime = Moon.getMeanAnomaly(jd, highPrecision)
  const F = Moon.getArgumentOfLatitude(jd, highPrecision)
  const omega = Moon.getMeanLongitudeAscendingNode(jd, highPrecision)
  return getReducedValue(T, D, M, Mprime, F, omega, 'cos', highPrecision)
}

/**
 * Mean obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The mean obliquity is NOT corrected for aberration and nutation of
 * the Earth.
 * @see getTrueObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanObliquityOfEcliptic (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  if (highPrecision) {
    const U = (new Decimal(jd).minus('2451545')).dividedBy('3652500')
    return getDecimalValue(23, 26, 21.448)
      .minus(getDecimalValue(0, 0, 4680.93).mul(U))
      .minus(getDecimalValue(0, 0, 1.55).mul(U.pow(2)))
      .plus(getDecimalValue(0, 0, 1999.25).mul(U.pow(3)))
      .minus(getDecimalValue(0, 0, 51.38).mul(U.pow(4)))
      .minus(getDecimalValue(0, 0, 249.67).mul(U.pow(5)))
      .minus(getDecimalValue(0, 0, 39.05).mul(U.pow(6)))
      .plus(getDecimalValue(0, 0, 7.12).mul(U.pow(7)))
      .plus(getDecimalValue(0, 0, 27.87).mul(U.pow(8)))
      .plus(getDecimalValue(0, 0, 5.79).mul(U.pow(9)))
      .plus(getDecimalValue(0, 0, 2.45).mul(U.pow(10)))
  } else {
    const njd = Decimal.isDecimal(jd) ? jd.toNumber() : jd
    const U = (njd - 2451545) / 3652500
    const value = getDecimalValue(23, 26, 21.448).toNumber()
      - getDecimalValue(0, 0, 4680.93).toNumber() * U
      - getDecimalValue(0, 0, 1.55).toNumber() * Math.pow(U, 2)
      + getDecimalValue(0, 0, 1999.25).toNumber() * Math.pow(U, 3)
      - getDecimalValue(0, 0, 51.38).toNumber() * Math.pow(U, 4)
      - getDecimalValue(0, 0, 249.67).toNumber() * Math.pow(U, 5)
      - getDecimalValue(0, 0, 39.05).toNumber() * Math.pow(U, 6)
      + getDecimalValue(0, 0, 7.12).toNumber() * Math.pow(U, 7)
      + getDecimalValue(0, 0, 27.87).toNumber() * Math.pow(U, 8)
      + getDecimalValue(0, 0, 5.79).toNumber() * Math.pow(U, 9)
      + getDecimalValue(0, 0, 2.45).toNumber() * Math.pow(U, 10)
    return new Decimal(value)
  }
}

/**
 * True obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The true obliquity is equal to the mean obliquity corrected by
 * aberration and nutation of the Earth.
 * @see getMeanObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getTrueObliquityOfEcliptic (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  return getMeanObliquityOfEcliptic(jd, highPrecision)
    .plus(getNutationInObliquity(jd, highPrecision).dividedBy(3600))
}

