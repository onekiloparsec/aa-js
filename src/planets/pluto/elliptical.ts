import { AstronomicalUnit, EclipticCoordinates, GeographicCoordinates, JulianDay, RiseTransitSet } from '@/types'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getTrueObliquityOfEcliptic } from '@/earth/nutation'
import { getPlanetGeocentricDistance, getPlanetGeocentricEclipticCoordinates } from '../elliptical'
import { getPlanetAccurateRiseTransitSet, getPlanetRiseTransitSet } from '../risetransitsets'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

/**
 * Geocentric distance (distance between the planet and Earth's center).
 * It takes into account the effects of aberration (light-time travel & Earth motion).
 * @see getEclipticCoordinates
 * @see getGeocentricEquatorialCoordinates
 * @param {JulianDay} jd The julian day
 * @returns {EquatorialCoordinates}
 */
export function getGeocentricDistance (jd: JulianDay | number): AstronomicalUnit {
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
export function getGeocentricEclipticCoordinates (jd: JulianDay | number): EclipticCoordinates {
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
export function getGeocentricEquatorialCoordinates (jd: JulianDay | number) {
  const geocentricEclipticCoordinates = getGeocentricEclipticCoordinates(jd)
  return transformEclipticToEquatorial(
    geocentricEclipticCoordinates.longitude,
    geocentricEclipticCoordinates.latitude,
    getTrueObliquityOfEcliptic(jd)
  )
}


/**
 * Computes the (low-accuracy but fast) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

/**
 * Computes the accurate (better than a minute) times of the rise, transit and set of the planet.
 * @param  {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer location.
 * @returns {AstronomicalUnit} The ellipse length
 */
export function getAccurateRiseTransitSet (jd: JulianDay | number, geoCoords: GeographicCoordinates): RiseTransitSet {
  return getPlanetAccurateRiseTransitSet(jd, geoCoords, getGeocentricEquatorialCoordinates)
}

