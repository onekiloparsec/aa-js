import * as b from 'benny'
import { Saturn } from '@'

export default b.suite(
  'Saturn coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Saturn.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Saturn.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
