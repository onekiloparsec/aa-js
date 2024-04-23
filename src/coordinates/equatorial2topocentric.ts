/**
 @module Coordinates
 */
import {
  ArcSecond,
  AstronomicalUnit,
  EquatorialCoordinates,
  GeographicCoordinates,
  Hour,
  JulianDay,
  Radian,
  TopocentricCoordinates
} from '@/types'
import { getLocalSiderealTime } from '@/juliandays'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { fmod24 } from '@/utils'
import { DEG2H, DEG2RAD, H2RAD, RAD2DEG } from '@/constants'

/**
 * Transform equatorial coordinates to topocentric coordinates.
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates } coords The equatorial coordinates
 * @param {AstronomicalUnit} distance The object geocentric distance
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @returns {TopocentricCoordinates}
 */
export function transformEquatorialToTopocentric (jd: JulianDay,
                                                  coords: EquatorialCoordinates,
                                                  distance: AstronomicalUnit | number,
                                                  geoCoords: GeographicCoordinates): TopocentricCoordinates {
  if (geoCoords.height === undefined) {
    throw new Error('The geographic coordinates must contain a value for "height".')
  }
  const corrections = getFlatteningCorrections(geoCoords.height, geoCoords.latitude)
  
  const factor: ArcSecond = 8.794
  const sinpi: ArcSecond = Math.sin(factor / 3600 * DEG2RAD) / distance
  const theta0: Hour = getLocalSiderealTime(jd, 0)
  const H: Radian = fmod24(theta0 + geoCoords.longitude * DEG2H - coords.rightAscension * DEG2H) * H2RAD
  
  const sindec = Math.sin(coords.declination * DEG2RAD)
  const cosdec = Math.cos(coords.declination * DEG2RAD)
  
  const numeratorAlpha: Radian = -1 * corrections.rhocosphi * sinpi * Math.sin(H)
  const denominatorAlpha: Radian = cosdec - corrections.rhocosphi * sinpi * Math.cos(H)
  const tanDeltaAlpha: Radian = numeratorAlpha / denominatorAlpha
  
  const cosDeltaAlpha: Radian = Math.cos(Math.atan(tanDeltaAlpha))
  const numeratorDelta: Radian = (sindec - corrections.rhosinphi * sinpi) * cosDeltaAlpha
  const denominatorDelta: Radian = cosdec - (corrections.rhocosphi * sinpi * Math.cos(H))
  const tanDeltaPrime: Radian = numeratorDelta / denominatorDelta
  
  return {
    rightAscension: coords.rightAscension + Math.atan(tanDeltaAlpha) * RAD2DEG,
    declination: Math.atan(tanDeltaPrime) * RAD2DEG
  }
}
