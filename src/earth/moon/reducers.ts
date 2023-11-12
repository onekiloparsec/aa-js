import Decimal from '@/decimal'
import { Radian } from '@/types'

export function getSigma (E: Decimal, D: Radian, M: Radian, Mdash: Radian, F: Radian, getCoeffsA: Function, getCoeffsB: Function, coeffBMember: 'A' | 'B' | '', argumentFunc: string, highPrecision: boolean = true): Decimal | number {
  let Sigma
  if (highPrecision) {
    const coeffsA = getCoeffsA(highPrecision) as { D: Decimal, M: Decimal, Mdash: Decimal, F: Decimal }[]
    const coeffsB = getCoeffsB(highPrecision) as { A: Decimal, B: Decimal }[]

    Sigma = coeffsA.reduce((sum, val, index) => {
      const argument = val.D.mul(D)
        .plus(val.M.mul(M))
        .plus(val.Mdash.mul(Mdash))
        .plus(val.F.mul(F))

      const modulator = (val.M.abs().toNumber() === 1) ? E :
        (val.M.abs().toNumber() === 2) ? E.pow(2)
          : 1

      // SigmaL values = "A" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
      // SigmaB values = "B" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339

      // @ts-ignore
      const coeffB = coeffBMember.length ? coeffsB[index][coeffBMember] : coeffsB[index]
      // @ts-ignore
      return sum.plus(coeffB.mul(modulator).mul(Decimal[argumentFunc](argument)))
    }, new Decimal(0))
  } else {
    const coeffsA = getCoeffsA(highPrecision) as { D: number, M: number, Mdash: number, F: number }[]
    const coeffsB = getCoeffsB(highPrecision) as { A: number, B: number }[]

    Sigma = coeffsA.reduce((sum, val, index) => {
      const argument = val.D * D.toNumber()
        + val.M * M.toNumber()
        + val.Mdash * Mdash.toNumber()
        + val.F * F.toNumber()

      const modulator = (Math.abs(val.M) === 1) ? E.toNumber() :
        (Math.abs(val.M) === 2) ? E.pow(2).toNumber()
          : 1

      // SigmaL values = "A" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
      // @ts-ignore
      const coeffB = coeffBMember.length ? coeffsB[index][coeffBMember] : coeffsB[index]
      // @ts-ignore
      return sum + (coeffB * modulator * Math[argumentFunc](argument))
    }, 0)
  }

  return Sigma
}
