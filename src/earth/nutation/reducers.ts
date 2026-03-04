import { DEG2RAD } from '@/constants'
import { Degree, JulianCentury } from '@/types'
import { nutationCoefficients } from './coefficients'

export function getReducedValue (T: JulianCentury, D: Degree, M: Degree, Mprime: Degree, F: Degree, omega: Degree, sinOrCos: 'sin' | 'cos'): number {
  const func = sinOrCos === 'sin' ? Math.sin : Math.cos

  return nutationCoefficients.reduce((sum, val) => {
    const argument = val.D * D
      + val.M * M
      + val.Mprime * Mprime
      + val.F * F
      + val.omega * omega

    const mod1 = sinOrCos === 'sin' ? val.sincoeff1 : val.coscoeff1
    const mod2 = sinOrCos === 'sin' ? val.sincoeff2 : val.coscoeff2

    return sum + ((mod1 + (mod2 * T)) * (func(argument * DEG2RAD) * 0.0001))
  }, 0)
}
