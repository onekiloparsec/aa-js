/**
 @module Earth
 */
import { EarthPlanet } from '@/types'
import {
  getEccentricity,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEclipticLongitudinalRotation,
  getFlatteningCorrections,
  getLongitudeOfPerihelion,
  getMeanAnomaly,
  getRadiusVector
} from './coordinates'
import { Moon } from './moon'
import {
  getMeanObliquityOfEcliptic,
  getNutationInLongitude,
  getNutationInObliquity,
  getTrueObliquityOfEcliptic
} from './nutation'
import {
  getAccurateAnnualEquatorialAberration,
  getAnnualEclipticAberration,
  getAnnualEquatorialAberration,
  getEarthVelocity,
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
