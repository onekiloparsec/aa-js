import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getRadiusVector',

  b.add('getRadiusVector', () => {
    Uranus.getRadiusVector(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
