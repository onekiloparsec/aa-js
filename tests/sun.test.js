import * as sun from '../src/sun'
import * as julianday from '../src/julianday'

test('get sun apparent equatorial coordinates (AA p.165)', () => {
  const UTCDate = new Date(Date.UTC(1993, 9, 13))
  const jd = julianday.getJulianDay(UTCDate)
  const equ = sun.apparentEquatorialCoordinates(jd)
  expect(equ.rightAscension).toBeCloseTo(13.225389, 0) // accuracy is bad, as in SwiftAA !
  expect(equ.declination).toBeCloseTo(-7.78507, 0) // accuracy is bad, as in SwiftAA !
})
