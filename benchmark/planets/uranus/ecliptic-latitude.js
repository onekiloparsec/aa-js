import * as b from 'benny'
import { Uranus } from '@'

export default b.suite(
  'Uranus coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Uranus.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Uranus.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
