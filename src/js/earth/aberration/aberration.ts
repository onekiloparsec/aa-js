import {
  ArcSecond,
  EclipticCoordinates,
  EclipticCoordinatesCorrection,
  EquatorialCoordinates,
  EquatorialCoordinatesCorrection,
  JulianDay,
  Radian
} from '@/js/types'
import { CONSTANT_OF_ABERRATION, DEG2RAD, RAD2DEG } from '@/js/constants'
import { Sun } from '@/js/sun'
import {
  getMeanObliquityOfEcliptic,
  getNutationInLongitude,
  getNutationInObliquity,
  getTrueObliquityOfEcliptic
} from '../nutation'
import { getEccentricity, getLongitudeOfPerihelion } from '../coordinates'
import { getEarthVelocity } from './earthvelocity'

/**
 * Accurate annual aberration for equatorial coordinates
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * This is the high-accuracy Ron-Vondrak expression for aberration. See AA p153.
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @return {EquatorialCoordinatesCorrection}
 * @memberof module:Earth
 */
export function getAccurateAnnualEquatorialAberration (jd: JulianDay, coords: EquatorialCoordinates): EquatorialCoordinatesCorrection {
  
  const ra = coords.rightAscension * DEG2RAD
  const dec = coords.declination * DEG2RAD
  
  const cosAlpha = Math.cos(ra)
  const sinAlpha = Math.sin(ra)
  const cosDelta = Math.cos(dec)
  const sinDelta = Math.sin(dec)
  
  const velocity = getEarthVelocity(jd)
  const c = 17_314_463_350.0 // Speed of light in units of 10^-8 UA / day. See AA p 155.
  
  const X0 = velocity.Y * cosAlpha - velocity.X * sinAlpha
  const X = X0 / (c * cosDelta)
  
  const Y0 = velocity.X * cosAlpha + velocity.Y * sinAlpha
  const Y1 = velocity.Z * cosDelta
  const Y = (Y0 * sinDelta - Y1) / c
  
  return {
    DeltaRightAscension: X * RAD2DEG * 3600, // to obtain units of ArcSecond
    DeltaDeclination: -1 * Y * RAD2DEG * 3600 // to obtain units of ArcSecond
  }
}

/**
 * Equatorial (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * See getAccurateAnnualEquatorialAberration for high-accuracy algorithm, taking into account the total velocity of the Earth
 * relative to the barycenter of the solar system.
 * See AA p 152, Equ 23.3
 * @see {getAccurateAnnualEquatorialAberration}
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in ArcSeconds
 * @memberof module:Earth
 */
export function getAnnualEquatorialAberration (jd: JulianDay, coords: EquatorialCoordinates): EquatorialCoordinatesCorrection {
  let DeltaRightAscension: ArcSecond, DeltaDeclination: ArcSecond
  
  const ra = coords.rightAscension * DEG2RAD
  const dec = coords.declination * DEG2RAD
  
  const e = getEccentricity(jd)
  const k = CONSTANT_OF_ABERRATION
  const pi = getLongitudeOfPerihelion(jd) * DEG2RAD
  const epsilon = getTrueObliquityOfEcliptic(jd) * DEG2RAD
  const sunLongitude = Sun.getGeometricEclipticLongitude(jd) * DEG2RAD
  
  const cosPi = Math.cos(pi)
  const sinPi = Math.sin(pi)
  const cosEpsilon = Math.cos(epsilon)
  const tanEpsilon = Math.tan(epsilon)
  
  // Use the geoMETRIC longitude. See AA p.151
  const cosLong = Math.cos(sunLongitude)
  const sinLong = Math.sin(sunLongitude)
  
  const cosAlpha = Math.cos(ra)
  const sinAlpha = Math.sin(ra)
  const cosDelta = Math.cos(dec)
  const sinDelta = Math.sin(dec)
  
  const A0 = cosAlpha * cosLong * cosEpsilon + sinAlpha * sinLong
  const A1 = cosAlpha * cosPi * cosEpsilon + sinAlpha * sinPi
  DeltaRightAscension = -1 * k * (A0 / cosDelta) + e * k * A1 / cosDelta
  
  
  const D0 = tanEpsilon * cosDelta - sinAlpha * sinDelta
  const D1 = cosLong * cosEpsilon * D0 + cosAlpha * sinDelta * sinLong
  const D2 = cosPi * cosEpsilon * D0 + cosAlpha * sinDelta * sinPi
  DeltaDeclination = -1 * k * D1 + e * k * D2
  
  return { DeltaRightAscension, DeltaDeclination }
}

/**
 * Ecliptic (annual) aberration
 * It is due to the orbital motion of the Earth around the barycenter of the Solar system.
 * @param {JulianDay} jd The julian day
 * @param {EclipticCoordinates} coords The ecliptic coordinates
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in Arcsecond
 * @memberof module:Earth
 */
export function getAnnualEclipticAberration (jd: JulianDay, coords: EclipticCoordinates): EclipticCoordinatesCorrection {
  const e = getEccentricity(jd)
  const pi = getLongitudeOfPerihelion(jd)
  const k = CONSTANT_OF_ABERRATION
  
  // Use the geoMETRIC longitude. See AA p.151
  const sunLongitude: Radian = Sun.getGeometricEclipticLongitude(jd) * DEG2RAD
  const LambdaRad: Radian = coords.longitude * DEG2RAD
  const BetaRad: Radian = coords.latitude * DEG2RAD
  
  const X0 = -1 * k * Math.cos(sunLongitude - LambdaRad)
  const X1 = e * k * Math.cos(pi - LambdaRad)
  const X: ArcSecond = (X0 + X1) / Math.cos(BetaRad) / 3600
  
  const Y0 = -1 * k * Math.sin(BetaRad)
  const Y1 = Math.sin(sunLongitude - LambdaRad)
  const Y2 = e * (Math.sin(pi - LambdaRad))
  const Y: ArcSecond = Y0 * (Y1 - Y2) / 3600
  
  return { DeltaLongitude: X, DeltaLatitude: Y }
}

/**
 * Equatorial aberration due to nutation.
 * Warning: this is valid is not near the celestial poles (say < 1").
 * This is useful for stars, whose position are often given in equatorial coordinates.
 * For planets, use the `getApparentEquatorialCoordinates` methods instead.
 * See AA p 151, Equ 23.1
 * @param {JulianDay} jd The julian day
 * @param {EquatorialCoordinates} coords The equatorial coordinates
 * @return {EclipticCoordinatesCorrection} The coordinates corrections in Arcsecond
 * @memberof module:Earth
 */
export function getNutationEquatorialAberration (jd: JulianDay, coords: EquatorialCoordinates): EquatorialCoordinatesCorrection {
  const epsilon: Radian = getMeanObliquityOfEcliptic(jd) * DEG2RAD
  
  const DeltaEpsilon: ArcSecond = getNutationInObliquity(jd)
  const DeltaPsi: ArcSecond = getNutationInLongitude(jd)
  
  const ra: Radian = coords.rightAscension * DEG2RAD
  const dec: Radian = coords.declination * DEG2RAD
  
  const cosEpsilon = Math.cos(epsilon)
  const sinEpsilon = Math.sin(epsilon)
  
  const cosAlpha = Math.cos(ra)
  const sinAlpha = Math.sin(ra)
  const tanDelta = Math.tan(dec)
  
  const A0 = cosEpsilon + sinEpsilon * sinAlpha * tanDelta
  const DeltaRightAscension = DeltaPsi * A0 - DeltaEpsilon * cosAlpha * tanDelta
  const DeltaDeclination = DeltaPsi * sinEpsilon * cosAlpha + DeltaEpsilon * sinAlpha
  
  return { DeltaRightAscension, DeltaDeclination }
}
