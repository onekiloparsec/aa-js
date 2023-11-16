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
 * @memberof module:Saturn
 */
 export function getGeocentricDistance (jd: JulianDay | number, highPrecision: boolean = true): AstronomicalUnit {
  return getPlanetGeocentricDistance(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector, highPrecision)
}

/**
 * Geocentric ecliptic coordinates
 * It takes NO account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Saturn
 */
export function getGeocentricEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return getPlanetGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector, highPrecision)
}

/**
 * Apparent geocentric ecliptic coordinates
 * It takes into account for the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EclipticCoordinates}
 * @memberof module:Saturn
 */
export function getApparentGeocentricEclipticCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EclipticCoordinates {
  return getPlanetApparentGeocentricEclipticCoordinates(jd, getEclipticLongitude, getEclipticLatitude, getRadiusVector, highPrecision)
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
 * @memberof module:Saturn
 */
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number, obliquity: Obliquity = Obliquity.Mean, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getGeocentricEclipticCoordinates(jd, highPrecision),
    (obliquity === Obliquity.Mean) ? Earth.getMeanObliquityOfEcliptic(jd, highPrecision) : Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
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
 * @memberof module:Saturn
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentGeocentricEclipticCoordinates(jd, highPrecision),
    Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
}

/**
 * Computes the object instantaneous velocity in the orbit
 * @param  {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getInstantaneousVelocity (jd: JulianDay | number, highPrecision: boolean = true): KilometerPerSecond {
  return getPlanetInstantaneousVelocity(getRadiusVector(jd, highPrecision), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at perihelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getVelocityAtPerihelion (jd: JulianDay | number): KilometerPerSecond {
  return getPlanetVelocityAtPerihelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's velocity at aphelion
 * @param  {JulianDay} jd The julian day
 * @returns {KilometerPerSecond} The velocity
 * @memberof module:Saturn
 */
export function getVelocityAtAphelion (jd: JulianDay | number): KilometerPerSecond {
  return getPlanetVelocityAtAphelion(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the object's length of orbit ellipse
 * @param  {JulianDay} jd The julian day
 * @returns {AstronomicalUnit} The ellipse length
 * @memberof module:Saturn
 */
export function getLengthOfEllipse (jd: JulianDay | number): AstronomicalUnit {
  return getPlanetLengthOfEllipse(getEccentricity(jd), getSemiMajorAxis(jd))
}

/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Saturn
 */
export function getRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, highPrecision: boolean = true): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates, highPrecision)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Saturn
 */
export function getAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates, highPrecision: boolean = true): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates, highPrecision)
}
