import { getJulianCentury } from '@/js/juliandays'
import { Coordinates3D, JulianDay } from '@/js/types'
import { AberrationCoefficient, getAberrationCoefficients } from './coefficients'


/**
 * Earth velocity (as a 3D vector), with respect to the barycenter of the solar system, in the equatorial
 * J2000.0 reference frame.
 * @param {JulianDay} jd The julian day
 * @return {Coordinates3D} The units are 10^-8 AstronomicalUnit per day.
 * @memberof module:Earth
 */
export function getEarthVelocity (jd: JulianDay): Coordinates3D {
  const T = getJulianCentury(jd)
  const coefficients = getAberrationCoefficients()
  
  const L2 = 3.176_1467 + 1021.328_5546 * T
  const L3 = 1.753_4703 + 628.307_5849 * T
  const L4 = 6.203_4809 + 334.061_2431 * T
  const L5 = 0.599_5465 + 52.969_0965 * T
  const L6 = 0.874_0168 + 21.329_9095 * T
  const L7 = 5.481_2939 + 7.478_1599 * T
  const L8 = 5.311_8863 + 3.813_3036 * T
  const Ldash = 3.810_3444 + 8399.684_7337 * T
  const D = 5.198_4667 + 7771.377_1486 * T
  const Mdash = 2.355_5559 + 8328.691_4289 * T
  const F = 1.627_9052 + 8433.466_1601 * T
  
  const result = (coefficients as AberrationCoefficient[]).reduce((sum, val) => {
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
        + val.xsin + val.xsint * T * Math.sin(argument)
        + val.xcos + val.xcost * T * Math.cos(argument),
      Y: sum.Y
        + val.ysin + val.ysint * T * Math.sin(argument)
        + val.ycos + val.ycost * T * Math.cos(argument),
      Z: sum.Z
        + val.zsin + val.zsint * T * Math.sin(argument)
        + val.zcos + val.zcost * T * Math.cos(argument)
    }
  }, { X: 0, Y: 0, Z: 0 })
  
  return result
}
