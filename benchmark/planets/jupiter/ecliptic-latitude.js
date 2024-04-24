import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticLatitude',

  b.add('getEclipticLatitude', () => {
    Jupiter.getEclipticLatitude(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
