import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Mercury.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Mercury.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
