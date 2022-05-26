import { ArcSecond, JulianDay } from 'aa.js';
import { DEG2RAD } from './constants'
import { getDecimal } from './sexagesimal'
import { MapTo0To360Range } from './utils'

const gNutationCoefficients =
  [
    [0, 0, 0, 0, 1, -171996, -174.2, 92025, 8.9],
    [-2, 0, 0, 2, 2, -13187, -1.6, 5736, -3.1],
    [0, 0, 0, 2, 2, -2274, -0.2, 977, -0.5],
    [0, 0, 0, 0, 2, 2062, 0.2, -895, 0.5],
    [0, 1, 0, 0, 0, 1426, -3.4, 54, -0.1],
    [0, 0, 1, 0, 0, 712, 0.1, -7, 0],
    [-2, 1, 0, 2, 2, -517, 1.2, 224, -0.6],
    [0, 0, 0, 2, 1, -386, -0.4, 200, 0],
    [0, 0, 1, 2, 2, -301, 0, 129, -0.1],
    [-2, -1, 0, 2, 2, 217, -0.5, -95, 0.3],
    [-2, 0, 1, 0, 0, -158, 0, 0, 0],
    [-2, 0, 0, 2, 1, 129, 0.1, -70, 0],
    [0, 0, -1, 2, 2, 123, 0, -53, 0],
    [2, 0, 0, 0, 0, 63, 0, 0, 0],
    [0, 0, 1, 0, 1, 63, 0.1, -33, 0],
    [2, 0, -1, 2, 2, -59, 0, 26, 0],
    [0, 0, -1, 0, 1, -58, -0.1, 32, 0],
    [0, 0, 1, 2, 1, -51, 0, 27, 0],
    [-2, 0, 2, 0, 0, 48, 0, 0, 0],
    [0, 0, -2, 2, 1, 46, 0, -24, 0],
    [2, 0, 0, 2, 2, -38, 0, 16, 0],
    [0, 0, 2, 2, 2, -31, 0, 13, 0],
    [0, 0, 2, 0, 0, 29, 0, 0, 0],
    [-2, 0, 1, 2, 2, 29, 0, -12, 0],
    [0, 0, 0, 2, 0, 26, 0, 0, 0],
    [-2, 0, 0, 2, 0, -22, 0, 0, 0],
    [0, 0, -1, 2, 1, 21, 0, -10, 0],
    [0, 2, 0, 0, 0, 17, -0.1, 0, 0],
    [2, 0, -1, 0, 1, 16, 0, -8, 0],
    [-2, 2, 0, 2, 2, -16, 0.1, 7, 0],
    [0, 1, 0, 0, 1, -15, 0, 9, 0],
    [-2, 0, 1, 0, 1, -13, 0, 7, 0],
    [0, -1, 0, 0, 1, -12, 0, 6, 0],
    [0, 0, 2, -2, 0, 11, 0, 0, 0],
    [2, 0, -1, 2, 1, -10, 0, 5, 0],
    [2, 0, 1, 2, 2, -8, 0, 3, 0],
    [0, 1, 0, 2, 2, 7, 0, -3, 0],
    [-2, 1, 1, 0, 0, -7, 0, 0, 0],
    [0, -1, 0, 2, 2, -7, 0, 3, 0],
    [2, 0, 0, 2, 1, -7, 0, 3, 0],
    [2, 0, 1, 0, 0, 6, 0, 0, 0],
    [-2, 0, 2, 2, 2, 6, 0, -3, 0],
    [-2, 0, 1, 2, 1, 6, 0, -3, 0],
    [2, 0, -2, 0, 1, -6, 0, 3, 0],
    [2, 0, 0, 0, 1, -6, 0, 3, 0],
    [0, -1, 1, 0, 0, 5, 0, 0, 0],
    [-2, -1, 0, 2, 1, -5, 0, 3, 0],
    [-2, 0, 0, 0, 1, -5, 0, 3, 0],
    [0, 0, 2, 2, 1, -5, 0, 3, 0],
    [-2, 0, 2, 0, 1, 4, 0, 0, 0],
    [-2, 1, 0, 2, 1, 4, 0, 0, 0],
    [0, 0, 1, -2, 0, 4, 0, 0, 0],
    [-1, 0, 1, 0, 0, -4, 0, 0, 0],
    [-2, 1, 0, 0, 0, -4, 0, 0, 0],
    [1, 0, 0, 0, 0, -4, 0, 0, 0],
    [0, 0, 1, 2, 0, 3, 0, 0, 0],
    [0, 0, -2, 2, 2, -3, 0, 0, 0],
    [-1, -1, 1, 0, 0, -3, 0, 0, 0],
    [0, 1, 1, 0, 0, -3, 0, 0, 0],
    [0, -1, 1, 2, 2, -3, 0, 0, 0],
    [2, -1, -1, 2, 2, -3, 0, 0, 0],
    [0, 0, 3, 2, 2, -3, 0, 0, 0],
    [2, -1, 0, 2, 2, -3, 0, 0, 0]
  ].map((a) => {
    return {
      D: a[0],
      M: a[1],
      Mprime: a[2],
      F: a[3],
      omega: a[4],
      sincoeff1: a[5],
      sincoeff2: a[6],
      coscoeff1: a[7],
      coscoeff2: a[8]
    }
  })

export function getNutationInLongitude (jd: JulianDay): ArcSecond {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T

  const D = MapTo0To360Range(297.85036 + 445267.111480 * T - 0.0019142 * T2 + T3 / 189474)
  const M = MapTo0To360Range(357.52772 + 35999.050340 * T - 0.0001603 * T2 - T3 / 300000)
  const Mprime = MapTo0To360Range(134.96298 + 477198.867398 * T + 0.0086972 * T2 + T3 / 56250)
  const F = MapTo0To360Range(93.27191 + 483202.017538 * T - 0.0036825 * T2 + T3 / 327270)
  const omega = MapTo0To360Range(125.04452 - 1934.136261 * T + 0.0020708 * T2 + T3 / 450000)

  let value = 0
  for (let i = 0; i < gNutationCoefficients.length; i++) {
    const argument = gNutationCoefficients[i].D * D + gNutationCoefficients[i].M * M +
      gNutationCoefficients[i].Mprime * Mprime + gNutationCoefficients[i].F * F +
      gNutationCoefficients[i].omega * omega

    value += (gNutationCoefficients[i].sincoeff1 + gNutationCoefficients[i].sincoeff2 * T) *
      Math.sin(argument * DEG2RAD) * 0.0001
  }

  return value
}

export function getNutationInObliquity (jd: JulianDay): ArcSecond {
  const T = (jd - 2451545) / 36525
  const T2 = T * T
  const T3 = T2 * T

  const D = MapTo0To360Range(297.85036 + 445267.111480 * T - 0.0019142 * T2 + T3 / 189474)
  const M = MapTo0To360Range(357.52772 + 35999.050340 * T - 0.0001603 * T2 - T3 / 300000)
  const Mprime = MapTo0To360Range(134.96298 + 477198.867398 * T + 0.0086972 * T2 + T3 / 56250)
  const F = MapTo0To360Range(93.27191 + 483202.017538 * T - 0.0036825 * T2 + T3 / 327270)
  const omega = MapTo0To360Range(125.04452 - 1934.136261 * T + 0.0020708 * T2 + T3 / 450000)

  let value = 0
  for (let i = 0; i < gNutationCoefficients.length; i++) {
    const argument = gNutationCoefficients[i].D * D + gNutationCoefficients[i].M * M +
      gNutationCoefficients[i].Mprime * Mprime + gNutationCoefficients[i].F * F +
      gNutationCoefficients[i].omega * omega

    value += (gNutationCoefficients[i].coscoeff1 + gNutationCoefficients[i].coscoeff2 * T) *
      Math.cos(argument * DEG2RAD) * 0.0001
  }

  return value
}

export function getMeanObliquityOfEcliptic (jd: JulianDay): number {
  const U = (jd - 2451545) / 3652500
  const Usquared = U * U
  const Ucubed = Usquared * U
  const U4 = Ucubed * U
  const U5 = U4 * U
  const U6 = U5 * U
  const U7 = U6 * U
  const U8 = U7 * U
  const U9 = U8 * U
  const U10 = U9 * U

  return getDecimal(23, 26, 21.448) -
    getDecimal(0, 0, 4680.93) * U -
    getDecimal(0, 0, 1.55) * Usquared +
    getDecimal(0, 0, 1999.25) * Ucubed -
    getDecimal(0, 0, 51.38) * U4 -
    getDecimal(0, 0, 249.67) * U5 -
    getDecimal(0, 0, 39.05) * U6 +
    getDecimal(0, 0, 7.12) * U7 +
    getDecimal(0, 0, 27.87) * U8 +
    getDecimal(0, 0, 5.79) * U9 +
    getDecimal(0, 0, 2.45) * U10
}

export function getTrueObliquityOfEcliptic (jd: JulianDay): number {
  return getMeanObliquityOfEcliptic(jd) + getDecimal(0, 0, getNutationInObliquity(jd))
}

