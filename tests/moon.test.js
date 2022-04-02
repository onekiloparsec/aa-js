import { DEG2H, H2DEG } from '../src/constants'
import { moon } from '../src/earth'
import * as julianday from '../src/julianday'
import * as sun from '../src/sun'

test('get moon mean longitude', () => {
  expect(moon.getMeanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
  expect(moon.getMeanElongation(245123456)).toBe(175.56631)
})

// See example 47.a, AA p 343.
test('get moon equatorial coordinates', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = moon.getApparentEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(134.688470 * DEG2H, 6)
  expect(equ.declination).toBeCloseTo(13.768368, 6)
})

// See example 48.a, AA p 347.
test('get moon radius vector', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const rv = moon.getRadiusVector(jd)
  expect(rv).toBeCloseTo(368409.68, 1) // km, second param is number of digits checked.
})

// See example 48.a, AA p 347.
test('get moon illumination fraction', () => {
  // Month is April, but JS date month is [0-11].
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)

  const sunCoords = sun.getApparentEquatorialCoordinates(jd)
  expect(sunCoords.rightAscension * H2DEG).toBeCloseTo(20.6579, 3)
  expect(sunCoords.declination).toBeCloseTo(8.6964, 3)

  const moonCoords = moon.getApparentEquatorialCoordinates(jd)
  expect(moonCoords.rightAscension * H2DEG).toBeCloseTo(134.6885, 3)
  expect(moonCoords.declination).toBeCloseTo(13.7684, 3)

  const i = moon.getPhaseAngle(jd)
  expect(i).toBeCloseTo(69.0756, 2)
  const k = moon.getIlluminatedFraction(jd)
  expect(k).toBeCloseTo(0.6786, 3)
})
