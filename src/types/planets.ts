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
  EquatorialCoordinatesAtJulianDayFunction,
  JulianDayForJulianDayFunction,
  QuantityAtJulianDayFunction,
  QuantityInArcSecondAtJulianDayFunction,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  QuantityInDegreeAtJulianDayFunction,
  QuantityInKilometerPerSecondAtJulianDayFunction,
  QuantityInMagnitudeAtJulianDayFunction,
  RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction,
  SingleCoordinateDegreeAtJulianDayFunction
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
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  // Geocentric coordinates
  getGeocentricDistance: QuantityInAstronomicalUnitAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  // Planet elliptical properties
  getInstantaneousVelocity: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtPerihelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtAphelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getLengthOfEllipse: QuantityInAstronomicalUnitAtJulianDayFunction
  getRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  getAccurateRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
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
