import {
  AstronomicalUnit,
  EclipticCoordinates,
  EquatorialCoordinates,
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
import { getPlanetAccurateRiseTransitSet, getPlanetRiseTransitSet } from '../risetransitset'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import { getEccentricity, getSemiMajorAxis } from './orbital'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {AstronomicalUnit}
 * @memberof module:Neptune
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
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Neptune
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
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Neptune
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
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Neptune
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay, obliquity: Obliquity = Obliquity.Mean): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd) : Earth.getTrueObliquityOfEcliptic(jd),
    highPrecision
  )
}

/**
 * Apparent geocentric apparent equatorial coordinates
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEquatorialCoordinates
 * @see getGeocentricEclipticCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 * @memberof module:Neptune
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentGeocentricEclipticCoordinates(jd),
    Earth.getTrueObliquityOfEcliptic(jd),
    highPrecision
  )
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Neptune
 */
export function getInstantaneousVelocity (jd: JulianDay): KilometerPerSecond {
  return getPlanetInstantaneousVelocity(getRadiusVector(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Neptune
 */
export function getVelocityAtPerihelion (jd: JulianDay): KilometerPerSecond {
  return getPlanetVelocityAtPerihelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Neptune
 */
export function getVelocityAtAphelion (jd: JulianDay): KilometerPerSecond {
  return getPlanetVelocityAtAphelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {JulianDay} jd The julian day
 * @returns {AstronomicalUnit} The ellipse length
 * @memberof module:Neptune
 */
export function getLengthOfEllipse (jd: JulianDay): AstronomicalUnit {
  return getPlanetLengthOfEllipse(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Neptune
 */
export function getRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Neptune
 */
export function getAccurateRiseTransitSet (jd: JulianDay, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}
