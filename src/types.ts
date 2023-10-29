import Decimal from 'decimal.js'

/**
 * Angular degree
 */
export type Degree = Decimal;
/**
 * Angular radian
 */
export type Radian = Decimal;
/**
 * Giga-year = 10^9 terrestrial years.
 */
export type GYr = Decimal;
/**
 * Terrestrial year = (365 or 366 Days)
 */
export type Year = Decimal;
/**
 * Terrestrial day (= 24 Hours)
 */
export type Day = Decimal;
/**
 * Time hour
 */
export type Hour = Decimal;
/**
 * Time second
 */
export type Minute = Decimal;
/**
 * Time minute
 */
export type Second = Decimal;
/**
 * Time milisecond
 */
export type MiliSecond = Decimal;
/**
 * Pixel
 */
export type Pixel = Decimal;
/**
 * Julian day
 * The Julian Day is a continuous count of days and fractions thereof from the beginning of the year -4712.
 * By tradition, the Julian Day begins at Greenwich mean noon, that is, 12h Universal Time.
 */
export type JulianDay = Decimal;
/**
 * Julian century (= time interval of 36525 days)
 */
export type JulianCentury = Decimal;
/**
 * Julian millenium (= time interval of 365250 days)
 */
export type JulianMillenium = Decimal;
export type ArcMinute = Decimal;
export type ArcSecond = Decimal;
/**
 * Mean radius of Jupiter
 */
export type JupiterRadius = Decimal
/**
 * Mean radius of the Sun
 */
export type SolarRadius = Decimal
/**
 * Astronomical unit, that is mean distance between the centers of the Sun and the Earth.
 */
export type AstronomicalUnit = Decimal
/**
 * Parsec
 */
export type Parsec = Decimal
/**
 * Kiloparsec. Of course.
 */
export type KiloParsec = Decimal
/**
 * Megaparsec.
 */
export type MegaParsec = Decimal
/**
 * Gpc^3.
 */
export type GigaParsec3 = Decimal
/**
 * Logarithmic scale of luminosity
 */
export type Magnitude = Decimal;
/**
 * KilometerPerSecondPerMegaParsec (for the Hubble constant)
 */
export type KilometerPerSecondPerMegaParsec = Decimal;
/**
 * Albedo
 */
export type Albedo = Decimal
/**
 * Meter
 */
export type Meter = Decimal;
/**
 * Kilometer
 */
export type Kilometer = Decimal;
/**
 * Light-Year
 */
export type LightYear = Decimal;
/**
 * Kilogram
 */
export type Kilogram = Decimal;
/**
 * 10^24 kilograms
 */
export type Kilogram24 = Decimal;
/**
 * g cm^-3
 */
export type GramPerCubicCentimeter = Decimal;
/**
 * m s^-2
 */
export type MeterPerSquareSecond = Decimal;
/**
 * km s^-1
 */
export type KilometerPerSecond = Decimal;

export type EllipticalGeocentricDetails = {
  apparentLightTime: Day
  apparentGeocentricDistance: AstronomicalUnit
  apparentGeocentricEclipticCoordinates: EclipticCoordinates
  apparentGeocentricEquatorialCoordinates: EquatorialCoordinates
}

/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export type EquatorialCoordinates = {
  rightAscension: Hour
  declination: Degree
  epoch?: JulianDay
}

/**
 * Topocentric coordinates.
 */
export type TopocentricCoordinates = {
  rightAscension: Hour
  declination: Degree
  epoch?: JulianDay
}

/**
 * Geographic coordinates.
 */
export type GeographicCoordinates = {
  longitude: Degree | number
  latitude: Degree | number
  height: Meter | number
}

/**
 * Coordinates in the Ecliptic (a.k.a. Celestial) system, that is the system
 * formed by projecting the plane of Earth's orbit (the ecliptic)
 * onto the spherical sky.
 */
export type EclipticCoordinates = {
  longitude: Degree
  latitude: Degree
}

export type GalacticCoordinates = {
  longitude: Degree
  latitude: Degree
}

export type SaturnicentricCoordinates = {
  longitude: Degree
  latitude: Degree
}

/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 */
export type HorizontalCoordinates = {
  azimuth: Degree
  altitude: Degree
}

export type Coordinates2D = {
  X: Decimal
  Y: Decimal
}

export type Coordinates3D = {
  X: Decimal
  Y: Decimal
  Z: Decimal
}

export type Sexagesimal = {
  radix: Decimal,
  minutes: Decimal,
  seconds: Decimal
}

export type Point = {
  x: Pixel
  y: Pixel
}

export type TransitInternals = {
  m0: Decimal | number | undefined
  cosH0: Decimal | number | undefined
}

/**
 * The various elements of the transit of an object
 */
export type Transit = {
  utc: Hour | undefined,
  julianDay: JulianDay | undefined,
  altitude: Degree | undefined,
  refAltitude: Degree,
  isAboveHorizon: boolean,
  isAboveAltitude: boolean, // for when altitude is not that of horizon
  isCircumpolar: boolean // no transit, no rise
  internals: TransitInternals
}

/**
 * The various elements of the rise, set and transit of an object
 */
export type RiseTransitSet = {
  rise: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  },
  transit: Transit,
  set: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  }
}

export type RiseSetTransit = RiseTransitSet

/**
 * The various elements of the inverse (nightly) transit of an object
 */
export type InverseTransit = {
  utc: Hour | undefined,
  julianDay: JulianDay | undefined,
  altitude: Degree | undefined,
  refAltitude: Degree,
  isBelowHorizon: boolean,
  isBelowAltitude: boolean, // for when altitude is not that of horizon
  isCircumpolar: boolean // no transit, no rise
  internals: TransitInternals
}

/**
 * The various elements of the rise, set and transit of an object
 */
export type SetInverseTransitRise = {
  set: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  },
  inverseTransit: InverseTransit,
  rise: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  }
}

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

export enum Obliquity {
  Mean,
  True
}

export enum Equinox {
  MeanOfTheDate,
  StandardJ2000
}


export type SingleCoordinateDegreeAtJulianDayFunction = (jd: JulianDay | number) => Degree
export type EclipticCoordinatesAtJulianDayFunction = (jd: JulianDay | number) => EclipticCoordinates
export type EquatorialCoordinatesAtJulianDayFunction = (jd: JulianDay | number) => EquatorialCoordinates
export type JulianDayForJulianDayFunction = (jd: JulianDay | number) => JulianDay

export type SingleCoordinateDegreeWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => Degree
export type EclipticCoordinatesWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => EclipticCoordinates
export type EquatorialCoordinatesWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => EquatorialCoordinates

export type QuantityAtJulianDayFunction = (jd: JulianDay | number) => Decimal
export type QuantityInDegreeAtJulianDayFunction = (jd: JulianDay | number) => Degree
export type QuantityInDegreeAtJulianCenturyFunction = (jd: JulianCentury | number) => Degree
export type QuantityInMagnitudeAtJulianDayFunction = (jd: JulianDay | number) => Magnitude
export type QuantityInAstronomicalUnitAtJulianDayFunction = (jd: JulianDay | number) => AstronomicalUnit
export type QuantityInKilometerPerSecondAtJulianDayFunction = (jd: JulianDay | number) => KilometerPerSecond
export type QuantityInArcSecondAtJulianDayFunction = (jd: JulianDay | number) => ArcSecond

export type RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction = (jd: JulianDay | number, geoCoords: GeographicCoordinates) => RiseTransitSet

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
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
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

export interface SaturnRingSystem {
  majorAxis: ArcSecond
  minorAxis: ArcSecond
  northPolePositionAngle: Degree
  saturnicentricSunEarthLongitudesDifference: Degree
  earthCoordinates: SaturnicentricCoordinates
  sunCoordinates: SaturnicentricCoordinates
}

export type SaturnRingSystemFunction = (jd: JulianDay) => SaturnRingSystem

export interface MarsPlanet extends Planet {
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}

export interface SaturnPlanet extends Planet {
  getRingSystemDetails: SaturnRingSystemFunction
}

export interface JupiterPlanet extends Planet {
  getCentralMeridianLongitudes: Function
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}

export interface NaturalMoon {
  getMeanLongitude: QuantityInDegreeAtJulianDayFunction
  getMeanElongation: QuantityInDegreeAtJulianDayFunction
  getMeanAnomaly: QuantityInDegreeAtJulianDayFunction
  getArgumentOfLatitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLongitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLatitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  radiusVectorToHorizontalParallax: Function
  horizontalParallaxToRadiusVector: Function
  getMeanLongitudeAscendingNode: QuantityInDegreeAtJulianDayFunction
  getMeanLongitudePerigee: QuantityInDegreeAtJulianDayFunction
  trueLongitudeOfAscendingNode: QuantityInDegreeAtJulianDayFunction
  horizontalParallax: QuantityInDegreeAtJulianDayFunction
  getPhaseAngle: QuantityInDegreeAtJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getEquatorialHorizontalParallax: QuantityInDegreeAtJulianDayFunction
  getPositionAngleOfTheBrightLimb: QuantityInDegreeAtJulianDayFunction
}

export interface EarthPlanet {
  getEclipticLongitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesWithEquinoxAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  getFlatteningCorrections: Function
  getMeanAnomaly: QuantityAtJulianDayFunction
  getEccentricity: QuantityAtJulianDayFunction
  getNutationInLongitude: QuantityInArcSecondAtJulianDayFunction
  getNutationInObliquity: QuantityInArcSecondAtJulianDayFunction
  getMeanObliquityOfEcliptic: QuantityInDegreeAtJulianDayFunction
  getTrueObliquityOfEcliptic: QuantityInDegreeAtJulianDayFunction
  Moon: NaturalMoon
}

export interface NaturalSun {
  getMeanAnomaly: QuantityInDegreeAtJulianDayFunction
  getTrueAnomaly: QuantityInDegreeAtJulianDayFunction
  getEquationOfTheCenter: Function
  getMeanLongitudeReferredToMeanEquinoxOfDate: QuantityInDegreeAtJulianCenturyFunction
  getGeometricEclipticLongitude: QuantityInDegreeAtJulianDayFunction
  getGeocentricEclipticLongitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getGeocentricEclipticLatitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getGeometricFK5EclipticLongitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getGeometricFK5EclipticLatitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getGeocentricEclipticCoordinates: EclipticCoordinatesWithEquinoxAtJulianDayFunction
  getGeocentricEquatorialCoordinates: EquatorialCoordinatesWithEquinoxAtJulianDayFunction
  getApparentGeocentricEclipticLongitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getApparentGeocentricEclipticLatitude: SingleCoordinateDegreeWithEquinoxAtJulianDayFunction
  getApparentGeocentricEclipticCoordinates: EclipticCoordinatesWithEquinoxAtJulianDayFunction
  getVariationGeometricEclipticLongitude: QuantityInDegreeAtJulianDayFunction
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
