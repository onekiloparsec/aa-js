import { Degree, EquatorialCoordinates, GeographicCoordinates, HorizontalCoordinates, JulianDay } from '@/types'
import { getLocalSiderealTime } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { DEG2RAD, H2DEG, RAD2DEG } from '@/constants'


/**
 * Equatorial right ascension from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @returns {Degree}
 */
export function getRightAscensionFromHorizontal (jd: JulianDay, horCoords: HorizontalCoordinates, geoCoords: GeographicCoordinates): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG
  const rHorCoords = {
    azimuth: horCoords.azimuth * DEG2RAD,
    altitude: horCoords.altitude * DEG2RAD
  }
  const rGeoCoords = {
    longitude: geoCoords.longitude * DEG2RAD,
    latitude: geoCoords.latitude * DEG2RAD
  }
  const y = Math.sin(rHorCoords.azimuth)
  const x = Math.cos(rHorCoords.azimuth) * Math.sin(rGeoCoords.latitude)
    + Math.tan(rHorCoords.altitude) * Math.cos(rGeoCoords.latitude)
  
  const value = lmst - Math.atan2(y, x)
  
  return fmod360(value * RAD2DEG)
}

/**
 * Equatorial declination from horizontal coordinates
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (horCoords: HorizontalCoordinates, geoCoords: GeographicCoordinates): Degree {
  const rHorCoords = {
    azimuth: horCoords.azimuth * DEG2RAD,
    altitude: horCoords.altitude * DEG2RAD
  }
  const rGeoCoords = {
    longitude: geoCoords.longitude * DEG2RAD,
    latitude: geoCoords.latitude * DEG2RAD
  }
  
  const value = Math.asin(
    Math.sin(rGeoCoords.latitude) * Math.sin(rHorCoords.altitude)
    - Math.cos(rGeoCoords.latitude) * Math.cos(rHorCoords.altitude) * Math.cos(rHorCoords.azimuth)
  )
  
  return fmod90(value * RAD2DEG)
}

/**
 * Transform horizontal coordinates to equatorial coordinates.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @returns {EquatorialCoordinates}
 */
export function transformHorizontalToEquatorial (jd: JulianDay, horCoords: HorizontalCoordinates, geoCoords: GeographicCoordinates): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromHorizontal(jd, horCoords, geoCoords),
    declination: getDeclinationFromHorizontal(horCoords, geoCoords)
  }
}
