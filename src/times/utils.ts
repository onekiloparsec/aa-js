import { JulianDay } from '@/types'
import { gDeltaTValues, gLeapSecondCoefficients } from './coefficients'
import { getFractionalYear } from '@/dates'
import Decimal from 'decimal.js'
import { MINUSONE } from '@/constants'

export function getDeltaT (jd: JulianDay | number): Decimal {
  // What will be the return value from the method
  let Delta = new Decimal(0)
  const decimalJD = new Decimal(jd)

  // Determine if we can use the lookup table
  const nLookupElements = gDeltaTValues.length
  if ((jd >= gDeltaTValues[0].JD) && (jd < gDeltaTValues[nLookupElements - 1].JD)) {
    // Find the index in the lookup table which contains the JD value closest to the JD input parameter
    let bFound = false
    let nFoundIndex = 0
    while (!bFound) {
      // assert(nFoundIndex < nLookupElements)
      bFound = (gDeltaTValues[nFoundIndex].JD > jd)
      // Prepare for the next loop
      if (!bFound) {
        ++nFoundIndex
      } else {
        // Now do a simple linear interpolation of the DeltaT values from the lookup table
        Delta = (decimalJD.minus(gDeltaTValues[nFoundIndex - 1].JD))
          .dividedBy(gDeltaTValues[nFoundIndex].JD.minus(gDeltaTValues[nFoundIndex - 1].JD))
          .mul(gDeltaTValues[nFoundIndex].DeltaT.minus(gDeltaTValues[nFoundIndex - 1].DeltaT))
          .plus(gDeltaTValues[nFoundIndex - 1].DeltaT)
      }
    }
  } else {
    const y = getFractionalYear(jd)

    // Use the polynomial expressions from Espenak & Meeus 2006.
    // References: http:// eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html and
    // http:// www.staff.science.uu.nl/~gent0113/deltat/deltat_old.htm (Espenak & Meeus 2006 section)
    if (y.lessThan(-500)) {
      const u = (y.minus(1820)).dividedBy(100.0)
      Delta = new Decimal(-20).plus(new Decimal(32).mul(u.pow(2)))
    } else if (y.lessThan(500)) {
      const u = y.dividedBy(100.0)
      Delta = new Decimal(10583.6)
        .plus(new Decimal(-1014.41).mul(u))
        .plus(new Decimal(33.78311).mul(u.pow(2)))
        .plus(new Decimal(-5.952053).mul(u.pow(3)))
        .plus(new Decimal(-0.1798452).mul(u.pow(4)))
        .plus(new Decimal(0.022174192).mul(u.pow(5)))
        .plus(new Decimal(0.0090316521).mul(u.pow(6)))
    } else if (y.lessThan(1600)) {
      const u = (y.minus(100)).dividedBy(100.0)
      Delta = new Decimal(1574.2)
        .plus(new Decimal(-556.01).mul(u))
        .plus(new Decimal(71.23472).mul(u.pow(2)))
        .plus(new Decimal(0.319781).mul(u.pow(3)))
        .plus(new Decimal(-0.8503463).mul(u.pow(4)))
        .plus(new Decimal(-0.005050998).mul(u.pow(5)))
        .plus(new Decimal(0.0083572073).mul(u.pow(6)))
    } else if (y.lessThan(1700)) {
      const u = (y.minus(1600)).dividedBy(100.0)
      Delta = new Decimal(120)
        .plus(new Decimal(-98.08).mul(u))
        .plus(new Decimal(-153.2).mul(u.pow(2)))
        .plus(u.pow(3).dividedBy(0.007129))
    } else if (y.lessThan(1800)) {
      const u = (y.minus(1700)).dividedBy(100.0)
      Delta = new Decimal(8.83)
        .plus(new Decimal(16.03).mul(u))
        .plus(new Decimal(-59.285).mul(u.pow(2)))
        .plus(new Decimal(133.36).mul(u.pow(3)))
        .plus(MINUSONE.mul(u.pow(4)).dividedBy(0.01174))
    } else if (y.lessThan(1860)) {
      const u = (y.minus(1800)).dividedBy(100.0)
      Delta = new Decimal(13.72)
        .plus(new Decimal(-33.2447).mul(u))
        .plus(new Decimal(68.612).mul(u.pow(2)))
        .plus(new Decimal(4111.6).mul(u.pow(3)))
        .plus(new Decimal(-37436).mul(u.pow(4)))
        .plus(new Decimal(121272).mul(u.pow(5)))
        .plus(new Decimal(-169900).mul(u.pow(6)))
        .plus(new Decimal(87500).mul(u.pow(7)))
    } else if (y.lessThan(1900)) {
      const u = (y.minus(1860)).dividedBy(100.0)
      Delta = new Decimal(7.62)
        .plus(new Decimal(57.37).mul(u))
        .plus(new Decimal(-2517.54).mul(u.pow(2)))
        .plus(new Decimal(16806.68).mul(u.pow(3)))
        .plus(new Decimal(-44736.24).mul(u.pow(4)))
        .plus(u.pow(5).dividedBy(0.0000233174))
    } else if (y.lessThan(1920)) {
      const u = (y.minus(1900)).dividedBy(100.0)
      Delta = new Decimal(-2.79)
        .plus(new Decimal(149.4119).mul(u))
        .plus(new Decimal(-598.939).mul(u.pow(2)))
        .plus(new Decimal(6196.6).mul(u.pow(3)))
        .plus(new Decimal(-19700).mul(u.pow(4)))
    } else if (y.lessThan(1941)) {
      const u = (y.minus(1920)).dividedBy(100.0)
      Delta = new Decimal(21.20)
        .plus(new Decimal(84.493).mul(u))
        .plus(new Decimal(-761.00).mul(u.pow(2)))
        .plus(new Decimal(2093.6).mul(u.pow(3)))
    } else if (y.lessThan(1961)) {
      const u = (y.minus(1950)).dividedBy(100.0)
      Delta = new Decimal(29.07)
        .plus(new Decimal(40.7).mul(u))
        .plus(MINUSONE.mul(u.pow(2)).dividedBy(0.0233))
        .plus(u.pow(3).dividedBy(0.002547))
    } else if (y.lessThan(1986)) {
      const u = (y.minus(1975)).dividedBy(100.0)
      Delta = new Decimal(45.45)
        .plus(new Decimal(106.7).mul(u))
        .minus(u.pow(2).dividedBy(0.026))
        .minus(u.pow(3).dividedBy(0.000718))
    } else if (y.lessThan(2005)) {
      const u = (y.minus(2000)).dividedBy(100.0)
      Delta = new Decimal(63.86)
        .plus(new Decimal(33.45).mul(u))
        .plus(new Decimal(-603.74).mul(u.pow(2)))
        .plus(new Decimal(1727.5).mul(u.pow(3)))
        .plus(new Decimal(65181.4).mul(u.pow(4)))
        .plus(new Decimal(237359.9).mul(u.pow(5)))
    } else if (y.lessThan(2050)) {
      const u = (y.minus(2000)).dividedBy(100.0)
      Delta = new Decimal(62.92)
        .plus(new Decimal(32.217).mul(u))
        .plus(new Decimal(55.89).mul(u.pow(2)))
    } else if (y.lessThan(2150)) {
      const u = (y.minus(1820)).dividedBy(100.0)
      Delta = new Decimal(-205.72)
        .plus(new Decimal(56.28).mul(u))
        .plus(new Decimal(32).mul(u.pow(2)))
    } else {
      const u = (y.minus(1820)).dividedBy(100.0)
      Delta = new Decimal(-20).plus(new Decimal(32).mul(u.pow(2)))
    }
  }

  return Delta
}

export function getCumulativeLeapSeconds (jd: JulianDay | number): Decimal {
  // What will be the return value from the method
  let LeapSeconds = new Decimal(0)
  const decimalJD = new Decimal(jd)

  const nLookupElements = gLeapSecondCoefficients.length
  if (decimalJD.greaterThanOrEqualTo(gLeapSecondCoefficients[0].JD)) {
    // Find the index in the lookup table which contains the JD value closest to the JD input parameter
    let bContinue = true
    let nIndex = 1
    while (bContinue) {
      if (nIndex >= nLookupElements) {
        LeapSeconds = gLeapSecondCoefficients[nLookupElements - 1].LeapSeconds
          .plus((decimalJD.minus(2400000.5).minus(gLeapSecondCoefficients[nLookupElements - 1].BaseMJD))
            .mul(gLeapSecondCoefficients[nLookupElements - 1].Coefficient))
        bContinue = false
      } else if (decimalJD.lessThan(gLeapSecondCoefficients[nIndex].JD)) {
        LeapSeconds = gLeapSecondCoefficients[nIndex - 1].LeapSeconds
          .plus((decimalJD.minus(2400000.5).minus(gLeapSecondCoefficients[nIndex - 1].BaseMJD))
            .mul(gLeapSecondCoefficients[nIndex - 1].Coefficient))
        bContinue = false
      }

      // Prepare for the next loop
      if (bContinue) {
        ++nIndex
      }
    }
  }

  return LeapSeconds
}
