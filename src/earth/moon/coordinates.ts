import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '../nutation'
import { getCoefficients1, getCoefficients2, getCoefficients3, getCoefficients4 } from './coefficients'
import { getSigma } from './reducers'
import { DEG2RAD, RAD2DEG } from '@/constants'

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 218.3164477
    + 481267.88123421 * T
    - 0.0015786 * T * T
    + T * T * T / 538841
    - T * T * T * T / 65194000
  
  return fmod360(value)
}

/**
 * Mean elongation
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanElongation (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 297.8501921
    + 445267.1114034 * T
    - 0.0018819 * T * T
    + T * T * T / 545868
    - T * T * T * T / 113065000
  
  return fmod360(value)
}

/**
 * Mean anomaly
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Earth
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 134.963_3964
    + 477198.867_5055 * T
    + 0.008_7414 * T * T
    + T * T * T / 69699
    - T * T * T * T / 14712000
  
  return fmod360(value)
}

/**
 * Argument of latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getArgumentOfLatitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 93.272_0950
    + 483202.017_5233 * T
    - 0.003_6539 * T * T
    - T * T * T / 3526_000
    - T * T * T * T / 863_310_000
  
  return fmod360(value)
}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLongitude (jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = Sun.getMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  
  const T = getJulianCentury(jd)
  const E = 1 - T * 0.002_516 - T * T * 0.000_0074
  
  const A1 = fmod360(119.75 + 131.849 * T) * DEG2RAD
  const A2 = fmod360(53.09 + 479264.290 * T) * DEG2RAD
  
  let SigmaL = getSigma(E, D, M, Mdash, F, getCoefficients1, getCoefficients2, 'A', 'sin')
  SigmaL += 3958 * Math.sin(A1) + 1962 * Math.sin(Ldash - F) + 318 * Math.sin(A2)
  
  return fmod360(Ldash * RAD2DEG + SigmaL / 1000000)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLatitude (jd: JulianDay): Degree {
  const Ldash = getMeanLongitude(jd) * DEG2RAD
  const D = getMeanElongation(jd) * DEG2RAD
  const M = Sun.getMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  
  const T = getJulianCentury(jd)
  const E = 1 - T * 0.002_516 - T * T * 0.000_0074
  
  const A1 = fmod360(119.75 + 131.849 * T) * DEG2RAD
  const A3 = fmod360(313.45 + 481266.484 * T) * DEG2RAD
  
  let SigmaB = getSigma(E, D, M, Mdash, F, getCoefficients3, getCoefficients4, '', 'sin')

  SigmaB = SigmaB
    - 2235 * Math.sin(Ldash)
    + 382 * Math.sin(A3)
    + 175 * Math.sin(A1 - F)
    + 175 * Math.sin(A1 + F)
    + 127 * Math.sin(Ldash - Mdash)
    - 115 * Math.sin(Ldash + Mdash)
  
  return SigmaB / 1000000
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Earth
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
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
 * @memberof module:Earth
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? getMeanObliquityOfEcliptic(jd) : getTrueObliquityOfEcliptic(jd),
  )
}

/**
 * Apparent geocentric equatorial coordinates, that is corrected for nutation
 * @see getApparentEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 * @memberof module:Earth
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  const ecliptic = getGeocentricEclipticCoordinates(jd)
  ecliptic.longitude = ecliptic.longitude + getNutationInLongitude(jd) / 3600
  return transformEclipticToEquatorial(ecliptic, getTrueObliquityOfEcliptic(jd))
}


/**
 * Radius vector (distance Earth-Moon) in kilometers!
 * @param {JulianDay} jd The julian day
 * @returns {Kilometer}
 * @memberof module:Earth
 */
export function getRadiusVectorInKilometer (jd: JulianDay): Kilometer {
  const D = getMeanElongation(jd) * DEG2RAD
  const M = Sun.getMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  
  const T = getJulianCentury(jd)
  const E = 1 - T * 0.002_516 - T * T * 0.000_0074
  const SigmaR = getSigma(E, D, M, Mdash, F, getCoefficients1, getCoefficients2, 'B', 'cos')

  return 385000.56 + SigmaR / 1000
}


/**
 * Horizontal parallax
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Earth
 */
export function horizontalParallax (jd: JulianDay): Degree {
  return radiusVectorToHorizontalParallax(getRadiusVectorInKilometer(jd))
}

/**
 * Transforms a radius vector into horizontal parallax
 * @param {Kilometer} radiusVector The radius vector
 * @returns {Degree}
 * @memberof module:Earth
 */
export function radiusVectorToHorizontalParallax (radiusVector: Kilometer): Degree {
  return Math.asin(6378.14 / radiusVector) * RAD2DEG
}

/**
 * Transforms a horizontal parallax into a radius vector
 * @param {Degree} horizontalParallax
 * @returns {Kilometer}
 * @memberof module:Earth
 */
export function horizontalParallaxToRadiusVector (horizontalParallax: Degree): Kilometer {
  const hp = horizontalParallax * DEG2RAD
  return 6378.14 / Math.sin(hp)
}

/**
 * Mean longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitudeAscendingNode (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 125.044_5479
    - 1934.136_2891 * T
    + 0.002_0754 * T * T
    + T * T * T / 467_441
    - T * T * T * T / 60_616_000
  
  return fmod360(value)
}

/**
 * Mean longitude of perigee
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitudePerigee (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  
  const value = 83.353_2465
    + 4069.013_7287 * T
    - 0.010_3200 * T * T
    - T * T * T / 80_053
    + T * T * T * T / 18_999_000
  
  return fmod360(value)
}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function trueLongitudeOfAscendingNode (jd: JulianDay): Degree {
  let TrueAscendingNode = getMeanLongitudeAscendingNode(jd)
  
  const D = getMeanElongation(jd) * DEG2RAD
  const M = Sun.getMeanAnomaly(jd) * DEG2RAD
  const Mdash = getMeanAnomaly(jd) * DEG2RAD
  const F = getArgumentOfLatitude(jd) * DEG2RAD
  
  // Add the principal additive terms
  const value = TrueAscendingNode
    - 1.4979 * Math.sin(2 * (D - F))
    - 0.1500 * Math.sin(M)
    - 0.1226 * Math.sin(2 * D)
    + 0.1176 * Math.sin(2 * F)
    - 0.0801 * Math.sin(2 * (Mdash - F))
  
  return fmod360(value)
}

