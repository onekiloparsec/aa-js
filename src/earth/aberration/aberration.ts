import Decimal from 'decimal.js'
import {
  Coordinates3D,
  Degree,
  EclipticCoordinatesCorrection,
  EquatorialCoordinatesCorrection,
  Hour,
  JulianDay
} from '@/types'
import { CONSTANT_OF_ABERRATION, DEG2RAD, H2RAD, MINUSONE, RAD2DEG, RAD2H, ZERO } from '@/constants'
import { Sun } from '@/sun'
import { getJulianCentury } from '@/juliandays'
import { getEccentricity, getLongitudeOfPerihelion } from '../coordinates'
import { getTrueObliquityOfEcliptic } from '../nutation'
import { g_AberrationCoefficients } from './coefficients'


/**
 * Earth velocity (as a 3D vector), with respect to the barycenter of the solar system, in the equatorial
 * J2000.0 reference frame.
 * @param {JulianDay} jd The julian day
 * @return {Coordinates3D} The units are 10^-8 AstronomicalUnit per day.
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
 * Accurate annual aberration for equatorial coordinates
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * This is the high-accuracy Ron-Vondrak expression for aberration. See AA p153.
 * @param {JulianDay} jd The julian day
 * @param {Hour} Alpha The equatorial right ascension.
 * @param {Degree} Delta The equatorial declination
 * @return {Coordinates2D}
 */
export function getAccurateEquatorialAberration (jd: JulianDay | number, Alpha: Hour | number, Delta: Degree | number): EquatorialCoordinatesCorrection {
  const ra = new Decimal(Alpha).mul(H2RAD)
  const dec = new Decimal(Delta).mul(DEG2RAD)

  const cosAlpha = ra.cos()
  const sinAlpha = ra.sin()
  const cosDelta = dec.cos()
  const sinDelta = dec.sin()

  const velocity = getEarthVelocity(jd)
  const c = new Decimal(17314463350.0)

  const X0 = velocity.Y.mul(cosAlpha).minus(velocity.X.mul(sinAlpha))
  const X = X0.dividedBy(c.mul(cosDelta))

  const Y0 = velocity.X.mul(cosAlpha).plus(velocity.Y.mul(sinAlpha))
  const Y1 = velocity.Z.mul(cosDelta)
  const Y = (Y0.mul(sinDelta).minus(Y1)).dividedBy(c)

  return { DeltaRightAscension: X.mul(RAD2H), DeltaDeclination: MINUSONE.mul(Y).mul(RAD2DEG) }
}

/**
 * Equatorial (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * See getAccurateEquatorialAberration for high-accuracy algorithm, taking into account the total velocity of the Earth
 * relative to the barycenter of the solar system.
 * @see {getAccurateEquatorialAberration}
 * @param {JulianDay} jd The julian day
 * @param {Hour} Alpha The right ascension
 * @param {Degree} Delta The declination
 * @return {EclipticCoordinatesCorrection} The coordinates corrections
 */
export function getEquatorialAberration (jd: JulianDay | number, Alpha: Hour | number, Delta: Degree | number): EquatorialCoordinatesCorrection {
  const e = getEccentricity(jd)

  const pi = getLongitudeOfPerihelion(jd)
  const cosPi = pi.mul(DEG2RAD).cos()
  const sinPi = pi.mul(DEG2RAD).sin()

  const epsilon = getTrueObliquityOfEcliptic(jd).mul(DEG2RAD)
  const cosEpsilon = epsilon.cos()
  const tanEpsilon = epsilon.tan()

  // Use the geoMETRIC longitude. See AA p.151
  const sunLongitude = Sun.getGeometricEclipticLongitude(jd).mul(DEG2RAD)
  const cosLong = sunLongitude.cos()
  const sinLong = sunLongitude.sin()

  const ra = new Decimal(Alpha).mul(H2RAD)
  const dec = new Decimal(Delta).mul(DEG2RAD)
  const cosAlpha = ra.cos()
  const sinAlpha = ra.sin()
  const cosDelta = dec.cos()
  const sinDelta = dec.sin()

  const k = CONSTANT_OF_ABERRATION

  const A0 = cosAlpha.mul(cosLong).mul(cosEpsilon).plus(sinAlpha.mul(sinLong))
  const A1 = cosAlpha.mul(cosPi).mul(cosEpsilon).plus(sinAlpha.mul(sinPi))
  const DeltaRightAscension = (MINUSONE.mul(k).mul(A0.dividedBy(cosDelta)))
    .plus(e.mul(k).mul(A1).dividedBy(cosDelta))

  const D0 = (tanEpsilon.mul(cosDelta)).minus(sinAlpha.mul(sinDelta))
  const D1 = cosLong.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinLong))
  const D2 = cosPi.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinPi))
  const DeltaDeclination = (MINUSONE.mul(k).mul(D1)).plus(e.mul(k).mul(D2))

  return { DeltaRightAscension, DeltaDeclination }
}

/**
 * Ecliptic (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * @param {JulianDay} jd The julian day
 * @param {Degree} Lambda The ecliptic longitude
 * @param {Degree} Beta The ecliptic latitude
 * @return {EclipticCoordinatesCorrection} The coordinates corrections
 */
export function getEclipticAberration (jd: JulianDay | number, Lambda: Degree | number, Beta: Degree | number): EclipticCoordinatesCorrection {
  const e = getEccentricity(jd)
  const pi = getLongitudeOfPerihelion(jd)
  const k = CONSTANT_OF_ABERRATION

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

  return { DeltaLongitude: X, DeltaLatitude: Y }
}
