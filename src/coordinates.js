import constants from './constants'
import julianday from './julianday'

function transformEclipticToEquatorial ({ Lambda, Beta, Epsilon }) {
  const LambdaRad = Lambda * constants.DEGREES_TO_RADIANS
  const BetaRad = Beta * constants.DEGREES_TO_RADIANS
  const EpsilonRad = Epsilon * constants.DEGREES_TO_RADIANS

  let rightAscension = (Math.atan2(Math.sin(LambdaRad) * Math.cos(EpsilonRad) -
    Math.tan(BetaRad) * Math.sin(EpsilonRad), Math.cos(LambdaRad)))

  rightAscension *= constants.RADIANS_TO_HOURS

  if (rightAscension < 0) {
    rightAscension += 24
  }

  let declination = Math.asin(Math.sin(BetaRad) * Math.cos(EpsilonRad) +
    Math.cos(BetaRad) * Math.sin(EpsilonRad) * Math.sin(LambdaRad))

  declination *= constants.RADIANS_TO_DEGREES

  return { rightAscension: rightAscension, declination: declination }
}

function getHorizontalAltitude ({ julianDayValue, targetCoords, siteCoords }) {
  if (!arguments || !julianDayValue || !targetCoords || !siteCoords) { return -1 }

  const ra = targetCoords.right_ascension / 15.0 || targetCoords.rightAscension
  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  const hourAngle = lmst - ra

  const cosdec = Math.cos(targetCoords.declination * constants.DEGREES_TO_RADIANS)
  const sindec = Math.sin(targetCoords.declination * constants.DEGREES_TO_RADIANS)
  const cosha = Math.cos(hourAngle * constants.DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * constants.DEGREES_TO_RADIANS)
  const sinlat = Math.sin(siteCoords.latitude * constants.DEGREES_TO_RADIANS)

  return Math.asin(sinlat * sindec + coslat * cosdec * cosha) * constants.RADIANS_TO_DEGREES
}

function getHorizontalAzimuth ({ julianDayValue, targetCoords, siteCoords }) {
  if (!julianDayValue || !targetCoords || !siteCoords) { return -1 }

  const ra = targetCoords.right_ascension / 15.0 || targetCoords.rightAscension
  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  const hourAngle = lmst - ra

  const sinha = Math.sin(hourAngle * constants.DEGREES_TO_RADIANS)
  const cosha = Math.cos(hourAngle * constants.DEGREES_TO_RADIANS)
  const sinlat = Math.sin(siteCoords.latitude * constants.DEGREES_TO_RADIANS)
  const tandec = Math.tan(targetCoords.declination * constants.DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * constants.DEGREES_TO_RADIANS)

  const y = cosha * sinlat - tandec * coslat
  const z = sinha
  // atan2(z, y) == arctan(z/y) using the signs of both arguments to determine the quadrant of the return value.
  let az = Math.atan2(z, y) * constants.RADIANS_TO_DEGREES
  if (az < 0.0) {
    az += 360.0
  }
  return az
}

function transformEquatorialToHorizontal ({ julianDay, targetCoords, siteCoords }) {
  if (!julianDay || !targetCoords || !siteCoords) { return null }
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
    azimuth: Math.fmod(-1 * Math.atan2(y, x) * constants.RADIANS_TO_DEGREES + 720 - 270, 360),
    altitude: 90.0 * (1 - d / radius)
  }
}

function transformHorizontalToMapPoint ({ skyCoords, center, radius, validate = true }) {
  const x = (90.0 - skyCoords.altitude) * Math.cos((skyCoords.azimuth - 90.0) * constants.DEGREES_TO_RADIANS) / 90.0 * radius
  const y = (90.0 - skyCoords.altitude) * Math.sin((skyCoords.azimuth - 90.0) * constants.DEGREES_TO_RADIANS) / 90.0 * radius
  if (validate && (x > radius || y > radius || skyCoords.altitude < 0.0)) {
    return { x: 0, y: 0 }
  }
  return { x: Math.round(center.x + x), y: Math.round(center.y - y) }
}

function transformHorizontalToEquatorial ({ julianDayValue, skyCoords, siteCoords }) {
  if (!julianDayValue || !skyCoords || !siteCoords) { return null }

  const sinA = Math.sin(skyCoords.azimuth * constants.DEGREES_TO_RADIANS)
  const cosA = Math.cos(skyCoords.azimuth * constants.DEGREES_TO_RADIANS)
  const tanh = Math.tan(skyCoords.altitude * constants.DEGREES_TO_RADIANS)
  const cosh = Math.cos(skyCoords.altitude * constants.DEGREES_TO_RADIANS)
  const sinh = Math.sin(skyCoords.altitude * constants.DEGREES_TO_RADIANS)

  const sinlat = Math.sin(siteCoords.latitude * constants.DEGREES_TO_RADIANS)
  const coslat = Math.cos(siteCoords.latitude * constants.DEGREES_TO_RADIANS)

  const sindelta = sinlat * sinh - coslat * cosh * cosA
  const delta = Math.asin(sindelta) * constants.RADIANS_TO_DEGREES

  const HA = Math.atan2(sinA, cosA * sinlat + tanh * coslat) * constants.RADIANS_TO_HOURS

  const lmst = julianday.getLocalSiderealTime(julianDayValue, siteCoords.longitude)
  let alpha = lmst - HA

  alpha = Math.fmod(alpha + 24.0, 24.0)

  return {
    rightAscension: alpha,
    declination: delta
  }
}

export default {
  transformEclipticToEquatorial,
  transformMapPointToHorizontal,
  transformHorizontalToMapPoint,
  transformEquatorialToHorizontal,
  transformHorizontalToEquatorial,
  getHorizontalAltitude,
  getHorizontalAzimuth
}
