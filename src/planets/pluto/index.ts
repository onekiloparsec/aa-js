import {
  getApparentEquatorialCoordinates,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants } from './planetaryBase'
import {
  getEquatorialSemiDiameter,
  getIlluminatedFraction,
  getMagnitude,
  getPhaseAngle,
  getPlanetaryDetails,
  getPolarSemiDiameter
} from './planetaryDetails'
import { Planet } from '../types'

// I know, this is a minor planet...
export const Pluto: Planet = {
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getApparentEquatorialCoordinates,
  constants,
  getRadiusVector,
  getPlanetaryDetails,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter
}
