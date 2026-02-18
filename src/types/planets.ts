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
  EquatorialCoordinatesAtJulianDayWithObliquityFunction,
  EquatorialCoordinatesAtJulianDayFunction,
  JulianDayForJulianDayFunction,
  QuantityAtJulianDayFunction,
  QuantityInArcSecondAtJulianDayFunction,
  QuantityInAstronomicalUnitAtJulianDayFunction,
  QuantityInDegreeAtJulianDayFunction,
  QuantityInDegreeAtJulianDayWithEquinoxFunction,
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

export interface PlanetBase {
  // Heliocentric coordinates (coordinates.ts)
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  // Geocentric coordinates (elliptical.ts)
  getGeocentricDistance: QuantityInAstronomicalUnitAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayWithObliquityFunction
  getApparentGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  // Rise Transit Set (additions to elliptical.ts)
  getRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  getAccurateRiseTransitSet: RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction
  // Planet base properties (details.ts)
  getPhaseAngle: JulianDayForJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getMagnitude: QuantityInMagnitudeAtJulianDayFunction
  getEquatorialSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  getPolarSemiDiameter: QuantityInArcSecondAtJulianDayFunction
  // Constant values (constants.ts)
  constants: PlanetConstants
}

export interface DwarfPlanet extends PlanetBase {
}

export interface Planet extends PlanetBase {
  // Planet elliptical properties (elliptical.ts)
  getInstantaneousVelocity: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtPerihelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getVelocityAtAphelion: QuantityInKilometerPerSecondAtJulianDayFunction
  getLengthOfEllipse: QuantityInAstronomicalUnitAtJulianDayFunction
  // Planet orbital properties (orbital.ts)
  getMeanLongitude: QuantityInDegreeAtJulianDayWithEquinoxFunction
  getEccentricity: QuantityAtJulianDayFunction
  getInclination: QuantityInDegreeAtJulianDayWithEquinoxFunction
  getLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayWithEquinoxFunction
  getLongitudeOfPerihelion: QuantityInDegreeAtJulianDayWithEquinoxFunction
  getSemiMajorAxis: QuantityInDegreeAtJulianDayFunction
  // Extended planet base properties (details.ts)
  getAphelion: JulianDayForJulianDayFunction
  getPerihelion: JulianDayForJulianDayFunction
  // Orbital elements (constants.ts)
  orbitalElements: PlanetOrbitalElements
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


export type LengthArray<T, N extends number, R extends T[] = []> = number extends N ? T[] : R['length'] extends N ? R : LengthArray<T, N, [T, ...R]>;

/**
 * Elements of Planetary Orbits
 */
export type PlanetOrbitalElements = {
  semiMajorAxis: LengthArray<AstronomicalUnit, 4>
  eccentricity: LengthArray<number, 4>,
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

export type PlanetCoefficient = { A: number, B: number, C: number }
