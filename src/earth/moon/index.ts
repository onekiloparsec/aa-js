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

import { getEquatorialHorizontalParallax, getIlluminatedFraction, getPhaseAngle } from './details'
import { NaturalMoon } from '@/types'

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
  getEquatorialHorizontalParallax
}
