import { Jupiter } from '@/planets'
import * as juliandays from '@/juliandays'
import { transformUTC2TT } from '@/times'

describe('Jupiter', () => {
  test('check apparent diameter', () => {
    const jd = 2448972.50068
    const apparentDiameter = Jupiter.getPolarSemiDiameter(jd)
    expect(apparentDiameter).toBeCloseTo(16.23, 1) // arcsec
  })

  // See AA p295, Ex 43.a
  test('check physical details', () => {
    const UTCDate = new Date(Date.UTC(1992, 11, 16))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(jd.toNumber()).toEqual(2448972.5)
    const jd0 = transformUTC2TT(jd)
    expect(jd0.toNumber()).toEqual(2448972.500685)
    // TODO: rewrite Jupiter details based on what is done for Saturn ring system.
  })
})

