import {
  EclipticCoordinatesAtJulianDayWithEquinoxFunction,
  EclipticCoordinatesAtJulianDayWithEquinoxWithPrecisionFunction,
  EclipticCoordinatesAtJulianDayWithPrecisionFunction,
  EquatorialCoordinatesAtJulianDayWithEquinoxFunction,
  EquatorialCoordinatesAtJulianDayWithObliquityWithPrecisionFunction,
  EquatorialCoordinatesAtJulianDayWithPrecisionFunction,
  QuantityAtJulianDayFunction,
  QuantityAtJulianDayWithPrecisionFunction,
  QuantityInArcSecondAtJulianDayWithPrecisionFunction,
  QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
  QuantityInDegreeAtJulianCenturyWithPrecisionFunction,
  QuantityInDegreeAtJulianDayFunction,
  QuantityInDegreeAtJulianDayWithPrecisionFunction,
  SingleCoordinateDegreeAtJulianDayWithEquinoxFunction,
  SingleCoordinateDegreeAtJulianDayWithEquinoxWithPrecisionFunction
} from './funcs'
import { Kilometer } from './units'
import Decimal from '@/decimal'


export enum Obliquity {
  Mean = 'Mean',
  True = 'True'
}

export enum Equinox {
  MeanOfTheDate = 'MeanOfTheDate',
  StandardJ2000 = 'StandardJ2000'
}


export interface NaturalMoon {
  getMeanLongitude: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getMeanElongation: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getMeanAnomaly: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getArgumentOfLatitude: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getGeocentricEclipticLongitude: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getGeocentricEclipticLatitude: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayWithPrecisionFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityWithPrecisionFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithPrecisionFunction
  getRadiusVectorInKilometer: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction
  radiusVectorToHorizontalParallax: Function
  horizontalParallaxToRadiusVector: Function
  getMeanLongitudeAscendingNode: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getMeanLongitudePerigee: QuantityInDegreeAtJulianDayWithPrecisionFunction
  trueLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayWithPrecisionFunction
  horizontalParallax: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getPhaseAngle: QuantityInDegreeAtJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getEquatorialHorizontalParallax: QuantityInDegreeAtJulianDayFunction
  getPositionAngleOfTheBrightLimb: QuantityInDegreeAtJulianDayFunction
  getTimeOfMeanPhase: Function
  getAge: QuantityAtJulianDayFunction,
  getAgeName: Function
}

export interface EarthPlanet {
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayWithEquinoxWithPrecisionFunction
  getEclipticLongitudinalRotation: Function
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayWithEquinoxWithPrecisionFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayWithEquinoxWithPrecisionFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction
  getFlatteningCorrections: Function
  getMeanAnomaly: QuantityAtJulianDayWithPrecisionFunction
  getEccentricity: QuantityAtJulianDayFunction
  getLongitudeOfPerihelion: QuantityInDegreeAtJulianDayFunction
  getNutationInLongitude: QuantityInArcSecondAtJulianDayWithPrecisionFunction
  getNutationInObliquity: QuantityInArcSecondAtJulianDayWithPrecisionFunction
  getMeanObliquityOfEcliptic: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getTrueObliquityOfEcliptic: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getEarthVelocity: Function
  getAccurateAnnualEquatorialAberration: Function
  getAnnualEclipticAberration: Function
  getAnnualEquatorialAberration: Function
  getNutationEquatorialAberration: Function
  Moon: NaturalMoon
}

export type SunConstants = {
  equatorialRadius: Kilometer
}

export interface NaturalSun {
  getMeanAnomaly: QuantityAtJulianDayWithPrecisionFunction
  getTrueAnomaly: QuantityAtJulianDayWithPrecisionFunction
  getEquationOfTheCenter: Function
  getMeanLongitudeReferredToMeanEquinoxOfDate: QuantityInDegreeAtJulianCenturyWithPrecisionFunction
  getGeometricEclipticLongitude: QuantityInDegreeAtJulianDayWithPrecisionFunction
  getGeocentricEclipticLongitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getGeocentricEclipticLatitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getGeometricFK5EclipticLongitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getGeometricFK5EclipticLatitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayWithEquinoxFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithEquinoxFunction
  getApparentGeocentricEclipticLongitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getApparentGeocentricEclipticLatitude: SingleCoordinateDegreeAtJulianDayWithEquinoxFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayWithEquinoxFunction
  getVariationGeometricEclipticLongitude: QuantityInDegreeAtJulianDayFunction,
  constants: SunConstants
}
