import { NaturalMoon } from '@/types'
import {
  getApparentGeocentricEquatorialCoordinates,
  getArgumentOfLatitude,
  getGeocentricEclipticCoordinates,
  getGeocentricEclipticLatitude,
  getGeocentricEclipticLongitude,
  getGeocentricEquatorialCoordinates,
  getMeanAnomaly,
  getMeanElongation,
  getMeanLongitude,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  getRadiusVectorInKilometer,
  horizontalParallax,
  horizontalParallaxToRadiusVector,
  radiusVectorToHorizontalParallax,
  trueLongitudeOfAscendingNode
} from './coordinates'
import {
  getEquatorialHorizontalParallax,
  getGeocentricSemiDiameter,
  getIlluminatedFraction,
  getPhaseAngle,
  getPositionAngleOfTheBrightLimb
} from './details'
import { getAge, getAgeName, getTimeOfMeanPhase } from './phases'

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
  getRadiusVectorInKilometer,
  radiusVectorToHorizontalParallax,
  horizontalParallaxToRadiusVector,
  getMeanLongitudeAscendingNode,
  getMeanLongitudePerigee,
  trueLongitudeOfAscendingNode,
  horizontalParallax,
  getPhaseAngle,
  getIlluminatedFraction,
  getEquatorialHorizontalParallax,
  getGeocentricSemiDiameter,
  getPositionAngleOfTheBrightLimb,
  getTimeOfMeanPhase,
  getAge,
  getAgeName
}
