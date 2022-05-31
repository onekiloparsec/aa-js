import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer } from '../../types'
import { MapTo0To360Range } from '../../utils'
import { DEG2RAD, RAD2DEG } from '../../constants'
import { transformEclipticToEquatorial } from '../../coordinates'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '../../nutation'
import { getMeanAnomaly as getSunMeanAnomaly } from '../../sun'
import { getEccentricity as getEarthEccentricity } from '../coordinates'
import { gMoonCoefficients1, gMoonCoefficients2, gMoonCoefficients3, gMoonCoefficients4 } from './coefficients'

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitude (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841 - T4 / 65194000)
}

/**
 * Mean elongation
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanElongation (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868 - T4 / 113065000)
}

/**
 * Mean anomaly
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699 - T4 / 14712000)
}

/**
 * Argument of latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getArgumentOfLatitude (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000 + T4 / 863310000)
}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  const E = getEarthEccentricity(jd)
  const Esquared = E * E
  const T = (jd - 2451545) / 36525

  const A1 = MapTo0To360Range(119.75 + 131.849 * T) * DEG2RAD
  const A2 = MapTo0To360Range(53.09 + 479264.290 * T) * DEG2RAD

  let SigmaL = 0
  for (let i = 0; i < gMoonCoefficients1.length; i++) {
    let ThisSigma = gMoonCoefficients2[i].A *
      Math.sin(gMoonCoefficients1[i].D * D +
        gMoonCoefficients1[i].M * M +
        gMoonCoefficients1[i].Mdash * Mdash +
        gMoonCoefficients1[i].F * F)

    if ((gMoonCoefficients1[i].M === 1) || (gMoonCoefficients1[i].M === -1)) {
      ThisSigma *= E
    } else if ((gMoonCoefficients1[i].M === 2) || (gMoonCoefficients1[i].M === -2)) {
      ThisSigma *= Esquared
    }

    SigmaL += ThisSigma
  }

  // Finally the additive terms
  SigmaL += 3958 * Math.sin(A1)
  SigmaL += 1962 * Math.sin(Ldash - F)
  SigmaL += 318 * Math.sin(A2)

  // And finally apply the nutation in longitude
  const NutationInLong = getNutationInLongitude(jd)

  const LdashDegrees = Ldash * RAD2DEG
  return MapTo0To360Range(LdashDegrees + SigmaL / 1000000 + NutationInLong / 3600)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLatitude (jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  const E = getEarthEccentricity(jd)
  const Esquared = E * E
  const T = (jd - 2451545) / 36525

  const A1 = MapTo0To360Range(119.75 + 131.849 * T) * DEG2RAD
  const A3 = MapTo0To360Range(313.45 + 481266.484 * T) * DEG2RAD

  let SigmaB = 0
  for (let i = 0; i < gMoonCoefficients3.length; i++) {
    let ThisSigma = gMoonCoefficients4[i] *
      Math.sin(gMoonCoefficients3[i].D * D +
        gMoonCoefficients3[i].M * M +
        gMoonCoefficients3[i].Mdash * Mdash +
        gMoonCoefficients3[i].F * F)

    if ((gMoonCoefficients3[i].M === 1) || (gMoonCoefficients3[i].M === -1)) {
      ThisSigma *= E
    } else if ((gMoonCoefficients3[i].M === 2) || (gMoonCoefficients3[i].M === -2)) {
      ThisSigma *= Esquared
    }

    SigmaB += ThisSigma
  }

  // Finally the additive terms
  SigmaB -= 2235 * Math.sin(Ldash)
  SigmaB += 382 * Math.sin(A3)
  SigmaB += 175 * Math.sin(A1 - F)
  SigmaB += 175 * Math.sin(A1 + F)
  SigmaB += 127 * Math.sin(Ldash - Mdash)
  SigmaB -= 115 * Math.sin(Ldash + Mdash)

  return SigmaB / 1000000
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

/**
 * Radius vector (distance Earth-Moon) in kilometers!
 * @param {JulianDay} jd The julian day
 * @returns {Kilometer}
 */
export function getRadiusVector (jd: JulianDay): Kilometer {
  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  const E = getEarthEccentricity(jd)
  const Esquared = E * E

  let SigmaR = 0
  for (let i = 0; i < gMoonCoefficients1.length; i++) {
    let ThisSigma = gMoonCoefficients2[i].B *
      Math.cos(gMoonCoefficients1[i].D * D +
        gMoonCoefficients1[i].M * M +
        gMoonCoefficients1[i].Mdash * Mdash +
        gMoonCoefficients1[i].F * F)

    if ((gMoonCoefficients1[i].M === 1) || (gMoonCoefficients1[i].M === -1)) {
      ThisSigma *= E
    } else if ((gMoonCoefficients1[i].M === 2) || (gMoonCoefficients1[i].M === -2)) {
      ThisSigma *= Esquared
    }

    SigmaR += ThisSigma
  }

  return 385000.56 + SigmaR / 1000
}

/**
 * Transforms a radius vector into horizontal parallax
 * @param {Kilometer} radiusVector The radius vector
 * @returns {Degree}
 */
export function radiusVectorToHorizontalParallax (radiusVector: Kilometer): Degree {
  return RAD2DEG * Math.asin(6378.14 / radiusVector)
}

/**
 * Transforms an horizontal parallax into a radius vector
 * @param {Degree} horizontalParallax
 * @returns {Kilometer}
 */
export function horizontalParallaxToRadiusVector (horizontalParallax: Degree): Kilometer {
  return 6378.14 / Math.sin(DEG2RAD * horizontalParallax)
}

/**
 * Mean longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitudeAscendingNode (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(125.0445479 - 1934.1362891 * T + 0.0020754 * T2 + T3 / 467441 - T4 / 60616000)
}

/**
 * Mean longitude of perigee
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitudePerigee (jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T
  const T4 = T3 * T
  return MapTo0To360Range(83.3532465 + 4069.0137287 * T - 0.0103200 * T2 - T3 / 80053 + T4 / 18999000)
}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function trueLongitudeAscendingNode (jd: JulianDay): Degree {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(jd)

  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD

  // Add the principal additive terms
  TrueAscendingNode -= 1.4979 * Math.sin(2 * (D - F))
  TrueAscendingNode -= 0.1500 * Math.sin(M)
  TrueAscendingNode -= 0.1226 * Math.sin(2 * D)
  TrueAscendingNode += 0.1176 * Math.sin(2 * F)
  TrueAscendingNode -= 0.0801 * Math.sin(2 * (Mdash - F))

  return MapTo0To360Range(TrueAscendingNode)
}

/**
 * Horizontal parallax
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function horizontalParallax (jd: JulianDay): Degree {
  return radiusVectorToHorizontalParallax(getRadiusVector(jd))
}

/**
 * Equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getMeanObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent equatorial coordinates (using the true obliquity of the ecliptic)
 * @see getTrueObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getApparentEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}
