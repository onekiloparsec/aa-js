import {
  AstronomicalUnit,
  EclipticCoordinates,
  EquatorialCoordinates,
  GeographicCoordinates,
  JulianDay,
  KilometerPerSecond,
  Obliquity,
  RiseTransitSet
} from '@/js/types'
import { Earth } from '@/js/earth'
import { transformEclipticToEquatorial } from '@/js/coordinates'
import {
  getPlanetApparentGeocentricEclipticCoordinates,
  getPlanetGeocentricDistance,
  getPlanetGeocentricEclipticCoordinates,
  getPlanetInstantaneousVelocity,
  getPlanetLengthOfEllipse,
  getPlanetVelocityAtAphelion,
  getPlanetVelocityAtPerihelion
} from '../elliptical'
import { getPlanetAccurateRiseTransitSet, getPlanetRiseTransitSet } from '../risetransitset'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { getEccentricity, getSemiMajorAxis } from './orbital'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {AstronomicalUnit}
 * @memberof module:Saturn
 */
 export function getGeocentricDistance (jd: JulianDay): AstronomicalUnit {
  return getPlanetGeocentricDistance(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Geocentric ecliptic coordinates
 * It takes NO account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Saturn
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return getPlanetGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Apparent geocentric ecliptic coordinates
 * It takes into account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EclipticCoordinates}
 * @memberof module:Saturn
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay): EclipticCoordinates {
  return getPlanetApparentGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Geocentric equatorial coordinates
 * It takes NO account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEquatorialCoordinates
 * @see getGeocentricEclipticCoordinates
 * @param {JulianDay} jd The julian day
 * @param {Obliquity} obliquity The obliquity of the ecliptic: Mean (default) or True.
 * @returns {EquatorialCoordinates}
 * @memberof module:Saturn
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Apparent geocentric apparent equatorial coordinates
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEquatorialCoordinates
 * @see getGeocentricEclipticCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 * @memberof module:Saturn
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentGeocentricEclipticCoordinates(jd), Earth.getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getInstantaneousVelocity (jd: JulianDay): KilometerPerSecond {
  return getPlanetInstantaneousVelocity(getRadiusVector(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getVelocityAtPerihelion (jd: JulianDay): KilometerPerSecond {
  return getPlanetVelocityAtPerihelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getVelocityAtAphelion (jd: JulianDay): KilometerPerSecond {
  return getPlanetVelocityAtAphelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {JulianDay} jd The julian day
 * @returns {AstronomicalUnit} The ellipse length
 * @memberof module:Saturn
 */
export function getLengthOfEllipse (jd: JulianDay): AstronomicalUnit {
  return getPlanetLengthOfEllipse(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Saturn
 */
export function getRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Saturn
 */
export function getAccurateRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}
