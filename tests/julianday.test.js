import { julianDay } from '../src'

test('build julianday with date', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(julianDay.getJulianDay(UTCDate)).toBe(2457648.5)
})

test('build julianday with nothing', () => {
  expect(julianDay.getJulianDay()).toBeGreaterThan(2457648.5)
})

test('build julianday with one value', () => {
  const UTCDate = new Date(Date.UTC(2016, 0, 0))
  expect(julianDay.getJulianDay(2016)).toEqual(julianDay.getJulianDay(UTCDate))
})

test('build julianday with two values', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 0))
  expect(julianDay.getJulianDay(2016, 8)).toEqual(julianDay.getJulianDay(UTCDate))
})

test('build julianday with three values', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(julianDay.getJulianDay(2016, 8, 17)).toEqual(julianDay.getJulianDay(UTCDate))
  expect(julianDay.getJulianDay(2016, 8, 17)).toBe(2457648.5)
})

test('julianday provide correct sidereal time', () => {
  // See AA page 88, Example 12.1a. APRIL = Month 3, not 4!
  const UTCDate = new Date(Date.UTC(1987, 3, 10))
  expect(julianDay.getLocalSiderealTime(julianDay.getJulianDay(UTCDate), 0)).toBeCloseTo(13.1795463333, 6)
})
