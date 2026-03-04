import { juliandays } from '@'
import { getDecimalValue } from '@/sexagesimal'

describe('getGreenwichSiderealTime', () => {
  test('equals getLocalSiderealTime at lng=0', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    expect(juliandays.getGreenwichSiderealTime(jd)).toEqual(juliandays.getLocalSiderealTime(jd, 0))
  })

  test('differs from local sidereal time for non-zero longitude', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2020, 6, 1, 0, 0, 0)))
    const gmst = juliandays.getGreenwichSiderealTime(jd)
    const lst = juliandays.getLocalSiderealTime(jd, -70)
    expect(gmst).not.toBeCloseTo(lst, 2)
  })
})

describe('getApparentLocalSiderealTime', () => {
  test('differs from GMST by less than 0.01 h', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(1987, 3, 10, 0, 0, 0)))
    const gmst = juliandays.getLocalSiderealTime(jd, 0)
    const gast = juliandays.getApparentLocalSiderealTime(jd, 0)
    expect(Math.abs(gast - gmst)).toBeLessThan(0.01)
  })
})

describe('getModifiedJulianDay', () => {
  test('MJD for J2000 is 51544.5', () => {
    expect(juliandays.getModifiedJulianDay(2451545.0)).toBeCloseTo(51544.5, 5)
  })

  test('MJD = JD - 2400000.5', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2020, 0, 1)))
    expect(juliandays.getModifiedJulianDay(jd)).toBeCloseTo(jd - 2400000.5, 6)
  })
})

describe('getJulianDay with decimal year', () => {
  test('2016.5 is approximately mid-year (July)', () => {
    const jd = juliandays.getJulianDay(2016.5)
    const jan1 = juliandays.getJulianDay(new Date(Date.UTC(2016, 0, 1)))
    const days = jd - jan1
    expect(days).toBeGreaterThan(150)
    expect(days).toBeLessThan(200)
  })

  test('2016.25 is approximately Q1 end (March)', () => {
    const jd = juliandays.getJulianDay(2016.25)
    const jan1 = juliandays.getJulianDay(new Date(Date.UTC(2016, 0, 1)))
    const days = jd - jan1
    expect(days).toBeGreaterThan(60)
    expect(days).toBeLessThan(120)
  })
})

describe('julian days', () => {
  test('build julianday with date', () => {
    const UTCDate = new Date(Date.UTC(2016, 8, 17))
    expect(juliandays.getJulianDay(UTCDate)).toBe(2457648.5)
  })

  test('build julianday with nothing', () => {
    expect(juliandays.getJulianDay()).toBeGreaterThan(2457648.5)
  })

  test('build julianday with date string', () => {
    expect(juliandays.getJulianDay('2023-11-11T12:00:00.000Z')).toEqual(2460260)
  })

  test('build julianday with one value (integer year = Jan 1)', () => {
    const UTCDate = new Date(Date.UTC(2016, 0, 1))
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
    const jd = juliandays.getJulianDay(UTCDate)
    const jd0 = juliandays.getJulianDayMidnight(jd)
    const midnightUTCDate = juliandays.getDate(jd0)
    expect(midnightUTCDate.getUTCHours()).toEqual(0)
    expect(midnightUTCDate.getUTCMinutes()).toEqual(0)
    expect(midnightUTCDate.getUTCSeconds()).toEqual(0)
  })

  // See AA p 88
  test('mean sidereal time at Greenwich', () => {
    // April 10th, 1987, 0h UT.
    const UTCDate = new Date(Date.UTC(1987, 3, 10, 0, 0, 0))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(juliandays.getLocalSiderealTime(jd, 0)).toBeCloseTo(getDecimalValue(13, 10, 46.3668), 7)
  })

  // See AA p 88
  test('apparent sidereal time at Greenwich', () => {
    // April 10th, 1987, 0h UT.
    const UTCDate = new Date(Date.UTC(1987, 3, 10, 0, 0, 0))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(juliandays.getApparentLocalSiderealTime(jd, 0)).toBeCloseTo(getDecimalValue(13, 10, 46.1351), 1)
  })
})
