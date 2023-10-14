import { juliandays, Venus, constants } from '../src'

test('check that polar and equatorial semi diameters are identical', () => {
  const jd = juliandays.getJulianDay()
  const polarDiameter = Venus.getPolarSemiDiameter(jd)
  const equatorialDiameter = Venus.getEquatorialSemiDiameter(jd)
  expect(polarDiameter).toEqual(equatorialDiameter)
})

// See AA p.219, Example 32.a
test('check ecliptic coordinates of Venus', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20, 0, 0, 0)))
  expect(jd).toEqual(2448976.5)
  expect(Venus.getEclipticLongitude(jd)).toBeCloseTo(26.11428, 5)
  expect(Venus.getEclipticLatitude(jd)).toBeCloseTo(-2.62070, 5)
  expect(Venus.getRadiusVector(jd)).toBeCloseTo(0.724603, 6)
})


// See AA p.103, Example 15.a
test('check equatorial coordinates of Venus', () => {
  const jd = juliandays.getJulianDay(new Date(Date.UTC(1988, 2, 20, 0, 0, 0)))
  expect(jd).toEqual(2447240.5)
  const coords = Venus.getApparentEquatorialCoordinates(jd)
  expect(coords.rightAscension * constants.H2DEG).toBeCloseTo(41.73129, 4)
  expect(coords.declination).toBeCloseTo(18.44092, 4)
})

