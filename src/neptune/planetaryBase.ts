import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 0.00607 * (decimalYear - 2047.5)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2468895.1 + 60190.33 * kdash + 0.03429 * kdash * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2468895.1 + 60190.33 * k + 0.03429 * k * k
}