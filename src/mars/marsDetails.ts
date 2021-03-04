import * as earth from '../earth'
import { ArcSecond, DEG2RAD, Degree, JulianDay, RAD2DEG } from '../constants'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { distanceToLightTime } from '../elliptical'

const sin = Math.sin
const cos = Math.cos
const sqrt = Math.sqrt
const abs = Math.abs
const atan2 = Math.atan2
const asin = Math.asin

function computeMarsDetails(jd: JulianDay) {
  const T = (jd - 2451545) / 36525

  const Lambda0 = 352.9065 + 1.17330 * T
  const Beta0 = 63.2818 - 0.00394 * T

  //Step 2
  const l0 = earth.getEclipticLongitude(jd)
  const l0rad = DEG2RAD * l0
  const b0 = earth.getEclipticLatitude(jd)
  const b0rad = DEG2RAD * b0
  const R = earth.getRadiusVector(jd)

  let PreviousLightTravelTime = 0
  let LightTravelTime = 0
  let x = 0
  let y = 0
  let z = 0
  let shouldIterate = true
  let DELTA = 0
  let l = 0
  let b = 0
  let r = 0

  while (shouldIterate) {
    let JD2 = jd - LightTravelTime

    //Step 3
    l = getEclipticLongitude(JD2)
    let lrad = DEG2RAD * l
    b = getEclipticLatitude(JD2)
    let brad = DEG2RAD * b
    r = getRadiusVector(JD2)

    //Step 4
    x = r * cos(brad) * cos(lrad) - R * cos(l0rad)
    y = r * cos(brad) * sin(lrad) - R * sin(l0rad)
    z = r * sin(brad) - R * sin(b0rad)
    DELTA = sqrt(x * x + y * y + z * z)
    LightTravelTime = distanceToLightTime(DELTA)

    //Prepare for the next loop around
    shouldIterate = (abs(LightTravelTime - PreviousLightTravelTime) > 2e-6) //2e-6 corresponds to 0.17 of a second
    if (shouldIterate) {
      PreviousLightTravelTime = LightTravelTime
    }
  }

  //Step 5
  const lambda = atan2(y, x) * RAD2DEG
  const beta = atan2(z, sqrt(x * x + y * y)) * RAD2DEG

  return { T, Lambda0, Beta0, lambda, beta, l, b, r, DELTA }
}

export function getPlanetocentricDeclinationOfTheEarth(jd: JulianDay) {
  const { Lambda0, Beta0, lambda, beta } = computeMarsDetails(jd)
  // details.DE
  return RAD2DEG * asin(-sin(DEG2RAD * Beta0) * sin(beta * DEG2RAD) - cos(DEG2RAD * Beta0) * cos(beta * DEG2RAD) * cos(DEG2RAD * (Lambda0 - lambda)))
}

/// The planetocentric declination of the Sun. When it is positive, the planet' northern pole is tilted towards the Sun.
export function getPlanetocentricDeclinationOfTheSun(jd: JulianDay): Degree {
  const { T, Lambda0, Beta0, l, b, r } = computeMarsDetails(jd)

  //Step 7
  const N = 49.5581 + 0.7721 * T
  const ldash = l - 0.00697 / r
  const bdash = b - 0.000225 * (cos((l - N) * DEG2RAD) / r)

  //Step 8
  // details.DS
  return RAD2DEG * (asin(-sin(Beta0 * DEG2RAD) * sin(DEG2RAD * bdash) - cos(Beta0 * DEG2RAD) * cos(DEG2RAD * bdash) * cos((Lambda0 - ldash) * DEG2RAD)))
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
