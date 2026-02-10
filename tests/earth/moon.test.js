import { Earth, juliandays, Sun, times } from '@'
import { getDecimalValue } from '@/sexagesimal'
import { H2DEG, MOON_SYNODIC_PERIOD, MoonPhase, MoonPhaseQuarter } from '@/constants'
import { getTopocentricRadialVelocity } from '@/earth/moon/velocity'

describe('moon', () => {
  test('get moon mean longitude', () => {
    expect(Earth.Moon.getMeanLongitude(245123456)).toBeCloseTo(182.125250, 6)
  })

  test('get moon mean elongation', () => {
    expect(Earth.Moon.getMeanElongation(245123456)).toBeCloseTo(175.566306, 6)
  })

  test('get moon mean anomaly', () => {
    expect(Earth.Moon.getMeanAnomaly(245123456)).toBeCloseTo(343.898322, 6)
  })

  // See example 47.a, AA p 343.
  test('get moon equatorial coordinates', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)
    expect(jd).toEqual(2448724.5)

    expect(Earth.Moon.getGeocentricEclipticLongitude(jd)).toBeCloseTo(133.162_655, 6)
    expect(Earth.Moon.getGeocentricEclipticLatitude(jd)).toBeCloseTo(-3.229_126, 6)

    const equ = Earth.Moon.getApparentGeocentricEquatorialCoordinates(jd)
    expect(equ.rightAscension).toBeCloseTo(getDecimalValue(8, 58, 45.12) * H2DEG, 3)
    expect(equ.declination).toBeCloseTo(13.768_368, 4)
  })

  // See example 48.a, AA p 347.
  test('get moon radius vector', () => {
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = juliandays.getJulianDay(UTCDate)
    const rv = Earth.Moon.getRadiusVectorInKilometer(jd)
    expect(rv).toBeCloseTo(368409.68, 1) // km, second param is number of digits checked.
  })

  // See example 48.a, AA p 347.
  test('get moon illumination fraction', () => {
    // Month is April, but JS date month is [0-11].
    const UTCDate = new Date(Date.UTC(1992, 3, 12))
    const jd = times.transformUTC2TT(juliandays.getJulianDay(UTCDate))

    const sunCoords = Sun.getGeocentricEquatorialCoordinates(jd)
    expect(sunCoords.rightAscension).toBeCloseTo(20.6579, 2)
    expect(sunCoords.declination).toBeCloseTo(8.697, 3)

    const moonCoords = Earth.Moon.getGeocentricEquatorialCoordinates(jd)
    expect(moonCoords.rightAscension).toBeCloseTo(134.69, 1)
    expect(moonCoords.declination).toBeCloseTo(13.7684, 2)

    expect(Earth.Moon.getRadiusVectorInKilometer(jd)).toBeCloseTo(368409.0, 1)

    const i = Earth.Moon.getPhaseAngle(jd)
    expect(i).toBeCloseTo(69.0756, 2)
    const k = Earth.Moon.getIlluminatedFraction(jd)
    expect(k).toBeCloseTo(0.6786, 3)
  })

  // See example 49.a, AA p 353.
  test('get time of new moon', () => {
    // Mid-february
    const UTCDate = new Date(Date.UTC(1977, 1, 12))
    const T = juliandays.getJulianCentury(juliandays.getJulianDay(UTCDate))
    expect(T).toBeCloseTo(-0.228_81, 4)
    const newMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhase.New)
    expect(newMoonJD).toBeCloseTo(2443_192.941_02, 5)
  })

  // See example 49.a, AA p 353.
  test('get moon age', () => {
    const UTCDate = new Date(Date.UTC(1977, 1, 12))
    const newMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.New)
    expect(Earth.Moon.getAge(newMoonJD)).toEqual(0)
    const fqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.FirstQuarter)
    expect(Earth.Moon.getAge(fqMoonJD)).toBeCloseTo(MOON_SYNODIC_PERIOD / 4, 6)
    const fullMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.Full)
    expect(Earth.Moon.getAge(fullMoonJD)).toBeCloseTo(MOON_SYNODIC_PERIOD / 2, 5)
    const lqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.LastQuarter)
    expect(Earth.Moon.getAge(lqMoonJD)).toBeCloseTo(MOON_SYNODIC_PERIOD * 3 / 4, 5)
  })

  // See example 49.a, AA p 353.
  test('get moon age name', () => {
    const UTCDate = new Date(Date.UTC(1977, 1, 12))
    const newMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.New)
    expect(Earth.Moon.getAgeName(newMoonJD)).toEqual(MoonPhase.New)
    const fqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.FirstQuarter)
    expect(Earth.Moon.getAgeName(fqMoonJD)).toEqual(MoonPhase.FirstQuarter)
    const fullMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.Full)
    expect(Earth.Moon.getAgeName(fullMoonJD)).toEqual(MoonPhase.Full)
    const lqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.LastQuarter)
    expect(Earth.Moon.getAgeName(lqMoonJD)).toEqual(MoonPhase.LastQuarter)
  })

  test('topocentric moon radial velocity: sanity magnitude (|RV| ~< a few km/s)', () => {
    const dates = [
      new Date(Date.UTC(1992, 3, 12, 0, 0, 0)),
      new Date(Date.UTC(2017, 5, 14, 2, 0, 0)),
      new Date(Date.UTC(2023, 9, 14, 0, 0, 0)),
    ]

    const observers = [
      { longitude: 0, latitude: 0, height: 0 }, // equator, Greenwich
      { longitude: 10, latitude: 45, height: 0 }, // mid-latitude
      { longitude: -70, latitude: -30, height: 0 }, // southern mid-latitude
    ]

    for (const d of dates) {
      const jd = juliandays.getJulianDay(d)
      for (const obs of observers) {
        const rv = getTopocentricRadialVelocity(jd, obs)
        expect(Number.isFinite(rv)).toBeTruthy()
        expect(Math.abs(rv)).toBeLessThan(2.5) // very loose, but catches unit/sign/rotation bugs
      }
    }
  })

  test('topocentric moon radial velocity: height has negligible effect at km/s scale', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0, 0)))
    const base = { longitude: -70, latitude: -30, height: 0 }
    const high = { longitude: -70, latitude: -30, height: 4000 }

    const rv0 = getTopocentricRadialVelocity(jd, base)
    const rv4k = getTopocentricRadialVelocity(jd, high)

    // 4 km change in radius is tiny; difference should be way below 0.1 km/s in any sane implementation.
    expect(Math.abs(rv4k - rv0)).toBeLessThan(0.05)
  })

  test('topocentric moon radial velocity: changes with longitude (earth rotation term present)', () => {
    const jd = juliandays.getJulianDay(new Date(Date.UTC(2023, 9, 14, 0, 0, 0)))
    const obsA = { longitude: 0, latitude: 0, height: 0 }
    const obsB = { longitude: 90, latitude: 0, height: 0 }

    const rvA = getTopocentricRadialVelocity(jd, obsA)
    const rvB = getTopocentricRadialVelocity(jd, obsB)

    // Not asserting sign, just that it's not identical (if LST/longitude were ignored, they'd match).
    expect(Math.abs(rvB - rvA)).toBeGreaterThan(0.01)
  })
})
