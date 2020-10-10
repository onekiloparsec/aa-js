'use strict'

import { DEG2RAD, RAD2DEG } from './constants'
import earth from './earth'
import nutation from './nutation'
import coordinates from './coordinates'
import utils from './utils'

const gMoonCoefficients1 =
  [
    [0, 0, 1, 0],
    [2, 0, -1, 0],
    [2, 0, 0, 0],
    [0, 0, 2, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 2],
    [2, 0, -2, 0],
    [2, -1, -1, 0],
    [2, 0, 1, 0],
    [2, -1, 0, 0],
    [0, 1, -1, 0],
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [2, 0, 0, -2],
    [0, 0, 1, 2],
    [0, 0, 1, -2],
    [4, 0, -1, 0],
    [0, 0, 3, 0],
    [4, 0, -2, 0],
    [2, 1, -1, 0],
    [2, 1, 0, 0],
    [1, 0, -1, 0],
    [1, 1, 0, 0],
    [2, -1, 1, 0],
    [2, 0, 2, 0],
    [4, 0, 0, 0],
    [2, 0, -3, 0],
    [0, 1, -2, 0],
    [2, 0, -1, 2],
    [2, -1, -2, 0],
    [1, 0, 1, 0],
    [2, -2, 0, 0],
    [0, 1, 2, 0],
    [0, 2, 0, 0],
    [2, -2, -1, 0],
    [2, 0, 1, -2],
    [2, 0, 0, 2],
    [4, -1, -1, 0],
    [0, 0, 2, 2],
    [3, 0, -1, 0],
    [2, 1, 1, 0],
    [4, -1, -2, 0],
    [0, 2, -1, 0],
    [2, 2, -1, 0],
    [2, 1, -2, 0],
    [2, -1, 0, -2],
    [4, 0, 1, 0],
    [0, 0, 4, 0],
    [4, -1, 0, 0],
    [1, 0, -2, 0],
    [2, 1, 0, -2],
    [0, 0, 2, -2],
    [1, 1, 1, 0],
    [3, 0, -2, 0],
    [4, 0, -3, 0],
    [2, -1, 2, 0],
    [0, 2, 1, 0],
    [1, 1, -1, 0],
    [2, 0, 3, 0],
    [2, 0, -1, -2]
  ].map((a) => {
    return { D: a[0], M: a[1], Mdash: a[2], F: a[3] }
  })

const gMoonCoefficients2 =
  [
    [6288774, -20905355],
    [1274027, -3699111],
    [658314, -2955968],
    [213618, -569925],
    [-185116, 48888],
    [-114332, -3149],
    [58793, 246158],
    [57066, -152138],
    [53322, -170733],
    [45758, -204586],
    [-40923, -129620],
    [-34720, 108743],
    [-30383, 104755],
    [15327, 10321],
    [-12528, 0],
    [10980, 79661],
    [10675, -34782],
    [10034, -23210],
    [8548, -21636],
    [-7888, 24208],
    [-6766, 30824],
    [-5163, -8379],
    [4987, -16675],
    [4036, -12831],
    [3994, -10445],
    [3861, -11650],
    [3665, 14403],
    [-2689, -7003],
    [-2602, 0],
    [2390, 10056],
    [-2348, 6322],
    [2236, -9884],
    [-2120, 5751],
    [-2069, 0],
    [2048, -4950],
    [-1773, 4130],
    [-1595, 0],
    [1215, -3958],
    [-1110, 0],
    [-892, 3258],
    [-810, 2616],
    [759, -1897],
    [-713, -2117],
    [-700, 2354],
    [691, 0],
    [596, 0],
    [549, -1423],
    [537, -1117],
    [520, -1571],
    [-487, -1739],
    [-399, 0],
    [-381, -4421],
    [351, 0],
    [-340, 0],
    [330, 0],
    [327, 0],
    [-323, 1165],
    [299, 0],
    [294, 0],
    [0, 8752]
  ].map((a) => {
    return { A: a[0], B: a[1] }
  })

const gMoonCoefficients3 =
  [
    [0, 0, 0, 1],
    [0, 0, 1, 1],
    [0, 0, 1, -1],
    [2, 0, 0, -1],
    [2, 0, -1, 1],
    [2, 0, -1, -1],
    [2, 0, 0, 1],
    [0, 0, 2, 1],
    [2, 0, 1, -1],
    [0, 0, 2, -1],
    [2, -1, 0, -1],
    [2, 0, -2, -1],
    [2, 0, 1, 1],
    [2, 1, 0, -1],
    [2, -1, -1, 1],
    [2, -1, 0, 1],
    [2, -1, -1, -1],
    [0, 1, -1, -1],
    [4, 0, -1, -1],
    [0, 1, 0, 1],
    [0, 0, 0, 3],
    [0, 1, -1, 1],
    [1, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 1, 1, -1],
    [0, 1, 0, -1],
    [1, 0, 0, -1],
    [0, 0, 3, 1],
    [4, 0, 0, -1],
    [4, 0, -1, 1],
    [0, 0, 1, -3],
    [4, 0, -2, 1],
    [2, 0, 0, -3],
    [2, 0, 2, -1],
    [2, -1, 1, -1],
    [2, 0, -2, 1],
    [0, 0, 3, -1],
    [2, 0, 2, 1],
    [2, 0, -3, -1],
    [2, 1, -1, 1],
    [2, 1, 0, 1],
    [4, 0, 0, 1],
    [2, -1, 1, 1],
    [2, -2, 0, -1],
    [0, 0, 1, 3],
    [2, 1, 1, -1],
    [1, 1, 0, -1],
    [1, 1, 0, 1],
    [0, 1, -2, -1],
    [2, 1, -1, -1],
    [1, 0, 1, 1],
    [2, -1, -2, -1],
    [0, 1, 2, 1],
    [4, 0, -2, -1],
    [4, -1, -1, -1],
    [1, 0, 1, -1],
    [4, 0, 1, -1],
    [1, 0, -1, -1],
    [4, -1, 0, -1],
    [2, -2, 0, 1]
  ].map((a) => {
    return { D: a[0], M: a[1], Mdash: a[2], F: a[3] }
  })

const gMoonCoefficients4 =
  [
    5128122,
    280602,
    277693,
    173237,
    55413,
    46271,
    32573,
    17198,
    9266,
    8822,
    8216,
    4324,
    4200,
    -3359,
    2463,
    2211,
    2065,
    -1870,
    1828,
    -1794,
    -1749,
    -1565,
    -1491,
    -1475,
    -1410,
    -1344,
    -1335,
    1107,
    1021,
    833,
    777,
    671,
    607,
    596,
    491,
    -451,
    439,
    422,
    421,
    -366,
    -351,
    331,
    315,
    302,
    -283,
    -229,
    223,
    223,
    -220,
    -220,
    -185,
    181,
    -177,
    176,
    166,
    -164,
    132,
    -119,
    115,
    107
  ]

function getMeanLongitude (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(218.3164477 + 481267.88123421 * T - 0.0015786 * Tsquared + Tcubed / 538841 - T4 / 65194000)
}

function getMeanElongation (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(297.8501921 + 445267.1114034 * T - 0.0018819 * Tsquared + Tcubed / 545868 - T4 / 113065000)
}

function getMeanAnomaly (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(134.9633964 + 477198.8675055 * T + 0.0087414 * Tsquared + Tcubed / 69699 - T4 / 14712000)
}

function getArgumentOfLatitude (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(93.2720950 + 483202.0175233 * T - 0.0036539 * Tsquared - Tcubed / 3526000 + T4 / 863310000)
}

function getEclipticLongitude (JD) {
  const Ldash = getMeanLongitude(JD) * DEG2RAD
  const D = getMeanElongation(JD) * DEG2RAD
  const M = earth.getSunMeanAnomaly(JD) * DEG2RAD
  const Mdash = getMeanAnomaly(JD) * DEG2RAD
  const F = getArgumentOfLatitude(JD) * DEG2RAD
  const E = earth.getEccentricity(JD)
  const Esquared = E * E
  const T = (JD - 2451545) / 36525

  const A1 = utils.MapTo0To360Range(119.75 + 131.849 * T) * DEG2RAD
  const A2 = utils.MapTo0To360Range(53.09 + 479264.290 * T) * DEG2RAD

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
  const NutationInLong = nutation.getNutationInLongitude(JD)

  const LdashDegrees = Ldash * RAD2DEG
  return utils.MapTo0To360Range(LdashDegrees + SigmaL / 1000000 + NutationInLong / 3600)
}

function getEclipticLatitude (JD) {
  const Ldash = getMeanLongitude(JD) * DEG2RAD
  const D = getMeanElongation(JD) * DEG2RAD
  const M = earth.getSunMeanAnomaly(JD) * DEG2RAD
  const Mdash = getMeanAnomaly(JD) * DEG2RAD
  const F = getArgumentOfLatitude(JD) * DEG2RAD
  const E = earth.getEccentricity(JD)
  const Esquared = E * E
  const T = (JD - 2451545) / 36525

  const A1 = utils.MapTo0To360Range(119.75 + 131.849 * T) * DEG2RAD
  const A3 = utils.MapTo0To360Range(313.45 + 481266.484 * T) * DEG2RAD

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

function getRadiusVector (JD) {
  const D = getMeanElongation(JD) * DEG2RAD
  const M = earth.getSunMeanAnomaly(JD) * DEG2RAD
  const Mdash = getMeanAnomaly(JD) * DEG2RAD
  const F = getArgumentOfLatitude(JD) * DEG2RAD
  const E = earth.getEccentricity(JD)
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

function transformRadiusVectorToHorizontalParallax (radiusVector) {
  return RAD2DEG * Math.asin(6378.14 / radiusVector)
}

function transformHorizontalParallaxToRadiusVector (horizontalParallax) {
  return 6378.14 / Math.sin(DEG2RAD * horizontalParallax)
}

function getMeanLongitudeAscendingNode (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(125.0445479 - 1934.1362891 * T + 0.0020754 * Tsquared + Tcubed / 467441 - T4 / 60616000)
}

function getMeanLongitudePerigee (JD) {
  const T = (JD - 2451545) / 36525
  const Tsquared = T * T
  const Tcubed = Tsquared * T
  const T4 = Tcubed * T
  return utils.MapTo0To360Range(83.3532465 + 4069.0137287 * T - 0.0103200 * Tsquared - Tcubed / 80053 + T4 / 18999000)
}

function getTrueLongitudeAscendingNode (JD) {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(JD)

  const D = getMeanElongation(JD) * DEG2RAD
  const M = earth.getSunMeanAnomaly(JD) * DEG2RAD
  const Mdash = getMeanAnomaly(JD) * DEG2RAD
  const F = getArgumentOfLatitude(JD) * DEG2RAD

  // Add the principal additive terms
  TrueAscendingNode -= 1.4979 * Math.sin(2 * (D - F))
  TrueAscendingNode -= 0.1500 * Math.sin(M)
  TrueAscendingNode -= 0.1226 * Math.sin(2 * D)
  TrueAscendingNode += 0.1176 * Math.sin(2 * F)
  TrueAscendingNode -= 0.0801 * Math.sin(2 * (Mdash - F))

  return utils.MapTo0To360Range(TrueAscendingNode)
}

function getHorizontalParallax (JD) {
  return transformRadiusVectorToHorizontalParallax(getRadiusVector(JD))
}

function getEclipticCoordinates (JD) {
  return {
    longitude: getEclipticLongitude(JD),
    latitude: getEclipticLatitude(JD)
  }
}

function getEquatorialCoordinates (JD) {
  return coordinates.transformEclipticToEquatorial(
    getEclipticLongitude(JD),
    getEclipticLatitude(JD),
    nutation.getMeanObliquityOfEcliptic(JD)
  )
}

export default {
  getMeanLongitude,
  getMeanElongation,
  getMeanAnomaly,
  getArgumentOfLatitude,
  getRadiusVector,
  transformRadiusVectorToHorizontalParallax,
  transformHorizontalParallaxToRadiusVector,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  getTrueLongitudeAscendingNode,
  getHorizontalParallax,
  getEclipticCoordinates,
  getEquatorialCoordinates
}
