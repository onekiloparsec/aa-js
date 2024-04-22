/**
 @module Sun
 */
import { Degree, JulianCentury, JulianDay } from '@/types'
import { getJulianCentury } from '@/juliandays'
import { DEG2RAD } from '@/constants'
import { fmod360 } from '@/utils'

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The sun mean anomaly
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  // In AA++ (C++) implementation, values differ a little bit. But we prefer textbook AA values to ensure tests validity
  // In AA++ : fmod360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000)
  
  const t = getJulianCentury(jd)
  const value = 357.529_11
    + 35999.050_29 * t
    - 0.0001537 * t * t
    + t * t * t / 24_490_000
  
  return fmod360(value)
}

/**
 * Computes the Sun true anomaly
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The Sun true anomaly
 */
export function getTrueAnomaly (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  const M = getMeanAnomaly(jd)
  const C = getEquationOfTheCenter(T, M)
  return fmod360(M + C)
}

/**
 * Get the Sun's Equation of the center
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {Degree} M
 * @return {Degree}
 */
export function getEquationOfTheCenter (T: JulianCentury, M: Degree): Degree {
  return (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M * DEG2RAD) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG2RAD) +
    0.000289 * Math.sin(3 * M * DEG2RAD)
}

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @return {Degree}
 */
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury): Degree {
  const value = 280.466_46 + 36_000.769_83 * T + 0.000_3032 * T * T
  return fmod360(value)
}
