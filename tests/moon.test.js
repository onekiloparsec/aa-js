import { moon } from '../src/earth'
import * as julianday from '../src/julianday'
import { DEG2H } from '../src/constants'

test('get moon mean longitude', () => {
  expect(moon.getMeanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
  expect(moon.getMeanElongation(245123456)).toBe(175.56631)
})

// See example 47.a, AA p 342.
test('get moon equatorial coordinates', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = moon.getEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(134.688470 * DEG2H)
  expect(equ.declination).toBeCloseTo(13.768368)
})

// See example 48.a, AA p 347.
test('get moon radius vector', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const rv = moon.getRadiusVector(jd)
  expect(rv).toBeCloseTo(368409.68, 1) // km, scnd param is number of digits checked.
})

// See example 48.a, AA p 347.
test('get moon illumination fraction', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const i = moon.getIlluminatedFraction(jd)
  expect(i).toBeCloseTo(0.6786)
})
