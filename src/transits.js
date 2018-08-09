'use strict'
import constants from './constants'
import jd from './julianday'

function getRiseSetTransitTimes (JD, targetCoordinates, siteCoordinates, altitude = 0) {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  // const alpha0 = targetCoordinates.right_ascension || targetCoordinates.alpha
  // const delta0 = targetCoordinates.declination || targetCoordinates.delta

  return 0
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
    const lmst = new jd.JulianDay(transitJD).getLocalSiderealTime(siteCoordinates.longitude)
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
