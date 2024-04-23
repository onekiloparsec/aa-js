import { fmod360, fmod90 } from '@/utils'
import { DEG2RAD, J2000, JULIAN_DAY_B1950_0, RAD2DEG } from '@/constants'
import { Degree, EquatorialCoordinates, GalacticCoordinates, JulianDay } from '@/types'
import { precessEquatorialCoordinates } from './precession'


/**
 * Equatorial right ascension in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates } coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialRightAscensionB1950FromGalactic (coords: GalacticCoordinates): Degree {
  const c2 = 27.4 * DEG2RAD
  const lprime = (coords.longitude - 123) * DEG2RAD
  const b = coords.latitude * DEG2RAD
  const y = Math.sin(lprime)
  const x = Math.cos(lprime) * Math.sin(c2) - Math.tan(b) * Math.cos(c2)
  return fmod360(12.15 + Math.atan2(y, x) * RAD2DEG)
}

/**
 * Equatorial declination in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates } coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialDeclinationB1950FromGalactic (coords: GalacticCoordinates): Degree {
  const c2 = 27.4 * DEG2RAD
  const lprime = (coords.longitude - 123) * DEG2RAD
  const b = coords.latitude * DEG2RAD
  return fmod90((Math.asin(Math.sin(b) * Math.sin(c2) + Math.cos(b) * Math.cos(c2) * Math.cos(lprime))) * RAD2DEG)
}

/**
 * Transform galactic coordinates to equatorial coordinates.
 * @param {GalacticCoordinates } coords The galactic coordinates
 * @param {Degree} epoch The initial epoch of the equatorial coordinates. By default, J2000.
 * @returns {EquatorialCoordinates}
 */
export function transformGalacticToEquatorial (coords: GalacticCoordinates, epoch: JulianDay = J2000): EquatorialCoordinates {
  const coordsB1950 = {
    rightAscension: getEquatorialRightAscensionB1950FromGalactic(coords),
    declination: getEquatorialDeclinationB1950FromGalactic(coords)
  }
  return precessEquatorialCoordinates(coordsB1950, JULIAN_DAY_B1950_0, epoch)
}
