import { AstronomicalUnit, EllipticalGeocentricDetails, JulianDay, KilometerPerSecond } from 'aa.js'
import { DEG2RAD, RAD2DEG } from './constants'
import { transformEclipticToEquatorial } from './coordinates'
import { getNutationInLongitude, getTrueObliquityOfEcliptic } from './nutation'
import { getCorrectionInLatitude, getCorrectionInLongitude } from './fk5'
import { getEclipticAberration } from './aberration'
import { getDecimal } from './sexagesimal'
import * as earth from './earth'
import { MapTo0To360Range } from './utils'

export function getDistanceToLightTime (distance: number): number {
  return distance * 0.0057755183
}

const cos = Math.cos
const sin = Math.sin
const abs = Math.abs
const sqrt = Math.sqrt
const atan2 = Math.atan2

export function getEllipticalDetails (jd: JulianDay,
                                      eclipticLongitudeFunc: Function,
                                      eclipticLatitudeFunc: Function,
                                      radiusVectorFunc: Function,
                                      isSun: boolean = false): EllipticalGeocentricDetails {
  // Calculate the position of the earth first
  let JD0 = jd
  const L0 = earth.getEclipticLongitude(JD0) * DEG2RAD
  const B0 = earth.getEclipticLatitude(JD0) * DEG2RAD
  const R0 = earth.getRadiusVector(JD0)
  const cosB0 = cos(B0)

  // Iterate to find the positions adjusting for light-time correction if required
  let L = 0
  let B = 0
  let R = 0

  let bRecalc = true
  let bFirstRecalc = true

  let LPrevious = 0
  let BPrevious = 0
  let RPrevious = 0

  while (bRecalc) {
    L = eclipticLongitudeFunc(JD0)
    B = eclipticLatitudeFunc(JD0)
    R = radiusVectorFunc(JD0)

    if (!bFirstRecalc) {
      bRecalc = ((abs(L - LPrevious) > 0.00001) || (abs(B - BPrevious) > 0.00001) || (abs(R - RPrevious) > 0.000001))
      LPrevious = L
      BPrevious = B
      RPrevious = R
    } else {
      bFirstRecalc = false
    }

    //Calculate the new value
    if (bRecalc) {
      let Lrad = L * DEG2RAD
      let Brad = B * DEG2RAD
      let cosB = cos(Brad)
      let cosL = cos(Lrad)
      let x = R * cosB * cosL - R0 * cosB0 * cos(L0)
      let y = R * cosB * sin(Lrad) - R0 * cosB0 * sin(L0)
      let z = R * sin(Brad) - R0 * sin(B0)
      let distance = sqrt(x * x + y * y + z * z)

      //Prepare for the next loop around
      JD0 = jd - getDistanceToLightTime(distance)
    }
  }

  let x = 0
  let y = 0
  let z = 0

  if (!isSun) {
    let Lrad = DEG2RAD * L
    let Brad = DEG2RAD * B
    let cosB = cos(Brad)
    let cosL = cos(Lrad)

    x = R * cosB * cosL - R0 * cosB0 * cos(L0)
    y = R * cosB * sin(Lrad) - R0 * cosB0 * sin(L0)
    z = R * sin(Brad) - R0 * sin(B0)
  } else {
    x = -R0 * cosB0 * cos(L0)
    y = -R0 * cosB0 * sin(L0)
    z = -R0 * sin(B0)
  }

  let x2 = x * x
  let y2 = y * y
  const apparentGeocentricDistance = sqrt(x2 + y2 + z * z)

  let apparentLightTime = getDistanceToLightTime(apparentGeocentricDistance)
  let apparentGeocentricEclipticCoordinates = {
    longitude: MapTo0To360Range(RAD2DEG * atan2(y, x)),
    latitude: RAD2DEG * (atan2(z, sqrt(x2 + y2))),
  }

  // Adjust for Aberration
  let aberration = getEclipticAberration(
    jd,
    apparentGeocentricEclipticCoordinates.longitude,
    apparentGeocentricEclipticCoordinates.latitude
  )
  apparentGeocentricEclipticCoordinates.longitude += aberration.X
  apparentGeocentricEclipticCoordinates.latitude += aberration.Y

  // Convert to the FK5 system
  let deltaLong = getCorrectionInLongitude(
    jd,
    apparentGeocentricEclipticCoordinates.longitude,
    apparentGeocentricEclipticCoordinates.latitude
  )
  let deltaLat = getCorrectionInLatitude(jd, apparentGeocentricEclipticCoordinates.longitude,)
  apparentGeocentricEclipticCoordinates.longitude += deltaLong
  apparentGeocentricEclipticCoordinates.latitude += deltaLat

  // Correct for nutation
  let longitudeNutation = getNutationInLongitude(jd)
  apparentGeocentricEclipticCoordinates.longitude += getDecimal(0, 0, longitudeNutation, longitudeNutation >= 0)

  // Convert to RA and Dec
  const epsilon = getTrueObliquityOfEcliptic(jd)
  let apparentGeocentricEquatorialCoordinates = transformEclipticToEquatorial(
    apparentGeocentricEclipticCoordinates.longitude,
    apparentGeocentricEclipticCoordinates.latitude,
    epsilon
  )

  return {
    apparentLightTime,
    apparentGeocentricDistance,
    apparentGeocentricEclipticCoordinates,
    apparentGeocentricEquatorialCoordinates
  }
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {AstronomicalUnit} r The radius vector, or distance of the object from the Sun.
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getInstantaneousVelocity (r: AstronomicalUnit, a: AstronomicalUnit): KilometerPerSecond {
  return 42.1219 * sqrt((1 / r) - (1 / (2 * a)));
}

/**
 * Computes the object's velocity at perihelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getVelocityAtPerihelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / sqrt(a) * sqrt((1 + e) / (1 - e));
}

/**
 * Computes the object's velocity at aphelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getVelocityAtAphelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / sqrt(a) * sqrt((1 - e) / (1 + e));
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getLengthOfEllipse (e: number, a: AstronomicalUnit): AstronomicalUnit {
  const b = a * sqrt(1 - e * e);
  return Math.PI * (3 * (a + b) - sqrt((a + 3 * b) * (3 * a + b)));
}
