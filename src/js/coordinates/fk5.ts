import { Degree, JulianDay } from '@/js/types'
import { getJulianCentury } from '@/js/juliandays'
import { DEG2RAD } from '@/js/constants'

export function getCorrectionInLongitude (jd: JulianDay, lng: Degree, lat: Degree): Degree {
  const T = getJulianCentury(jd)
  const Ldash = (lng - 1.397 * T - 0.000_31 * T * T) * DEG2RAD
  const value = -0.090_33 + (0.039_16 * (Math.cos(Ldash) - Math.sin(Ldash))) * Math.tan(lat * DEG2RAD)
  return value / 3600
}

export function getCorrectionInLatitude (jd: JulianDay, lng: Degree): Degree {
  const T = getJulianCentury(jd)
  const Ldash = (lng - 1.397 * T - 0.000_31 * T * T) * DEG2RAD
  const value = 0.039_16 * (Math.cos(Ldash) - Math.sin(Ldash))
  return value / 3600
}
