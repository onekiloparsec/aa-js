import * as b from 'benny'
import { Mars } from '@'

export default b.suite(
  'Mars coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Mars.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
