import Decimal from '@/decimal'
import { Degree, JulianDay } from '@/types'
import { FOUR, MINUSONE, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

function computeJupiterDetails (jd: JulianDay | number) {
  // Step 3
  const l0 = Earth.getEclipticLongitude(jd).degreesToRadians()
  const b0 = Earth.getEclipticLatitude(jd).degreesToRadians()
  const R = Earth.getRadiusVector(jd)

  // Step 4
  let l = getEclipticLongitude(jd).degreesToRadians()
  const b = getEclipticLatitude(jd).degreesToRadians()
  const r = getRadiusVector(jd)

  // Step 5
  let x = r.mul(b.cos()).mul(l.cos()).minus(R.mul(l0.cos()))
  let y = r.mul(b.cos()).mul(l.sin()).minus(R.mul(l0.sin()))
  let z = r.mul(b.sin()).minus(R.mul(b0.sin()))
  let Delta = Decimal.sqrt(x.pow(2).plus(y.pow(2)).plus(z.pow(2)))

  // Step 6
  l = l.minus(new Decimal(0.012990).mul(Delta).dividedBy(r.pow(2))).degreesToRadians()

  // Step 7 (l has changed)
  x = r.mul(b.cos()).mul(l.cos()).minus(R.mul(l0.cos()))
  y = r.mul(b.cos()).mul(l.sin()).minus(R.mul(l0.sin()))
  z = r.mul(b.sin()).minus(R.mul(b0.sin()))
  Delta = Decimal.sqrt(x.pow(2).plus(y.pow(2)).plus(z.pow(2)))

  // Step 8
  const e0 = Earth.getMeanObliquityOfEcliptic(jd).degreesToRadians()

  // Step 11
  const u = y.mul(e0.cos()).minus(z.mul(e0.sin()))
  const v = y.mul(e0.sin()).plus(z.mul(e0.cos()))
  const alpha = Decimal.atan2(u, x).radiansToDegrees()
  const delta = Decimal.atan2(v, Decimal.sqrt(x.pow(2).plus(u.pow(2)))).radiansToDegrees()

  return { alpha, delta, r, Delta }
}

export function getPlanetocentricDeclinationOfTheSun (jd: JulianDay | number): Degree {
  const d = new Decimal(jd).minus(2433282.5)
  const T1 = d.dividedBy(36525)

  const alpha0 = (new Decimal(268.00).plus(new Decimal(0.1061).mul(T1))).degreesToRadians()
  const delta0 = (new Decimal(64.50).minus(new Decimal(0.0164).mul(T1))).degreesToRadians()

  const { r, Delta } = computeJupiterDetails(jd)

  const l = (
    getEclipticLongitude(jd)
      .minus(new Decimal(0.012990).mul(Delta).dividedBy(r.pow(2)))
  ).degreesToRadians()

  const b = getEclipticLatitude(jd).degreesToRadians()

  // Step 8
  const e0 = Earth.getMeanObliquityOfEcliptic(jd).degreesToRadians()

  //Step 9
  const alphas = Decimal.atan2(e0.cos().mul(l.sin()).minus(e0.sin().mul(b.tan())), l.cos())
  const deltas = Decimal.asin(e0.cos().mul(b.sin()).plus(e0.sin().mul(b.cos()).mul(l.sin())))

  const value1 = MINUSONE.mul(delta0.sin()).mul(deltas.sin())
  const value2 = delta0.cos().mul(deltas.cos()).mul(Decimal.cos(alpha0.minus(alphas)))

  //Step 10 details.DS
  return Decimal.asin(value1.minus(value2)).radiansToDegrees()
}

export function getPlanetocentricDeclinationOfTheEarth (jd: JulianDay | number): Degree {
  const d = new Decimal(jd).minus(2433282.5)
  const T1 = d.dividedBy(36525)

  const alpha0 = (new Decimal(268.00).plus(new Decimal(0.1061).mul(T1))).degreesToRadians()
  const delta0 = (new Decimal(64.50).minus(new Decimal(0.0164).mul(T1))).degreesToRadians()

  const { alpha, delta } = computeJupiterDetails(jd)

  const value1 = MINUSONE.mul(delta0.sin()).mul(delta.sin())
  const value2 = delta0.cos().mul(delta.cos()).mul(Decimal.cos(alpha0.minus(alpha)))

  //Step 12 details.DE
  return Decimal.asin(value1.minus(value2)).radiansToDegrees()
}

export function getCentralMeridianLongitudes (jd: JulianDay | number): Object {
  const d = new Decimal(jd).minus('2433282.5')
  const T1 = d.dividedBy('36525')

  const alpha0 = (new Decimal('268.00').plus(new Decimal('0.1061').mul(T1))).degreesToRadians()
  const delta0 = (new Decimal('64.50').minus(new Decimal('0.0164').mul(T1))).degreesToRadians()

  // Step 3
  const l0 = Earth.getEclipticLongitude(jd).degreesToRadians()
  // const b0 = Earth.getgetEclipticLatitude(jd)
  // const b0rad = DEG2RAD * b0
  const R = Earth.getRadiusVector(jd)

  const { alpha, delta, r, Delta } = computeJupiterDetails(jd)

  const l = (
    getEclipticLongitude(jd)
      .minus(new Decimal('0.012_990').mul(Delta).dividedBy(r.pow(2)))
  ).degreesToRadians()

  // Step 2
  const W1 = fmod360(new Decimal('17.710').plus(new Decimal('877.900_035_39').mul(d)))
  const W2 = fmod360(new Decimal('16.838').plus(new Decimal('870.270_035_39').mul(d)))

  const y0 = delta0.sin().mul(delta.cos()).mul(Decimal.cos(alpha0.minus(alpha)))
  const y1 = delta.sin().mul(delta0.cos())
  const x = delta.cos().mul(Decimal.sin(alpha0.minus(alpha)))
  const xi = Decimal.atan2(y0.minus(y1), x).radiansToDegrees()

  // Step 13
  const Geometricw1 = fmod360(W1.minus(xi).minus(new Decimal('5.070_33').mul(Delta)))
  const Geometricw2 = fmod360(W2.minus(xi).minus(new Decimal('5.026_26').mul(Delta)))

  // Step 14
  const C = new Decimal('57.2958').mul(
    (TWO.mul(r).mul(Delta).plus(R.pow(2)).minus(r.pow(2)).minus(Delta.pow(2)))
      .dividedBy(FOUR.mul(r).mul(Delta))
  )

  let Apparentw1
  let Apparentw2
  if (Decimal.sin(l.minus(l0)).greaterThan(0)) {
    Apparentw1 = fmod360(Geometricw1.plus(C))
    Apparentw2 = fmod360(Geometricw2.plus(C))
  } else {
    Apparentw1 = fmod360(Geometricw1.minus(C))
    Apparentw2 = fmod360(Geometricw2.minus(C))
  }

  return {
    geometricSystemI: Geometricw1,
    geometricSystemII: Geometricw2,
    apparentSystemI: Apparentw1,
    apparentSystemII: Apparentw2
  }
}

