import Decimal from 'decimal.js'
import { JulianDay } from '@/types'
import { gLeapSecondCoefficients } from './coefficients'
import { getCumulativeLeapSeconds, getDeltaT } from './utils'

export function transformTT2UTC (jd: JulianDay | number): JulianDay {
  // Outside the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1

  const decimalJD = new Decimal(jd)
  const nLookupElements = gLeapSecondCoefficients.length
  if ((decimalJD.lessThan(gLeapSecondCoefficients[0].JD))
    || (decimalJD.greaterThan(gLeapSecondCoefficients[nLookupElements - 1].JD.plus(500)))) {
    return transformTT2UT1(jd)
  }

  const DT = getDeltaT(jd)
  const UT1 = new Decimal(jd).minus(DT.dividedBy(86400.0))
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  return UT1.plus((DT.minus(LeapSeconds).minus(32.184)).dividedBy(86400.0))
}

export function transformUTC2TT (jd: JulianDay | number): JulianDay {
  // Outside the range 1 January 1961 to 500 days after the last leap second,
  // we implement TT2UTC as TT2UT1

  const decimalJD = new Decimal(jd)
  const nLookupElements = gLeapSecondCoefficients.length
  if ((decimalJD.lessThan(gLeapSecondCoefficients[0].JD))
    || (decimalJD.greaterThan(gLeapSecondCoefficients[nLookupElements - 1].JD.plus(500)))) {
    return transformUT12TT(jd)
  }

  const DT = getDeltaT(jd)
  const LeapSeconds = getCumulativeLeapSeconds(jd)
  const UT1 = decimalJD.minus((DT.minus(LeapSeconds).minus(32.184)).dividedBy(86400.0))
  return UT1.plus(DT.dividedBy(86400.0))
}

export function transformTT2TAI (jd: JulianDay | number): JulianDay {
  return new Decimal(jd).minus(new Decimal(32.184).dividedBy(86400.0))
}

export function transformTAI2TT (jd: JulianDay | number): JulianDay {
  return new Decimal(jd).plus(new Decimal(32.184).dividedBy(86400.0))
}

export function transformTT2UT1 (jd: JulianDay | number): JulianDay {
  return new Decimal(jd).minus(getDeltaT(jd).dividedBy(86400.0))
}

export function transformUT12TT (jd: JulianDay | number): JulianDay {
  return new Decimal(jd).plus(getDeltaT(jd).dividedBy(86400.0))
}

export function transformUT1MinusUTC (jd: JulianDay | number): JulianDay {
  const JDUTC = new Decimal(jd).plus((getDeltaT(jd).minus(getCumulativeLeapSeconds(jd)).minus(32.184)).dividedBy(86400))
  return (new Decimal(jd).minus(JDUTC)).mul(86400)
}

