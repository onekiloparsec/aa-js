import Decimal from '@/decimal'
import { Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { getJulianCentury } from '@/juliandays'
import { DEG2RAD } from '@/constants'

export function getCorrectionInLongitude (jd: JulianDay | number, lng: Degree | number, lat: Degree | number, highPrecision: boolean = true): Degree {
  let value: Decimal
  if (highPrecision) {
    const T: JulianCentury = getJulianCentury(jd, highPrecision)
    const Ldash: Radian = (
      new Decimal(lng)
        .minus(new Decimal('1.397').mul(T))
        .minus(new Decimal('0.000_31').mul(T.pow(2)))
    )
      .degreesToRadians()
    value = new Decimal('-0.090_33')
      .plus(new Decimal('0.039_16')
        .mul(Ldash.cos().plus(Ldash.sin()))
        .mul(new Decimal(lat).degreesToRadians().tan()))
  } else {
    const T = getJulianCentury(jd, highPrecision).toNumber()
    const nlng = Decimal.isDecimal(lng) ? lng.toNumber() : lng
    const nlat = Decimal.isDecimal(lat) ? lat.toNumber() : lat
    const Ldash = (nlng - 1.397 * T - 0.000_31 * T * T) * DEG2RAD.toNumber()
    value = new Decimal(
      -0.090_33 + (0.039_16 * (Math.cos(Ldash) - Math.sin(Ldash))) * Math.tan(nlat * DEG2RAD.toNumber())
    )
  }
  return value.dividedBy('3600')
}

export function getCorrectionInLatitude (jd: JulianDay | number, lng: Degree | number, highPrecision: boolean = true): Degree {
  let value: Decimal
  if (highPrecision) {
    const T: JulianCentury = getJulianCentury(jd)
    const Ldash: Radian = (
      new Decimal(lng)
        .minus(new Decimal('1.397').mul(T))
        .minus(new Decimal('0.000_31').mul(T.pow(2)))
    )
      .degreesToRadians()
    value = new Decimal('0.039_16').mul(Ldash.cos().minus(Ldash.sin()))
  } else {
    const T = getJulianCentury(jd).toNumber()
    const nlng = Decimal.isDecimal(lng) ? lng.toNumber() : lng
    const Ldash = (nlng - 1.397 * T - 0.000_31 * T * T) * DEG2RAD.toNumber()
    value = new Decimal(
      0.039_16 * (Math.cos(Ldash) - Math.sin(Ldash))
    )
  }
  return value.dividedBy('3600')
}
