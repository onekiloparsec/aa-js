import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getMeanLongitude',

  b.add('getMeanLongitude high', () => {
    Earth.Moon.getMeanLongitude(245123456)
  }),
  b.add('getMeanLongitude low', () => {
    Earth.Moon.getMeanLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_mean_longitude', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_mean_longitude', format: 'chart.html' })
)
