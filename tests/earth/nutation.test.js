import { Earth, juliandays } from '@'

describe('nutation', () => {
  // See AA p.148, Example 22.a
  test('check nutation in longitude and obliquity [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(jd).toEqual(2446895.5)
    expect(Earth.getNutationInLongitude(jd)).toBeCloseTo(-3.788, 3)
    expect(Earth.getNutationInObliquity(jd)).toBeCloseTo(9.443, 3)
  })

  test('check nutation in longitude and obliquity [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(jd).toEqual(2446895.5)
    expect(Earth.getNutationInLongitude(jd, false)).toBeCloseTo(-3.788, 3)
    expect(Earth.getNutationInObliquity(jd, false)).toBeCloseTo(9.443, 3)
  })

  test('check obliquity of the ecliptic', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(Earth.getMeanObliquityOfEcliptic(jd)).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
    expect(Earth.getTrueObliquityOfEcliptic(jd)).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
  })

  test('check obliquity of the ecliptic [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(Earth.getMeanObliquityOfEcliptic(jd, false)).toBeCloseTo(23 + 26 / 60 + 27.407 / 3600, 6)
    expect(Earth.getTrueObliquityOfEcliptic(jd, false)).toBeCloseTo(23 + 26 / 60 + 36.850 / 3600, 6)
  })
})

