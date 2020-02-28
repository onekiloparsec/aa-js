import { DEGREES_TO_RADIANS, RADIANS_TO_DEGREES, RADIANS_TO_HOURS, HOURS_TO_RADIANS } from './constants'
import julianday from './julianday'

function transformEclipticToEquatorial ({ Lambda, Beta, Epsilon }) {
  const LambdaRad = Lambda * DEGREES_TO_RADIANS
  const BetaRad = Beta * DEGREES_TO_RADIANS
  const EpsilonRad = Epsilon * DEGREES_TO_RADIANS

  let rightAscension = (Math.atan2(Math.sin(LambdaRad) * Math.cos(EpsilonRad) -
    Math.tan(BetaRad) * Math.sin(EpsilonRad), Math.cos(LambdaRad)))

  rightAscension *= RADIANS_TO_HOURS

  if (rightAscension < 0) {
    rightAscension += 24
  }

  let declination = Math.asin(Math.sin(BetaRad) * Math.cos(EpsilonRad) +
    Math.cos(BetaRad) * Math.sin(EpsilonRad) * Math.sin(LambdaRad))

  declination *= RADIANS_TO_DEGREES

  return { rightAscension: rightAscension, declination: declination }
}

function getHorizontalAltitude ({ julianDayValue, targetCoords, siteCoords }) {
  if (!arguments || !julianDayValue || !targetCoords || !siteCoords) {
    return -1
  }

  const ra = targetCoords.right_ascension / 15.0 || targetCoords.rightAscension
  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  const hourAngle = lmst - ra

  const cosdec = Math.cos(targetCoords.declination * DEGREES_TO_RADIANS)
  const sindec = Math.sin(targetCoords.declination * DEGREES_TO_RADIANS)
  const cosha = Math.cos(hourAngle * DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * DEGREES_TO_RADIANS)
  const sinlat = Math.sin(siteCoords.latitude * DEGREES_TO_RADIANS)

  return Math.asin(sinlat * sindec + coslat * cosdec * cosha) * RADIANS_TO_DEGREES
}

function getHorizontalAzimuth ({ julianDayValue, targetCoords, siteCoords }) {
  if (!julianDayValue || !targetCoords || !siteCoords) {
    return -1
  }

  const ra = targetCoords.right_ascension / 15.0 || targetCoords.rightAscension
  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  const hourAngle = lmst - ra

  const sinha = Math.sin(hourAngle * DEGREES_TO_RADIANS)
  const cosha = Math.cos(hourAngle * DEGREES_TO_RADIANS)
  const sinlat = Math.sin(siteCoords.latitude * DEGREES_TO_RADIANS)
  const tandec = Math.tan(targetCoords.declination * DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * DEGREES_TO_RADIANS)

  const y = cosha * sinlat - tandec * coslat
  const z = sinha
  // atan2(z, y) == arctan(z/y) using the signs of both arguments to determine the quadrant of the return value.
  let az = Math.atan2(z, y) * RADIANS_TO_DEGREES
  if (az < 0.0) {
    az += 360.0
  }
  return az
}

function transformEquatorialToHorizontal ({ julianDay, targetCoords, siteCoords }) {
  if (!julianDay || !targetCoords || !siteCoords) {
    return null
  }
  return {
    azimuth: getHorizontalAzimuth({ julianDay: julianDay, targetCoords: targetCoords, siteCoords: siteCoords }),
    altitude: getHorizontalAltitude({ julianDay: julianDay, targetCoords: targetCoords, siteCoords: siteCoords })
  }
}

function transformMapPointToHorizontal ({ point, center, radius }) {
  const x = point.x - center.x
  const y = point.y - center.y
  const d = Math.pow(Math.pow(x, 2) + Math.pow(y, 2), 0.5)
  return {
    azimuth: Math.fmod(-1 * Math.atan2(y, x) * RADIANS_TO_DEGREES + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

function transformHorizontalToMapPoint ({ skyCoords, center, radius, validate }) {
  const validateValue = validate || true
  const x = (90.0 - skyCoords.altitude) * Math.cos((skyCoords.azimuth - 90.0) * DEGREES_TO_RADIANS) / 90.0 * radius
  const y = (90.0 - skyCoords.altitude) * Math.sin((skyCoords.azimuth - 90.0) * DEGREES_TO_RADIANS) / 90.0 * radius
  if (validateValue && (x > radius || y > radius || skyCoords.altitude < 0.0)) {
    return { x: 0, y: 0 }
  }
  return { x: Math.round(center.x + x), y: Math.round(center.y - y) }
}

function transformHorizontalToEquatorial ({ julianDayValue, skyCoords, siteCoords }) {
  if (!julianDayValue || !skyCoords || !siteCoords) {
    return null
  }

  const sinA = Math.sin(skyCoords.azimuth * DEGREES_TO_RADIANS)
  const cosA = Math.cos(skyCoords.azimuth * DEGREES_TO_RADIANS)
  const tanh = Math.tan(skyCoords.altitude * DEGREES_TO_RADIANS)
  const cosh = Math.cos(skyCoords.altitude * DEGREES_TO_RADIANS)
  const sinh = Math.sin(skyCoords.altitude * DEGREES_TO_RADIANS)

  const sinlat = Math.sin(siteCoords.latitude * DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * DEGREES_TO_RADIANS)

  const sindelta = sinlat * sinh - coslat * cosh * cosA
  const delta = Math.asin(sindelta) * RADIANS_TO_DEGREES

  const HA = Math.atan2(sinA, cosA * sinlat + tanh * coslat) * RADIANS_TO_HOURS

  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  let alpha = lmst - HA

  alpha = Math.fmod(alpha + 24.0, 24.0)

  return {
    rightAscension: alpha,
    declination: delta
  }
}

function getParallacticAngle ({ julianDayValue, skyCoords, siteCoords }) {
  const ra = skyCoords.right_ascension / 15.0 || skyCoords.rightAscension
  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  const hourAngle = lmst - ra

  const cosdec = Math.cos(skyCoords.declination * DEGREES_TO_RADIANS)
  let paralacticAngle = 0.0

  if (cosdec !== 0.0) {
    const cosha = Math.cos(hourAngle * HOURS_TO_RADIANS)
    const sinha = Math.sin(hourAngle * HOURS_TO_RADIANS)
    const tanlat = Math.tan(siteCoords.latitude * DEGREES_TO_RADIANS)
    const sindec = Math.sin(skyCoords.declination * DEGREES_TO_RADIANS)

    const y = sinha
    const x = tanlat * cosdec - sindec * cosha

    paralacticAngle = Math.atan2(y, x)
  } else {
    paralacticAngle = (siteCoords.latitude >= 0.0) ? Math.PI : 0.0
  }

  return paralacticAngle * RADIANS_TO_DEGREES
}

export default {
  transformEclipticToEquatorial,
  transformMapPointToHorizontal,
  transformHorizontalToMapPoint,
  transformEquatorialToHorizontal,
  transformHorizontalToEquatorial,
  getHorizontalAltitude,
  getHorizontalAzimuth,
  getParallacticAngle
}
