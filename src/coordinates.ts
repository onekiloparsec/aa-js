import { DEG2H, DEG2RAD, H2RAD, RAD2DEG, RAD2H } from './constants'
import { Degree, EquatorialCoordinates, HorizontalCoordinates, Hour, JulianDay, Point } from "./types";
import { fmod } from './utils'
import * as julianday from './julianday'

const sin = Math.sin
const cos = Math.cos
const tan = Math.tan
const asin = Math.asin
const atan = Math.atan2
const pow = Math.pow
const round = Math.round

export function declinationFromEcliptic (l: Degree, b: Degree, epsilon: Degree): Degree {
  return asin(sin(b * DEG2RAD) * cos(epsilon * DEG2RAD) +
    cos(b * DEG2RAD) * sin(epsilon * DEG2RAD) * sin(l * DEG2RAD)) * RAD2DEG
}

export function rightAscensionFromEcliptic (l: Degree, b: Degree, epsilon: Degree): Hour {
  return fmod(atan(sin(l * DEG2RAD) * cos(epsilon * DEG2RAD) -
    tan(b * DEG2RAD) * sin(epsilon * DEG2RAD), cos(l * DEG2RAD)) * RAD2DEG * DEG2H + 24.0,
    24.0)
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
 * @returns {Number} The eccentricity (comprise between 0==circular, and 1).
 */
export function transformEclipticToEquatorial (l: Degree, b: Degree, epsilon: Degree): EquatorialCoordinates {
  return {
    rightAscension: rightAscensionFromEcliptic(l, b, epsilon),
    declination: declinationFromEcliptic(l, b, epsilon)
  }
}

export function horizontalAltitude (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return asin(sin(lat * DEG2RAD) * sin(dec * DEG2RAD) +
    cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cos(hourAngle * H2RAD)) * RAD2DEG
}

export function horizontalAzimuth (jd: JulianDay, lng: Degree, lat: Degree, ra: Hour, dec: Degree): Degree {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return atan(sin(hourAngle * H2RAD),
    cos(hourAngle * H2RAD) * sin(lat * DEG2RAD) -
    tan(dec * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2DEG
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
    azimuth: fmod(-1 * atan(y, x) * RAD2DEG + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

export function pointFromHorizontal (alt: Degree, az: Degree, center: Point, radius: number): Point {
  const x = (90.0 - alt) * cos((az - 90.0) * DEG2RAD) / 90.0 * radius
  const y = (90.0 - alt) * sin((az - 90.0) * DEG2RAD) / 90.0 * radius
  if (x > radius || y > radius || alt < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: round(center.x + x), y: round(center.y - y) }
}

export function rightAscensionFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lng: Degree, lat: Degree): Hour {
  const lmst = julianday.localSiderealTime(jd, lng)
  return lmst - atan(sin(az * DEG2RAD),
    cos(az * DEG2RAD) * sin(lat * DEG2RAD) +
    tan(alt * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2H
}

export function declinationFromHorizontal (jd: JulianDay, alt: Degree, az: Degree, lat: Degree): Degree {
  return asin(sin(lat * DEG2RAD) * sin(alt * DEG2RAD) -
    cos(lat * DEG2RAD) * cos(alt * DEG2RAD) * cos(az * DEG2RAD)) * RAD2DEG
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
  const cosdec = cos(dec * DEG2RAD)

  if (cosdec !== 0.0) {
    angle = atan(sin(HA * H2RAD),
      tan(lat * DEG2RAD) * cosdec -
      sin(dec * DEG2RAD) * cos(HA * H2RAD))
  } else {
    angle = (lat >= 0.0) ? Math.PI : 0.0
  }

  return angle * RAD2DEG
}
