/**
 * Provide an Earth object, with functions attached to it to compute Earth's position and motion.
 * Provides methods for computing orbital elements, aberrations, nutations, etc.
 * A Moon object is also attached.
 *
 * @module Earth
 */
import { NaturalEarth } from '@/types'
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

/**
 * Provides an Earth object with functions to compute Earth's position and motion.
 * Includes methods for computing orbital elements, aberration, nutation, and more.
 * A Moon object is also attached for additional computations involving the Moon.
 *
 * @type {NaturalEarth}
 * @property {SingleCoordinateDegreeAtJulianDayWithEquinoxFunction} getEclipticLongitude - Calculate the Earth's ecliptic longitude.
 */
export const Earth: NaturalEarth = {
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

