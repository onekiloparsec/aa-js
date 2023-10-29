import Decimal from 'decimal.js'
import { AstronomicalUnit, Day, Degree, JulianDay, JupiterRadius, Kilometer, Radian, SolarRadius } from '@/types'
import {
  DEG2RAD,
  ONE,
  ONE_JUPITER_RADIUS_IN_KILOMETERS,
  ONE_SOLAR_RADIUS_IN_KILOMETERS,
  ONE_UA_IN_KILOMETERS,
  PI,
  TWO
} from '@/constants'


/**
 * Simple helper to find the Julian Day of the next transit after the given lower Julian Day
 * @param  {Number} lowerJD The lower julian day limit
 * @param  {Number} orbitalPeriod The orbital period of the system, in days.
 * @param  {Number} tZeroOfTransit The Julian Day of the primary|secondary transit.
 * @returns {Number} The Julian Day of the next transit.
 */
export function julianDayOfNextTransit (lowerJD: JulianDay | number, orbitalPeriod: Day | number, tZeroOfTransit: JulianDay | number) {
  const jd = new Decimal(lowerJD)
  const P = new Decimal(orbitalPeriod)
  const t0 = new Decimal(tZeroOfTransit)
  const n = Decimal.floor(ONE.plus(jd.dividedBy(P)).minus(t0.dividedBy(P)))
  return t0.plus(n.mul(P))
}

/**
 * Compute the details of an exoplanet transit
 * @param orbitalPeriod
 * @param lambdaAngle
 * @param timeOfPeriastron
 * @param eccentricity
 * @param radius
 * @param semiMajorAxis
 * @param parentStarRadius
 */
export function getExoplanetTransitDetails (orbitalPeriod: Day | number,
                                            lambdaAngle: Degree | number,
                                            timeOfPeriastron: JulianDay | number,
                                            eccentricity: Decimal | number,
                                            radius: JupiterRadius | number,
                                            semiMajorAxis: AstronomicalUnit | number,
                                            parentStarRadius: SolarRadius | number) {
  let f = (PI.dividedBy(2)).minus(new Decimal(lambdaAngle).mul(DEG2RAD))
  const e = new Decimal(eccentricity)
  const P = new Decimal(orbitalPeriod)
  const E = TWO.mul(Decimal.atan(Decimal.sqrt((ONE.minus(e)).dividedBy(ONE.plus(e))).mul(Decimal.tan(f.dividedBy(2)))))

  const Rstar: Kilometer = new Decimal(parentStarRadius).mul(ONE_SOLAR_RADIUS_IN_KILOMETERS)
  const Rplanet: Kilometer = new Decimal(radius).mul(ONE_JUPITER_RADIUS_IN_KILOMETERS)
  const a: Kilometer = new Decimal(semiMajorAxis).mul(ONE_UA_IN_KILOMETERS)

  const df: Radian = Decimal.asin(((Rstar.plus(Rplanet)).dividedBy(a)).dividedBy(ONE.minus(e.mul(E.cos()))))
  f = f.plus(df)

  const M = E.minus(e.mul(E.sin()))
  // const t_M = P*M/(2*Math.PI)
  const duration = P.mul(M.dividedBy(PI))

  const cycleCenter = P.dividedBy(TWO.mul(PI)).mul(E.minus(e.mul(E.sin())))

  const t = new Decimal(timeOfPeriastron)
  const center = t.plus(cycleCenter)
  const start = center.minus(duration.dividedBy(2))
  const end = center.plus(duration.dividedBy(2))

  return { duration, start, center, end }
}
