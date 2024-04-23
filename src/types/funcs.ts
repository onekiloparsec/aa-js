import { ArcSecond, AstronomicalUnit, Degree, JulianCentury, JulianDay, KilometerPerSecond, Magnitude } from './units'
import { EclipticCoordinates, EquatorialCoordinates, GeographicCoordinates } from './coordinates'
import { RiseTransitSet } from './risetransitset'
import { Equinox, Obliquity } from './earth'

export type JulianDayForJulianDayFunction = (jd: JulianDay) => JulianDay

export type SingleCoordinateDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type SingleCoordinateDegreeAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => Degree

export type EclipticCoordinatesAtJulianDayFunction = (jd: JulianDay) => EclipticCoordinates
export type EclipticCoordinatesAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => EclipticCoordinates
export type EquatorialCoordinatesAtJulianDayWithObliquityFunction = (jd: JulianDay, obliquity?: Obliquity) => EquatorialCoordinates

export type EquatorialCoordinatesAtJulianDayFunction = (jd: JulianDay) => EquatorialCoordinates
export type EquatorialCoordinatesAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => EquatorialCoordinates

export type QuantityAtJulianDayFunction = (jd: JulianDay) => number
export type QuantityInDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type QuantityInDegreeAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => Degree
export type QuantityInDegreeAtJulianCenturyFunction = (jd: JulianCentury) => Degree
export type QuantityInAstronomicalUnitAtJulianDayFunction = (jd: JulianDay) => AstronomicalUnit
export type QuantityInMagnitudeAtJulianDayFunction = (jd: JulianDay) => Magnitude
export type QuantityInKilometerPerSecondAtJulianDayFunction = (jd: JulianDay) => KilometerPerSecond
export type QuantityInArcSecondAtJulianDayFunction = (jd: JulianDay) => ArcSecond
export type RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction = (jd: JulianDay, geoCoords: GeographicCoordinates) => RiseTransitSet

