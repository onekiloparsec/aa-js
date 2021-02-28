import { eclipticCoordinates, eclipticLatitude, eclipticLongitude, radiusVector } from './coordinates'
import { getAphelion, getPerihelion } from './planetaryBase'
import {
  getApparentDiameter,
  getIlluminatedFraction,
  getPlanetocentricDeclinationOfTheEarth,
  getPlanetocentricDeclinationOfTheSun
} from './marsDetails'

export {
  getAphelion,
  getPerihelion,
  eclipticLongitude,
  eclipticLatitude,
  radiusVector,
  eclipticCoordinates,
  getApparentDiameter,
  getIlluminatedFraction,
  getPlanetocentricDeclinationOfTheSun,
  getPlanetocentricDeclinationOfTheEarth
}