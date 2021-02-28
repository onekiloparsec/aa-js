import { Degree, JulianDay, RAD2DEG } from '../constants'
import { MapTo0To360Range, MapToMinus90To90Range } from '../utils'
import { EclipticCoordinates } from '../coordinates'

import {
  g_B0MarsCoefficients,
  g_B1MarsCoefficients,
  g_B2MarsCoefficients,
  g_B3MarsCoefficients,
  g_B4MarsCoefficients,
  g_L0MarsCoefficients,
  g_L1MarsCoefficients,
  g_L2MarsCoefficients,
  g_L3MarsCoefficients,
  g_L4MarsCoefficients,
  g_L5MarsCoefficients,
  g_R0MarsCoefficients,
  g_R1MarsCoefficients,
  g_R2MarsCoefficients,
  g_R3MarsCoefficients,
  g_R4MarsCoefficients
} from './coefficients'

const cos = Math.cos

export function getEclipticLongitude(jd: JulianDay): Degree {
  const rho = (jd - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho
  const rho5 = rho4 * rho

  let L0 = 0
  for (let i = 0; i < g_L0MarsCoefficients.length; i++) {
    L0 += g_L0MarsCoefficients[i].A * cos(g_L0MarsCoefficients[i].B + g_L0MarsCoefficients[i].C * rho)
  }
  let L1 = 0
  for (let i = 0; i < g_L1MarsCoefficients.length; i++) {
    L1 += g_L1MarsCoefficients[i].A * cos(g_L1MarsCoefficients[i].B + g_L1MarsCoefficients[i].C * rho)
  }
  let L2 = 0
  for (let i = 0; i < g_L2MarsCoefficients.length; i++) {
    L2 += g_L2MarsCoefficients[i].A * cos(g_L2MarsCoefficients[i].B + g_L2MarsCoefficients[i].C * rho)
  }
  let L3 = 0
  for (let i = 0; i < g_L3MarsCoefficients.length; i++) {
    L3 += g_L3MarsCoefficients[i].A * cos(g_L3MarsCoefficients[i].B + g_L3MarsCoefficients[i].C * rho)
  }
  let L4 = 0
  for (let i = 0; i < g_L4MarsCoefficients.length; i++) {
    L4 += g_L4MarsCoefficients[i].A * cos(g_L4MarsCoefficients[i].B + g_L4MarsCoefficients[i].C * rho)
  }
  let L5 = 0
  for (let i = 0; i < g_L5MarsCoefficients.length; i++) {
    L5 += g_L5MarsCoefficients[i].A * cos(g_L5MarsCoefficients[i].B + g_L5MarsCoefficients[i].C * rho)
  }

  let value = (L0 + L1 * rho + L2 * rhosquared + L3 * rhocubed + L4 * rho4 + L5 * rho5) / 100000000

  return MapTo0To360Range(value * RAD2DEG)
}

export function getEclipticLatitude(jd: JulianDay): Degree {
  const rho = (jd - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho

  let B0 = 0
  for (let i = 0; i < g_B0MarsCoefficients.length; i++) {
    B0 += g_B0MarsCoefficients[i].A * cos(g_B0MarsCoefficients[i].B + g_B0MarsCoefficients[i].C * rho)
  }

  let B1 = 0
  for (let i = 0; i < g_B1MarsCoefficients.length; i++)
    B1 += g_B1MarsCoefficients[i].A * cos(g_B1MarsCoefficients[i].B + g_B1MarsCoefficients[i].C * rho)

  let B2 = 0
  for (let i = 0; i < g_B2MarsCoefficients.length; i++) {
    B2 += g_B2MarsCoefficients[i].A * cos(g_B2MarsCoefficients[i].B + g_B2MarsCoefficients[i].C * rho)
  }
  let B3 = 0
  for (let i = 0; i < g_B3MarsCoefficients.length; i++) {
    B3 += g_B3MarsCoefficients[i].A * cos(g_B3MarsCoefficients[i].B + g_B3MarsCoefficients[i].C * rho)
  }
  let B4 = 0
  for (let i = 0; i < g_B4MarsCoefficients.length; i++) {
    B4 += g_B4MarsCoefficients[i].A * cos(g_B4MarsCoefficients[i].B + g_B4MarsCoefficients[i].C * rho)
  }

  let value = (B0 + B1 * rho + B2 * rhosquared + B3 * rhocubed + B4 * rho4) / 100000000
  return MapToMinus90To90Range(value * RAD2DEG)
}

export function getRadiusVector(jd: JulianDay) {
  const rho = (jd - 2451545) / 365250
  const rhosquared = rho * rho
  const rhocubed = rhosquared * rho
  const rho4 = rhocubed * rho

  let R0 = 0
  for (let i = 0; i < g_R0MarsCoefficients.length; i++) {
    R0 += g_R0MarsCoefficients[i].A * cos(g_R0MarsCoefficients[i].B + g_R0MarsCoefficients[i].C * rho)
  }
  let R1 = 0
  for (let i = 0; i < g_R1MarsCoefficients.length; i++) {
    R1 += g_R1MarsCoefficients[i].A * cos(g_R1MarsCoefficients[i].B + g_R1MarsCoefficients[i].C * rho)
  }
  let R2 = 0
  for (let i = 0; i < g_R2MarsCoefficients.length; i++) {
    R2 += g_R2MarsCoefficients[i].A * cos(g_R2MarsCoefficients[i].B + g_R2MarsCoefficients[i].C * rho)
  }
  let R3 = 0
  for (let i = 0; i < g_R3MarsCoefficients.length; i++) {
    R3 += g_R3MarsCoefficients[i].A * cos(g_R3MarsCoefficients[i].B + g_R3MarsCoefficients[i].C * rho)
  }
  let R4 = 0
  for (let i = 0; i < g_R4MarsCoefficients.length; i++) {
    R4 += g_R4MarsCoefficients[i].A * cos(g_R4MarsCoefficients[i].B + g_R4MarsCoefficients[i].C * rho)
  }

  return (R0 + R1 * rho + R2 * rhosquared + R3 * rhocubed + R4 * rho4) / 100000000
}

export function getEclipticCoordinates(JD: JulianDay): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(JD),
    latitude: getEclipticLatitude(JD)
  }
}