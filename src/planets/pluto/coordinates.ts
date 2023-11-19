import Decimal from '@/decimal'
import { AstronomicalUnit, Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { Earth } from '@/earth'
import {
  ArgumentCoefficient,
  ArgumentCoefficientNum,
  CoordsCoefficient,
  CoordsCoefficientNum,
  getArgumentCoefficients,
  getLatitudeCoefficients,
  getLongitudeCoefficients,
  getRadiusCoefficients
} from './coefficients'
import { DEG2RAD } from '@/constants'

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Pluto
 */
export function getEclipticLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)

  const argumentCoefficients = getArgumentCoefficients(highPrecision)
  const longitudeCoefficients = getLongitudeCoefficients(highPrecision)

  if (highPrecision) {
    const J = new Decimal('34.35').plus(new Decimal('3034.9057').mul(T))
    const S = new Decimal('50.08').plus(new Decimal('1222.1138').mul(T))
    const P = new Decimal('238.96').plus(new Decimal('144.9600').mul(T))

    const L = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
      const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
      return sum
        .plus((longitudeCoefficients as CoordsCoefficient[])[index].A.mul(alpha.sin()))
        .plus((longitudeCoefficients as CoordsCoefficient[])[index].B.mul(alpha.cos()))
    }, new Decimal(0))

    return fmod360(
      L.dividedBy('1e8')
        .plus(new Decimal('238.958116').plus(new Decimal('144.96').mul(T)))
    )
  } else {
    const tnum = T.toNumber()
    const J = 34.35 + 3034.9057 * tnum
    const S = 50.08 + 1222.1138 * tnum
    const P = 238.96 + 144.9600 * tnum

    const deg2rad = DEG2RAD.toNumber()
    const L = (argumentCoefficients as ArgumentCoefficientNum[]).reduce((sum, value, index) => {
      const alpha = (value.J * J + value.S * S + value.P * P) * deg2rad
      return sum
        + (longitudeCoefficients as CoordsCoefficientNum[])[index].A * Math.sin(alpha)
        + (longitudeCoefficients as CoordsCoefficientNum[])[index].B * Math.cos(alpha)
    }, 0)

    return fmod360(
      L / 1e8 + 238.958116 + 144.96 * tnum
    )
  }
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Pluto
 */
export function getEclipticLatitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)

  const argumentCoefficients = getArgumentCoefficients(highPrecision)
  const latitudeCoefficients = getLatitudeCoefficients(highPrecision)

  if (highPrecision) {
    const J = new Decimal('34.35').plus(new Decimal('3034.9057').mul(T))
    const S = new Decimal('50.08').plus(new Decimal('1222.1138').mul(T))
    const P = new Decimal('238.96').plus(new Decimal('144.9600').mul(T))

    const B = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
      const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
      return sum
        .plus((latitudeCoefficients as CoordsCoefficient[])[index].A.mul(alpha.sin()))
        .plus((latitudeCoefficients as CoordsCoefficient[])[index].B.mul(alpha.cos()))
    }, new Decimal(0))

    return fmod90(B.dividedBy(1e8).plus(new Decimal(-3.908239)))
  } else {
    const tnum = T.toNumber()
    const J = 34.35 + 3034.9057 * tnum
    const S = 50.08 + 1222.1138 * tnum
    const P = 238.96 + 144.9600 * tnum

    const deg2rad = DEG2RAD.toNumber()
    const B = (argumentCoefficients as ArgumentCoefficientNum[]).reduce((sum, value, index) => {
      const alpha = (value.J * J + value.S * S + value.P * P) * deg2rad
      return sum
        + (latitudeCoefficients as CoordsCoefficientNum[])[index].A * Math.sin(alpha)
        + (latitudeCoefficients as CoordsCoefficientNum[])[index].B * Math.cos(alpha)
    }, 0)

    return fmod90(B / 1e8 - 3.908239)
  }
}

/**
 * Radius vector (distance from the Sun)
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {AstronomicalUnit}
 * @memberof module:Pluto
 */
export function getRadiusVector (jd: JulianDay | number, highPrecision: boolean = true): AstronomicalUnit {
  const T = getJulianCentury(jd, highPrecision)

  const argumentCoefficients = getArgumentCoefficients(highPrecision)
  const radiusCoefficients = getRadiusCoefficients(highPrecision)

  if (highPrecision) {
    const J = new Decimal('34.35').plus(new Decimal('3034.9057').mul(T))
    const S = new Decimal('50.08').plus(new Decimal('1222.1138').mul(T))
    const P = new Decimal('238.96').plus(new Decimal('144.9600').mul(T))

    const R = (argumentCoefficients as ArgumentCoefficient[]).reduce((sum, value, index) => {
      const alpha = (value.J.mul(J).plus(value.S.mul(S)).plus(value.P.mul(P))).degreesToRadians()
      return sum
        .plus((radiusCoefficients as CoordsCoefficient[])[index].A.mul(alpha.sin()))
        .plus((radiusCoefficients as CoordsCoefficient[])[index].B.mul(alpha.cos()))
    }, new Decimal(0))

    return fmod90(R.dividedBy(1e8).plus(new Decimal(40.7241346)))
  } else {
    const tnum = T.toNumber()
    const J = 34.35 + 3034.9057 * tnum
    const S = 50.08 + 1222.1138 * tnum
    const P = 238.96 + 144.9600 * tnum

    const deg2rad = DEG2RAD.toNumber()
    const R = (argumentCoefficients as ArgumentCoefficientNum[]).reduce((sum, value, index) => {
      const alpha = (value.J * J + value.S * S + value.P * P) * deg2rad
      return sum
        + (radiusCoefficients as CoordsCoefficientNum[])[index].A * Math.sin(alpha)
        + (radiusCoefficients as CoordsCoefficientNum[])[index].B * Math.cos(alpha)
    }, 0)

    return fmod90(R / 1e8 + 40.7241346)
  }
}

/**
 * Heliocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Pluto
 */
export function getEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd, highPrecision),
    latitude: getEclipticLatitude(jd, highPrecision)
  }
}

/**
 * Heliocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Pluto
 */
export function getEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticCoordinates(jd, highPrecision),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd, highPrecision) : Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
}
