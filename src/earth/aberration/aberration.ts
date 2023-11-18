import Decimal from '@/decimal'
import {
  ArcSecond,
  Coordinates3D,
  EclipticCoordinates,
  EclipticCoordinatesCorrection,
  EquatorialCoordinates,
  EquatorialCoordinatesCorrection,
  JulianDay,
  Radian
} from '@/types'
import { CONSTANT_OF_ABERRATION, MINUSONE, ZERO } from '@/constants'
import { getJulianCentury } from '@/juliandays'
import { Sun } from '@/sun'
import { getEccentricity, getLongitudeOfPerihelion } from '../coordinates'
import { AberrationCoefficient, AberrationCoefficientNum, getAberrationCoefficients } from './coefficients'
import {
  getMeanObliquityOfEcliptic,
  getNutationInLongitude,
  getNutationInObliquity,
  getTrueObliquityOfEcliptic
} from '../nutation'


/**
 * Earth velocity (as a 3D vector), with respect to the barycenter of the solar system, in the equatorial
 * J2000.0 reference frame.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Coordinates3D} The units are 10^-8 AstronomicalUnit per day.
 * @memberof module:Earth
 */
export function getEarthVelocity (jd: JulianDay | number, highPrecision: boolean = true): Coordinates3D {
  const T = getJulianCentury(jd)
  const coefficients = getAberrationCoefficients(highPrecision)

  if (highPrecision) {
    const L2 = new Decimal('3.176_1467').plus(new Decimal('1021.328_5546').mul(T))
    const L3 = new Decimal('1.753_4703').plus(new Decimal('628.307_5849').mul(T))
    const L4 = new Decimal('6.203_4809').plus(new Decimal('334.061_2431').mul(T))
    const L5 = new Decimal('0.599_5465').plus(new Decimal('52.969_0965').mul(T))
    const L6 = new Decimal('0.874_0168').plus(new Decimal('21.329_9095').mul(T))
    const L7 = new Decimal('5.481_2939').plus(new Decimal('7.478_1599').mul(T))
    const L8 = new Decimal('5.311_8863').plus(new Decimal('3.813_3036').mul(T))
    const Ldash = new Decimal('3.810_3444').plus(new Decimal('8399.684_7337').mul(T))
    const D = new Decimal('5.198_4667').plus(new Decimal('7771.377_1486').mul(T))
    const Mdash = new Decimal('2.355_5559').plus(new Decimal('8328.691_4289').mul(T))
    const F = new Decimal('1.627_9052').plus(new Decimal('8433.466_1601').mul(T))

    return (coefficients as AberrationCoefficient[]).reduce((sum, val) => {
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
  } else {
    const tnum = T.toNumber()
    const L2 = 3.176_1467 + 1021.328_5546 * tnum
    const L3 = 1.753_4703 + 628.307_5849 * tnum
    const L4 = 6.203_4809 + 334.061_2431 * tnum
    const L5 = 0.599_5465 + 52.969_0965 * tnum
    const L6 = 0.874_0168 + 21.329_9095 * tnum
    const L7 = 5.481_2939 + 7.478_1599 * tnum
    const L8 = 5.311_8863 + 3.813_3036 * tnum
    const Ldash = 3.810_3444 + 8399.684_7337 * tnum
    const D = 5.198_4667 + 7771.377_1486 * tnum
    const Mdash = 2.355_5559 + 8328.691_4289 * tnum
    const F = 1.627_9052 + 8433.466_1601 * tnum

    return (coefficients as AberrationCoefficientNum[]).reduce((sum, val) => {
      const argument = val.L2 * L2
        + val.L3 * L3
        + val.L4 * L4
        + val.L5 * L5
        + val.L6 * L6
        + val.L7 * L7
        + val.L8 * L8
        + val.Ldash * Ldash
        + val.D * D
        + val.Mdash * Mdash
        + val.F * F
      return {
        X: sum.X.plus(
          val.xsin + val.xsint * tnum * Math.sin(argument)
          + val.xcos + val.xcost * tnum * Math.cos(argument)
        ),
        Y: sum.Y.plus(
          val.ysin + val.ysint * tnum * Math.sin(argument)
          + val.ycos + val.ycost * tnum * Math.cos(argument)
        ),
        Z: sum.Z.plus(
          val.zsin + val.zsint * tnum * Math.sin(argument)
          + val.zcos + val.zcost * tnum * Math.cos(argument)
        ),
      }
    }, { X: ZERO, Y: ZERO, Z: ZERO })
  }
}

/**
 * Accurate annual aberration for equatorial coordinates
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * This is the high-accuracy Ron-Vondrak expression for aberration. See AA p153.
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EquatorialCoordinatesCorrection}
 * @memberof module:Earth
 */
export function getAccurateAnnualEquatorialAberration (jd: JulianDay | number, coords: EquatorialCoordinates, highPrecision: boolean = true): EquatorialCoordinatesCorrection {
  const ra = new Decimal(coords.rightAscension).degreesToRadians()
  const dec = new Decimal(coords.declination).degreesToRadians()

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

  return { DeltaRightAscension: X.radiansToHours(), DeltaDeclination: MINUSONE.mul(Y).radiansToDegrees() }
}

/**
 * Equatorial (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * See getAccurateAnnualEquatorialAberration for high-accuracy algorithm, taking into account the total velocity of the Earth
 * relative to the barycenter of the solar system.
 * @see {getAccurateAnnualEquatorialAberration}
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in ArcSeconds
 * @memberof module:Earth
 */
export function getAnnualEquatorialAberration (jd: JulianDay | number, coords: EquatorialCoordinates, highPrecision: boolean = true): EquatorialCoordinatesCorrection {
  const e: Decimal = getEccentricity(jd)

  const pi: Radian = getLongitudeOfPerihelion(jd).degreesToRadians()
  const cosPi = pi.cos()
  const sinPi = pi.sin()

  const epsilon = getTrueObliquityOfEcliptic(jd).degreesToRadians()
  const cosEpsilon = epsilon.cos()
  const tanEpsilon = epsilon.tan()

  // Use the geoMETRIC longitude. See AA p.151
  const sunLongitude: Radian = Sun.getGeometricEclipticLongitude(jd).degreesToRadians()
  const cosLong = sunLongitude.cos()
  const sinLong = sunLongitude.sin()

  const ra: Radian = new Decimal(coords.rightAscension).degreesToRadians()
  const dec: Radian = new Decimal(coords.declination).degreesToRadians()
  const cosAlpha = ra.cos()
  const sinAlpha = ra.sin()
  const cosDelta = dec.cos()
  const sinDelta = dec.sin()

  const k = CONSTANT_OF_ABERRATION

  const A0 = cosAlpha.mul(cosLong).mul(cosEpsilon).plus(sinAlpha.mul(sinLong))
  const A1 = cosAlpha.mul(cosPi).mul(cosEpsilon).plus(sinAlpha.mul(sinPi))
  const DeltaRightAscension: ArcSecond = (MINUSONE.mul(k).mul(A0.dividedBy(cosDelta)))
    .plus(e.mul(k).mul(A1).dividedBy(cosDelta))

  const D0 = (tanEpsilon.mul(cosDelta)).minus(sinAlpha.mul(sinDelta))
  const D1 = cosLong.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinLong))
  const D2 = cosPi.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinPi))
  const DeltaDeclination: ArcSecond = (MINUSONE.mul(k).mul(D1)).plus(e.mul(k).mul(D2))

  return { DeltaRightAscension, DeltaDeclination }
}

/**
 * Ecliptic (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * @param {JulianDay} jd The julian day
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in Arcsecond
 * @memberof module:Earth
 */
export function getAnnualEclipticAberration (jd: JulianDay | number, coords: EclipticCoordinates, highPrecision: boolean = true): EclipticCoordinatesCorrection {
  const e = getEccentricity(jd)
  const pi = getLongitudeOfPerihelion(jd)
  const k = CONSTANT_OF_ABERRATION

  // Use the geoMETRIC longitude. See AA p.151
  const sunLongitude: Radian = Sun.getGeometricEclipticLongitude(jd).degreesToRadians()
  const LambdaRad: Radian = new Decimal(coords.longitude).degreesToRadians()
  const BetaRad: Radian = new Decimal(coords.latitude).degreesToRadians()

  const X0 = MINUSONE.mul(k).mul(Decimal.cos(sunLongitude.minus(LambdaRad)))
  const X1 = e.mul(k).mul(Decimal.cos(pi.minus(LambdaRad)))
  const X: ArcSecond = (X0.plus(X1)).dividedBy(Decimal.cos(BetaRad)).dividedBy(3600)

  const Y0 = MINUSONE.mul(k).mul(Decimal.sin(BetaRad))
  const Y1 = Decimal.sin(sunLongitude.minus(LambdaRad))
  const Y2 = e.mul(Decimal.sin(pi.minus(LambdaRad)))
  const Y: ArcSecond = Y0.mul(Y1.minus(Y2)).dividedBy(3600)

  return { DeltaLongitude: X, DeltaLatitude: Y }
}

/**
 * Equatorial aberration due to nutation.
 * Warning: this is valid is not near the celestial poles (say < 1").
 * This is useful for stars, whose position are often given in equatorial coordinates.
 * For planets, use the `getApparentEquatorialCoordinates` methods instead.
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in Arcsecond
 * @memberof module:Earth
 */
export function getNutationEquatorialAberration (jd: JulianDay | number, coords: EquatorialCoordinates, highPrecision: boolean = true): EquatorialCoordinatesCorrection {
  const epsilon: Radian = getMeanObliquityOfEcliptic(jd).degreesToRadians()
  const cosEpsilon = epsilon.cos()
  const sinEpsilon = epsilon.sin()

  const DeltaEpsilon: ArcSecond = getNutationInObliquity(jd)
  const DeltaPsi: ArcSecond = getNutationInLongitude(jd)

  const ra: Radian = new Decimal(coords.rightAscension).degreesToRadians()
  const dec: Radian = new Decimal(coords.declination).degreesToRadians()
  const cosAlpha = ra.cos()
  const sinAlpha = ra.sin()
  const tanDelta = dec.tan()

  const A0 = cosEpsilon.plus(sinEpsilon.mul(sinAlpha).mul(tanDelta))
  const A1 = cosAlpha.mul(tanDelta)
  const DeltaRightAscension = DeltaPsi.mul(A0).minus(DeltaEpsilon.mul(A1))

  const D0 = sinEpsilon.mul(cosAlpha)
  const D1 = sinAlpha
  const DeltaDeclination = DeltaPsi.mul(D0).plus(DeltaEpsilon.mul(D1))

  return { DeltaRightAscension, DeltaDeclination }
}
