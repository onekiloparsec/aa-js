import Decimal from '@/decimal'
import { ArcSecond, Degree, JulianDay, Radian, SaturnicentricCoordinates, SaturnRingSystem } from '@/types'
import { PIHALF, PITWO } from '@/constants'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getLightTimeFromDistance } from '@/distances'
import { getJulianCentury } from '@/juliandays'
import { fmod, fmod360 } from '@/utils'
import { Earth } from '@/earth'
import { getPlanetDistanceDetailsFromEarth } from '../elliptical'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'

/**
 * The details of Saturn's ring system.
 * @param {JulianDay | number} jd
 * @returns {SaturnRingSystem}
 * @memberof module:Saturn
 */
export function getRingSystemDetails (jd: JulianDay | number): SaturnRingSystem {
  const T = getJulianCentury(jd)

  // Step 1:
  // Inclination and Longitude of the ascending node of the plane of the ring referred to the ecliptic
  // and mean equinox of the date.
  const i: Radian = (
    new Decimal('28.075_216')
      .minus(new Decimal('0.012_998').mul(T))
      .plus(new Decimal('0.000_004').mul(T.pow(2)))
  ).degreesToRadians()

  const Omega: Radian = (
    new Decimal('169.508_470')
      .plus(new Decimal('1.394_681').mul(T))
      .plus(new Decimal('0.000_412').plus(T.pow(2)))
  ).degreesToRadians()

  // Step 2.
  // Heliocentric longitude, latitude and radius vector of the Earth, referred to the eclliptic and
  // mean equinox of the date.
  const l0: Radian = Earth.getEclipticLongitude(jd).degreesToRadians()
  // b0 and l0 are only involved in the computation of Delta, the Saturn distance to Earth
  // which is hidden in the computation of details = getPlanetDistanceDetailsFromEarth...
  // const b0: Radian = Earth.getEclipticLatitude(jd).degreesToRadians()
  // const R: AstronomicalUnit = Earth.getRadiusVector(jd)

  // Step 3. Calculate the corresponding coordinates l,b,r for Saturn but for the instance t-lightraveltime
  // Starting point: 9 AU, because Earth-Saturn distance is always between 8.0 and 11.1 AU (AA p.318).
  let earthLightTravelTime = getLightTimeFromDistance(9)
  const JD1 = new Decimal(jd).minus(earthLightTravelTime)
  let details = getPlanetDistanceDetailsFromEarth(JD1, getEclipticLongitude, getEclipticLatitude, getRadiusVector)

  // New estimation of earthLightTravelTime === tau
  earthLightTravelTime = getLightTimeFromDistance(details.Delta)
  // Slightly shifted JD!
  const JD2 = new Decimal(jd).minus(earthLightTravelTime)
  details = getPlanetDistanceDetailsFromEarth(JD2, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  const [l, b, r] = [details.l, details.b, details.r]

  // Step 4.
  const earthSaturnDistance = details.Delta

  // Step 5.
  // Calculate the geocentric longitude and latitude of Saturn
  const lambda: Radian = fmod(Decimal.atan2(details.y, details.x), PITWO)
  const beta: Radian = Decimal.atan2(details.z, Decimal.sqrt(details.x.pow(2).plus(details.y.pow(2))))

  // Step 6. Calculate B, a and b. Keep B in Degree for consistency of returned object.
  const B: Degree = Decimal.asin(
    (
      i.sin()
        .mul(beta.cos())
        .mul((lambda.minus(Omega)).sin())
    )
      .minus(i.cos().mul(beta.sin()))
  )
    .radiansToDegrees()

  const majorAxis: ArcSecond = new Decimal(375.35).dividedBy(earthSaturnDistance)
  const minorAxis: ArcSecond = majorAxis.mul(B.degreesToRadians().abs().sin())

  // To expose in APIs one day:
  // Factors by which the axes a and b of the outer edge of the outer ring are to be multiplied to obtain the axes of:
  // Inner edge of outer ring: 0.8801
  // Outer edge of inner ring: 0.8599
  // Inner edge of inner ring: 0.6650
  // Inner edge of dusky ring: 0.5486

  // Step 7.
  // Calculate the longitude of the ascending node of Saturn's orbit
  const N: Radian = (new Decimal('113.6655').plus(new Decimal(0.8771).mul(T))).degreesToRadians()
  const ldash: Radian = (l.radiansToDegrees().minus(new Decimal('0.017_59').dividedBy(r))).degreesToRadians()
  const bdash: Radian = (b.radiansToDegrees().minus(new Decimal('0.000_764').mul(Decimal.cos(l.minus(N))).dividedBy(r))).degreesToRadians()

  // Step 8.
  // Calculate Bdash, the Saturnicentric latitude of the Sun referred to the plane of the ring
  // When Bdash > 0, the illuminated surface of the ring, is the northern one.
  const Bdash: Degree = Decimal.asin(
    i.sin().mul(bdash.cos()).mul(Decimal.sin(ldash.minus(Omega)))
      .minus(i.cos().mul(bdash.sin()))
  ).radiansToDegrees()

  // Step 9. Calculate DeltaU
  const U1: Degree = Decimal.atan2(
    i.sin().mul(bdash.sin()).plus(i.cos().mul(bdash.cos()).mul(Decimal.sin(ldash.minus(Omega)))),
    bdash.cos().mul(Decimal.cos(ldash.minus(Omega)))
  ).radiansToDegrees()

  const U2: Degree = Decimal.atan2(
    i.sin().mul(beta.sin()).plus(i.cos().mul(beta.cos()).mul(Decimal.sin(lambda.minus(Omega)))),
    beta.cos().mul(Decimal.cos(lambda.minus(Omega)))
  ).radiansToDegrees()

  // Difference to be computed in degrees. DeltaU is a small angle ~< 5º
  const DeltaU: Degree = fmod360(Decimal.abs(U1.minus(U2)))

  // Step 10. Calculate the Nutation and Obliquity
  const epsilon: Degree = Earth.getTrueObliquityOfEcliptic(jd)
  const deltaPsi: Degree = Earth.getNutationInLongitude(jd).dividedBy(3600)

  // Step 11. Calculate the ecliptical longitude and latitude of the northern pole of the ring plane
  const lambda0: Degree = Omega.minus(PIHALF).radiansToDegrees()
  const beta0: Degree = ((PIHALF).minus(i)).radiansToDegrees()

  // Step 12. Correct lambda and beta for the aberration of Saturn, then nutation
  const lambdaCorrection: Degree = new Decimal('0.005_693').mul(Decimal.cos(l0.minus(lambda))).dividedBy(beta.cos())
  const betaCorrection: Degree = new Decimal('0.005_693').mul(Decimal.sin(l0.minus(lambda))).mul(beta.sin())

  let correctedLambda: Degree = fmod360(lambda.radiansToDegrees().plus(lambdaCorrection))
  const correctedBeta: Degree = beta.radiansToDegrees().plus(betaCorrection)

  // Step 13. Add nutation in longitude to lambda0 and lambda
  const correctedLambda0: Degree = lambda0.plus(deltaPsi)
  correctedLambda = correctedLambda.plus(deltaPsi)

  // Step 14. Convert to equatorial coordinates
  const eclCoords = { longitude: correctedLambda, latitude: correctedBeta }
  const geocentricEclipticSaturn = transformEclipticToEquatorial(eclCoords, epsilon)
  const alpha: Radian = geocentricEclipticSaturn.rightAscension.degreesToRadians()
  const delta: Radian = geocentricEclipticSaturn.declination.degreesToRadians()

  const eclCoords0 = { longitude: correctedLambda0, latitude: beta0 }
  const geocentricEclipticNorthPole = transformEclipticToEquatorial(eclCoords0, epsilon)
  const alpha0: Radian = geocentricEclipticNorthPole.rightAscension.degreesToRadians()
  const delta0: Radian = geocentricEclipticNorthPole.declination.degreesToRadians()

  // Step 15. Calculate the Position angle
  const northPolePositionAngle: Degree = Decimal.atan2(
    delta0.cos().mul(Decimal.sin(alpha0.minus(alpha))),
    delta0.sin().mul(delta.cos()).minus(delta0.cos().mul(delta.sin()).mul(Decimal.cos(alpha0.minus(alpha))))
  ).radiansToDegrees()

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
