import Decimal from 'decimal.js'
import { DEG2RAD, RAD2DEG } from '@/constants'
import {
  AstronomicalUnit,
  Day,
  EclipticCoordinates,
  JulianDay,
  KilometerPerSecond,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  SingleCoordinateDegreeAtJulianDayFunction
} from '@/types'
import { getNutationInLongitude } from '@/nutation'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getEclipticAberration } from '@/aberration'
import { getLightTimeFromDistance } from '@/distances'
import { fmod360, fmod90 } from '@/utils'
import {
  getEclipticLatitude as earthGetEclipticLatitude,
  getEclipticLongitude as earthGetEclipticLongitude,
  getRadiusVector as earthGetRadiusVector
} from '@/earth/coordinates'

export type EllipticalDistance = {
  x: AstronomicalUnit
  y: AstronomicalUnit
  z: AstronomicalUnit
  Delta: AstronomicalUnit
  tau: Day
}

function getPlanetDistanceDetailsFromEarth (jd: JulianDay | number,
                                            eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                            eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                            radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EllipticalDistance {
  // Calculate the position of the Earth first
  const earthCoords = {
    L: earthGetEclipticLongitude(jd).mul(DEG2RAD),
    B: earthGetEclipticLatitude(jd).mul(DEG2RAD),
    R: earthGetRadiusVector(jd)
  }

  // Iterate to find the positions adjusting for light-time correction if required
  let continueIterations = true
  let firstIterationDone = false

  let coords = { L: new Decimal(0), B: new Decimal(0), R: new Decimal(0) }
  let previousCoords = { L: new Decimal(0), B: new Decimal(0), R: new Decimal(0) }
  const distanceDetails = {
    x: new Decimal(0),
    y: new Decimal(0),
    z: new Decimal(0),
    Delta: new Decimal(0),
    tau: new Decimal(0)
  }

  let JD0 = new Decimal(jd)
  while (continueIterations) {
    coords = {
      L: eclipticLongitudeFunc(JD0).mul(DEG2RAD),
      B: eclipticLatitudeFunc(JD0).mul(DEG2RAD),
      R: radiusVectorFunc(JD0)
    }

    if (firstIterationDone) {
      continueIterations = (
        (Decimal.abs(coords.L.minus(previousCoords.L)).greaterThan(0.00001)) ||
        (Decimal.abs(coords.B.minus(previousCoords.B)).greaterThan(0.00001)) ||
        (Decimal.abs(coords.R.minus(previousCoords.R)).greaterThan(0.000001))
      )
      previousCoords = { ...coords }
    } else {
      firstIterationDone = true
    }

    // Calculate the new value
    if (continueIterations) {
      distanceDetails.x = coords.R.mul(coords.B.cos()).mul(coords.L.cos())
        .minus(earthCoords.R.mul(earthCoords.B.cos()).mul(earthCoords.L.cos()))

      distanceDetails.y = coords.R.mul(coords.B.cos()).mul(coords.L.sin())
        .minus(earthCoords.R.mul(earthCoords.B.cos()).mul(earthCoords.L.sin()))

      distanceDetails.z = coords.R.mul(coords.B.sin())
        .minus(earthCoords.R.mul(earthCoords.B.sin()))

      distanceDetails.Delta = distanceDetails.x.pow(2)
        .plus(distanceDetails.y.pow(2))
        .plus(distanceDetails.z.pow(2))
        .sqrt()

      distanceDetails.tau = getLightTimeFromDistance(distanceDetails.Delta)

      // Prepare for the next loop
      JD0 = new Decimal(jd).minus(distanceDetails.tau)
    }
  }

  return distanceDetails
}

export function getPlanetGeocentricDistance (jd: JulianDay | number,
                                             eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): AstronomicalUnit {
  return getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc).Delta
}


export function getPlanetGeocentricEclipticCoordinates (jd: JulianDay | number,
                                                        eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EclipticCoordinates {
  const details = getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc)

  const geocentricEclipticCoordinates: EclipticCoordinates = {
    longitude: fmod360(Decimal.atan2(details.y, details.x).mul(RAD2DEG)),
    latitude: fmod90(Decimal.atan2(details.z, details.x.pow(2).plus(details.y.pow(2)).sqrt()).mul(RAD2DEG))
  }

  // Adjust for Aberration
  const aberration = getEclipticAberration(jd,
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude
  )
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(aberration.X)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(aberration.Y)

  // Convert to the FK5 system
  const deltaLong = getCorrectionInLongitude(jd,
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude
  )
  const deltaLat = getCorrectionInLatitude(jd, geocentricEclipticCoordinates.longitude)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(deltaLong)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(deltaLat)

  // Correct for nutation
  const longitudeNutation = getNutationInLongitude(jd)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude
    .plus(longitudeNutation.dividedBy(3600))

  return geocentricEclipticCoordinates
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {AstronomicalUnit} r The radius vector, or distance of the object from the Sun.
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetInstantaneousVelocity (r: AstronomicalUnit | number, a: AstronomicalUnit | number): KilometerPerSecond {
  const one = new Decimal(1)
  const two = new Decimal(2)
  return new Decimal(42.1219).mul(Decimal.sqrt(one.dividedBy(r).minus(one.dividedBy(two.mul(a)))))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtPerihelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  const one = new Decimal(1)
  return new Decimal(29.7847)
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(one.plus(e)
        .dividedBy(one.minus(e)))))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtAphelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  const one = new Decimal(1)
  return new Decimal(29.7847)
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(one.minus(e)
        .dividedBy(one.plus(e)))))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getPlanetLengthOfEllipse (e: Decimal | number, a: AstronomicalUnit): AstronomicalUnit {
  const PI = Decimal.acos(-1)
  const one = new Decimal(1)
  const three = new Decimal(3)
  const de = new Decimal(e)
  const da = new Decimal(a)
  const db = da.mul(Decimal.sqrt(one.minus(de.pow(2))))
  return PI.mul(
    three.mul(da.plus(db))
      .minus(Decimal.sqrt(
        da.plus(three.mul(db))
          .mul(three.mul(a).plus(db)))
      )
  )
}
