'use strict'
import constants from './constants'

function getRiseSetTransitTimes (JD, targetCoordinates, siteCoordinates, altitude = 0) {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  // const alpha0 = targetCoordinates.right_ascension || targetCoordinates.alpha
  // const delta0 = targetCoordinates.declination || targetCoordinates.delta

  return 0
}

function getTransitAltitude (targetCoordinates, siteCoordinates) {
  // See AA. P.93 eq. 13.6 when H = 0
  const sinPhi = Math.sin(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const sinDelta = Math.sin(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)
  const cosPhi = Math.cos(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const cosDelta = Math.cos(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)
  return Math.asin(sinPhi * sinDelta + cosPhi * cosDelta) * constants.RADIANS_TO_DEGREES
}

export default {
  getRiseSetTransitTimes,
  getTransitAltitude
}
