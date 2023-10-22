import { EarthPlanet } from '@/types'
import {
  getEccentricity,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLatitudeJ2000,
  getEclipticLongitude,
  getEclipticLongitudeJ2000,
  getFlatteningCorrections,
  getMeanAnomaly,
  getRadiusVector,
} from './coordinates'
import { Moon } from './moon'
import {
  getNutationInLongitude,
  getNutationInObliquity,
  getMeanObliquityOfEcliptic,
  getTrueObliquityOfEcliptic
} from './nutation'

export const Earth: EarthPlanet = {
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getRadiusVector,
  getFlatteningCorrections,
  getMeanAnomaly,
  getEclipticLongitudeJ2000,
  getEclipticLatitudeJ2000,
  getEccentricity,
  getNutationInLongitude,
  getNutationInObliquity,
  getMeanObliquityOfEcliptic,
  getTrueObliquityOfEcliptic,
  Moon
}
