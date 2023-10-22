import Decimal from 'decimal.js'
import { Coordinates2D, Coordinates3D, Degree, Hour, JulianDay } from '@/types'
import { DEG2RAD, H2RAD, MINUSONE, RAD2DEG, RAD2H, ZERO } from '@/constants'
import { getJulianCentury } from '@/juliandays'
import { g_AberrationCoefficients } from './coefficients'
import { Sun } from '@/sun'


/**
 * Earth velocity (as a 3D vector)
 * @param {JulianDay} jd The julian day
 * @return {Coordinates3D}
 */
export function getEarthVelocity (jd: JulianDay | number): Coordinates3D {
  const T = getJulianCentury(jd)
  const L2 = new Decimal(3.1761467).plus(new Decimal(1021.3285546).mul(T))
  const L3 = new Decimal(1.7534703).plus(new Decimal(628.3075849).mul(T))
  const L4 = new Decimal(6.2034809).plus(new Decimal(334.0612431).mul(T))
  const L5 = new Decimal(0.5995465).plus(new Decimal(52.9690965).mul(T))
  const L6 = new Decimal(0.8740168).plus(new Decimal(21.3299095).mul(T))
  const L7 = new Decimal(5.4812939).plus(new Decimal(7.4781599).mul(T))
  const L8 = new Decimal(5.3118863).plus(new Decimal(3.8133036).mul(T))
  const Ldash = new Decimal(3.8103444).plus(new Decimal(8399.6847337).mul(T))
  const D = new Decimal(5.1984667).plus(new Decimal(7771.3771486).mul(T))
  const Mdash = new Decimal(2.3555559).plus(new Decimal(8328.6914289).mul(T))
  const F = new Decimal(1.6279052).plus(new Decimal(8433.4661601).mul(T))

  return g_AberrationCoefficients.reduce((sum, val) => {
    const argument = val.L2.mul(L2)
      .plus(val.L3.mul(L3))
      .plus(val.L4.mul(L4))
      .plus(val.L5.mul(L5))
      .plus(val.L6.mul(L6))
      .plus(val.L7.mul(L7))
      .plus(val.L8.mul(L8))
      .plus(val.Ldash.mul(Ldash))
      .plus(val.D.mul(D))
      .plus(val.Mdash.mul(Mdash))
      .plus(val.F.mul(F))
    return {
      X: sum.X
        .plus(val.xsin.plus(val.xsint.mul(T)).mul(argument.sin()))
        .plus(val.xcos.plus(val.xcost.mul(T)).mul(argument.cos())),
      Y: sum.Y
        .plus(val.ysin.plus(val.ysint.mul(T)).mul(argument.sin()))
        .plus(val.ycos.plus(val.ycost.mul(T)).mul(argument.cos())),
      Z: sum.Z
        .plus(val.zsin.plus(val.zsint.mul(T)).mul(argument.sin()))
        .plus(val.zcos.plus(val.zcost.mul(T)).mul(argument.cos()))
    }
  }, { X: ZERO, Y: ZERO, Z: ZERO })
}

/**
 * Equatorial aberration
 * @param {JulianDay} jd The julian day
 * @param {Hour} Alpha The equatorial right ascension.
 * @param {Degree} Delta The equatorial declination
 * @return {Coordinates2D}
 */
export function getEquatorialAberration (jd: JulianDay | number, Alpha: Hour | number, Delta: Degree | number): Coordinates2D {
  const ra = new Decimal(Alpha).mul(H2RAD)
  const dec = new Decimal(Delta).mul(DEG2RAD)

  const cosAlpha = ra.cos()
  const sinAlpha = ra.sin()
  const cosDelta = dec.cos()
  const sinDelta = dec.sin()

  const velocity = getEarthVelocity(jd)

  const X0 = velocity.Y.mul(cosAlpha).minus(velocity.X.mul(sinAlpha))
  const X = X0.dividedBy(new Decimal(17314463350.0).mul(cosDelta))

  const Y0 = velocity.X.mul(cosAlpha).plus(velocity.Y.mul(sinAlpha))
  const Y1 = velocity.Z.mul(cosDelta)
  const Y = (Y0.mul(sinDelta).minus(Y1)).dividedBy(new Decimal(17314463350.0))

  return { X: X.mul(RAD2H), Y: MINUSONE.mul(Y).mul(RAD2DEG) }
}

/**
 * Ecliptic aberration
 * @param {JulianDay} jd The julian day
 * @param {Degree} Lambda The ecliptic longitude
 * @param {Degree} Beta The ecliptic latitude
 * @return {Coordinates2D}
 */
export function getEclipticAberration (jd: JulianDay | number, Lambda: Degree | number, Beta: Degree | number): Coordinates2D {
  const T = getJulianCentury(jd)

  const e = new Decimal(0.016708634)
    .minus(new Decimal(0.000042037).mul(T))
    .minus(new Decimal(0.0000001267).mul(T.pow(2)))

  const pi = new Decimal(102.93735)
    .plus(new Decimal(1.71946).mul(T))
    .plus(new Decimal(0.00046).mul(T.pow(2)))

  const k = new Decimal(20.49552)
  // Use the geoMETRIC longitude. See AA p.151
  const sunLongitude = Sun.getGeometricEclipticLongitude(jd).mul(DEG2RAD)
  const LambdaRad = new Decimal(Lambda).mul(DEG2RAD)
  const BetaRad = new Decimal(Beta).mul(DEG2RAD)

  const X0 = MINUSONE.mul(k).mul(Decimal.cos(sunLongitude.minus(LambdaRad)))
  const X1 = e.mul(k).mul(Decimal.cos(pi.minus(LambdaRad)))
  const X = (X0.plus(X1)).dividedBy(Decimal.cos(BetaRad)).dividedBy(3600)

  const Y0 = MINUSONE.mul(k).mul(Decimal.sin(BetaRad))
  const Y1 = Decimal.sin(sunLongitude.minus(LambdaRad))
  const Y2 = e.mul(Decimal.sin(pi.minus(LambdaRad)))
  const Y = Y0.mul(Y1.minus(Y2)).dividedBy(3600)

  // X = Delta lambda, Y = Delta beta
  return { X, Y }
}
