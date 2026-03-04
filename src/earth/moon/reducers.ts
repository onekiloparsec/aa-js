import { Radian } from '@/types'

type MoonArgCoeffs = { D: number, M: number, Mdash: number, F: number }[]
type MoonABCoeffs = { A: number, B: number }[] | number[]

export function getSigma (E: number, D: Radian, M: Radian, Mdash: Radian, F: Radian, coeffsA: MoonArgCoeffs, coeffsB: MoonABCoeffs, coeffBMember: 'A' | 'B' | '', argumentFunc: string): number {
  return coeffsA.reduce((sum, val, index) => {
    const argument = val.D * D
      + val.M * M
      + val.Mdash * Mdash
      + val.F * F

    const modulator = (Math.abs(val.M) === 1) ? E :
      (Math.abs(val.M) === 2) ? E * E
        : 1

    // SigmaL values = "A" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
    // @ts-ignore
    const coeffB = coeffBMember.length ? coeffsB[index][coeffBMember] : coeffsB[index]
    // @ts-ignore
    return sum + (coeffB * modulator * Math[argumentFunc](argument))
  }, 0)
}
