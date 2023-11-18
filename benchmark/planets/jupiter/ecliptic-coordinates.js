import * as b from 'benny'
import { Jupiter } from '@'

export default b.suite(
  'Jupiter coordinates getEclipticCoordinates',

  b.add('getEclipticCoordinates high', () => {
    Jupiter.getEclipticCoordinates(2451234.56)
  }),
  b.add('getEclipticCoordinates low', () => {
    Jupiter.getEclipticCoordinates(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
