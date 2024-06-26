import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getMeanLongitude',

  b.add('getMeanLongitude', () => {
    Earth.Moon.getMeanLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_mean_longitude', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_mean_longitude', format: 'chart.html' })
)
