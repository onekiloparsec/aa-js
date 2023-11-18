import Decimal from '@/decimal'
import {
  Degree,
  EquatorialCoordinates,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  HorizontalCoordinates,
  HorizontalCoordinatesNum,
  JulianDay
} from '@/types'
import { getLocalSiderealTime } from '@/juliandays'
import { fmod360, fmod90 } from '@/utils'
import { RAD2DEG } from '@/constants'


/**
 * Equatorial right ascension from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates | HorizontalCoordinatesNum} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getRightAscensionFromHorizontal (jd: JulianDay | number,
                                                 horCoords: HorizontalCoordinates | HorizontalCoordinatesNum,
                                                 geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                                 highPrecision: boolean = true): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude, highPrecision).hoursToDegrees()
  const rHorCoords = {
    azimuth: new Decimal(horCoords.azimuth).degreesToRadians(),
    altitude: new Decimal(horCoords.altitude).degreesToRadians()
  }
  const rGeoCoords = {
    longitude: new Decimal(geoCoords.longitude).degreesToRadians(),
    latitude: new Decimal(geoCoords.latitude).degreesToRadians()
  }
  let value
  if (highPrecision) {
    const y = Decimal.sin(rHorCoords.azimuth)
    const x = Decimal.cos(rHorCoords.azimuth).mul(Decimal.sin(rGeoCoords.latitude))
      .plus(Decimal.tan(rHorCoords.altitude).mul(Decimal.cos(rGeoCoords.latitude)))
    value = lmst.minus(Decimal.atan2(y, x).radiansToDegrees())
  } else {
    const y = Math.sin(rHorCoords.azimuth.toNumber())
    const x = Math.cos(rHorCoords.azimuth.toNumber()) * Math.sin(rGeoCoords.latitude.toNumber())
      + Math.tan(rHorCoords.altitude.toNumber()) * Math.cos(rGeoCoords.latitude.toNumber())
    value = lmst.toNumber() - Math.atan2(y, x) * RAD2DEG.toNumber()
  }
  return fmod360(new Decimal(value))
}

/**
 * Equatorial declination from horizontal coordinates
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates | HorizontalCoordinatesNum} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (horCoords: HorizontalCoordinates | HorizontalCoordinatesNum,
                                              geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                              highPrecision: boolean = true): Degree {
  const rHorCoords = {
    azimuth: new Decimal(horCoords.azimuth).degreesToRadians(),
    altitude: new Decimal(horCoords.altitude).degreesToRadians()
  }
  const rGeoCoords = {
    longitude: new Decimal(geoCoords.longitude).degreesToRadians(),
    latitude: new Decimal(geoCoords.latitude).degreesToRadians()
  }
  let value
  if (highPrecision) {
    value = Decimal.asin(
      Decimal.sin(rGeoCoords.latitude).mul(Decimal.sin(rHorCoords.altitude))
        .minus(Decimal.cos(rGeoCoords.latitude).mul(Decimal.cos(rHorCoords.altitude)).mul(Decimal.cos(rHorCoords.azimuth)))
    )
  } else {
    value = Math.asin(
      Math.sin(rGeoCoords.latitude.toNumber()) * Math.sin(rHorCoords.altitude.toNumber())
      - Math.cos(rGeoCoords.latitude.toNumber()) * Math.cos(rHorCoords.altitude.toNumber()) * Math.cos(rHorCoords.azimuth.toNumber())
    )
  }
  return fmod90(new Decimal(value).radiansToDegrees())
}

/**
 * Transform horizontal coordinates to equatorial coordinates.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {HorizontalCoordinates | HorizontalCoordinatesNum} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 */
export function transformHorizontalToEquatorial (jd: JulianDay | number,
                                                 horCoords: HorizontalCoordinates | HorizontalCoordinatesNum,
                                                 geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                                 highPrecision: boolean = true): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromHorizontal(jd, horCoords, geoCoords, highPrecision),
    declination: getDeclinationFromHorizontal(horCoords, geoCoords, highPrecision)
  }
}
