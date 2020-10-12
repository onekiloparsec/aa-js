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

const sin = Math.sin
const cos = Math.cos
const asin = Math.asin
const acos = Math.acos
const abs = Math.abs
const floor = Math.floor

export interface RiseSetTransit {
  utcRise: number | undefined,
  utcTransit: number | undefined,
  utcSet: number | undefined,
  julianDayRise: number | undefined,
  julianDayTransit: number | undefined,
  julianDaySet: number | undefined,
  transitAltitude: number | undefined,
  isTransitAboveHorizon: boolean,
  isTransitAboveAltitude: boolean, // for when altitude is not that of horizon
  isCircumpolar: boolean // no transit, no rise
}

export function riseSetTransitJulianDays(jd: number, ra: number, dec: number, lat: number, lng: number, alt: number = STANDARD_ALTITUDE_STARS): RiseSetTransit {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  let utcRise
  let utcTransit
  let utcSet
  let julianDayRise
  let julianDayTransit
  let julianDaySet
  let transitAltitude
  let isTransitAboveHorizon
  let isTransitAboveAltitude
  let isCircumpolar

  // Calculate the Greenwhich sidereal time in degrees
  let Theta0 = julianday.localSiderealTime(jd, 0) * H2DEG

  const sinh0 = sin(alt * DEG2RAD)
  const sinPhi = sin(lat * DEG2RAD)
  const sinDelta = sin(dec * DEG2RAD)
  const cosPhi = cos(lat * DEG2RAD)
  const cosDelta = cos(dec * DEG2RAD)

  // Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
  transitAltitude = asin(sinPhi * sinDelta + cosPhi * cosDelta) * RAD2DEG

  isTransitAboveHorizon = (transitAltitude > STANDARD_ALTITUDE_STARS)
  isTransitAboveAltitude = (transitAltitude > alt)

  // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
  // const m0 = (alpha2 + Longitude - Theta0) / 360
  // thus becomes:
  const m0 = fmod((ra * H2DEG - lng - Theta0) / 360, 1)
  utcTransit = m0 * 24

  const utcMoment = dayjs.utc(julianday.getDate(jd))
  const hourTransit = floor(utcTransit)
  const minuteTransit = utcTransit - hourTransit
  julianDayTransit = julianday.getJulianDay(utcMoment.hour(hourTransit).minute(minuteTransit * 60).toDate())

  // Calculate cosH0. See AA Eq.15.1, p.102
  let cosH0 = (sinh0 - sinPhi * sinDelta) / (cosPhi * cosDelta)
  isCircumpolar = (abs(cosH0) > 1)

  if (!isCircumpolar) {
    const H0 = acos(cosH0) * RAD2DEG
    utcRise = fmod(m0 - H0 / 360, 1) * 24
    utcSet = fmod(m0 + H0 / 360, 1) * 24

    const hourRise = floor(utcRise)
    const minuteRise = utcRise - hourRise
    const hourSet = floor(utcSet)
    const minuteSet = utcSet - hourSet

    julianDayRise = julianday.getJulianDay(utcMoment.hour(hourRise).minute(minuteRise * 60).toDate())
    julianDaySet = julianday.getJulianDay(utcMoment.hour(hourSet).minute(minuteSet * 60).toDate())
  }

  if (julianDayRise && julianDayTransit && julianDayRise > julianDayTransit) {
    julianDayRise -= 1
  }
  if (julianDaySet && julianDayTransit && julianDaySet < julianDayTransit) {
    julianDaySet += 1
  }

  return {
    utcRise,
    utcTransit,
    utcSet,
    julianDayRise,
    julianDayTransit,
    julianDaySet,
    transitAltitude,
    isTransitAboveHorizon,
    isTransitAboveAltitude,
    isCircumpolar
  }
}

// "Transit" has 2 meanings here !
// If transitJD is undefined, the altitude of the transit to the local meridian will be computed.
// If transitJD is provided, it is assumed to be the JD of which we want the local altitude.
// It can be that of a transit... or not.
export function transitAltitude(ra: number, dec: number, lat: number, lng: number, transitJD: number | undefined = undefined) {
  // See AA. P.93 eq. 13.6 (and p.92 for H).
  let cosH = 1
  if (transitJD !== undefined && transitJD !== null) {
    const lmst = julianday.localSiderealTime(transitJD, lng)
    cosH = cos((lmst - ra) * H2RAD)
  }
  return asin(sin(lat * DEG2RAD) * sin(dec * DEG2RAD) + cos(lat * DEG2RAD) * cos(dec * DEG2RAD) * cosH) * RAD2DEG
}
