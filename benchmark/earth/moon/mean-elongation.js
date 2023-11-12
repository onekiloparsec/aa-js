import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'moon coordinates getMeanElongation',

  b.add('getMeanElongation high', () => {
    Earth.Moon.getMeanElongation(245123456)
  }),
  b.add('getMeanElongation low', () => {
    Earth.Moon.getMeanElongation(245123456, false)
  }),

  b.cycle(),
  b.complete(),
  // b.save({ file: 'moon_coordinates_mean_elongation', version: '1.0.0' }),
  // b.save({ file: 'moon_coordinates_mean_elongation', format: 'chart.html' })
)

