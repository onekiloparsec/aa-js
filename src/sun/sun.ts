/**
 @module Sun
 */
import Decimal from '@/decimal'
import {
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  Equinox,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  JulianCentury,
  JulianDay,
  RiseTransitSet
} from '@/types'
import { getCorrectionInLatitude, getCorrectionInLongitude, transformEclipticToEquatorial } from '@/coordinates'
import { getJulianCentury, getJulianDayMidnightDynamicalTime } from '@/juliandays'
import { getDecimalValue } from '@/sexagesimal'
import { DEG2RAD, STANDARD_ALTITUDE_SUN } from '@/constants'
import { getRiseTransitSetTimes } from '@/risetransitset'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'

/**
 * Computes the Sun mean anomaly which is equal to the mean anomaly of the Earth.
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The sun mean anomaly
 */
export function getMeanAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  // In AA++ (C++) implementation, values differ a little bit. But we prefer textbook AA values to ensure tests validity
  // In AA++ : fmod360(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000)
  let value
  if (highPrecision) {
    value = new Decimal('357.529_11')
      .plus(new Decimal('35999.050_29').mul(T))
      .minus(new Decimal('0.000_1537').mul(T.pow(2)))
      .plus(T.pow(3).dividedBy('24_490_000'))
  } else {
    const t = T.toNumber()
    value = 357.529_11
      + 35999.050_29 * t
      - 0.0001537 * t * t
      + t * t * t / 24_490_000
  }
  return fmod360(value)
}

/**
 * Computes the Sun true anomaly
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The Sun true anomaly
 */
export function getTrueAnomaly (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  const M = getMeanAnomaly(jd, highPrecision)
  const C = getEquationOfTheCenter(T, M, highPrecision)
  return fmod360(M.plus(C))
}

/**
 * Get the Sun's Equation of the center
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {Degree} M
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getEquationOfTheCenter (T: JulianCentury | number, M: Degree | number, highPrecision: boolean = true): Degree {
  if (highPrecision) {
    return (
      new Decimal(1.914_602)
        .minus(new Decimal(0.004_817).mul(T))
        .minus(new Decimal(0.000_014).mul(T).mul(T))
    )
      .mul(Decimal.sin(new Decimal(M).degreesToRadians()))
      .plus((new Decimal(0.019_993)
        .minus(new Decimal(0.000_101).mul(T)))
        .mul(Decimal.sin(new Decimal(2).mul(M).degreesToRadians())))
      .plus(new Decimal(0.000_289)
        .mul(Decimal.sin(new Decimal(3).mul(M).degreesToRadians())))
  } else {
    const t: number = Decimal.isDecimal(T) ? T.toNumber() : T
    const m: number = Decimal.isDecimal(M) ? M.toNumber() : M
    const value = (
        1.914_602
        - 0.004_817 * t
        - 0.000_014 * t * t
      )
      * Math.sin(m * DEG2RAD.toNumber())
      + ((0.019_993
          - 0.000_101 * t)
        * Math.sin(2 * m * DEG2RAD.toNumber())
      )
      + (0.000_289
        * Math.sin(3 * m * DEG2RAD.toNumber()))
    return new Decimal(value)
  }
}

/**
 * Mean Longitude referred to the Mean Equinox of the Date
 * See AA p 164
 * @param {JulianCentury} T The julian century
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getMeanLongitudeReferredToMeanEquinoxOfDate (T: JulianCentury | number, highPrecision: boolean = true): Degree {
  let value
  if (highPrecision) {
    value = new Decimal('280.466_46')
      .plus(new Decimal('36_000.769_83').mul(T))
      .plus(new Decimal('0.000_3032').mul(new Decimal(T).pow(2)))
  } else {
    const t: number = Decimal.isDecimal(T) ? T.toNumber() : T
    value = 280.466_46
      + 36_000.769_83 * t
      + 0.000_3032 * t * t
  }
  return fmod360(value)
}

/**
 * Low accuracy Geometric Ecliptic Longitude
 * The "low" accuracy (approx 0.01 degree) true geoMETRIC longitude of the
 * Sun referred to the mean equinox of the date. See AA pp 164. This
 * longitude is the quantity required in the calculation of geocentric
 * planetary position.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getGeometricEclipticLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  const T = getJulianCentury(jd, highPrecision)
  const L0 = getMeanLongitudeReferredToMeanEquinoxOfDate(T, highPrecision)
  const M = getMeanAnomaly(jd, highPrecision)
  const C = getEquationOfTheCenter(T, M, highPrecision)
  return fmod360(L0.plus(C))
}

// --- high accuracy geocentric longitude and latitude of the Sun. See AA pp 166.

/**
 * Geometric Ecliptic Longitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getGeocentricEclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  return fmod360(Earth.getEclipticLongitude(jd, equinox, highPrecision).plus(180))
}

/**
 * Geometric Ecliptic Latitude
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getGeocentricEclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  return new Decimal(-1).mul(Earth.getEclipticLatitude(jd, equinox, highPrecision))
}

// --- Conversion from high-accuracy geocentric coordinates of the Sun to the FK5 system. See AA p 166

// See AA+ CAASun::GeometricFK5EclipticLongitude
export function getGeometricFK5EclipticLongitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  // Convert to the FK5 system
  let Longitude = getGeocentricEclipticLongitude(jd, equinox, highPrecision)
  const Latitude = getGeocentricEclipticLatitude(jd, equinox, highPrecision)
  Longitude = Longitude.plus(getCorrectionInLongitude(jd, Longitude, Latitude, highPrecision))
  return Longitude
}

// See AA+ CAASun::GeometricFK5EclipticLatitude
export function getGeometricFK5EclipticLatitude (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): Degree {
  // Convert to the FK5 system
  const Longitude = getGeocentricEclipticLongitude(jd, equinox, highPrecision)
  let Latitude = getGeocentricEclipticLatitude(jd, equinox, highPrecision)
  Latitude = Latitude.plus(getCorrectionInLatitude(jd, Longitude, highPrecision))
  return Latitude
}

// ---|

/**
 * Geocentric ecliptic coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns EclipticCoordinates
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getGeocentricEclipticLongitude(jd, equinox, highPrecision),
    latitude: getGeocentricEclipticLatitude(jd, equinox, highPrecision)
  }
}

/**
 * Geocentric equatorial coordinates
 * @param {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns EquatorialCoordinates
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, equinox: Equinox = Equinox.MeanOfTheDate, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd, equinox, highPrecision),
    Earth.getMeanObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
}

/**
 * Apparent Ecliptic Longitude, that is, the geometric longitude of the Sun referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * See AA+ CAASun::ApparentEclipticLongitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLongitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  let Longitude = getGeometricFK5EclipticLongitude(jd, Equinox.MeanOfTheDate, highPrecision)

  // Apply the correction in longitude due to nutation
  Longitude = Longitude.plus(getDecimalValue(0, 0, Earth.getNutationInLongitude(jd, highPrecision)))

  // Apply the correction in longitude due to aberration. See AA p. 167 for an even higher accuracy.
  const R = Earth.getRadiusVector(jd, highPrecision)
  Longitude = Longitude.minus(getDecimalValue(0, 0, new Decimal(20.4898).dividedBy(R)))

  return Longitude
}

/**
 * Apparent Ecliptic Latitude, that is, the geometric latitude of the Sun referred to the mean equinox of the date.
 * See AA+ CAASun::ApparentEclipticLatitude
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getApparentGeocentricEclipticLatitude (jd: JulianDay | number, highPrecision: boolean = true): Degree {
  return getGeometricFK5EclipticLatitude(jd, Equinox.MeanOfTheDate, highPrecision)
}

/**
 * Apparent Ecliptic Coordinates, that is the geometric ecliptic coordinates, referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getApparentGeocentricEclipticLongitude(jd, highPrecision),
    latitude: getApparentGeocentricEclipticLatitude(jd, highPrecision)
  }
}

/**
 * Apparent Equatorial Coordinates, that is the geocentric ecliptic coordinates, referred to the mean equinox of the date,
 * corrected for the nutation and aberration.
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentGeocentricEclipticCoordinates(jd, highPrecision),
    Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
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

/**
 * The rise, transit and set times of the Sun for a given date. It uses the standard sun altitude, -0.833 degrees.
 * @param {JulianDay | number} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @param highPrecision
 * @returns {RiseTransitSet}
 */
export function getRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates | GeographicCoordinatesNum, highPrecision: boolean = true): RiseTransitSet {
  const jd0 = getJulianDayMidnightDynamicalTime(jd)
  const sunCoords = getApparentGeocentricEquatorialCoordinates(jd0, highPrecision)
  return getRiseTransitSetTimes(jd, sunCoords, geoCoords, STANDARD_ALTITUDE_SUN, highPrecision)
}
