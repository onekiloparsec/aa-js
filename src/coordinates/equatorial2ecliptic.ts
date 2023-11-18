/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import { Degree, EclipticCoordinates, EquatorialCoordinates, EquatorialCoordinatesNum } from '@/types'
import { ECLIPTIC_OBLIQUITY_J2000_0 } from '@/constants'
import { fmod360, fmod90 } from '@/utils'


/**
 * Ecliptic longitude from equatorial coordinates
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getEclipticLongitudeFromEquatorial (coords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                                    epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                                    highPrecision: boolean = true): Degree {
  const dcoords = {
    rightAscension: new Decimal(coords.rightAscension).degreesToRadians(),
    declination: new Decimal(coords.declination).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.atan2(
      Decimal.sin(dcoords.rightAscension).mul(Decimal.cos(depsilon))
        .plus(Decimal.tan(dcoords.declination).mul(Decimal.sin(depsilon))),
      Decimal.cos(dcoords.rightAscension)
    )
  } else {
    value = Math.atan2(
      Math.sin(dcoords.rightAscension.toNumber()) * Math.cos(depsilon.toNumber())
      + Math.tan(dcoords.declination.toNumber()) * Math.sin(depsilon.toNumber()),
      Math.cos(dcoords.rightAscension.toNumber())
    )
  }
  return fmod360(new Decimal(value).radiansToDegrees())
}

/**
 * Ecliptic latitude from equatorial coordinates
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true. * @returns {Degree}
 */
export function getEclipticLatitudeFromEquatorial (coords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                                   epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                                   highPrecision: boolean = true): Degree {
  const dcoords = {
    rightAscension: new Decimal(coords.rightAscension).degreesToRadians(),
    declination: new Decimal(coords.declination).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.asin(
      Decimal.sin(dcoords.declination).mul(Decimal.cos(depsilon))
        .minus(Decimal.cos(dcoords.declination).mul(Decimal.sin(depsilon).mul(Decimal.sin(dcoords.rightAscension))))
    )
  } else {
    value = Math.asin(
      Math.sin(dcoords.declination.toNumber()) * Math.cos(depsilon.toNumber())
      - Math.cos(dcoords.declination.toNumber()) * Math.sin(depsilon.toNumber()) * Math.sin(dcoords.rightAscension.toNumber())
    )
  }
  return fmod90(new Decimal(value).radiansToDegrees())
}

/**
 * Transform equatorial coordinates to ecliptic coordinates
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true. * @returns {Degree}
 */
export function transformEquatorialToEcliptic (coords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                               epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                               highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getEclipticLongitudeFromEquatorial(coords, epsilon, highPrecision),
    latitude: getEclipticLatitudeFromEquatorial(coords, epsilon, highPrecision)
  }
}
