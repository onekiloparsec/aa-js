import {
  AstronomicalUnit,
  EclipticCoordinates,
  GeographicCoordinates,
  JulianDay,
  KilometerPerSecond,
  Obliquity,
  RiseTransitSet
} from '@/types'
import { Earth } from '@/earth'
import { transformEclipticToEquatorial } from '@/coordinates'
import {
  getPlanetApparentGeocentricEclipticCoordinates,
  getPlanetGeocentricDistance,
  getPlanetGeocentricEclipticCoordinates,
  getPlanetInstantaneousVelocity,
  getPlanetLengthOfEllipse,
  getPlanetVelocityAtAphelion,
  getPlanetVelocityAtPerihelion
} from '../elliptical'
import { getPlanetAccurateRiseTransitSet, getPlanetRiseTransitSet } from '../risetransitsets'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { getEccentricity, getSemiMajorAxis } from './orbital'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 * @memberof module:Uranus
 */
export function getGeocentricDistance (jd: JulianDay | number): AstronomicalUnit {
  return getPlanetGeocentricDistance(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Geocentric ecliptic coordinates
 * It takes NO account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 * @memberof module:Uranus
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
  return getPlanetGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
}

/**
 * Apparent geocentric ecliptic coordinates
 * It takes into account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 * @memberof module:Uranus
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
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
 * @memberof module:Uranus
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean) {
  const geocentricEclipticCoordinates = getGeocentricEclipticCoordinates(jd)
  return transformEclipticToEquatorial(
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude,
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
 * @memberof module:Uranus
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number) {
  const apparentGeocentricEclipticCoordinates = getApparentGeocentricEclipticCoordinates(jd)
  return transformEclipticToEquatorial(
    apparentGeocentricEclipticCoordinates.longitude,
    apparentGeocentricEclipticCoordinates.latitude,
    Earth.getTrueObliquityOfEcliptic(jd)
  )
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Uranus
 */
export function getInstantaneousVelocity (jd: JulianDay | number): KilometerPerSecond {
  return getPlanetInstantaneousVelocity(getRadiusVector(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Uranus
 */
export function getVelocityAtPerihelion (jd: JulianDay | number): KilometerPerSecond {
  return getPlanetVelocityAtPerihelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Uranus
 */
export function getVelocityAtAphelion (jd: JulianDay | number): KilometerPerSecond {
  return getPlanetVelocityAtAphelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {JulianDay} jd The julian day
 * @returns {AstronomicalUnit} The ellipse length
 * @memberof module:Uranus
 */
export function getLengthOfEllipse (jd: JulianDay | number): AstronomicalUnit {
  return getPlanetLengthOfEllipse(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Uranus
 */
export function getRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Uranus
 */
export function getAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}
