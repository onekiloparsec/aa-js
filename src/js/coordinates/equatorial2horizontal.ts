import { Degree, EquatorialCoordinates, GeographicCoordinates, HorizontalCoordinates, JulianDay } from '@/js/types'
import { getLocalSiderealTime } from '@/js/juliandays'
import { fmod360, fmod90 } from '@/js/utils'
import { DEG2RAD, H2DEG, RAD2DEG } from '@/js/constants'

/**
 * Horizontal (local) altitude (where horizon is zero degrees)
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {Degree}
 */
export function getHorizontalAltitude (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG
  const hourAngle = (lmst - equCoords.rightAscension) * DEG2RAD
  const rEquCoords = {
    rightAscension: equCoords.rightAscension * DEG2RAD,
    declination: equCoords.declination * DEG2RAD
  }
  const rGeoCoords = {
    longitude: geoCoords.longitude * DEG2RAD,
    latitude: geoCoords.latitude * DEG2RAD
  }
  const value = Math.asin(
    Math.sin(rGeoCoords.latitude) * Math.sin(rEquCoords.declination)
    + Math.cos(rGeoCoords.latitude) * Math.cos(rEquCoords.declination) * Math.cos(hourAngle)
  )
  return fmod90(value * RAD2DEG)
}

/**
 * Horizontal (local) azimuth.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {Degree}
 */
export function getHorizontalAzimuth (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG
  const hourAngle = (lmst - equCoords.rightAscension) * DEG2RAD
  const rEquCoords = {
    rightAscension: equCoords.rightAscension * DEG2RAD,
    declination: equCoords.declination * DEG2RAD
  }
  const rGeoCoords = {
    longitude: geoCoords.longitude * DEG2RAD,
    latitude: geoCoords.latitude * DEG2RAD
  }
  const value = Math.atan2(
    Math.sin(hourAngle),
    Math.cos(hourAngle) * Math.sin(rGeoCoords.latitude) - Math.tan(rEquCoords.declination) * Math.cos(rGeoCoords.latitude))
  return fmod360(value * RAD2DEG)
}


/**
 * Transform equatorial coordinates to horizontal coordinates.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates } equCoords The equatorial coordinates of the target
 * @returns {HorizontalCoordinates}
 */
export function transformEquatorialToHorizontal (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates): HorizontalCoordinates {
  return {
    azimuth: getHorizontalAzimuth(jd, equCoords, geoCoords),
    altitude: getHorizontalAltitude(jd, equCoords, geoCoords)
  }
}
