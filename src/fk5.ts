import Decimal from '@/decimal'
import { Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { getJulianCentury } from '@/juliandays'

export function getCorrectionInLongitude (jd: JulianDay | number, lng: Degree | number, lat: Degree | number): Degree {
  const T = getJulianCentury(jd)
  let Ldash: Radian = new Decimal(lng)
    .minus(new Decimal('1.397').mul(T))
    .minus(new Decimal('0.000_31').mul(T.pow(2)))
    .degreesToRadians()
  const value = new Decimal('-0.090_33')
    .plus(new Decimal('0.039_16')
      .mul(Ldash.cos().plus(Ldash.sin()))
      .mul(new Decimal(lat).degreesToRadians().tan()))
  return value.dividedBy('3600')
}

export function getCorrectionInLatitude (jd: JulianDay | number, lng: Degree | number): Degree {
  const T: JulianCentury = getJulianCentury(jd)
  let Ldash: Radian = new Decimal(lng)
    .minus(new Decimal('1.397').mul(T))
    .minus(new Decimal('0.000_31').mul(T.pow(2)))
    .degreesToRadians()
  const value = new Decimal('0.039_16').mul(Ldash.cos().minus(Ldash.sin()))
  return value.dividedBy('3600')
}
