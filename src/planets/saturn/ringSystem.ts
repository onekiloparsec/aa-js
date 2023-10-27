import Decimal from 'decimal.js'
import {
  ArcSecond,
  AstronomicalUnit,
  Degree,
  JulianDay,
  Radian,
  SaturnicentricCoordinates,
  SaturnRingSystem
} from '@/types'
import { DEG2RAD, H2RAD, PI, RAD2DEG } from '@/constants'
import { transformEclipticToEquatorial } from '@/coordinates'
import { getNutationInLongitude, getTrueObliquityOfEcliptic } from '@/earth/nutation'
import { getPlanetDistanceDetailsFromEarth } from '@/planets/elliptical'
import { getLightTimeFromDistance } from '@/distances'
import { getJulianCentury } from '@/juliandays'
import { fmod360 } from '@/utils'
import { getEclipticLatitude, getEclipticLongitude, getRadiusVector } from './coordinates'
import {
  getEclipticLatitude as earthGetEclipticLatitude,
  getEclipticLongitude as earthGetEclipticLongitude,
  getRadiusVector as earthGetRadiusVector
} from '@/earth/coordinates'

export function getRingSystemDetails (jd: JulianDay | number): SaturnRingSystem {
  const T = getJulianCentury(jd)

  // Step 1:
  // Inclination and Longitude of the ascending node of the plane of the ring referred to the ecliptic
  // and mean equinox of the date.
  const i = (
    new Decimal(28.075216)
      .minus(new Decimal(0.012998).mul(T))
      .plus(new Decimal(0.000004).mul(T.pow(2)))
  ).mul(DEG2RAD)

  const Omega = (
    new Decimal(169.508470)
      .plus(new Decimal(1.394681).mul(T))
      .plus(new Decimal(0.000412).plus(T.pow(2)))
  ).mul(DEG2RAD)

  // Step 2.
  // Heliocentric longitude, latitude and radius vector of the Earth, referred to the eclliptic and
  // mean equinox of the date.
  const l0: Radian = earthGetEclipticLongitude(jd).mul(DEG2RAD)
  const b0: Radian = earthGetEclipticLatitude(jd).mul(DEG2RAD)
  const R: AstronomicalUnit = earthGetRadiusVector(jd)

  // Step 3. Calculate the corresponding coordinates l,b,r for Saturn but for the instance t-lightraveltime
  // Starting point: 9 AU, because Earth-Saturn distance is always between 8.0 and 11.1 AU (AA p.318).
  const earthLightTravelTime = getLightTimeFromDistance(9)
  const JD1 = new Decimal(jd).minus(earthLightTravelTime)
  const details = getPlanetDistanceDetailsFromEarth(JD1, getEclipticLongitude, getEclipticLatitude, getRadiusVector)
  const [l, b, r] = [details.l, details.b, details.r]

  //  Step 4.
  const earthSaturnDistance = details.Delta

  // Step 5.
  // Calculate the geocentric longitude and latitude of Saturn
  const lambda: Radian = Decimal.atan2(details.y, details.x)
  const beta: Radian = Decimal.atan2(details.z, Decimal.sqrt(details.x.pow(2).plus(details.y.pow(2))))

  // Step 6. Calculate B, a and b
  const B: Radian = Decimal.asin((
    i.sin()
      .mul(beta.cos())
      .mul((lambda.minus(Omega)).sin())
  )
    .minus(i.cos().mul(beta.sin())))

  const majorAxis: ArcSecond = new Decimal(375.35).dividedBy(earthSaturnDistance)
  const minorAxis: ArcSecond = majorAxis.mul(B.abs().sin())

  // To expose in APIs one day:
  // Factors by which the axes a and b of the outer edge of the outer ring are to be multiplied to obtain the axes of:
  // Inner edge of outer ring: 0.8801
  // Outer edge of inner ring: 0.8599
  // Inner edge of inner ring: 0.6650
  // Inner edge of dusky ring: 0.5486

  // Step 7.
  // Calculate the longitude of the ascending node of Saturn's orbit
  const N: Radian = (new Decimal(113.6655).plus(new Decimal(0.8771).mul(T))).mul(DEG2RAD)
  const ldash: Radian = (l.minus(new Decimal(0.01759).dividedBy(r))).mul(DEG2RAD)
  const bdash: Radian = (b.minus(new Decimal(0.000764).mul(Decimal.cos(lambda.minus(N))).dividedBy(r))).mul(DEG2RAD)

  // Step 8.
  // Calculate Bdash, the Saturnicentric latitude of the Sun referred to the plane of the ring
  // When Bdash > 0, the illuminated surface of the ring, is the northern one.
  const Bdash: Degree = Decimal.asin(
    i.sin().mul(bdash.cos()).mul(Decimal.sin(ldash.minus(Omega)))
      .minus(i.cos().mul(bdash.sin()))
  ).mul(RAD2DEG)

  // Step 9. Calculate DeltaU
  const U1: Radian = Decimal.atan2(
    i.sin().mul(bdash.sin()).plus(i.cos().mul(bdash.cos()).mul(Decimal.sin(ldash.minus(Omega)))),
    bdash.cos().mul(Decimal.cos(ldash.minus(Omega)))
  )

  const U2: Radian = Decimal.atan2(
    i.sin().mul(beta.sin()).plus(i.cos().mul(beta.cos()).mul(Decimal.sin(lambda.minus(Omega)))),
    beta.cos().mul(Decimal.cos(lambda.minus(Omega)))
  )

  const DeltaU: Degree = fmod360(Decimal.abs(U1.minus(U2)).mul(RAD2DEG))

  // Step 10. Calculate the Nutation and Obliquity
  const epsilon: Degree = getTrueObliquityOfEcliptic(jd)
  const deltaPsi: Degree = getNutationInLongitude(jd)

  // Step 11. Calculate the ecliptical longitude and latitude of the northern pole of the ring plane
  const lambda0: Degree = Omega.minus(PI.dividedBy(2)).mul(RAD2DEG)
  const beta0: Degree = ((PI.dividedBy(2)).minus(i)).mul(RAD2DEG)

  // Step 12. Correct lambda and beta for the aberration of Saturn, then nutation
  const lambdaCorrection: Degree = new Decimal(0.005693).mul(Decimal.cos(l0.minus(lambda))).dividedBy(beta.cos())
  const betaCorrection: Degree = new Decimal(0.005693).mul(Decimal.sin(l0.minus(lambda))).mul(beta.sin())

  let correctedLambda: Degree = fmod360(lambda.mul(RAD2DEG).plus(lambdaCorrection))
  const correctedBeta: Degree = fmod360(beta.mul(RAD2DEG).plus(betaCorrection))

  // Step 13. Add nutation in longitude to lambda0 and lambda
  const correctedLambda0: Degree = fmod360(lambda0.plus(deltaPsi))
  correctedLambda = fmod360(correctedLambda.plus(deltaPsi))

  // Step 14. Convert to equatorial coordinates
  const geocentricEclipticSaturn = transformEclipticToEquatorial(correctedLambda, correctedBeta, epsilon)
  const alpha: Radian = geocentricEclipticSaturn.rightAscension.mul(H2RAD)
  const delta: Radian = geocentricEclipticSaturn.declination.mul(DEG2RAD)
  const geocentricEclipticNorthPole = transformEclipticToEquatorial(correctedLambda0, beta0, epsilon)
  const alpha0: Radian = geocentricEclipticNorthPole.rightAscension.mul(H2RAD)
  const delta0: Radian = geocentricEclipticNorthPole.declination.mul(DEG2RAD)

  // Step 15. Calculate the Position angle
  const northPolePositionAngle: Radian = Decimal.atan2(
    delta0.cos().mul(Decimal.sin(alpha0.minus(alpha))),
    delta0.sin().mul(delta.cos()).minus(delta0.cos().mul(delta.sin()).mul(Decimal.cos(alpha0.minus(alpha))))
  )

  const earthCoordinates: SaturnicentricCoordinates = { longitude: U2.mul(RAD2DEG), latitude: B.mul(RAD2DEG) }
  const sunCoordinates: SaturnicentricCoordinates = { longitude: U1.mul(RAD2DEG), latitude: Bdash.mul(RAD2DEG) }

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
