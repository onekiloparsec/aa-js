/**
 @module Precession
 */
import Decimal from '@/decimal'
import { Degree, EquatorialCoordinates, Hour, JulianDay } from './types'
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
export function precessEquatorialCoordinates (ra0: Hour | number, dec0: Degree | number, initialEpoch: JulianDay | number, finalEpoch: JulianDay | number): EquatorialCoordinates {
  const JD0 = new Decimal(initialEpoch)
  const JD = new Decimal(finalEpoch)
  const T = JD0.minus(J2000).dividedBy(36525)
  const t = JD.minus(JD0).dividedBy(36525)
  const T2 = T.pow(2)
  const t2 = t.pow(2)
  const t3 = t.pow(3)

  // xhi, z and theta are expressed in ArcSecond.

  const xhi = (new Decimal(2306.2181).plus(new Decimal(1.39656).mul(T)).minus(new Decimal(0.000139).mul(T2))).mul(t)
    .plus((new Decimal(0.30188).minus(new Decimal(0.000344).mul(T))).mul(t2))
    .plus(new Decimal(0.017998).mul(t3))

  const z = (new Decimal(2306.2181).plus(new Decimal(1.39656).mul(T)).minus(new Decimal(0.000139).mul(T2))).mul(t)
    .plus((new Decimal(0.30188).minus(new Decimal(0.000344).mul(T))).mul(t2))
    .plus(new Decimal(0.018203).mul(t3))

  const theta = (new Decimal(2004.3109).minus(new Decimal(0.85339).mul(T)).minus(new Decimal(0.000217).mul(T2))).mul(t)
    .minus((new Decimal(0.42665).plus(new Decimal(0.000217).mul(T))).mul(t2))
    .minus(new Decimal(0.041833).mul(t3))

  const cosDec0 = new Decimal(dec0).mul(DEG2RAD).cos()
  const sinDec0 = new Decimal(dec0).mul(DEG2RAD).sin()
  const cosTheta = theta.dividedBy(3600).mul(DEG2RAD).cos()
  const sinTheta = theta.dividedBy(3600).mul(DEG2RAD).sin()
  const degRa = new Decimal(ra0).mul(H2DEG)
  const cosRA0xhi = (degRa.plus(xhi.dividedBy(3600))).mul(DEG2RAD).cos()
  const sinRA0xhi = (degRa.plus(xhi.dividedBy(3600))).mul(DEG2RAD).sin()

  const A = cosDec0.mul(sinRA0xhi)
  const B = cosTheta.mul(cosDec0).mul(cosRA0xhi).minus(sinTheta.mul(sinDec0))
  const C = sinTheta.mul(cosDec0).mul(cosRA0xhi).plus(cosTheta.mul(sinDec0))

  const ra = Decimal.atan2(A, B).mul(RAD2DEG).plus(z.dividedBy(3600))
  const dec = Decimal.asin(C).mul(RAD2DEG)

  return {
    rightAscension: ra,
    declination: dec,
    epoch: new Decimal(finalEpoch)
  }
}

/**
 * Precess equatorial coordinates from an assumed J2000 epoch to that of B1950.
 * @param {Hour} ra0 The initial right ascension
 * @param {Degree} dec0 The initial declination
 * @returns {EquatorialCoordinates} The precessed coordinates
 */
export function precessEquatorialCoordinatesFromJ2000ToB1950 (ra0: Hour | number, dec0: Degree | number): EquatorialCoordinates {
  return precessEquatorialCoordinates(ra0, dec0, J2000, JULIAN_DAY_B1950_0)
}

/**
 * Precess equatorial coordinates from an assumed B1950 epoch to that of J2000.
 * @param {Hour} ra0 The initial right ascension
 * @param {Degree} dec0 The initial declination
 * @returns {EquatorialCoordinates} The precessed coordinates
 */
export function precessEquatorialCoordinatesFromB1950ToJ1000 (ra0: Hour | number, dec0: Degree | number): EquatorialCoordinates {
  return precessEquatorialCoordinates(ra0, dec0, JULIAN_DAY_B1950_0, J2000)
}
