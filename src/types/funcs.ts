import Decimal from '@/decimal'
import { ArcSecond, AstronomicalUnit, Degree, JulianCentury, JulianDay, KilometerPerSecond, Magnitude } from './units'
import { EclipticCoordinates, EquatorialCoordinates, GeographicCoordinates } from './coordinates'
import { RiseTransitSet } from './risetransitset'
import { Equinox, Obliquity } from './earth'

export type JulianDayForJulianDayFunction = (jd: JulianDay) => JulianDay

export type SingleCoordinateDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type SingleCoordinateDegreeAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => Degree
export type SingleCoordinateDegreeAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => Degree
export type SingleCoordinateDegreeAtJulianDayWithEquinoxWithPrecisionFunction = (jd: JulianDay, equinox?: Equinox, highPrecision?: boolean) => Degree

export type EclipticCoordinatesAtJulianDayFunction = (jd: JulianDay) => EclipticCoordinates
export type EclipticCoordinatesAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => EclipticCoordinates
export type EclipticCoordinatesAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => EclipticCoordinates
export type EclipticCoordinatesAtJulianDayWithEquinoxWithPrecisionFunction = (jd: JulianDay, equinox?: Equinox, highPrecision?: boolean) => EclipticCoordinates

export type EquatorialCoordinatesAtJulianDayFunction = (jd: JulianDay) => EquatorialCoordinates
export type EquatorialCoordinatesAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => EquatorialCoordinates
export type EquatorialCoordinatesAtJulianDayWithEquinoxFunction = (jd: JulianDay, equinox?: Equinox) => EquatorialCoordinates
export type EquatorialCoordinatesAtJulianDayWithEquinoxWithPrecisionFunction = (jd: JulianDay, equinox?: Equinox, highPrecision?: boolean) => EquatorialCoordinates
export type EquatorialCoordinatesAtJulianDayWithObliquityWithPrecisionFunction = (jd: JulianDay, obliquity?: Obliquity, highPrecision?: boolean) => EquatorialCoordinates

export type QuantityAtJulianDayFunction = (jd: JulianDay) => Decimal
export type QuantityAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => Decimal

export type QuantityInDegreeAtJulianDayFunction = (jd: JulianDay) => Degree
export type QuantityInDegreeAtJulianDayWithEquinoxFunction = (jd:JulianDay|number, equinox?: Equinox) => Degree
export type QuantityInDegreeAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => Degree

export type QuantityInDegreeAtJulianCenturyFunction = (jd: JulianCentury) => Degree
export type QuantityInDegreeAtJulianCenturyWithPrecisionFunction = (jd: JulianCentury, highPrecision?: boolean) => Degree

export type QuantityInAstronomicalUnitAtJulianDayFunction = (jd: JulianDay) => AstronomicalUnit
export type QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => AstronomicalUnit

export type QuantityInMagnitudeAtJulianDayFunction = (jd: JulianDay) => Magnitude

export type QuantityInKilometerPerSecondAtJulianDayFunction = (jd: JulianDay) => KilometerPerSecond
export type QuantityInKilometerPerSecondAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => KilometerPerSecond

export type QuantityInArcSecondAtJulianDayFunction = (jd: JulianDay) => ArcSecond
export type QuantityInArcSecondAtJulianDayWithPrecisionFunction = (jd: JulianDay, highPrecision?: boolean) => ArcSecond

export type RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction = (jd: JulianDay, geoCoords: GeographicCoordinates) => RiseTransitSet
export type RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesWithPrecisionFunction = (jd: JulianDay, geoCoords: GeographicCoordinates, highPrecision?: boolean) => RiseTransitSet

