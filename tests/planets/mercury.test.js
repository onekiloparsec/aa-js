import { juliandays, Mercury } from '@'

describe('Mercury', () => {
  test('check that polar and equatorial semi diameters are identical', () => {
    const jd = juliandays.getJulianDay()
    const polarDiameter = Mercury.getPolarSemiDiameter(jd)
    const equatorialDiameter = Mercury.getEquatorialSemiDiameter(jd)
    expect(polarDiameter).toEqual(equatorialDiameter)
  })
})
