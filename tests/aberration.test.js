import { getJulianDay } from '@/juliandays'
import { getAnnualEquatorialAberration, getNutationEquatorialAberration } from '@/earth/aberration'
import { transformUTC2TT } from '@/times'
import { getDecimalValue } from '@/sexagesimal'

describe('aberration', () => {
  // See AA p152, Ex 23.a
  test('corrections for theta Persei', () => {
    const utcDate = new Date(Date.UTC(2028, 10, 13, 19))
    const jd = transformUTC2TT(getJulianDay(utcDate))
    const coords = { rightAscension: getDecimalValue(2, 46, 11.331), declination: getDecimalValue(49, 20, 54.54) }

    const nutation = getNutationEquatorialAberration(jd, coords.rightAscension, coords.declination)
    expect(nutation.DeltaRightAscension.toNumber()).toBeCloseTo(15.843, 1)
    expect(nutation.DeltaDeclination.toNumber()).toBeCloseTo(6.218, 1)

    const annual = getAnnualEquatorialAberration(jd, coords.rightAscension, coords.declination)
    // We get very close values, but not quite the same
    expect(annual.DeltaRightAscension.toNumber()).toBeCloseTo(30.045, 0)
    expect(annual.DeltaDeclination.toNumber()).toBeCloseTo(6.697, 0)
  })
})
