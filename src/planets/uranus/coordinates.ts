
import {
  AstronomicalUnit,
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  JulianDay,
  Obliquity,
  PlanetCoefficient,
  PlanetCoefficientNum
} from '@/types'
import { fmod360, fmod90 } from '@/utils'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianMillenium } from '@/juliandays'
import { Earth } from '@/earth'
import {
  getCoefficientsB0,
  getCoefficientsB1,
  getCoefficientsB2,
  getCoefficientsB3,
  getCoefficientsB4,
  getCoefficientsL0,
  getCoefficientsL1,
  getCoefficientsL2,
  getCoefficientsL3,
  getCoefficientsL4,
  getCoefficientsR0,
  getCoefficientsR1,
  getCoefficientsR2,
  getCoefficientsR3,
  getCoefficientsR4,
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Uranus
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)

  const coeffs0 = getCoefficientsL0()
  const coeffs1 = getCoefficientsL1()
  const coeffs2 = getCoefficientsL2()
  const coeffs3 = getCoefficientsL3()
  const coeffs4 = getCoefficientsL4()

  let value: Decimal

  if () {
    // AA p.218: Values A are expressed in 10^-8 radians, while B and C values are in radians.
    const L0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (L0
        .plus(L1.mul(tau))
        .plus(L2.mul(tau.pow(2)))
        .plus(L3.mul(tau.pow(3)))
        .plus(L4.mul(tau.pow(4)))
    )
  } else {
    const taunum = tau.
    const L0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      L0 + L1 * taunum + L2 * Math.pow(taunum, 2) + L3 * Math.pow(taunum, 3) + L4 * Math.pow(taunum, 4)
    )
  }

  return fmod360(value.dividedBy(1e8).radiansToDegrees())
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Uranus
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const tau = getJulianMillenium(jd)

  const coeffs0 = getCoefficientsB0()
  const coeffs1 = getCoefficientsB1()
  const coeffs2 = getCoefficientsB2()
  const coeffs3 = getCoefficientsB3()
  const coeffs4 = getCoefficientsB4()

  let value: Decimal

  if () {
    const B0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (B0
        .plus(B1.mul(tau))
        .plus(B2.mul(tau.pow(2)))
        .plus(B3.mul(tau.pow(3)))
        .plus(B4.mul(tau.pow(4)))
    )
  } else {
    const taunum = tau.
    const B0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      B0 + B1 * taunum + B2 * Math.pow(taunum, 2) + B3 * Math.pow(taunum, 3) + B4 * Math.pow(taunum, 4)
    )
  }

  return fmod90(value.dividedBy(1e8).radiansToDegrees())
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {AstronomicalUnit}
 * @memberof module:Uranus
 */
export function getRadiusVector (jd: JulianDay): AstronomicalUnit {
  const tau = getJulianMillenium(jd)

  const coeffs0 = getCoefficientsR0()
  const coeffs1 = getCoefficientsR1()
  const coeffs2 = getCoefficientsR2()
  const coeffs3 = getCoefficientsR3()
  const coeffs4 = getCoefficientsR4()

  let value: Decimal

  if () {
    const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Math.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (R0
        .plus(R1.mul(tau))
        .plus(R2.mul(tau.pow(2)))
        .plus(R3.mul(tau.pow(3)))
        .plus(R4.mul(tau.pow(4)))
    )
  } else {
    const taunum = tau.
    const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      R0 + R1 * taunum + R2 * Math.pow(taunum, 2) + R3 * Math.pow(taunum, 3) + R4 * Math.pow(taunum, 4)
    )
  }

  return value.dividedBy(1e8)
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Uranus
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
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Uranus
 */
export function getEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd),
    highPrecision
  )
}
