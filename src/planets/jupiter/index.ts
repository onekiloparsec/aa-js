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
import { getCentralMeridianLongitudes, getPlanetocentricDeclinationOfTheEarth, getPlanetocentricDeclinationOfTheSun } from './jupiterDetails'
import { JupiterPlanet } from '@/types'

export const Jupiter: JupiterPlanet = {
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
  getCentralMeridianLongitudes,
  getPlanetocentricDeclinationOfTheSun,
  getPlanetocentricDeclinationOfTheEarth
}

