import { constants, Earth, juliandays, Sun, times } from '@'
import { getDecimalValue } from '@/sexagesimal'
import { MOON_SYNODIC_PERIOD, MoonPhase, MoonPhaseName, MoonPhaseQuarter } from '@/constants'

describe('moon', () => {
  test('get moon mean longitude', () => {
    expect(Earth.Moon.getMeanLongitude(245123456).toNumber()).toBeCloseTo(182.1252505089, 9)
  })

  test('get moon mean elongation', () => {
    expect(Earth.Moon.getMeanElongation(245123456).toNumber()).toBeCloseTo(175.566305716, 9)
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
    const rv = Earth.Moon.getRadiusVectorInKilometer(jd)
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

    expect(Earth.Moon.getRadiusVectorInKilometer(jd).toNumber()).toBeCloseTo(368409.0, 1)

    const i = Earth.Moon.getPhaseAngle(jd)
    expect(i.toNumber()).toBeCloseTo(69.0756, 2)
    const k = Earth.Moon.getIlluminatedFraction(jd)
    expect(k.toNumber()).toBeCloseTo(0.6786, 3)
  })

  // See example 49.a, AA p 353.
  test('get time of new moon', () => {
    // Mid-february
    const UTCDate = new Date(Date.UTC(1977, 1, 12))
    const T = juliandays.getJulianCentury(juliandays.getJulianDay(UTCDate))
    expect(T.toNumber()).toBeCloseTo(-0.228_81, 4)
    const newMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhase.New)
    expect(newMoonJD.toNumber()).toBeCloseTo(2443_192.941_02, 5)
  })

  // See example 49.a, AA p 353.
  test('get moon age', () => {
    const UTCDate = new Date(Date.UTC(1977, 1, 12))
    const newMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.New)
    expect(Earth.Moon.getAge(newMoonJD).toNumber()).toEqual(0)
    const fqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.FirstQuarter)
    expect(Earth.Moon.getAge(fqMoonJD).toNumber()).toBeCloseTo(MOON_SYNODIC_PERIOD.dividedBy(4).toNumber(), 6)
    const fullMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.Full)
    expect(Earth.Moon.getAge(fullMoonJD).toNumber()).toBeCloseTo(MOON_SYNODIC_PERIOD.dividedBy(2).toNumber(), 5)
    const lqMoonJD = Earth.Moon.getTimeOfMeanPhase(juliandays.getJulianDay(UTCDate), MoonPhaseQuarter.LastQuarter)
    expect(Earth.Moon.getAge(lqMoonJD).toNumber()).toBeCloseTo(MOON_SYNODIC_PERIOD.mul(3).dividedBy(4).toNumber(), 5)
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
})
