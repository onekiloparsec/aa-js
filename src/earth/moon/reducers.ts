import { Radian } from '@/types'

export function getSigma (E: number, D: Radian, M: Radian, Mdash: Radian, F: Radian, getCoeffsA: Function, getCoeffsB: Function, coeffBMember: 'A' | 'B' | '', argumentFunc: string): number {
  const coeffsA = getCoeffsA() as { D: number, M: number, Mdash: number, F: number }[]
  const coeffsB = getCoeffsB() as { A: number, B: number }[]
  return coeffsA.reduce((sum, val, index) => {
    const argument = val.D * D
      + val.M * M
      + val.Mdash * Mdash
      + val.F * F
    
    const modulator = (Math.abs(val.M) === 1) ? E :
      (Math.abs(val.M) === 2) ? Math.pow(E, 2)
        : 1
    
    // SigmaL values = "A" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
    // @ts-ignore
    const coeffB = coeffBMember.length ? coeffsB[index][coeffBMember] : coeffsB[index]
    // @ts-ignore
    return sum + (coeffB * modulator * Math[argumentFunc](argument))
  }, 0)
}
