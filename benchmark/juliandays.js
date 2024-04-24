import * as b from 'benny'
import * as juliandays from '@/juliandays.ts'

const jd = juliandays.getJulianDay()

b.suite(
  'juliandays',

  b.add('getLocalSiderealTime', () => {
    juliandays.getLocalSiderealTime(jd, 10)
  }),

  b.add('getJulianCentury', () => {
    juliandays.getJulianCentury(jd)
  }),

  b.cycle(),
  b.complete()
)
