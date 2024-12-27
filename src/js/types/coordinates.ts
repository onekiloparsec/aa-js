import { ArcSecond, Degree, Hour, JulianDay, Meter, Pixel } from './units'

/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export type EquatorialCoordinates = {
  rightAscension: Degree
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
 * Geographic coordinates, East Positive!
 */
export type GeographicCoordinates = {
  longitude: Degree
  latitude: Degree
  height?: Meter
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
  X: number
  Y: number
}

export type Coordinates3D = {
  X: number
  Y: number
  Z: number
}

export type Sexagesimal = {
  sign: number,
  radix: number,
  minutes: number,
  seconds: number
  milliseconds: number
}

export type Point = {
  x: Pixel
  y: Pixel
}
export type PointNum = {
  x: number
  y: number
}

export type EclipticCoordinatesCorrection = {
  DeltaLongitude: ArcSecond
  DeltaLatitude: ArcSecond
}

export type EquatorialCoordinatesCorrection = {
  DeltaRightAscension: ArcSecond
  DeltaDeclination: ArcSecond
}
