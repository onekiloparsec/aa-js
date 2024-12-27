import { DEG2RAD, H2DEG, RAD2DEG } from '@/js/constants'
import { getLocalSiderealTime } from '@/js/juliandays'
import { Degree, EquatorialCoordinates, GeographicCoordinates, JulianDay, Radian } from '@/js/types'

/**
 * Paralactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 * @param {JulianDay} jd The julian day of the observation.
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates} equCoords The object equatorial coordinates
 * @returns {Degree} The paralactic angle
 */
export function getParallacticAngle (jd: JulianDay, equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates): Degree {
  const lmst: Degree = getLocalSiderealTime(jd, geoCoords.longitude) * H2DEG
  const HA: Radian = (lmst - equCoords.rightAscension) * DEG2RAD
  
  const rEquCoords = {
    rightAscension: equCoords.rightAscension * DEG2RAD,
    declination: equCoords.declination * DEG2RAD
  }
  const rGeoCoords = {
    longitude: geoCoords.longitude * DEG2RAD,
    latitude: geoCoords.latitude * DEG2RAD
  }
  
  let angle = undefined
  
  const cosdec = Math.cos(rEquCoords.declination)
  if (cosdec !== 0) {
    angle = Math.atan2(
      Math.sin(HA),
      Math.tan(rGeoCoords.latitude) * cosdec - Math.sin(rEquCoords.declination) * Math.cos(HA)
    ) * RAD2DEG
  } else {
    angle = (rGeoCoords.latitude >= 0) ? 180.0 : 0.0
  }
  
  return angle
}

/**
 * The Great Circle angular distance between two spherical coordinates.
 * It uses the alternative formula of AA p115, which works well for small and large angles.
 * @param {EquatorialCoordinates} coords1
 * @param {EquatorialCoordinates} coords2
 * @returns {Degree}
 */
export function getGreatCircleAngularDistance (coords1: EquatorialCoordinates, coords2: EquatorialCoordinates): Degree {
  const alpha1 = coords1.rightAscension * DEG2RAD
  const alpha2 = coords2.rightAscension * DEG2RAD
  const delta1 = coords1.declination * DEG2RAD
  const delta2 = coords2.declination * DEG2RAD
  
  const x = Math.cos(delta1) * Math.sin(delta2)
    - Math.sin(delta1) * Math.cos(delta2) * Math.cos(alpha2 - alpha1)
  
  const y = Math.cos(delta2) * Math.sin(alpha2 - alpha1)
  
  const z = Math.sin(delta1) * Math.sin(delta2)
    + Math.cos(delta1) * Math.cos(delta2) * Math.cos(alpha2 - alpha1)
  
  return Math.atan2(Math.sqrt(x * x + y * y), z) / DEG2RAD
}
