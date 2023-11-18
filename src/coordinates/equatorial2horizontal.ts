import {
  Degree,
  EquatorialCoordinates,
  EquatorialCoordinatesNum,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  HorizontalCoordinates,
  JulianDay
} from '@/types'
import { getLocalSiderealTime } from '@/juliandays'
import Decimal from '@/decimal'
import { fmod360, fmod90 } from '@/utils'

/**
 * Horizontal (local) altitude (where horizon is zero degrees)
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getHorizontalAltitude (jd: JulianDay | number,
                                       equCoords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                       geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                       highPrecision: boolean = true): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude, highPrecision).hoursToDegrees()
  const hourAngle = lmst.minus(equCoords.rightAscension).degreesToRadians()
  const rEquCoords = {
    rightAscension: new Decimal(equCoords.rightAscension).degreesToRadians(),
    declination: new Decimal(equCoords.declination).degreesToRadians()
  }
  const rGeoCoords = {
    longitude: new Decimal(geoCoords.longitude).degreesToRadians(),
    latitude: new Decimal(geoCoords.latitude).degreesToRadians()
  }
  let value
  if (highPrecision) {
    value = Decimal.asin(
      Decimal.sin(rGeoCoords.latitude).mul(Decimal.sin(rEquCoords.declination))
        .plus(Decimal.cos(rGeoCoords.latitude).mul(Decimal.cos(rEquCoords.declination)).mul(Decimal.cos(hourAngle)))
    )
  } else {
    value = Math.asin(
      Math.sin(rGeoCoords.latitude.toNumber()) * Math.sin(rEquCoords.declination.toNumber())
      + Math.cos(rGeoCoords.latitude.toNumber()) * Math.cos(rEquCoords.declination.toNumber()) * Math.cos(hourAngle.toNumber())
    )
  }
  return fmod90(new Decimal(value).radiansToDegrees())
}

/**
 * Horizontal (local) azimuth.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getHorizontalAzimuth (jd: JulianDay | number,
                                      equCoords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                      geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                      highPrecision: boolean = true): Degree {
  const lmst = getLocalSiderealTime(jd, geoCoords.longitude, highPrecision).hoursToDegrees()
  const hourAngle = lmst.minus(equCoords.rightAscension).degreesToRadians()
  const rEquCoords = {
    rightAscension: new Decimal(equCoords.rightAscension).degreesToRadians(),
    declination: new Decimal(equCoords.declination).degreesToRadians()
  }
  const rGeoCoords = {
    longitude: new Decimal(geoCoords.longitude).degreesToRadians(),
    latitude: new Decimal(geoCoords.latitude).degreesToRadians()
  }
  let value
  if (highPrecision) {
    value = Decimal.atan2(
      Decimal.sin(hourAngle),
      Decimal.cos(hourAngle).mul(Decimal.sin(rGeoCoords.latitude))
        .minus(Decimal.tan(rEquCoords.declination).mul(Decimal.cos(rGeoCoords.latitude)))
    )
  } else {
    value = Math.atan2(
      Math.sin(hourAngle.toNumber()),
      Math.cos(hourAngle.toNumber()) * Math.sin(rGeoCoords.latitude.toNumber())
      - Math.tan(rEquCoords.declination.toNumber()) * Math.cos(rGeoCoords.latitude.toNumber()))
  }
  return fmod360(new Decimal(value).radiansToDegrees())
}


/**
 * Transform equatorial coordinates to horizontal coordinates.
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {HorizontalCoordinates}
 */
export function transformEquatorialToHorizontal (jd: JulianDay | number,
                                                 equCoords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                                 geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                                 highPrecision: boolean = true): HorizontalCoordinates {
  return {
    azimuth: getHorizontalAzimuth(jd, equCoords, geoCoords, highPrecision),
    altitude: getHorizontalAltitude(jd, equCoords, geoCoords, highPrecision)
  }
}
