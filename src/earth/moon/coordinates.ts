import Decimal from '@/decimal'
import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { ONE, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '../nutation'
import { getCoefficients1, getCoefficients2, getCoefficients3, getCoefficients4 } from './coefficients'
import { getSigma } from './reducers'

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  let value
  if (highPrecision) {
    value = new Decimal('218.3164477')
      .plus(new Decimal('481267.88123421').mul(T))
      .minus(new Decimal('0.0015786').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('538841'))
      .minus(T.pow(4).dividedBy('65194000'))
  } else {
    const t = T.toNumber()
    value = 218.3164477
      + 481267.88123421 * t
      - 0.0015786 * t * t
      + t * t * t / 538841
      - t * t * t * t / 65194000
  }
  return fmod360(value)
}

/**
 * Mean elongation
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanElongation (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  let value
  if (highPrecision) {
    value = new Decimal('297.8501921')
      .plus(new Decimal('445267.1114034').mul(T))
      .minus(new Decimal('0.0018819').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('545868'))
      .minus(T.pow(4).dividedBy('113065000'))
  } else {
    const t = T.toNumber()
    value = 297.8501921
      + 445267.1114034 * t
      - 0.0018819 * t * t
      + t * t * t / 545868
      - t * t * t * t / 113065000
  }
  return fmod360(value)
}

/**
 * Mean anomaly
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Earth
 */
export function getMeanAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  let value
  if (highPrecision) {
    value = new Decimal('134.963_3964')
      .plus(new Decimal('477198.867_5055').mul(T))
      .plus(new Decimal('0.008_7414').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('69699'))
      .minus(T.pow(4).dividedBy('14712000'))
  } else {
    const t = T.toNumber()
    value = 134.963_3964
      + 477198.867_5055 * t
      + 0.008_7414 * t * t
      + t * t * t / 69699
      - t * t * t * t / 14712000
  }
  return fmod360(value)
}

/**
 * Argument of latitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getArgumentOfLatitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd)
  let value
  if (highPrecision) {
    value = new Decimal('93.272_0950')
      .plus(new Decimal('483202.017_5233').mul(T))
      .minus(new Decimal('0.003_6539').mul(T.pow(2)))
      .minus(T.pow(3).dividedBy('3526_000'))
      .minus(T.pow(4).dividedBy('863_310_000'))
  } else {
    const t = T.toNumber()
    value = 93.272_0950
      + 483202.017_5233 * t
      - 0.003_6539 * t * t
      - t * t * t / 3526_000
      - t * t * t * t / 863_310_000
  }
  return fmod360(value)

}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const Ldash = getMeanLongitude(jd, highPrecision).degreesToRadians()
  const D = getMeanElongation(jd, highPrecision).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const Mdash = getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const F = getArgumentOfLatitude(jd, highPrecision).degreesToRadians()

  const T = getJulianCentury(jd, highPrecision)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  const A1 = fmod360(new Decimal('119.75').plus(new Decimal('131.849').mul(T))).degreesToRadians()
  const A2 = fmod360(new Decimal('53.09').plus(new Decimal('479264.290').mul(T))).degreesToRadians()

  let SigmaL = getSigma(E, D, M, Mdash, F, getCoefficients1, getCoefficients2, 'A', 'sin', highPrecision)

  // Finally the additive terms
  if (highPrecision) {
    SigmaL = (SigmaL as Decimal)
      .plus(new Decimal('3958').mul(Decimal.sin(A1)))
      .plus(new Decimal('1962').mul(Decimal.sin(Ldash.minus(F))))
      .plus(new Decimal('318').mul(Decimal.sin(A2)))
  } else {
    SigmaL = (SigmaL as number)
      + 3958 * Math.sin(A1.toNumber())
      + 1962 * Math.sin(Ldash.minus(F).toNumber())
      + 318 * Math.sin(A2.toNumber())
  }

  return fmod360(Ldash.radiansToDegrees().plus(new Decimal(SigmaL).dividedBy('1000000')))
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLatitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const Ldash = getMeanLongitude(jd, highPrecision).degreesToRadians()
  const D = getMeanElongation(jd, highPrecision).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const Mdash = getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const F = getArgumentOfLatitude(jd, highPrecision).degreesToRadians()

  const T = getJulianCentury(jd, highPrecision)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  const A1 = fmod360(new Decimal('119.75').plus(new Decimal('131.849').mul(T))).degreesToRadians()
  const A3 = fmod360(new Decimal('313.45').plus(new Decimal('481266.484').mul(T))).degreesToRadians()

  let SigmaB = getSigma(E, D, M, Mdash, F, getCoefficients3, getCoefficients4, '', 'sin', highPrecision)

  // Finally the additive terms
  if (highPrecision) {
    SigmaB = (SigmaB as Decimal)
      .minus(new Decimal('2235').mul(Decimal.sin(Ldash)))
      .plus(new Decimal('382').mul(Decimal.sin(A3)))
      .plus(new Decimal('175').mul(Decimal.sin(A1.minus(F))))
      .plus(new Decimal('175').mul(Decimal.sin(A1.plus(F))))
      .plus(new Decimal('127').mul(Decimal.sin(Ldash.minus(Mdash))))
      .minus(new Decimal('115').mul(Decimal.sin(Ldash.plus(Mdash))))
  } else {
    SigmaB = (SigmaB as number)
      - 2235 * Math.sin(Ldash.toNumber())
      + 382 * Math.sin(A3.toNumber())
      + 175 * Math.sin(A1.minus(F).toNumber())
      + 175 * Math.sin(A1.plus(F).toNumber())
      + 127 * Math.sin(Ldash.minus(Mdash).toNumber())
      - 115 * Math.sin(Ldash.plus(Mdash).toNumber())
  }
  return new Decimal(SigmaB).dividedBy('1000000')
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Earth
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd, highPrecision),
    latitude: getGeocentricEclipticLatitude(jd, highPrecision)
  }
}

/**
 * Geocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Earth
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd, highPrecision),
    (obliquity === Obliquity.Mean) ? getMeanObliquityOfEcliptic(jd, highPrecision) : getTrueObliquityOfEcliptic(jd, highPrecision)
  )
}

/**
 * Apparent geocentric equatorial coordinates, that is corrected for nutation
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Earth
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EquatorialCoordinates {
  const ecliptic = getGeocentricEclipticCoordinates(jd, highPrecision)
  ecliptic.longitude = (ecliptic.longitude as Degree).plus(getNutationInLongitude(jd, highPrecision).dividedBy(3600))
  return transformEclipticToEquatorial(ecliptic, getTrueObliquityOfEcliptic(jd, highPrecision))
}


/**
 * Radius vector (distance Earth-Moon) in kilometers!
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Kilometer}
 * @memberof module:Earth
 */
export function getRadiusVectorInKilometer (jd: JulianDay | number, highPrecision: boolean = true): Kilometer {
  const D = getMeanElongation(jd, highPrecision).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const Mdash = getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const F = getArgumentOfLatitude(jd, highPrecision).degreesToRadians()

  const T = getJulianCentury(jd, highPrecision)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  const SigmaR = getSigma(E, D, M, Mdash, F, getCoefficients1, getCoefficients2, 'B', 'cos', highPrecision)

  return new Decimal('385000.56').plus(new Decimal(SigmaR).dividedBy('1000'))
}


/**
 * Horizontal parallax
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 * @memberof module:Earth
 */
export function horizontalParallax (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  return radiusVectorToHorizontalParallax(getRadiusVectorInKilometer(jd, highPrecision), highPrecision)
}

/**
 * Transforms a radius vector into horizontal parallax
 * @param {Kilometer} radiusVector The radius vector
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function radiusVectorToHorizontalParallax (radiusVector: Kilometer | number, highPrecision: boolean = true): Degree {
  if (highPrecision) {
    return Decimal.asin(new Decimal('6378.14').dividedBy(radiusVector)).radiansToDegrees()
  } else {
    const r = Decimal.isDecimal(radiusVector) ? radiusVector.toNumber() : radiusVector
    return new Decimal(Math.asin(6378.14 / r)).radiansToDegrees()
  }
}

/**
 * Transforms a horizontal parallax into a radius vector
 * @param {Degree} horizontalParallax
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Kilometer}
 * @memberof module:Earth
 */
export function horizontalParallaxToRadiusVector (horizontalParallax: Degree | number, highPrecision: boolean = true): Kilometer {
  if (highPrecision) {
    return new Decimal('6378.14').dividedBy(Decimal.sin(new Decimal(horizontalParallax).degreesToRadians()))
  } else {
    const hp = new Decimal(horizontalParallax).degreesToRadians().toNumber()
    return new Decimal(6378.14 / Math.sin(hp))
  }
}

/**
 * Mean longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitudeAscendingNode (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  let value
  if (highPrecision) {
    value = new Decimal('125.044_5479')
      .minus(new Decimal('1934.136_2891').mul(T))
      .plus(new Decimal('0.002_0754').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('467_441'))
      .minus(T.pow(4).dividedBy('60_616_000'))
  } else {
    const t = T.toNumber()
    value = 125.044_5479
      - 1934.136_2891 * t
      + 0.002_0754 * t * t
      + t * t * t / 467_441
      - t * t * t * t / 60_616_000
  }
  return fmod360(new Decimal(value))
}

/**
 * Mean longitude of perigee
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitudePerigee (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  let value
  if (highPrecision) {
    value = new Decimal('83.353_2465')
      .plus(new Decimal('4069.013_7287').mul(T))
      .minus(new Decimal('0.010_3200').mul(T.pow(2)))
      .minus(T.pow(3).dividedBy('80_053'))
      .plus(T.pow(4).dividedBy('18_999_000'))
  } else {
    const t = T.toNumber()
    value = 83.353_2465
      + 4069.013_7287 * t
      - 0.010_3200 * t * t
      - t * t * t / 80_053
      + t * t * t * t / 18_999_000
  }
  return fmod360(new Decimal(value))

}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 * @memberof module:Earth
 */
export function trueLongitudeOfAscendingNode (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(jd, highPrecision)

  const D = getMeanElongation(jd, highPrecision).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const Mdash = getMeanAnomaly(jd, highPrecision).degreesToRadians()
  const F = getArgumentOfLatitude(jd, highPrecision).degreesToRadians()

  // Add the principal additive terms
  let value
  if (highPrecision) {
    value = TrueAscendingNode
      .minus(new Decimal('1.4979').mul(Decimal.sin(TWO.mul(D.minus(F)))))
      .minus(new Decimal('0.1500').mul(Decimal.sin(M)))
      .minus(new Decimal('0.1226').mul(Decimal.sin(TWO.mul(D))))
      .plus(new Decimal('0.1176').mul(Decimal.sin(TWO.mul(F))))
      .minus(new Decimal('0.0801').mul(Decimal.sin(TWO.mul(Mdash.minus(F)))))
  } else {
    value = TrueAscendingNode.toNumber()
      - 1.4979 * Math.sin(2 * (D.minus(F)).toNumber())
      - 0.1500 * Math.sin(M.toNumber())
      - 0.1226 * Math.sin(2 * D.toNumber())
      + 0.1176 * Math.sin(2 * F.toNumber())
      - 0.0801 * Math.sin(2 * (Mdash.minus(F)).toNumber())
  }
  return fmod360(new Decimal(value))
}

