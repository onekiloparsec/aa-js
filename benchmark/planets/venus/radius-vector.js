import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Venus.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Venus.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
