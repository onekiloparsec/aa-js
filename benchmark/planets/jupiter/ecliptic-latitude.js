import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Jupiter.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Jupiter.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
