import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'Earth coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Earth.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Earth.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
