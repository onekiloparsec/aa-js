import { Planet } from '@/types'
import {
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants, orbitalElements, orbitalElementsJ2000 } from './constants'
import { getAphelion, getPerihelion } from './base'
import {
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getInstantaneousVelocity,
  getLengthOfEllipse,
  getVelocityAtAphelion,
  getVelocityAtPerihelion
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

export const Venus: Planet = {
  // Heliocentric coordinates
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getRadiusVector,
  // Geocentric coordinates
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  // Planet elliptical properties
  getInstantaneousVelocity,
  getVelocityAtPerihelion,
  getVelocityAtAphelion,
  getLengthOfEllipse,
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
  orbitalElements,
  orbitalElementsJ2000,
}