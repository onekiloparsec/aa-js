import Decimal from '@/decimal'
import { DEG2RAD } from '@/constants'
import { Degree, JulianCentury } from '@/types'
import { getCoefficients } from './coefficients'

export function getReducedValue (T: JulianCentury, D: Degree, M: Degree, Mprime: Degree, F: Degree, omega: Degree, sinOrCos: 'sin' | 'cos', highPrecision: boolean = true): Decimal {
  if (highPrecision) {
    const coeffs = getCoefficients(highPrecision) as {
      D: Decimal
      M: Decimal
      Mprime: Decimal
      F: Decimal
      omega: Decimal
      sincoeff1: Decimal
      sincoeff2: Decimal
      coscoeff1: Decimal
      coscoeff2: Decimal
    }[]

    return coeffs.reduce((sum, val) => {
      const argument = val.D.mul(D)
        .plus(val.M.mul(M))
        .plus(val.Mprime.mul(Mprime))
        .plus(val.F.mul(F))
        .plus(val.omega.mul(omega))

      const mod1 = sinOrCos === 'sin' ? val.sincoeff1 : val.coscoeff1
      const mod2 = sinOrCos === 'sin' ? val.sincoeff2 : val.coscoeff2
      const func = sinOrCos === 'sin' ? (v: Decimal) => Decimal.sin(v) : (v: Decimal) => Decimal.cos(v)

      return sum.plus(
        (mod1.plus(mod2.mul(T)))
          .mul(func(argument.degreesToRadians())
            .mul(0.0001))
      )
    }, new Decimal(0))
  } else {
    const coeffs = getCoefficients(highPrecision) as {
      D: number
      M: number
      Mprime: number
      F: number
      omega: number
      sincoeff1: number
      sincoeff2: number
      coscoeff1: number
      coscoeff2: number
    }[]
    const value = coeffs.reduce((sum, val) => {
      const argument = val.D * D.toNumber()
        + val.M * M.toNumber()
        + val.Mprime * Mprime.toNumber()
        + val.F * F.toNumber()
        + val.omega * omega.toNumber()

      const mod1 = sinOrCos === 'sin' ? val.sincoeff1 : val.coscoeff1
      const mod2 = sinOrCos === 'sin' ? val.sincoeff2 : val.coscoeff2
      const func = sinOrCos === 'sin' ? Math.sin : Math.cos

      return sum + (
        (mod1 + (mod2 * T.toNumber()))
        * (func(argument * DEG2RAD.toNumber())
          * 0.0001)
      )
    }, 0)

    return new Decimal(value)
  }
}
