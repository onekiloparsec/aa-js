import {
  getApparentEquatorialCoordinates,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getRadiusVector
} from './coordinates'
import { constants, getAphelion, getPerihelion } from './planetaryBase'
import {
  getEquatorialSemiDiameter,
  getIlluminatedFraction,
  getMagnitude,
  getPhaseAngle,
  getPlanetaryDetails,
  getPolarSemiDiameter
} from './planetaryDetails'
import { Planet } from '@/types'

export const Uranus: Planet = {
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
  getPolarSemiDiameter
}
