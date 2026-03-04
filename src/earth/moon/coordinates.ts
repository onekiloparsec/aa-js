import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianDay, Kilometer, Obliquity } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury } from '@/juliandays'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '../nutation'
import { coefficients1, coefficients2, coefficients3, coefficients4 } from './coefficients'
import { getSigma } from './reducers'
import { DEG2RAD, RAD2DEG } from '@/constants'

// ---------------------------------------------------------------------------
// Internal helper: compute T, Ldash, D, M, Mdash, F, E, A1, A2, A3 in one shot
// so that functions called together don't each independently recompute T.
// ---------------------------------------------------------------------------
function getMoonFundamentals (jd: JulianDay) {
  const T = getJulianCentury(jd)
  const Ldash = fmod360(
    218.316_447_7
    + 481_267.881_234_21 * T
    - 0.001_578_6 * T * T
    + T * T * T / 538_841
    - T * T * T * T / 65_194_000
  )
  const D = fmod360(
    297.8501921
    + 445267.1114034 * T
    - 0.0018819 * T * T
    + T * T * T / 545868
    - T * T * T * T / 113065000
  )
  const M = Sun.getMeanAnomaly(jd)
  const Mdash = fmod360(
    134.963_3964
    + 477198.867_5055 * T
    + 0.008_7414 * T * T
    + T * T * T / 69699
    - T * T * T * T / 14712000
  )
  const F = fmod360(
    93.272_0950
    + 483202.017_5233 * T
    - 0.003_6539 * T * T
    - T * T * T / 3526_000
    - T * T * T * T / 863_310_000
  )
  const E = 1 - T * 0.002_516 - T * T * 0.000_0074
  const A1 = fmod360(119.75 + 131.849 * T)
  const A2 = fmod360(53.09 + 479264.290 * T)
  const A3 = fmod360(313.45 + 481266.484 * T)
  return { T, Ldash, D, M, Mdash, F, E, A1, A2, A3 }
}

/**
 * Mean longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    218.316_447_7
    + 481_267.881_234_21 * T
    - 0.001_578_6 * T * T
    + T * T * T / 538_841
    - T * T * T * T / 65_194_000
  )
}

/**
 * Mean elongation
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanElongation (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    297.8501921
    + 445267.1114034 * T
    - 0.0018819 * T * T
    + T * T * T / 545868
    - T * T * T * T / 113065000
  )
}

/**
 * Mean anomaly
 * @param {JulianDay} jd The julian day
 * @return {Degree}
 * @memberof module:Earth
 */
export function getMeanAnomaly (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    134.963_3964
    + 477198.867_5055 * T
    + 0.008_7414 * T * T
    + T * T * T / 69699
    - T * T * T * T / 14712000
  )
}

/**
 * Argument of latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getArgumentOfLatitude (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    93.272_0950
    + 483202.017_5233 * T
    - 0.003_6539 * T * T
    - T * T * T / 3526_000
    - T * T * T * T / 863_310_000
  )
}

/**
 * Ecliptic longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLongitude (jd: JulianDay): Degree {
  const { Ldash, D, M, Mdash, F, E, A1, A2 } = getMoonFundamentals(jd)
  const LdashR = Ldash * DEG2RAD
  const DR = D * DEG2RAD
  const MR = M * DEG2RAD
  const MdashR = Mdash * DEG2RAD
  const FR = F * DEG2RAD

  let SigmaL = getSigma(E, DR, MR, MdashR, FR, coefficients1, coefficients2, 'A', 'sin')
  SigmaL += 3958 * Math.sin(A1 * DEG2RAD) + 1962 * Math.sin(LdashR - FR) + 318 * Math.sin(A2 * DEG2RAD)

  return fmod360(Ldash + SigmaL / 1000000)
}

/**
 * Ecliptic latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getGeocentricEclipticLatitude (jd: JulianDay): Degree {
  const { Ldash, D, M, Mdash, F, E, A1, A3 } = getMoonFundamentals(jd)
  const LdashR = Ldash * DEG2RAD
  const DR = D * DEG2RAD
  const MR = M * DEG2RAD
  const MdashR = Mdash * DEG2RAD
  const FR = F * DEG2RAD

  let SigmaB = getSigma(E, DR, MR, MdashR, FR, coefficients3, coefficients4, '', 'sin')
  SigmaB = SigmaB
    - 2235 * Math.sin(LdashR)
    + 382 * Math.sin(A3 * DEG2RAD)
    + 175 * Math.sin(A1 * DEG2RAD - FR)
    + 175 * Math.sin(A1 * DEG2RAD + FR)
    + 127 * Math.sin(LdashR - MdashR)
    - 115 * Math.sin(LdashR + MdashR)

  return SigmaB / 1000000
}

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Earth
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  const { Ldash, D, M, Mdash, F, E, A1, A2, A3 } = getMoonFundamentals(jd)
  const LdashR = Ldash * DEG2RAD
  const DR = D * DEG2RAD
  const MR = M * DEG2RAD
  const MdashR = Mdash * DEG2RAD
  const FR = F * DEG2RAD
  const A1R = A1 * DEG2RAD
  const A2R = A2 * DEG2RAD
  const A3R = A3 * DEG2RAD

  let SigmaL = getSigma(E, DR, MR, MdashR, FR, coefficients1, coefficients2, 'A', 'sin')
  SigmaL += 3958 * Math.sin(A1R) + 1962 * Math.sin(LdashR - FR) + 318 * Math.sin(A2R)

  let SigmaB = getSigma(E, DR, MR, MdashR, FR, coefficients3, coefficients4, '', 'sin')
  SigmaB = SigmaB
    - 2235 * Math.sin(LdashR)
    + 382 * Math.sin(A3R)
    + 175 * Math.sin(A1R - FR)
    + 175 * Math.sin(A1R + FR)
    + 127 * Math.sin(LdashR - MdashR)
    - 115 * Math.sin(LdashR + MdashR)

  return {
    longitude: fmod360(Ldash + SigmaL / 1000000),
    latitude: SigmaB / 1000000
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
  const { D, M, Mdash, F, E } = getMoonFundamentals(jd)
  const SigmaR = getSigma(E, D * DEG2RAD, M * DEG2RAD, Mdash * DEG2RAD, F * DEG2RAD, coefficients1, coefficients2, 'B', 'cos')
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
  return fmod360(
    125.044_5479
    - 1934.136_2891 * T
    + 0.002_0754 * T * T
    + T * T * T / 467_441
    - T * T * T * T / 60_616_000
  )
}

/**
 * Mean longitude of perigee
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanLongitudePerigee (jd: JulianDay): Degree {
  const T = getJulianCentury(jd)
  return fmod360(
    83.353_2465
    + 4069.013_7287 * T
    - 0.010_3200 * T * T
    - T * T * T / 80_053
    + T * T * T * T / 18_999_000
  )
}

/**
 * The true longitude of the ascending node
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function trueLongitudeOfAscendingNode (jd: JulianDay): Degree {
  const { D, M, Mdash, F } = getMoonFundamentals(jd)
  const TrueAscendingNode = getMeanLongitudeAscendingNode(jd)
  return fmod360(
    TrueAscendingNode
    - 1.4979 * Math.sin(2 * (D - F) * DEG2RAD)
    - 0.1500 * Math.sin(M * DEG2RAD)
    - 0.1226 * Math.sin(2 * D * DEG2RAD)
    + 0.1176 * Math.sin(2 * F * DEG2RAD)
    - 0.0801 * Math.sin(2 * (Mdash - F) * DEG2RAD)
  )
}
