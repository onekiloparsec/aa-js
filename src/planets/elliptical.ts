import { DEG2RAD, RAD2DEG } from '@/constants'
import {
  AstronomicalUnit,
  EclipticCoordinates,
  Equinox,
  JulianDay,
  KilometerPerSecond,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  SingleCoordinateDegreeAtJulianDayFunction
} from '@/types'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/coordinates'
import { getLightTimeFromDistance } from '@/distances'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'

/** @private */
export type EllipticalDistance = {
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
export function getPlanetDistanceDetailsFromEarth (jd: JulianDay,
                                                   eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                   eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                   radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EllipticalDistance {
  // Calculate the position of the Earth first
  const earthCoords = {
    L: Earth.getEclipticLongitude(jd, Equinox.MeanOfTheDate) * DEG2RAD,
    B: Earth.getEclipticLatitude(jd, Equinox.MeanOfTheDate) * DEG2RAD,
    R: Earth.getRadiusVector(jd)
  }
  
  // Iterate to find the positions adjusting for light-time correction if required
  let continueIterations = true
  let firstIterationDone = false
  let previousCoordsNum = { L: 0, B: 0, R: 0 }
  
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
  let JD0 = jd
  while (continueIterations) {
    let coords = {
      L: eclipticLongitudeFunc(JD0) * DEG2RAD,
      B: eclipticLatitudeFunc(JD0) * DEG2RAD,
      R: radiusVectorFunc(JD0)
    }
    const earthCoordsNum = {
      L: earthCoords.L,
      B: earthCoords.B,
      R: earthCoords.R
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
      
      distanceDetails.tau = getLightTimeFromDistance(distanceDetails.Delta)
    }
    
    distanceDetails.l = coords.L
    distanceDetails.b = coords.B
    distanceDetails.r = coords.R
    
    // Prepare for the next loop
    JD0 = jd - distanceDetails.tau
  }
  
  return distanceDetails
}

/** @private */
export function getPlanetGeocentricDistance (jd: JulianDay,
                                             eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                             radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): AstronomicalUnit {
  const details = getPlanetDistanceDetailsFromEarth(
    jd,
    eclipticLongitudeFunc,
    eclipticLatitudeFunc,
    radiusVectorFunc,
  )
  return details.Delta
}


/** @private */
export function getPlanetGeocentricEclipticCoordinates (jd: JulianDay,
                                                        eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                        radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EclipticCoordinates {
  
  const details: EllipticalDistance = getPlanetDistanceDetailsFromEarth(
    jd,
    eclipticLongitudeFunc,
    eclipticLatitudeFunc,
    radiusVectorFunc,
  )
  
  return {
    longitude: fmod360(Math.atan2(details.y, details.x) * RAD2DEG),
    latitude: fmod90(Math.atan2(details.z, Math.sqrt(details.x * details.x + details.y * details.y)) * RAD2DEG)
  }
}

/** @private */
export function getPlanetApparentGeocentricEclipticCoordinates (jd: JulianDay,
                                                                eclipticLongitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                                eclipticLatitudeFunc: SingleCoordinateDegreeAtJulianDayFunction,
                                                                radiusVectorFunc: QuantityInAstronomicalUnitAtJulianDayFunction): EclipticCoordinates {
  const geocentricEclipticCoordinates = getPlanetGeocentricEclipticCoordinates(
    jd,
    eclipticLongitudeFunc,
    eclipticLatitudeFunc,
    radiusVectorFunc
  )
  
  // Adjust for Aberration
  const aberration = Earth.getAnnualEclipticAberration(jd, geocentricEclipticCoordinates)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude + aberration.DeltaLongitude.dividedBy(3600)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude + aberration.DeltaLatitude.dividedBy(3600)
  
  // Convert to the FK5 system
  const deltaLong = getCorrectionInLongitude(jd, geocentricEclipticCoordinates.longitude, geocentricEclipticCoordinates.latitude)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude + deltaLong
  
  const deltaLat = getCorrectionInLatitude(jd, geocentricEclipticCoordinates.longitude)
  geocentricEclipticCoordinates.latitude = geocentricEclipticCoordinates.latitude + deltaLat
  
  // Correct for nutation
  const longitudeNutation = Earth.getNutationInLongitude(jd)
  geocentricEclipticCoordinates.longitude = geocentricEclipticCoordinates.longitude + longitudeNutation / 3600
  
  return geocentricEclipticCoordinates
}

/** @private */
export function getPlanetInstantaneousVelocity (r: AstronomicalUnit, a: AstronomicalUnit): KilometerPerSecond {
  return 42.1219 * Math.sqrt((1 / r) - (1 / (2 * a)))
}

/** @private */
export function getPlanetVelocityAtPerihelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / Math.sqrt(a) * Math.sqrt((1 + e) / (1 - e))
}

/** @private */
export function getPlanetVelocityAtAphelion (e: number, a: AstronomicalUnit): KilometerPerSecond {
  return 29.7847 / Math.sqrt(a) * Math.sqrt((1 - e) / (1 + e))
}

/** @private */
export function getPlanetLengthOfEllipse (e: number, a: AstronomicalUnit): AstronomicalUnit {
  const b = a * Math.sqrt(1 - e * e)
  return Math.PI * (3 * (a + b) - Math.sqrt((a + 3 * b) * (3 * a + b)))
}
