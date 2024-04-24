import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticCoordinates',

  b.add('getEclipticCoordinates', () => {
    Jupiter.getEclipticCoordinates(2451234.56)
  }),

  b.cycle(),
  b.complete(),
)
