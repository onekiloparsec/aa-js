/**
 * Angular degree
 */
export type Degree = number;
/**
 * Angular radian
 */
export type Radian = number;
/**
 * Giga-year = 10^9 terrestrial years.
 */
export type GYr = number;
/**
 * Terrestrial year = (365 or 366 Days)
 */
export type Year = number;
/**
 * Terrestrial day (= 24 Hours)
 */
export type Day = number;
/**
 * Time hour
 */
export type Hour = number;
/**
 * Time second
 */
export type Minute = number;
/**
 * Time minute
 */
export type Second = number;
/**
 * Time milisecond
 */
export type MiliSecond = number;
/**
 * Pixel
 */
export type Pixel = number;
/**
 * Julian day
 * The Julian Day is a continuous count of days and fractions thereof from the beginning of the year -4712.
 * By tradition, the Julian Day begins at Greenwich mean noon, that is, 12h Universal Time.
 */
export type JulianDay = number;
/**
 * Julian century (= time interval of 36525 days)
 */
export type JulianCentury = number;
export type ArcMinute = number;
export type ArcSecond = number;
/**
 * Mean radius of Jupiter
 */
export type JupiterRadius = number
/**
 * Mean radius of the Sun
 */
export type SolarRadius = number
/**
 * Astronomical unit, that is mean distance between the centers of the Sun and the Earth.
 */
export type AstronomicalUnit = number
/**
 * Parsec
 */
export type Parsec = number
/**
 * Kiloparsec. Of course.
 */
export type KiloParsec = number
/**
 * Megaparsec.
 */
export type MegaParsec = number
/**
 * Gpc^3.
 */
export type GigaParsec3 = number
/**
 * Logarithmic scale of luminosity
 */
export type Magnitude = number;
/**
 * KilometerPerSecondPerMegaParsec (for the Hubble constant)
 */
export type KilometerPerSecondPerMegaParsec = number;
/**
 * Albedo
 */
export type Albedo = number
/**
 * Kilometer
 */
export type Kilometer = number;
/**
 * Light-Year
 */
export type LightYear = number;
/**
 * Kilogram
 */
export type Kilogram = number;
/**
 * 10^24 kilograms
 */
export type Kilogram24 = number;
/**
 * g cm^-3
 */
export type GramPerCubicCentimeter = number;
/**
 * m s^-2
 */
export type MeterPerSquareSecond = number;
/**
 * km s^-1
 */
export type KilometerPerSecond = number;

export type EllipticalGeocentricDetails = {
  apparentLightTime: Day,
  apparentGeocentricDistance: AstronomicalUnit,
  apparentGeocentricEclipticCoordinates: EclipticCoordinates,
  apparentGeocentricEquatorialCoordinates: EquatorialCoordinates
}


/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export type EquatorialCoordinates = {
  rightAscension: Hour,
  declination: Degree,
  epoch?: JulianDay
}

/**
 * Coordinates in the Ecliptic (a.k.a. Celestial) system, that is the system
 * formed by projecting the plane of Earth's orbit (the ecliptic)
 * onto the spherical sky.
 */
export type EclipticCoordinates = {
  longitude: Degree,
  latitude: Degree
}

export type GalacticCoordinates = {
  longitude: Degree,
  latitude: Degree
}

export type SaturnicentricCoordinates = {
  longitude: Degree,
  latitude: Degree
}

/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 */
export type HorizontalCoordinates = {
  azimuth: Degree,
  altitude: Degree
}

export type Coordinates2D = {
  X: number,
  Y: number
}

export type Coordinates3D = {
  X: number,
  Y: number,
  Z: number,
}

export type Point = {
  x: Pixel,
  y: Pixel
}

export type TransitInternals = {
  m0: number | undefined
  cosH0: number | undefined
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

/**
 * Elements of Planetary Orbits
 */
export type PlanetOrbitalElements = {
  meanLongitude: [Degree, Degree, Degree, Degree]
  semiMajorAxis: AstronomicalUnit
  eccentricity: [number, number, number, number]
  inclination: [number, number, number, number]
  longitudeOfAscendingNode: [Degree, Degree, Degree, Degree]
  longitudeOfPerihelion: [Degree, Degree, Degree, Degree]
}

export type SingleCoordinateDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type EclipticCoordinatesAtJulianDayFunction = (jd: JulianDay) => EclipticCoordinates
export type EquatorialCoordinatesAtJulianDayFunction = (jd: JulianDay) => EquatorialCoordinates
export type JulianDayForJulianDayFunction = (jd: JulianDay) => JulianDay

export type QuantityAtJulianDayFunction = (jd: JulianDay) => number
export type QuantityInDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type QuantityInMagnitudeAtJulianDayFunction = (jd: JulianDay) => Magnitude
export type QuantityInAstronomicalUnitAtJulianDayFunction = (jd: JulianDay) => AstronomicalUnit
export type QuantityInKilometerPerSecondAtJulianDayFunction = (jd: JulianDay) => KilometerPerSecond
export type QuantityInArcSecondAtJulianDayFunction = (jd: JulianDay) => ArcSecond

export class Planet {
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
  orbitalElementsJ2000: PlanetOrbitalElements
}

export class SaturnRingSystem {
  majorAxis: ArcSecond
  minorAxis: ArcSecond
  northPolePositionAngle: Degree
  saturnicentricSunEarthLongitudesDifference: Degree
  earthCoordinates: SaturnicentricCoordinates
  sunCoordinates: SaturnicentricCoordinates
}

export type SaturnRingSystemFunction = (jd: JulianDay) => SaturnRingSystem

export class MarsPlanet extends Planet {
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}

export class SaturnPlanet extends Planet {
  getRingSystemDetails: SaturnRingSystemFunction
}

export class JupiterPlanet extends Planet {
  getCentralMeridianLongitudes: Function
  getPlanetocentricDeclinationOfTheSun: QuantityInDegreeAtJulianDayFunction
  getPlanetocentricDeclinationOfTheEarth: QuantityInDegreeAtJulianDayFunction
}

export class NaturalMoon {
  getMeanLongitude: QuantityInDegreeAtJulianDayFunction
  getMeanElongation: QuantityInDegreeAtJulianDayFunction
  getMeanAnomaly: QuantityInDegreeAtJulianDayFunction
  getArgumentOfLatitude: QuantityInDegreeAtJulianDayFunction
  getEclipticLongitude: QuantityInDegreeAtJulianDayFunction
  getEclipticLatitude: QuantityInDegreeAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  radiusVectorToHorizontalParallax: Function
  horizontalParallaxToRadiusVector: Function
  getMeanLongitudeAscendingNode: QuantityInDegreeAtJulianDayFunction
  getMeanLongitudePerigee: QuantityInDegreeAtJulianDayFunction
  trueLongitudeAscendingNode: QuantityInDegreeAtJulianDayFunction
  horizontalParallax: QuantityInDegreeAtJulianDayFunction
  getEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getApparentEquatorialCoordinates: EquatorialCoordinatesAtJulianDayFunction
  getPhaseAngle: QuantityInDegreeAtJulianDayFunction
  getIlluminatedFraction: QuantityAtJulianDayFunction
  getEquatorialHorizontalParallax: QuantityInDegreeAtJulianDayFunction
}

export class EarthPlanet {
  getEclipticLongitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticLatitude: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticCoordinates: EclipticCoordinatesAtJulianDayFunction
  getRadiusVector: QuantityInAstronomicalUnitAtJulianDayFunction
  getMeanAnomaly: QuantityAtJulianDayFunction
  getEclipticLongitudeJ2000: SingleCoordinateDegreeAtJulianDayFunction
  getEclipticLatitudeJ2000: SingleCoordinateDegreeAtJulianDayFunction
  getEccentricity: QuantityAtJulianDayFunction
  Moon: NaturalMoon
}

export enum Obliquity {
  Mean,
  True
}

export enum Equinox {
  MeanOfTheDate,
  StandardJ2000
}
