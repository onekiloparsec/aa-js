import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getMeanAnomaly',

  b.add('getMeanAnomaly', () => {
    Earth.Moon.getMeanElongation(2451234.56)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_mean_anomaly', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_mean_anomaly', format: 'chart.html' })
)
