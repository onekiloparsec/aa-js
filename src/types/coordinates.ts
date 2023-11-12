import Decimal from '@/decimal'
import { ArcSecond, Degree, Hour, JulianDay, Meter, Pixel } from './units'

/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export type EquatorialCoordinatesH = {
  rightAscensionH: Hour | number
  declination: Degree | number
  epoch?: JulianDay | number
}

/**
 * Coordinates in the Equatorial system, that is in the system formed by
 * projecting the Earth equator onto the spherical sky.
 */
export type EquatorialCoordinates = {
  rightAscension: Degree | number
  declination: Degree | number
  epoch?: JulianDay | number
}

/**
 * Topocentric coordinates.
 */
export type TopocentricCoordinates = {
  rightAscension: Hour | number
  declination: Degree | number
  epoch?: JulianDay | number
}

/**
 * Geographic coordinates, East Positive!
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
  longitude: Degree | number
  latitude: Degree | number
}

export type GalacticCoordinates = {
  longitude: Degree | number
  latitude: Degree | number
}

/**
 * Coordinates of an object as seen from an observer's location, at a given
 * time. The altitude is counted from the (idealistic) plane horizon. The
 * azimuth is the angle counted from the geographical north or south.
 */
export type HorizontalCoordinates = {
  azimuth: Degree | number
  altitude: Degree | number
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

export type EclipticCoordinatesCorrection = {
  DeltaLongitude: ArcSecond
  DeltaLatitude: ArcSecond
}

export type EquatorialCoordinatesCorrection = {
  DeltaRightAscension: ArcSecond
  DeltaDeclination: ArcSecond
}
