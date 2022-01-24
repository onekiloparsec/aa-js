import { DEG2RAD, Degree, JulianDay, RAD2DEG } from '../../constants'
import * as nutation from '../../nutation'
import { MapTo0To360Range } from '../../utils'
import { gMoonCoefficients1, gMoonCoefficients2, gMoonCoefficients3, gMoonCoefficients4 } from './coefficients'
import { getEccentricity, getSunMeanAnomaly } from '../coordinates'
import { EclipticCoordinates, EquatorialCoordinates, transformEclipticToEquatorial } from '../../coordinates'

export function getMeanLongitude(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(218.3164477 + 481267.88123421 * T - 0.0015786 * Tsquared + Tcubed / 538841 - T4 / 65194000)
}

export function getMeanElongation(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(297.8501921 + 445267.1114034 * T - 0.0018819 * Tsquared + Tcubed / 545868 - T4 / 113065000)
}

export function getMeanAnomaly(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(134.9633964 + 477198.8675055 * T + 0.0087414 * Tsquared + Tcubed / 69699 - T4 / 14712000)
}

export function getArgumentOfLatitude(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(93.2720950 + 483202.0175233 * T - 0.0036539 * Tsquared - Tcubed / 3526000 + T4 / 863310000)
}

export function getEclipticLongitude(jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  const E = getEccentricity(jd)
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
  const NutationInLong = nutation.getNutationInLongitude(jd)

  const LdashDegrees = Ldash * RAD2DEG
  return MapTo0To360Range(LdashDegrees + SigmaL / 1000000 + NutationInLong / 3600)
}

export function getEclipticLatitude(jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = getSunMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  const E = getEccentricity(jd)
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

export function getEclipticCoordinates(jd: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

export function getRadiusVector(JD: JulianDay): number {
  const D = getMeanElongation(JD) * DEG2RAD
  const M = getSunMeanAnomaly(JD) * DEG2RAD
  const Mdash = getMeanAnomaly(JD) * DEG2RAD
  const F = getArgumentOfLatitude(JD) * DEG2RAD
  const E = getEccentricity(JD)
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

export function radiusVectorToHorizontalParallax(radiusVector: JulianDay): number {
  return RAD2DEG * Math.asin(6378.14 / radiusVector)
}

export function horizontalParallaxToRadiusVector(horizontalParallax: JulianDay): number {
  return 6378.14 / Math.sin(DEG2RAD * horizontalParallax)
}

export function getMeanLongitudeAscendingNode(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(125.0445479 - 1934.1362891 * T + 0.0020754 * Tsquared + Tcubed / 467441 - T4 / 60616000)
}

export function getMeanLongitudePerigee(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return MapTo0To360Range(83.3532465 + 4069.0137287 * T - 0.0103200 * Tsquared - Tcubed / 80053 + T4 / 18999000)
}

export function trueLongitudeAscendingNode(jd: JulianDay): Degree {
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

export function horizontalParallax(jd: JulianDay): number {
  return radiusVectorToHorizontalParallax(getRadiusVector(jd))
}

export function getEquatorialCoordinates(jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    nutation.getMeanObliquityOfEcliptic(jd)
  )
}
