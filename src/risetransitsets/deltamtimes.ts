import Decimal from '@/decimal'
import { Degree, EquatorialCoordinates, GeographicCoordinates, LengthArray } from '@/types'
import { DEG2RAD, MINUSONE, STANDARD_ALTITUDE_STARS } from '@/constants'
import { fmod180, fmod360 } from '@/utils'


// See AA p24
function getInterpolatedValue (v1: Decimal, v2: Decimal, v3: Decimal, n: Decimal | number): Decimal {
  const a = new Decimal(v2).minus(v1)
  const b = new Decimal(v3).minus(v2)
  const c = b.minus(a)
  const dn = new Decimal(n)
  return new Decimal(v2).plus((dn.dividedBy(2)).mul(a.plus(b).plus(dn.mul(c))))
}

function getInterpolatedValueNum (v1: number, v2: number, v3: number, n: number): number {
  const a = v2 - v1
  const b = v3 - v2
  const c = b - a
  return v2 + (n / 2) * (a + b + (n * c))
}

export function getDeltaMTimes (m: Decimal,
                         isTransit: boolean,
                         Theta0: Degree,
                         DeltaT: Decimal,
                         equCoords: LengthArray<EquatorialCoordinates, 3>,
                         geoCoords: GeographicCoordinates,
                         alt: Degree | number = STANDARD_ALTITUDE_STARS,
                         highPrecision: boolean = true): {
  Deltam: Decimal,
  hourAngle: Degree,
  localAltitude: Degree
} {
  if (highPrecision) {
    const theta0: Degree = fmod360(Theta0.plus(new Decimal('360.985_647').mul(m)))
    const n = m.plus(DeltaT.dividedBy('86400'))

    const alpha: Degree = getInterpolatedValue(equCoords[0].rightAscension, equCoords[1].rightAscension, equCoords[2].rightAscension, n)
    const delta: Degree = getInterpolatedValue(equCoords[0].declination, equCoords[1].declination, equCoords[2].declination, n)

    const H: Degree = fmod180(theta0.plus(geoCoords.longitude).minus(alpha))
    const dlat = new Decimal(geoCoords.latitude).degreesToRadians()

    // Below is the horizontal altitude for given hour angle.
    const sinh = dlat.sin()
      .mul(delta.degreesToRadians().sin())
      .plus(dlat.cos()
        .mul(delta.degreesToRadians().cos())
        .mul(H.degreesToRadians().cos()))

    const h = sinh.asin().radiansToDegrees()
    return {
      Deltam: (isTransit) ?
        MINUSONE.mul(H).dividedBy(360) :
        (h.minus(alt)).dividedBy(delta.cos().mul(dlat.cos()).mul(H.sin()).mul(360)),
      hourAngle: H,
      localAltitude: h
    }
  } else {
    const nm = m.toNumber()
    const nTheta0 = Theta0.toNumber()
    const nDeltaT = DeltaT.toNumber()

    const theta0 = fmod360(nTheta0 + 360.985647 * nm).toNumber()
    const n = nm + nDeltaT / 86400

    const alpha = getInterpolatedValue(equCoords[0].rightAscension, equCoords[1].rightAscension, equCoords[2].rightAscension, n).toNumber()
    const delta = getInterpolatedValue(equCoords[0].declination, equCoords[1].declination, equCoords[2].declination, n).toNumber()

    const lng = Decimal.isDecimal(geoCoords.longitude) ? geoCoords.longitude.toNumber() : geoCoords.longitude
    const lat = Decimal.isDecimal(geoCoords.latitude) ? geoCoords.latitude.toNumber() : geoCoords.latitude
    const H = fmod180(theta0 + lng - alpha).toNumber()

    const deg2rad = DEG2RAD.toNumber()
    // Below is the horizontal altitude for given hour angle.
    const sinh = Math.sin(lat * deg2rad) * Math.sin(delta * deg2rad)
      + Math.cos(lat * deg2rad) * Math.cos(delta * deg2rad) * Math.cos(H * deg2rad)

    const h = Math.asin(sinh) / deg2rad
    const nalt = Decimal.isDecimal(alt) ? alt.toNumber() : alt
    return {
      Deltam: (isTransit) ?
        MINUSONE.mul(H).dividedBy(360) :
        new Decimal(
          (h - nalt) / (Math.cos(delta * deg2rad) * Math.cos(lat * deg2rad) * Math.sin(H * deg2rad) * 360)
        ),
      hourAngle: new Decimal(H),
      localAltitude: new Decimal(h)
    }
  }
}
