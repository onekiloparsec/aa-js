import Decimal from '@/decimal'
import { ArcSecond, Degree, JulianDay } from '@/types'
import { getDecimalValue } from '@/sexagesimal'
import { getJulianCentury } from '@/juliandays'
import { Sun } from '@/sun'
import { Moon } from '@/earth/moon'
import { gNutationCoefficients } from './coefficients'

/**
 * Nutation in longitude
 * @param {JulianDay} jd The julian day
 * @return {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInLongitude (jd: JulianDay | number): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd)
  const M = Sun.getMeanAnomaly(jd)
  const Mprime = Moon.getMeanAnomaly(jd)
  const F = Moon.getArgumentOfLatitude(jd)
  const omega = Moon.getMeanLongitudeAscendingNode(jd)

  return gNutationCoefficients.reduce((sum, val) => {
    const argument = val.D.mul(D)
      .plus(val.M.mul(M))
      .plus(val.Mprime.mul(Mprime))
      .plus(val.F.mul(F))
      .plus(val.omega.mul(omega))

    return sum.plus(
      (val.sincoeff1.plus(val.sincoeff2.mul(T)))
        .mul(Decimal.sin(argument.degreesToRadians()).mul(0.0001))
    )
  }, new Decimal(0))
}

/**
 * Nutation in obliquity
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInObliquity (jd: JulianDay | number): ArcSecond {
  const T = getJulianCentury(jd)
  const D = Moon.getMeanElongation(jd)
  const M = Sun.getMeanAnomaly(jd)
  const Mprime = Moon.getMeanAnomaly(jd)
  const F = Moon.getArgumentOfLatitude(jd)
  const omega = Moon.getMeanLongitudeAscendingNode(jd)

  return gNutationCoefficients.reduce((sum, val) => {
    const argument = val.D.mul(D)
      .plus(val.M.mul(M))
      .plus(val.Mprime.mul(Mprime))
      .plus(val.F.mul(F))
      .plus(val.omega.mul(omega))

    return sum.plus(
      (val.coscoeff1.plus(val.coscoeff2.mul(T)))
        .mul(Decimal.cos(argument.degreesToRadians()).mul(0.0001))
    )
  }, new Decimal(0))
}

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
export function getMeanObliquityOfEcliptic (jd: JulianDay | number): Degree {
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
export function getTrueObliquityOfEcliptic (jd: JulianDay | number): Degree {
  return getMeanObliquityOfEcliptic(jd).plus(getNutationInObliquity(jd).dividedBy(3600))
}

