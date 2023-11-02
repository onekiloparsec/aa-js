import Decimal from '@/decimal'
import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer, Obliquity } from '@/types'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '@/earth/nutation'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { DEG2RAD, ONE, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { gMoonCoefficients1, gMoonCoefficients2, gMoonCoefficients3, gMoonCoefficients4 } from './coefficients'

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('218.3164477')
      .plus(new Decimal('481267.88123421').mul(T))
      .minus(new Decimal('0.0015786').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('538841'))
      .minus(T.pow(4).dividedBy('65194000'))
  )
}

/**
 * Mean elongation
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanElongation (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('297.8501921')
      .plus(new Decimal('445267.1114034').mul(T))
      .minus(new Decimal('0.0018819').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('545868'))
      .minus(T.pow(4).dividedBy('113065000'))
  )
}

/**
 * Mean anomaly
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function getMeanAnomaly (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('134.963_3964')
      .plus(new Decimal('477198.867_5055').mul(T))
      .plus(new Decimal('0.008_7414').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('69699'))
      .minus(T.pow(4).dividedBy('14712000'))
  )
}

/**
 * Argument of latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getArgumentOfLatitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('93.272_0950')
      .plus(new Decimal('483202.017_5233').mul(T))
      .minus(new Decimal('0.003_6539').mul(T.pow(2)))
      .minus(T.pow(3).dividedBy('3526000'))
      .minus(T.pow(4).dividedBy('863310000'))
  )
}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getGeocentricEclipticLongitude (jd: JulianDay | number): Degree {
  const Ldash = getMeanLongitude(jd).degreesToRadians()
  const D = getMeanElongation(jd).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd).degreesToRadians()
  const Mdash = getMeanAnomaly(jd).degreesToRadians()
  const F = getArgumentOfLatitude(jd).degreesToRadians()

  const T = getJulianCentury(jd)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  let SigmaL = gMoonCoefficients1.reduce((sum, val, index) => {
    const argument = val.D.mul(D)
      .plus(val.M.mul(M))
      .plus(val.Mdash.mul(Mdash))
      .plus(val.F.mul(F))
    const modulator = (val.M.abs().toNumber() === 1) ? E :
      (val.M.abs().toNumber() === 2) ? E.pow(2)
        : 1
    // SigmaL values = "A" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
    return sum.plus(gMoonCoefficients2[index].A.mul(modulator).mul(Decimal.sin(argument)))
  }, new Decimal(0))

  const A1 = fmod360(new Decimal('119.75').plus(new Decimal('131.849').mul(T))).degreesToRadians()
  const A2 = fmod360(new Decimal('53.09').plus(new Decimal('479264.290').mul(T))).degreesToRadians()

  // Finally the additive terms
  SigmaL = SigmaL
    .plus(new Decimal('3958').mul(Decimal.sin(A1)))
    .plus(new Decimal('1962').mul(Decimal.sin(Ldash.minus(F))))
    .plus(new Decimal('318').mul(Decimal.sin(A2)))

  return fmod360(Ldash.radiansToDegrees().plus(SigmaL.dividedBy('1000000')))
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getGeocentricEclipticLatitude (jd: JulianDay | number): Degree {
  const Ldash = getMeanLongitude(jd).degreesToRadians()
  const D = getMeanElongation(jd).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd).degreesToRadians()
  const Mdash = getMeanAnomaly(jd).degreesToRadians()
  const F = getArgumentOfLatitude(jd).degreesToRadians()

  const T = getJulianCentury(jd)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  let SigmaB = gMoonCoefficients3.reduce((sum, val, index) => {
    const argument = val.D.mul(D)
      .plus(val.M.mul(M))
      .plus(val.Mdash.mul(Mdash))
      .plus(val.F.mul(F))
    const modulator = (val.M.abs().toNumber() === 1) ? E :
      (val.M.abs().toNumber() === 2) ? E.pow(2)
        : 1
    // SigmaB values = unique column of "4" coefficient array: gMoonCoefficients4. See AA p.338 & 339
    return sum.plus(gMoonCoefficients4[index].mul(modulator).mul(Decimal.sin(argument)))
  }, new Decimal(0))

  const A1 = fmod360(new Decimal('119.75').plus(new Decimal('131.849').mul(T))).degreesToRadians()
  const A3 = fmod360(new Decimal('313.45').plus(new Decimal('481266.484').mul(T))).degreesToRadians()

  // Finally the additive terms
  SigmaB = SigmaB
    .minus(new Decimal('2235').mul(Decimal.sin(Ldash)))
    .plus(new Decimal('382').mul(Decimal.sin(A3)))
    .plus(new Decimal('175').mul(Decimal.sin(A1.minus(F))))
    .plus(new Decimal('175').mul(Decimal.sin(A1.plus(F))))
    .plus(new Decimal('127').mul(Decimal.sin(Ldash.minus(Mdash))))
    .minus(new Decimal('115').mul(Decimal.sin(Ldash.plus(Mdash))))

  return SigmaB.dividedBy('1000000')
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd),
    latitude: getGeocentricEclipticLatitude(jd)
  }
}

/**
 * Geocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @returns {EquatorialCoordinates}
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticLongitude(jd),
    getGeocentricEclipticLatitude(jd),
    (obliquity === Obliquity.Mean) ? getMeanObliquityOfEcliptic(jd) : getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent geocentric equatorial coordinates, that is corrected for nutation
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticLongitude(jd).plus(getNutationInLongitude(jd).dividedBy(3600)),
    getGeocentricEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}


/**
 * Radius vector (distance Earth-Moon) in kilometers!
 * @param {JulianDay} jd The julian day
 * @returns {Kilometer}
 */
export function getRadiusVectorInKilometer (jd: JulianDay | number): Kilometer {
  const D = getMeanElongation(jd).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd).degreesToRadians()
  const Mdash = getMeanAnomaly(jd).degreesToRadians()
  const F = getArgumentOfLatitude(jd).degreesToRadians()

  const T = getJulianCentury(jd)
  const E = ONE.minus(T.mul('0.002_516')).minus(T.pow(2).mul('0.000_0074'))

  const SigmaR = gMoonCoefficients1.reduce((sum, val, index) => {
    const argument = val.D.mul(D)
      .plus(val.M.mul(M))
      .plus(val.Mdash.mul(Mdash))
      .plus(val.F.mul(F))
    const modulator = (val.M.abs().toNumber() === 1) ? E :
      (val.M.abs().toNumber() === 2) ? E.pow(2)
        : 1
    // SigmaR values = "B" column of "2" coefficient array: gMoonCoefficients2. See AA p.338 & 339
    return sum.plus(gMoonCoefficients2[index].B.mul(modulator).mul(Decimal.cos(argument)))
  }, new Decimal(0))

  return new Decimal('385000.56').plus(SigmaR.dividedBy('1000'))
}


/**
 * Horizontal parallax
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function horizontalParallax (jd: JulianDay | number): Degree {
  return radiusVectorToHorizontalParallax(getRadiusVectorInKilometer(jd))
}

/**
 * Transforms a radius vector into horizontal parallax
 * @param {Kilometer} radiusVector The radius vector
 * @returns {Degree}
 */
export function radiusVectorToHorizontalParallax (radiusVector: Kilometer | number): Degree {
  return Decimal.asin(new Decimal('6378.14').dividedBy(radiusVector)).radiansToDegrees()
}

/**
 * Transforms an horizontal parallax into a radius vector
 * @param {Degree} horizontalParallax
 * @returns {Kilometer}
 */
export function horizontalParallaxToRadiusVector (horizontalParallax: Degree | number): Kilometer {
  return new Decimal('6378.14').dividedBy(Decimal.sin(new Decimal(DEG2RAD).mul(horizontalParallax)))
}

/**
 * Mean longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitudeAscendingNode (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('125.044_5479')
      .minus(new Decimal('1934.136_2891').mul(T))
      .plus(new Decimal('0.002_0754').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('467441'))
      .minus(T.pow(4).dividedBy('60616000'))
  )
}

/**
 * Mean longitude of perigee
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitudePerigee (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal('83.353_2465')
      .plus(new Decimal('4069.013_7287').mul(T))
      .minus(new Decimal('0.010_3200').mul(T.pow(2)))
      .minus(T.pow(3).dividedBy('80053'))
      .plus(T.pow(4).dividedBy('18999000'))
  )
}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function trueLongitudeOfAscendingNode (jd: JulianDay | number): Degree {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(jd)

  const D = getMeanElongation(jd).degreesToRadians()
  const M = Sun.getMeanAnomaly(jd).degreesToRadians()
  const Mdash = getMeanAnomaly(jd).degreesToRadians()
  const F = getArgumentOfLatitude(jd).degreesToRadians()

  // Add the principal additive terms
  TrueAscendingNode = TrueAscendingNode
    .minus(new Decimal('1.4979').mul(Decimal.sin(TWO.mul(D.minus(F)))))
    .minus(new Decimal('0.1500').mul(Decimal.sin(M)))
    .minus(new Decimal('0.1226').mul(Decimal.sin(TWO.mul(D))))
    .plus(new Decimal('0.1176').mul(Decimal.sin(TWO.mul(F))))
    .minus(new Decimal('0.0801').mul(Decimal.sin(TWO.mul(Mdash.minus(F)))))

  return fmod360(TrueAscendingNode)
}

