import { constants, Earth, juliandays, Sun, times } from '@'
import { getDecimalValue } from '@/sexagesimal'

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
    expect(jd.toNumber()).toEqual(2448724.5)

    expect(Earth.Moon.getGeocentricEclipticLongitude(jd).toNumber()).toBeCloseTo(133.162_655, 6)
    expect(Earth.Moon.getGeocentricEclipticLatitude(jd).toNumber()).toBeCloseTo(-3.229_126, 6)

    const equ = Earth.Moon.getApparentGeocentricEquatorialCoordinates(jd)
    expect(equ.rightAscension.toNumber()).toBeCloseTo(getDecimalValue(8, 58, 45.12).toNumber(), 4)
    expect(equ.declination.toNumber()).toBeCloseTo(13.768_368, 4)
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
    const jd = times.transformUTC2TT(juliandays.getJulianDay(UTCDate))

    const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd)
    expect(sunCoords.rightAscension.toNumber() * constants.H2DEG).toBeCloseTo(20.6579, 2)
    expect(sunCoords.declination.toNumber()).toBeCloseTo(8.697, 3)

    const moonCoords = Earth.Moon.getGeocentricEquatorialCoordinates(jd)
    expect(moonCoords.rightAscension.toNumber() * constants.H2DEG).toBeCloseTo(134.69, 1)
    expect(moonCoords.declination.toNumber()).toBeCloseTo(13.7684, 2)

    expect(Earth.Moon.getRadiusVector(jd).toNumber()).toBeCloseTo(368409.0, 1)

    const i = Earth.Moon.getPhaseAngle(jd)
    expect(i.toNumber()).toBeCloseTo(69.067, 2)
    const k = Earth.Moon.getIlluminatedFraction(jd)
    expect(k.toNumber()).toBeCloseTo(0.6786, 3)
  })
})
