import { EarthPlanet } from '@/types'
import {
  getEccentricity,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLatitudeJ2000,
  getEclipticLongitude,
  getEclipticLongitudeJ2000,
  getMeanAnomaly,
  getRadiusVector,
  getFlatteningCorrections,
} from './coordinates'
import { Moon } from './moon'

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
  Moon
}
