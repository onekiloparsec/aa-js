import { Planet } from '@/types'
import {
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants, orbitalElements } from './constants'
import { getAphelion, getPerihelion } from './base'
import {
  getAccurateRiseTransitSet,
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getInstantaneousVelocity,
  getLengthOfEllipse,
  getRiseTransitSet,
  getVelocityAtAphelion,
  getVelocityAtPerihelion,
} from './elliptical'
import {
  getEquatorialSemiDiameter,
  getIlluminatedFraction,
  getMagnitude,
  getPhaseAngle,
  getPolarSemiDiameter
} from './details'
import {
  getEccentricity,
  getInclination,
  getLongitudeOfAscendingNode,
  getLongitudeOfPerihelion,
  getMeanLongitude
} from './orbital'

export const Neptune: Planet = {
  // Heliocentric coordinates
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getRadiusVector,
  // Geocentric coordinates
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getApparentGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  // Planet elliptical properties
  getInstantaneousVelocity,
  getVelocityAtPerihelion,
  getVelocityAtAphelion,
  getLengthOfEllipse,
  getRiseTransitSet,
  getAccurateRiseTransitSet,
  // Planet orbital properties
  getMeanLongitude,
  getEccentricity,
  getInclination,
  getLongitudeOfAscendingNode,
  getLongitudeOfPerihelion,
  // Planet base properties
  getAphelion,
  getPerihelion,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  // Fixed values
  constants,
  orbitalElements
}
