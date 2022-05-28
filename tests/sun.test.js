import { constants, Sun, julianday } from '../src'

test('get sun geometric longitude mean equinox of the date (AA p.165)', () => {
  const UTCDate = new Date(Date.UTC(1992, 9, 13))
  const jd = julianday.getJulianDay(UTCDate)
  expect(jd).toBeCloseTo(2448908.5, 3)
  const T = (jd - 2451545.0) / 36525.0
  expect(T).toBeCloseTo(-0.072183436, 7)
  const L0 = Sun.getMeanLongitudeReferredToMeanEquinoxOfDate(T)
  expect(L0).toBeCloseTo(201.80720, 6)
  const M = Sun.getMeanAnomaly(jd)
  expect(M).toBeCloseTo(278.99397, 6)
  const C = Sun.getEquationOfTheCenter(T, M)
  expect(C).toBeCloseTo(-1.89732, 5)
  const Epsilon = Sun.getGeometricEclipticLongitude(jd)
  expect(Epsilon).toBeCloseTo(199.90988)
})


test('get sun apparent equatorial coordinates (AA p.165)', () => {
  const UTCDate = new Date(Date.UTC(1992, 9, 13))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = Sun.getApparentEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(13.225389, 3) // accuracy is bad, as in SwiftAA !
  expect(equ.declination).toBeCloseTo(-7.78507, 2) // accuracy is bad, as in SwiftAA !
})

test('get another sun apparent equatorial coordinates AA p.343', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = Sun.getApparentEquatorialCoordinates(jd)
  expect(equ.rightAscension * constants.H2DEG).toBeCloseTo(20.6579, 3)
  expect(equ.declination).toBeCloseTo(8.6964, 3)
})

// test('get julian days of rise, transits and set at the UTC equator, for alt = 0', () => {
//   const jd = julianday.getJulianDay(new Date())
//   const jds = sun.julianDaysOfRiseDayTransitSet(jd, 0, 0, 0)
//   expect(jds[0]).toBeGreaterThan(2458000.5)
//   expect(jds[1]).toBeGreaterThan(2458000.5)
//   expect(jds[2]).toBeGreaterThan(2458000.5)
// })
//
// test('get julian days of rise, transits and set above polar circle, for alt = 0', () => {
//   const UTCDate = new Date(Date.UTC(2021, 1, 30))
//   const jd = julianday.getJulianDay(UTCDate)
//   const jds = sun.julianDaysOfRiseDayTransitSet(jd, 0, 85, 0)
//   expect(jds[0]).toBeGreaterThan(2458000.5)
//   expect(jds[1]).toBeGreaterThan(2458000.5)
//   expect(jds[2]).toBeGreaterThan(2458000.5)
// })
