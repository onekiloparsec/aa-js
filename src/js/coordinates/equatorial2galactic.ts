/**
 @module Coordinates
 */
import { fmod360 } from '@/js/utils'
import { DEG2RAD, J2000, JULIAN_DAY_B1950_0, RAD2DEG } from '@/js/constants'
import { Degree, EquatorialCoordinates, GalacticCoordinates, JulianDay } from '@/js/types'
import { precessEquatorialCoordinates } from './precession'

// --- galactic coordinates

/**
 * Galactic longitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLongitudeFromEquatorial (coords: EquatorialCoordinates, epoch: JulianDay = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: equCoordsB1950.rightAscension * DEG2RAD,
    declination: equCoordsB1950.declination * DEG2RAD,
  }
  const c1 = 192.25 * DEG2RAD
  const c2 = 27.4 * DEG2RAD
  const y = Math.sin(c1 - rcoords.rightAscension)
  const x1 = Math.cos(c1 - rcoords.rightAscension) * Math.sin(c2)
  const x2 = Math.tan(rcoords.declination) * Math.cos(c2)
  return fmod360(303 - Math.atan2(y, x1 - x2) * RAD2DEG)
}

/**
 * Galactic latitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLatitudeFromEquatorial (coords: EquatorialCoordinates, epoch: JulianDay = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: equCoordsB1950.rightAscension * DEG2RAD,
    declination: equCoordsB1950.declination * DEG2RAD,
  }
  const c1 = 192.25 * DEG2RAD
  const c2 = 27.4 * DEG2RAD
  return fmod360(
    Math.sin(rcoords.declination) * Math.sin(c2)
    + Math.cos(rcoords.declination) * Math.cos(c2) * (c1 - rcoords.rightAscension)
  )
}

/**
 * Transform equatorial coordinates to galactic coordinates.
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epoch The epoch of the equatorial coordinates. By default, J2000.
 */
export function transformEquatorialToGalactic (coords: EquatorialCoordinates, epoch: JulianDay = J2000): GalacticCoordinates {
  return {
    longitude: getGalacticLongitudeFromEquatorial(coords, epoch),
    latitude: getGalacticLatitudeFromEquatorial(coords, epoch)
  }
}
