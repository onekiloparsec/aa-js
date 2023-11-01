import { NaturalMoon } from '@/types'
import {
  getArgumentOfLatitude,
  getGeocentricEclipticCoordinates,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticLongitude,
  getGeocentricEquatorialCoordinates,
  getApparentGeocentricEquatorialCoordinates,
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
  getGeocentricEclipticLongitude,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticCoordinates,
  getGeocentricEquatorialCoordinates,
  getApparentGeocentricEquatorialCoordinates,
  getRadiusVector,
  radiusVectorToHorizontalParallax,
  horizontalParallaxToRadiusVector,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  trueLongitudeOfAscendingNode,
  horizontalParallax,
  getPhaseAngle,
  getIlluminatedFraction,
  getEquatorialHorizontalParallax,
  getPositionAngleOfTheBrightLimb
}
