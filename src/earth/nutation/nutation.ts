import { ArcSecond, Degree, JulianDay } from '@/types'
import { getDecimalValue } from '@/sexagesimal'
import { getJulianCentury } from '@/juliandays'
import { fmod360 } from '@/utils'
import { Sun } from '@/sun'
import { getReducedValue } from './reducers'

// ---------------------------------------------------------------------------
// Internal helper: compute T + all five nutation arguments in one shot,
// avoiding 6× redundant getJulianCentury calls per nutation evaluation.
// ---------------------------------------------------------------------------
function getNutationFundamentals (jd: JulianDay) {
  const T = getJulianCentury(jd)
  // Moon mean elongation (same formula as Moon.getMeanElongation)
  const D = fmod360(
    297.8501921
    + 445267.1114034 * T
    - 0.0018819 * T * T
    + T * T * T / 545868
    - T * T * T * T / 113065000
  )
  // Sun mean anomaly (same formula as Sun.getMeanAnomaly)
  const M = fmod360(
    357.529_11
    + 35999.050_29 * T
    - 0.0001537 * T * T
    + T * T * T / 24_490_000
  )
  // Moon mean anomaly (same formula as Moon.getMeanAnomaly)
  const Mprime = fmod360(
    134.963_3964
    + 477198.867_5055 * T
    + 0.008_7414 * T * T
    + T * T * T / 69699
    - T * T * T * T / 14712000
  )
  // Moon argument of latitude (same formula as Moon.getArgumentOfLatitude)
  const F = fmod360(
    93.272_0950
    + 483202.017_5233 * T
    - 0.003_6539 * T * T
    - T * T * T / 3526_000
    - T * T * T * T / 863_310_000
  )
  // Moon mean longitude of ascending node (same formula as Moon.getMeanLongitudeAscendingNode)
  const omega = fmod360(
    125.044_5479
    - 1934.136_2891 * T
    + 0.002_0754 * T * T
    + T * T * T / 467_441
    - T * T * T * T / 60_616_000
  )
  return { T, D, M, Mprime, F, omega }
}

/**
 * Nutation in longitude
 * @param {JulianDay} jd The julian day
 * @return {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInLongitude (jd: JulianDay): ArcSecond {
  const { T, D, M, Mprime, F, omega } = getNutationFundamentals(jd)
  return getReducedValue(T, D, M, Mprime, F, omega, 'sin')
}

/**
 * Nutation in obliquity
 * @param {JulianDay} jd The julian day
 * @returns {ArcSecond}
 * @memberof module:Earth
 */
export function getNutationInObliquity (jd: JulianDay): ArcSecond {
  const { T, D, M, Mprime, F, omega } = getNutationFundamentals(jd)
  return getReducedValue(T, D, M, Mprime, F, omega, 'cos')
}

/**
 * Mean obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The mean obliquity is NOT corrected for aberration and nutation of
 * the Earth.
 * @see getTrueObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getMeanObliquityOfEcliptic (jd: JulianDay): Degree {
  const U = (jd - 2451545) / 3652500
  const U2 = U * U
  const U3 = U2 * U
  const U4 = U3 * U
  const U5 = U4 * U
  const U6 = U5 * U
  const U7 = U6 * U
  const U8 = U7 * U
  const U9 = U8 * U
  const U10 = U9 * U
  return getDecimalValue(23, 26, 21.448)
    - getDecimalValue(0, 0, 4680.93) * U
    - getDecimalValue(0, 0, 1.55) * U2
    + getDecimalValue(0, 0, 1999.25) * U3
    - getDecimalValue(0, 0, 51.38) * U4
    - getDecimalValue(0, 0, 249.67) * U5
    - getDecimalValue(0, 0, 39.05) * U6
    + getDecimalValue(0, 0, 7.12) * U7
    + getDecimalValue(0, 0, 27.87) * U8
    + getDecimalValue(0, 0, 5.79) * U9
    + getDecimalValue(0, 0, 2.45) * U10
}

/**
 * True obliquity of the ecliptic.
 * The obliquity of the angle between the ecliptic (the plane of Earth orbit)
 * and the celestial equator (the project of Earth equator onto the spherical
 * sphere). The true obliquity is equal to the mean obliquity corrected by
 * aberration and nutation of the Earth.
 * @see getMeanObliquityOfEcliptic
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 * @memberof module:Earth
 */
export function getTrueObliquityOfEcliptic (jd: JulianDay): Degree {
  return getMeanObliquityOfEcliptic(jd) + getNutationInObliquity(jd) / 3600
}
