'use strict'
import constants from './constants'
import julianday from './julianday'

function getRiseSetTransitTimes (jdValue, targetCoordinates, siteCoordinates, altitude = 0) {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const jd = julianday.JulianDay(jdValue).getMidnightJulianDay()

  const result = {
    isRiseValid: false,
    isSetValid: false,
    isTransitValid: false,
    isIsTransitAboveHorizon: false,
    hoursRise: 0, // Expressed in UT
    hoursSet: 0, // Expressed in UT
    hoursTransit: 0 // Expressed in UT
  }

  // Calculate the Greenwhich sidereal time
  let theta0 = jd.getLocalSiderealTime(0)
  theta0 *= 15 // Express it as degrees

  // Convert values to radians
  const Delta2Rad = targetCoordinates.declination * constants.DEGREES_TO_RADIANS
  const LatitudeRad = siteCoordinates.latitude * constants.DEGREES_TO_RADIANS

  // Convert the standard latitude to radians
  const h0Rad = altitude * constants.DEGREES_TO_RADIANS

  // Calculate cosH0. See AA Eq.15.1, p.102
  let cosH0 = (Math.sin(h0Rad) - Math.sin(LatitudeRad) * Math.sin(Delta2Rad)) / (Math.cos(LatitudeRad) * Math.cos(Delta2Rad))
  if (cosH0 < -1) {
    cosH0 += 1
  } else if (cosH0 > 1) {
    cosH0 -= 1
  }

  const H0 = Math.acos(cosH0) * constants.RADIANS_TO_DEGREES
  const m0 = (targetCoordinates.right_ascension + siteCoordinates.longitude - theta0) / 360
  const m1 = m0 - H0 / 360
  const m2 = m0 + H0 / 360

  result.hoursRise = jd.value + m1
  result.hoursSet = jd.value + m2
  result.hoursTransit = jd.value + m0

  return result
}

function getRAInHours (targetCoordinates) {
  let ra = targetCoordinates.right_ascension
  if (targetCoordinates['right_ascension_units'] && targetCoordinates['right_ascension_units'].toLowerCase().substring(0, 3) === 'deg') {
    ra = ra / 15
  }
  return ra
}

// "Transit" has 2 meanings here !
// If transitJD is undefined, the altitude of the transit to the local meridian will be computed.
// If transitJD is provided, it is assumed to be the JD of which we want the local altitude.
// It can be that of a transit... or not.
function getTransitAltitude (targetCoordinates, siteCoordinates, transitJD = undefined) {
  // See AA. P.93 eq. 13.6 (and p.92 for H).
  let cosH = 1
  if (transitJD !== undefined && transitJD !== null) {
    const lmst = julianday.getLocalSiderealTime(transitJD, siteCoordinates.longitude)
    const ra = this.getRAInHours(targetCoordinates)
    cosH = Math.cos((lmst - ra) * constants.HOURS_TO_RADIANS)
  }
  const sinPhi = Math.sin(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const sinDelta = Math.sin(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)
  const cosPhi = Math.cos(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const cosDelta = Math.cos(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)
  return Math.asin(sinPhi * sinDelta + cosPhi * cosDelta * cosH) * constants.RADIANS_TO_DEGREES
}

export default {
  getRAInHours,
  getRiseSetTransitTimes,
  getTransitAltitude
}
