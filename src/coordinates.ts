/**
 @module Coordinates
 */
import Decimal from '@/decimal'
import {
  ArcSecond,
  AstronomicalUnit,
  Degree,
  EclipticCoordinates,
  EquatorialCoordinates,
  EquatorialCoordinatesH,
  GalacticCoordinates,
  GeographicCoordinates,
  HorizontalCoordinates,
  Hour,
  JulianDay,
  Point,
  Radian,
  TopocentricCoordinates
} from './types'
import { ECLIPTIC_OBLIQUITY_J2000_0, J2000, JULIAN_DAY_B1950_0, MINUSONE, RAD2DEG } from '@/constants'
import { getLocalSiderealTime } from '@/juliandays'
import { precessEquatorialCoordinates } from '@/precession'
import { getFlatteningCorrections } from '@/earth/coordinates'
import { fmod24, fmod360, fmod90 } from '@/utils'

/**
 * Equatorial right ascension from ecliptic coordinates
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The ecliptic obliquity (default = obliquity of J2000)
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} Degree (v3.2+), not HOURS (< v3.2)
 */
export function getRightAscensionFromEcliptic (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): Degree {
  const dcoords = {
    longitude: new Decimal(coords.longitude).degreesToRadians(),
    latitude: new Decimal(coords.latitude).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.atan2(
      Decimal.sin(dcoords.longitude).mul(Decimal.cos(depsilon))
        .minus(Decimal.tan(dcoords.latitude).mul(Decimal.sin(depsilon))),
      Decimal.cos(dcoords.longitude)
    )
  } else {
    value = Math.atan2(
      Math.sin(dcoords.longitude.toNumber()) * Math.cos(depsilon.toNumber())
      - Math.tan(dcoords.latitude.toNumber()) * Math.sin(depsilon.toNumber()),
      Math.cos(dcoords.longitude.toNumber())
    )
  }
  return fmod360(new Decimal(value).radiansToDegrees())
}

/**
 * Equatorial declination from ecliptic coordinates
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @return {Degree}
 */
export function getDeclinationFromEcliptic (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): Degree {
  const dcoords = {
    longitude: new Decimal(coords.longitude).degreesToRadians(),
    latitude: new Decimal(coords.latitude).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.asin(
      Decimal.sin(dcoords.latitude).mul(Decimal.cos(depsilon))
        .plus(Decimal.cos(dcoords.latitude).mul(Decimal.sin(depsilon)).mul(Decimal.sin(dcoords.longitude)))
    )
  } else {
    value = Math.asin(
      Math.sin(dcoords.latitude.toNumber()) * Math.cos(depsilon.toNumber())
      + Math.cos(dcoords.latitude.toNumber()) * Math.sin(depsilon.toNumber()) * Math.sin(dcoords.longitude.toNumber())
    )
  }
  return fmod90(new Decimal(value).radiansToDegrees())
}

/**
 * Transform ecliptic longitude and latitude to equatorial coordinates.
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinates}
 */
export function transformEclipticToEquatorial (coords: EclipticCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromEcliptic(coords, epsilon, highPrecision),
    declination: getDeclinationFromEcliptic(coords, epsilon, highPrecision)
  }
}

/**
 * Ecliptic longitude from equatorial coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getEclipticLongitudeFromEquatorial (coords: EquatorialCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): Degree {
  const dcoords = {
    rightAscension: new Decimal(coords.rightAscension).degreesToRadians(),
    declination: new Decimal(coords.declination).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.atan2(
      Decimal.sin(dcoords.rightAscension).mul(Decimal.cos(depsilon))
        .plus(Decimal.tan(dcoords.declination).mul(Decimal.sin(depsilon))),
      Decimal.cos(dcoords.rightAscension)
    )
  } else {
    value = Math.atan2(
      Math.sin(dcoords.rightAscension.toNumber()) * Math.cos(depsilon.toNumber())
      + Math.tan(dcoords.declination.toNumber()) * Math.sin(depsilon.toNumber()),
      Math.cos(dcoords.rightAscension.toNumber())
    )
  }
  return fmod360(new Decimal(value).radiansToDegrees())
}

/**
 * Ecliptic latitude from equatorial coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true. * @returns {Degree}
 */
export function getEclipticLatitudeFromEquatorial (coords: EquatorialCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): Degree {
  const dcoords = {
    rightAscension: new Decimal(coords.rightAscension).degreesToRadians(),
    declination: new Decimal(coords.declination).degreesToRadians()
  }
  const depsilon = new Decimal(epsilon).degreesToRadians()
  let value
  if (highPrecision) {
    value = Decimal.asin(
      Decimal.sin(dcoords.declination).mul(Decimal.cos(depsilon))
        .minus(Decimal.cos(dcoords.declination).mul(Decimal.sin(depsilon).mul(Decimal.sin(dcoords.rightAscension))))
    )
  } else {
    value = Math.asin(
      Math.sin(dcoords.declination.toNumber()) * Math.cos(depsilon.toNumber())
      - Math.cos(dcoords.declination.toNumber()) * Math.sin(depsilon.toNumber()) * Math.sin(dcoords.rightAscension.toNumber())
    )
  }
  return fmod90(new Decimal(value).radiansToDegrees())
}

/**
 * Transform equatorial coordinates to ecliptic coordinates
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epsilon The obliquity of the ecliptic; that is, the angle between the ecliptic
 * and the celestial equator. The mean obliquity (epsilon0) is given by nutation.getMeanObliquityOfEcliptic(jd).
 * If however the *apparent* R.A. and Dec. are required (that is, affected by aberration and nutation), the
 * true obliquity epsilon + Delta epsilon should be used. One can use nutation.getTrueObliquityOfEcliptic(jd)
 * If R.A. and Dec. are referred to the standard equinox of J2000, epsilon must be that of ECLIPTIC_OBLIQUITY_J2000_0.
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true. * @returns {Degree}
 */
export function transformEquatorialToEcliptic (coords: EquatorialCoordinates, epsilon: Degree | number = ECLIPTIC_OBLIQUITY_J2000_0, highPrecision: boolean = true): EclipticCoordinates {
  return {
    longitude: getEclipticLongitudeFromEquatorial(coords, epsilon, highPrecision),
    latitude: getEclipticLatitudeFromEquatorial(coords, epsilon, highPrecision)
  }
}

// --- galactic coordinates

/**
 * Galactic longitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLongitudeFromEquatorial (coords: EquatorialCoordinates, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: (equCoordsB1950.rightAscension as Degree).degreesToRadians(),
    declination: (equCoordsB1950.declination as Degree).degreesToRadians(),
  }
  const c1 = new Decimal(192.25).degreesToRadians()
  const c2 = new Decimal(27.4).degreesToRadians()
  const y = Decimal.sin(c1.minus(rcoords.rightAscension))
  const x1 = Decimal.cos(c1.minus(rcoords.rightAscension)).mul(Decimal.sin(c2))
  const x2 = Decimal.tan(rcoords.declination).mul(Decimal.cos(c2))
  return fmod360(new Decimal(303).minus(Decimal.atan2(y, x1.minus(x2)).radiansToDegrees()))
}

/**
 * Galactic latitude from equatorial coordinates.
 * See AA p.94
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {JulianDay} epoch The epoch (default = J2000)
 */
export function getGalacticLatitudeFromEquatorial (coords: EquatorialCoordinates, epoch: JulianDay | number = J2000): Degree {
  const equCoordsB1950 = precessEquatorialCoordinates(coords, epoch, JULIAN_DAY_B1950_0)
  const rcoords = {
    rightAscension: (equCoordsB1950.rightAscension as Degree).degreesToRadians(),
    declination: (equCoordsB1950.declination as Degree).degreesToRadians(),
  }
  const c1 = new Decimal(192.25).degreesToRadians()
  const c2 = new Decimal(27.4).degreesToRadians()
  return fmod360(
    Decimal.sin(rcoords.declination).mul(Decimal.sin(c2))
      .plus(Decimal.cos(rcoords.declination).mul(Decimal.cos(c2)).mul(c1.minus(rcoords.rightAscension)))
  )
}

/**
 * Transform equatorial coordinates to galactic coordinates.
 * @param {EquatorialCoordinates} coords The equatorial coordinates (in degrees)
 * @param {Degree} epoch The epoch of the equatorial coordinates. By default, J2000.
 */
export function transformEquatorialToGalactic (coords: EquatorialCoordinates, epoch: JulianDay | number = J2000): GalacticCoordinates {
  return {
    longitude: getGalacticLongitudeFromEquatorial(coords, epoch),
    latitude: getGalacticLatitudeFromEquatorial(coords, epoch)
  }
}

/**
 * Equatorial right ascension in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates} coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialRightAscensionB1950FromGalactic (coords: GalacticCoordinates): Degree {
  const c2 = new Decimal(27.4).degreesToRadians()
  const lprime = (new Decimal(coords.longitude).minus(123)).degreesToRadians()
  const b = new Decimal(coords.latitude).degreesToRadians()
  const y = Decimal.sin(lprime)
  const x = Decimal.cos(lprime).mul(Decimal.sin(c2)).minus(Decimal.tan(b).mul(Decimal.cos(c2)))
  return fmod24(new Decimal(12.15).plus(Decimal.atan2(y, x).radiansToDegrees()))
}

/**
 * Equatorial declination in epoch B1950 from galactic coordinates
 * See AA p.94
 * @param {GalacticCoordinates} coords The galactic coordinates
 * @returns {Degree}
 */
export function getEquatorialDeclinationB1950FromGalactic (coords: GalacticCoordinates): Degree {
  const c2 = new Decimal(27.4).degreesToRadians()
  const lprime = (new Decimal(coords.longitude).minus(123)).degreesToRadians()
  const b = new Decimal(coords.latitude).degreesToRadians()
  return fmod90(
    Decimal.asin(
      Decimal.sin(b).mul(Decimal.sin(c2))
        .plus(Decimal.cos(b).mul(Decimal.cos(c2)).mul(Decimal.cos(lprime)))
    ).radiansToDegrees()
  )
}

/**
 * Transform galactic coordinates to equatorial coordinates.
 * @param {GalacticCoordinates} coords The galactic coordinates
 * @param {Degree} epoch The initial epoch of the equatorial coordinates. By default, J2000.
 * @returns {EquatorialCoordinates}
 */
export function transformGalacticToEquatorial (coords: GalacticCoordinates, epoch: JulianDay | number = J2000): EquatorialCoordinates {
  const coordsB1950 = {
    rightAscension: getEquatorialRightAscensionB1950FromGalactic(coords),
    declination: getEquatorialDeclinationB1950FromGalactic(coords)
  }
  return precessEquatorialCoordinates(coordsB1950, JULIAN_DAY_B1950_0, epoch)
}

// --- horizontal coordinates

/**
 * Horizontal (local) altitude (where horizon is zero degrees)
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {EquatorialCoordinates} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getHorizontalAltitude (jd: JulianDay | number, geoCoords: GeographicCoordinates, equCoords: EquatorialCoordinates, highPrecision: boolean = true): Degree {
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
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {EquatorialCoordinates} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getHorizontalAzimuth (jd: JulianDay | number, geoCoords: GeographicCoordinates, equCoords: EquatorialCoordinates, highPrecision: boolean = true): Degree {
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
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {EquatorialCoordinates} equCoords The equatorial coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {HorizontalCoordinates}
 */
export function transformEquatorialToHorizontal (jd: JulianDay | number, geoCoords: GeographicCoordinates, equCoords: EquatorialCoordinates, highPrecision: boolean = true): HorizontalCoordinates {
  return {
    azimuth: getHorizontalAzimuth(jd, geoCoords, equCoords, highPrecision),
    altitude: getHorizontalAltitude(jd, geoCoords, equCoords, highPrecision)
  }
}

/**
 * Equatorial right ascension from horizontal coordinates
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getRightAscensionFromHorizontal (jd: JulianDay | number, geoCoords: GeographicCoordinates, horCoords: HorizontalCoordinates, highPrecision: boolean = true): Degree {
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
 * @param {JulianDay} jd The julian day
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree}
 */
export function getDeclinationFromHorizontal (jd: JulianDay | number, geoCoords: GeographicCoordinates, horCoords: HorizontalCoordinates, highPrecision: boolean = true): Degree {
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
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {EquatorialCoordinates} horCoords The horizontal coordinates of the target
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {EquatorialCoordinatesH}
 */
export function transformHorizontalToEquatorial (jd: JulianDay | number, geoCoords: GeographicCoordinates, horCoords: HorizontalCoordinates, highPrecision: boolean = true): EquatorialCoordinates {
  return {
    rightAscension: getRightAscensionFromHorizontal(jd, geoCoords, horCoords, highPrecision),
    declination: getDeclinationFromHorizontal(jd, geoCoords, horCoords, highPrecision)
  }
}

/**
 * Transform equatorial coordinates to topocentric coordinates.
 * @param {JulianDay} jd The julian day
 * @param {Degree} coords The equatorial coordinates
 * @param {AstronomicalUnit} distance The object geocentric distance
 * @param {GeographicCoordinates} geoCoords The geographic coordinates of the observer's location.
 * @returns {TopocentricCoordinates}
 */
export function transformEquatorialToTopocentric (jd: JulianDay | number, coords: EquatorialCoordinates, distance: AstronomicalUnit | number, geoCoords: GeographicCoordinates): TopocentricCoordinates {
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

/**
 * Transform a point (x,y) of the sky projected on a disk to horizontal coordinates.
 * @param {Point} point The point on the disk, relative to its center
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {HorizontalCoordinates}
 */
export function transformPointToHorizontal (point: Point, center: Point, radius: number): HorizontalCoordinates {
  const x = new Decimal(point.x).minus(center.x)
  const y = new Decimal(point.y).minus(center.y)
  const d = x.pow(2).plus(y.pow(2)).sqrt()
  return {
    azimuth: fmod360(new Decimal(-1).mul(Decimal.atan2(y, x).radiansToDegrees()).minus(270)),
    altitude: new Decimal(90.0).mul((new Decimal(1).minus(d.dividedBy(radius))))
  }
}

/**
 * Transform horizontal coordinates to a point (x,y) of the sky projected on a disk.
 * @param {HorizontalCoordinates} horCoords The horizontal coordinates of the target
 * @param {Point} center The center of the disk, relative to a relative origin
 * @param {number} radius The radius of the disk.
 * @returns {Point}
 */
export function transformHorizontalToPoint (horCoords: HorizontalCoordinates, center: Point, radius: number): Point {
  const ninety = new Decimal(90)

  const x = ninety.minus(horCoords.altitude)
    .mul(Decimal.cos((new Decimal(horCoords.azimuth).minus(ninety)).degreesToRadians()))
    .dividedBy(ninety)
    .mul(radius)

  const y = ninety.minus(horCoords.altitude)
    .mul(Decimal.sin((new Decimal(horCoords.azimuth).minus(ninety))).degreesToRadians())
    .dividedBy(ninety)
    .mul(radius)

  if (x.greaterThan(radius) || y.greaterThan(radius) || new Decimal(horCoords.altitude).lessThan(0.0)) {
    return { x: new Decimal(0), y: new Decimal(0) }
  }

  return { x: new Decimal(center.x).plus(x), y: new Decimal(center.y).minus(y) }
}

/**
 * Paralactic angle of an object at given equatorial coordinates, at a given time and observer's location.
 * @param {JulianDay} jd The julian day of the observation.
 * @param {GeographicCoordinates} geoCoords The observer's location
 * @param {EquatorialCoordinates} equCoords The object equatorial coordinates
 * @param {boolean} highPrecision Use (slower) arbitrary-precision decimal computations. default = true.
 * @returns {Degree} The paralactic angle
 */
export function getParallacticAngle (jd: JulianDay | number, geoCoords: GeographicCoordinates, equCoords: EquatorialCoordinates, highPrecision: boolean = true): Degree {
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
  const cosdec = Decimal.cos(rEquCoords.declination)

  if (!cosdec.isZero()) {
    angle = Decimal.atan2(
      Decimal.sin(HA),
      (Decimal.tan(rGeoCoords.latitude).mul(cosdec)).minus(Decimal.sin(rEquCoords.declination).mul(Decimal.cos(HA)))
    ).radiansToDegrees()
  } else {
    angle = (new Decimal(rGeoCoords.latitude).greaterThanOrEqualTo(0)) ? new Decimal(180) : new Decimal(0.0)
  }

  return angle
}

/**
 * The Great Circle angular distance between two spherical coordinates.
 * It uses the alternative formula of AA p115, which works well for small and large angles.
 * @param {EquatorialCoordinates} coords1
 * @param {EquatorialCoordinates} coords2
 * @returns {Degree}
 */
export function getGreatCircleAngularDistance (coords1: EquatorialCoordinates, coords2: EquatorialCoordinates) {
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
}
