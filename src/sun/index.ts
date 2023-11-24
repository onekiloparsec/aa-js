/**
 @module Sun
 */
import { NaturalSun } from '@/types'
import { constants } from './constants'

import {
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEclipticLatitude,
  getApparentGeocentricEclipticLongitude,
  getApparentGeocentricEquatorialCoordinates,
  getGeocentricEclipticCoordinates,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticLongitude,
  getGeocentricEquatorialCoordinates,
  getGeometricEclipticLongitude,
  getGeometricFK5EclipticLatitude,
  getGeometricFK5EclipticLongitude,
  getVariationGeometricEclipticLongitude,
  getRiseTransitSet,
} from './coordinates'

import {
  getEquationOfTheCenter,
  getMeanAnomaly,
  getMeanLongitudeReferredToMeanEquinoxOfDate,
  getTrueAnomaly,
} from './sun'

export const Sun: NaturalSun = {
  getMeanAnomaly,
  getTrueAnomaly,
  getEquationOfTheCenter,
  getMeanLongitudeReferredToMeanEquinoxOfDate,
  getGeometricEclipticLongitude,
  getGeocentricEclipticLongitude,
  getGeocentricEclipticLatitude,
  getGeometricFK5EclipticLongitude,
  getGeometricFK5EclipticLatitude,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getApparentGeocentricEclipticLongitude,
  getApparentGeocentricEclipticLatitude,
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  getVariationGeometricEclipticLongitude,
  getRiseTransitSet,
  constants
}
