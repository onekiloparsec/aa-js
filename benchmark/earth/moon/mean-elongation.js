import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getMeanElongation',

  b.add('getMeanElongation', () => {
    Earth.Moon.getMeanElongation(2451234.56)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_mean_elongation', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_mean_elongation', format: 'chart.html' })
)

