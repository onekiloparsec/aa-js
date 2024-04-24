import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Saturn.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
