import Decimal from 'decimal.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Degree, Hour, JulianDay, LengthArray, RiseSetTransit } from '@/types'
import { DEG2RAD, H2DEG, MINUSONE, RAD2DEG, STANDARD_ALTITUDE_STARS } from '@/constants'
import { getJulianDayMidnight, getLocalSiderealTime } from '@/juliandays'
import { fmod, fmod180, fmod360, getJDatUTC } from '@/utils'
import { getDeltaT } from '@/times'

dayjs.extend(utc)


// See AA p24
function getInterpolatedValue (y1: Decimal | number, y2: Decimal | number, y3: Decimal | number, n: Decimal | number): Decimal {
  const a = new Decimal(y2).minus(y1)
  const b = new Decimal(y3).minus(y2)
  const c = b.minus(a)
  const dn = new Decimal(n)
  return new Decimal(y2).plus((dn.dividedBy(2)).mul(a.plus(b).plus(dn.mul(c))))
}

// See AA, p102
function getMTimes (jd: JulianDay | number, ra: Hour | number, dec: Degree | number, lng: Degree | number, lat: Degree | number, alt: Degree | number = STANDARD_ALTITUDE_STARS): {
  m0: Decimal,
  m1: Decimal | undefined,
  m2: Decimal | undefined,
  isCircumpolar: boolean,
  altitude: Degree,
  cosH0: Decimal
} {
  // Getting the UT 0h on day D. See AA p.102.
  // It is not equal to the expected "0h Dynamical Time" of the coordinates ra and dec.
  const jd0 = getJulianDayMidnight(jd)

  // Calculate the Greenwich sidereal time in degrees
  const Theta0 = getLocalSiderealTime(jd0, 0).mul(H2DEG)

  const sinh0 = Decimal.sin(new Decimal(alt).mul(DEG2RAD))
  const sinPhi = Decimal.sin(new Decimal(lat).mul(DEG2RAD))
  const sinDelta = Decimal.sin(new Decimal(dec).mul(DEG2RAD))
  const cosPhi = Decimal.cos(new Decimal(lat).mul(DEG2RAD))
  const cosDelta = Decimal.cos(new Decimal(dec).mul(DEG2RAD))

  const decRa = new Decimal(ra).mul(H2DEG)

  // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
  // const m0 = (alpha2 + Longitude - Theta0) / 360
  // thus becomes:
  const m0 = fmod((decRa.minus(lng).minus(Theta0)).dividedBy(360), 1)

  // Calculate cosH0. See AA Eq.15.1, p.102
  const cosH0 = (sinh0.minus(sinPhi.mul(sinDelta))).dividedBy(cosPhi.mul(cosDelta))
  const isCircumpolar = (Decimal.abs(cosH0).toNumber() > 1)

  // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
  const H: Degree = fmod180(Theta0.plus(lng).minus(decRa))
  const altitude = Decimal.asin(sinPhi.mul(sinDelta).plus(cosPhi.mul(cosDelta).mul(H.mul(DEG2RAD).cos()))).mul(RAD2DEG)

  const result = {
    m0, // transit
    m1: undefined,  // rise
    m2: undefined, // set,
    isCircumpolar,
    altitude,
    cosH0
  }

  if (!isCircumpolar) {
    const H0 = Decimal.acos(cosH0).mul(RAD2DEG).dividedBy(360)
    // @ts-ignore
    result.m1 = fmod(m0.minus(H0), 1)
    // @ts-ignore
    result.m2 = fmod(m0.plus(H0), 1)
  }

  return result
}

function getDeltaMTimes (m: Decimal,
                         isTransit: boolean,
                         Theta0: Degree,
                         DeltaT: Decimal,
                         ra: LengthArray<Degree, 3>,
                         dec: LengthArray<Degree, 3>,
                         lng: Degree,
                         lat: Degree,
                         alt: Degree = STANDARD_ALTITUDE_STARS): {
  Deltam: Decimal,
  hourAngle: Degree
  localAltitude: Degree
} {
  const theta0: Degree = fmod360(Theta0.plus(new Decimal(360.985647).mul(m)))
  const n = m.plus(DeltaT.dividedBy(86400))
  const alpha: Degree = getInterpolatedValue(ra[0], ra[1], ra[2], n)
  const delta: Degree = getInterpolatedValue(dec[0], dec[1], dec[2], n)
  const H: Degree = fmod180(theta0.plus(lng).minus(alpha))
  const dlat = new Decimal(lat).mul(DEG2RAD)
  // Below is the horizontal altitude for given hour angle.
  const sinh = dlat.sin().mul(delta.mul(DEG2RAD).sin()).plus(dlat.cos().mul(delta.mul(DEG2RAD).cos()).mul(H.mul(DEG2RAD).cos()))
  const h = sinh.asin().mul(RAD2DEG)
  return {
    Deltam: (isTransit) ?
      MINUSONE.mul(H).dividedBy(360) :
      (h.minus(alt)).dividedBy(delta.cos().mul(dlat.cos()).mul(H.sin()).mul(360)),
    hourAngle: H,
    localAltitude: h
  }
}

/**
 * Compute the times of rise, set and transit of an object at a given date,
 * and observer's location on Earth. It runs multiple iterations to obtain an accurate
 * result which should be below the minute.
 * @param {JulianDay} jd The julian day
 * @param {[Hour, Hour, Hour]} ra The equatorial right ascension of the object
 * @param {[Degree, Degree, Degree]} dec The The equatorial declination of the object
 * @param {Degree} lng The observer's longitude
 * @param {Degree} lat The observer's latitude
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 * @param {number} iterations Positive number of iterations to use in computations, Default = 1.
 */
export function getAccurateRiseSetTransitTimes (jd: JulianDay | number,
                                                ra: LengthArray<Hour | number, 3>,
                                                dec: LengthArray<Degree | number, 3>,
                                                lng: Degree | number,
                                                lat: Degree | number,
                                                alt: Degree | number = STANDARD_ALTITUDE_STARS,
                                                iterations: number = 1): RiseSetTransit {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  // @ts-ignore
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
      refAltitude: new Decimal(alt),
      isAboveHorizon: false,
      isAboveAltitude: false,
      isCircumpolar: false,
      internals: {
        m0: undefined,
        cosH0: undefined
      }
    }
  }

  // Getting the UT 0h on day D. See AA p.102.
  const jd0 = getJulianDayMidnight(jd)

  // Calculate the Greenwich sidereal time in degrees
  const Theta0 = getLocalSiderealTime(jd0, 0).mul(H2DEG)
  const mTimes = getMTimes(jd, ra[1], dec[1], lng, lat, alt)

  result.transit.utc = mTimes.m0.mul(24)
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
  result.transit.altitude = mTimes.altitude

  result.transit.internals.m0 = mTimes.m0
  result.transit.internals.cosH0 = mTimes.cosH0

  result.transit.isCircumpolar = mTimes.isCircumpolar
  result.transit.isAboveHorizon = (mTimes.altitude.greaterThan(STANDARD_ALTITUDE_STARS))
  result.transit.isAboveAltitude = (mTimes.altitude.greaterThan(alt))

  if (!mTimes.isCircumpolar) {
    const DeltaT = getDeltaT(jd)
    const decRa = ra.map(v => new Decimal(v).mul(H2DEG)) as LengthArray<Degree, 3>
    const decDec = dec.map(v => new Decimal(v)) as LengthArray<Degree, 3>
    const [decLng, decLat, decAlt] = [new Decimal(lng), new Decimal(lat), new Decimal(alt)]

    for (let i = 0; i < iterations; i++) {
      const deltaMTimes0 = getDeltaMTimes(mTimes.m0, true, Theta0, DeltaT, decRa, decDec, decLng, decLat, decAlt)
      const deltaMTimes1 = getDeltaMTimes(mTimes.m1!, false, Theta0, DeltaT, decRa, decDec, decLng, decLat, decAlt)
      const deltaMTimes2 = getDeltaMTimes(mTimes.m2!, false, Theta0, DeltaT, decRa, decDec, decLng, decLat, decAlt)
      mTimes.altitude = mTimes.m0.plus(deltaMTimes0.localAltitude)
      mTimes.m0 = mTimes.m0.plus(deltaMTimes0.Deltam)
      mTimes.m1 = mTimes.m1!.plus(deltaMTimes1.Deltam)
      mTimes.m2 = mTimes.m2!.plus(deltaMTimes2.Deltam)
    }

    result.transit.altitude = mTimes.altitude
    result.transit.utc = mTimes.m0.mul(24)
    result.rise.utc = mTimes.m1!.mul(24)
    result.set.utc = mTimes.m2!.mul(24)

    result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
    result.rise.julianDay = getJDatUTC(jd, result.rise.utc!)
    result.set.julianDay = getJDatUTC(jd, result.set.utc!)

    // It should not be modified, but just in case...
    result.transit.isCircumpolar = mTimes.isCircumpolar
    result.transit.isAboveHorizon = (mTimes.altitude.greaterThan(STANDARD_ALTITUDE_STARS))
    result.transit.isAboveAltitude = (mTimes.altitude.greaterThan(alt))

    if (result.rise.julianDay && result.transit.julianDay && result.rise.julianDay.greaterThan(result.transit.julianDay)) {
      result.rise.julianDay = result.rise.julianDay.minus(1)
    }
    if (result.set.julianDay && result.transit.julianDay && result.set.julianDay.lessThan(result.transit.julianDay)) {
      result.set.julianDay = result.set.julianDay.plus(1)
    }
  }

  return result
}

/**
 * Compute the times of rise, set and transit of an object at a given date,
 * and observer's location on Earth. It runs a low accuracy algoritm (very similar to the accurate ones,
 * but without iterations).
 * @see getAccurateRiseSetTransitTimes
 * @param {JulianDay} jd The julian day
 * @param {Hour} ra The equatorial right ascension of the object
 * @param {Degree} dec The The equatorial declination of the object
 * @param {Degree} lng The observer's longitude
 * @param {Degree} lat The observer's latitude
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 */
export function getRiseSetTransitTimes (jd: JulianDay | number,
                                        ra: Hour | number,
                                        dec: Degree | number,
                                        lng: Degree | number,
                                        lat: Degree | number,
                                        alt: Degree | number = STANDARD_ALTITUDE_STARS): RiseSetTransit {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  // @ts-ignore
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
      refAltitude: new Decimal(alt),
      isAboveHorizon: false,
      isAboveAltitude: false,
      isCircumpolar: false,
      internals: {
        m0: undefined,
        cosH0: undefined
      }
    }
  }

  // Calculate the Greenwich sidereal time in degrees
  const mTimes = getMTimes(jd, ra, dec, lng, lat, alt)
  result.transit.altitude = mTimes.altitude
  result.transit.utc = mTimes.m0.mul(24)
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)

  result.transit.internals.m0 = mTimes.m0
  result.transit.internals.cosH0 = mTimes.cosH0

  result.transit.isCircumpolar = mTimes.isCircumpolar
  result.transit.isAboveHorizon = (mTimes.altitude.greaterThan(STANDARD_ALTITUDE_STARS))
  result.transit.isAboveAltitude = (mTimes.altitude.greaterThan(alt))

  if (!mTimes.isCircumpolar) {
    result.rise.utc = mTimes.m1!.mul(24)
    result.set.utc = mTimes.m2!.mul(24)

    result.rise.julianDay = getJDatUTC(jd, result.rise.utc!)
    result.set.julianDay = getJDatUTC(jd, result.set.utc!)

    if (result.rise.julianDay && result.transit.julianDay && result.rise.julianDay.greaterThan(result.transit.julianDay)) {
      result.rise.julianDay = result.rise.julianDay.minus(1)
    }
    if (result.set.julianDay && result.transit.julianDay && result.set.julianDay.lessThan(result.transit.julianDay)) {
      result.set.julianDay = result.set.julianDay.plus(1)
    }
  }

  return result
}
