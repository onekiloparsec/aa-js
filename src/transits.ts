import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { AstronomicalUnit, Day, Degree, Hour, JulianDay, JupiterRadius, RiseSetTransit, SolarRadius } from './types'
import {
  DEG2RAD,
  H2DEG,
  H2RAD,
  ONE_JUPITER_RADIUS_IN_KILOMETERS,
  ONE_SOLAR_RADIUS_IN_KILOMETERS,
  ONE_UA_IN_KILOMETERS,
  RAD2DEG,
  STANDARD_ALTITUDE_STARS
} from './constants'
import { getDate, getJulianDay, getJulianDayMidnight, getLocalSiderealTime } from './juliandays'
import { fmod } from './utils'

dayjs.extend(utc)


const sin = Math.sin
const cos = Math.cos
const asin = Math.asin
const acos = Math.acos
const abs = Math.abs
const floor = Math.floor

/**
 * Compute the times of rise, set and transit of an object at a given date,
 * and observer's location on Earth.
 * @param {JulianDay} jd The julian day
 * @param {Hour} ra The equatorial right ascension of the object
 * @param {Degree} dec The The equatorial declination of the object
 * @param {Degree} lng The observer's longitude
 * @param {Degree} lat The observer's latitude
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 */
export function getRiseSetTransitTimes (jd: JulianDay, ra: Hour, dec: Degree, lng: Degree, lat: Degree, alt: Degree = STANDARD_ALTITUDE_STARS): RiseSetTransit {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const result: RiseSetTransit = {
    rise: {
      utc: undefined,
      julianDay: undefined
    },
    set: {
      utc: undefined,
      julianDay: undefined
    },
    transit: {
      utc: undefined,
      julianDay: undefined,
      altitude: undefined,
      refAltitude: alt,
      isAboveHorizon: false,
      isAboveAltitude: false, // for when altitude is not that of horizon
      isCircumpolar: false
    }
  }

  // Getting the UT 0h on day D. See AA p.102.
  const jd0 = getJulianDayMidnight(jd)

  // Calculate the Greenwich sidereal time in degrees
  let Theta0 = getLocalSiderealTime(jd0, 0) * H2DEG

  const sinh0 = sin(alt * DEG2RAD)
  const sinPhi = sin(lat * DEG2RAD)
  const sinDelta = sin(dec * DEG2RAD)
  const cosPhi = cos(lat * DEG2RAD)
  const cosDelta = cos(dec * DEG2RAD)

  // Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
  result.transit.altitude = asin(sinPhi * sinDelta + cosPhi * cosDelta) * RAD2DEG

  result.transit.isAboveHorizon = (result.transit.altitude > STANDARD_ALTITUDE_STARS)
  result.transit.isAboveAltitude = (result.transit.altitude > alt)

  // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
  // const m0 = (alpha2 + Longitude - Theta0) / 360
  // thus becomes:
  const m0 = fmod((ra * H2DEG - lng - Theta0) / 360, 1)
  result.transit.utc = m0 * 24

  const utcMoment = dayjs.utc(getDate(jd))
  const hourTransit = floor(result.transit.utc)
  const minuteTransit = result.transit.utc - hourTransit
  result.transit.julianDay = getJulianDay(utcMoment.hour(hourTransit).minute(minuteTransit * 60).toDate())

  // Calculate cosH0. See AA Eq.15.1, p.102
  let cosH0 = (sinh0 - sinPhi * sinDelta) / (cosPhi * cosDelta)
  result.transit.isCircumpolar = (abs(cosH0) > 1)

  if (!result.transit.isCircumpolar) {
    const H0 = acos(cosH0) * RAD2DEG
    result.rise.utc = fmod(m0 - H0 / 360, 1) * 24
    result.set.utc = fmod(m0 + H0 / 360, 1) * 24

    const hourRise = floor(result.rise.utc)
    const minuteRise = result.rise.utc - hourRise
    const hourSet = floor(result.set.utc)
    const minuteSet = result.set.utc - hourSet

    // Staying within a precision of a minute
    result.rise.julianDay = getJulianDay(utcMoment.hour(hourRise).minute(minuteRise * 60).toDate())
    result.set.julianDay = getJulianDay(utcMoment.hour(hourSet).minute(minuteSet * 60).toDate())
  }

  if (result.rise.julianDay && result.transit.julianDay && result.rise.julianDay > result.transit.julianDay) {
    result.rise.julianDay -= 1
  }
  if (result.set.julianDay && result.transit.julianDay && result.set.julianDay < result.transit.julianDay) {
    result.set.julianDay += 1
  }

  return result
}

// "Transit" has 2 meanings here !
// If transitJD is undefined, the altitude of the transit to the local meridian will be computed.
// If transitJD is provided, it is assumed to be the JD of which we want the local altitude.
// It can be that of a transit... or not.
export function getTransitAltitude (ra: Hour, dec: Degree, lng: Degree, lat: Degree, transitJD: JulianDay | undefined = undefined): Degree {
  // See AA. P.93 eq. 13.6 (and p.92 for H).
  let cosH = 1
  if (transitJD !== undefined && transitJD !== null) {
    const lmst = getLocalSiderealTime(transitJD, lng)
    cosH = cos((lmst - ra) * H2RAD)
  }
  return asin(sin(lat * DEG2RAD) * sin(dec * DEG2RAD) + cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cosH) * RAD2DEG
}

/**
 * Simple helper to find the Julian Day of the next transit after the given lower Julian Day
 * @param  {Number} lowerJD The lower julian day limit
 * @param  {Number} orbitalPeriod The orbital period of the system, in days.
 * @param  {Number} tZeroOfPrimaryTransit The Julian Day of the primary transit.
 * @returns {Number} The Julian Day of the next transit.
 */
export function nextTransitJulianDay (lowerJD: JulianDay, orbitalPeriod: Day, tZeroOfPrimaryTransit: JulianDay) {
  const n = Math.floor(1 + lowerJD / orbitalPeriod - tZeroOfPrimaryTransit / orbitalPeriod)
  return tZeroOfPrimaryTransit + n * orbitalPeriod
}

/**
 * Compute the details of an exoplanet transit
 * @param orbitalPeriod
 * @param lambdaAngle
 * @param timeOfPeriastron
 * @param eccentricity
 * @param radius
 * @param semiMajorAxis
 * @param parentStarRadius
 */
export function getExoplanetTransitDetails (orbitalPeriod: Day,
                                            lambdaAngle: Degree,
                                            timeOfPeriastron: JulianDay,
                                            eccentricity: number,
                                            radius: JupiterRadius,
                                            semiMajorAxis: AstronomicalUnit,
                                            parentStarRadius: SolarRadius) {
  let f = Math.PI / 2 - lambdaAngle * DEG2RAD
  const e = eccentricity
  const P = orbitalPeriod
  const E = 2.0 * Math.atan(Math.sqrt((1.0 - e) / (1.0 + e)) * Math.tan(f / 2.0))

  const Rstar = parentStarRadius * ONE_SOLAR_RADIUS_IN_KILOMETERS
  const Rplanet = radius * ONE_JUPITER_RADIUS_IN_KILOMETERS
  const a = semiMajorAxis * ONE_UA_IN_KILOMETERS
  const df = Math.asin(((Rstar + Rplanet) / a) / (1.0 - e * Math.cos(E)))

  f += df
  const M = E - e * Math.sin(E)
  // const t_M = P*M/(2*Math.PI)
  const duration = P * M / Math.PI

  const cycleCenter = P / (2 * Math.PI) * (E - e * Math.sin(E))

  let start = timeOfPeriastron + cycleCenter - duration / 2.0
  let end = timeOfPeriastron + cycleCenter + duration / 2.0
  let center = timeOfPeriastron + cycleCenter

  return { duration, start, center, end }
}
