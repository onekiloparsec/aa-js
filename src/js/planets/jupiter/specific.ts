import { Degree, JulianDay } from '@/js/types'
import { DEG2RAD, RAD2DEG } from '@/js/constants'
import { fmod360 } from '@/js/utils'
import { Earth } from '@/js/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

function computeJupiterDetails (jd: JulianDay) {
  // Step 3
  const l0 = Earth.getEclipticLongitude(jd) * DEG2RAD
  const b0 = Earth.getEclipticLatitude(jd) * DEG2RAD
  const R = Earth.getRadiusVector(jd)
  
  // Step 4
  let l = getEclipticLongitude(jd) * DEG2RAD
  const b = getEclipticLatitude(jd) * DEG2RAD
  const r = getRadiusVector(jd)
  
  // Step 5
  let x = r * Math.cos(b) * Math.cos(l) - R * Math.cos(l0)
  let y = r * Math.cos(b) * Math.sin(l) - R * Math.sin(l0)
  let z = r * Math.sin(b) - R * Math.sin(b0)
  let Delta = Math.sqrt(x * x + y * y + z * z)
  
  // Step 6
  l = l - 0.012990 * Delta / (r * r)
  
  // Step 7 (l has changed)
  x = r * Math.cos(b) * Math.cos(l) - R * Math.cos(l0)
  y = r * Math.cos(b) * Math.sin(l) - R * Math.sin(l0)
  z = r * Math.sin(b) - R * Math.sin(b0)
  Delta = Math.sqrt(x * x + y * y + z * z)
  
  // Step 8
  const e0 = Earth.getMeanObliquityOfEcliptic(jd) * DEG2RAD
  
  // Step 11
  const u = y * Math.cos(e0) - z * Math.sin(e0)
  const v = y * Math.sin(e0) + z * Math.cos(e0)
  const alpha = Math.atan2(u, x) * RAD2DEG
  const delta = Math.atan2(v, Math.sqrt(x * x + u * u)) * RAD2DEG
  
  return { alpha, delta, r, Delta }
}

/**
 * The planetocentric declination of the Earth.
 * When it is positive, the planet northern pole is tilted towards the Earth.
 * @param {JulianDay} jd
 * @returns {Degree}
 * @memberof module:Jupiter
 */
export function getPlanetocentricDeclinationOfTheSun (jd: JulianDay): Degree {
  const d = jd - 2433282.5
  const T1 = d / 36525
  
  const alpha0 = (268.00 + 0.1061 * T1) * DEG2RAD
  const delta0 = (64.50 - 0.0164 * T1) * DEG2RAD
  
  const { r, Delta } = computeJupiterDetails(jd)
  
  const l = (getEclipticLongitude(jd) - 0.012990 * Delta / (r * r)) * DEG2RAD
  const b = getEclipticLatitude(jd) * DEG2RAD
  
  // Step 8
  const e0 = Earth.getMeanObliquityOfEcliptic(jd) * DEG2RAD
  
  //Step 9
  const alphas = Math.atan2(Math.cos(e0) * Math.sin(l) - Math.sin(e0) * Math.tan(b), Math.cos(l))
  const deltas = Math.asin(Math.cos(e0) * Math.sin(b) + Math.sin(e0) * Math.cos(b) * Math.sin(l))
  
  const value1 = -1 * Math.sin(delta0) * Math.sin(deltas)
  const value2 = Math.cos(delta0) * Math.cos(deltas) * Math.cos(alpha0 - alphas)
  
  //Step 10 details.DS
  return Math.asin(value1 - value2) * RAD2DEG
}

/**
 * The planetocentric declination of the Sun.
 * When it is positive, the planet northern pole is tilted towards the sun.
 * @param {JulianDay} jd
 * @returns {Degree}
 * @memberof module:Jupiter
 */
export function getPlanetocentricDeclinationOfTheEarth (jd: JulianDay): Degree {
  const d = jd - 2433282.5
  const T1 = d / 36525
  
  const alpha0 = (268.00 + 0.1061 * T1) * DEG2RAD
  const delta0 = (64.50 - 0.0164 * T1) * DEG2RAD
  
  const { alpha, delta } = computeJupiterDetails(jd)
  
  const value1 = -1 * Math.sin(delta0) * Math.sin(delta)
  const value2 = Math.cos(delta0) * Math.cos(delta) * Math.cos(alpha0 - alpha)
  
  //Step 12 details.DE
  return Math.asin(value1 - value2) * RAD2DEG
}

/**
 * Central meridian longitudes
 * @param {JulianDay} jd The julian day
 * @returns {Object}
 * @memberof module:Jupiter
 */
export function getCentralMeridianLongitudes (jd: JulianDay): Object {
  const d = jd - 2433282.5
  const T1 = d / 36525
  
  const alpha0 = (268.00 + 0.1061 * T1) * DEG2RAD
  const delta0 = (64.50 - 0.0164 * T1) * DEG2RAD
  
  // Step 3
  const l0 = Earth.getEclipticLongitude(jd) * DEG2RAD
  // const b0 = Earth.getEclipticLatitude(jd)
  // const b0rad = DEG2RAD * b0
  const R = Earth.getRadiusVector(jd)
  
  const { alpha, delta, r, Delta } = computeJupiterDetails(jd)
  
  const l = (getEclipticLongitude(jd) - 0.012_990 * Delta / (Math.pow(r, 2))) * DEG2RAD
  
  // Step 2
  const W1 = fmod360(17.710 + 877.900_035_39 * d)
  const W2 = fmod360(16.838 + 870.270_035_39 * d)
  
  const y0 = Math.sin(delta0) * Math.cos(delta) * Math.cos(alpha0 - alpha)
  const y1 = Math.sin(delta) * Math.cos(delta0)
  const x = Math.cos(delta) * Math.sin(alpha0 - alpha)
  const xi = Math.atan2(y0 - y1, x) * RAD2DEG
  
  // Step 13
  const Geometricw1 = fmod360(W1 - xi - 5.070_33 * Delta)
  const Geometricw2 = fmod360(W2 - xi - 5.026_26 * Delta)
  
  // Step 14
  const C = 57.2958 * (2 * r * Delta + R * R - r * r - Delta * Delta) / (4 * r * Delta)
  
  let Apparentw1
  let Apparentw2
  if (Math.sin(l - l0) > 0) {
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

