import { Degree, EquatorialCoordinates, Hour, JulianDay } from 'aa.js'
import { DEG2RAD, H2DEG, J2000, JULIAN_DAY_B1950_0, RAD2DEG } from './constants'

/**
 * Precess equatorial coordinates from aa given epoch to another one
 * See AA p.134
 * @param {Hour} ra0 The initial right ascension
 * @param {Degree} dec0 The initial declination
 * @param {JulianDay} initialEpoch The initial epoch
 * @param {JulianDay} finalEpoch The initial epoch
 * @returns {EquatorialCoordinates} The precessed coordinates
 */
export function precessEquatorialCoordinates (ra0: Hour, dec0: Degree, initialEpoch: JulianDay, finalEpoch: JulianDay): EquatorialCoordinates {
  const JD0 = initialEpoch
  const JD = finalEpoch
  const T = (JD0 - J2000) / 36525
  const t = (JD - JD0) / 36525
  const T2 = T * T
  const t2 = t * t
  const t3 = t * t * t

  // xhi, z and theta are expressed in ArcSecond.
  const xhi = (2306.2181 + 1.39656 * T - 0.000139 * T2) * t + (0.30188 - 0.000344 * T) * t2 + 0.017998 * t3
  const z = (2306.2181 + 1.39656 * T - 0.000139 * T2) * t + (1.09468 + 0.000066 * T) * t2 + 0.018203 * t3
  const theta = (2004.3109 - 0.85339 * T - 0.000217 * T2) * t - (0.42665 + 0.000217 * T) * t2 - 0.041833 * t3

  const cosDec0 = Math.cos(dec0 * DEG2RAD)
  const sinDec0 = Math.sin(dec0 * DEG2RAD)
  const cosTheta = Math.cos(theta / 3600 * DEG2RAD)
  const sinTheta = Math.sin(theta / 3600 * DEG2RAD)
  const cosRA0xhi = Math.cos((ra0 * H2DEG + xhi / 3600) * DEG2RAD)
  const sinRA0xhi = Math.sin((ra0 * H2DEG + xhi / 3600) * DEG2RAD)

  const A = cosDec0 * sinRA0xhi
  const B = cosTheta * cosDec0 * cosRA0xhi - sinTheta * sinDec0
  const C = sinTheta * cosDec0 * cosRA0xhi + cosTheta * sinDec0

  const ra = Math.atan2(A, B) * RAD2DEG + z / 3600
  const dec = Math.asin(C) * RAD2DEG

  return {
    rightAscension: ra,
    declination: dec,
    epoch: finalEpoch
  }
}

/**
 * Precess equatorial coordinates from an assumed J2000 epoch to that of B1950.
 * @param {Hour} ra0 The initial right ascension
 * @param {Degree} dec0 The initial declination
 * @returns {EquatorialCoordinates} The precessed coordinates
 */
export function precessEquatorialCoordinatesFromJ2000ToB1950 (ra0: Hour, dec0: Degree): EquatorialCoordinates {
  return precessEquatorialCoordinates(ra0, dec0, J2000, JULIAN_DAY_B1950_0)
}

/**
 * Precess equatorial coordinates from an assumed B1950 epoch to that of J2000.
 * @param {Hour} ra0 The initial right ascension
 * @param {Degree} dec0 The initial declination
 * @returns {EquatorialCoordinates} The precessed coordinates
 */
export function precessEquatorialCoordinatesFromB1950ToJ1000 (ra0: Hour, dec0: Degree): EquatorialCoordinates {
  return precessEquatorialCoordinates(ra0, dec0, JULIAN_DAY_B1950_0, J2000)
}
