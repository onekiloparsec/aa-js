import { gDeltaTValues, gLeapSecondCoefficients } from './coefficients'
import { JulianDay } from '@/types'
import { getFractionalYear } from './dates'

export function getDeltaT (jd: JulianDay): number {
  // What will be the return value from the method
  let Delta = 0

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
        Delta = (jd - gDeltaTValues[nFoundIndex - 1].JD) / (gDeltaTValues[nFoundIndex].JD - gDeltaTValues[nFoundIndex - 1].JD) * (gDeltaTValues[nFoundIndex].DeltaT - gDeltaTValues[nFoundIndex - 1].DeltaT) + gDeltaTValues[nFoundIndex - 1].DeltaT
      }
    }
  } else {
    const y = getFractionalYear(jd)

    // Use the polynomial expressions from Espenak & Meeus 2006. References: http:// eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html and
    // http:// www.staff.science.uu.nl/~gent0113/deltat/deltat_old.htm (Espenak & Meeus 2006 section)
    if (y < -500) {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -20 + (32 * u2)
    } else if (y < 500) {
      const u = y / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      Delta = 10583.6 + (-1014.41 * u) + (33.78311 * u2) + (-5.952053 * u3) + (-0.1798452 * u4) + (0.022174192 * u5) + (0.0090316521 * u6)
    } else if (y < 1600) {
      const u = (y - 1000) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      Delta = 1574.2 + (-556.01 * u) + (71.23472 * u2) + (0.319781 * u3) + (-0.8503463 * u4) + (-0.005050998 * u5) + (0.0083572073 * u6)
    } else if (y < 1700) {
      const u = (y - 1600) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 120 + (-98.08 * u) + (-153.2 * u2) + (u3 / 0.007129)
    } else if (y < 1800) {
      const u = (y - 1700) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      Delta = 8.83 + (16.03 * u) + (-59.285 * u2) + (133.36 * u3) + (-u4 / 0.01174)
    } else if (y < 1860) {
      const u = (y - 1800) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      const u6 = u5 * u
      const u7 = u6 * u
      Delta = 13.72 + (-33.2447 * u) + (68.612 * u2) + (4111.6 * u3) + (-37436 * u4) + (121272 * u5) + (-169900 * u6) + (87500 * u7)
    } else if (y < 1900) {
      const u = (y - 1860) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      Delta = 7.62 + (57.37 * u) + (-2517.54 * u2) + (16806.68 * u3) + (-44736.24 * u4) + (u5 / 0.0000233174)
    } else if (y < 1920) {
      const u = (y - 1900) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      Delta = -2.79 + (149.4119 * u) + (-598.939 * u2) + (6196.6 * u3) + (-19700 * u4)
    } else if (y < 1941) {
      const u = (y - 1920) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 21.20 + (84.493 * u) + (-761.00 * u2) + (2093.6 * u3)
    } else if (y < 1961) {
      const u = (y - 1950) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 29.07 + (40.7 * u) + (-u2 / 0.0233) + (u3 / 0.002547)
    } else if (y < 1986) {
      const u = (y - 1975) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      Delta = 45.45 + 106.7 * u - u2 / 0.026 - u3 / 0.000718
    } else if (y < 2005) {
      const u = (y - 2000) / 100.0
      const u2 = u * u
      const u3 = u2 * u
      const u4 = u3 * u
      const u5 = u4 * u
      Delta = 63.86 + (33.45 * u) + (-603.74 * u2) + (1727.5 * u3) + (65181.4 * u4) + (237359.9 * u5)
    } else if (y < 2050) {
      const u = (y - 2000) / 100.0
      const u2 = u * u
      Delta = 62.92 + (32.217 * u) + (55.89 * u2)
    } else if (y < 2150) {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -205.72 + (56.28 * u) + (32 * u2)
    } else {
      const u = (y - 1820) / 100.0
      const u2 = u * u
      Delta = -20 + (32 * u2)
    }
  }

  return Delta
}

export function getCumulativeLeapSeconds (jd: JulianDay): number {
  // What will be the return value from the method
  let LeapSeconds = 0

  const nLookupElements = gLeapSecondCoefficients.length
  if (jd >= gLeapSecondCoefficients[0].JD) {
    // Find the index in the lookup table which contains the JD value closest to the JD input parameter
    let bContinue = true
    let nIndex = 1
    while (bContinue) {
      if (nIndex >= nLookupElements) {
        LeapSeconds = gLeapSecondCoefficients[nLookupElements - 1].LeapSeconds + (jd - 2400000.5 - gLeapSecondCoefficients[nLookupElements - 1].BaseMJD) * gLeapSecondCoefficients[nLookupElements - 1].Coefficient
        bContinue = false
      } else if (jd < gLeapSecondCoefficients[nIndex].JD) {
        LeapSeconds = gLeapSecondCoefficients[nIndex - 1].LeapSeconds + (jd - 2400000.5 - gLeapSecondCoefficients[nIndex - 1].BaseMJD) * gLeapSecondCoefficients[nIndex - 1].Coefficient
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
