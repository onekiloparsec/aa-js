import { Venus, juliandays } from '../src'

test('check that polar and equatorial semi diameters are identical', () => {
  const jd = juliandays.getJulianDay()
  const polarDiameter = Venus.getPolarSemiDiameter(jd)
  const equatorialDiameter = Venus.getEquatorialSemiDiameter(jd)
  expect(polarDiameter).toEqual(equatorialDiameter)
})

// See AA p.219, Example 32.a
test('check heliocentric coordinates of Venus', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20, 0, 0, 0)))
  expect(jd).toEqual(2448976.5)
  expect(Venus.getEclipticLongitude(jd)).toBeCloseTo(26.11428, 0.0001)
  expect(Venus.getEclipticLatitude(jd)).toBeCloseTo(-2.62070, 0.0001)
  expect(Venus.getRadiusVector(jd)).toBeCloseTo(0.724603, 0.0001)
})

