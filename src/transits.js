import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import * as julianday from './julianday'
import { DEG2RAD, H2DEG, H2RAD, RAD2DEG } from './constants'
import { fmod } from './utils'

dayjs.extend(utc)

// See AA. p 101
const STANDARD_ALTITUDE_STARS = -0.5667
// const STANDARD_ALTITUDE_SUN = -0.8333
//

function riseSetTransitJulianDays (jdValue, targetCoordinates, siteCoordinates, altitude = STANDARD_ALTITUDE_STARS) {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const result = {
    utcRise: undefined,
    utcTransit: undefined,
    utcSet: undefined,
    julianDayRise: undefined,
    julianDayTransit: undefined,
    julianDaySet: undefined,
    transitAltitude: undefined,
    isTransitAboveHorizon: undefined,
    isTransitAboveAltitude: undefined, // for when altitude is not that of horizon
    isCircumpolar: undefined // no transit, no rise, no set
  }

  // Calculate the Greenwhich sidereal time in degrees
  let Theta0 = julianday.localSiderealTime(jdValue, 0) * H2DEG

  const sinh0 = Math.sin(altitude * DEG2RAD)
  const sinPhi = Math.sin(siteCoordinates.latitude * DEG2RAD)
  const sinDelta = Math.sin(targetCoordinates.declination * DEG2RAD)
  const cosPhi = Math.cos(siteCoordinates.latitude * DEG2RAD)
  const cosDelta = Math.cos(targetCoordinates.declination * DEG2RAD)

  // Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
  result.transitAltitude = Math.asin(sinPhi * sinDelta + cosPhi * cosDelta) * RAD2DEG

  result.isTransitAboveHorizon = (result.transitAltitude > STANDARD_ALTITUDE_STARS)
  result.isTransitAboveAltitude = (result.transitAltitude > altitude)

  // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
  // const m0 = (alpha2 + Longitude - Theta0) / 360
  // thus becomes:
  const m0 = fmod((targetCoordinates.right_ascension - siteCoordinates.longitude - Theta0) / 360, 1)
  result.utcTransit = m0 * 24

  const utcMoment = dayjs.utc(julianday.getDate(jdValue))
  const hourTransit = Math.floor(result.utcTransit)
  const minuteTransit = result.utcTransit - hourTransit
  result.julianDayTransit = julianday.getJulianDay(utcMoment.hour(hourTransit).minute(minuteTransit * 60).toDate())

  // Calculate cosH0. See AA Eq.15.1, p.102
  let cosH0 = (sinh0 - sinPhi * sinDelta) / (cosPhi * cosDelta)
  result.isCircumpolar = (Math.abs(cosH0) > 1)

  if (!result.isCircumpolar) {
    const H0 = Math.acos(cosH0) * RAD2DEG
    result.utcRise = fmod(m0 - H0 / 360, 1) * 24
    result.utcSet = fmod(m0 + H0 / 360, 1) * 24

    const hourRise = Math.floor(result.utcRise)
    const minuteRise = result.utcRise - hourRise
    const hourSet = Math.floor(result.utcSet)
    const minuteSet = result.utcSet - hourSet

    result.julianDayRise = julianday.getJulianDay(utcMoment.hour(hourRise).minute(minuteRise * 60).toDate())
    result.julianDaySet = julianday.getJulianDay(utcMoment.hour(hourSet).minute(minuteSet * 60).toDate())
  }

  if (result.julianDayRise > result.julianDayTransit) {
    result.julianDayRise -= 1
  }
  if (result.julianDaySet < result.julianDayTransit) {
    result.julianDaySet += 1
  }

  return result
}

function rAInHours (targetCoordinates) {
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
function transitAltitude (targetCoordinates, siteCoordinates, transitJD = undefined) {
  // See AA. P.93 eq. 13.6 (and p.92 for H).
  let cosH = 1
  if (transitJD !== undefined && transitJD !== null) {
    const lmst = julianday.localSiderealTime(transitJD, siteCoordinates.longitude)
    const ra = this.rAInHours(targetCoordinates)
    cosH = Math.cos((lmst - ra) * H2RAD)
  }
  const sinPhi = Math.sin(siteCoordinates.latitude * DEG2RAD)
  const sinDelta = Math.sin(targetCoordinates.declination * DEG2RAD)
  const cosPhi = Math.cos(siteCoordinates.latitude * DEG2RAD)
  const cosDelta = Math.cos(targetCoordinates.declination * DEG2RAD)
  return Math.asin(sinPhi * sinDelta + cosPhi * cosDelta * cosH) * RAD2DEG
}

export default {
  rAInHours,
  riseSetTransitJulianDays,
  transitAltitude
}
