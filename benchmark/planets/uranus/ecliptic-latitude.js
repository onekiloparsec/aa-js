import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Uranus.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
