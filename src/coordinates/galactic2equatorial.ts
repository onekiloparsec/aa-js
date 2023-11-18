import Decimal from '@/decimal'
import { fmod24, fmod90 } from '@/utils'
import { J2000, JULIAN_DAY_B1950_0 } from '@/constants'
import { Degree, EquatorialCoordinates, GalacticCoordinates, GalacticCoordinatesNum, JulianDay } from '@/types'
import { precessEquatorialCoordinates } from './precession'


/**
 * Equatorial right ascension in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates | GalacticCoordinatesNum} coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialRightAscensionB1950FromGalactic (coords: GalacticCoordinates | GalacticCoordinatesNum): Degree {
  const c2 = new Decimal(27.4).degreesToRadians()
  const lprime = (new Decimal(coords.longitude).minus(123)).degreesToRadians()
  const b = new Decimal(coords.latitude).degreesToRadians()
  const y = Decimal.sin(lprime)
  const x = Decimal.cos(lprime).mul(Decimal.sin(c2)).minus(Decimal.tan(b).mul(Decimal.cos(c2)))
  return fmod24(new Decimal(12.15).plus(Decimal.atan2(y, x).radiansToDegrees()))
}

/**
 * Equatorial declination in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates | GalacticCoordinatesNum} coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialDeclinationB1950FromGalactic (coords: GalacticCoordinates | GalacticCoordinatesNum): Degree {
  const c2 = new Decimal(27.4).degreesToRadians()
  const lprime = (new Decimal(coords.longitude).minus(123)).degreesToRadians()
  const b = new Decimal(coords.latitude).degreesToRadians()
  return fmod90(
    Decimal.asin(
      Decimal.sin(b).mul(Decimal.sin(c2))
        .plus(Decimal.cos(b).mul(Decimal.cos(c2)).mul(Decimal.cos(lprime)))
    ).radiansToDegrees()
  )
}

/**
 * Transform galactic coordinates to equatorial coordinates.
 * @param {GalacticCoordinates | GalacticCoordinatesNum} coords The galactic coordinates
 * @param {Degree} epoch The initial epoch of the equatorial coordinates. By default, J2000.
 * @returns {EquatorialCoordinates}
 */
export function transformGalacticToEquatorial (coords: GalacticCoordinates | GalacticCoordinatesNum, epoch: JulianDay | number = J2000): EquatorialCoordinates {
  const coordsB1950 = {
    rightAscension: getEquatorialRightAscensionB1950FromGalactic(coords),
    declination: getEquatorialDeclinationB1950FromGalactic(coords)
  }
  return precessEquatorialCoordinates(coordsB1950, JULIAN_DAY_B1950_0, epoch)
}
