import { JulianDay } from '../constants'
import { fractionalYear } from '../dates'

function getK(jd: JulianDay): number {
  const decimalYear = fractionalYear(jd)
  return 4.15201 * (decimalYear - 2000.12)
}

export function getAphelion(jd: JulianDay): JulianDay {
  const kdash = getK(jd) + 0.5
  return 2451590.257 + 87.96934963 * kdash
}

export function getPerihelion(jd: JulianDay): JulianDay {
  const k = getK(jd)
  return 2451590.257 + 87.96934963 * k
}