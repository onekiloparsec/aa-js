import { Degree, JulianDay } from '@/types'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { fmod360 } from '@/utils'
import { getMeanObliquityOfEcliptic } from '@/nutation'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

const sin = Math.sin
const cos = Math.cos
const asin = Math.asin
const atan2 = Math.atan2
const sqrt = Math.sqrt
const tan = Math.tan

function computeJupiterDetails (jd: JulianDay) {
  //Step 1
  // const d = jd - 2433282.5
  // const T1 = d / 36525
  // const alpha0 = 268.00 + 0.1061 * T1
  // const alpha0rad = DEG2RAD * alpha0
  // const delta0 = 64.50 - 0.0164 * T1
  // const delta0rad = DEG2RAD * delta0

  //Step 3
  const l0 = Earth.getEclipticLongitude(jd)
  const l0rad = DEG2RAD * l0
  const b0 = Earth.getEclipticLatitude(jd)
  const b0rad = DEG2RAD * b0
  const R = Earth.getRadiusVector(jd)

  //Step 4
  let l = getEclipticLongitude(jd)
  let lrad = DEG2RAD * l
  const b = getEclipticLatitude(jd)
  const brad = DEG2RAD * b
  const r = getRadiusVector(jd)

  //Step 5
  let x = r * cos(brad) * cos(lrad) - R * cos(l0rad)
  let y = r * cos(brad) * sin(lrad) - R * sin(l0rad)
  let z = r * sin(brad) - R * sin(b0rad)
  let DELTA = sqrt(x * x + y * y + z * z)

  //Step 6
  l -= 0.012990 * DELTA / (r * r)
  lrad = DEG2RAD * l

  //Step 7
  x = r * cos(brad) * cos(lrad) - R * cos(l0rad)
  y = r * cos(brad) * sin(lrad) - R * sin(l0rad)
  z = r * sin(brad) - R * sin(b0rad)
  DELTA = sqrt(x * x + y * y + z * z)

  //Step 8
  let e0 = getMeanObliquityOfEcliptic(jd)
  let e0rad = DEG2RAD * e0

  //Step 11
  const u = y * cos(e0rad) - z * sin(e0rad)
  const v = y * sin(e0rad) + z * cos(e0rad)
  let alpharad = atan2(u, x)
  let alpha = RAD2DEG * alpharad
  const deltarad = atan2(v, sqrt(x * x + u * u))
  let delta = RAD2DEG * deltarad

  return { alpha, delta, r, DELTA }
}

export function getPlanetocentricDeclinationOfTheSun (jd: JulianDay): Degree {
  const d = jd - 2433282.5
  const T1 = d / 36525
  const alpha0 = 268.00 + 0.1061 * T1
  const alpha0rad = DEG2RAD * alpha0
  const delta0 = 64.50 - 0.0164 * T1
  const delta0rad = DEG2RAD * delta0

  const { r, DELTA } = computeJupiterDetails(jd)

  let l = getEclipticLongitude(jd)
  l -= 0.012990 * DELTA / (r * r)
  const lrad = DEG2RAD * l

  const b = getEclipticLatitude(jd)
  const brad = DEG2RAD * b

  //Step 8
  let e0 = getMeanObliquityOfEcliptic(jd)
  let e0rad = DEG2RAD * e0

  //Step 9
  const alphas = atan2(cos(e0rad) * sin(lrad) - sin(e0rad) * tan(brad), cos(lrad))
  const deltas = asin(cos(e0rad) * sin(brad) + sin(e0rad) * cos(brad) * sin(lrad))

  //Step 10 DS
  return RAD2DEG * (asin(-sin(delta0rad) * sin(deltas) - cos(delta0rad) * cos(deltas) * cos(alpha0rad - alphas)))
}

export function getPlanetocentricDeclinationOfTheEarth (jd: JulianDay): Degree {
  const d = jd - 2433282.5
  const T1 = d / 36525
  const alpha0 = 268.00 + 0.1061 * T1
  const alpha0rad = DEG2RAD * alpha0
  const delta0 = 64.50 - 0.0164 * T1
  const delta0rad = DEG2RAD * delta0

  const { alpha, delta } = computeJupiterDetails(jd)
  const alpharad = alpha * DEG2RAD
  const deltarad = delta * DEG2RAD

  //Step 12 DE
  return RAD2DEG * (asin(-sin(delta0rad) * sin(deltarad) - cos(delta0rad) * cos(deltarad) * cos(alpha0rad - alpharad)))
}

export function getCentralMeridianLongitudes (jd: JulianDay): Object {
  const d = jd - 2433282.5
  const T1 = d / 36525
  const alpha0 = 268.00 + 0.1061 * T1
  const alpha0rad = DEG2RAD * alpha0
  const delta0 = 64.50 - 0.0164 * T1
  const delta0rad = DEG2RAD * delta0

  //Step 3
  const l0 = Earth.getEclipticLongitude(jd)
  const l0rad = DEG2RAD * l0
  // const b0 = Earth.getgetEclipticLatitude(jd)
  // const b0rad = DEG2RAD * b0
  const R = Earth.getRadiusVector(jd)

  const { alpha, delta, r, DELTA } = computeJupiterDetails(jd)
  const alpharad = alpha * DEG2RAD
  const deltarad = delta * DEG2RAD

  let l = getEclipticLongitude(jd)
  l -= 0.012990 * DELTA / (r * r)
  const lrad = DEG2RAD * l

  //Step 2
  const W1 = fmod360(17.710 + 877.90003539 * d)
  const W2 = fmod360(16.838 + 870.27003539 * d)

  const xi = atan2(sin(delta0rad) * cos(deltarad) * cos(alpha0rad - alpharad) - sin(deltarad) * cos(delta0rad), cos(deltarad) * sin(alpha0rad - alpharad))

  //Step 13
  const Geometricw1 = fmod360(W1 - RAD2DEG * xi - 5.07033 * DELTA)
  const Geometricw2 = fmod360(W2 - RAD2DEG * xi - 5.02626 * DELTA)

  //Step 14
  const C = 57.2958 * (2 * r * DELTA + R * R - r * r - DELTA * DELTA) / (4 * r * DELTA)
  let Apparentw1
  let Apparentw2
  if (sin(lrad - l0rad) > 0) {
    Apparentw1 = fmod360(Geometricw1 + C)
    Apparentw2 = fmod360(Geometricw2 + C)
  } else {
    Apparentw1 = fmod360(Geometricw1 - C)
    Apparentw2 = fmod360(Geometricw2 - C)
  }

  return {
    geometricSystemI: Geometricw1,
    geometricSystemII: Geometricw2,
    apparentSystemI: Apparentw1,
    apparentSystemII: Apparentw2
  }
}

