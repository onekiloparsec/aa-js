/**
 @module Sun
 */
import Decimal from 'decimal.js'
import { Degree, EclipticCoordinates, EquatorialCoordinates, JulianCentury, JulianDay } from '@/types'
import { DEG2RAD } from '@/constants'
import { getJulianCentury } from '@/juliandays'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getMeanObliquityOfEcliptic, getNutationInLongitude, getTrueObliquityOfEcliptic } from '@/nutation'
import { getDecimalValue } from '@/sexagesimal'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The sun mean anomaly
 */
function getMeanAnomaly (jd: JulianDay | number): Degree {
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
function getTrueAnomaly (jd: JulianDay | number): Degree {
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
function getEquationOfTheCenter (T: JulianCentury | number, M: Degree | number): Degree {
  return (
    new Decimal(1.914602)
      .minus(new Decimal(0.004817).mul(T))
      .minus(new Decimal(0.000014).mul(T).mul(T))
  )
    .mul(Decimal.sin(new Decimal(M).mul(DEG2RAD)))
    .plus((new Decimal(0.019993)
      .minus(new Decimal(0.000101).mul(T)))
      .mul(Decimal.sin(new Decimal(2).mul(M).mul(DEG2RAD))))
    .plus(new Decimal(0.000289).mul(Decimal.sin(new Decimal(3).mul(M).mul(DEG2RAD))))
}

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @return {Degree}
 */
function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury | number): Degree {
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
function getGeometricEclipticLongitude (jd: JulianDay | number): Degree {
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
 * @returns {Degree}
 */
function getGeocentricEclipticLongitude (jd: JulianDay | number): Degree {
  return fmod360(Earth.getEclipticLongitude(jd).plus(180))
}

/**
 * Geometric Ecliptic Latitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getGeocentricEclipticLatitude (jd: JulianDay | number): Degree {
  return new Decimal(-1).mul(Earth.getEclipticLatitude(jd))
}

/**
 * Geometric Ecliptic Longitude at the standard epoch J2000
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getGeocentricEclipticLongitudeJ2000 (jd: JulianDay | number): Degree {
  return fmod360(Earth.getEclipticLongitudeJ2000(jd).plus(180))
}

/**
 * Geometric Ecliptic Latitude at the standard epoch J2000
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getGeocentricEclipticLatitudeJ2000 (jd: JulianDay | number): Degree {
  return new Decimal(-1).mul(Earth.getEclipticLatitudeJ2000(jd))
}

// --- Conversion from high-accuracy geocentric coordinates of the Sun to the FK5 system. See AA p 166

// See AA+ CAASun::GeometricFK5EclipticLongitude
function getGeometricFK5EclipticLongitude (jd: JulianDay | number): Degree {
  // Convert to the FK5 system
  let Longitude = getGeocentricEclipticLongitude(jd)
  const Latitude = getGeocentricEclipticLatitude(jd)
  Longitude = Longitude.plus(getCorrectionInLongitude(Longitude, Latitude, jd))
  return Longitude
}

// See AA+ CAASun::GeometricFK5EclipticLatitude
function getGeometricFK5EclipticLatitude (jd: JulianDay | number): Degree {
  // Convert to the FK5 system
  const Longitude = getGeocentricEclipticLongitude(jd)
  let Latitude = getGeocentricEclipticLatitude(jd)
  Latitude = Latitude.plus(getCorrectionInLatitude(jd, Longitude))
  return Latitude
}

// ---|

/**
 * Apparent Ecliptic Longitude
 * See AA+ CAASun::ApparentEclipticLongitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getApparentEclipticLongitude (jd: JulianDay | number): Degree {
  let Longitude = getGeometricFK5EclipticLongitude(jd)

  // Apply the correction in longitude due to nutation
  Longitude = Longitude.plus(getDecimalValue(0, 0, getNutationInLongitude(jd)))

  // Apply the correction in longitude due to aberration
  const R = Earth.getRadiusVector(jd)
  Longitude = Longitude.minus(getDecimalValue(0, 0, new Decimal(20.4898).dividedBy(R)))

  return Longitude
}

/**
 * Apparent Ecliptic Latitude
 * See AA+ CAASun::ApparentEclipticLatitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getApparentEclipticLatitude (jd: JulianDay | number): Degree {
  return getGeometricFK5EclipticLatitude(jd)
}

/**
 * Apparent Ecliptic Coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 */
function getApparentEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getApparentEclipticLongitude(jd),
    latitude: getApparentEclipticLatitude(jd)
  }
}

/**
 * Apparent Equatorial Coordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
function getApparentEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentEclipticLongitude(jd),
    getApparentEclipticLatitude(jd),
    getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Variation of the Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @returns {Degree}
 */
function getVariationGeometricEclipticLongitude (jd: JulianDay | number): Degree {
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

/**
 * Ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @returns EclipticCoordinates
 */
function getEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd),
    latitude: getGeocentricEclipticLatitude(jd)
  }
}

/**
 * Ecliptic coordinates at the standard epoch J2000
 * @param {JulianDay} jd The julian day
 * @returns EclipticCoordinates
 */
function getEclipticCoordinatesJ2000 (jd: JulianDay | number): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitudeJ2000(jd),
    latitude: getGeocentricEclipticLatitudeJ2000(jd)
  }
}

/**
 * Equatorial coordinates
 * @param {JulianDay} jd The julian day
 * @returns EquatorialCoordinates
 */
function getEquatorialCoordinates (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticLongitude(jd),
    getGeocentricEclipticLatitude(jd),
    getMeanObliquityOfEcliptic(jd)
  )
}

/**
 * Equatorial coordinates at the standard epoch J2000
 * @param {JulianDay} jd The julian day
 * @returns EquatorialCoordinates
 */
function getEquatorialCoordinatesJ2000 (jd: JulianDay | number): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticLongitudeJ2000(jd),
    getGeocentricEclipticLatitudeJ2000(jd),
    getMeanObliquityOfEcliptic(jd)
  )
}

export const Sun = {
  getMeanAnomaly,
  getTrueAnomaly,
  getEquationOfTheCenter,
  getMeanLongitudeReferredToMeanEquinoxOfDate,
  getGeometricEclipticLongitude,
  getGeocentricEclipticLongitude,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticLongitudeJ2000,
  getGeocentricEclipticLatitudeJ2000,
  getGeometricFK5EclipticLongitude,
  getGeometricFK5EclipticLatitude,
  getApparentEclipticLongitude,
  getApparentEclipticLatitude,
  getApparentEclipticCoordinates,
  getApparentEquatorialCoordinates,
  getVariationGeometricEclipticLongitude,
  getEclipticCoordinates,
  getEclipticCoordinatesJ2000,
  getEquatorialCoordinates,
  getEquatorialCoordinatesJ2000
}

//
// {
//    let x = 0
//   let y = 0
//   let z = 0
//
//   if (!isSun) {
//     let Lrad = DEG2RAD * L
//     let Brad = DEG2RAD * B
//     let cosB = cos(Brad)
//     let cosL = cos(Lrad)
//
//     x = R * cosB * cosL - R0 * cosB0 * cos(L0)
//     y = R * cosB * sin(Lrad) - R0 * cosB0 * sin(L0)
//     z = R * sin(Brad) - R0 * sin(B0)
//   } else {
//     x = -R0 * cosB0 * cos(L0)
//     y = -R0 * cosB0 * sin(L0)
//     z = -R0 * sin(B0)
//   }
//
// }
