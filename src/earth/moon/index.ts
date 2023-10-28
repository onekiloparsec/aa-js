import { NaturalMoon } from '@/types'
import {
  getApparentEquatorialCoordinates,
  getArgumentOfLatitude,
  getEclipticCoordinates,
  getEclipticLatitude,
  getEclipticLongitude,
  getEquatorialCoordinates,
  getMeanAnomaly,
  getMeanElongation,
  getMeanLongitude,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  getRadiusVector,
  horizontalParallax,
  horizontalParallaxToRadiusVector,
  radiusVectorToHorizontalParallax,
  trueLongitudeOfAscendingNode
} from './coordinates'
import {
  getEquatorialHorizontalParallax,
  getIlluminatedFraction,
  getPhaseAngle,
  getPositionAngleOfTheBrightLimb
} from './details'

export const Moon: NaturalMoon = {
  getMeanLongitude,
  getMeanElongation,
  getMeanAnomaly,
  getArgumentOfLatitude,
  getEclipticLongitude,
  getEclipticLatitude,
  getEclipticCoordinates,
  getRadiusVector,
  radiusVectorToHorizontalParallax,
  horizontalParallaxToRadiusVector,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  trueLongitudeOfAscendingNode,
  horizontalParallax,
  getEquatorialCoordinates,
  getApparentEquatorialCoordinates,
  getPhaseAngle,
  getIlluminatedFraction,
  getEquatorialHorizontalParallax,
  getPositionAngleOfTheBrightLimb
}
