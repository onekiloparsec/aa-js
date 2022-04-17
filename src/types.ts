export type Degree = number;
export type Year = number;
export type Day = number;
export type Hour = number;
export type Pixel = number;
export type JulianDay = number;
export type JulianCentury = number;
export type ArcMinute = number;
export type ArcSecond = number;
export type JupiterRadius = number
export type SolarRadius = number
export type AstronomicalUnit = number
export type Magnitude = number;
export type Albedo = number
export type Kilometer = number;
export type Kilogram24 = number; // 10^24 kg
export type GramPerCubicCentimeter = number; // g cm^-3
export type MeterPerSquareSecond = number; // m s^-2
export type KilometerPerSecond = number; // km s^-1

export type EllipticalGeocentricDetails = {
  apparentLightTime: Day,
  apparentGeocentricDistance: AstronomicalUnit,
  apparentGeocentricEclipticCoordinates: EclipticCoordinates,
  apparentGeocentricEquatorialCoordinates: EquatorialCoordinates
}

export type PlanetaryConstants = {
  equatorialRadius: Kilometer,
  meanRadius: Kilometer,
  mass: Kilogram24,
  bulkDensity: GramPerCubicCentimeter,
  siderealRotationPeriod: Day,
  siderealOrbitPeriod: Year,
  visualMagnitude: Magnitude,
  geometricAlbedo: Albedo,
  equatorialGravity: MeterPerSquareSecond,
  escapeVelocity: KilometerPerSecond
}

export type EquatorialCoordinates = {
  rightAscension: Hour,
  declination: Degree,
  epoch?: JulianDay
}

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
