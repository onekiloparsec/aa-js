import { ArcSecond, Degree, JulianDay, Radian, SaturnicentricCoordinates, SaturnRingSystem } from '@/js/types'
import { DEG2RAD, PIHALF, PITWO, RAD2DEG } from '@/js/constants'
import { transformEclipticToEquatorial } from '@/js/coordinates'
import { getLightTimeFromDistance } from '@/js/distances'
import { getJulianCentury } from '@/js/juliandays'
import { fmod, fmod360 } from '@/js/utils'
import { Earth } from '@/js/earth'
import { EllipticalDistance, getPlanetDistanceDetailsFromEarth } from '../elliptical'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

/**
 * The details of Saturn's ring system.
 * @param {JulianDay} jd
 * @returns {SaturnRingSystem}
 * @memberof module:Saturn
 */
export function getRingSystemDetails (jd: JulianDay): SaturnRingSystem {
  const T = getJulianCentury(jd)
  
  // Step 1:
  // Inclination and Longitude of the ascending node of the plane of the ring referred to the ecliptic
  // and mean equinox of the date.
  const i: Radian = (28.075_216 - 0.012_998 * T + 0.000_004 * Math.pow(T, 2)) * DEG2RAD
  
  const Omega: Radian = (169.508_470 + 1.394_681 * T + 0.000_412 + Math.pow(T, 2)) * DEG2RAD
  
  // Step 2.
  // Heliocentric longitude, latitude and radius vector of the Earth, referred to the eclliptic and
  // mean equinox of the date.
  const l0: Radian = Earth.getEclipticLongitude(jd) * DEG2RAD
  // b0 and l0 are only involved in the computation of Delta, the Saturn distance to Earth
  // which is hidden in the computation of details = getPlanetDistanceDetailsFromEarth...
  // const b0: Radian = Earth.getEclipticLatitude(jd)* DEG2RAD
  // const R: AstronomicalUnit = Earth.getRadiusVector(jd)
  
  // Step 3. Calculate the corresponding coordinates l,b,r for Saturn but for the instance t-lightraveltime
  // Starting point: 9 AU, because Earth-Saturn distance is always between 8.0 and 11.1 AU (AA p.318).
  let earthLightTravelTime = getLightTimeFromDistance(9)
  const JD1 = jd - earthLightTravelTime
  let details: EllipticalDistance = getPlanetDistanceDetailsFromEarth(JD1, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  
  // New estimation of earthLightTravelTime === tau
  earthLightTravelTime = getLightTimeFromDistance(details.Delta)
  // Slightly shifted JD!
  const JD2 = jd - earthLightTravelTime
  details = getPlanetDistanceDetailsFromEarth(JD2, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  const [l, b, r] = [details.l, details.b, details.r]
  
  // Step 4.
  const earthSaturnDistance = details.Delta
  
  // Step 5.
  // Calculate the geocentric longitude and latitude of Saturn
  const lambda: Radian = fmod(Math.atan2(details.y, details.x), PITWO)
  const beta: Radian = Math.atan2(details.z, Math.sqrt(Math.pow(details.x, 2) + Math.pow(details.y, 2)))
  
  // Step 6. Calculate B, a and b. Keep B in Degree for consistency of returned object.
  const B: Degree = Math.asin(Math.sin(i) * Math.cos(beta) * Math.sin(lambda - Omega) - Math.cos(i) * Math.sin(beta)) * RAD2DEG
  
  const majorAxis: ArcSecond = 375.35 / earthSaturnDistance
  const minorAxis: ArcSecond = majorAxis * Math.sin(Math.abs(B) * DEG2RAD)
  
  // To expose in APIs one day:
  // Factors by which the axes a and b of the outer edge of the outer ring are to be multiplied to obtain the axes of:
  // Inner edge of outer ring: 0.8801
  // Outer edge of inner ring: 0.8599
  // Inner edge of inner ring: 0.6650
  // Inner edge of dusky ring: 0.5486
  
  // Step 7.
  // Calculate the longitude of the ascending node of Saturn's orbit
  const N: Radian = (113.6655 + 0.8771 * T) * DEG2RAD
  const ldash: Radian = (l * RAD2DEG - 0.017_59 / r) * DEG2RAD
  const bdash: Radian = (b * RAD2DEG - 0.000_764 * Math.cos(l - N) / r) * DEG2RAD
  
  // Step 8.
  // Calculate Bdash, the Saturnicentric latitude of the Sun referred to the plane of the ring
  // When Bdash > 0, the illuminated surface of the ring, is the northern one.
  const Bdash: Degree = Math.asin(Math.sin(i) * Math.cos(bdash) * Math.sin(ldash - Omega) - Math.cos(i) * Math.sin(bdash)) * RAD2DEG
  
  // Step 9. Calculate DeltaU
  const U1: Degree = Math.atan2(
    Math.sin(i) * Math.sin(bdash) + Math.cos(i) * Math.cos(bdash) * Math.sin(ldash - Omega),
    Math.cos(bdash) * Math.cos(ldash - Omega)
  ) * RAD2DEG
  
  const U2: Degree = Math.atan2(
    Math.sin(i) * Math.sin(beta) + Math.cos(i) * Math.cos(beta) * Math.sin(lambda - Omega),
    Math.cos(beta) * Math.cos(lambda - Omega)
  ) * RAD2DEG
  
  // Difference to be computed in degrees. DeltaU is a small angle ~< 5º
  const DeltaU: Degree = fmod360(Math.abs(U1 - U2))
  
  // Step 10. Calculate the Nutation and Obliquity
  const epsilon: Degree = Earth.getTrueObliquityOfEcliptic(jd)
  const deltaPsi: Degree = Earth.getNutationInLongitude(jd) / 3600
  
  // Step 11. Calculate the ecliptical longitude and latitude of the northern pole of the ring plane
  const lambda0: Degree = (Omega - PIHALF) * RAD2DEG
  const beta0: Degree = (PIHALF - i) * RAD2DEG
  
  // Step 12. Correct lambda and beta for the aberration of Saturn, then nutation
  const lambdaCorrection: Degree = 0.005_693 * Math.cos(l0 - lambda) / Math.cos(beta)
  const betaCorrection: Degree = 0.005_693 * Math.sin(l0 - lambda) * Math.sin(beta)
  
  let correctedLambda: Degree = fmod360(lambda * RAD2DEG + lambdaCorrection)
  const correctedBeta: Degree = beta * RAD2DEG + betaCorrection
  
  // Step 13. Add nutation in longitude to lambda0 and lambda
  const correctedLambda0: Degree = lambda0 + deltaPsi
  correctedLambda = correctedLambda + deltaPsi
  
  // Step 14. Convert to equatorial coordinates
  const eclCoords = { longitude: correctedLambda, latitude: correctedBeta }
  const geocentricEclipticSaturn = transformEclipticToEquatorial(eclCoords, epsilon)
  const alpha: Radian = geocentricEclipticSaturn.rightAscension * DEG2RAD
  const delta: Radian = geocentricEclipticSaturn.declination * DEG2RAD
  
  const eclCoords0 = { longitude: correctedLambda0, latitude: beta0 }
  const geocentricEclipticNorthPole = transformEclipticToEquatorial(eclCoords0, epsilon)
  const alpha0: Radian = geocentricEclipticNorthPole.rightAscension * DEG2RAD
  const delta0: Radian = geocentricEclipticNorthPole.declination * DEG2RAD
  
  // Step 15. Calculate the Position angle
  const northPolePositionAngle: Degree = Math.atan2(
    Math.cos(delta0) * Math.sin(alpha0 - alpha),
    Math.sin(delta0) * Math.cos(delta) - Math.cos(delta0) * Math.sin(delta) * Math.cos(alpha0 - alpha)
  ) * RAD2DEG
  
  const earthCoordinates: SaturnicentricCoordinates = {
    longitude: U2,
    latitude: B
  }
  const sunCoordinates: SaturnicentricCoordinates = {
    longitude: U1,
    latitude: Bdash
  }
  
  return {
    majorAxis, // The major axis of the outer edge of the outer ring.
    minorAxis, // The minor axis of the outer edge of the outer ring.
    // The position angle of the north pole of rotation of the planet. Because the ring is
    // situated exactly in Saturn's equator plane, P is also the geocentric position angle of the
    // northern semiminor axis of the apparent ellipse of the ring, measured from the North towards
    // the East (trust me... see AA p.317)
    northPolePositionAngle,
    // The difference between the Saturnicentric longitude of the Sun and the Earth, measured in
    // the plane of the ring. Used to compute Saturn's magnitude.
    saturnicentricSunEarthLongitudesDifference: DeltaU,
    // The Saturnicentric coordinates of the Earth referred to the plane of the ring (B)
    earthCoordinates,
    // The Saturnicentric coordinates of the Sun referred to the plane of the ring (B)
    sunCoordinates
  }
}
