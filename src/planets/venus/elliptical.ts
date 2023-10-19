import { AstronomicalUnit, EclipticCoordinates, Equinox, JulianDay, KilometerPerSecond } from '@/types'
import {
  getPlanetGeocentricDistance,
  getPlanetGeocentricEclipticCoordinates,
  getPlanetInstantaneousVelocity,
  getPlanetLengthOfEllipse,
  getPlanetVelocityAtAphelion,
  getPlanetVelocityAtPerihelion
} from '../elliptical'
import { orbitalElements, orbitalElementsJ2000 } from './constants'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { getEccentricity } from './orbital'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getTrueObliquityOfEcliptic } from '@/nutation'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of aberration (light-time travel & Earth motion).
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getGeocentricDistance (jd: JulianDay): AstronomicalUnit {
  return getPlanetGeocentricDistance(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Geocentric apparent ecliptic coordinates
 * It takes into account the effects of aberration (light-time travel & Earth motion).
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return getPlanetGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Geocentric apparent equatorial coordinates
 * It takes into account the effects of aberration (light-time travel & Earth motion) and Earth nutation
 * (through the use of True Obliquity of Ecliptic at the time of JD).
 * @see getEquatorialCoordinates
 * @see getGeocentricEclipticCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay) {
  const geocentricEclipticCoordinates = getGeocentricEclipticCoordinates(jd)
  return transformEclipticToEquatorial(
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude,
    getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {KilometerPerSecond} The velocity
 */
export function getInstantaneousVelocity (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): KilometerPerSecond {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetInstantaneousVelocity(getRadiusVector(jd), elements.semiMajorAxis)
}

/**
 * Computes the object's velocity at perihelion
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {KilometerPerSecond} The velocity
 */
export function getVelocityAtPerihelion (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): KilometerPerSecond {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetVelocityAtPerihelion(getEccentricity(jd, equinox), elements.semiMajorAxis)
}

/**
 * Computes the object's velocity at aphelion
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {KilometerPerSecond} The velocity
 */
export function getVelocityAtAphelion (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): KilometerPerSecond {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetVelocityAtAphelion(getEccentricity(jd, equinox), elements.semiMajorAxis)
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {JulianDay} jd The julian day
 * @param {Equinox} equinox (optional) The equinox to be used (MeanOfTheDate or StandardJ2000)
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getLengthOfEllipse (jd: JulianDay, equinox: Equinox = Equinox.MeanOfTheDate): AstronomicalUnit {
  const elements = (equinox === Equinox.MeanOfTheDate) ? orbitalElements : orbitalElementsJ2000
  return getPlanetLengthOfEllipse(getEccentricity(jd, equinox), elements.semiMajorAxis)
}
