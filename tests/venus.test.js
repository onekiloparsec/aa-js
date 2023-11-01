import { constants, juliandays, times, Venus } from '@'
import { getDecimalYear, getFractionalYear } from '@/dates'

describe('venus', () => {
  test('check that polar and equatorial semi diameters are identical', () => {
    const jd = juliandays.getJulianDay()
    const polarDiameter = Venus.getPolarSemiDiameter(jd)
    const equatorialDiameter = Venus.getEquatorialSemiDiameter(jd)
    expect(polarDiameter).toEqual(equatorialDiameter)
  })

  // See AA p.219, Example 32.a
  test('check ecliptic coordinates of Venus', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1992, 11, 20, 0, 0, 0)))
    expect(jd.toNumber()).toEqual(2448976.5)
    expect(Venus.getEclipticLongitude(jd)).toBeCloseTo(26.11428, 5)
    expect(Venus.getEclipticLatitude(jd)).toBeCloseTo(-2.62070, 5)
    expect(Venus.getRadiusVector(jd)).toBeCloseTo(0.724603, 6)
  })


  // See AA p.103, Example 15.a
  test('check apparent equatorial coordinates of Venus', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1988, 2, 20, 0, 0, 0)))
    expect(jd.toNumber()).toEqual(2447240.5)
    const coords = Venus.getApparentGeocentricEquatorialCoordinates(times.transformUTC2TT(jd))
    expect(coords.rightAscension.toNumber() * constants.H2DEG).toBeCloseTo(41.73129, 2)
    expect(coords.declination.toNumber()).toBeCloseTo(18.44092, 2)
  })

  // See AA p270, Ex. 38.a
  test('check date of perihelion', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1978, 9, 15)))
    const decimalYear = getDecimalYear(jd)
    expect(decimalYear.toNumber()).toBeCloseTo(1978.79, 2)
    expect(Venus.getPerihelion(jd).toNumber()).toBeCloseTo(2443_873.704, 3)
  })
})
