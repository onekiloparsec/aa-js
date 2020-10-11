import { DEG2H, DEG2RAD, H2RAD, RAD2DEG, RAD2H } from './constants'
import { fmod } from './utils'
import julianday from './julianday'

const sin = Math.sin
const cos = Math.cos
const tan = Math.tan
const asin = Math.asin
const atan = Math.atan2
const pow = Math.pow
const round = Math.round

export interface EquatorialCoordinates {
  rightAscension: number,
  declination: number
}

export interface EclipticCoordinates {
  longitude: number,
  latitude: number
}

export interface HorizontalCoordinates {
  azimuth: number,
  altitude: number
}

export interface Point {
  x: number,
  y: number
}

export function declinationFromEcliptic(l: number, b: number, epsilon: number): number {
  return asin(sin(b * DEG2RAD) * cos(epsilon * DEG2RAD) +
    cos(b * DEG2RAD) * sin(epsilon * DEG2RAD) * sin(l * DEG2RAD)) * RAD2DEG
}

export function rightAscensionFromEcliptic(l: number, b: number, epsilon: number): number {
  return fmod(atan(sin(l * DEG2RAD) * cos(epsilon * DEG2RAD) -
    tan(b * DEG2RAD) * sin(epsilon * DEG2RAD), cos(l * DEG2RAD)) * RAD2DEG * DEG2H + 24.0,
    24.0)
}

export function transformEclipticToEquatorial(l: number, b: number, epsilon: number): EquatorialCoordinates {
  return {
    rightAscension: rightAscensionFromEcliptic(l, b, epsilon),
    declination: declinationFromEcliptic(l, b, epsilon)
  }
}

export function horizontalAltitude(jd: number, lng: number, lat: number, ra: number, dec: number): number {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return asin(sin(lat * DEG2RAD) * sin(dec * DEG2RAD) +
    cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cos(hourAngle * DEG2RAD)) * RAD2DEG
}

export function horizontalAzimuth(jd: number, lng: number, lat: number, ra: number, dec: number): number {
  const lmst = julianday.localSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return atan(sin(hourAngle * DEG2RAD),
    cos(hourAngle * DEG2RAD) * sin(lat * DEG2RAD) -
    tan(dec * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2DEG
}


export function transformEquatorialToHorizontal(jd: number, lng: number, lat: number, ra: number, dec: number): HorizontalCoordinates {
  return {
    azimuth: horizontalAzimuth(jd, lng, lat, ra, dec),
    altitude: horizontalAltitude(jd, lng, lat, ra, dec)
  }
}

export function horizontalFromPoint(point: Point, center: Point, radius: number): HorizontalCoordinates {
  const x = point.x - center.x
  const y = point.y - center.y
  const d = pow(pow(x, 2) + pow(y, 2), 0.5)
  return {
    azimuth: fmod(-1 * atan(y, x) * RAD2DEG + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

export function pointFromHorizontal(alt: number, az: number, center: Point, radius: number): Point {
  const x = (90.0 - alt) * cos((az - 90.0) * DEG2RAD) / 90.0 * radius
  const y = (90.0 - alt) * sin((az - 90.0) * DEG2RAD) / 90.0 * radius
  if (x > radius || y > radius || alt < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: round(center.x + x), y: round(center.y - y) }
}

export function rightAscensionFromHorizontal(jd: number, alt: number, az: number, lat: number, lng: number): number {
  const lmst = julianday.localSiderealTime(jd, lng)
  return lmst - atan(sin(az * DEG2RAD),
    cos(az * DEG2RAD) * sin(lat * DEG2RAD) +
    tan(alt * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2H
}

export function declinationFromHorizontal(jd: number, alt: number, az: number, lat: number): number {
  return asin(sin(lat * DEG2RAD) * sin(alt * DEG2RAD) -
    cos(lat * DEG2RAD) * cos(alt * DEG2RAD) * cos(az * DEG2RAD)) * RAD2DEG
}

export function transformHorizontalToEquatorial(jd: number, alt: number, az: number, lat: number, lng: number): EquatorialCoordinates {
  return {
    rightAscension: fmod(rightAscensionFromHorizontal(jd, alt, az, lat, lng) + 24.0, 24.0),
    declination: declinationFromHorizontal(jd, alt, az, lat)
  }
}

export function parallacticAngle(jd: number, ra: number, dec: number, lat: number, lng: number): number {
  const lmst = julianday.localSiderealTime(jd, lng)
  const HA = lmst - ra

  let paralacticAngle = 0.0
  const cosdec = cos(dec * DEG2RAD)

  if (cosdec !== 0.0) {
    paralacticAngle = atan(sin(HA * H2RAD),
      tan(lat * DEG2RAD) * cosdec -
      sin(dec * DEG2RAD) * cos(HA * H2RAD))
  } else {
    paralacticAngle = (lat >= 0.0) ? Math.PI : 0.0
  }

  return paralacticAngle * RAD2DEG
}
