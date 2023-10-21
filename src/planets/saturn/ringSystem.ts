import { JulianDay, SaturnicentricCoordinates, SaturnRingSystem } from '@/types'
import { DEG2RAD, H2RAD, RAD2DEG } from '@/constants'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getNutationInLongitude, getTrueObliquityOfEcliptic } from '@/nutation'
import { getCorrectionInLatitude, getCorrectionInLongitude } from '@/fk5'
import { getLightTimeFromDistance } from '@/distances'
import { fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

const sin = Math.sin
const cos = Math.cos
const asin = Math.asin
const sqrt = Math.sqrt
const fabs = Math.abs
const atan2 = Math.atan2

export function getRingSystemDetails (jd: JulianDay): SaturnRingSystem {
  const T = (jd - 2451545) / 36525
  const T2 = T * T

  //Step 1. Calculate the inclination of the plane of the ring and the longitude of the ascending node referred to the ecliptic and mean equinox of the date
  const i = 28.075216 - 0.012998 * T + 0.000004 * T2
  const irad = DEG2RAD * i
  const omega = 169.508470 + 1.394681 * T + 0.000412 * T2
  const omegarad = DEG2RAD * omega

  //Step 2. Calculate the heliocentric longitude, latitude and radius vector of the Earth in the FK5 system
  let l0 = Earth.getEclipticLongitude(jd)
  let b0 = Earth.getEclipticLatitude(jd)
  l0 += getCorrectionInLongitude(l0, b0, jd)
  const l0rad = DEG2RAD * l0
  b0 += getCorrectionInLatitude(l0, jd)
  const b0rad = DEG2RAD * b0
  const R = Earth.getRadiusVector(jd)

  //Step 3. Calculate the corresponding coordinates l,b,r for Saturn but for the instance t-lightraveltime
  let DELTA = 9
  let PreviousEarthLightTravelTime = 0
  let EarthLightTravelTime = getLightTimeFromDistance(DELTA)
  let JD1 = jd - EarthLightTravelTime
  let bIterate = true
  let x = 0
  let y = 0
  let z = 0
  let l = 0
  let b = 0
  let r = 0
  while (bIterate) {
    //Calculate the position of Saturn
    l = getEclipticLongitude(JD1)
    b = getEclipticLatitude(JD1)
    l += getCorrectionInLongitude(l, b, JD1)
    b += getCorrectionInLatitude(l, JD1)

    const lrad = DEG2RAD * l
    const brad = DEG2RAD * b
    r = getRadiusVector(JD1)

    //Step 4
    x = r * cos(brad) * cos(lrad) - R * cos(l0rad)
    y = r * cos(brad) * sin(lrad) - R * sin(l0rad)
    z = r * sin(brad) - R * sin(b0rad)
    DELTA = sqrt(x * x + y * y + z * z)
    EarthLightTravelTime = getLightTimeFromDistance(DELTA)

    //Prepare for the next loop around
    bIterate = (fabs(EarthLightTravelTime - PreviousEarthLightTravelTime) > 2e-6) //2e-6 corresponds to 0.17 of a second
    if (bIterate) {
      JD1 = jd - EarthLightTravelTime
      PreviousEarthLightTravelTime = EarthLightTravelTime
    }
  }

  //Step 5. Calculate Saturn's geocentric Longitude and Latitude
  let lambda = atan2(y, x)
  let beta = atan2(z, sqrt(x * x + y * y))

  //Step 6. Calculate B, a and b
  let B = asin(sin(irad) * cos(beta) * sin(lambda - omegarad) - cos(irad) * sin(beta))
  const majorAxis = 375.35 / DELTA
  const minorAxis = majorAxis * sin(fabs(B))
  B = RAD2DEG * B

  //Step 7. Calculate the longitude of the ascending node of Saturn's orbit
  let N = 113.6655 + 0.8771 * T
  let Nrad = DEG2RAD * N
  let ldash = l - 0.01759 / r
  let ldashrad = DEG2RAD * ldash
  let bdash = b - 0.000764 * cos(ldashrad - Nrad) / r
  let bdashrad = DEG2RAD * bdash

  //Step 8. Calculate Bdash
  let Bdash = RAD2DEG * asin(sin(irad) * cos(bdashrad) * sin(ldashrad - omegarad) - cos(irad) * sin(bdashrad))

  //Step 9. Calculate DeltaU
  let U1 = fmod360(RAD2DEG * atan2(sin(irad) * sin(bdashrad) + cos(irad) * cos(bdashrad) * sin(ldashrad - omegarad), cos(bdashrad) * cos(ldashrad - omegarad)))
  let U2 = fmod360(RAD2DEG * atan2(sin(irad) * sin(beta) + cos(irad) * cos(beta) * sin(lambda - omegarad), cos(beta) * cos(lambda - omegarad)))

  const earthCoordinates: SaturnicentricCoordinates = {
    longitude: U2,
    latitude: B
  }

  const sunCoordinates: SaturnicentricCoordinates = {
    longitude: U1,
    latitude: Bdash
  }

  let saturnicentricSunEarthLongitudesDifference = fabs(U1 - U2)
  if (saturnicentricSunEarthLongitudesDifference > 180) {
    saturnicentricSunEarthLongitudesDifference = 360 - saturnicentricSunEarthLongitudesDifference
  }

  //Step 10. Calculate the Nutations
  const Obliquity = getTrueObliquityOfEcliptic(jd)
  const NutationInLongitude = getNutationInLongitude(jd)

  //Step 11. Calculate the Ecliptical longitude and latitude of the northern pole of the ring plane
  let lambda0 = omega - 90
  let beta0 = 90 - i

  //Step 12. Correct lambda and beta for the aberration of Saturn
  lambda += DEG2RAD * 0.005693 * cos(l0rad - lambda) / cos(beta)
  beta += DEG2RAD * 0.005693 * sin(l0rad - lambda) * sin(beta)

  //Step 13. Add nutation in longitude to lambda0 and lambda
  //double NLrad = DEG2RAD*NutationInLongitude/3600)
  lambda = RAD2DEG * lambda
  lambda += NutationInLongitude / 3600
  lambda = fmod360(lambda)
  lambda0 += NutationInLongitude / 3600
  lambda0 = fmod360(lambda0)

  //Step 14. Convert to equatorial coordinates
  beta = RAD2DEG * beta
  const GeocentricEclipticSaturn = transformEclipticToEquatorial(lambda, beta, Obliquity)
  const alpha = H2RAD * GeocentricEclipticSaturn.rightAscension
  const delta = DEG2RAD * GeocentricEclipticSaturn.declination
  const GeocentricEclipticNorthPole = transformEclipticToEquatorial(lambda0, beta0, Obliquity)
  const alpha0 = H2RAD * GeocentricEclipticNorthPole.rightAscension
  const delta0 = DEG2RAD * GeocentricEclipticNorthPole.declination

  //Step 15. Calculate the Position angle
  const northPolePositionAngle = RAD2DEG * atan2(cos(delta0) * sin(alpha0 - alpha), sin(delta0) * cos(delta) - cos(delta0) * sin(delta) * cos(alpha0 - alpha))

  return {
    majorAxis,// The major axis of the outer edge of the outer ring.
    minorAxis, // The minor axis of the outer edge of the outer ring.
    // The position angle of the north pole of rotation of the planet. Because the ring is
    // situated exactly in Saturn's equator plane, P is also the geocentric position angle of the
    // northern semiminor axis of the apparent ellipse of the ring, measured from the North towards
    // the East (trust me... see AA p.317)
    northPolePositionAngle,
    // The difference between the Saturnicentric longitude of the Sun and the Earth, measured in
    // the plane of the ring. Used to compute Saturn's magnitude.
    saturnicentricSunEarthLongitudesDifference,
    // The Saturnicentric coordinates of the Earth referred to the plane of the ring (B)
    earthCoordinates,
    // The Saturnicentric coordinates of the Sun referred to the plane of the ring (B)
    sunCoordinates
  }
}
