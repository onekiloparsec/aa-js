import { AstronomicalUnit, Day, Degree, EclipticCoordinates, JulianDay, KilometerPerSecond } from '@/types'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { getNutationInLongitude } from '@/nutation'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getEclipticAberration } from '@/aberration'
import { getDecimal } from '@/sexagesimal'
import { getLightTimeFromDistance } from '@/distances'
import { MapTo0To360Range } from '@/utils'
import {
  getEclipticLatitude as earthGetEclipticLatitude,
  getEclipticLongitude as earthGetEclipticLongitude,
  getRadiusVector as earthGetRadiusVector
} from '@/earth/coordinates'

const dsin = (deg: Degree): Degree => Math.sin(deg * DEG2RAD)
const dcos = (deg: Degree): Degree => Math.cos(deg * DEG2RAD)
const datan2 = (y: number, x: number): Degree => Math.atan2(y, x) * RAD2DEG
const abs = Math.abs
const sqrt = Math.sqrt

export type EllipticalDistance = {
  x: AstronomicalUnit
  y: AstronomicalUnit
  z: AstronomicalUnit
  Delta: AstronomicalUnit
  tau: Day
}

function getPlanetDistanceDetailsFromEarth (jd: JulianDay,
                                            eclipticLongitudeFunc: Function,
                                            eclipticLatitudeFunc: Function,
                                            radiusVectorFunc: Function): EllipticalDistance {
  // Calculate the position of the Earth first
  const earthCoords = {
    L: earthGetEclipticLongitude(jd),
    B: earthGetEclipticLatitude(jd),
    R: earthGetRadiusVector(jd)
  }

  // Iterate to find the positions adjusting for light-time correction if required
  let continueIterations = true
  let firstIterationDone = false

  let coords = { L: 0, B: 0, R: 0 }
  let previousCoords = { L: 0, B: 0, R: 0 }
  const distanceDetails = { x: 0, y: 0, z: 0, Delta: 0, tau: 0 }

  let JD0 = jd
  while (continueIterations) {
    coords = {
      L: eclipticLongitudeFunc(JD0),
      B: eclipticLatitudeFunc(JD0),
      R: radiusVectorFunc(JD0)
    }

    if (firstIterationDone) {
      continueIterations = ((abs(coords.L - previousCoords.L) > 0.00001) || (abs(coords.B - previousCoords.B) > 0.00001) || (abs(coords.R - previousCoords.R) > 0.000001))
      previousCoords = { ...coords }
    } else {
      firstIterationDone = true
    }

    // Calculate the new value
    if (continueIterations) {
      distanceDetails.x = coords.R * dcos(coords.B) * dcos(coords.L) - earthCoords.R * dcos(earthCoords.B) * dcos(earthCoords.L)
      distanceDetails.y = coords.R * dcos(coords.B) * dsin(coords.L) - earthCoords.R * dcos(earthCoords.B) * dsin(earthCoords.L)
      distanceDetails.z = coords.R * dsin(coords.B) - earthCoords.R * dsin(earthCoords.B)
      distanceDetails.Delta = sqrt(distanceDetails.x * distanceDetails.x + distanceDetails.y * distanceDetails.y + distanceDetails.z * distanceDetails.z)
      distanceDetails.tau = getLightTimeFromDistance(distanceDetails.Delta)

      // Prepare for the next loop
      JD0 = jd - distanceDetails.tau
    }
  }

  return distanceDetails
}

export function getPlanetGeocentricDistance (jd: JulianDay,
                                             eclipticLongitudeFunc: Function,
                                             eclipticLatitudeFunc: Function,
                                             radiusVectorFunc: Function): AstronomicalUnit {
  const details = getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc)
  return sqrt(details.x * details.x + details.y * details.y + details.z * details.z)
}


export function getPlanetGeocentricEclipticCoordinates (jd: JulianDay,
                                                        eclipticLongitudeFunc: Function,
                                                        eclipticLatitudeFunc: Function,
                                                        radiusVectorFunc: Function): EclipticCoordinates {
  const details = getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc)

  const geocentricEclipticCoordinates: EclipticCoordinates = {
    longitude: MapTo0To360Range(datan2(details.y, details.x)) as Degree,
    latitude: (datan2(details.z, sqrt(details.x * details.x + details.y * details.y))) as Degree
  }

  // Adjust for Aberration
  const aberration = getEclipticAberration(jd,
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude
  )
  geocentricEclipticCoordinates.longitude += aberration.X
  geocentricEclipticCoordinates.latitude += aberration.Y

  // Convert to the FK5 system
  const deltaLong = getCorrectionInLongitude(jd,
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude
  )
  const deltaLat = getCorrectionInLatitude(jd, geocentricEclipticCoordinates.longitude)
  geocentricEclipticCoordinates.longitude += deltaLong
  geocentricEclipticCoordinates.latitude += deltaLat

  // Correct for nutation
  const longitudeNutation = getNutationInLongitude(jd)
  geocentricEclipticCoordinates.longitude += getDecimal(0, 0, longitudeNutation, longitudeNutation >= 0)

  return geocentricEclipticCoordinates
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {AstronomicalUnit} r The radius vector, or distance of the object from the Sun.
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetInstantaneousVelocity (r: AstronomicalUnit, a: AstronomicalUnit): KilometerPerSecond {
  return 42.1219 * sqrt((1 / r) - (1 / (2 * a)))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtPerihelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / sqrt(a) * sqrt((1 + e) / (1 - e))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtAphelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / sqrt(a) * sqrt((1 - e) / (1 + e))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getPlanetLengthOfEllipse (e: number, a: AstronomicalUnit): AstronomicalUnit {
  const b = a * sqrt(1 - e * e)
  return Math.PI * (3 * (a + b) - sqrt((a + 3 * b) * (3 * a + b)))
}
