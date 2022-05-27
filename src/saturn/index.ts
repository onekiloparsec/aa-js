import {
  getApparentEquatorialCoordinates,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants, getAphelion, getPerihelion } from './planetaryBase'
import { getRingSystemDetails } from './ringSystem'
import {
  getEquatorialSemiDiameter,
  getIlluminatedFraction,
  getMagnitude,
  getPhaseAngle,
  getPlanetaryDetails,
  getPolarSemiDiameter
} from './planetaryDetails'

export * from './coordinates'
export * from './planetaryBase'
export * from './planetaryDetails'
export * from './ringSystem'

export default {
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getApparentEquatorialCoordinates,
  getAphelion,
  getPerihelion,
  constants,
  getRadiusVector,
  getPlanetaryDetails,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  getRingSystemDetails
}
