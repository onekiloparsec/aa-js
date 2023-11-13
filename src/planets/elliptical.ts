import Decimal from '@/decimal'
import { ONE, PI, THREE, TWO } from '@/constants'
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
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getLightTimeFromDistance } from '@/distances'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'

/** @private */
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

/** @private */
export function getPlanetDistanceDetailsFromEarth (jd: JulianDay | number,
                                                   eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                   eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                   radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EllipticalDistance {
  // Calculate the position of the Earth first
  const earthCoords = {
    L: Earth.getEclipticLongitude(jd).degreesToRadians(),
    B: Earth.getEclipticLatitude(jd).degreesToRadians(),
    R: Earth.getRadiusVector(jd)
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
      L: eclipticLongitudeFunc(JD0).degreesToRadians(),
      B: eclipticLatitudeFunc(JD0).degreesToRadians(),
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

/** @private */
export function getPlanetGeocentricDistance (jd: JulianDay | number,
                                             eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): AstronomicalUnit {
  return getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc).Delta
}


/** @private */
export function getPlanetGeocentricEclipticCoordinates (jd: JulianDay | number,
                                                        eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EclipticCoordinates {
  const details = getPlanetDistanceDetailsFromEarth(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc)

  return {
    longitude: fmod360(Decimal.atan2(details.y, details.x).radiansToDegrees()),
    latitude: fmod90(Decimal.atan2(details.z, Decimal.sqrt(details.x.pow(2).plus(details.y.pow(2)))).radiansToDegrees())
  }
}

/** @private */
export function getPlanetApparentGeocentricEclipticCoordinates (jd: JulianDay | number,
                                                                eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                                eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                                radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EclipticCoordinates {
  const geocentricEclipticCoordinates = getPlanetGeocentricEclipticCoordinates(jd, eclipticLongitudeFunc, eclipticLatitudeFunc, radiusVectorFunc)

  // Adjust for Aberration
  const aberration = Earth.getAnnualEclipticAberration(jd, geocentricEclipticCoordinates)
  geocentricEclipticCoordinates.longitude = (geocentricEclipticCoordinates.longitude as Degree).plus(aberration.DeltaLongitude)
  geocentricEclipticCoordinates.latitude = (geocentricEclipticCoordinates.latitude as Degree).plus(aberration.DeltaLatitude)

  // Convert to the FK5 system
  const deltaLong = getCorrectionInLongitude(jd, geocentricEclipticCoordinates.longitude, geocentricEclipticCoordinates.latitude)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(deltaLong)

  const deltaLat = getCorrectionInLatitude(jd, geocentricEclipticCoordinates.longitude)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(deltaLat)

  // Correct for nutation
  const longitudeNutation = Earth.getNutationInLongitude(jd)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(longitudeNutation.dividedBy(3600))

  return geocentricEclipticCoordinates
}

/** @private */
export function getPlanetInstantaneousVelocity (r: AstronomicalUnit | number, a: AstronomicalUnit | number): KilometerPerSecond {
  return new Decimal('42.1219')
    .mul(Decimal.sqrt(ONE.dividedBy(r).minus(ONE.dividedBy(TWO.mul(a)))))
}

/** @private */
export function getPlanetVelocityAtPerihelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  return new Decimal('29.7847')
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(ONE.plus(e)
        .dividedBy(ONE.minus(e)))))
}

/** @private */
export function getPlanetVelocityAtAphelion (e: Decimal | number, a: AstronomicalUnit | number): KilometerPerSecond {
  return new Decimal('29.7847')
    .dividedBy(Decimal.sqrt(a)
      .mul(Decimal.sqrt(ONE.minus(e)
        .dividedBy(ONE.plus(e)))))
}

/** @private */
export function getPlanetLengthOfEllipse (e: Decimal | number, a: AstronomicalUnit | number): AstronomicalUnit {
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
