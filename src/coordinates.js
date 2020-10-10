import { DEG2H, DEG2RAD, H2RAD, RAD2DEG, RAD2H } from './constants'
import julianday from './julianday'

const sin = Math.sin
const cos = Math.cos
const tan = Math.tan
const asin = Math.asin
const atan = Math.atan2
const pow = Math.pow
const round = Math.round

function getDeclinationFromEcliptic (l, b, epsilon) {
  return asin(sin(b * DEG2RAD) * cos(epsilon * DEG2RAD) +
    cos(b * DEG2RAD) * sin(epsilon * DEG2RAD) * sin(l * DEG2RAD)) * RAD2DEG
}

function getRightAscensionFromEcliptic (l, b, epsilon) {
  return Math.fmod(atan(sin(l * DEG2RAD) * cos(epsilon * DEG2RAD) -
    tan(b * DEG2RAD) * sin(epsilon * DEG2RAD), cos(l * DEG2RAD)) * RAD2DEG * DEG2H + 24.0,
    24.0)
}

function transformEclipticToEquatorial (l, b, epsilon) {
  return {
    rightAscension: getRightAscensionFromEcliptic(l, b, epsilon),
    declination: getDeclinationFromEcliptic(l, b, epsilon)
  }
}

function getHorizontalAltitude (jd, lng, lat, ra, dec) {
  const lmst = julianday.getLocalSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return asin(sin(lat * DEG2RAD) * sin(dec * DEG2RAD) +
    cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cos(hourAngle * DEG2RAD)) * RAD2DEG
}

function getHorizontalAzimuth (jd, lng, lat, ra, dec) {
  const lmst = julianday.getLocalSiderealTime(jd, lng)
  const hourAngle = lmst - ra
  return atan(sin(hourAngle * DEG2RAD),
    cos(hourAngle * DEG2RAD) * sin(lat * DEG2RAD) -
    tan(dec * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2DEG
}

function transformEquatorialToHorizontal (jd, lng, lat, ra, dec) {
  return {
    azimuth: getHorizontalAzimuth(jd, lng, lat, ra, dec),
    altitude: getHorizontalAltitude(jd, lng, lat, ra, dec)
  }
}

function getHorizontalFromPoint (point, center, radius) {
  const x = point.x - center.x
  const y = point.y - center.y
  const d = pow(pow(x, 2) + pow(y, 2), 0.5)
  return {
    azimuth: Math.fmod(-1 * atan(y, x) * RAD2DEG + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

function getPointFromHorizontal (alt, az, center, radius) {
  const x = (90.0 - alt) * cos((az - 90.0) * DEG2RAD) / 90.0 * radius
  const y = (90.0 - alt) * sin((az - 90.0) * DEG2RAD) / 90.0 * radius
  if (x > radius || y > radius || alt < 0.0) {
    return { x: 0, y: 0 }
  }
  return { x: round(center.x + x), y: round(center.y - y) }
}

function getRightAscensionFromHorizontal (jd, alt, az, lat, lng) {
  const lmst = julianday.getLocalSiderealTime(jd, lng)
  return lmst - atan(sin(az * DEG2RAD),
    cos(az * DEG2RAD) * sin(lat * DEG2RAD) +
    tan(alt * DEG2RAD) * cos(lat * DEG2RAD)) * RAD2H
}

function getDeclinationFromHorizontal (jd, alt, az, lat) {
  return asin(sin(lat * DEG2RAD) * sin(alt * DEG2RAD) -
    cos(lat * DEG2RAD) * cos(alt * DEG2RAD) * cos(az * DEG2RAD)) * RAD2DEG
}

function transformHorizontalToEquatorial (jd, alt, az, lat, lng) {
  return {
    rightAscension: Math.fmod(getRightAscensionFromHorizontal(jd, alt, az, lat, lng) + 24.0, 24.0),
    declination: getDeclinationFromHorizontal(jd, alt, az, lat)
  }
}

function getParallacticAngle (jd, ra, dec, lat, lng) {
  const lmst = julianday.getLocalSiderealTime(jd, lng)
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

export default {
  getRightAscensionFromEcliptic,
  getDeclinationFromEcliptic,
  transformEclipticToEquatorial,
  getHorizontalFromPoint,
  getPointFromHorizontal,
  transformEquatorialToHorizontal,
  transformHorizontalToEquatorial,
  getHorizontalAltitude,
  getHorizontalAzimuth,
  getParallacticAngle
}
