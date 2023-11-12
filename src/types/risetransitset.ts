import Decimal from '@/decimal'
import { Degree, Hour, JulianDay } from './units'


export type TransitInternals = {
  m0: Decimal | number | undefined
  cosH0: Decimal | number | undefined
}

/**
 * The various elements of the transit of an object
 */
export type Transit = {
  utc: Hour | undefined,
  julianDay: JulianDay | undefined,
  altitude: Degree | undefined,
  refAltitude: Degree,
  isAboveHorizon: boolean,
  isAboveAltitude: boolean, // for when altitude is not that of horizon
  isCircumpolar: boolean // no transit, no rise
  internals: TransitInternals
}

/**
 * The various elements of the rise, set and transit of an object
 */
export type RiseTransitSet = {
  rise: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  },
  transit: Transit,
  set: {
    utc: Hour | undefined,
    julianDay: JulianDay | undefined
  }
}
