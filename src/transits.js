'use strict'
import constants from './constants'
import julianday from './julianday'
import utils from './utils'

// See AA. p 101
const STANDARD_ALTITUDE_STARS = -0.5667
const STANDARD_ALTITUDE_SUN = -0.8333

function getRiseSetTransitJulianDays (jdValue, targetCoordinates, siteCoordinates, altitude = STANDARD_ALTITUDE_STARS) {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const jdMidnight = (new julianday.JulianDay(jdValue)).midnightJulianDay()

  const result = {
    julianDayValueRise: undefined,
    julianDayValueTransit: undefined,
    julianDayValueSet: undefined,
    transitAltitude: undefined,
    isTransitAboveHorizon: undefined,
    isTransitAboveAltitude: undefined, // for when altitude is not that of horizon
    isCircumpolar: undefined // no transit, no rise, no set
  }

  // Calculate the Greenwhich sidereal time in degrees
  let theta0 = jdMidnight.localSiderealTime(0) * constants.HOURS_TO_DEGREES

  const sinh0 = Math.sin(altitude * constants.DEGREES_TO_RADIANS)
  const sinPhi = Math.sin(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const sinDelta = Math.sin(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)
  const cosPhi = Math.cos(siteCoordinates.latitude * constants.DEGREES_TO_RADIANS)
  const cosDelta = Math.cos(targetCoordinates.declination * constants.DEGREES_TO_RADIANS)

  // cosH = 1, that is H (hour angle) = 0
  result.transitAltitude = Math.asin(sinPhi * sinDelta + cosPhi * cosDelta) * constants.RADIANS_TO_DEGREES

  result.isTransitAboveHorizon = (result.transitAltitude > STANDARD_ALTITUDE_STARS)
  result.isTransitAboveAltitude = (result.transitAltitude > altitude)

  const m0 = (targetCoordinates.right_ascension + siteCoordinates.longitude - theta0) / 360
  result.julianDayValueTransit = jdMidnight.value + utils.MapTo0To1Range(m0)

  // Calculate cosH0. See AA Eq.15.1, p.102
  let cosH0 = (sinh0 - sinPhi * sinDelta) / (cosPhi * cosDelta)
  result.isCircumpolar = (Math.abs(cosH0) > 1)

  if (!result.isCircumpolar) {
    const H0 = Math.acos(cosH0) * constants.RADIANS_TO_DEGREES
    const m1 = m0 - H0 / 360
    const m2 = m0 + H0 / 360

    result.julianDayValueRise = jdMidnight.value + utils.MapTo0To1Range(m1)
    result.julianDayValueSet = jdMidnight.value + utils.MapTo0To1Range(m2)

    if (result.julianDayValueRise > result.julianDayValueTransit) {
      result.julianDayValueRise -= 1
    }

    if (result.julianDayValueSet < result.julianDayValueTransit) {
      result.julianDayValueSet += 1
    }
  }

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
  getRiseSetTransitJulianDays,
  getTransitAltitude
}
