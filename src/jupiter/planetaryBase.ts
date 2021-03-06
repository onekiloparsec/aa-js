import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 0.08430 * (decimalYear - 2011.20)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2455636.936 + 4332.897065 * kdash + 0.0001367 * kdash * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2455636.936 + 4332.897065 * k + 0.0001367 * k * k
}