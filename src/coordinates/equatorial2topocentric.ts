/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import {
  ArcSecond,
  AstronomicalUnit,
  EquatorialCoordinates,
  EquatorialCoordinatesNum,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  Hour,
  JulianDay,
  Radian,
  TopocentricCoordinates
} from '@/types'
import { MINUSONE } from '@/constants'
import { getLocalSiderealTime } from '@/juliandays'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { fmod24 } from '@/utils'

/**
 * Transform equatorial coordinates to topocentric coordinates.
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords The equatorial coordinates
 * @param {AstronomicalUnit} distance The object geocentric distance
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @returns {TopocentricCoordinates}
 */
export function transformEquatorialToTopocentric (jd: JulianDay | number,
                                                  coords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                                  distance: AstronomicalUnit | number,
                                                  geoCoords: GeographicCoordinates | GeographicCoordinatesNum): TopocentricCoordinates {
  if (geoCoords.height === undefined) {
    throw new Error('The geographic coordinates must contain a value for "height".')
  }
  const corrections = getFlatteningCorrections(geoCoords.height, geoCoords.latitude)

  const factor: ArcSecond = new Decimal(8.794)
  const sinpi: ArcSecond = Decimal.sin(factor.dividedBy(3600).degreesToRadians()).dividedBy(distance)
  const theta0: Hour = getLocalSiderealTime(jd, 0)
  const H: Radian = fmod24(
    theta0
      .plus(new Decimal(geoCoords.longitude).degreesToHours())
      .minus(new Decimal(coords.rightAscension).degreesToHours())
  ).hoursToRadians()

  const sindec = Decimal.sin(new Decimal(coords.declination).degreesToRadians())
  const cosdec = Decimal.cos(new Decimal(coords.declination).degreesToRadians())

  const numeratorAlpha: Radian = MINUSONE.mul(corrections.rhocosphi).mul(sinpi).mul(Decimal.sin(H)).toDecimalPlaces(9)
  const denominatorAlpha: Radian = cosdec.minus(corrections.rhocosphi.mul(sinpi).mul(Decimal.cos(H))).toDecimalPlaces(6)
  const tanDeltaAlpha: Radian = numeratorAlpha.dividedBy(denominatorAlpha)

  const cosDeltaAlpha: Radian = Decimal.cos(Decimal.atan(tanDeltaAlpha))
  const numeratorDelta: Radian = (sindec.minus(corrections.rhosinphi.mul(sinpi))).mul(cosDeltaAlpha)
  const denominatorDelta: Radian = cosdec.minus(corrections.rhocosphi.mul(sinpi).mul(Decimal.cos(H)))
  const tanDeltaPrime: Radian = numeratorDelta.dividedBy(denominatorDelta)

  return {
    rightAscension: new Decimal(coords.rightAscension).plus(Decimal.atan(tanDeltaAlpha).radiansToDegrees()),
    declination: Decimal.atan(tanDeltaPrime).radiansToDegrees()
  }
}
