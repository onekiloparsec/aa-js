import { Degree, Equinox, JulianDay } from '@/types'
import {
  getPlanetEccentricity,
  getPlanetInclination,
  getPlanetLongitudeOfAscendingNode,
  getPlanetLongitudeOfPerihelion,
  getPlanetMeanLongitude
} from '../orbital'
import { orbitalElements, orbitalElementsJ2000 } from './constants'

/**
 * Computes the orbit mean longitude at a given time.
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {Degree} The mean longitude
 */
export function getMeanLongitude (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): Degree {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetMeanLongitude(jd, elements)
}

/**
 * Computes the orbit eccentricity
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {Degree} The orbit eccentricity
 */
export function getEccentricity (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): number {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetEccentricity(jd, elements)
}

/**
 * Computes the orbit inclination
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {Degree} The orbit inclination
 */
export function getInclination (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): number {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetInclination(jd, elements)
}

/**
 * Computes the longitude of the ascending node
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {Degree} The longitude of ascending node
 */
export function getLongitudeOfAscendingNode (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): number {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetLongitudeOfAscendingNode(jd, elements)
}

/**
 * Computes the longitude of the perihelion
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {Degree} The longitude of perihelion
 */
export function getLongitudeOfPerihelion (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): number {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetLongitudeOfPerihelion(jd, elements)
}
