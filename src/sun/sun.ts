/**
 @module Sun
 */
import Decimal from '@/decimal'
import { Degree, EclipticCoordinates, EquatorialCoordinates, Equinox, JulianCentury, JulianDay } from '@/types'
import { DEG2RAD } from '@/constants'
import { getJulianCentury } from '@/juliandays'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getDecimalValue } from '@/sexagesimal'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The sun mean anomaly
 */
export function getMeanAnomaly (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  // In AA++ (C++) implementation, values differ a little bit. But we prefer textbook AA values to ensure tests validity
  // In AA++ : fmod360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000)
  return fmod360(new Decimal(357.52911)
    .plus(new Decimal(35999.05029).mul(T))
    .minus(new Decimal(0.0001537).mul(T.pow(2)))
    .plus(T.pow(3).dividedBy(24490000)))
}

/**
 * Computes the Sun true anomaly
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The Sun true anomaly
 */
export function getTrueAnomaly (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  const M = getMeanAnomaly(jd)
  const C = getEquationOfTheCenter(T, M)
  return fmod360(M.plus(C))
}

/**
 * Get the Sun's Equation of the center
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {Degree} M
 * @return {Degree}
 */
export function getEquationOfTheCenter (T: JulianCentury | number, M: Degree | number): Degree {
  return (
    new Decimal(1.914602)
      .minus(new Decimal(0.004817).mul(T))
      .minus(new Decimal(0.000014).mul(T).mul(T))
  )
    .mul(Decimal.sin(new Decimal(M).degreesToRadians()))
    .plus((new Decimal(0.019993)
      .minus(new Decimal(0.000101).mul(T)))
      .mul(Decimal.sin(new Decimal(2).mul(M).degreesToRadians())))
    .plus(new Decimal(0.000289).mul(Decimal.sin(new Decimal(3).mul(M).degreesToRadians())))
}

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @return {Degree}
 */
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury | number): Degree {
  return fmod360(
    new Decimal(280.46646)
      .plus(new Decimal(36000.76983).mul(T))
      .plus(new Decimal(0.0003032).mul(new Decimal(T).pow(2)))
  )
}

/**
 * Low accuracy Geometric Ecliptic Longitude
 * The "low" accuracy (approx 0.01 degree) true geoMETRIC longitude of the
 * Sun referred to the mean equinox of the date. See AA pp 164. This
 * longitude is the quantity required in the calculation of geocentric
 * planetary position.
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getGeometricEclipticLongitude (jd: JulianDay | number): Degree {
  const T = getJulianCentury(jd)
  const L0 = getMeanLongitudeReferredToMeanEquinoxOfDate(T)
  const M = getMeanAnomaly(jd)
  const C = getEquationOfTheCenter(T, M)
  return fmod360(L0.plus(C))
}

// --- high accuracy geocentric longitude and latitude of the Sun. See AA pp 166.

/**
 * Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getGeocentricEclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return fmod360(Earth.getEclipticLongitude(jd, equinox).plus(180))
}

/**
 * Geometric Ecliptic Latitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree}
 */
export function getGeocentricEclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return new Decimal(-1).mul(Earth.getEclipticLatitude(jd, equinox))
}

// --- Conversion from high-accuracy geocentric coordinates of the Sun to the FK5 system. See AA p 166

// See AA+ CAASun::GeometricFK5EclipticLongitude
export function getGeometricFK5EclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  // Convert to the FK5 system
  let Longitude = getGeocentricEclipticLongitude(jd, equinox)
  const Latitude = getGeocentricEclipticLatitude(jd, equinox)
  Longitude = Longitude.plus(getCorrectionInLongitude(Longitude, Latitude, jd))
  return Longitude
}

// See AA+ CAASun::GeometricFK5EclipticLatitude
export function getGeometricFK5EclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  // Convert to the FK5 system
  const Longitude = getGeocentricEclipticLongitude(jd, equinox)
  let Latitude = getGeocentricEclipticLatitude(jd, equinox)
  Latitude = Latitude.plus(getCorrectionInLatitude(jd, Longitude))
  return Latitude
}

// ---|

/**
 * Geocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns EclipticCoordinates
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd, equinox),
    latitude: getGeocentricEclipticLatitude(jd, equinox)
  }
}

/**
 * Geocentric equatorial coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns EquatorialCoordinates
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticLongitude(jd, equinox),
    getGeocentricEclipticLatitude(jd, equinox),
    Earth.getMeanObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent Ecliptic Longitude, that is, the geometric longitude of the Sun referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * See AA+ CAASun::ApparentEclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLongitude (jd: JulianDay | number): Degree {
  let Longitude = getGeometricFK5EclipticLongitude(jd)

  // Apply the correction in longitude due to nutation
  Longitude = Longitude.plus(getDecimalValue(0, 0, Earth.getNutationInLongitude(jd)))

  // Apply the correction in longitude due to aberration. See AA p. 167 for an even higher accuracy.
  const R = Earth.getRadiusVector(jd)
  Longitude = Longitude.minus(getDecimalValue(0, 0, new Decimal(20.4898).dividedBy(R)))

  return Longitude
}

/**
 * Apparent Ecliptic Latitude, that is, the geometric latitude of the Sun referred to the mean equinox of the date.
 * See AA+ CAASun::ApparentEclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLatitude (jd: JulianDay | number): Degree {
  return getGeometricFK5EclipticLatitude(jd)
}

/**
 * Apparent Ecliptic Coordinates, that is the geometric ecliptic coordinates, referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getApparentGeocentricEclipticLongitude(jd),
    latitude: getApparentGeocentricEclipticLatitude(jd)
  }
}

/**
 * Variation of the Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
export function getVariationGeometricEclipticLongitude (jd: JulianDay | number): Degree {
  // D is the number of days since the epoch
  const D = new Decimal(jd).minus(2451545.00)
  const tau = D.dividedBy(365250)
  const deg2rad = new Decimal(DEG2RAD)

  return new Decimal(3548.193)
    .plus(new Decimal(118.568).mul(Decimal.sin(deg2rad.mul(new Decimal(87.5287).plus(new Decimal(359993.7286).mul(tau))))))
    .plus(new Decimal(2.476).mul(Decimal.sin(deg2rad.mul(new Decimal(85.0561).plus(new Decimal(719987.4571).mul(tau))))))
    .plus(new Decimal(1.376).mul(Decimal.sin(deg2rad.mul(new Decimal(27.8502).plus(new Decimal(4452671.1152).mul(tau))))))
    .plus(new Decimal(0.119).mul(Decimal.sin(deg2rad.mul(new Decimal(73.1375).plus(new Decimal(450368.8564).mul(tau))))))
    .plus(new Decimal(0.114).mul(Decimal.sin(deg2rad.mul(new Decimal(337.2264).plus(new Decimal(329644.6718).mul(tau))))))
    .plus(new Decimal(0.086).mul(Decimal.sin(deg2rad.mul(new Decimal(222.5400).plus(new Decimal(659289.3436).mul(tau))))))
    .plus(new Decimal(0.078).mul(Decimal.sin(deg2rad.mul(new Decimal(162.8136).plus(new Decimal(9224659.7915).mul(tau))))))
    .plus(new Decimal(0.054).mul(Decimal.sin(deg2rad.mul(new Decimal(82.5823).plus(new Decimal(1079981.1857).mul(tau))))))
    .plus(new Decimal(0.052).mul(Decimal.sin(deg2rad.mul(new Decimal(171.5189).plus(new Decimal(225184.4282).mul(tau))))))
    .plus(new Decimal(0.034).mul(Decimal.sin(deg2rad.mul(new Decimal(30.3214).plus(new Decimal(4092677.3866).mul(tau))))))
    .plus(new Decimal(0.033).mul(Decimal.sin(deg2rad.mul(new Decimal(119.8105).plus(new Decimal(337181.4711).mul(tau))))))
    .plus(new Decimal(0.023).mul(Decimal.sin(deg2rad.mul(new Decimal(247.5418).plus(new Decimal(299295.6151).mul(tau))))))
    .plus(new Decimal(0.023).mul(Decimal.sin(deg2rad.mul(new Decimal(325.1526).plus(new Decimal(315559.5560).mul(tau))))))
    .plus(new Decimal(0.021).mul(Decimal.sin(deg2rad.mul(new Decimal(155.1241).plus(new Decimal(675553.2846).mul(tau))))))
    .plus(new Decimal(7.311).mul(tau).mul(Decimal.sin(deg2rad.mul(new Decimal(333.4515).plus(new Decimal(359993.7286).mul(tau))))))
    .plus(new Decimal(0.305).mul(tau).mul(Decimal.sin(deg2rad.mul(new Decimal(330.9814).plus(new Decimal(719987.4571).mul(tau))))))
    .plus(new Decimal(0.010).mul(tau).mul(Decimal.sin(deg2rad.mul(new Decimal(328.5170).plus(new Decimal(1079981.1857).mul(tau))))))
    .plus(new Decimal(0.309).mul(tau.pow(2)).mul(Decimal.sin(deg2rad.mul(new Decimal(241.4518).plus(new Decimal(359993.7286).mul(tau))))))
    .plus(new Decimal(0.021).mul(tau.pow(2)).mul(Decimal.sin(deg2rad.mul(new Decimal(205.0482).plus(new Decimal(719987.4571).mul(tau))))))
    .plus(new Decimal(0.004).mul(tau.pow(2)).mul(Decimal.sin(deg2rad.mul(new Decimal(297.8610).plus(new Decimal(4452671.1152).mul(tau))))))
    .plus(new Decimal(0.010).mul(tau.pow(3)).mul(Decimal.sin(deg2rad.mul(new Decimal(154.7066).plus(new Decimal(359993.7286).mul(tau))))))
}

