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

  b.cycle(),
  b.complete(),
  b.save({ file: 'juliandays', version: '1.0.0' }),
  b.save({ file: 'juliandays', format: 'chart.html' })
)
