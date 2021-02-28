import { AstronomicalUnit, DEG2RAD, Degree, JulianDay } from '../constants'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { g_PlutoArgumentCoefficients, g_PlutoLatitudeCoefficients, g_PlutoLongitudeCoefficients, g_PlutoRadiusCoefficients } from './coefficients'
import { EclipticCoordinates } from '../coordinates'

const cos = Math.cos
const sin = Math.sin

export function getEclipticLongitude(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  //Calculate Longitude
  let L = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    L += ((g_PlutoLongitudeCoefficients[i].A * sin(Alpha)) + (g_PlutoLongitudeCoefficients[i].B * cos(Alpha)))
  }
  L = L / 1000000
  L += (238.958116 + 144.96 * T)
  L = MapTo0To360Range(L)

  return L
}

export function getEclipticLatitude(jd: JulianDay): Degree {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  //Calculate Latitude
  let L = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    L += ((g_PlutoLatitudeCoefficients[i].A * sin(Alpha)) + (g_PlutoLatitudeCoefficients[i].B * cos(Alpha)))
  }
  L = L / 1000000
  L += -3.908239

  return MapToMinus90To90Range(L)
}

export function getRadiusVector(jd: JulianDay): AstronomicalUnit {
  const T = (jd - 2451545) / 36525
  const J = 34.35 + 3034.9057 * T
  const S = 50.08 + 1222.1138 * T
  const P = 238.96 + 144.9600 * T

  //Calculate Radius
  let R = 0
  for (let i = 0; i < g_PlutoArgumentCoefficients.length; i++) {
    let Alpha = g_PlutoArgumentCoefficients[i].J * J + g_PlutoArgumentCoefficients[i].S * S + g_PlutoArgumentCoefficients[i].P * P
    Alpha = DEG2RAD * Alpha
    R += ((g_PlutoRadiusCoefficients[i].A * sin(Alpha)) + (g_PlutoRadiusCoefficients[i].B * cos(Alpha)))
  }

  R = R / 10000000
  R += 40.7241346
  return R
}

export function getEclipticCoordinates(JD: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(JD),
    latitude: getEclipticLatitude(JD)
  }
}
