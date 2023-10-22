import Decimal from 'decimal.js'
import { AstronomicalUnit, Degree, EclipticCoordinates, JulianDay, Meter, Radian } from '@/types'
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
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const tau = getJulianMillenium(jd)

  // AA p.218: Values A are expressed in 10^-8 radians, while B and C values are in radians.
  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L1 = gL1EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L2 = gL2EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L3 = gL3EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L4 = gL4EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L5 = gL5EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

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
 * @returns {Degree}
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const tau = getJulianMillenium(jd)

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B1 = gB1EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  const value = (B0
      .plus(B1.mul(tau))
  ).dividedBy(1e8)

  return fmod90(value.mul(RAD2DEG))
}

/**
 * Heliocentric coordinates, see AA p.218, 219
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
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
 * Heliocentric coordinates longitude for the equinox J2000, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitudeJ2000 (jd: JulianDay | number): Degree {
  const tau = getJulianMillenium(jd)

  const L0 = gL0EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L1 = gL1EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L2 = gL2EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L3 = gL3EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const L4 = gL4EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  const value = (L0
      .plus(L1.mul(tau))
      .plus(L2.mul(tau.pow(2)))
      .plus(L3.mul(tau.pow(3)))
      .plus(L4.mul(tau.pow(4)))
  ).dividedBy(1e8)

  return fmod360(value.mul(RAD2DEG))
}

/**
 * Heliocentric coordinates latitude for the equinox J2000, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLatitudeJ2000 (jd: JulianDay | number): Degree {
  const tau = getJulianMillenium(jd)

  const B0 = gB0EarthCoefficients.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B1 = gB1EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B2 = gB2EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B3 = gB3EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
  const B4 = gB4EarthCoefficientsJ2000.reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))

  const value = (B0
      .plus(B1.mul(tau))
      .plus(B2.mul(tau.pow(2)))
      .plus(B3.mul(tau.pow(3)))
      .plus(B4.mul(tau.pow(4)))
  ).dividedBy(1e8)

  return fmod90(value.mul(RAD2DEG))
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
