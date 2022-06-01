import { juliandays } from '../src'

test('build julianday with date', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(juliandays.getJulianDay(UTCDate)).toBe(2457648.5)
})

test('build julianday with nothing', () => {
  expect(juliandays.getJulianDay()).toBeGreaterThan(2457648.5)
})

test('build julianday with one value', () => {
  const UTCDate = new Date(Date.UTC(2016, 0, 0))
  expect(juliandays.getJulianDay(2016)).toEqual(juliandays.getJulianDay(UTCDate))
})

test('build julianday with two values', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 0))
  expect(juliandays.getJulianDay(2016, 8)).toEqual(juliandays.getJulianDay(UTCDate))
})

test('build julianday with three values', () => {
  const UTCDate = new Date(Date.UTC(2016, 8, 17))
  expect(juliandays.getJulianDay(2016, 8, 17)).toEqual(juliandays.getJulianDay(UTCDate))
  expect(juliandays.getJulianDay(2016, 8, 17)).toBe(2457648.5)
})

test('julianday provide correct sidereal time', () => {
  // See AA page 88, Example 12.1a. APRIL = Month 3, not 4!
  const UTCDate = new Date(Date.UTC(1987, 3, 10))
  expect(juliandays.getLocalSiderealTime(juliandays.getJulianDay(UTCDate), 0)).toBeCloseTo(13.1795463333, 6)
})

test('julianday getJulianDayMidnight is really 0h UTC', () => {
  const UTCDate = new Date(Date.UTC(1987, 3, 10, 11, 43, 12, 890))
  const jd = julianday.getJulianDay(UTCDate)
  const jd0 = julianday.getJulianDayMidnight(jd)
  const midnightUTCDate = julianday.getDate(jd0)
  expect(midnightUTCDate.getUTCHours()).toEqual(0)
  expect(midnightUTCDate.getUTCMinutes()).toEqual(0)
  expect(midnightUTCDate.getUTCSeconds()).toEqual(0)
})
