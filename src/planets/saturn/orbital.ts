import { Degree, Equinox, JulianDay } from '@/types'
import {
  getPlanetEccentricity,
  getPlanetInclination,
  getPlanetLongitudeOfAscendingNode,
  getPlanetLongitudeOfPerihelion,
  getPlanetMeanLongitude,
  getPlanetSemiMajorAxis
} from '../orbital'
import { orbitalElements } from './constants'


/**
 * Computes the orbit mean longitude at a given time.
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree} The mean longitude
 * @memberof module:Saturn
 */
export function getMeanLongitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return getPlanetMeanLongitude(jd, orbitalElements[equinox].meanLongitude)
}

/**
 * Computes the orbit semi major axis at a given time.
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The semi major axis
 * @memberof module:Saturn
 */
export function getSemiMajorAxis (jd: JulianDay): Degree {
  return getPlanetSemiMajorAxis(jd, orbitalElements.semiMajorAxis)
}

/**
 * Computes the orbit eccentricity
 * @param  {JulianDay} jd The julian day
 * @returns {Degree} The orbit eccentricity
 * @memberof module:Saturn
 */
export function getEccentricity (jd: JulianDay): number {
  return getPlanetEccentricity(jd, orbitalElements.eccentricity)
}

/**
 * Computes the orbit inclination
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree} The orbit inclination
 * @memberof module:Saturn
 */
export function getInclination (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return getPlanetInclination(jd, orbitalElements[equinox].inclination)
}

/**
 * Computes the longitude of the ascending node
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree} The longitude of ascending node
 * @memberof module:Saturn
 */
export function getLongitudeOfAscendingNode (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return getPlanetLongitudeOfAscendingNode(jd, orbitalElements[equinox].longitudeOfAscendingNode)
}

/**
 * Computes the longitude of the perihelion
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used: MeanOfTheDate (default) or StandardJ2000.
 * @returns {Degree} The longitude of perihelion
 * @memberof module:Saturn
 */
export function getLongitudeOfPerihelion (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  return getPlanetLongitudeOfPerihelion(jd, orbitalElements[equinox].longitudeOfPerihelion)
}
