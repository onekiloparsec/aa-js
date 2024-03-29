/**
 @module Earth
 */
import Decimal from '@/decimal'
import {
  AstronomicalUnit,
  Degree,
  PlanetCoefficient,
  PlanetCoefficientNum,
  EclipticCoordinates,
  Equinox,
  JulianDay,
  Meter,
  Radian
} from '@/types'
import { EARTH_EQUATORIAL_RADIUS, EARTH_RADIUS_FLATTENING_FACTOR } from '@/constants'
import { getJulianCentury, getJulianMillenium } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Sun } from '@/sun'
import {
  getCoefficientsB0,
  getCoefficientsB1,
  getCoefficientsB1J2000,
  getCoefficientsB2J2000,
  getCoefficientsB3J2000,
  getCoefficientsB4J2000,
  getCoefficientsL0,
  getCoefficientsL1,
  getCoefficientsL1J2000,
  getCoefficientsL2,
  getCoefficientsL2J2000,
  getCoefficientsL3,
  getCoefficientsL3J2000,
  getCoefficientsL4,
  getCoefficientsL4J2000,
  getCoefficientsL5,
  getCoefficientsR0,
  getCoefficientsR1,
  getCoefficientsR2,
  getCoefficientsR3,
  getCoefficientsR4,
} from './coefficients'

/** @private */
function getEclipticLongitudeValue (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL0(highPrecision) : getCoefficientsL0(highPrecision)
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL1(highPrecision) : getCoefficientsL1J2000(highPrecision)
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL2(highPrecision) : getCoefficientsL2J2000(highPrecision)
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL3(highPrecision) : getCoefficientsL3J2000(highPrecision)
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL4(highPrecision) : getCoefficientsL4J2000(highPrecision)
  const coeffs5 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsL5(highPrecision) : []

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

  return value.dividedBy(1e8).radiansToDegrees()
}

/**
 * Heliocentric coordinates longitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLongitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  return fmod360(getEclipticLongitudeValue(jd, equinox, highPrecision))
}

/**
 * Heliocentric coordinates longitudinal rotation between two dates.
 * @param jdStart {JulianDay} The starting julian day.
 * @param jdEnd {JulianDay} The ending julian day.
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLongitudinalRotation (jdStart: JulianDay | number, jdEnd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  return getEclipticLongitudeValue(jdEnd, equinox, highPrecision).minus(getEclipticLongitudeValue(jdStart, equinox))
}

/**
 * Heliocentric coordinates latitude, see AA p.218, 219
 * Corresponds to AA+ CAAEarth::EclipticLatitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getEclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsB0(highPrecision) : getCoefficientsB0(highPrecision)
  const coeffs1 = (equinox === Equinox.MeanOfTheDate) ? getCoefficientsB1(highPrecision) : getCoefficientsB1J2000(highPrecision)
  const coeffs2 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB2J2000(highPrecision)
  const coeffs3 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB3J2000(highPrecision)
  const coeffs4 = (equinox === Equinox.MeanOfTheDate) ? [] : getCoefficientsB4J2000(highPrecision)

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
 * Heliocentric coordinates, see AA p.218, 219
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Earth
 */
export function getEclipticCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd, equinox, highPrecision),
    latitude: getEclipticLatitude(jd, equinox, highPrecision)
  }
}

/**
 * Radius vector (distance from the Sun)
 * Corresponds to AA+ CAAEarth::RadiusVector
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {AstronomicalUnit}
 * @memberof module:Earth
 */
export function getRadiusVector (jd: JulianDay | number, highPrecision: boolean = true): AstronomicalUnit {
  const tau = getJulianMillenium(jd, highPrecision)

  const coeffs0 = getCoefficientsR0(highPrecision)
  const coeffs1 = getCoefficientsR1(highPrecision)
  const coeffs2 = getCoefficientsR2(highPrecision)
  const coeffs3 = getCoefficientsR3(highPrecision)
  const coeffs4 = getCoefficientsR4(highPrecision)

  let value: Decimal

  if (highPrecision) {
    const R0 = (coeffs0 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R1 = (coeffs1 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R2 = (coeffs2 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R3 = (coeffs3 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    const R4 = (coeffs4 as PlanetCoefficient[]).reduce((sum, val) => sum.plus(val.A.mul(Decimal.cos(val.B.plus(val.C.mul(tau))))), new Decimal(0))
    value = (R0
        .plus(R1.mul(tau))
        .plus(R2.mul(tau.pow(2)))
        .plus(R3.mul(tau.pow(3)))
        .plus(R4.mul(tau.pow(4)))
    )
  } else {
    const taunum = tau.toNumber()
    const R0 = (coeffs0 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R1 = (coeffs1 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R2 = (coeffs2 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R3 = (coeffs3 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    const R4 = (coeffs4 as PlanetCoefficientNum[]).reduce((sum, val) => sum + (val.A * Math.cos(val.B + val.C * taunum)), 0)
    value = new Decimal(
      R0 + R1 * taunum + R2 * Math.pow(taunum, 2) + R3 * Math.pow(taunum, 3) + R4 * Math.pow(taunum, 4)
    )
  }

  return value.dividedBy(1e8)
}

/**
 * Mean anomaly, see AA p194
 * The mean anomaly is the angular distance from perihelion which the planet
 * would have if it moved around the Sun with a constant angular velocity.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  return Sun.getMeanAnomaly(jd, highPrecision)
}

/**
 * Eccentricity of the orbit
 * See AA p.163 (and AA p.151)
 * @param  {JulianDay} jd The julian day
 * @returns {Decimal} The eccentricity (comprise between 0==circular, and 1).
 * @memberof module:Earth
 */
export function getEccentricity (jd: JulianDay | number): Decimal {
  const T = getJulianCentury(jd)
  return new Decimal('0.016_708_634').minus(T.mul('0.000_042_037')).minus(T.pow(2).mul('0.000_000_1267'))
}

/**
 * Longitude of perihelion
 * See AA p.151
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The longitude of perihelion
 * @memberof module:Earth
 */
export function getLongitudeOfPerihelion (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return new Decimal('102.937_35').plus(T.mul('1.719_46')).plus(T.pow(2).mul('0.000_46'))
}

/**
 * Computes the "rho*sin(phi')" and "rho*cos(phi')" quantities, due to Earth flattening.
 * See AA p 82
 * @param  {Meter} height The observer heights above Earth surface.
 * @param {Degree} lat The observer's geographic latitude
 * @returns {Number} The quantities
 * @memberof module:Earth
 */
export function getFlatteningCorrections (height: Meter | number, lat: Degree | number) {
  const earthRadius: Meter = EARTH_EQUATORIAL_RADIUS.mul(1000)
  const b_a: Decimal = new Decimal(1).minus(EARTH_RADIUS_FLATTENING_FACTOR)
  const radLat: Radian = new Decimal(lat).degreesToRadians()
  const u: Radian = Decimal.atan(b_a.mul(radLat.tan())) // Radians
  const h = new Decimal(height).dividedBy(earthRadius)
  return {
    rhosinphi: b_a.mul(Decimal.sin(u)).plus(h.mul(radLat.sin())),
    rhocosphi: Decimal.cos(u).plus(h.mul(radLat.cos()))
  }
}
