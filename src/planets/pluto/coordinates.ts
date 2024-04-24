import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'
import { DEG2RAD } from '@/constants'
import {
  ArgumentCoefficient,
  CoordsCoefficient,
  getArgumentCoefficients,
  getLatitudeCoefficients,
  getLongitudeCoefficients,
  getRadiusCoefficients
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Pluto
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const argumentCoefficients = getArgumentCoefficients()
  const longitudeCoefficients = getLongitudeCoefficients()
  
  
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T
  
  const L = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
    const alpha = (value.J * J + value.S * S + value.P * P) * DEG2RAD
    return sum
      + (longitudeCoefficients as CoordsCoefficient[])[index].A * Math.sin(alpha)
      + (longitudeCoefficients as CoordsCoefficient[])[index].B * Math.cos(alpha)
  }, 0)
  
  return fmod360(L / 1e8 + 238.958116 + 144.96 * T)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Pluto
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const argumentCoefficients = getArgumentCoefficients()
  const latitudeCoefficients = getLatitudeCoefficients()
  
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T
  
  const B = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
    const alpha = (value.J * J + value.S * S + value.P * P) * DEG2RAD
    return sum
      + (latitudeCoefficients as CoordsCoefficient[])[index].A * Math.sin(alpha)
      + (latitudeCoefficients as CoordsCoefficient[])[index].B * Math.cos(alpha)
  }, 0)
  
  return fmod90(B / 1e8 - 3.908239)
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @return {AstronomicalUnit}
 * @memberof module:Pluto
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const T = getJulianCentury(jd)
  
  const argumentCoefficients = getArgumentCoefficients()
  const radiusCoefficients = getRadiusCoefficients()
  
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T
  
  const R = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
    const alpha = (value.J * J + value.S * S + value.P * P) * DEG2RAD
    return sum
      + (radiusCoefficients as CoordsCoefficient[])[index].A * Math.sin(alpha)
      + (radiusCoefficients as CoordsCoefficient[])[index].B * Math.cos(alpha)
  }, 0)
  
  return fmod90(R / 1e8 + 40.7241346)
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Pluto
 */
export function getEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

/**
 * Heliocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @returns {EquatorialCoordinates}
 * @memberof module:Pluto
 */
export function getEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}
