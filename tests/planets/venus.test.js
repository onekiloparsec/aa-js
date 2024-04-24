import { juliandays, times, Venus } from '@'
import { getDecimalYear } from '@/times'

describe('Venus', () => {
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

  test('check ecliptic coordinates of Venus [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20, 0, 0, 0)))
    expect(jd).toEqual(2448976.5)
    expect(Venus.getEclipticLongitude(jd, false)).toBeCloseTo(26.11428, 5)
    expect(Venus.getEclipticLatitude(jd, false)).toBeCloseTo(-2.62070, 5)
    expect(Venus.getRadiusVector(jd, false)).toBeCloseTo(0.724603, 6)
  })

  // See AA p.103, Example 15.a
  test('check apparent equatorial coordinates of Venus', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1988, 2, 20, 0, 0, 0)))
    expect(jd).toEqual(2447240.5)
    const coords = Venus.getApparentGeocentricEquatorialCoordinates(times.transformUTC2TT(jd))
    expect(coords.rightAscension).toBeCloseTo(41.73129, 2)
    expect(coords.declination).toBeCloseTo(18.44092, 2)
  })

  // See AA p.103, Example 15.a
  test('check apparent equatorial coordinates of Venus [low precision]', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1988, 2, 20, 0, 0, 0)))
    expect(jd).toEqual(2447240.5)
    const coords = Venus.getApparentGeocentricEquatorialCoordinates(times.transformUTC2TT(jd), false)
    expect(coords.rightAscension).toBeCloseTo(41.73129, 2)
    expect(coords.declination).toBeCloseTo(18.44092, 2)
  })

  // See AA p270, Ex. 38.a
  test('check date of perihelion', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1978, 9, 15)))
    const decimalYear = getDecimalYear(jd)
    expect(decimalYear).toBeCloseTo(1978.79, 2)
    expect(Venus.getPerihelion(jd)).toBeCloseTo(2443_873.704, 3)
  })

  test('check magnitude', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20)))
    // Old formula gives -3.8. No value provided in AA for new formulae.
    expect(Venus.getMagnitude(jd)).toBeCloseTo(-4.21, 1)
  })
})
