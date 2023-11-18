import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticLongitude',

  b.add('getEclipticLongitude high', () => {
    Jupiter.getEclipticLongitude(2451234.56)
  }),
  b.add('getEclipticLongitude low', () => {
    Jupiter.getEclipticLongitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
