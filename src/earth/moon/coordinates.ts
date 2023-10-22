import Decimal from 'decimal.js'
import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { DEG2RAD, RAD2DEG, TWO } from '@/constants'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { getEccentricity as getEarthEccentricity } from '@/earth/coordinates'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '@/earth/nutation'
import { gMoonCoefficients1, gMoonCoefficients2, gMoonCoefficients3, gMoonCoefficients4 } from './coefficients'

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal(218.3164477)
      .plus(new Decimal(481267.88123421).mul(T))
      .minus(new Decimal(0.0015786).mul(T.pow(2)))
      .plus(T.pow(3).dividedBy(538841))
      .minus(T.pow(4).dividedBy(65194000))
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
    new Decimal(297.8501921)
      .plus(new Decimal(445267.1114034).mul(T))
      .minus(new Decimal(0.0018819).mul(T.pow(2)))
      .plus(T.pow(3).dividedBy(545868))
      .minus(T.pow(4).dividedBy(113065000))
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
    new Decimal(134.9633964)
      .plus(new Decimal(477198.8675055).mul(T))
      .plus(new Decimal(0.0087414).mul(T.pow(2)))
      .plus(T.pow(3).dividedBy(69699))
      .minus(T.pow(4).dividedBy(14712000))
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
    new Decimal(93.2720950)
      .plus(new Decimal(483202.0175233).mul(T))
      .minus(new Decimal(0.0036539).mul(T.pow(2)))
      .minus(T.pow(3).dividedBy(3526000))
      .minus(T.pow(4).dividedBy(863310000))
  )
}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLongitude (jd: JulianDay | number): Degree {
  const Ldash = getMeanLongitude(jd).mul(DEG2RAD)
  const D = getMeanElongation(jd).mul(DEG2RAD)
  const M = Sun.getMeanAnomaly(jd).mul(DEG2RAD)
  const Mdash = getMeanAnomaly(jd).mul(DEG2RAD)
  const F = getArgumentOfLatitude(jd).mul(DEG2RAD)
  const E = getEarthEccentricity(jd)
  const T = getJulianCentury(jd)

  const A1 = fmod360(new Decimal(119.75).plus(new Decimal(131.849).mul(T))).mul(DEG2RAD)
  const A2 = fmod360(new Decimal(53.09).plus(new Decimal(479264.290).mul(T))).mul(DEG2RAD)

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

  // Finally the additive terms
  SigmaL = SigmaL
    .plus(new Decimal(3958).mul(Decimal.sin(A1)))
    .plus(new Decimal(1962).mul(Decimal.sin(Ldash.minus(F))))
    .plus(new Decimal(318).mul(Decimal.sin(A2)))

  // And finally apply the nutation in longitude
  const NutationInLong = getNutationInLongitude(jd).dividedBy(3600)

  return fmod360(Ldash.mul(RAD2DEG).plus(SigmaL.dividedBy(1000000)).plus(NutationInLong))
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getEclipticLatitude (jd: JulianDay | number): Degree {
  const Ldash = getMeanLongitude(jd).mul(DEG2RAD)
  const D = getMeanElongation(jd).mul(DEG2RAD)
  const M = Sun.getMeanAnomaly(jd).mul(DEG2RAD)
  const Mdash = getMeanAnomaly(jd).mul(DEG2RAD)
  const F = getArgumentOfLatitude(jd).mul(DEG2RAD)
  const E = getEarthEccentricity(jd)
  const T = getJulianCentury(jd)

  const A1 = fmod360(new Decimal(119.75).plus(new Decimal(131.849).mul(T))).mul(DEG2RAD)
  const A3 = fmod360(new Decimal(313.45).plus(new Decimal(481266.484).mul(T))).mul(DEG2RAD)

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

  // Finally the additive terms
  SigmaB = SigmaB
    .minus(new Decimal(2235).mul(Decimal.sin(Ldash)))
    .plus(new Decimal(382).mul(Decimal.sin(A3)))
    .plus(new Decimal(175).mul(Decimal.sin(A1.minus(F))))
    .plus(new Decimal(175).mul(Decimal.sin(A1.plus(F))))
    .plus(new Decimal(127).mul(Decimal.sin(Ldash.minus(Mdash))))
    .minus(new Decimal(115).mul(Decimal.sin(Ldash.plus(Mdash))))

  return SigmaB.dividedBy(1000000)
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getEclipticLongitude(jd),
    latitude: getEclipticLatitude(jd)
  }
}

/**
 * Radius vector (distance Earth-Moon) in kilometers!
 * @param {JulianDay} jd The julian day
 * @returns {Kilometer}
 */
export function getRadiusVector (jd: JulianDay | number): Kilometer {
  const D = getMeanElongation(jd).mul(DEG2RAD)
  const M = Sun.getMeanAnomaly(jd).mul(DEG2RAD)
  const Mdash = getMeanAnomaly(jd).mul(DEG2RAD)
  const F = getArgumentOfLatitude(jd).mul(DEG2RAD)
  const E = getEarthEccentricity(jd)

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

  return new Decimal(385000.56).plus(SigmaR.dividedBy(1000))
}

/**
 * Transforms a radius vector into horizontal parallax
 * @param {Kilometer} radiusVector The radius vector
 * @returns {Degree}
 */
export function radiusVectorToHorizontalParallax (radiusVector: Kilometer | number): Degree {
  return Decimal.asin(new Decimal(6378.14).dividedBy(radiusVector)).mul(RAD2DEG)
}

/**
 * Transforms an horizontal parallax into a radius vector
 * @param {Degree} horizontalParallax
 * @returns {Kilometer}
 */
export function horizontalParallaxToRadiusVector (horizontalParallax: Degree | number): Kilometer {
  return new Decimal(6378.14).dividedBy(Decimal.sin(new Decimal(DEG2RAD).mul(horizontalParallax)))
}

/**
 * Mean longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getMeanLongitudeAscendingNode (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    new Decimal(125.0445479)
      .minus(new Decimal(1934.1362891).mul(T))
      .plus(new Decimal(0.0020754).mul(T.pow(2)))
      .plus(T.pow(3).dividedBy(467441))
      .minus(T.pow(4).dividedBy(60616000))
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
    new Decimal(83.3532465)
      .plus(new Decimal(4069.0137287).mul(T))
      .minus(new Decimal(0.0103200).mul(T.pow(2)))
      .minus(T.pow(3).dividedBy(80053))
      .plus(T.pow(4).dividedBy(18999000))
  )
}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function trueLongitudeOfAscendingNode (jd: JulianDay | number): Degree {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(jd)

  const D = getMeanElongation(jd).mul(DEG2RAD)
  const M = Sun.getMeanAnomaly(jd).mul(DEG2RAD)
  const Mdash = getMeanAnomaly(jd).mul(DEG2RAD)
  const F = getArgumentOfLatitude(jd).mul(DEG2RAD)

  // Add the principal additive terms
  TrueAscendingNode = TrueAscendingNode
    .minus(new Decimal(1.4979).mul(Decimal.sin(TWO.mul(D.minus(F)))))
    .minus(new Decimal(0.1500).mul(Decimal.sin(M)))
    .minus(new Decimal(0.1226).mul(Decimal.sin(TWO.mul(D))))
    .plus(new Decimal(0.1176).mul(Decimal.sin(TWO.mul(F))))
    .minus(new Decimal(0.0801).mul(Decimal.sin(TWO.mul(Mdash.minus(F)))))

  return fmod360(TrueAscendingNode)
}

/**
 * Horizontal parallax
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 */
export function horizontalParallax (jd: JulianDay | number): Degree {
  return radiusVectorToHorizontalParallax(getRadiusVector(jd))
}

/**
 * Heliocentric equatorial coordinates
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getMeanObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent heliocentric equatorial coordinates (using the true obliquity of the ecliptic)
 * @see getTrueObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getApparentEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getEclipticLongitude(jd),
    getEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}
