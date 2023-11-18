import * as b from 'benny'
import * as juliandays from '@/juliandays.ts'

const jd = juliandays.getJulianDay()

b.suite(
  'juliandays',

  b.add('getLocalSiderealTime high', () => {
    juliandays.getLocalSiderealTime(jd, 10)
  }),
  b.add('getLocalSiderealTime low', () => {
    juliandays.getLocalSiderealTime(jd, 10, false)
  }),

  b.add('getJulianCentury high', () => {
    juliandays.getJulianCentury(jd)
  }),
  b.add('getJulianCentury low', () => {
    juliandays.getJulianCentury(jd, false)
  }),

  b.cycle(),
  b.complete()
)
