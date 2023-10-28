import Decimal from 'decimal.js'
import { AstronomicalUnit, Degree, EclipticCoordinates, Equinox, JulianDay, Meter, Radian } from '@/types'
import { DEG2RAD, EARTH_EQUATORIAL_RADIUS, EARTH_RADIUS_FLATTENING_FACTOR, RAD2DEG } from '@/constants'
import { getJulianCentury, getJulianMillenium } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Sun } from '@/sun'
import {
  gB0EarthCoefficients,
  gB1EarthCoefficients,
  gB1EarthCoefficientsJ2000,
  gB2EarthCoefficientsJ2000,
  gB3EarthCoefficientsJ2000,
  gB4EarthCoefficientsJ2000,
  gL0EarthCoefficients,
  gL1EarthCoefficients,
  gL1EarthCoefficientsJ2000,
  gL2EarthCoefficients,
  gL2EarthCoefficientsJ2000,
  gL3EarthCoefficients,
  gL3EarthCoefficientsJ2000,
  gL4EarthCoefficients,
  gL4EarthCoefficientsJ2000,
  gL5EarthCoefficients,
  gR0EarthCoefficients,
  gR1EarthCoefficients,
  gR2EarthCoefficients,
  gR3EarthCoefficients,
  gR4EarthCoefficients
} from './coefficients'

/**
 * Heliocentric coordinates longitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  const tau = getJulianMillenium(jd)

  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? gL0EarthCoefficients : gL0EarthCoefficients
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? gL1EarthCoefficients : gL1EarthCoefficientsJ2000
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? gL2EarthCoefficients : gL2EarthCoefficientsJ2000
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? gL3EarthCoefficients : gL3EarthCoefficientsJ2000
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? gL4EarthCoefficients : gL4EarthCoefficientsJ2000
  const coeffs5 = (equinox === Equinox.MeanOfTheDate) ? gL5EarthCoefficients : []

  // AA p.218: Values A are expressed in 10^-8 radians, while B and C values are in radians.
  const L0 = coeffs0.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L1 = coeffs1.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L2 = coeffs2.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L3 = coeffs3.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L4 = coeffs4.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L5 = coeffs5.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  const value = (L0
      .plus(L1.mul(tau))
      .plus(L2.mul(tau.pow(2)))
      .plus(L3.mul(tau.pow(3)))
      .plus(L4.mul(tau.pow(4)))
      .plus(L5.mul(tau.pow(5)))
  ).dividedBy(1e8)

  return fmod360(value.mul(RAD2DEG))
}

/**
 * Heliocentric coordinates latitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getEclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  const tau = getJulianMillenium(jd)

  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? gB0EarthCoefficients : gB0EarthCoefficients
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? gB1EarthCoefficients : gB1EarthCoefficientsJ2000
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? [] : gB2EarthCoefficientsJ2000
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? [] : gB3EarthCoefficientsJ2000
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? [] : gB4EarthCoefficientsJ2000

  const B0 = coeffs0.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B1 = coeffs1.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B2 = coeffs2.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B3 = coeffs3.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B4 = coeffs4.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  const value = (B0
      .plus(B1.mul(tau))
      .plus(B2.mul(tau.pow(2)))
      .plus(B3.mul(tau.pow(3)))
      .plus(B4.mul(tau.pow(4)))
  ).dividedBy(1e8)

  return fmod90(value.mul(RAD2DEG))
}

/**
 * Heliocentric coordinates, see AA p.218, 219
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {EclipticCoordinates}
 */
export function getEclipticCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd, equinox),
    latitude: getEclipticLatitude(jd, equinox)
  }
}

/**
 * Radius vector (distance from the Sun)
 * Corresponds to AA+ CAAEarth::RadiusVector
 * @param {JulianDay} jd The julian day
 * @returns {AstronomicalUnit}
 */
export function getRadiusVector (jd: JulianDay | number): AstronomicalUnit {
  const tau = getJulianMillenium(jd)

  const R0 = gR0EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const R1 = gR1EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const R2 = gR2EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const R3 = gR3EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const R4 = gR4EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  return (R0
      .plus(R1.mul(tau))
      .plus(R2.mul(tau.pow(2)))
      .plus(R3.mul(tau.pow(3)))
      .plus(R4.mul(tau.pow(4)))
  ).dividedBy(1e8)
}

/**
 * Mean anomaly, see AA p194
 * The mean anomaly is the angular distance from perihelion which the planet
 * would have if it moved around the Sun with a constant angular velocity.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanAnomaly (jd: JulianDay | number): Degree {
  return Sun.getMeanAnomaly(jd)
}

/**
 * Eccentricity of the orbit
 * @param  {JulianDay} jd The julian day
 * @returns {Number} The eccentricity (comprise between 0==circular, and 1).
 */
export function getEccentricity (jd: JulianDay | number): Decimal {
  const T = getJulianCentury(jd)
  return new Decimal(1).minus(T.mul(0.002516)).minus(T.pow(2).mul(0.0000074))
}

/**
 * Computes the "rho*sin(phi')" and "rho*cos(phi')" quantities, due to Earth flattening.
 * See AA p 82
 * @param  {Meter} height The observer heights above Earth surface.
 * @param {Degree} lat The observer's geographic latitude
 * @returns {Number} The quantities
 */
export function getFlatteningCorrections (height: Meter | number, lat: Degree | number) {
  const earthRadius: Meter = EARTH_EQUATORIAL_RADIUS.mul(1000)
  const b_a: Decimal = new Decimal(1).minus(EARTH_RADIUS_FLATTENING_FACTOR)
  const radLat: Radian = new Decimal(lat).mul(DEG2RAD)
  const u: Radian = Decimal.atan(b_a.mul(radLat.tan())) // Radians
  const h = new Decimal(height).dividedBy(earthRadius)
  return {
    rhosinphi: b_a.mul(Decimal.sin(u)).plus(h.mul(radLat.sin())),
    rhocosphi: Decimal.cos(u).plus(h.mul(radLat.cos()))
  }
}
