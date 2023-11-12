import * as b from 'benny'
import { Earth } from '@'

b.suite(
  'moon coordinates getMeanLongitude',

  b.add('getMeanLongitude high', () => {
    Earth.Moon.getMeanLongitude(245123456)
  }),
  b.add('getMeanLongitude low', () => {
    Earth.Moon.getMeanLongitude(245123456, false)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'moon_coordinates_mean_longitude', version: '1.0.0' }),
  b.save({ file: 'moon_coordinates_mean_longitude', format: 'chart.html' })
)

b.suite(
  'moon coordinates getMeanElongation',

  b.add('getMeanElongation high', () => {
    Earth.Moon.getMeanElongation(245123456)
  }),
  b.add('getMeanElongation low', () => {
    Earth.Moon.getMeanElongation(245123456, false)
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'moon_coordinates_mean_elongation', version: '1.0.0' }),
  b.save({ file: 'moon_coordinates_mean_elongation', format: 'chart.html' })
)
