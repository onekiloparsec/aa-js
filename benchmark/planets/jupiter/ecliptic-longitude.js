import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticLongitude',

  b.add('getEclipticLongitude', () => {
    Jupiter.getEclipticLongitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
