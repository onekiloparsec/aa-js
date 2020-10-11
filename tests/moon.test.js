import * as moon from '../src/moon'
import * as julianday from '../src/julianday'
import { DEG2H } from '../src/constants'

test('get moon mean longitude', () => {
  expect(moon.meanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
  expect(moon.meanElongation(245123456)).toBe(175.56631)
})

test('get moon equatorial coordinates', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = moon.equatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(134.688470 * DEG2H)
  expect(equ.declination).toBeCloseTo(13.768368)
})

