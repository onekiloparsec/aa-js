import { EarthPlanet } from '@/types'
import {
  getEccentricity,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEclipticLongitudeRange,
  getFlatteningCorrections,
  getMeanAnomaly,
  getRadiusVector,
  getLongitudeOfPerihelion
} from './coordinates'
import { Moon } from './moon'
import {
  getMeanObliquityOfEcliptic,
  getNutationInLongitude,
  getNutationInObliquity,
  getTrueObliquityOfEcliptic
} from './nutation'
import {
  getAccurateEquatorialAberration,
  getEarthVelocity,
  getEclipticAberration,
  getEquatorialAberration
} from './aberration'

export const Earth: EarthPlanet = {
  getEclipticLongitude,
  getEclipticLongitudeRange,
  getEclipticLatitude,
  getEclipticCoordinates,
  getRadiusVector,
  getFlatteningCorrections,
  getMeanAnomaly,
  getEccentricity,
  getLongitudeOfPerihelion,
  getNutationInLongitude,
  getNutationInObliquity,
  getMeanObliquityOfEcliptic,
  getTrueObliquityOfEcliptic,
  getEarthVelocity,
  getEclipticAberration,
  getEquatorialAberration,
  getAccurateEquatorialAberration,
  Moon
}
