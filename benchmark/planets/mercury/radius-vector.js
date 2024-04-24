import * as b from 'benny'
import { Mercury } from '@'

export default b.suite(
  'Mercury coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Mercury.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
