import Decimal from '@/decimal'
import {
  ArcSecond,
  EclipticCoordinates,
  EclipticCoordinatesCorrection,
  EquatorialCoordinates,
  EquatorialCoordinatesCorrection,
  JulianDay,
  Radian
} from '@/types'
import { CONSTANT_OF_ABERRATION, DEG2RAD, MINUSONE } from '@/constants'
import { Sun } from '@/sun'
import {
  getMeanObliquityOfEcliptic,
  getNutationInLongitude,
  getNutationInObliquity,
  getTrueObliquityOfEcliptic
} from '../nutation'
import { getEccentricity, getLongitudeOfPerihelion } from '../coordinates'
import { getEarthVelocity } from './earthvelocity'

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
  if (highPrecision) {
    const ra = new Decimal(coords.rightAscension).degreesToRadians()
    const dec = new Decimal(coords.declination).degreesToRadians()

    const cosAlpha = ra.cos()
    const sinAlpha = ra.sin()
    const cosDelta = dec.cos()
    const sinDelta = dec.sin()

    const velocity = getEarthVelocity(jd, highPrecision)
    const c = new Decimal('17_314_463_350.0') // Speed of light in units of 10^-8 UA / day. See AA p 155.

    const X0 = velocity.Y.mul(cosAlpha).minus(velocity.X.mul(sinAlpha))
    const X = X0.dividedBy(c.mul(cosDelta))

    const Y0 = velocity.X.mul(cosAlpha).plus(velocity.Y.mul(sinAlpha))
    const Y1 = velocity.Z.mul(cosDelta)
    const Y = (Y0.mul(sinDelta).minus(Y1)).dividedBy(c)

    return {
      DeltaRightAscension: X.radiansToDegrees().mul(3600), // to obtain units of ArcSecond
      DeltaDeclination: MINUSONE.mul(Y).radiansToDegrees().mul(3600) // to obtain units of ArcSecond
    }
  } else {
    const deg2rad = DEG2RAD.toNumber()
    const ra = (Decimal.isDecimal(coords.rightAscension) ? coords.rightAscension.toNumber() : coords.rightAscension) * deg2rad
    const dec = (Decimal.isDecimal(coords.declination) ? coords.declination.toNumber() : coords.declination) * deg2rad

    const cosAlpha = Math.cos(ra)
    const sinAlpha = Math.sin(ra)
    const cosDelta = Math.cos(dec)
    const sinDelta = Math.sin(dec)

    const velocity = getEarthVelocity(jd, highPrecision)
    const c = 17_314_463_350.0 // Speed of light in units of 10^-8 UA / day. See AA p 155.

    const X0 = velocity.Y.toNumber() * cosAlpha - velocity.X.toNumber() * sinAlpha
    const X = X0 / (c * cosDelta)

    const Y0 = velocity.X.toNumber() * cosAlpha + velocity.Y.toNumber() * sinAlpha
    const Y1 = velocity.Z.toNumber() * cosDelta
    const Y = (Y0 * sinDelta - Y1) / c

    return {
      DeltaRightAscension: new Decimal(X).radiansToDegrees().mul(3600), // to obtain units of ArcSecond
      DeltaDeclination: MINUSONE.mul(Y).radiansToDegrees().mul(3600) // to obtain units of ArcSecond
    }
  }
}

/**
 * Equatorial (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * See getAccurateAnnualEquatorialAberration for high-accuracy algorithm, taking into account the total velocity of the Earth
 * relative to the barycenter of the solar system.
 * See AA p 152, Equ 23.3
 * @see {getAccurateAnnualEquatorialAberration}
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in ArcSeconds
 * @memberof module:Earth
 */
export function getAnnualEquatorialAberration (jd: JulianDay | number, coords: EquatorialCoordinates, highPrecision: boolean = true): EquatorialCoordinatesCorrection {
  let DeltaRightAscension: ArcSecond, DeltaDeclination: ArcSecond

  if (highPrecision) {
    const ra: Radian = new Decimal(coords.rightAscension).degreesToRadians()
    const dec: Radian = new Decimal(coords.declination).degreesToRadians()

    const e: Decimal = getEccentricity(jd)
    const k = CONSTANT_OF_ABERRATION

    const pi: Radian = getLongitudeOfPerihelion(jd).degreesToRadians()
    const epsilon = getTrueObliquityOfEcliptic(jd, highPrecision).degreesToRadians()
    const sunLongitude: Radian = Sun.getGeometricEclipticLongitude(jd, highPrecision).degreesToRadians()

    const cosPi = pi.cos()
    const sinPi = pi.sin()
    const cosEpsilon = epsilon.cos()
    const tanEpsilon = epsilon.tan()

    // Use the geoMETRIC longitude. See AA p.151
    const cosLong = sunLongitude.cos()
    const sinLong = sunLongitude.sin()

    const cosAlpha = ra.cos()
    const sinAlpha = ra.sin()
    const cosDelta = dec.cos()
    const sinDelta = dec.sin()

    const A0 = cosAlpha.mul(cosLong).mul(cosEpsilon).plus(sinAlpha.mul(sinLong))
    const A1 = cosAlpha.mul(cosPi).mul(cosEpsilon).plus(sinAlpha.mul(sinPi))
    DeltaRightAscension = (MINUSONE.mul(k).mul(A0.dividedBy(cosDelta)))
      .plus(e.mul(k).mul(A1).dividedBy(cosDelta))

    const D0 = (tanEpsilon.mul(cosDelta)).minus(sinAlpha.mul(sinDelta))
    const D1 = cosLong.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinLong))
    const D2 = cosPi.mul(cosEpsilon).mul(D0).plus(cosAlpha.mul(sinDelta).mul(sinPi))
    DeltaDeclination = (MINUSONE.mul(k).mul(D1)).plus(e.mul(k).mul(D2))
  } else {
    const deg2rad = DEG2RAD.toNumber()
    const ra = (Decimal.isDecimal(coords.rightAscension) ? coords.rightAscension.toNumber() : coords.rightAscension) * deg2rad
    const dec = (Decimal.isDecimal(coords.declination) ? coords.declination.toNumber() : coords.declination) * deg2rad

    const e = getEccentricity(jd).toNumber()
    const k = CONSTANT_OF_ABERRATION.toNumber()

    const pi = getLongitudeOfPerihelion(jd).toNumber() * deg2rad
    const epsilon = getTrueObliquityOfEcliptic(jd, highPrecision).toNumber() * deg2rad
    const sunLongitude = Sun.getGeometricEclipticLongitude(jd, highPrecision).toNumber() * deg2rad

    const cosPi = Math.cos(pi)
    const sinPi = Math.sin(pi)
    const cosEpsilon = Math.cos(epsilon)
    const tanEpsilon = Math.tan(epsilon)

    // Use the geoMETRIC longitude. See AA p.151
    const cosLong = Math.cos(sunLongitude)
    const sinLong = Math.sin(sunLongitude)

    const cosAlpha = Math.cos(ra)
    const sinAlpha = Math.sin(ra)
    const cosDelta = Math.cos(dec)
    const sinDelta = Math.sin(dec)

    const A0 = cosAlpha * cosLong * cosEpsilon + sinAlpha * sinLong
    const A1 = cosAlpha * cosPi * cosEpsilon + sinAlpha * sinPi
    DeltaRightAscension = new Decimal(
      -1 * k * (A0 / cosDelta) + e * k * A1 / cosDelta
    )

    const D0 = tanEpsilon * cosDelta - sinAlpha * sinDelta
    const D1 = cosLong * cosEpsilon * D0 + cosAlpha * sinDelta * sinLong
    const D2 = cosPi * cosEpsilon * D0 + cosAlpha * sinDelta * sinPi
    DeltaDeclination = new Decimal(
      -1 * k * D1 + e * k * D2
    )
  }

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
  const sunLongitude: Radian = Sun.getGeometricEclipticLongitude(jd, highPrecision).degreesToRadians()
  const LambdaRad: Radian = new Decimal(coords.longitude).degreesToRadians()
  const BetaRad: Radian = new Decimal(coords.latitude).degreesToRadians()

  if (highPrecision) {
    const X0 = MINUSONE.mul(k).mul(Decimal.cos(sunLongitude.minus(LambdaRad)))
    const X1 = e.mul(k).mul(Decimal.cos(pi.minus(LambdaRad)))
    const X: ArcSecond = (X0.plus(X1)).dividedBy(Decimal.cos(BetaRad)).dividedBy(3600)

    const Y0 = MINUSONE.mul(k).mul(Decimal.sin(BetaRad))
    const Y1 = Decimal.sin(sunLongitude.minus(LambdaRad))
    const Y2 = e.mul(Decimal.sin(pi.minus(LambdaRad)))
    const Y: ArcSecond = Y0.mul(Y1.minus(Y2)).dividedBy(3600)

    return { DeltaLongitude: X, DeltaLatitude: Y }
  } else {
    const X0 = -1 * k.toNumber() * Math.cos(sunLongitude.toNumber() - LambdaRad.toNumber())
    const X1 = e.toNumber() * k.toNumber() * Math.cos(pi.toNumber() - LambdaRad.toNumber())
    const X: ArcSecond = new Decimal(
      (X0 + X1) / Math.cos(BetaRad.toNumber()) / 3600
    )

    const Y0 = -1 * k.toNumber() * Math.sin(BetaRad.toNumber())
    const Y1 = Math.sin(sunLongitude.toNumber() - LambdaRad.toNumber())
    const Y2 = e.toNumber() * (Math.sin(pi.toNumber() - LambdaRad.toNumber()))
    const Y: ArcSecond = new Decimal(
      Y0 * (Y1 - Y2) / 3600
    )

    return { DeltaLongitude: X, DeltaLatitude: Y }
  }
}

/**
 * Equatorial aberration due to nutation.
 * Warning: this is valid is not near the celestial poles (say < 1").
 * This is useful for stars, whose position are often given in equatorial coordinates.
 * For planets, use the `getApparentEquatorialCoordinates` methods instead.
 * See AA p 151, Equ 23.1
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in Arcsecond
 * @memberof module:Earth
 */
export function getNutationEquatorialAberration (jd: JulianDay | number, coords: EquatorialCoordinates, highPrecision: boolean = true): EquatorialCoordinatesCorrection {
  const epsilon: Radian = getMeanObliquityOfEcliptic(jd, highPrecision).degreesToRadians()

  const DeltaEpsilon: ArcSecond = getNutationInObliquity(jd, highPrecision)
  const DeltaPsi: ArcSecond = getNutationInLongitude(jd, highPrecision)

  const ra: Radian = new Decimal(coords.rightAscension).degreesToRadians()
  const dec: Radian = new Decimal(coords.declination).degreesToRadians()

  if (highPrecision) {
    const cosEpsilon = epsilon.cos()
    const sinEpsilon = epsilon.sin()

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
  } else {
    const cosEpsilon = Math.cos(epsilon.toNumber())
    const sinEpsilon = Math.sin(epsilon.toNumber())

    const cosAlpha = Math.cos(ra.toNumber())
    const sinAlpha = Math.sin(ra.toNumber())
    const tanDelta = Math.tan(dec.toNumber())

    const A0 = cosEpsilon + sinEpsilon * sinAlpha * tanDelta
    const DeltaRightAscension = new Decimal(
      DeltaPsi.toNumber() * A0 - DeltaEpsilon.toNumber() * cosAlpha * tanDelta
    )

    const DeltaDeclination = new Decimal(
      DeltaPsi.toNumber() * sinEpsilon * cosAlpha + DeltaEpsilon.toNumber() * sinAlpha
    )

    return { DeltaRightAscension, DeltaDeclination }
  }
}
