import { Mars, juliandays } from '@'

describe('Mars planetocentric declinations', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 11)))

  test('getPlanetocentricDeclinationOfTheSun returns a valid degree', () => {
    const ds = Mars.getPlanetocentricDeclinationOfTheSun(jd)
    expect(ds).toBeGreaterThanOrEqual(-90)
    expect(ds).toBeLessThanOrEqual(90)
  })

  test('getPlanetocentricDeclinationOfTheEarth returns a valid degree', () => {
    const de = Mars.getPlanetocentricDeclinationOfTheEarth(jd)
    expect(de).toBeGreaterThanOrEqual(-90)
    expect(de).toBeLessThanOrEqual(90)
  })
})

describe('Mars aphelion and perihelion', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(2020, 0, 1)))

  test('aphelion and perihelion are real JDs (after 1800)', () => {
    const peri = Mars.getPerihelion(jd)
    const aph = Mars.getAphelion(jd)
    expect(peri).toBeGreaterThan(2378497) // 1800 JD
    expect(aph).toBeGreaterThan(2378497)
  })
})

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
