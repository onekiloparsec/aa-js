/**
 @module Pluto
 */
import { DwarfPlanet } from '@/types'
import {
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants } from './constants'
import {
  getEquatorialSemiDiameter,
  getIlluminatedFraction,
  getMagnitude,
  getPhaseAngle,
  getPolarSemiDiameter
} from './details'
import {
  getAccurateRiseTransitSet,
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getRiseTransitSet,
} from './elliptical'

export const Pluto: DwarfPlanet = {
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getApparentGeocentricEclipticCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  getRiseTransitSet,
  getAccurateRiseTransitSet,
  getRadiusVector,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  constants
}
