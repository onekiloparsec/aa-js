import * as b from 'benny'
import { Earth } from '@'

export default b.suite(
  'Earth coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Earth.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
