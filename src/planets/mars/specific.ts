
import { AstronomicalUnit, Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { MINUSONE, ZERO } from '@/constants'
import { getLightTimeFromDistance } from '@/distances'
import { getJulianCentury } from '@/juliandays'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

function computeMarsDetails (jd: JulianDay): {
  T: JulianCentury,
  Lambda0: Radian,
  Beta0: Radian,
  lambda: Radian,
  beta: Radian,
  l: Radian,
  b: Radian,
  r: AstronomicalUnit,
  Delta: AstronomicalUnit
} {
  const T = getJulianCentury(jd)

  // See AA, Equ 42.1, p.288
  const Lambda0 = (new Decimal('352.9065').plus(new Decimal('1.173_30').mul(T)))* DEG2RAD
  const Beta0 = (new Decimal('63.2818').minus(new Decimal('0.003_94').mul(T)))* DEG2RAD

  // Step 2
  const l0 = Earth.getEclipticLongitude(jd)* DEG2RAD
  const b0 = Earth.getEclipticLatitude(jd)* DEG2RAD
  const R = Earth.getRadiusVector(jd)

  let previousLightTravelTime = ZERO
  let lightTravelTime = ZERO
  let x = ZERO
  let y = ZERO
  let z = ZERO
  let shouldIterate = true
  let Delta = ZERO
  let l = ZERO
  let b = ZERO
  let r = ZERO

  while (shouldIterate) {
    let JD2 = new Decimal(jd).minus(lightTravelTime)

    // Step 3
    l = getEclipticLongitude(JD2)* DEG2RAD
    b = getEclipticLatitude(JD2)* DEG2RAD
    r = getRadiusVector(JD2)

    // Step 4
    x = r.mul(b.cos()).mul(l.cos()).minus(R.mul(l0.cos()))
    y = r.mul(b.cos()).mul(l.sin()).minus(R.mul(l0.sin()))
    z = r.mul(b.sin()).minus(R.mul(b0.sin()))
    Delta = Decimal.sqrt(x.pow(2).plus(y.pow(2)).plus(z.pow(2)))
    lightTravelTime = getLightTimeFromDistance(Delta)

    // Prepare for the next loop around
    // 2e-6 corresponds to 0.17 of a second
    shouldIterate = (Decimal.abs(lightTravelTime.minus(previousLightTravelTime)).greaterThan(2e-6))
    if (shouldIterate) {
      previousLightTravelTime = lightTravelTime
    }
  }

  // Step 5
  const lambda = Math.atan2(y, x)
  const beta = Math.atan2(z, Decimal.sqrt(x.pow(2).plus(y.pow(2))))

  return { T, Lambda0, Beta0, lambda, beta, l, b, r, Delta }
}

/**
 * The planetocentric declination of the Earth.
 * When it is positive, the planet northern pole is tilted towards the Earth.
 * @param {JulianDay} jd The julian day
 * @memberof module:Mars
 */
export function getPlanetocentricDeclinationOfTheEarth (jd: JulianDay): Degree {
  const { Lambda0, Beta0, lambda, beta } = computeMarsDetails(jd)

  const value1 = MINUSONE
    .mul(Math.sin(Beta0))
    .mul(Math.sin(beta))

  const value2 = Math.cos(Beta0)
    .mul(Math.cos(beta))
    .mul(Math.cos(Lambda0.minus(lambda)))

  // details.DE
  return Decimal.asin(value1.minus(value2)).radiansToDegrees()
}

/**
 * The planetocentric declination of the Sun.
 * When it is positive, the planet northern pole is tilted towards the sun.
 * @param jd
 * @memberof module:Mars
 */
export function getPlanetocentricDeclinationOfTheSun (jd: JulianDay): Degree {
  const { T, Lambda0, Beta0, l, b, r } = computeMarsDetails(jd)

  // Step 7
  const N = new Decimal(49.5581).plus(new Decimal('0.7721').mul(T))
  const [ldeg, bdeg] = [l.radiansToDegrees(), b.radiansToDegrees()]
  const ldash: Degree = ldeg.minus(new Decimal('0.00697').dividedBy(r))
  const bdash: Degree = bdeg.minus(new Decimal('0.000225')
    .mul(Math.cos((ldeg.minus(N))* DEG2RAD))
    .dividedBy(r))

  // Step 8
  const value1 = MINUSONE.mul(Math.sin(Beta0))
    .mul(Math.sin(bdash* DEG2RAD))

  const value2 = Math.cos(Beta0)
    .mul(Math.cos(bdash* DEG2RAD))
    .mul(Math.cos(Lambda0.minus(ldash* DEG2RAD)))

  // details.DS
  return Decimal.asin(value1.minus(value2)).radiansToDegrees()
}

