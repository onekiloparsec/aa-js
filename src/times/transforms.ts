import { JulianDay } from '../constants'
import { gLeapSecondCoefficients } from './coefficients'
import { getCumulativeLeapSeconds, getDeltaT } from './utils'

export function transformTT2UTC(jd: JulianDay): number {
  // Outside of the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1
  const nLookupElements = gLeapSecondCoefficients.length
  if ((jd < gLeapSecondCoefficients[0].JD) || (jd > (gLeapSecondCoefficients[nLookupElements - 1].JD + 500))) {
    return transformTT2UT1(jd)
  }

  const DT = getDeltaT(jd)
  const UT1 = jd - (DT / 86400.0)
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  return ((DT - LeapSeconds - 32.184) / 86400.0) + UT1
}

export function transformUTC2TT(jd: JulianDay): number {
  // Outside of the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1
  const nLookupElements = gLeapSecondCoefficients.length
  if ((jd < gLeapSecondCoefficients[0].JD) || (jd > (gLeapSecondCoefficients[nLookupElements - 1].JD + 500))) {
    return transformUT12TT(jd)
  }

  const DT = getDeltaT(jd)
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  const UT1 = jd - ((DT - LeapSeconds - 32.184) / 86400.0)
  return UT1 + (DT / 86400.0)
}

export function transformTT2TAI(jd: JulianDay): number {
  return jd - (32.184 / 86400.0)
}

export function transformTAI2TT(jd: JulianDay): number {
  return jd + (32.184 / 86400.0)
}

export function transformTT2UT1(jd: JulianDay): number {
  return jd - (getDeltaT(jd) / 86400.0)
}

export function transformUT12TT(jd: JulianDay): number {
  return jd + (getDeltaT(jd) / 86400.0)
}

export function transformUT1MinusUTC(jd: JulianDay): number {
  const JDUTC = jd + ((getDeltaT(jd) - getCumulativeLeapSeconds(jd) - 32.184) / 86400)
  return (jd - JDUTC) * 86400
}

