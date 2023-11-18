import Decimal from '@/decimal'
import { ONE, PI, RAD2DEG, THREE, TWO } from '@/constants'
import {
  AstronomicalUnit,
  Day,
  EclipticCoordinates,
  Equinox,
  JulianDay,
  KilometerPerSecond,
  QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
  Radian,
  SingleCoordinateDegreeAtJulianDayWithPrecisionFunction
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
  l: Radian
  b: Radian
  r: AstronomicalUnit
}

/** @private */
export type EllipticalDistanceNum = {
  x: number
  y: number
  z: number
  Delta: number
  tau: number
  l: number
  b: number
  r: number
}

/** @private */
export function getPlanetDistanceDetailsFromEarth (jd: JulianDay | number,
                                                   eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                   eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                   radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
                                                   highPrecision: boolean = true): EllipticalDistance | EllipticalDistanceNum {
  // Calculate the position of the Earth first
  const earthCoords = {
    L: Earth.getEclipticLongitude(jd, Equinox.MeanOfTheDate, highPrecision).degreesToRadians(),
    B: Earth.getEclipticLatitude(jd, Equinox.MeanOfTheDate, highPrecision).degreesToRadians(),
    R: Earth.getRadiusVector(jd, highPrecision)
  }

  // Iterate to find the positions adjusting for light-time correction if required
  let continueIterations = true
  let firstIterationDone = false
  let previousCoordsNum = { L: 0, B: 0, R: 0 }

  if (highPrecision) {
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
      let coords = {
        L: eclipticLongitudeFunc(JD0, highPrecision).degreesToRadians(),
        B: eclipticLatitudeFunc(JD0, highPrecision).degreesToRadians(),
        R: radiusVectorFunc(JD0, highPrecision)
      }
      const coordsNum = {
        L: coords.L.toNumber(),
        B: coords.B.toNumber(),
        R: coords.L.toNumber(),
      }

      if (firstIterationDone) {
        continueIterations = (
          (Math.abs(coordsNum.L - previousCoordsNum.L) > 0.00001) ||
          (Math.abs(coordsNum.B - previousCoordsNum.B) > 0.00001) ||
          (Math.abs(coordsNum.R - previousCoordsNum.R) > 0.000001)
        )
        previousCoordsNum = { ...coordsNum }
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

        distanceDetails.Delta = Decimal.sqrt(
          distanceDetails.x.pow(2).plus(distanceDetails.y.pow(2)).plus(distanceDetails.z.pow(2))
        )

        distanceDetails.tau = getLightTimeFromDistance(distanceDetails.Delta)
      }

      distanceDetails.l = coords.L
      distanceDetails.b = coords.B
      distanceDetails.r = coords.R

      // Prepare for the next loop
      JD0 = new Decimal(jd).minus(distanceDetails.tau)
    }

    return distanceDetails
  } else {
    const distanceDetails = {
      x: 0,
      y: 0,
      z: 0,
      Delta: 0,
      tau: 0,
      l: 0,
      b: 0,
      r: 0,
    }
    let JD0 = (Decimal.isDecimal(jd) ? jd.toNumber() : jd)
    while (continueIterations) {
      let coords = {
        L: eclipticLongitudeFunc(JD0, highPrecision).degreesToRadians().toNumber(),
        B: eclipticLatitudeFunc(JD0, highPrecision).degreesToRadians().toNumber(),
        R: radiusVectorFunc(JD0, highPrecision).toNumber()
      }
      const earthCoordsNum = {
        L: earthCoords.L.toNumber(),
        B: earthCoords.B.toNumber(),
        R: earthCoords.L.toNumber()
      }

      if (firstIterationDone) {
        continueIterations = (
          (Math.abs(coords.L - previousCoordsNum.L) > 0.00001) ||
          (Math.abs(coords.B - previousCoordsNum.B) > 0.00001) ||
          (Math.abs(coords.R - previousCoordsNum.R) > 0.000001)
        )
        previousCoordsNum = { ...coords }
      } else {
        firstIterationDone = true
      }

      // Calculate the new value
      if (continueIterations) {
        distanceDetails.x = coords.R * Math.cos(coords.B) * Math.cos(coords.L)
          - earthCoordsNum.R * Math.cos(earthCoordsNum.B) * Math.cos(earthCoordsNum.L)

        distanceDetails.y = coords.R * Math.cos(coords.B) * Math.sin(coords.L)
          - earthCoordsNum.R * Math.cos(earthCoordsNum.B) * Math.sin(earthCoordsNum.L)

        distanceDetails.z = coords.R * Math.sin(coords.B)
          - earthCoordsNum.R * Math.sin(earthCoordsNum.B)

        distanceDetails.Delta = Math.sqrt(
          distanceDetails.x * distanceDetails.x +
          distanceDetails.y * distanceDetails.y +
          distanceDetails.z * distanceDetails.z
        )

        distanceDetails.tau = getLightTimeFromDistance(distanceDetails.Delta).toNumber()
      }

      distanceDetails.l = coords.L
      distanceDetails.b = coords.B
      distanceDetails.r = coords.R

      // Prepare for the next loop
      JD0 = (Decimal.isDecimal(jd) ? jd.toNumber() : jd) - distanceDetails.tau
    }

    return distanceDetails
  }
}

/** @private */
export function getPlanetGeocentricDistance (jd: JulianDay | number,
                                             eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                             eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                             radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
                                             highPrecision: boolean = true): AstronomicalUnit {
  const details = getPlanetDistanceDetailsFromEarth(
    jd,
    eclipticLongitudeFunc,
    eclipticLatitudeFunc,
    radiusVectorFunc,
    highPrecision
  )
  return highPrecision ? (details as EllipticalDistance).Delta : new Decimal(details.Delta)
}


/** @private */
export function getPlanetGeocentricEclipticCoordinates (jd: JulianDay | number,
                                                        eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                        eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                        radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
                                                        highPrecision: boolean = true): EclipticCoordinates {
  if (highPrecision) {
    const details: EllipticalDistance = getPlanetDistanceDetailsFromEarth(
      jd,
      eclipticLongitudeFunc,
      eclipticLatitudeFunc,
      radiusVectorFunc,
      highPrecision
    ) as EllipticalDistance

    return {
      longitude: fmod360(
        Decimal.atan2(details.y, details.x).radiansToDegrees()
      ),
      latitude: fmod90(
        Decimal.atan2(details.z, Decimal.sqrt(details.x.pow(2).plus(details.y.pow(2)))).radiansToDegrees()
      )
    }
  } else {
    const details: EllipticalDistanceNum = getPlanetDistanceDetailsFromEarth(
      jd,
      eclipticLongitudeFunc,
      eclipticLatitudeFunc,
      radiusVectorFunc,
      highPrecision
    ) as EllipticalDistanceNum

    const rad2deg = RAD2DEG.toNumber()
    return {
      longitude: fmod360(
        Math.atan2(details.y, details.x) * rad2deg
      ),
      latitude: fmod90(
        Math.atan2(details.z, Math.sqrt(details.x * details.x + details.y * details.y)) * rad2deg
      )
    }
  }
}

/** @private */
export function getPlanetApparentGeocentricEclipticCoordinates (jd: JulianDay | number,
                                                                eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                                eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction,
                                                                radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
                                                                highPrecision: boolean = true): EclipticCoordinates {
  const geocentricEclipticCoordinates = getPlanetGeocentricEclipticCoordinates(
    jd,
    eclipticLongitudeFunc,
    eclipticLatitudeFunc,
    radiusVectorFunc,
    highPrecision
  )

  // Adjust for Aberration
  const aberration = Earth.getAnnualEclipticAberration(jd, geocentricEclipticCoordinates, highPrecision)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(aberration.DeltaLongitude.dividedBy(3600))
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(aberration.DeltaLatitude.dividedBy(3600))

  // Convert to the FK5 system
  const deltaLong = getCorrectionInLongitude(jd, geocentricEclipticCoordinates.longitude, geocentricEclipticCoordinates.latitude, highPrecision)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude.plus(deltaLong)

  const deltaLat = getCorrectionInLatitude(jd, geocentricEclipticCoordinates.longitude, highPrecision)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude.plus(deltaLat)

  // Correct for nutation
  const longitudeNutation = Earth.getNutationInLongitude(jd, highPrecision)
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
