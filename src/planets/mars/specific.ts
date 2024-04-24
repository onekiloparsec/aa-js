import { AstronomicalUnit, Degree, JulianCentury, JulianDay, Radian } from '@/types'
import { getLightTimeFromDistance } from '@/distances'
import { getJulianCentury } from '@/juliandays'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { DEG2RAD, RAD2DEG } from '@/constants'


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
  const Lambda0 = (352.9065 + 1.173_30 * T) * DEG2RAD
  const Beta0 = (63.2818 - 0.003_94 * T) * DEG2RAD
  
  // Step 2
  const l0 = Earth.getEclipticLongitude(jd) * DEG2RAD
  const b0 = Earth.getEclipticLatitude(jd) * DEG2RAD
  const R = Earth.getRadiusVector(jd)
  
  let previousLightTravelTime = 0
  let lightTravelTime = 0
  let x = 0
  let y = 0
  let z = 0
  let shouldIterate = true
  let Delta = 0
  let l = 0
  let b = 0
  let r = 0
  
  while (shouldIterate) {
    let JD2 = jd - lightTravelTime
    
    // Step 3
    l = getEclipticLongitude(JD2) * DEG2RAD
    b = getEclipticLatitude(JD2) * DEG2RAD
    r = getRadiusVector(JD2)
    
    // Step 4
    x = r * Math.cos(b) * Math.cos(l) - R * Math.cos(l0)
    y = r * Math.cos(b) * Math.sin(l) - R * Math.sin(l0)
    z = r * Math.sin(b) - R * Math.sin(b0)
    Delta = Math.sqrt(x * x + y * y + z * z)
    lightTravelTime = getLightTimeFromDistance(Delta)
    
    // Prepare for the next loop around
    // 2e-6 corresponds to 0.17 of a second
    shouldIterate = (Math.abs(lightTravelTime - previousLightTravelTime) > 2e-6)
    if (shouldIterate) {
      previousLightTravelTime = lightTravelTime
    }
  }
  
  // Step 5
  const lambda = Math.atan2(y, x)
  const beta = Math.atan2(z, Math.sqrt(x * x + y * y))
  
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
  
  const value1 = -1 * Math.sin(Beta0) * Math.sin(beta)
  const value2 = Math.cos(Beta0) * Math.cos(beta) * Math.cos(Lambda0 - lambda)
  
  // details.DE
  return Math.asin(value1 - value2) * RAD2DEG
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
  const N = 49.5581 + 0.7721 * T
  const [ldeg, bdeg] = [l * RAD2DEG, b * RAD2DEG]
  const ldash: Degree = ldeg - 0.00697 / r
  const bdash: Degree = bdeg - 0.000225 * Math.cos((ldeg - N) * DEG2RAD) / r
  
  // Step 8
  const value1 = -1 * Math.sin(Beta0) * Math.sin(bdash * DEG2RAD)
  const value2 = Math.cos(Beta0) * Math.cos(bdash * DEG2RAD) * Math.cos(Lambda0 - ldash * DEG2RAD)
  
  // details.DS
  return Math.asin(value1 - value2) * RAD2DEG
}

