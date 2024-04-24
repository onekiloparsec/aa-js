import { juliandays, Sun } from '@'

describe('sun', () => {
  test('get sun geometric longitude mean equinox of the date (AA p.165)', () => {
    const UTCDate = new Date(Date.UTC(1992, 9, 13))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(jd).toBeCloseTo(2448908.5, 3)
    const T = (jd - 2451545.0) / 36525.0
    expect(T).toBeCloseTo(-0.072183436, 7)
    const L0 = Sun.getMeanLongitudeReferredToMeanEquinoxOfDate(T)
    expect(L0).toBeCloseTo(201.807196506, 6)
    const M = Sun.getMeanAnomaly(jd)
    expect(M).toBeCloseTo(278.99396643, 6)
    const C = Sun.getEquationOfTheCenter(T, M)
    expect(C).toBeCloseTo(-1.89732, 5)
    const Epsilon = Sun.getGeometricEclipticLongitude(jd)
    expect(Epsilon).toBeCloseTo(199.90988)
  })

  test('get sun geocentric equatorial coordinates (AA p.165)', () => {
    const UTCDate = new Date(Date.UTC(1992, 9, 13))
    const jd = juliandays.getJulianDay(UTCDate)
    const equ = Sun.getGeocentricEquatorialCoordinates(jd)
    expect(equ.rightAscension).toBeCloseTo(198.38093, 2) // accuracy is bad, as in SwiftAA !
    expect(equ.declination).toBeCloseTo(-7.78507, 2) // accuracy is bad, as in SwiftAA !
  })

  test('get another sun apparent equatorial coordinates AA p.343', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)
    const equ = Sun.getGeocentricEquatorialCoordinates(jd)
    expect(equ.rightAscension).toBeCloseTo(20.6589, 3)
    expect(equ.declination).toBeCloseTo(8.6964, 3)
  })
})
