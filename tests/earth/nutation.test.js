import * as juliandays from '@/juliandays'
import { Earth } from '@/earth'

describe('nutation', () => {
  // See AA p.148, Example 22.a
  test('check nutation in longitude and obliquity [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(jd.toNumber()).toEqual(2446895.5)
    expect(Earth.getNutationInLongitude(jd).toNumber()).toBeCloseTo(-3.788, 3)
    expect(Earth.getNutationInObliquity(jd).toNumber()).toBeCloseTo(9.443, 3)
  })

  test('check nutation in longitude and obliquity [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(jd.toNumber()).toEqual(2446895.5)
    expect(Earth.getNutationInLongitude(jd, false).toNumber()).toBeCloseTo(-3.788, 3)
    expect(Earth.getNutationInObliquity(jd, false).toNumber()).toBeCloseTo(9.443, 3)
  })

  test('check obliquity of the ecliptic', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(Earth.getMeanObliquityOfEcliptic(jd).toNumber()).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
    expect(Earth.getTrueObliquityOfEcliptic(jd).toNumber()).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
  })

  test('check obliquity of the ecliptic [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(Earth.getMeanObliquityOfEcliptic(jd, false).toNumber()).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
    expect(Earth.getTrueObliquityOfEcliptic(jd, false).toNumber()).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
  })
})

