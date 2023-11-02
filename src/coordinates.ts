/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import {
  AstronomicalUnit,
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  GalacticCoordinates,
  GeographicCoordinates,
  HorizontalCoordinates,
  Hour,
  JulianDay,
  Point,
  Radian,
  TopocentricCoordinates
} from './types'
import { ECLIPTIC_OBLIQUITY_J2000_0, J2000, JULIAN_DAY_B1950_0 } from '@/constants'
import { getLocalSiderealTime } from '@/juliandays'
import { precessEquatorialCoordinates } from '@/precession'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { fmod24, fmod360, fmod90 } from '@/utils'

// Degree-based trigonometric functions for easier debugging with AA.
const sin = (deg: Degree | number): Radian => new Decimal(deg).degreesToRadians().sin()
const cos = (deg: Degree | number): Radian => new Decimal(deg).degreesToRadians().cos()
const tan = (deg: Degree | number): Radian => new Decimal(deg).degreesToRadians().tan()
const asin = (val: Degree | number): Degree => new Decimal(val).asin().radiansToDegrees()
const atan = (val: Degree | number): Degree => new Decimal(val).atan().radiansToDegrees()
const atan2 = (y: Degree | number, x: Degree | number): Degree => Decimal.atan2(y, x).radiansToDegrees()


/**
 * Equatorial right ascension from ecliptic coordinates
 * @param {Degree} l The ecliptic longitude
 * @param {Degree} b The ecliptic latitude
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Hour}
 */
export function getRightAscensionFromEcliptic (l: Degree | number, b: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Hour {
  return fmod24(atan2(sin(l).mul(cos(epsilon)).minus(tan(b).mul(sin(epsilon))), cos(l)).degreesToHours())
}

/**
 * Equatorial declination from ecliptic coordinates
 * @param {Degree} l The ecliptic longitude
 * @param {Degree} b The ecliptic latitude
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (l: Degree | number, b: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  return fmod90(asin(sin(b).mul(cos(epsilon)).plus(cos(b).mul(sin(epsilon)).mul(sin(l)))))
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 * @param {Degree} l The ecliptic longitude
 * @param {Degree} b The ecliptic latitude
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function transformEclipticToEquatorial (l: Degree | number, b: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromEcliptic(l, b, epsilon),
    declination: getDeclinationFromEcliptic(l, b, epsilon)
  }
}

/**
 * Ecliptic longitude from equatorial coordinates
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Degree}
 */
export function getEclipticLongitudeFromEquatorial (ra: Hour | number, dec: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const degRa = new Decimal(ra).hoursToDegrees()
  return fmod360(atan2(sin(degRa).mul(cos(epsilon)).plus(tan(dec).mul(sin(epsilon))), cos(degRa)))
}

/**
 * Ecliptic latitude from equatorial coordinates
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Degree}
 */
export function getEclipticLatitudeFromEquatorial (ra: Hour | number, dec: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  const degRa = new Decimal(ra).hoursToDegrees()
  return fmod90(asin(sin(dec).mul(cos(epsilon)).minus(cos(dec).mul(sin(epsilon).mul(sin(degRa))))))
}

/**
 * Transform equatorial coordinates to ecliptic coordinates
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function transformEquatorialToEcliptic (ra: Hour | number, dec: Degree | number, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0): EclipticCoordinates {
  return {
    longitude: getEclipticLongitudeFromEquatorial(ra, dec, epsilon),
    latitude: getEclipticLatitudeFromEquatorial(ra, dec, epsilon)
  }
}

// --- galactic coordinates

/**
 * Galactic longitude from equatorial coordinates.
 * See AA p.94
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLongitudeFromEquatorial (ra: Hour | number, dec: Degree | number, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(ra, dec, epoch, JULIAN_DAY_B1950_0)
  const degRa = equCoordsB1950.rightAscension.hoursToDegrees()
  const y = sin(new Decimal(192.25).minus(degRa))
  const x = cos(new Decimal(192.25).minus(degRa)).mul(sin(27.4)).minus(tan(equCoordsB1950.declination).mul(cos(27.4)))
  return fmod360(new Decimal(303).minus(atan2(y, x)))
}

/**
 * Galactic latitude from equatorial coordinates.
 * See AA p.94
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLatitudeFromEquatorial (ra: Hour | number, dec: Degree | number, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(ra, dec, epoch, JULIAN_DAY_B1950_0)
  const degRa = equCoordsB1950.rightAscension.hoursToDegrees()
  return fmod360(
    sin(equCoordsB1950.declination).mul(sin(27.4))
      .plus(cos(equCoordsB1950.declination).mul(cos(27.4)).mul(new Decimal(192.25).minus(degRa)))
  )
}

/**
 * Transform equatorial coordinates to galactic coordinates.
 * @param {Degree} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epoch The epoch of the equatorial coordinates. By default, J2000.
 */
export function transformEquatorialToGalactic (ra: Hour | number, dec: Degree | number, epoch: JulianDay | number = J2000): GalacticCoordinates {
  return {
    longitude: getGalacticLongitudeFromEquatorial(ra, dec, epoch),
    latitude: getGalacticLatitudeFromEquatorial(ra, dec, epoch)
  }
}

/**
 * Equatorial right ascension in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {Degree} l The galactic longitude
 * @param {Degree} b The galactic latitude
 * @returns {Hour}
 */
export function getEquatorialRightAscensionB1950FromGalactic (l: Degree | number, b: Degree | number): Hour {
  const lprime = new Decimal(l).minus(123)
  const y = sin(lprime)
  const x = cos(lprime).mul(sin(27.4)).minus(tan(b).mul(cos(27.4)))
  return fmod24(new Decimal(12.15).plus(atan2(y, x)).degreesToHours())
}

/**
 * Equatorial declination in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {Degree} l The galactic longitude
 * @param {Degree} b The galactic latitude
 * @returns {Degree}
 */
export function getEquatorialDeclinationB1950FromGalactic (l: Degree | number, b: Degree | number): Degree {
  const lprime = new Decimal(l).minus(123)
  return fmod90(asin(sin(b).mul(sin(27.4)).plus(cos(b).mul(cos(27.4)).mul(cos(lprime)))))
}

/**
 * Transform galactic coordinates to equatorial coordinates.
 * @param {Degree} l The galactic longitude
 * @param {Degree} b The galactic latitude
 * @param {Degree} epoch The initial epoch of the equatorial coordinates. By default, J2000.
 * @returns {EquatorialCoordinates}
 */
export function transformGalacticToEquatorial (l: Degree | number, b: Degree | number, epoch: JulianDay | number = J2000): EquatorialCoordinates {
  const raB1950 = getEquatorialRightAscensionB1950FromGalactic(l, b)
  const decB1950 = getEquatorialDeclinationB1950FromGalactic(l, b)
  return precessEquatorialCoordinates(raB1950, decB1950, JULIAN_DAY_B1950_0, epoch)
}

// --- horizontal coordinates

/**
 * Horizontal (local) altitude (where horizon is zero degrees)
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @returns {Degree}
 */
export function getHorizontalAltitude (jd: JulianDay | number, lng: Degree | number, lat: Degree | number, ra: Hour | number, dec: Degree | number): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  const hourAngle = lmst.minus(ra).hoursToDegrees()
  return fmod90(asin(sin(lat).mul(sin(dec)).plus(cos(lat).mul(cos(dec)).mul(cos(hourAngle)))))
}

/**
 * Horizontal (local) azimuth.
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @returns {Degree}
 */
export function getHorizontalAzimuth (jd: JulianDay | number, lng: Degree | number, lat: Degree | number, ra: Hour | number, dec: Degree | number): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  const hourAngle = lmst.minus(ra).hoursToDegrees()
  return fmod360(atan2(sin(hourAngle), cos(hourAngle).mul(sin(lat)).minus(tan(dec).mul(cos(lat)))))
}


/**
 * Transform equatorial coordinates to horizontal coordinates.
 * @param {JulianDay} jd The julian day
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @returns {HorizontalCoordinates}
 */
export function transformEquatorialToHorizontal (jd: JulianDay | number, lng: Degree | number, lat: Degree | number, ra: Hour | number, dec: Degree | number): HorizontalCoordinates {
  return {
    azimuth: getHorizontalAzimuth(jd, lng, lat, ra, dec),
    altitude: getHorizontalAltitude(jd, lng, lat, ra, dec)
  }
}

/**
 * Equatorial right ascension from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {Degree} alt The local altitude (horizon = zero degrees)
 * @param {Degree} az The local azimuth
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @returns {Hour}
 */
export function getRightAscensionFromHorizontal (jd: JulianDay | number, alt: Degree | number, az: Degree | number, lng: Degree | number, lat: Degree | number): Hour {
  const lmst = getLocalSiderealTime(jd, lng)
  const y = sin(az)
  const x = cos(az).mul(sin(lat)).plus(tan(alt).mul(cos(lat)))
  return fmod24(lmst.minus(atan2(y, x).degreesToHours()))
}

/**
 * Equatorial declination from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {Degree} alt The local altitude (horizon = zero degrees)
 * @param {Degree} az The local azimuth
 * @param {Degree} lat The latitude of the observer's location
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (jd: JulianDay | number, alt: Degree | number, az: Degree | number, lat: Degree | number): Degree {
  return fmod90(asin(sin(lat).mul(sin(alt)).minus(cos(lat).mul(cos(alt)).mul(cos(az)))))
}

/**
 * Transform horizontal coordinates to equatorial coordinates.
 * @param {JulianDay} jd The julian day
 * @param {Degree} alt The local altitude (horizon = zero degrees)
 * @param {Degree} az The local azimuth
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @returns {EquatorialCoordinates}
 */
export function transformHorizontalToEquatorial (jd: JulianDay | number, alt: Degree | number, az: Degree | number, lng: Degree | number, lat: Degree | number): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromHorizontal(jd, alt, az, lat, lng),
    declination: getDeclinationFromHorizontal(jd, alt, az, lat)
  }
}

/**
 * Transform equatorial coordinates to topocentric coordinates.
 * @param {JulianDay} jd The julian day
 * @param {Degree} coords The equatorial coordinates
 * @param {AstronomicalUnit} distance The object geocentric distance
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @returns {TopocentricCoordinates}
 */
export function transformEquatorialToTopocentric (jd: JulianDay | number, coords: EquatorialCoordinates, distance: AstronomicalUnit | number, geoCoords: GeographicCoordinates): TopocentricCoordinates {
  const corrections = getFlatteningCorrections(geoCoords.height, geoCoords.latitude)
  const sinpi: Radian = sin(new Decimal(8.794).dividedBy(3600)).dividedBy(distance)
  const theta0: Degree = getLocalSiderealTime(jd, 0)
  const H: Degree = fmod24(theta0.plus(new Decimal(geoCoords.longitude).degreesToHours()).minus(coords.rightAscension)).hoursToDegrees()

  const numeratorAlpha = new Decimal(-1).mul(corrections.rhocosphi).mul(sinpi).mul(sin(H))
  const denominatorAlpha = cos(coords.declination).minus(corrections.rhocosphi.mul(sinpi).mul(cos(H)))
  const tanDeltaAlpha = numeratorAlpha.dividedBy(denominatorAlpha)

  const cosDeltaAlpha = cos(atan(tanDeltaAlpha))
  const numeratorDelta = (sin(coords.declination).minus(corrections.rhosinphi.mul(sinpi))).mul(cosDeltaAlpha)
  const denominatorDelta = cos(coords.declination).minus(corrections.rhocosphi.mul(sinpi).mul(cos(H)))
  const tanDeltaPrime = numeratorDelta.dividedBy(denominatorDelta)

  return {
    rightAscension: new Decimal(coords.rightAscension).plus(atan(tanDeltaAlpha).degreesToHours()),
    declination: atan(tanDeltaPrime)
  }
}

/**
 * Transform a point (x,y) of the sky projected on a disk to horizontal coordinates.
 * @param {Point} point The point on the disk, relative to its center
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {HorizontalCoordinates}
 */
export function transformPointToHorizontal (point: Point, center: Point, radius: number): HorizontalCoordinates {
  const x = new Decimal(point.x).minus(center.x)
  const y = new Decimal(point.y).minus(center.y)
  const d = x.pow(2).plus(y.pow(2)).sqrt()
  return {
    azimuth: fmod360(new Decimal(-1).mul(atan2(y, x)).minus(270)),
    altitude: new Decimal(90.0).mul((new Decimal(1).minus(d.dividedBy(radius))))
  }
}

/**
 * Transform horizontal coordinates to a point (x,y) of the sky projected on a disk.
 * @param {Degree} alt The local altitude (horizon = zero degrees)
 * @param {Degree} az The local azimuth
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {Point}
 */
export function transformHorizontalToPoint (alt: Degree | number, az: Degree | number, center: Point, radius: number): Point {
  const ninety = new Decimal(90)
  const x = ninety.minus(alt).mul(cos(new Decimal(az).minus(90.0))).dividedBy(90.0).mul(radius)
  const y = ninety.minus(alt).mul(sin(new Decimal(az).minus(90.0))).dividedBy(90.0).mul(radius)
  if (x.greaterThan(radius) || y.greaterThan(radius) || new Decimal(alt).lessThan(0.0)) {
    return { x: new Decimal(0), y: new Decimal(0) }
  }
  return { x: new Decimal(center.x).plus(x), y: new Decimal(center.y).minus(y) }
}

/**
 * Paralactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 * @param {JulianDay} jd The julian day of the observation.
 * @param {Hour} ra The object equatorial right ascension
 * @param {Degree} dec The object equatorial declination
 * @param {Degree} lng The longitude of the observer's location
 * @param {Degree} lat The latitude of the observer's location
 * @returns {Degree} The paralactic angle
 */
export function getParallacticAngle (jd: JulianDay | number, ra: Hour | number, dec: Degree | number, lng: Degree | number, lat: Degree | number): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  const HA = lmst.minus(ra).hoursToDegrees()

  let angle = undefined
  const cosdec = cos(dec)

  if (!cosdec.isZero()) {
    angle = atan2(sin(HA), (tan(lat).mul(cosdec)).minus(sin(dec).mul(cos(HA))))
  } else {
    angle = (new Decimal(lat).greaterThanOrEqualTo(0)) ? new Decimal(180) : new Decimal(0.0)
  }

  return angle
}
