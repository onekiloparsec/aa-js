import Decimal from '@/decimal'
import { Equinox } from './earth'
import {
  Albedo,
  ArcSecond,
  AstronomicalUnit,
  Day,
  Degree,
  GramPerCubicCentimeter,
  JulianDay,
  Kilogram24,
  Kilometer,
  KilometerPerSecond,
  Magnitude,
  MeterPerSquareSecond,
  Year
} from './units'
import {
  EclipticCoordinatesAtJulianDayFunction,
  EclipticCoordinatesAtJulianDayWithPrecisionFunction,
  EquatorialCoordinatesAtJulianDayFunction,
  EquatorialCoordinatesAtJulianDayWithPrecisionFunction,
  JulianDayForJulianDayFunction,
  QuantityAtJulianDayFunction,
  QuantityInArcSecondAtJulianDayFunction,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction,
  QuantityInDegreeAtJulianDayFunction,
  QuantityInKilometerPerSecondAtJulianDayFunction,
  QuantityInKilometerPerSecondAtJulianDayWithPrecisionFunction,
  QuantityInMagnitudeAtJulianDayFunction,
  RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction,
  RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesWithPrecisionFunction,
  SingleCoordinateDegreeAtJulianDayFunction,
  SingleCoordinateDegreeAtJulianDayWithPrecisionFunction
} from './funcs'


/**
 * Common constants of planets
 */
export type PlanetConstants = {
  /**
   * Radius at the equator
   */
  equatorialRadius: Kilometer,
  /**
   * Mean radius
   */
  meanRadius: Kilometer,
  /**
   * Mass
   */
  mass: Kilogram24,
  bulkDensity: GramPerCubicCentimeter,
  siderealRotationPeriod: Day,
  siderealOrbitPeriod: Year,
  visualMagnitude: Magnitude,
  geometricAlbedo: Albedo,
  equatorialGravity: MeterPerSquareSecond,
  escapeVelocity: KilometerPerSecond
}


export interface Planet {
  // Heliocentric coordinates
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayWithPrecisionFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayWithPrecisionFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithPrecisionFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  // Geocentric coordinates
  getGeocentricDistance: QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayWithPrecisionFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayWithPrecisionFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithPrecisionFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithPrecisionFunction
  // Planet elliptical properties
  getInstantaneousVelocity: QuantityInKilometerPerSecondAtJulianDayWithPrecisionFunction
  getVelocityAtPerihelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtAphelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getLengthOfEllipse: QuantityInAstronomicalUnitAtJulianDayFunction
  getRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesWithPrecisionFunction
  getAccurateRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesWithPrecisionFunction
  // Planet orbital properties
  getMeanLongitude: QuantityInDegreeAtJulianDayFunction
  getEccentricity: QuantityAtJulianDayFunction
  getInclination: QuantityInDegreeAtJulianDayFunction
  getLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayFunction
  getLongitudeOfPerihelion: QuantityInDegreeAtJulianDayFunction
  // Planet base properties
  getAphelion: JulianDayForJulianDayFunction
  getPerihelion: JulianDayForJulianDayFunction
  getPhaseAngle: JulianDayForJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getMagnitude: QuantityInMagnitudeAtJulianDayFunction
  getEquatorialSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getPolarSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  // Fixed values
  constants: PlanetConstants
  orbitalElements: PlanetOrbitalElements
}

export interface MinorPlanet {
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getGeocentricDistance: QuantityInAstronomicalUnitAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  getAccurateRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  getPhaseAngle: JulianDayForJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getMagnitude: QuantityInMagnitudeAtJulianDayFunction
  getEquatorialSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getPolarSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  constants: PlanetConstants
}

export interface MarsPlanet extends Planet {
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}

export type SaturnicentricCoordinates = {
  longitude: Degree
  latitude: Degree
}

export interface SaturnRingSystem {
  majorAxis: ArcSecond
  minorAxis: ArcSecond
  northPolePositionAngle: Degree
  saturnicentricSunEarthLongitudesDifference: Degree
  earthCoordinates: SaturnicentricCoordinates
  sunCoordinates: SaturnicentricCoordinates
}

export type SaturnRingSystemFunction = (jd: JulianDay) => SaturnRingSystem

export interface SaturnPlanet extends Planet {
  getRingSystemDetails: SaturnRingSystemFunction
}

export interface JupiterPlanet extends Planet {
  getCentralMeridianLongitudes: Function
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}


export type LengthArray<T, N extends number, R extends T[] = []> = Decimal extends N ? T[] : R['length'] extends N ? R : LengthArray<T, N, [T, ...R]>;

/**
 * Elements of Planetary Orbits
 */
export type PlanetOrbitalElements = {
  semiMajorAxis: LengthArray<AstronomicalUnit, 4>
  eccentricity: LengthArray<Decimal, 4>,
  [Equinox.MeanOfTheDate]: {
    meanLongitude: LengthArray<Degree, 4>
    inclination: LengthArray<Degree, 4>
    longitudeOfAscendingNode: LengthArray<Degree, 4>
    longitudeOfPerihelion: LengthArray<Degree, 4>
  },
  [Equinox.StandardJ2000]: {
    meanLongitude: LengthArray<Degree, 4>
    inclination: LengthArray<Degree, 4>
    longitudeOfAscendingNode: LengthArray<Degree, 4>
    longitudeOfPerihelion: LengthArray<Degree, 4>
  }
}

export type PlanetName = 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune'
export type AllPlanetName = 'Mercury' | 'Venus' | 'Mars' | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto'
export type SolarSystemName =
  'Sun'
  | 'Mercury'
  | 'Venus'
  | 'Earth'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'

export type PlanetCoefficient = { A: Decimal, B: Decimal, C: Decimal }
export type PlanetCoefficientNum = { A: number, B: number, C: number }
