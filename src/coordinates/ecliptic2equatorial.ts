/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import { Degree, EclipticCoordinates, EclipticCoordinatesNum, EquatorialCoordinates } from '@/types'
import { DEG2RAD, ECLIPTIC_OBLIQUITY_J2000_0 } from '@/constants'
import { fmod360, fmod90 } from '@/utils'

/**
 * Equatorial right ascension from ecliptic coordinates
 * @param {EclipticCoordinates | EclipticCoordinatesNum} coords The ecliptic coordinates
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} Degree (v3.2+), not HOURS (< v3.2)
 */
export function getRightAscensionFromEcliptic (coords: EclipticCoordinates | EclipticCoordinatesNum,
                                               epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                               highPrecision: boolean = true): Degree {
  if (highPrecision) {
    const dcoords = {
      longitude: new Decimal(coords.longitude).degreesToRadians(),
      latitude: new Decimal(coords.latitude).degreesToRadians()
    }
    const depsilon = new Decimal(epsilon).degreesToRadians()
    const value = Decimal.atan2(
      Decimal.sin(dcoords.longitude).mul(Decimal.cos(depsilon))
        .minus(Decimal.tan(dcoords.latitude).mul(Decimal.sin(depsilon))),
      Decimal.cos(dcoords.longitude)
    )
    return fmod360(new Decimal(value).radiansToDegrees())
  } else {
    const deg2rad = DEG2RAD.toNumber()
    const dcoords = {
      longitude: (Decimal.isDecimal(coords.longitude) ? coords.longitude.toNumber() : coords.longitude) * deg2rad,
      latitude: (Decimal.isDecimal(coords.latitude) ? coords.latitude.toNumber() : coords.latitude) * deg2rad,
    }
    const depsilon = (Decimal.isDecimal(epsilon) ? epsilon.toNumber() : epsilon) * deg2rad
    const value = Math.atan2(
      Math.sin(dcoords.longitude) * Math.cos(depsilon)
      - Math.tan(dcoords.latitude) * Math.sin(depsilon),
      Math.cos(dcoords.longitude)
    )
    return fmod360(value / deg2rad)
  }
}

/**
 * Equatorial declination from ecliptic coordinates
 * @param {EclipticCoordinates | EclipticCoordinatesNum} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (coords: EclipticCoordinates | EclipticCoordinatesNum,
                                            epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                            highPrecision: boolean = true): Degree {
  if (highPrecision) {
    const dcoords = {
      longitude: new Decimal(coords.longitude).degreesToRadians(),
      latitude: new Decimal(coords.latitude).degreesToRadians()
    }
    const depsilon = new Decimal(epsilon).degreesToRadians()
    const value = Decimal.asin(
      Decimal.sin(dcoords.latitude).mul(Decimal.cos(depsilon))
        .plus(Decimal.cos(dcoords.latitude).mul(Decimal.sin(depsilon)).mul(Decimal.sin(dcoords.longitude)))
    )
    return fmod90(new Decimal(value).radiansToDegrees())
  } else {
    const deg2rad = DEG2RAD.toNumber()
    const dcoords = {
      longitude: (Decimal.isDecimal(coords.longitude) ? coords.longitude.toNumber() : coords.longitude) * deg2rad,
      latitude: (Decimal.isDecimal(coords.latitude) ? coords.latitude.toNumber() : coords.latitude) * deg2rad,
    }
    const depsilon = (Decimal.isDecimal(epsilon) ? epsilon.toNumber() : epsilon) * deg2rad
    const value = Math.asin(
      Math.sin(dcoords.latitude) * Math.cos(depsilon)
      + Math.cos(dcoords.latitude) * Math.sin(depsilon) * Math.sin(dcoords.longitude)
    )
    return fmod90(value / deg2rad)
  }
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 * @param {EclipticCoordinates | EclipticCoordinatesNum} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 */
export function transformEclipticToEquatorial (coords: EclipticCoordinates | EclipticCoordinatesNum,
                                               epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0,
                                               highPrecision: boolean = true): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromEcliptic(coords, epsilon, highPrecision),
    declination: getDeclinationFromEcliptic(coords, epsilon, highPrecision)
  }
}
