import { getJulianDay } from '@/juliandays'
import { getAnnualEquatorialAberration, getNutationEquatorialAberration } from '@/earth/aberration'
import { getNutationInLongitude, getNutationInObliquity } from '@/earth/nutation'
import { getEccentricity, getLongitudeOfPerihelion } from '@/earth/coordinates'
import { transformUTC2TT } from '@/times'
import { getDecimalValue } from '@/sexagesimal'
import { H2DEG } from '@/constants'

describe('aberration', () => {
  // See AA p152 & 153, Ex 23.a
  test('nutation equatorial aberration corrections for theta Persei', () => {
    // The date is strangely expressed in the book.
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19 / 24))
    const jd = transformUTC2TT(getJulianDay(utcDate))
    const coords = {
      rightAscension: getDecimalValue(2, 46, 11.331) * H2DEG,
      declination: getDecimalValue(49, 20, 54.54)
    }

    const DeltaEpsilon = getNutationInObliquity(jd)
    const DeltaPsi = getNutationInLongitude(jd)
    expect(DeltaEpsilon).toBeCloseTo(2.713, 2)
    expect(DeltaPsi).toBeCloseTo(14.879, 2)

    const e = getEccentricity(jd)
    const pi = getLongitudeOfPerihelion(jd)
    expect(e).toBeCloseTo(0.016_696_49, 8)
    expect(pi).toBeCloseTo(103.434, 3)

    const nutation = getNutationEquatorialAberration(jd, coords)
    expect(nutation.DeltaRightAscension).toBeCloseTo(15.857, 2)
    expect(nutation.DeltaDeclination).toBeCloseTo(6.228, 2)
  })

  // See AA p152 & 153, Ex 23.a
  test('annual equatorial aberration corrections for theta Persei', () => {
    // The date is strangely expressed in the book.
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19 / 24))
    const jd = transformUTC2TT(getJulianDay(utcDate))
    const coords = {
      rightAscension: getDecimalValue(2, 46, 11.331) * H2DEG,
      declination: getDecimalValue(49, 20, 54.54)
    }
    const annual = getAnnualEquatorialAberration(jd, coords)
    expect(annual.DeltaRightAscension).toBeCloseTo(30.057, 2)
    expect(annual.DeltaDeclination).toBeCloseTo(6.697, 1)
  })
})
