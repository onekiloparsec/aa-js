import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getRadiusVector',

  b.add('getRadiusVector high', () => {
    Uranus.getRadiusVector(2451234.56)
  }),
  b.add('getRadiusVector low', () => {
    Uranus.getRadiusVector(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
