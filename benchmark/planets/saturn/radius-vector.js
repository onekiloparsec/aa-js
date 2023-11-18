import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Saturn.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Saturn.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
