/**
 @module RiseTransitSet
 */

import { Degree, EquatorialCoordinates, GeographicCoordinates, JulianDay, LengthArray, RiseTransitSet } from '@/types'
import { getJulianDayMidnight, getLocalSiderealTime } from '@/juliandays'
import { H2DEG, STANDARD_ALTITUDE_STARS } from '@/constants'
import { getDeltaT } from '@/times'
import { getDeltaMTimes } from './deltamtimes'
import { getMTimes, MTimes } from './mtimes'
import { getJDatUTC } from './utils'
import { fmod360 } from '@/utils'

/** @private */
/**
 * Adjusts a sequence of three equatorial coordinates' right ascensions for interpolation,
 * ensuring continuity across the 0h/24h boundary, per AA 2ed pg 30 "Important Remark 2"
 * notes for interpolation, 
 *
 * **This function modifies the input array in place** 
 * 
 * > As remarked in PJ Naughter's release notes for  -  an RA sequence must account for the jump to 0h at 24 hours
 * The solution here, based on soln from AA+ v1.36 & v1.79, assumes
 * - the coords are in chronological order, jd-1, jd, jd+1
 * - that the true ra step is <= 12 hours (true for most astronomical objects)
 *
 * @param {LengthArray<EquatorialCoordinates, 3>} eqCoords 
 */
function correctCoordsForInterpolation(eqCoords: LengthArray<EquatorialCoordinates, 3>) {
  
  let ra1 = fmod360(eqCoords[0].rightAscension)
  let ra2 = fmod360(eqCoords[1].rightAscension)
  let ra3 = fmod360(eqCoords[2].rightAscension)
  let changed = false
  function unwrapCoords(alpha1: number, alpha2: number) {
    if (Math.abs(alpha2 - alpha1) <= 180) return [alpha1, alpha2]
    changed = true
    if (alpha2 > alpha1) {
      alpha1 += 360
    } else {
      alpha2 += 360
    }
    return [alpha1, alpha2]
  }
  
  [ra1, ra2] = unwrapCoords(ra1, ra2);
  [ra2, ra3] = unwrapCoords(ra2, ra3);
  if (!changed) return; // don't do the loop again if we don't need to
  // need to run again, because ra2 may have
  // shifted relative to the others
  [ra1, ra2] = unwrapCoords(ra1, ra2);
  [ra2, ra3] = unwrapCoords(ra2, ra3);
  
  // modify the coordinates inplace
  eqCoords[0].rightAscension = ra1
  eqCoords[1].rightAscension = ra2
  eqCoords[2].rightAscension = ra3
  
}


/**
 * Compute the times of rise, set and transit of an object at a given date,
 * and observer's location on Earth. It runs multiple iterations to obtain an accurate
 * result which should be below the minute.
 * @param {JulianDay} jd The julian day
 * @param {LengthArray<EquatorialCoordinates, 3>} equCoords A series of consecutive apparent equatorial coordinates
 * separated by one day, centered on day of interest, at midnight Dynamical Time
 * (see juliandays.getJulianDayMidnightDynamicalTime).
 * @param {GeographicCoordinates} geoCoords The observer's location.
 * @param {Degree} alt The local altitude of the object's center to consider
 * for rise and set times. It's value isn't 0. For stars, it is affected by
 * aberration (value = -0.5667 degree)
 * @param {number} iterations Positive number of iterations to use in computations, Default = 1.
 * @return {RiseTransitSet}
 */
export function getAccurateRiseTransitSetTimes (jd: JulianDay,
                                                equCoords: LengthArray<EquatorialCoordinates, 3>,
                                                geoCoords: GeographicCoordinates,
                                                alt: Degree = STANDARD_ALTITUDE_STARS,
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
      refAltitude: alt,
      isAboveHorizon: false,
      isAboveAltitude: false,
      isCircumpolar: false,
      internals: {
        m0: undefined,
        cosH0: undefined
      }
    }
  }
  
  correctCoordsForInterpolation(equCoords)
  
  // Getting the UT 0h on day D. See AA p.102.
  const jd0 = getJulianDayMidnight(jd)
  
  // Calculate the Greenwich sidereal time in degrees
  const Theta0 = getLocalSiderealTime(jd0, 0) * H2DEG
  const mTimes = getMTimes(jd, equCoords[1], geoCoords, alt) as MTimes
  
  result.transit.utc = mTimes.m0! * 24
  result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
  result.transit.altitude = mTimes.altitude
  
  result.transit.internals.m0 = mTimes.m0
  result.transit.internals.cosH0 = mTimes.cosH0
  
  result.transit.isCircumpolar = mTimes.isCircumpolar!
  result.transit.isAboveHorizon = (mTimes.altitude! > STANDARD_ALTITUDE_STARS)
  result.transit.isAboveAltitude = (mTimes.altitude! > alt)
  
  if (!mTimes.isCircumpolar) {
    const DeltaT = getDeltaT(jd)
    for (let i = 0; i < iterations; i++) {
      const deltaMTimes0 = getDeltaMTimes(mTimes.m0!, true, Theta0, DeltaT, equCoords, geoCoords, alt)
      const deltaMTimes1 = getDeltaMTimes(mTimes.m1!, false, Theta0, DeltaT, equCoords, geoCoords, alt)
      const deltaMTimes2 = getDeltaMTimes(mTimes.m2!, false, Theta0, DeltaT, equCoords, geoCoords, alt)
      mTimes.altitude = mTimes.m0! + deltaMTimes0.localAltitude
      mTimes.m0 = mTimes.m0! + deltaMTimes0.Deltam
      mTimes.m1 = mTimes.m1! + deltaMTimes1.Deltam
      mTimes.m2 = mTimes.m2! + deltaMTimes2.Deltam
    }
    
    result.transit.altitude = mTimes.altitude
    result.transit.utc = mTimes.m0! * 24
    result.rise.utc = mTimes.m1! * 24
    result.set.utc = mTimes.m2! * 24
    
    result.transit.julianDay = getJDatUTC(jd, result.transit.utc!)
    result.rise.julianDay = getJDatUTC(jd, result.rise.utc!)
    result.set.julianDay = getJDatUTC(jd, result.set.utc!)
    
    // It should not be modified, but just in case...
    result.transit.isCircumpolar = mTimes.isCircumpolar!
    result.transit.isAboveHorizon = (mTimes.altitude! > STANDARD_ALTITUDE_STARS)
    result.transit.isAboveAltitude = (mTimes.altitude! > alt)
    
    if (result.rise.julianDay && result.transit.julianDay && result.rise.julianDay > result.transit.julianDay) {
      result.rise.julianDay = result.rise.julianDay - 1
    }
    if (result.set.julianDay && result.transit.julianDay && result.set.julianDay < result.transit.julianDay) {
      result.set.julianDay = result.set.julianDay + 1
    }
  }
  
  return result
}
