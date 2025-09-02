import {
  EclipticCoordinatesAtJulianDayFunction,
  EclipticCoordinatesAtJulianDayWithEquinoxFunction,
  EquatorialCoordinatesAtJulianDayFunction,
  EquatorialCoordinatesAtJulianDayWithObliquityFunction,
  QuantityAtJulianDayFunction,
  QuantityInArcSecondAtJulianDayFunction,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  QuantityInDegreeAtJulianDayFunction,
  SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
} from './funcs'

export enum Obliquity {
  Mean = 'Mean',
  True = 'True'
}

export enum Equinox {
  MeanOfTheDate = 'MeanOfTheDate',
  StandardJ2000 = 'StandardJ2000'
}

export interface NaturalMoon {
  getGeocentricElongation: QuantityInDegreeAtJulianDayFunction
  getMeanLongitude: QuantityInDegreeAtJulianDayFunction
  getMeanElongation: QuantityInDegreeAtJulianDayFunction
  getMeanAnomaly: QuantityInDegreeAtJulianDayFunction
  getArgumentOfLatitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLongitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLatitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getRadiusVectorInKilometer: QuantityInAstronomicalUnitAtJulianDayFunction
  radiusVectorToHorizontalParallax: Function
  horizontalParallaxToRadiusVector: Function
  getMeanLongitudeAscendingNode: QuantityInDegreeAtJulianDayFunction
  getMeanLongitudePerigee: QuantityInDegreeAtJulianDayFunction
  trueLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayFunction
  horizontalParallax: QuantityInDegreeAtJulianDayFunction
  getPhaseAngle: QuantityInDegreeAtJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getEquatorialHorizontalParallax: QuantityInDegreeAtJulianDayFunction
  getGeocentricSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getPositionAngleOfTheBrightLimb: QuantityInDegreeAtJulianDayFunction
  getTimeOfMeanPhase: Function
  getAge: QuantityAtJulianDayFunction,
  getAgeName: Function
}

export interface NaturalEarth {
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getEclipticLongitudinalRotation: Function
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayWithEquinoxFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  getFlatteningCorrections: Function
  getMeanAnomaly: QuantityAtJulianDayFunction
  getEccentricity: QuantityAtJulianDayFunction
  getLongitudeOfPerihelion: QuantityInDegreeAtJulianDayFunction
  getNutationInLongitude: QuantityInArcSecondAtJulianDayFunction
  getNutationInObliquity: QuantityInArcSecondAtJulianDayFunction
  getMeanObliquityOfEcliptic: QuantityInDegreeAtJulianDayFunction
  getTrueObliquityOfEcliptic: QuantityInDegreeAtJulianDayFunction
  getEarthVelocity: Function
  getAccurateAnnualEquatorialAberration: Function
  getAnnualEclipticAberration: Function
  getAnnualEquatorialAberration: Function
  getNutationEquatorialAberration: Function
  Moon: NaturalMoon
}
