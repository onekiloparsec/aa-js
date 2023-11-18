import * as b from 'benny'
import { Sun } from '@'

b.suite(
  'sun getMeanAnomaly',

  b.add('getMeanAnomaly high', () => {
    Sun.getMeanAnomaly(2451234.56)
  }),
  b.add('getMeanLongitude low', () => {
    Sun.getMeanAnomaly(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'sun_mean_longitude', version: '1.0.0' }),
  b.save({ file: 'sun_mean_longitude', format: 'chart.html' })
)
