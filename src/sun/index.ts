/**
 @module Sun
 */
import { NaturalSun } from '@/types'
import { constants } from './constants'

import {
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEclipticLatitude,
  getApparentGeocentricEclipticLongitude,
  getEquationOfTheCenter,
  getGeocentricEclipticCoordinates,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticLongitude,
  getGeocentricEquatorialCoordinates,
  getGeometricEclipticLongitude,
  getGeometricFK5EclipticLatitude,
  getGeometricFK5EclipticLongitude,
  getMeanAnomaly,
  getMeanLongitudeReferredToMeanEquinoxOfDate,
  getTrueAnomaly,
  getVariationGeometricEclipticLongitude,
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
  getVariationGeometricEclipticLongitude,
  constants
}
