import { EarthPlanet } from '@/types'
import {
  getEccentricity,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEclipticLongitudinalRotation,
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
  getEarthVelocity,
  getAccurateAnnualEquatorialAberration,
  getAnnualEclipticAberration,
  getAnnualEquatorialAberration,
  getNutationEquatorialAberration
} from './aberration'

export const Earth: EarthPlanet = {
  getEclipticLongitude,
  getEclipticLongitudinalRotation,
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
  getAccurateAnnualEquatorialAberration,
  getAnnualEclipticAberration,
  getAnnualEquatorialAberration,
  getNutationEquatorialAberration,
  Moon
}
