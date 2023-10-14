import {
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  GalacticCoordinates,
  HorizontalCoordinates,
  Hour,
  JulianDay,
  Point
} from './types'
import { DEG2H, DEG2RAD, ECLIPTIC_OBLIQUITY_J2000_0, H2DEG, J2000, JULIAN_DAY_B1950_0, RAD2DEG } from './constants'
import { getLocalSiderealTime } from './juliandays'
import { precessEquatorialCoordinates } from './precession'
import { fmod } from './utils'

const sin = (deg: Degree): Degree => Math.sin(deg * DEG2RAD)
const cos = (deg: Degree): Degree => Math.cos(deg * DEG2RAD)
const tan = (deg: Degree): Degree => Math.tan(deg * DEG2RAD)
const asin = (val: Degree): Degree => Math.asin(val) * RAD2DEG
const atan = (y: Degree, x: Degree): Degree => Math.atan2(y, x) * RAD2DEG
const pow = Math.pow
const round = Math.round


/**
 * Equatorial right ascension from ecliptic coordinates
 * @param {Degree} l The ecliptic longitude
 * @param {Degree} b The ecliptic latitude
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Hour}
 */
export function getRightAscensionFromEcliptic (l: Degree, b: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Hour {
  return fmod(atan(sin(l) * cos(epsilon) - tan(b) * sin(epsilon), cos(l)) * DEG2H + 24.0, 24.0)
}

/**
 * Equatorial declination from ecliptic coordinates
 * @param {Degree} l The ecliptic longitude
 * @param {Degree} b The ecliptic latitude
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (l: Degree, b: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  return asin(sin(b) * cos(epsilon) + cos(b) * sin(epsilon) * sin(l))
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
export function transformEclipticToEquatorial (l: Degree, b: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): EquatorialCoordinates {
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
export function getEclipticLongitudeFromEquatorial (ra: Hour, dec: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  return fmod(atan(sin(ra * H2DEG) * cos(epsilon) + tan(dec) * sin(epsilon), cos(ra * H2DEG)) + 360.0, 360.0)

}

/**
 * Ecliptic latitude from equatorial coordinates
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @returns {Degree}
 */
export function getEclipticLatitudeFromEquatorial (ra: Hour, dec: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): Degree {
  return asin(sin(dec) * cos(epsilon) - cos(dec) * sin(epsilon) * sin(ra * H2DEG))
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
export function transformEquatorialToEcliptic (ra: Hour, dec: Degree, epsilon: Degree = ECLIPTIC_OBLIQUITY_J2000_0): EclipticCoordinates {
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
export function getGalacticLongitudeFromEquatorial (ra: Hour, dec: Degree, epoch: JulianDay = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(ra, dec, epoch, JULIAN_DAY_B1950_0)
  return 303 - atan(sin(192.25 - equCoordsB1950.rightAscension * H2DEG),
    cos(192.25 - equCoordsB1950.rightAscension * H2DEG) * sin(27.4) - tan(equCoordsB1950.declination) * cos(27.4))
}

/**
 * Galactic latitude from equatorial coordinates.
 * See AA p.94
 * @param {Hour} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLatitudeFromEquatorial (ra: Hour, dec: Degree, epoch: JulianDay = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(ra, dec, epoch, JULIAN_DAY_B1950_0)
  return sin(equCoordsB1950.declination) * sin(27.4) + cos(equCoordsB1950.declination) * cos(27.4) * cos(192.25 - equCoordsB1950.rightAscension * H2DEG)
}

/**
 * Transform equatorial coordinates to galactic coordinates.
 * @param {Degree} ra The equatorial right ascension
 * @param {Degree} dec The equatorial declination
 * @param {Degree} epoch The epoch of the equatorial coordinates. By default, J2000.
 */
export function transformEquatorialToGalactic (ra: Hour, dec: Degree, epoch: JulianDay = J2000): GalacticCoordinates {
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
 * @param {JulianDay} epoch The epoch (default = J2000)
 * @returns {Hour}
 */
export function getEquatorialRightAscensionB1950FromGalactic (l: Degree, b: Degree, epoch: JulianDay = J2000): Hour {
  const raB1950 = 12.15 + atan(sin(l - 123), cos(l - 123) * sin(27.4) - tan(b) * cos(27.4))
  return raB1950 * DEG2H
}

/**
 * Equatorial declination in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {Degree} l The galactic longitude
 * @param {Degree} b The galactic latitude
 * @param {JulianDay} epoch The epoch (default = J2000)
 * @returns {Degree}
 */
export function getEquatorialDeclinationB1950FromGalactic (l: Degree, b: Degree, epoch: JulianDay = J2000): Degree {
  return asin(sin(b) * sin(27.4) + cos(b) * cos(27.4) * cos(l - 123))
}

/**
 * Transform galactic coordinates to equatorial coordinates.
 * @param {Degree} l The galactic longitude
 * @param {Degree} b The galactic latitude
 * @param {Degree} epoch The initial epoch of the equatorial coordinates. By default, J2000.
 * @returns {EquatorialCoordinates}
 */
export function transformGalacticToEquatorial (l: Degree, b: Degree, epoch: JulianDay = J2000): EquatorialCoordinates {
  const raB1950 = getEquatorialRightAscensionB1950FromGalactic(l, b, epoch)
  const decB1950 = getEquatorialDeclinationB1950FromGalactic(l, b, epoch)
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
export function getHorizontalAltitude (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  return asin(sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos((lmst - ra) * H2DEG))
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
export function getHorizontalAzimuth (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return atan(sin(hourAngle * H2DEG), cos(hourAngle * H2DEG) * sin(lat) - tan(dec) * cos(lat))
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
export function transformEquatorialToHorizontal (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): HorizontalCoordinates {
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
export function getRightAscensionFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lng: Degree, lat: Degree): Hour {
  const lmst = getLocalSiderealTime(jd, lng)
  return lmst - atan(sin(az), cos(az) * sin(lat) + tan(alt) * cos(lat)) * DEG2H
}

/**
 * Equatorial declination from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {Degree} alt The local altitude (horizon = zero degrees)
 * @param {Degree} az The local azimuth
 * @param {Degree} lat The latitude of the observer's location
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lat: Degree): Degree {
  return asin(sin(lat) * sin(alt) - cos(lat) * cos(alt) * cos(az))
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
export function transformHorizontalToEquatorial (jd: JulianDay, alt: Degree, az: Degree, lng: Degree, lat: Degree): EquatorialCoordinates {
  return {
    rightAscension: fmod(getRightAscensionFromHorizontal(jd, alt, az, lat, lng) + 24.0, 24.0),
    declination: getDeclinationFromHorizontal(jd, alt, az, lat)
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
  const x = point.x - center.x
  const y = point.y - center.y
  const d = pow(pow(x, 2) + pow(y, 2), 0.5)
  return {
    azimuth: fmod(-1 * atan(y, x) + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
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
export function transformHorizontalToPoint (alt: Degree, az: Degree, center: Point, radius: number): Point {
  const x = (90.0 - alt) * cos((az - 90.0)) / 90.0 * radius
  const y = (90.0 - alt) * sin((az - 90.0)) / 90.0 * radius
  if (x > radius || y > radius || alt < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: round(center.x + x), y: round(center.y - y) }
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
export function getParallacticAngle (jd: JulianDay, ra: Hour, dec: Degree, lng: Degree, lat: Degree): Degree {
  const lmst = getLocalSiderealTime(jd, lng)
  const HA = lmst - ra

  let angle = 0.0
  const cosdec = cos(dec)

  if (cosdec !== 0.0) {
    angle = atan(sin(HA * H2DEG), tan(lat) * cosdec - sin(dec) * cos(HA * H2DEG))
  } else {
    angle = (lat >= 0.0) ? 180 : 0.0
  }

  return angle
}
