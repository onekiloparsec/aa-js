import Decimal from '@/decimal'
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
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky. Use native numbers.
 */
export type EquatorialCoordinatesNum = {
  rightAscension: number // degrees
  declination: number // degrees
  epoch?: number
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
 * Geographic coordinates, East Positive! Use native numbers.
 */
export type GeographicCoordinatesNum = {
  longitude: number// degrees
  latitude: number// degrees
  height?: number// meters
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
/**
 * Coordinates in the Ecliptic (a.k.a. Celestial) system, that is the system
 * formed by projecting the plane of Earth's orbit (the ecliptic)
 * onto the spherical sky. Use native numbers.
 */
export type EclipticCoordinatesNum = {
  longitude: number // degrees
  latitude: number // degrees
}

export type GalacticCoordinates = {
  longitude: Degree
  latitude: Degree
}
export type GalacticCoordinatesNum = {
  longitude: number
  latitude: number
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
/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 * Use native numbers.
 */
export type HorizontalCoordinatesNum = {
  azimuth: number
  altitude: number
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
  sign: Decimal,
  radix: Decimal,
  minutes: Decimal,
  seconds: Decimal
  milliseconds: Decimal
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
