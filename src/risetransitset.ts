/**
 @module RiseTransitSet
 */
import Decimal from '@/decimal'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  Degree,
  EquatorialCoordinates,
  GeographicCoordinates,
  JulianDay,
  LengthArray,
  Radian,
  RiseTransitSet
} from '@/types'
import { DEG2RAD, MINUSONE, STANDARD_ALTITUDE_STARS } from '@/constants'
import { getJulianDayMidnight, getLocalSiderealTime } from '@/juliandays'
import { fmod, fmod180, fmod360, getJDatUTC } from '@/utils'
import { getDeltaT } from '@/times'

dayjs.extend(utc)


// See AA p24
function getInterpolatedValue (v1: Decimal | number, v2: Decimal | number, v3: Decimal | number, n: Decimal | number): Decimal {
  const a = new Decimal(v2).minus(v1)
  const b = new Decimal(v3).minus(v2)
  const c = b.minus(a)
  const dn = new Decimal(n)
  return new Decimal(v2).plus((dn.dividedBy(2)).mul(a.plus(b).plus(dn.mul(c))))
}

type MTimes = {
  m0: Decimal | undefined,
  m1: Decimal | undefined,
  m2: Decimal | undefined,
  isCircumpolar: boolean | undefined,
  altitude: Degree | undefined,
  cosH0: Decimal | undefined
}

// See AA, p102
function getMTimes (jd: JulianDay | number,
                    equCoords: EquatorialCoordinates,
                    geoCoords: GeographicCoordinates,
                    alt: Degree | number = STANDARD_ALTITUDE_STARS,
                    highPrecision: boolean = true): MTimes {
  // Getting the UT 0h on day D. See AA p.102.
  // It is not equal to the expected "0h Dynamical Time" of the coordinates ra and dec.
  const jd0: JulianDay = getJulianDayMidnight(jd)

  // Calculate the Greenwich sidereal time in degrees
  const Theta0: Degree = getLocalSiderealTime(jd0, 0, highPrecision).hoursToDegrees()

  const result: MTimes = {
    m0: undefined, // transit
    m1: undefined,  // rise
    m2: undefined, // set,
    isCircumpolar: undefined,
    altitude: undefined,
    cosH0: undefined
  }

  if (highPrecision) {
    const decRa: Degree = new Decimal(equCoords.rightAscension)

    // Algorithms in AA use Positive West longitudes. The formula (15.2, p102):
    // "const m0 = (alpha2 + Longitude - Theta0) / 360" thus becomes:
    result.m0 = fmod((decRa.minus(geoCoords.longitude).minus(Theta0)).dividedBy(360), 1)

    const sinh0: Radian = Decimal.sin(new Decimal(alt).degreesToRadians())
    const sinPhi: Radian = Decimal.sin(new Decimal(geoCoords.latitude).degreesToRadians())
    const sinDelta: Radian = Decimal.sin(new Decimal(equCoords.declination).degreesToRadians())
    const cosPhi: Radian = Decimal.cos(new Decimal(geoCoords.latitude).degreesToRadians())
    const cosDelta: Radian = Decimal.cos(new Decimal(equCoords.declination).degreesToRadians())

    // Calculate cosH0. See AA Eq.15.1, p.102
    result.cosH0 = (sinh0.minus(sinPhi.mul(sinDelta))).dividedBy(cosPhi.mul(cosDelta))
    result.isCircumpolar = (Decimal.abs(result.cosH0).toNumber() > 1)

    // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
    const H: Degree = fmod180(Theta0.plus(geoCoords.longitude).minus(decRa))
    result.altitude = Decimal.asin(
      sinPhi.mul(sinDelta).plus(cosPhi.mul(cosDelta).mul(H.degreesToRadians().cos()))
    ).radiansToDegrees()
  } else {
    const ra = Decimal.isDecimal(equCoords.rightAscension) ? equCoords.rightAscension.toNumber() : equCoords.rightAscension
    const lng = Decimal.isDecimal(geoCoords.longitude) ? geoCoords.longitude.toNumber() : geoCoords.longitude
    result.m0 = fmod((ra - lng - Theta0.toNumber()) / 360, 1)

    const dec = Decimal.isDecimal(equCoords.declination) ? equCoords.declination.toNumber() : equCoords.declination
    const lat = Decimal.isDecimal(geoCoords.latitude) ? geoCoords.latitude.toNumber() : geoCoords.latitude
    const nalt = Decimal.isDecimal(alt) ? alt.toNumber() : alt
    const deg2rad = DEG2RAD.toNumber()

    const sinh0 = Math.sin(nalt * deg2rad)
    const sinPhi = Math.sin(lat * deg2rad)
    const sinDelta = Math.sin(dec * deg2rad)
    const cosPhi = Math.cos(lat * deg2rad)
    const cosDelta = Math.cos(dec * deg2rad)

    // Calculate cosH0. See AA Eq.15.1, p.102
    result.cosH0 = new Decimal(
      (sinh0 - (sinPhi * sinDelta)) / (cosPhi * cosDelta)
    )
    result.isCircumpolar = (Decimal.abs(result.cosH0).toNumber() > 1)

    // Transit altitude: Equ 13.6, AA p93, with cosH = 1, that is H (hour angle) = 0
    const H = fmod180(Theta0.plus(geoCoords.longitude).minus(ra)).toNumber()
    result.altitude = new Decimal(
      Math.asin(
        sinPhi * sinDelta + cosPhi * cosDelta * Math.cos(H * deg2rad)
      ) / deg2rad
    )
  }

  if (!result.isCircumpolar) {
    const H0 = Decimal.acos(result.cosH0!).radiansToDegrees().dividedBy(360)
    // @ts-ignore
    result.m1 = fmod(result.m0!.minus(H0), 1)
    // @ts-ignore
    result.m2 = fmod(result.m0!.plus(H0), 1)
  }

  return result
}

function getDeltaMTimes (m: Decimal,
                         isTransit: boolean,
                         Theta0: Degree,
                         DeltaT: Decimal,
                         equCoords: LengthArray<EquatorialCoordinates, 3>,
                         geoCoords: GeographicCoordinates,
                         alt: Degree | number = STANDARD_ALTITUDE_STARS): {
  Deltam: Decimal,
  hourAngle: Degree,
  localAltitude: Degree
} {
  const theta0: Degree = fmod360(Theta0.plus(new Decimal(360.985647).mul(m)))
  const n = m.plus(DeltaT.dividedBy(86400))

  const alpha: Degree = getInterpolatedValue(equCoords[0].rightAscension, equCoords[1].rightAscension, equCoords[2].rightAscension, n)
  const delta: Degree = getInterpolatedValue(equCoords[0].declination, equCoords[1].declination, equCoords[2].declination, n)

  const H: Degree = fmod180(theta0.plus(geoCoords.longitude).minus(alpha))
  const dlat = new Decimal(geoCoords.latitude).degreesToRadians()

  // Below is the horizontal altitude for given hour angle.
  const sinh = dlat.sin()
    .mul(delta.degreesToRadians().sin())
    .plus(dlat.cos()
      .mul(delta.degreesToRadians().cos())
      .mul(H.degreesToRadians().cos()))

  const h = sinh.asin().radiansToDegrees()
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
 * @param {LengthArray<EquatorialCoordinates, 3>} equCoords A series of consecutive equatorial coordinates separated
 * by one day, centered on day of interest.
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 * @param {number} iterations Positive number of iterations to use in computations, Default = 1.
 */
export function getAccurateRiseTransitSetTimes (jd: JulianDay | number,
                                                equCoords: LengthArray<EquatorialCoordinates, 3>,
                                                geoCoords: GeographicCoordinates,
                                                alt: Degree | number = STANDARD_ALTITUDE_STARS,
                                                iterations: number = 1): RiseTransitSet {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const result: RiseTransitSet = {
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
  const Theta0 = getLocalSiderealTime(jd0, 0).hoursToDegrees()
  const mTimes = getMTimes(jd, equCoords[1], geoCoords, alt)

  result.transit.utc = mTimes.m0!.mul(24)
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
  result.transit.altitude = mTimes.altitude

  result.transit.internals.m0 = mTimes.m0
  result.transit.internals.cosH0 = mTimes.cosH0

  result.transit.isCircumpolar = mTimes.isCircumpolar!
  result.transit.isAboveHorizon = (mTimes.altitude!.greaterThan(STANDARD_ALTITUDE_STARS))
  result.transit.isAboveAltitude = (mTimes.altitude!.greaterThan(alt))

  if (!mTimes.isCircumpolar) {
    const DeltaT = getDeltaT(jd)
    for (let i = 0; i < iterations; i++) {
      const deltaMTimes0 = getDeltaMTimes(mTimes.m0!, true, Theta0, DeltaT, equCoords, geoCoords, alt)
      const deltaMTimes1 = getDeltaMTimes(mTimes.m1!, false, Theta0, DeltaT, equCoords, geoCoords, alt)
      const deltaMTimes2 = getDeltaMTimes(mTimes.m2!, false, Theta0, DeltaT, equCoords, geoCoords, alt)
      mTimes.altitude = mTimes.m0!.plus(deltaMTimes0.localAltitude)
      mTimes.m0 = mTimes.m0!.plus(deltaMTimes0.Deltam)
      mTimes.m1 = mTimes.m1!.plus(deltaMTimes1.Deltam)
      mTimes.m2 = mTimes.m2!.plus(deltaMTimes2.Deltam)
    }

    result.transit.altitude = mTimes.altitude
    result.transit.utc = mTimes.m0!.mul(24)
    result.rise.utc = mTimes.m1!.mul(24)
    result.set.utc = mTimes.m2!.mul(24)

    result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
    result.rise.julianDay = getJDatUTC(jd, result.rise.utc!)
    result.set.julianDay = getJDatUTC(jd, result.set.utc!)

    // It should not be modified, but just in case...
    result.transit.isCircumpolar = mTimes.isCircumpolar!
    result.transit.isAboveHorizon = (mTimes.altitude!.greaterThan(STANDARD_ALTITUDE_STARS))
    result.transit.isAboveAltitude = (mTimes.altitude!.greaterThan(alt))

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
 * @see getAccurateRiseTransitSetTimes
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} equCoords The equatorial coordinates of the day of interest.
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {RiseTransitSet}
 */
export function getRiseTransitSetTimes (jd: JulianDay | number,
                                        equCoords: EquatorialCoordinates,
                                        geoCoords: GeographicCoordinates,
                                        alt: Degree | number = STANDARD_ALTITUDE_STARS,
                                        highPrecision: boolean = true): RiseTransitSet {
  // We assume the target coordinates are the mean equatorial coordinates for the epoch and equinox J2000.0.
  // Furthermore, we assume we don't need to take proper motion to take into account. See AA p135.

  const result: RiseTransitSet = {
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
  const mTimes = getMTimes(jd, equCoords, geoCoords, alt, highPrecision)
  result.transit.altitude = mTimes.altitude
  result.transit.utc = mTimes.m0!.mul(24)
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)

  result.transit.internals.m0 = mTimes.m0
  result.transit.internals.cosH0 = mTimes.cosH0

  result.transit.isCircumpolar = mTimes.isCircumpolar!
  result.transit.isAboveHorizon = (mTimes.altitude!.greaterThan(STANDARD_ALTITUDE_STARS))
  result.transit.isAboveAltitude = (mTimes.altitude!.greaterThan(alt))

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
