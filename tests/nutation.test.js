import * as juliandays from '@/juliandays'
import * as nutation from '@/earth/nutation'

describe('nutation', () => {
  // See AA p.148, Example 22.a
  test('check heliocentric coordinates of Venus', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(jd.toNumber()).toEqual(2446895.5)
    expect(nutation.getNutationInLongitude(jd).toNumber()).toBeCloseTo(-3.788, 3)
    expect(nutation.getNutationInObliquity(jd).toNumber()).toBeCloseTo(9.443, 3)
    expect(nutation.getMeanObliquityOfEcliptic(jd).toNumber()).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
    expect(nutation.getTrueObliquityOfEcliptic(jd).toNumber()).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
  })
})

