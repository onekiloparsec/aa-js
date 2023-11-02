import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { DEG2RAD, MINUSONE, RAD2DEG, ZERO } from '@/constants'
import { getLightTimeFromDistance } from '@/distances'
import { getJulianCentury } from '@/juliandays'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

function computeMarsDetails (jd: JulianDay | number): {
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
  const Lambda0 = (new Decimal(352.9065).plus(new Decimal(1.17330).mul(T))).mul(DEG2RAD)
  const Beta0 = (new Decimal(63.2818).minus(new Decimal(0.00394).mul(T))).mul(DEG2RAD)

  // Step 2
  const l0 = Earth.getEclipticLongitude(jd).mul(DEG2RAD)
  const b0 = Earth.getEclipticLatitude(jd).mul(DEG2RAD)
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
    l = getEclipticLongitude(JD2).mul(DEG2RAD)
    b = getEclipticLatitude(JD2).mul(DEG2RAD)
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
  const lambda = Decimal.atan2(y, x)
  const beta = Decimal.atan2(z, Decimal.sqrt(x.pow(2).plus(y.pow(2))))

  return { T, Lambda0, Beta0, lambda, beta, l, b, r, Delta }
}

/**
 * The planetocentric declination of the Earth.
 * When it is positive, the planet northern pole is tilted towards the Earth.
 * @param jd
 */
export function getPlanetocentricDeclinationOfTheEarth (jd: JulianDay | number): Degree {
  const { Lambda0, Beta0, lambda, beta } = computeMarsDetails(jd)

  const value1 = MINUSONE
    .mul(Decimal.sin(Beta0))
    .mul(Decimal.sin(beta))

  const value2 = Decimal.cos(Beta0)
    .mul(Decimal.cos(beta))
    .mul(Decimal.cos(Lambda0.minus(lambda)))

  // details.DE
  return Decimal.asin(value1.minus(value2)).mul(RAD2DEG)
}

/**
 * The planetocentric declination of the Sun.
 * When it is positive, the planet northern pole is tilted towards the sun.
 * @param jd
 */
export function getPlanetocentricDeclinationOfTheSun (jd: JulianDay | number): Degree {
  const { T, Lambda0, Beta0, l, b, r } = computeMarsDetails(jd)

  // Step 7
  const N = new Decimal(49.5581).plus(new Decimal(0.7721).mul(T))
  const [ldeg, bdeg] = [l.mul(RAD2DEG), b.mul(RAD2DEG)]
  const ldash: Degree = ldeg.minus(new Decimal(0.00697).dividedBy(r))
  const bdash: Degree = bdeg.minus(new Decimal(0.000225)
    .mul(Decimal.cos((ldeg.minus(N)).mul(DEG2RAD)))
    .dividedBy(r))

  // Step 8
  const value1 = MINUSONE.mul(Decimal.sin(Beta0))
    .mul(Decimal.sin(bdash.mul(DEG2RAD)))

  const value2 = Decimal.cos(Beta0)
    .mul(Decimal.cos(bdash.mul(DEG2RAD)))
    .mul(Decimal.cos(Lambda0.minus(ldash.mul(DEG2RAD))))

  // details.DS
  return Decimal.asin(value1.minus(value2)).mul(RAD2DEG)
}

/// The geocentric position angle of Mars' northern rotation pole, also called position angle of axis. It is the angle
/// that the Martian meridian from the center of the disk to the northern rotation pole forms (on the geocentric celestial sphere)
/// with the declination circle through the center. It is measured eastwards from the North Point of the disk. By defintion,
/// position angle 0º means northwards on the sky, 90º east, 180º south and 270º west. See AA. p 287.
// export function positionAngleOfNorthernRotationPole(jd: JulianDay): Degree {
//   return Degree(self.physicalDetails.P)
// }

/// The illuminated fraction of Mars
// export function getIlluminatedFraction(jd: JulianDay): number {
//   const { r, DELTA } = computeMarsDetails(jd)
//   const R = earth.getRadiusVector(jd)
//   return (((r + DELTA) * (r + DELTA) - R * R) / (4 * r * DELTA))
// }

/// The greatest defect of illumination of the angular quantity of the greatest length
/// of the dark region linking up the illuminated limb and the planet disk border.
// export function angularAmountOfGreatestDefectOfIllumination(jd: JulianDay): ArcSecond {
//   return ArcSecond(self.physicalDetails.q)
// }

/// The greatest defect of illumination of the angular quantity of the greatest length
/// of the dark region linking up the illuminated limb and the planet disk border.
// export function positionAngleOfGreatestDefectOfIllumination(jd: JulianDay): Degree {
//   return Degree(self.physicalDetails.X + 180).reduced
// }

/// The areographic longitude of the central meridian, as seen from the Earth. The word "areographic" means that use is made
/// of a coordinate system on the surface of Mars. Compare with "geographic" for the Earth. See AA. p 287.
// export function aerographicLongitudeOfCentralMeridian(jd: JulianDay): Degree {
//   return Degree(self.physicalDetails.w)
// }
