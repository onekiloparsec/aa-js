import Decimal from 'decimal.js'
import { Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { DEG2RAD } from '@/constants'
import { getJulianCentury } from '@/juliandays'

export function getCorrectionInLongitude (jd: JulianDay | number, lng: Degree | number, lat: Degree | number): Degree {
  const T = getJulianCentury(jd)
  let Ldash: Radian = new Decimal(lng)
    .minus(new Decimal(1.397).mul(T))
    .minus(new Decimal(0.00031).mul(T.pow(2)))
    .mul(DEG2RAD)
  const value = new Decimal(-0.09033)
    .plus(new Decimal(0.03916)
      .mul(Ldash.cos().plus(Ldash.sin()))
      .mul(new Decimal(lat).mul(DEG2RAD).tan()))
  return value.dividedBy(3600)
}

export function getCorrectionInLatitude (jd: JulianDay | number, lng: Degree | number): Degree {
  const T: JulianCentury = getJulianCentury(jd)
  let Ldash: Radian = new Decimal(lng)
    .minus(new Decimal(1.397).mul(T))
    .minus(new Decimal(0.00031).mul(T.pow(2)))
    .mul(DEG2RAD)
  const value = new Decimal(0.03916).mul(Ldash.cos().minus(Ldash.sin()))
  return value.dividedBy(3600)
}
