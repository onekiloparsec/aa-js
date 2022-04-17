import { DEG2H, DEG2RAD, H2DEG, H2RAD, RAD2DEG, RAD2H } from './constants'
import { Degree, EclipticCoordinates, EquatorialCoordinates, HorizontalCoordinates, Hour, JulianDay, Point } from "./types";
import { fmod } from './utils'
import * as julianday from './julianday'

const sin = (deg) => Math.sin(deg * DEG2RAD)
const cos = (deg) => Math.cos(deg * DEG2RAD)
const tan = (deg) => Math.tan(deg * DEG2RAD)
const asin = (val) => Math.asin(val) * RAD2DEG
const atan = (y, x) => Math.atan2(y, x) * RAD2DEG
const pow = Math.pow
const round = Math.round

export function declinationFromEcliptic (l: Degree, b: Degree, epsilon: Degree): Degree {
  return asin(sin(b) * cos(epsilon) + cos(b) * sin(epsilon) * sin(l))
}

export function rightAscensionFromEcliptic (l: Degree, b: Degree, epsilon: Degree): Hour {
  return fmod(atan(sin(l) * cos(epsilon) - tan(b) * sin(epsilon), cos(l)) * DEG2H + 24.0, 24.0)
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 * @param  {Degree} l The ecliptic longitude
 * @param  {Degree} b The ecliptic latitude
 * @param  {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function transformEclipticToEquatorial (l: Degree, b: Degree, epsilon: Degree): EquatorialCoordinates {
  return {
    rightAscension: rightAscensionFromEcliptic(l, b, epsilon),
    declination: declinationFromEcliptic(l, b, epsilon)
  }
}

export function eclipticLongitudeFromEquatorial (ra: Hour, dec: Degree, epsilon: Degree): Degree {
  return atan(sin(ra * H2DEG) * cos(epsilon) + tan(dec) * sin(epsilon), cos(ra))

}

export function eclipticLatitudeFromEquatorial (ra: Hour, dec: Degree, epsilon: Degree): Degree {
  return asin(sin(dec) * cos(epsilon) - cos(dec) * sin(epsilon) * sin(ra * H2DEG))
}

/**
 * Transform equatorial coordinates to ecliptic coordinates
 * @param  {Degree} ra The equatorial right ascension
 * @param  {Degree} dec The equatorial declination
 * @param  {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 */
export function transformEquatorialToEcliptic (ra: Hour, dec: Degree, epsilon: Degree): EclipticCoordinates {
  return {
    longitude: eclipticLongitudeFromEquatorial(ra, dec, epsilon),
    latitude: eclipticLatitudeFromEquatorial(ra, dec, epsilon)
  }
}


export function horizontalAltitude (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return asin(sin(lat) * sin(dec) + cos(lat) * cos(dec) * cos(hourAngle * H2DEG))
}

export function horizontalAzimuth (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return atan(sin(hourAngle * H2DEG), cos(hourAngle) * sin(lat) - tan(dec) * cos(lat))
}


export function transformEquatorialToHorizontal (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): HorizontalCoordinates {
  return {
    azimuth: horizontalAzimuth(jd, lng, lat, ra, dec),
    altitude: horizontalAltitude(jd, lng, lat, ra, dec)
  }
}

export function horizontalFromPoint (point: Point, center: Point, radius: number): HorizontalCoordinates {
  const x = point.x - center.x
  const y = point.y - center.y
  const d = pow(pow(x, 2) + pow(y, 2), 0.5)
  return {
    azimuth: fmod(-1 * atan(y, x) + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

export function pointFromHorizontal (alt: Degree, az: Degree, center: Point, radius: number): Point {
  const x = (90.0 - alt) * cos((az - 90.0)) / 90.0 * radius
  const y = (90.0 - alt) * sin((az - 90.0)) / 90.0 * radius
  if (x > radius || y > radius || alt < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: round(center.x + x), y: round(center.y - y) }
}

export function rightAscensionFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lng: Degree, lat: Degree): Hour {
  const lmst = julianday.localSiderealTime(jd, lng)
  return lmst - atan(sin(az), cos(az) * sin(lat) + tan(alt) * cos(lat)) * DEG2H
}

export function declinationFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lat: Degree): Degree {
  return asin(sin(lat) * sin(alt) - cos(lat) * cos(alt) * cos(az))
}

export function transformHorizontalToEquatorial (jd: JulianDay, alt: Degree, az: Degree, lng: Degree, lat: Degree): EquatorialCoordinates {
  return {
    rightAscension: fmod(rightAscensionFromHorizontal(jd, alt, az, lat, lng) + 24.0, 24.0),
    declination: declinationFromHorizontal(jd, alt, az, lat)
  }
}

export function parallacticAngle (jd: JulianDay, ra: Hour, dec: Degree, lng: Degree, lat: Degree): Degree {
  const lmst = julianday.localSiderealTime(jd, lng)
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
