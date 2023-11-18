import Decimal from '@/decimal'
import { DEG2RAD, RAD2DEG } from '@/constants'
import { getLocalSiderealTime } from '@/juliandays'
import {
  Degree,
  EquatorialCoordinates,
  EquatorialCoordinatesNum,
  GeographicCoordinates,
  GeographicCoordinatesNum,
  JulianDay,
  Radian
} from '@/types'

/**
 * Paralactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 * @param {JulianDay} jd The julian day of the observation.
 * @param {GeographicCoordinates | GeographicCoordinatesNum} geoCoords The geographic coordinates of the observer's location.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} equCoords The object equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The paralactic angle
 */
export function getParallacticAngle (jd: JulianDay | number,
                                     equCoords: EquatorialCoordinates | EquatorialCoordinatesNum,
                                     geoCoords: GeographicCoordinates | GeographicCoordinatesNum,
                                     highPrecision: boolean = true): Degree {
  const lmst: Degree = getLocalSiderealTime(jd, geoCoords.longitude, highPrecision).hoursToDegrees()
  const HA: Radian = lmst.minus(new Decimal(equCoords.rightAscension)).degreesToRadians()

  const rEquCoords = {
    rightAscension: new Decimal(equCoords.rightAscension).degreesToRadians(),
    declination: new Decimal(equCoords.declination).degreesToRadians()
  }
  const rGeoCoords = {
    longitude: new Decimal(geoCoords.longitude).degreesToRadians(),
    latitude: new Decimal(geoCoords.latitude).degreesToRadians()
  }

  let angle = undefined

  if (highPrecision) {
    const cosdec = Decimal.cos(rEquCoords.declination)
    if (!cosdec.isZero()) {
      angle = Decimal.atan2(
        Decimal.sin(HA),
        (Decimal.tan(rGeoCoords.latitude).mul(cosdec)).minus(Decimal.sin(rEquCoords.declination).mul(Decimal.cos(HA)))
      ).radiansToDegrees()
    } else {
      angle = (new Decimal(rGeoCoords.latitude).greaterThanOrEqualTo(0)) ? new Decimal(180) : new Decimal(0.0)
    }
  } else {
    const cosdec = Math.cos(rEquCoords.declination.toNumber())
    if (cosdec !== 0) {
      angle = new Decimal(
        Math.atan2(
          Math.sin(HA.toNumber()),
          Math.tan(rGeoCoords.latitude.toNumber()) * cosdec - Math.sin(rEquCoords.declination.toNumber()) * Math.cos(HA.toNumber())
        ) * RAD2DEG.toNumber()
      )
    } else {
      angle = (rGeoCoords.latitude.toNumber() >= 0) ? new Decimal(180) : new Decimal(0.0)
    }
  }

  return angle
}

/**
 * The Great Circle angular distance between two spherical coordinates.
 * It uses the alternative formula of AA p115, which works well for small and large angles.
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords1
 * @param {EquatorialCoordinates | EquatorialCoordinatesNum} coords2
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getGreatCircleAngularDistance (coords1: EquatorialCoordinates | EquatorialCoordinatesNum,
                                               coords2: EquatorialCoordinates | EquatorialCoordinatesNum,
                                               highPrecision: boolean = true) {
  if (highPrecision) {
    const alpha1 = new Decimal(coords1.rightAscension).degreesToRadians()
    const alpha2 = new Decimal(coords2.rightAscension).degreesToRadians()
    const delta1 = new Decimal(coords1.declination).degreesToRadians()
    const delta2 = new Decimal(coords2.declination).degreesToRadians()

    const x = Decimal.cos(delta1).mul(Decimal.sin(delta2))
      .minus(Decimal.sin(delta1).mul(Decimal.cos(delta2)).mul(Decimal.cos(alpha2.minus(alpha1))))
    const y = Decimal.cos(delta2).mul(Decimal.sin(alpha2.minus(alpha1)))
    const z = Decimal.sin(delta1).mul(Decimal.sin(delta2))
      .plus(Decimal.cos(delta1).mul(Decimal.cos(delta2)).mul(Decimal.cos(alpha2.minus(alpha1))))
    return Decimal.atan2(Decimal.sqrt(x.pow(2).plus(y.pow(2))), z).radiansToDegrees()
  } else {
    const deg2rad = DEG2RAD.toNumber()
    const alpha1 = (Decimal.isDecimal(coords1.rightAscension) ? coords1.rightAscension.toNumber() : coords1.rightAscension) * deg2rad
    const alpha2 = (Decimal.isDecimal(coords2.rightAscension) ? coords2.rightAscension.toNumber() : coords2.rightAscension) * deg2rad
    const delta1 = (Decimal.isDecimal(coords1.declination) ? coords1.declination.toNumber() : coords1.declination) * deg2rad
    const delta2 = (Decimal.isDecimal(coords2.declination) ? coords2.declination.toNumber() : coords2.declination) * deg2rad

    const x = Math.cos(delta1) * Math.sin(delta2)
      - Math.sin(delta1) * Math.cos(delta2) * Math.cos(alpha2 - alpha1)
    const y = Math.cos(delta2) * Math.sin(alpha2 - alpha1)
    const z = Math.sin(delta1) * Math.sin(delta2)
      + Math.cos(delta1) * Math.cos(delta2) * Math.cos(alpha2 - alpha1)

    return new Decimal(
      Math.atan2(Math.sqrt(x * x + y * y), z) * deg2rad
    )
  }
}
