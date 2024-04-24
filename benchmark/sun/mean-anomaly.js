import * as b from 'benny'
import { Sun } from '@'

b.suite(
  'sun getMeanAnomaly',

  b.add('getMeanAnomaly', () => {
    Sun.getMeanAnomaly(2451234.56)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'sun_mean_longitude', version: '1.0.0' }),
  b.save({ file: 'sun_mean_longitude', format: 'chart.html' })
)
