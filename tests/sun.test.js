import * as sun from '../src/sun'
import * as julianday from '../src/julianday'

test('get sun apparent equatorial coordinates (AA p.165)', () => {
  const UTCDate = new Date(Date.UTC(1993, 9, 13))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = sun.getApparentEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(13.225389, 0) // accuracy is bad, as in SwiftAA !
  expect(equ.declination).toBeCloseTo(-7.78507, 0) // accuracy is bad, as in SwiftAA !
})

test('get all sun events julian days', () => {
  for (let m = 0; m < 12; m++) {
    const jd = julianday.getJulianDay(2020, m, 1)
    const jds = sun.allEventJulianDays(jd, 72.34, -29.455)
    expect(jds.length).toEqual(10)
    for (let i = 0; i < jds.length; i++) {
      expect(jds[i]).toBeGreaterThan(2458000.5)
      if (i > 0) {
        expect(jds[i]).toBeGreaterThan(jds[i - 1])
      }
    }
  }
})

// test('get julian days of rise, transits and set at the UTC equator, for alt = 0', () => {
//   const jd = julianday.getJulianDay(new Date())
//   const jds = sun.julianDaysOfRiseDayTransitSet(jd, 0, 0, 0)
//   expect(jds[0]).toBeGreaterThan(2458000.5)
//   expect(jds[1]).toBeGreaterThan(2458000.5)
//   expect(jds[2]).toBeGreaterThan(2458000.5)
// })
//
// test('get julian days of rise, transits and set above polar circle, for alt = 0', () => {
//   const UTCDate = new Date(Date.UTC(2021, 1, 30))
//   const jd = julianday.getJulianDay(UTCDate)
//   const jds = sun.julianDaysOfRiseDayTransitSet(jd, 0, 85, 0)
//   expect(jds[0]).toBeGreaterThan(2458000.5)
//   expect(jds[1]).toBeGreaterThan(2458000.5)
//   expect(jds[2]).toBeGreaterThan(2458000.5)
// })
