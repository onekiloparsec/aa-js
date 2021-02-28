import { DEG2RAD, Degree, Hour, JulianDay, RAD2DEG, RAD2H } from '../constants'
import { Coordinates2D, Coordinates3D } from '../coordinates'
import { g_AberrationCoefficients } from './coefficients'
import * as sun from '../sun'

const cos = Math.cos
const sin = Math.sin


export function getEarthVelocity(jd: JulianDay): Coordinates3D {
  const T = (jd - 2451545) / 36525
  const L2 = 3.1761467 + 1021.3285546 * T
  const L3 = 1.7534703 + 628.3075849 * T
  const L4 = 6.2034809 + 334.0612431 * T
  const L5 = 0.5995465 + 52.9690965 * T
  const L6 = 0.8740168 + 21.3299095 * T
  const L7 = 5.4812939 + 7.4781599 * T
  const L8 = 5.3118863 + 3.8133036 * T
  const Ldash = 3.8103444 + 8399.6847337 * T
  const D = 5.1984667 + 7771.3771486 * T
  const Mdash = 2.3555559 + 8328.6914289 * T
  const F = 1.6279052 + 8433.4661601 * T

  let X = 0
  let Y = 0
  let Z = 0

  for (let i = 0; i < g_AberrationCoefficients.length; i++) {
    const Argument = g_AberrationCoefficients[i].L2 * L2 + g_AberrationCoefficients[i].L3 * L3 +
      g_AberrationCoefficients[i].L4 * L4 + g_AberrationCoefficients[i].L5 * L5 +
      g_AberrationCoefficients[i].L6 * L6 + g_AberrationCoefficients[i].L7 * L7 +
      g_AberrationCoefficients[i].L8 * L8 + g_AberrationCoefficients[i].Ldash * Ldash +
      g_AberrationCoefficients[i].D * D + g_AberrationCoefficients[i].Mdash * Mdash +
      g_AberrationCoefficients[i].F * F

    X += (g_AberrationCoefficients[i].xsin + g_AberrationCoefficients[i].xsint * T) * sin(Argument)
    X += (g_AberrationCoefficients[i].xcos + g_AberrationCoefficients[i].xcost * T) * cos(Argument)

    Y += (g_AberrationCoefficients[i].ysin + g_AberrationCoefficients[i].ysint * T) * sin(Argument)
    Y += (g_AberrationCoefficients[i].ycos + g_AberrationCoefficients[i].ycost * T) * cos(Argument)

    Z += (g_AberrationCoefficients[i].zsin + g_AberrationCoefficients[i].zsint * T) * sin(Argument)
    Z += (g_AberrationCoefficients[i].zcos + g_AberrationCoefficients[i].zcost * T) * cos(Argument)
  }

  return { X, Y, Z }
}

export function getEquatorialAberration(jd: JulianDay, Alpha: Hour, Delta: Degree): Coordinates2D {
  Alpha = Alpha * 15 * DEG2RAD
  Delta = Delta * DEG2RAD

  const cosAlpha = cos(Alpha)
  const sinAlpha = sin(Alpha)
  const cosDelta = cos(Delta)
  const sinDelta = sin(Delta)

  const velocity = getEarthVelocity(jd)

  return {
    X: RAD2H * (velocity.Y * cosAlpha - velocity.X * sinAlpha) / (17314463350.0 * cosDelta),
    Y: RAD2DEG * (-(((velocity.X * cosAlpha + velocity.Y * sinAlpha) * sinDelta - velocity.Z * cosDelta) / 17314463350.0))
  }
}

export function getEclipticAberration(jd: JulianDay, Lambda: Degree, Beta: Degree): Coordinates2D {
  const T = (jd - 2451545) / 36525
  const Tsquared = T * T
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * Tsquared
  let pi = 102.93735 + 1.71946 * T + 0.00046 * Tsquared
  const k = 20.49552
  let sunLongitude = sun.geometricEclipticLongitude(jd)

  //Convert to radians
  pi = DEG2RAD * pi
  Lambda = DEG2RAD * Lambda
  Beta = DEG2RAD * Beta
  sunLongitude = DEG2RAD * sunLongitude

  return {
    X: (-k * cos(sunLongitude - Lambda) + e * k * cos(pi - Lambda)) / cos(Beta) / 3600,
    Y: -k * sin(Beta) * (sin(sunLongitude - Lambda) - e * sin(pi - Lambda)) / 3600
  }
}
