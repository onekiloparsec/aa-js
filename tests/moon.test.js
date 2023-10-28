import { constants, Earth, juliandays, Sun } from '../src'

describe('moon', () => {
  test('get moon mean longitude', () => {
    expect(Earth.Moon.getMeanLongitude(245123456).toNumber()).toBe(182.1252505089)
  })

  test('get moon mean elongation', () => {
    expect(Earth.Moon.getMeanElongation(245123456).toNumber()).toBe(175.566305716)
  })

// See example 47.a, AA p 343.
  test('get moon equatorial coordinates', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)
    const equ = Earth.Moon.getApparentEquatorialCoordinates(jd)
    expect(equ.rightAscension.toNumber()).toBeCloseTo(134.688470 * constants.DEG2H, 6)
    expect(equ.declination.toNumber()).toBeCloseTo(13.76836663125066, 12)
  })

// See example 48.a, AA p 347.
  test('get moon radius vector', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)
    const rv = Earth.Moon.getRadiusVector(jd)
    expect(rv.toNumber()).toBeCloseTo(368409.68, 1) // km, second param is number of digits checked.
  })

// See example 48.a, AA p 347.
  test('get moon illumination fraction', () => {
    // Month is April, but JS date month is [0-11].
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)

    const sunCoords = Sun.getApparentEquatorialCoordinates(jd)
    expect(sunCoords.rightAscension.toNumber() * constants.H2DEG).toBeCloseTo(20.6579, 3)
    expect(sunCoords.declination.toNumber()).toBeCloseTo(8.6964805423441, 9)

    const moonCoords = Earth.Moon.getApparentEquatorialCoordinates(jd)
    expect(moonCoords.rightAscension.toNumber() * constants.H2DEG).toBeCloseTo(134.6885, 3)
    expect(moonCoords.declination.toNumber()).toBeCloseTo(13.7684, 3)

    const i = Earth.Moon.getPhaseAngle(jd)
    expect(i.toNumber()).toBeCloseTo(69.0756, 2)
    const k = Earth.Moon.getIlluminatedFraction(jd)
    expect(k.toNumber()).toBeCloseTo(0.6786, 3)
  })
})
