import Decimal from '@/decimal'
import { DEG2RAD, ONE, PI, RAD2DEG, THREE, TWO } from '@/constants'
import {
  AstronomicalUnit,
  Day,
  Degree,
  EclipticCoordinates,
  JulianDay,
  KilometerPerSecond,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  SingleCoordinateDegreeAtJulianDayFunction
} from '@/types'
import { getNutationInLongitude } from '@/earth/nutation'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getAnnualEclipticAberration } from '@/earth/aberration'
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
  l: Degree
  b: Degree
  r: AstronomicalUnit
}

export function getPlanetDistanceDetailsFromEarth (jd: JulianDay | number,
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
    tau: new Decimal(0),
    l: new Decimal(0),
    b: new Decimal(0),
    r: new Decimal(0)
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

      distanceDetails.l = coords.L
      distanceDetails.b = coords.B
      distanceDetails.r = coords.R

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
    latitude: fmod90(Decimal.atan2(details.z, Decimal.sqrt(details.x.pow(2).plus(details.y.pow(2)))).mul(RAD2DEG))
  }

  // Adjust for Aberration
  const aberration = getAnnualEclipticAberration(jd,
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude
  )
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(aberration.DeltaLongitude)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(aberration.DeltaLatitude)

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
  return new Decimal(42.1219).mul(Decimal.sqrt(ONE.dividedBy(r).minus(ONE.dividedBy(TWO.mul(a)))))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtPerihelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  return new Decimal(29.7847)
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(ONE.plus(e)
        .dividedBy(ONE.minus(e)))))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {KilometerPerSecond} The velocity
 */
export function getPlanetVelocityAtAphelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  return new Decimal(29.7847)
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(ONE.minus(e)
        .dividedBy(ONE.plus(e)))))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {number} e The eccentricity of the object's orbit
 * @param  {AstronomicalUnit} a The semi-major axis of the object orbit.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getPlanetLengthOfEllipse (e: Decimal | number, a: AstronomicalUnit): AstronomicalUnit {
  const de = new Decimal(e)
  const da = new Decimal(a)
  const db = da.mul(Decimal.sqrt(ONE.minus(de.pow(2))))
  return PI.mul(
    THREE.mul(da.plus(db))
      .minus(Decimal.sqrt(
        da.plus(THREE.mul(db))
          .mul(THREE.mul(a).plus(db)))
      )
  )
}
