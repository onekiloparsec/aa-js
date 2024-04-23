import { Mars, juliandays } from '@'

describe('Mars', () => {
  // See AA p.291, Example 42.a, see also SwiftAA
  test('check physical details', () => {
    const UTCDate = new Date(Date.UTC(1992, 10, 9))
    const jd = juliandays.getJulianDay(UTCDate)

    const earthDec = Mars.getPlanetocentricDeclinationOfTheEarth(jd)
    expect(earthDec).toBeCloseTo(12.44)// deg

    const sunDec = Mars.getPlanetocentricDeclinationOfTheSun(jd)
    expect(sunDec).toBeCloseTo(-2.76)// deg
  })

  test('check apparent diameter', () => {
    const UTCDate = new Date(Date.UTC(1992, 10, 9))
    const jd = juliandays.getJulianDay(UTCDate)
    const apparentDiameter = Mars.getEquatorialSemiDiameter(jd)
    expect(apparentDiameter).toBeCloseTo(10.75 / 2) // arcsec
  })
})
