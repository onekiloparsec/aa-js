import Decimal from '@/decimal'
import { getJulianDay } from '@/juliandays'
import { getAnnualEquatorialAberration, getNutationEquatorialAberration } from '@/earth/aberration'
import { getNutationInLongitude, getNutationInObliquity } from '@/earth/nutation'
import { getEccentricity, getLongitudeOfPerihelion } from '@/earth/coordinates'
import { transformUTC2TT } from '@/times'
import { getDecimalValue } from '@/sexagesimal'

describe('aberration', () => {
  // See AA p152 & 153, Ex 23.a
  test('corrections for theta Persei', () => {
    // The date is strangely expressed in the book.
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19 / 24.))
    const jd = transformUTC2TT(getJulianDay(utcDate))
    const coords = { rightAscension: getDecimalValue(2, 46, 11.331), declination: getDecimalValue(49, 20, 54.54) }
    // const coords = { rightAscension: new Decimal(41.5472).degreesToHours(), declination: 49.3485 }

    const DeltaEpsilon = getNutationInObliquity(jd)
    const DeltaPsi = getNutationInLongitude(jd)
    expect(DeltaEpsilon.toNumber()).toBeCloseTo(2.705, 2)
    expect(DeltaPsi.toNumber()).toBeCloseTo(14.865, 2)

    const e = getEccentricity(jd)
    const pi = getLongitudeOfPerihelion(jd)
    expect(e.toNumber()).toBeCloseTo(0.016_696_49, 8)
    expect(pi.toNumber()).toBeCloseTo(103.434, 3)

    const nutation = getNutationEquatorialAberration(jd, coords.rightAscension, coords.declination)
    expect(nutation.DeltaRightAscension.toNumber()).toBeCloseTo(15.843, 2)
    expect(nutation.DeltaDeclination.toNumber()).toBeCloseTo(6.218, 2)

    const annual = getAnnualEquatorialAberration(jd, coords.rightAscension, coords.declination)
    expect(annual.DeltaRightAscension.toNumber()).toBeCloseTo(30.045, 2)
    expect(annual.DeltaDeclination.toNumber()).toBeCloseTo(6.697, 1)
  })
})
