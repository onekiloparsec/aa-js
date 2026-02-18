/**
 @module Saturn
 */
import { SaturnPlanet } from '@/types'
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
  getMeanLongitude,
  getSemiMajorAxis
} from './orbital'
import { getRingSystemDetails } from './ringSystem'

export const Saturn: SaturnPlanet = {
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
  getSemiMajorAxis,
  // Planet base properties
  getAphelion,
  getPerihelion,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  // Specific
  getRingSystemDetails,
  // Fixed values
  constants,
  orbitalElements
}
