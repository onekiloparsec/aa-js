import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 0.01190 * (decimalYear - 2051.1)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2470213.5 + 30694.8767 * kdash - 0.00541 * kdash * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2470213.5 + 30694.8767 * k - 0.00541 * k * k
}