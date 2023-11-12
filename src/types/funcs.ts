import Decimal from '@/decimal'
import { ArcSecond, AstronomicalUnit, Degree, JulianCentury, JulianDay, KilometerPerSecond, Magnitude } from './units'
import { EclipticCoordinates, EquatorialCoordinates, GeographicCoordinates } from './coordinates'
import { RiseTransitSet } from './risetransitset'
import { Equinox } from './earth'

export type JulianDayForJulianDayFunction = (jd: JulianDay | number) => JulianDay

export type SingleCoordinateDegreeAtJulianDayFunction = (jd: JulianDay | number) => Degree
export type EclipticCoordinatesAtJulianDayFunction = (jd: JulianDay | number) => EclipticCoordinates
export type EquatorialCoordinatesAtJulianDayFunction = (jd: JulianDay | number) => EquatorialCoordinates

export type SingleCoordinateDegreeAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, equinox?: Equinox) => Degree
export type SingleCoordinateDegreeWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => Degree

export type EclipticCoordinatesAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, equinox?: Equinox) => EclipticCoordinates
export type EclipticCoordinatesWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => EclipticCoordinates

export type EquatorialCoordinatesAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, equinox?: Equinox) => EquatorialCoordinates
export type EquatorialCoordinatesWithEquinoxAtJulianDayFunction = (jd: JulianDay | number, equinox?: Equinox) => EquatorialCoordinates

export type QuantityAtJulianDayFunction = (jd: JulianDay | number) => Decimal
export type QuantityAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, highPrecision?: boolean) => Decimal

export type QuantityInDegreeAtJulianDayFunction = (jd: JulianDay | number) => Degree
export type QuantityInDegreeAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, highPrecision?: boolean) => Degree

export type QuantityInDegreeAtJulianCenturyFunction = (jd: JulianCentury | number) => Degree
export type QuantityInDegreeAtJulianCenturyWithPrecisionFunction = (jd: JulianCentury | number, highPrecision?: boolean) => Degree

export type QuantityInAstronomicalUnitAtJulianDayFunction = (jd: JulianDay | number) => AstronomicalUnit
export type QuantityInAstronomicalUnitAtJulianDayWithPrecisionFunction = (jd: JulianDay | number, highPrecision?: boolean) => AstronomicalUnit

export type QuantityInMagnitudeAtJulianDayFunction = (jd: JulianDay | number) => Magnitude
export type QuantityInKilometerPerSecondAtJulianDayFunction = (jd: JulianDay | number) => KilometerPerSecond
export type QuantityInArcSecondAtJulianDayFunction = (jd: JulianDay | number) => ArcSecond

export type RiseTransitSetTimesAtJulianDayAndGeographicCoordinatesFunction = (jd: JulianDay | number, geoCoords: GeographicCoordinates) => RiseTransitSet

