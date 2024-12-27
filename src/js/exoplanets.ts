/**
 @module Exoplanets
 */
import {
  AstronomicalUnit,
  Day,
  Degree,
  EquatorialCoordinates,
  GeographicCoordinates,
  JulianDay,
  JupiterRadius,
  Kilometer,
  Radian,
  SolarRadius
} from '@/js/types'
import { DEG2RAD, ONE_UA_IN_KILOMETERS, PI, PIHALF, RAD2DEG } from '@/js/constants'
import { getLocalSiderealTime } from '@/js/juliandays'
import { Jupiter } from '@/js/planets'
import { Sun } from '@/js/sun'


/**
 * Simple helper to find the Julian Day of the next transit after the given lower Julian Day
 * @param  {Number} lowerJD The lower julian day limit
 * @param  {Number} orbitalPeriod The orbital period of the system, in days.
 * @param  {Number} tZeroOfTransit The Julian Day of the primary|secondary transit.
 * @returns {Number} The Julian Day of the next transit.
 */
export function julianDayOfNextTransit (lowerJD: JulianDay, orbitalPeriod: Day, tZeroOfTransit: JulianDay) {
  const n = Math.floor(1 + (lowerJD / orbitalPeriod) - (tZeroOfTransit / orbitalPeriod))
  return tZeroOfTransit + (n * orbitalPeriod)
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
  let f = PIHALF - lambdaAngle * DEG2RAD
  const e = eccentricity
  const P = orbitalPeriod
  const E = 2 * (Math.atan(Math.sqrt((1 - e) / (1 + e))) * Math.tan(f / 2))
  
  const Rstar: Kilometer = parentStarRadius * Sun.constants.equatorialRadius
  const Rplanet: Kilometer = radius * Jupiter.constants.equatorialRadius
  const a: Kilometer = semiMajorAxis * ONE_UA_IN_KILOMETERS
  
  const df: Radian = Math.asin(((Rstar + Rplanet) / a) / (1 - e * Math.cos(E)))
  f = f + df
  
  const M = E - e * Math.sin(E)
  // const t_M = P*M/(2*Math.PI)
  const duration = P * M / PI
  
  const cycleCenter = P / (2 * PI) * (E - e * Math.sin(E))
  
  const center = timeOfPeriastron + cycleCenter
  const start = center - duration / 2
  const end = center + duration / 2
  
  return { duration, start, center, end }
}


// If transitJD is undefined, the altitude of the transit to the local meridian will be computed.
// If transitJD is provided, it is assumed to be the JD of which we want the local altitude.
// It can be that of a transit... or not.
export function getTransitAltitude (equCoords: EquatorialCoordinates, geoCoords: GeographicCoordinates, transitJD: JulianDay | undefined = undefined): Degree {
  // See AA. P.93 eq. 13.6 (and p.92 for H).
  let cosH = 1
  if (transitJD !== undefined && transitJD !== null) {
    const lmst = getLocalSiderealTime(transitJD, geoCoords.longitude)
    cosH = Math.cos((lmst - equCoords.rightAscension) * DEG2RAD)
  }
  const dlat = geoCoords.latitude * DEG2RAD
  const ddec = geoCoords.latitude * DEG2RAD
  return Math.asin(
    Math.sin(dlat) * Math.sin(ddec) + Math.cos(dlat) * Math.cos(ddec) * cosH
  ) * RAD2DEG
}
