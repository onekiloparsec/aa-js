import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Jupiter.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Jupiter.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
