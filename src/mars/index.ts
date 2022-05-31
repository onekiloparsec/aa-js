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
import { getPlanetocentricDeclinationOfTheEarth, getPlanetocentricDeclinationOfTheSun } from './marsDetails'
import { MarsPlanet } from '../types'

export const Mars: MarsPlanet = {
  getEclipticLongitude,
  getEclipticLatitude,
  getRadiusVector,
  getEclipticCoordinates,
  getEquatorialCoordinates,
  getApparentEquatorialCoordinates,
  getAphelion,
  getPerihelion,
  constants,
  getPhaseAngle,
  getIlluminatedFraction,
  getMagnitude,
  getEquatorialSemiDiameter,
  getPolarSemiDiameter,
  getPlanetaryDetails,
  getPlanetocentricDeclinationOfTheSun,
  getPlanetocentricDeclinationOfTheEarth
}
