import {
  AstronomicalUnit,
  EclipticCoordinates,
  EquatorialCoordinates,
  GeographicCoordinates,
  JulianDay,
  Obliquity,
  RiseTransitSet
} from '@/types'
import { Earth } from '@/earth'
import { transformEclipticToEquatorial } from '@/coordinates'
import {
  getPlanetApparentGeocentricEclipticCoordinates,
  getPlanetGeocentricDistance,
  getPlanetGeocentricEclipticCoordinates
} from '../elliptical'
import { getPlanetAccurateRiseTransitSet, getPlanetRiseTransitSet } from '../risetransitset'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of light-time travel & Earth nutation and annual aberration.
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {AstronomicalUnit}
 * @memberof module:Pluto
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
 * @memberof module:Pluto
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
 * @memberof module:Pluto
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
 * @memberof module:Pluto
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
 * @memberof module:Pluto
 */
export function getApparentGeocentricEquatorialCoordinates (jd: JulianDay | number, highPrecision: boolean = true): EquatorialCoordinates {
  return transformEclipticToEquatorial(
    getApparentGeocentricEclipticCoordinates(jd, highPrecision),
    Earth.getTrueObliquityOfEcliptic(jd, highPrecision),
    highPrecision
  )
}

/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Pluto
 */
export function getRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {RiseTransitSet} The rise, transit and set times
 * @memberof module:Pluto
 */
export function getAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

