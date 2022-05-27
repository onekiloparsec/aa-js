import { DEG2H, julianDay, H2DEG, Earth, Sun } from '../src'

test('get moon mean longitude', () => {
  expect(Earth.Moon.getMeanLongitude(245123456)).toBe(182.125250)
})

test('get moon mean elongation', () => {
  expect(Earth.Moon.getMeanElongation(245123456)).toBe(175.56631)
})

// See example 47.a, AA p 343.
test('get moon equatorial coordinates', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianDay.getJulianDay(UTCDate)
  const equ = Earth.Moon.getApparentEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(134.688470 * DEG2H, 6)
  expect(equ.declination).toBeCloseTo(13.768368, 6)
})

// See example 48.a, AA p 347.
test('get moon radius vector', () => {
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianDay.getJulianDay(UTCDate)
  const rv = Earth.Moon.getRadiusVector(jd)
  expect(rv).toBeCloseTo(368409.68, 1) // km, second param is number of digits checked.
})

// See example 48.a, AA p 347.
test('get moon illumination fraction', () => {
  // Month is April, but JS date month is [0-11].
  const UTCDate = new Date(Date.UTC(1992, 3, 12))
  const jd = julianDay.getJulianDay(UTCDate)

  const sunCoords = Sun.getApparentEquatorialCoordinates(jd)
  expect(sunCoords.rightAscension * H2DEG).toBeCloseTo(20.6579, 3)
  expect(sunCoords.declination).toBeCloseTo(8.6964, 3)

  const moonCoords = Earth.Moon.getApparentEquatorialCoordinates(jd)
  expect(moonCoords.rightAscension * H2DEG).toBeCloseTo(134.6885, 3)
  expect(moonCoords.declination).toBeCloseTo(13.7684, 3)

  const i = Earth.Moon.getPhaseAngle(jd)
  expect(i).toBeCloseTo(69.0756, 2)
  const k = Earth.Moon.getIlluminatedFraction(jd)
  expect(k).toBeCloseTo(0.6786, 3)
})
