import { juliandays, Mercury } from '@'

describe('Mercury', () => {
  test('check that polar and equatorial semi diameters are identical', () => {
    const jd = juliandays.getJulianDay()
    const polarDiameter = Mercury.getPolarSemiDiameter(jd)
    const equatorialDiameter = Mercury.getEquatorialSemiDiameter(jd)
    expect(polarDiameter).toEqual(equatorialDiameter)
  })

  test('aphelion and perihelion are real JDs (after 1800)', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2020, 0, 1)))
    expect(Mercury.getPerihelion(jd)).toBeGreaterThan(2378497)
    expect(Mercury.getAphelion(jd)).toBeGreaterThan(2378497)
  })
})
