import * as julianday from '../src/julianday'

test('build julianday with date', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(julianday.getJulianDay(UTCDate)).toBe(2457648.5)
})

test('build julianday with nothing', () => {
  expect(julianday.getJulianDay()).toBeGreaterThan(2457648.5)
})

test('build julianday with jd value', () => {
  expect(julianday.getJulianDay(2457648.5)).toBe(2457648.5)
})

test('julianday provide correct sidereal time', () => {
  // See AA page 88, Example 12.1a. APRIL = Month 3, not 4!
  const UTCDate = new Date(Date.UTC(1987, 3, 10))
  expect(julianday.localSiderealTime(julianday.getJulianDay(UTCDate), 0)).toBeCloseTo(13.1795463333, 6)
})
