import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Venus.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
