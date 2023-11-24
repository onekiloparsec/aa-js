/**
 @module Sun
 */
import Decimal from '@/decimal'
import { Degree, JulianCentury, JulianDay } from '@/types'
import { getJulianCentury } from '@/juliandays'
import { DEG2RAD } from '@/constants'
import { fmod360 } from '@/utils'

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The sun mean anomaly
 */
export function getMeanAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  // In AA++ (C++) implementation, values differ a little bit. But we prefer textbook AA values to ensure tests validity
  // In AA++ : fmod360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000)
  let value
  if (highPrecision) {
    value = new Decimal('357.529_11')
      .plus(new Decimal('35999.050_29').mul(T))
      .minus(new Decimal('0.000_1537').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('24_490_000'))
  } else {
    const t = T.toNumber()
    value = 357.529_11
      + 35999.050_29 * t
      - 0.0001537 * t * t
      + t * t * t / 24_490_000
  }
  return fmod360(value)
}

/**
 * Computes the Sun true anomaly
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The Sun true anomaly
 */
export function getTrueAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  const M = getMeanAnomaly(jd, highPrecision)
  const C = getEquationOfTheCenter(T, M, highPrecision)
  return fmod360(M.plus(C))
}

/**
 * Get the Sun's Equation of the center
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {Degree} M
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getEquationOfTheCenter (T: JulianCentury | number, M: Degree | number, highPrecision: boolean = true): Degree {
  if (highPrecision) {
    return (
      new Decimal(1.914_602)
        .minus(new Decimal(0.004_817).mul(T))
        .minus(new Decimal(0.000_014).mul(T).mul(T))
    )
      .mul(Decimal.sin(new Decimal(M).degreesToRadians()))
      .plus((new Decimal(0.019_993)
        .minus(new Decimal(0.000_101).mul(T)))
        .mul(Decimal.sin(new Decimal(2).mul(M).degreesToRadians())))
      .plus(new Decimal(0.000_289)
        .mul(Decimal.sin(new Decimal(3).mul(M).degreesToRadians())))
  } else {
    const t: number = Decimal.isDecimal(T) ? T.toNumber() : T
    const m: number = Decimal.isDecimal(M) ? M.toNumber() : M
    const value = (
        1.914_602
        - 0.004_817 * t
        - 0.000_014 * t * t
      )
      * Math.sin(m * DEG2RAD.toNumber())
      + ((0.019_993
          - 0.000_101 * t)
        * Math.sin(2 * m * DEG2RAD.toNumber())
      )
      + (0.000_289
        * Math.sin(3 * m * DEG2RAD.toNumber()))
    return new Decimal(value)
  }
}

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury | number, highPrecision: boolean = true): Degree {
  let value
  if (highPrecision) {
    value = new Decimal('280.466_46')
      .plus(new Decimal('36_000.769_83').mul(T))
      .plus(new Decimal('0.000_3032').mul(new Decimal(T).pow(2)))
  } else {
    const t: number = Decimal.isDecimal(T) ? T.toNumber() : T
    value = 280.466_46
      + 36_000.769_83 * t
      + 0.000_3032 * t * t
  }
  return fmod360(value)
}
