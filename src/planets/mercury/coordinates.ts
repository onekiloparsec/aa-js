import Decimal from '@/decimal'
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
  getCoefficientsL5,
  getCoefficientsR0,
  getCoefficientsR1,
  getCoefficientsR2,
  getCoefficientsR3,
} from './coefficients'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Mercury
 */
export function getEclipticLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = getCoefficientsL0(highPrecision)
  const coeffs1 = getCoefficientsL1(highPrecision)
  const coeffs2 = getCoefficientsL2(highPrecision)
  const coeffs3 = getCoefficientsL3(highPrecision)
  const coeffs4 = getCoefficientsL4(highPrecision)
  const coeffs5 = getCoefficientsL5(highPrecision)

  let value: Decimal

  if (highPrecision) {
    // AA p.218: Values A are expressed in 10^-8 radians, while B and C values are in radians.
    const L0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const L5 = (coeffs5 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (L0
        .plus(L1.mul(tau))
        .plus(L2.mul(tau.pow(2)))
        .plus(L3.mul(tau.pow(3)))
        .plus(L4.mul(tau.pow(4)))
        .plus(L5.mul(tau.pow(5)))
    )
  } else {
    const taunum = tau.toNumber()
    const L0 = (coeffs0 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L1 = (coeffs1 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L2 = (coeffs2 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L3 = (coeffs3 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L4 = (coeffs4 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const L5 = (coeffs5 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      L0 + L1 * taunum + L2 * Math.pow(taunum, 2) + L3 * Math.pow(taunum, 3) + L4 * Math.pow(taunum, 4) + L5 * Math.pow(taunum, 5)
    )
  }

  return fmod360(value.dividedBy(1e8).radiansToDegrees())
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Mercury
 */
export function getEclipticLatitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = getCoefficientsB0(highPrecision)
  const coeffs1 = getCoefficientsB1(highPrecision)
  const coeffs2 = getCoefficientsB2(highPrecision)
  const coeffs3 = getCoefficientsB3(highPrecision)
  const coeffs4 = getCoefficientsB4(highPrecision)

  let value: Decimal

  if (highPrecision) {
    const B0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const B4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (B0
        .plus(B1.mul(tau))
        .plus(B2.mul(tau.pow(2)))
        .plus(B3.mul(tau.pow(3)))
        .plus(B4.mul(tau.pow(4)))
    )
  } else {
    const taunum = tau.toNumber()
    const B0 = (coeffs0 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B1 = (coeffs1 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B2 = (coeffs2 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B3 = (coeffs3 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const B4 = (coeffs4 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
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
 * @memberof module:Mercury
 */
export function getRadiusVector (jd: JulianDay | number, highPrecision: boolean = true): AstronomicalUnit {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = getCoefficientsR0(highPrecision)
  const coeffs1 = getCoefficientsR1(highPrecision)
  const coeffs2 = getCoefficientsR2(highPrecision)
  const coeffs3 = getCoefficientsR3(highPrecision)

  let value: Decimal

  if (highPrecision) {
    const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (R0
        .plus(R1.mul(tau))
        .plus(R2.mul(tau.pow(2)))
        .plus(R3.mul(tau.pow(3)))
    )
  } else {
    const taunum = tau.toNumber()
    const R0 = (coeffs0 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R1 = (coeffs1 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R2 = (coeffs2 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R3 = (coeffs3 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      R0 + R1 * taunum + R2 * Math.pow(taunum, 2) + R3 * Math.pow(taunum, 3)
    )
  }

  return value.dividedBy(1e8)
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Mercury
 */
export function getEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd, highPrecision),
    latitude: getEclipticLatitude(jd, highPrecision)
  }
}

/**
 * Heliocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Mercury
 */
export function getEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd, highPrecision),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd, highPrecision) : Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
}
