import { MinorPlanet } from '@/types'
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
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
} from './elliptical'

// I know, this is a minor planet...
export const Pluto: MinorPlanet = {
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getGeocentricDistance,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getRadiusVector,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  constants
}
