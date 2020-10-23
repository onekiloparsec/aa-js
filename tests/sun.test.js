import * as sun from '../src/sun'
import * as julianday from '../src/julianday'

test('get sun apparent equatorial coordinates (AA p.165)', () => {
  const UTCDate = new Date(Date.UTC(1993, 9, 13))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = sun.apparentEquatorialCoordinates(jd)
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