import * as b from 'benny'
import { Venus } from '@'

export default b.suite(
  'Venus coordinates getEclipticLatitude',

  b.add('getEclipticLatitude high', () => {
    Venus.getEclipticLatitude(2451234.56)
  }),
  b.add('getEclipticLatitude low', () => {
    Venus.getEclipticLatitude(2451234.56, false)
  }),

  b.cycle(),
  b.complete(),
)
