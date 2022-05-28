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
 * Common constants of planets
 */
export type PlanetaryConstants = {
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

/**
 * The various elements of the rise, set and transit of an object
 */
export type RiseSetTransit = {
  rise: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  },
  set: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  },
  transit: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined,
    altitude: Degree | undefined,
    refAltitude: Degree,
    isAboveHorizon: boolean,
    isAboveAltitude: boolean, // for when altitude is not that of horizon
    isCircumpolar: boolean // no transit, no rise
  }
}
