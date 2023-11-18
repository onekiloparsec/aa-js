import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Mars.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Mars.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
