import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Jupiter.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
