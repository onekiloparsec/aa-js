/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import { fmod360 } from '@/utils'
import { J2000, JULIAN_DAY_B1950_0 } from '@/constants'
import { Degree, EquatorialCoordinates, EquatorialCoordinatesNum, GalacticCoordinates, JulianDay } from '@/types'
import { precessEquatorialCoordinates } from './precession'

// --- galactic coordinates

/**
 * Galactic longitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLongitudeFromEquatorial (coords: EquatorialCoordinates | EquatorialCoordinatesNum, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: (equCoordsB1950.rightAscension as Degree).degreesToRadians(),
    declination: (equCoordsB1950.declination as Degree).degreesToRadians(),
  }
  const c1 = new Decimal(192.25).degreesToRadians()
  const c2 = new Decimal(27.4).degreesToRadians()
  const y = Decimal.sin(c1.minus(rcoords.rightAscension))
  const x1 = Decimal.cos(c1.minus(rcoords.rightAscension)).mul(Decimal.sin(c2))
  const x2 = Decimal.tan(rcoords.declination).mul(Decimal.cos(c2))
  return fmod360(new Decimal(303).minus(Decimal.atan2(y, x1.minus(x2)).radiansToDegrees()))
}

/**
 * Galactic latitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLatitudeFromEquatorial (coords: EquatorialCoordinates | EquatorialCoordinatesNum, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: (equCoordsB1950.rightAscension as Degree).degreesToRadians(),
    declination: (equCoordsB1950.declination as Degree).degreesToRadians(),
  }
  const c1 = new Decimal(192.25).degreesToRadians()
  const c2 = new Decimal(27.4).degreesToRadians()
  return fmod360(
    Decimal.sin(rcoords.declination).mul(Decimal.sin(c2))
      .plus(Decimal.cos(rcoords.declination).mul(Decimal.cos(c2)).mul(c1.minus(rcoords.rightAscension)))
  )
}

/**
 * Transform equatorial coordinates to galactic coordinates.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates (in degrees)
 * @param {Degree} epoch The epoch of the equatorial coordinates. By default, J2000.
 */
export function transformEquatorialToGalactic (coords: EquatorialCoordinates | EquatorialCoordinatesNum, epoch: JulianDay | number = J2000): GalacticCoordinates {
  return {
    longitude: getGalacticLongitudeFromEquatorial(coords, epoch),
    latitude: getGalacticLatitudeFromEquatorial(coords, epoch)
  }
}
