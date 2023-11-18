import Decimal from '@/decimal'
import { ZERO } from '@/constants'
import { getJulianCentury } from '@/juliandays'
import { Coordinates3D, JulianDay } from '@/types'
import { AberrationCoefficient, AberrationCoefficientNum, getAberrationCoefficients } from './coefficients'


/**
 * Earth velocity (as a 3D vector), with respect to the barycenter of the solar system, in the equatorial
 * J2000.0 reference frame.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Coordinates3D} The units are 10^-8 AstronomicalUnit per day.
 * @memberof module:Earth
 */
export function getEarthVelocity (jd: JulianDay | number, highPrecision: boolean = true): Coordinates3D {
  const T = getJulianCentury(jd, highPrecision)
  const coefficients = getAberrationCoefficients(highPrecision)

  if (highPrecision) {
    const L2 = new Decimal('3.176_1467').plus(new Decimal('1021.328_5546').mul(T))
    const L3 = new Decimal('1.753_4703').plus(new Decimal('628.307_5849').mul(T))
    const L4 = new Decimal('6.203_4809').plus(new Decimal('334.061_2431').mul(T))
    const L5 = new Decimal('0.599_5465').plus(new Decimal('52.969_0965').mul(T))
    const L6 = new Decimal('0.874_0168').plus(new Decimal('21.329_9095').mul(T))
    const L7 = new Decimal('5.481_2939').plus(new Decimal('7.478_1599').mul(T))
    const L8 = new Decimal('5.311_8863').plus(new Decimal('3.813_3036').mul(T))
    const Ldash = new Decimal('3.810_3444').plus(new Decimal('8399.684_7337').mul(T))
    const D = new Decimal('5.198_4667').plus(new Decimal('7771.377_1486').mul(T))
    const Mdash = new Decimal('2.355_5559').plus(new Decimal('8328.691_4289').mul(T))
    const F = new Decimal('1.627_9052').plus(new Decimal('8433.466_1601').mul(T))

    return (coefficients as AberrationCoefficient[]).reduce((sum, val) => {
      const argument = val.L2.mul(L2)
        .plus(val.L3.mul(L3))
        .plus(val.L4.mul(L4))
        .plus(val.L5.mul(L5))
        .plus(val.L6.mul(L6))
        .plus(val.L7.mul(L7))
        .plus(val.L8.mul(L8))
        .plus(val.Ldash.mul(Ldash))
        .plus(val.D.mul(D))
        .plus(val.Mdash.mul(Mdash))
        .plus(val.F.mul(F))
      return {
        X: sum.X
          .plus(val.xsin.plus(val.xsint.mul(T)).mul(argument.sin()))
          .plus(val.xcos.plus(val.xcost.mul(T)).mul(argument.cos())),
        Y: sum.Y
          .plus(val.ysin.plus(val.ysint.mul(T)).mul(argument.sin()))
          .plus(val.ycos.plus(val.ycost.mul(T)).mul(argument.cos())),
        Z: sum.Z
          .plus(val.zsin.plus(val.zsint.mul(T)).mul(argument.sin()))
          .plus(val.zcos.plus(val.zcost.mul(T)).mul(argument.cos()))
      }
    }, { X: ZERO, Y: ZERO, Z: ZERO })
  } else {
    const tnum = T.toNumber()
    const L2 = 3.176_1467 + 1021.328_5546 * tnum
    const L3 = 1.753_4703 + 628.307_5849 * tnum
    const L4 = 6.203_4809 + 334.061_2431 * tnum
    const L5 = 0.599_5465 + 52.969_0965 * tnum
    const L6 = 0.874_0168 + 21.329_9095 * tnum
    const L7 = 5.481_2939 + 7.478_1599 * tnum
    const L8 = 5.311_8863 + 3.813_3036 * tnum
    const Ldash = 3.810_3444 + 8399.684_7337 * tnum
    const D = 5.198_4667 + 7771.377_1486 * tnum
    const Mdash = 2.355_5559 + 8328.691_4289 * tnum
    const F = 1.627_9052 + 8433.466_1601 * tnum

    const result = (coefficients as AberrationCoefficientNum[]).reduce((sum, val) => {
      const argument = val.L2 * L2
        + val.L3 * L3
        + val.L4 * L4
        + val.L5 * L5
        + val.L6 * L6
        + val.L7 * L7
        + val.L8 * L8
        + val.Ldash * Ldash
        + val.D * D
        + val.Mdash * Mdash
        + val.F * F
      return {
        X: sum.X
          + val.xsin + val.xsint * tnum * Math.sin(argument)
          + val.xcos + val.xcost * tnum * Math.cos(argument),
        Y: sum.Y
          + val.ysin + val.ysint * tnum * Math.sin(argument)
          + val.ycos + val.ycost * tnum * Math.cos(argument),
        Z: sum.Z
          + val.zsin + val.zsint * tnum * Math.sin(argument)
          + val.zcos + val.zcost * tnum * Math.cos(argument)
      }
    }, { X: 0, Y: 0, Z: 0 })

    return {
      X: new Decimal(result.X),
      Y: new Decimal(result.Y),
      Z: new Decimal(result.Z)
    }
  }
}
